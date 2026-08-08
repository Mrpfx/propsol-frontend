import { api } from "@/lib/api";

export interface Plan {
    id: string;
    name: string;
    description?: string;
    price: number;
    created_at?: string;
}

export const planService = {
    async getAllPlans(): Promise<Plan[]> {
        const res = await api.get<any>("/plans");
        const data = res.data;
        return Array.isArray(data) ? data : data && "items" in data ? data.items : [];
    },

    async createPlan(data: Partial<Plan>): Promise<Plan> {
        const res = await api.post<Plan>("/plans", data);
        return res.data;
    },

    async updatePlan(id: string, data: Partial<Plan>): Promise<Plan> {
        const res = await api.patch<Plan>(`/plans/${id}`, data);
        return res.data;
    },

    async deletePlan(id: string): Promise<void> {
        await api.delete(`/plans/${id}`);
    }
};
