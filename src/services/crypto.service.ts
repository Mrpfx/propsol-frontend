import { api } from "@/lib/api";

export interface CreateInvoiceData {
    price_amount: number;
    price_currency: string;
    pay_currency?: string;
    order_id?: string;
    order_description?: string;
    ipn_callback_url?: string;
    success_url?: string;
    cancel_url?: string;
}

export interface CreatePaymentData {
    price_amount: number;
    price_currency: string;
    pay_currency: string;
    order_id?: string;
    order_description?: string;
    ipn_callback_url?: string;
}

export interface CreateInvoiceResponse {
    invoice_url?: string;
    id?: string;
    order_id?: string;
    price_amount?: number;
    price_currency?: string;
}

export interface CreatePaymentResponse {
    payment_id?: string;
    pay_address?: string;
    pay_amount?: number;
    pay_currency?: string;
    order_id?: string;
    payment_status?: string;
}

export const cryptoService = {
    getApiStatus: async () => (await api.get("/crypto-payments/status")).data,
    getAvailableCurrencies: async () => (await api.get("/crypto-payments/currencies")).data,
    
    async getMinimumAmount(currency_from: string, currency_to?: string, is_fixed_rate = false, is_fee_paid_by_user = false) {
        const params = new URLSearchParams({
            currency_from,
            ...(currency_to && { currency_to }),
            is_fixed_rate: is_fixed_rate.toString(),
            is_fee_paid_by_user: is_fee_paid_by_user.toString()
        });
        return (await api.get(`/crypto-payments/min-amount?${params}`)).data;
    },

    async getEstimatedPrice(amount: number, currency_from: string, currency_to: string) {
        const params = new URLSearchParams({
            amount: amount.toString(),
            currency_from,
            currency_to
        });
        return (await api.get(`/crypto-payments/estimate?${params}`)).data;
    },

    async createInvoice(data: CreateInvoiceData): Promise<CreateInvoiceResponse> {
        return (await api.post<CreateInvoiceResponse>("/crypto-payments/invoice", data)).data;
    },

    async createPayment(data: CreatePaymentData): Promise<CreatePaymentResponse> {
        return (await api.post<CreatePaymentResponse>("/crypto-payments/payment", data)).data;
    },

    async getPaymentStatus(paymentId: string) {
        return (await api.get(`/crypto-payments/payment/${paymentId}`)).data;
    }
};
