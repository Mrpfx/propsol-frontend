import { api } from "@/lib/api";

export interface PlanPrice {
    id?: string;
    plan_id?: string;
    account_size: number;
    price: number;
    account_size_display: string;
}

export interface Plan {
    id: string;
    slug: string;
    name: string;
    subtitle?: string;
    description?: string;
    benefits?: string[];
    is_popular?: boolean;
    highlight_text?: string;
    prices: PlanPrice[];
}

export const planService = {
    async getAllPlans(): Promise<Plan[]> {
        const res = await api.get<Plan[]>("/plans");
        const data = res.data;
        return Array.isArray(data) ? data : [];
    },

    async updatePlan(id: string, data: Partial<Plan>): Promise<Plan> {
        const res = await api.put<Plan>(`/plans/${id}`, data);
        return res.data;
    }
};
