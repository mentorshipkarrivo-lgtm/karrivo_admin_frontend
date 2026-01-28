// src/features/admin/mentorSupportApiSlice.js
import { apiSlice } from "../../services/api/jaiMaxApi";

export const adminMentorSupportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all mentor support tickets (Admin)
        getAllMentorSupportTickets: builder.query({
            query: (queryParams = "") => ({
                url: `admin/mentor-support/get-all-tickets${queryParams ? `?${queryParams}` : ''}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }),
            providesTags: ["MentorSupportTickets"],
        }),

        // Get a single mentor support ticket by ID (Admin)
        getMentorSupportTicketById: builder.query({
            query: (ticketId) => ({
                url: `admin/mentor-support/get-ticket/${ticketId}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }),
            providesTags: (result, error, ticketId) => [
                { type: "MentorSupportTickets", id: ticketId },
            ],
        }),

        // Update mentor support ticket (Admin)
        updateMentorSupportTicket: builder.mutation({
            query: ({ ticketId, updates }) => ({
                url: `admin/mentor-support/update-ticket/${ticketId}`,
                method: "PATCH",
                body: updates,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["MentorSupportTickets"],
        }),

        // Admin: Respond to mentor ticket
        respondToMentorTicket: builder.mutation({
            query: ({ ticketId, response, respondedBy }) => ({
                url: `admin/mentor-support/respond/${ticketId}`,
                method: "POST",
                body: { response, respondedBy },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["MentorSupportTickets"],
        }),
    }),
});

export const {
    useGetAllMentorSupportTicketsQuery,
    useGetMentorSupportTicketByIdQuery,
    useUpdateMentorSupportTicketMutation,
    useRespondToMentorTicketMutation,
} = adminMentorSupportApiSlice;