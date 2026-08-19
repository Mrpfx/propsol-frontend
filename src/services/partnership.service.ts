import { api } from '@/lib/api';
import { PropFirmRegistration } from './prop-firm.service';

export interface PartnershipRegistration extends PropFirmRegistration {
    admin_notes?: string;
    user_name?: string;
    user_email?: string;
}

export interface PartnershipPlanPrice {
    id?: string;
    plan_id?: string;
    account_size: number;
    price: number;
    account_size_display: string;
}

export interface PartnershipPlan {
    id: string;
    slug: string;
    name: string;
    subtitle?: string;
    description?: string;
    account_type?: string;
    benefits?: string[];
    is_popular?: boolean;
    highlight_text?: string;
    prices: PartnershipPlanPrice[];
}

export const partnershipService = {
    // Pricing Plan Endpoints
    async getPartnershipPlans(): Promise<PartnershipPlan[]> {
        const response = await api.get<PartnershipPlan[]>('/partnership-plans');
        return response.data;
    },

    async getPartnershipPlan(id: string): Promise<PartnershipPlan> {
        const response = await api.get<PartnershipPlan>(`/partnership-plans/${id}`);
        return response.data;
    },

    async updatePartnershipPlan(id: string, data: Partial<PartnershipPlan>): Promise<PartnershipPlan> {
        const response = await api.put<PartnershipPlan>(`/partnership-plans/${id}`, data);
        return response.data;
    },

    // User endpoints
    async getUserPartnerships(status?: string): Promise<PartnershipRegistration[]> {
        const params = status ? { status } : {};
        const response = await api.get<PartnershipRegistration[]>('/partnership/my-accounts', { params });
        return response.data;
    },

    async getPartnership(id: string): Promise<PartnershipRegistration> {
        const response = await api.get<PartnershipRegistration>(`/partnership/${id}`);
        return response.data;
    },

    async createPartnership(data: Partial<PartnershipRegistration>): Promise<PartnershipRegistration> {
        const response = await api.post<PartnershipRegistration>('/partnership/register', data);
        return response.data;
    },

    async updatePartnership(id: string, data: Partial<PartnershipRegistration>): Promise<PartnershipRegistration> {
        const response = await api.patch<PartnershipRegistration>(`/partnership/${id}`, data);
        return response.data;
    },

    // Admin endpoints
    async getAdminPartnerships(status?: string): Promise<PartnershipRegistration[]> {
        const params = status ? { status } : {};
        const response = await api.get<PartnershipRegistration[]>('/partnership/admin/all', { params });
        return response.data;
    },

    async updateAdminPartnership(id: string, data: Partial<PartnershipRegistration>): Promise<PartnershipRegistration> {
        const response = await api.put<PartnershipRegistration>(`/partnership/admin/${id}`, data);
        return response.data;
    },

    async deleteAdminPartnership(id: string): Promise<{ message: string }> {
        const response = await api.delete<{ message: string }>(`/partnership/admin/${id}`);
        return response.data;
    }
};
