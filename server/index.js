require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

const TOTAL_ROWS = 5000000;
const TARIFFS = ['Basic', 'Pro', 'Enterprise', 'Frozen'];

/**
 * Генерирует детерминированные данные для строки по индексу.
 * @param {number} index
 * @returns {object}
 */
function generateRow(index) {
  // Используем индекс для выбора тарифа (детерминированно)
  const tariff = TARIFFS[index % TARIFFS.length];
  return {
    id: index + 1,
    name: `Subscriber ${index + 1}`,
    tariff: tariff,
    balance: Math.floor((index * 137) % 10000) / 100, // Псевдослучайный баланс
    status: index % 5 === 0 ? 'Inactive' : 'Active',
    createdAt: new Date(2020, 0, 1, 0, 0, index).toISOString(),
  };
}

app.use(cors());
app.use(express.json());

const MOCK_DELAY_MS = 5000;

app.get('/api/subscribers', (req, res) => {
  const requestTime = Date.now();
  const pageOneBased = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = parseInt(req.query.limit, 10) || 50;
  const tariffFilter = typeof req.query.tariff === 'string' ? req.query.tariff : undefined;
  const rawStatus = req.query.status;
  const statusFilter =
    typeof rawStatus === 'string' && rawStatus.length > 0
      ? rawStatus
      : Array.isArray(rawStatus) && rawStatus[0]
        ? String(rawStatus[0])
        : undefined;

  console.log('[api/subscribers] query:', { page: req.query.page, limit: req.query.limit, tariff: tariffFilter, status: statusFilter });
  console.log('[status] server: принят statusFilter =', statusFilter === undefined ? 'undefined' : JSON.stringify(statusFilter));

  const data = [];
  let currentIndex = (pageOneBased - 1) * limit;
  let processedCount = 0;

  while (data.length < limit && currentIndex < TOTAL_ROWS) {
    const row = generateRow(currentIndex);

    const tariffMatch = !tariffFilter || row.tariff === tariffFilter;
    const statusMatch =
      !statusFilter ||
      (row.status && statusFilter && row.status.toLowerCase() === statusFilter.toLowerCase());
    if (tariffMatch && statusMatch) {
      data.push(row);
    }

    currentIndex++;
    processedCount++;
    if (processedCount > 10000) break;
  }

  let aborted = false;
  const timeoutId = setTimeout(() => {
    if (aborted) return;
    const statusesInResponse = [...new Set(data.map((r) => r.status))];
    console.log(`[api/subscribers] ответ: ${data.length} строк, статусы в ответе: ${statusesInResponse.join(', ') || '(нет)'}`);
    console.log('[status] server: отправка ответа,', data.length, 'строк, статусы:', statusesInResponse.join(', ') || '(нет)');
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.json({
      data: data,
      total: TOTAL_ROWS,
      hasMore: currentIndex < TOTAL_ROWS,
    });
  }, MOCK_DELAY_MS);
  req.on('aborted', () => {
    aborted = true;
    clearTimeout(timeoutId);
  });
});

app.get('/', (req, res) => {
  res.send('Server is running. Use /api/subscribers');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
