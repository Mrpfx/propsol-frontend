import { api } from "@/lib/api";

export interface AffiliateDashboardStats {
    total_earnings_paid: number;
    total_pending_earnings: number;
    total_signups: number;
    total_referral_volume: number;
    active_affiliates_count: number;
    conversion_rate: number;
}

export interface GlobalSettings {
    default_commission_rate: number;
    minimum_withdrawal_amount: number;
    is_program_enabled: boolean;
}

export interface AffiliateUser {
    user_id: string;
    name: string;
    email?: string;
    referral_code: string;
    total_referrals: number;
    total_earnings: number;
    pending_earnings?: number;
    paid_earnings?: number;
    current_commission_rate?: number;
    is_enabled?: boolean;
    custom_rate?: number | null;
}

export const adminAffiliateService = {
    async getDashboardStats(): Promise<AffiliateDashboardStats> {
        const response = await api.get<AffiliateDashboardStats>("/admin/affiliates/dashboard");
        return response.data;
    },

    async getGlobalSettings(): Promise<GlobalSettings> {
        const response = await api.get<GlobalSettings>("/admin/affiliates/settings/global");
        return response.data;
    },

    async updateGlobalSettings(data: Partial<GlobalSettings>): Promise<GlobalSettings> {
        const response = await api.patch<GlobalSettings>("/admin/affiliates/settings/global", data);
        return response.data;
    },

    async getAllAffiliates(): Promise<AffiliateUser[]> {
        const response = await api.get<AffiliateUser[]>("/admin/affiliates/top", {
            params: { limit: 100 }
        });
        return response.data;
    },

    async getTopAffiliates(limit: number = 10): Promise<AffiliateUser[]> {
        const response = await api.get<AffiliateUser[]>("/admin/affiliates/top", {
            params: { limit }
        });
        return response.data;
    },

    async getAffiliateDetails(userId: string): Promise<AffiliateUser> {
        const response = await api.get<AffiliateUser>(`/admin/affiliates/users/${userId}`);
        return response.data;
    },

    async updateAffiliateConfig(userId: string, data: { custom_rate?: number | null; is_enabled?: boolean }): Promise<void> {
        await api.patch(`/admin/affiliates/users/${userId}/settings`, data);
    }
};
