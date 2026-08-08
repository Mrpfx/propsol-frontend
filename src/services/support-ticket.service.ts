import { api } from "@/lib/api";

export interface TicketMessage {
    id: string;
    ticket_id: string;
    sender_id?: string;
    sender_type: 'user' | 'admin';
    message: string;
    content?: string;
    created_at: string;
}

export interface SupportTicket {
    id: string;
    subject: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    user_id?: string;
    user_name?: string;
    user_email?: string;
    created_at: string;
    updated_at?: string;
    messages?: TicketMessage[];
}

export const supportTicketService = {
    // User Methods
    async createTicket(data: { subject: string; message: string; priority?: string }): Promise<SupportTicket> {
        const res = await api.post<SupportTicket>("/support/tickets", data);
        return res.data;
    },

    async getUserTickets(): Promise<SupportTicket[]> {
        const res = await api.get<any>("/support/tickets");
        const data = res.data;
        return Array.isArray(data) ? data : data && "items" in data ? data.items : [];
    },

    async getTicketById(id: string): Promise<SupportTicket> {
        const res = await api.get<SupportTicket>(`/support/tickets/${id}`);
        return res.data;
    },

    async sendMessage(ticketId: string, message: string): Promise<TicketMessage> {
        const res = await api.post<TicketMessage>(`/support/tickets/${ticketId}/messages`, { message });
        return res.data;
    },

    // Admin Methods
    async getAllTickets(params?: any): Promise<SupportTicket[]> {
        const res = await api.get<any>("/support/admin/tickets", { params });
        const data = res.data;
        return Array.isArray(data) ? data : data && "items" in data ? data.items : [];
    },

    async getAdminTicketById(id: string): Promise<SupportTicket> {
        const res = await api.get<SupportTicket>(`/support/admin/tickets/${id}`);
        return res.data;
    },

    async replyToTicket(id: string, message: string): Promise<TicketMessage> {
        const res = await api.post<TicketMessage>(`/support/admin/tickets/${id}/messages`, { message });
        return res.data;
    },

    async updateTicketStatus(id: string, status: string): Promise<SupportTicket> {
        const res = await api.patch<SupportTicket>(`/support/admin/tickets/${id}/status`, { status });
        return res.data;
    }
};

export interface SupportMessage {
    id: string;
    name: string;
    email: string;
    phone?: string;
    message: string;
    created_at: string;
}

export const supportMessageService = {
    async createMessage(data: { name: string; email: string; phone?: string; message: string }): Promise<SupportMessage> {
        const res = await api.post<SupportMessage>("/support", data);
        return res.data;
    },

    async getAllMessages(skip: number = 0, limit: number = 100): Promise<SupportMessage[]> {
        const res = await api.get<any>("/support", { params: { skip, limit } });
        const data = res.data;
        return Array.isArray(data) ? data : data && "items" in data ? data.items : [];
    }
};
