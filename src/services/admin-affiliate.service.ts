import { api } from "@/lib/api";

export const adminAffiliateService = {
    async getDashboardStats(): Promise<any> {
        const response = await api.get("/admin/affiliates/dashboard");
        return response.data;
    },

    async getTopAffiliates(limit: number = 10): Promise<any[]> {
        const response = await api.get("/admin/affiliates/top", {
            params: { limit }
        });
        return response.data;
    },

    async getProductStats(): Promise<any> {
        const response = await api.get("/admin/affiliates/products");
        return response.data;
    },

    async getGlobalSettings(): Promise<any> {
        const response = await api.get("/admin/affiliates/settings/global");
        return response.data;
    },

    async getGlobalRates(): Promise<any[]> {
        const response = await api.get("/admin/affiliates/settings/global");
        return response.data;
    },

    async createGlobalRate(data: any): Promise<any> {
        const response = await api.post("/admin/affiliates/settings/global", data);
        return response.data;
    },

    async deleteGlobalRate(id: string): Promise<void> {
        await api.delete(`/admin/affiliates/settings/global/${id}`);
    },

    async updateGlobalSettings(data: any): Promise<any> {
        const response = await api.patch("/admin/affiliates/settings/global", data);
        return response.data;
    },

    async getAllAffiliates(): Promise<any[]> {
        const response = await api.get("/admin/affiliates/top", {
            params: { limit: 100 }
        });
        return response.data;
    },

    async getAffiliateDetails(userId: string): Promise<any> {
        const response = await api.get(`/admin/affiliates/users/${userId}`);
        return response.data;
    },

    async updateAffiliateConfig(userId: string, data: any): Promise<void> {
        await api.patch(`/admin/affiliates/users/${userId}/settings`, data);
    },

    async updateAffiliateSettings(userId: string, data: any): Promise<void> {
        await api.patch(`/admin/affiliates/users/${userId}/settings`, data);
    }
};
