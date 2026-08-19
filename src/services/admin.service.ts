import { api } from '@/lib/api';
import { User } from './user.service';
import { PropFirmRegistration } from './prop-firm.service';

export interface Admin {
    id: string;
    email: string;
    name: string;
    Status: boolean;
    email_verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface AdminCreate {
    email: string;
    name: string;
    password: string;
    security_code: string;
    Status?: boolean;
    email_verified?: boolean;
}

export interface AdminStats {
    [key: string]: any;
}

export interface UserUpdate {
    email?: string;
    name?: string;
    password?: string;
    Status?: boolean;
    email_verified?: boolean;
    referred_by?: string;
}

export interface UserPurchasedPackageCreate {
    package_name: string;
    amount: number;
    status?: string;
    user_id: string;
}

export interface UserPurchasedPackageRead {
    package_name: string;
    amount: number;
    status: string;
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export const adminService = {
    async createAdmin(data: AdminCreate): Promise<Admin> {
        const response = await api.post<Admin>('/admin', data);
        return response.data;
    },

    async getAdmins(): Promise<Admin[]> {
        const response = await api.get<Admin[]>('/admin');
        return response.data;
    },

    async updateAdmin(adminId: string, data: Partial<Admin> & { roles?: string[]; password?: string }): Promise<Admin> {
        const response = await api.put<Admin>(`/admin/${adminId}`, data);
        return response.data;
    },

    async deleteAdmin(adminId: string): Promise<Admin> {
        const response = await api.delete<Admin>(`/admin/${adminId}`);
        return response.data;
    },

    async getMe(): Promise<Admin> {
        const response = await api.get<Admin>('/admin/me');
        return response.data;
    },

    async getStats(): Promise<AdminStats> {
        const response = await api.get<AdminStats>('/admin/stats');
        return response.data;
    },

    async getUsers(): Promise<User[]> {
        const response = await api.get<User[]>('/admin/users');
        return response.data;
    },

    async updateUser(userId: string, data: UserUpdate): Promise<User> {
        const response = await api.put<User>(`/admin/users/${userId}`, data);
        return response.data;
    },

    async getPropFirmRegistrations(status?: string): Promise<PropFirmRegistration[]> {
        // NOTE: The OpenAPI spec says /admin/prop-firms for reading prop firms as admin
        // The previous implementation used /prop-firm with status param, which might be the user endpoint.
        // We will use the admin endpoint.
        const response = await api.get<PropFirmRegistration[]>('/admin/prop-firms');
        return response.data;
    },

    async updatePropFirmRegistration(id: string, data: Partial<PropFirmRegistration>): Promise<PropFirmRegistration> {
        const response = await api.put<PropFirmRegistration>(`/admin/prop-firm/${id}`, data);
        return response.data;
    },

    async getTransactions(): Promise<any[]> {
        const response = await api.get<any[]>('/admin/transactions');
        return response.data;
    },

    async assignPackageToUser(data: UserPurchasedPackageCreate): Promise<UserPurchasedPackageRead> {
        const response = await api.post<UserPurchasedPackageRead>('/admin/packages', data);
        return response.data;
    },

    async getPayments(): Promise<any[]> {
        const response = await api.get<any[]>('/admin/payments');
        return response.data;
    },

    async diagnosePayment(data: { provider: string; identifier: string; force_sync?: boolean }): Promise<any> {
        const response = await api.post<any>('/admin/payments/diagnose', data);
        return response.data;
    },

    async getDiscountCodes(): Promise<any[]> {
        const response = await api.get<any[]>('/discounts/discounts');
        return response.data;
    },

    async createDiscountCode(data: any): Promise<any> {
        const response = await api.post<any>('/discounts/discounts', data);
        return response.data;
    },

    async getVats(): Promise<any[]> {
        const response = await api.get<any[]>('/discounts/vat');
        return response.data;
    },

    async createVat(data: any): Promise<any> {
        const response = await api.post<any>('/discounts/vat', data);
        return response.data;
    },

    async getNotifications(): Promise<any[]> {
        const response = await api.get<any[]>('/notifications/admin/notifications');
        return response.data;
    },
};
