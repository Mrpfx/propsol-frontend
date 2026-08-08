import { api } from '@/lib/api';

export interface WalletSummary {
    available_balance: number;
    locked_balance: number;
    total_withdrawn: number;
    pending_withdrawals: number;
    total_earnings: number;
}

export interface EarningItem {
    id: string;
    created_at: string;
    referred_user_name?: string;
    amount: number;
    status: 'available' | 'withdrawn' | 'pending' | string;
}

export interface WithdrawalItem {
    id: string;
    created_at: string;
    amount: number;
    status: 'pending' | 'completed' | 'rejected' | string;
    payment_method?: string;
    payout_address?: string;
}

export const walletService = {
    async getBalance() {
        const response = await api.get('/wallet');
        return response.data;
    },

    async getSummary(): Promise<WalletSummary> {
        const res = (await api.get('/wallet/summary')).data || {};
        return {
            available_balance: res.available_balance ?? res.availableBalance ?? 0,
            locked_balance: res.locked_balance ?? res.lockedBalance ?? 0,
            total_withdrawn: res.total_withdrawn ?? res.totalWithdrawn ?? 0,
            pending_withdrawals: res.pending_withdrawals ?? res.pendingWithdrawals ?? 0,
            total_earnings: res.total_earnings ?? res.totalEarnings ?? res.total_earned ?? res.totalEarned ?? 0
        };
    },

    async getEarnings(): Promise<EarningItem[]> {
        const response = await api.get('/wallet/earnings');
        if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
            const data = response.data;
            if (Array.isArray(data.earnings)) return data.earnings;
            if (Array.isArray(data.items)) return data.items;
            if (Array.isArray(data.data)) return data.data;
        }
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    },

    async unlockEarning(earningId: string) {
        const response = await api.post('/wallet/earnings/unlock', { earning_id: earningId });
        return response.data;
    },

    async requestWithdrawal(payload: any) {
        const response = await api.post('/wallet/withdraw', payload);
        return response.data;
    },

    async getWithdrawals(): Promise<WithdrawalItem[]> {
        const response = await api.get('/wallet/withdrawals');
        if (response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
            const data = response.data;
            if (Array.isArray(data.withdrawals)) return data.withdrawals;
            if (Array.isArray(data.items)) return data.items;
            if (Array.isArray(data.data)) return data.data;
        }
        if (Array.isArray(response.data)) {
            return response.data;
        }
        return [];
    }
};
