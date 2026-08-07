import { api } from "@/lib/api";

export interface Banner {
    id: string;
    text: string;
    link?: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export const bannerService = {
    async getAll(): Promise<Banner[]> {
        const response = await api.get<Banner[]>("/banners/");
        return response.data;
    },

    async getById(id: string): Promise<Banner> {
        const response = await api.get<Banner>(`/banners/${id}`);
        return response.data;
    },

    async create(data: Partial<Banner>): Promise<Banner> {
        const response = await api.post<Banner>("/banners/", data);
        return response.data;
    },

    async update(id: string, data: Partial<Banner>): Promise<Banner> {
        const response = await api.patch<Banner>(`/banners/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/banners/${id}`);
    }
};
