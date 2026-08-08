import { api } from '@/lib/api';

export interface PropFirmRegistration {
    id: string;
    login_id: string;
    password?: string;
    propfirm_name: string;
    propfirm_website_link: string;
    server_name: string;
    server_type: string;
    challenges_step: number;
    propfirm_account_cost: number;
    account_size: number;
    account_phases: number;
    trading_platform: string;
    propfirm_rules: string;
    whatsapp_no: string;
    telegram_username: string;
    account_status: "pending" | "in_progress" | "passed" | "failed";
    created_at: string;
    updated_at: string;
}

export const propFirmService = {
    async getUserRegistrations(status?: string): Promise<PropFirmRegistration[]> {
        const params = status ? { status } : {};
        const response = await api.get<PropFirmRegistration[]>('/prop-firm', { params });
        return response.data;
    },

    async getRegistration(id: string): Promise<PropFirmRegistration> {
        const response = await api.get<PropFirmRegistration>(`/prop-firm/${id}`);
        return response.data;
    },

    async createRegistration(data: any): Promise<PropFirmRegistration> {
        const response = await api.post<PropFirmRegistration>('/prop-firm', data);
        return response.data;
    },

    async createWhopCheckoutLink(orderId: string): Promise<{ checkout_url: string }> {
        const response = await api.post<{ checkout_url: string }>(`/prop-firm/whop-checkout-link/${orderId}`);
        return response.data;
    },

    async updateRegistration(id: string, data: any): Promise<PropFirmRegistration> {
        const response = await api.patch<PropFirmRegistration>(`/prop-firm/${id}`, data);
        return response.data;
    }
};

