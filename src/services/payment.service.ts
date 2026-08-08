import { api } from '@/lib/api';

export interface Payment {
    id: string;
    card_name: string;
    card_number: string; // Should be masked in real app response usually
    card_expiry_date: string;
    card_type: string;
    amount: number; // Assuming amount is part of payment
    status: string;
    created_at: string;
}

export interface PaymentCreate {
    card_name: string;
    card_number: string;
    card_expiry_date: string;
    card_type: string;
    card_cvv: string;
}

export const paymentService = {
    async createPayment(data: PaymentCreate): Promise<Payment> {
        const response = await api.post<Payment>('/payments', data);
        return response.data;
    },

    async getUserPayments(): Promise<Payment[]> {
        const response = await api.get<Payment[]>('/payments');
        return response.data;
    },

    async getPayment(id: string): Promise<Payment> {
        const response = await api.get<Payment>(`/payments/${id}`);
        return response.data;
    }
};
