import axios, { type GenericAbortSignal } from 'axios';
import type { ApiResponse, Subscriber } from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const fetchSubscribers = async (
    page: number,
    limit: number = 100,
    tariff?: string,
    status?: string,
    signal?: GenericAbortSignal
): Promise<ApiResponse<Subscriber>> => {
    try {
        const params = { page, limit };
        if (tariff != null && tariff !== '') params.tariff = tariff;
        if (status != null && status !== '') params.status = status;
        console.log('[status] api.fetchSubscribers: params =', params);
        const response = await axios.get(`${API_BASE_URL}/subscribers`, {
            params,
            signal,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('Request canceled:', error.message);
        } else {
            console.error('Error fetching subscribers:', error);
        }
        throw error;
    }
};
