import { api } from '@/lib/api';

export interface LoginResponse {
    access_token: string;
    token_type: string;
    name: string;
    email: string;
}

export const authService = {
    async login(username: string, password: string): Promise<LoginResponse> {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        const response = await api.post<LoginResponse>('/auth/login/access-token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        this.saveSession(response.data);
        return response.data;
    },

    async adminLogin(username: string, password: string): Promise<LoginResponse> {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);

        const response = await api.post<LoginResponse>('/auth/login/admin/access-token', params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (typeof window !== 'undefined') {
            localStorage.setItem('admin_access_token', response.data.access_token);
        }

        try {
            const meData = (await api.get('/admin/me')).data;
            if (typeof window !== 'undefined') {
                localStorage.setItem('admin_data', JSON.stringify(meData));
                localStorage.setItem('is_admin', 'true');
            }
        } catch (e) {
            console.error('Failed to fetch admin profile during login', e);
            if (typeof window !== 'undefined') {
                localStorage.setItem('admin_data', JSON.stringify({
                    name: response.data.name,
                    email: response.data.email,
                    roles: []
                }));
                localStorage.setItem('is_admin', 'true');
            }
        }
        return response.data;
    },

    saveSession(data: LoginResponse) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user_data', JSON.stringify({
                name: data.name,
                email: data.email
            }));
        }
    },

    saveAdminSession(data: LoginResponse) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('admin_access_token', data.access_token);
            localStorage.setItem('admin_data', JSON.stringify({
                name: data.name,
                email: data.email
            }));
        }
    },

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_data');
        }
    },

    adminLogout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('admin_access_token');
            localStorage.removeItem('admin_data');
            localStorage.removeItem('is_admin');
        }
    },

    async recoverPassword(email: string): Promise<{ msg: string }> {
        const response = await api.post<{ msg: string }>(`/auth/password-recovery/${email}`);
        return response.data;
    },

    async resetPassword(token: string, newPassword: string): Promise<{ msg: string }> {
        const response = await api.post<{ msg: string }>('/auth/reset-password', {
            token,
            new_password: newPassword,
        });
        return response.data;
    },

    async recoverAdminPassword(email: string): Promise<{ msg: string }> {
        const response = await api.post<{ msg: string }>(`/auth/admin/password-recovery/${email}`);
        return response.data;
    },

    async resetAdminPassword(token: string, newPassword: string): Promise<{ msg: string }> {
        const response = await api.post<{ msg: string }>('/auth/admin/reset-password', {
            token,
            new_password: newPassword,
        });
        return response.data;
    },

    async register(data: { email: string; name: string; password: string; referred_by?: string }): Promise<any> {
        const response = await api.post('/users', {
            email: data.email,
            name: data.name,
            password: data.password,
            Status: true,
            email_verified: false,
            referred_by: data.referred_by || undefined,
        });
        if (response.data && response.data.access_token) {
            this.saveSession(response.data);
        }
        return response.data;
    },

    async verifyEmail(token: string): Promise<{ msg: string }> {
        const response = await api.get<{ msg: string }>(`/auth/verify-email`, {
            params: { token }
        });
        return response.data;
    },

    async resendVerificationEmail(email: string): Promise<{ msg: string }> {
        const response = await api.post<{ msg: string }>(`/auth/verify-email/resend`, null, {
            params: { email }
        });
        return response.data;
    }
};
