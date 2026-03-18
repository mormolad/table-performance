export interface Subscriber {
    name: string;
    id: number;
    msisdn: string;
    tariff: string;
    balance: number;
    status: 'active' | 'inactive' | 'blocked';
}

export interface ApiResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}
