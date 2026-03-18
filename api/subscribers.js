const TOTAL_ROWS = 5000000;
const TARIFFS = ['Basic', 'Pro', 'Enterprise', 'Frozen'];
const MOCK_DELAY_MS = 5000;

function generateRow(index) {
  const tariff = TARIFFS[index % TARIFFS.length];
  return {
    id: index + 1,
    name: `Subscriber ${index + 1}`,
    tariff: tariff,
    balance: Math.floor((index * 137) % 10000) / 100,
    status: index % 5 === 0 ? 'Inactive' : 'Active',
    createdAt: new Date(2020, 0, 1, 0, 0, index).toISOString(),
  };
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = (req, res) => {
  setCors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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

  setTimeout(() => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.status(200).json({
      data,
      total: TOTAL_ROWS,
      hasMore: currentIndex < TOTAL_ROWS,
    });
  }, MOCK_DELAY_MS);
};
