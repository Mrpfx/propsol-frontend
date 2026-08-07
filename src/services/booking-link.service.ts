import { api } from "@/lib/api";

export interface BookingLink {
    id: string;
    title: string;
    url: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export const bookingLinkService = {
    async getAll(): Promise<BookingLink[]> {
        const response = await api.get<BookingLink[]>("/booking-links/");
        return response.data;
    },

    async getById(id: string): Promise<BookingLink> {
        const response = await api.get<BookingLink>(`/booking-links/${id}`);
        return response.data;
    },

    async create(data: Partial<BookingLink>): Promise<BookingLink> {
        const response = await api.post<BookingLink>("/booking-links/", data);
        return response.data;
    },

    async update(id: string, data: Partial<BookingLink>): Promise<BookingLink> {
        const response = await api.patch<BookingLink>(`/booking-links/${id}`, data);
        return response.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/booking-links/${id}`);
    }
};
