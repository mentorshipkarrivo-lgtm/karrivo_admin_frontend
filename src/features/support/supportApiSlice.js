import { apiSlice } from "../../services/api/jaiMaxApi";

export const supportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // Create a new support ticket
        createSupportTicket: builder.mutation({
            query: (ticketData) => ({
                url: "mentee/support/create-ticket",
                method: "POST",
                body: {
                    username: ticketData.username,
                    subject: ticketData.subject,
                    category: ticketData.category,
                    priority: ticketData.priority,
                    description: ticketData.description,
                    status: "pending",
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["SupportTickets"],
        }),

        // Get all support tickets for a specific user
        getSupportTickets: builder.query({
            query: (userId) => ({
                url: `mentee/support/get-tickets/${userId}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }),
            providesTags: ["SupportTickets"],
        }),

        // Get a single ticket by ID
        getSupportTicketById: builder.query({
            query: (ticketId) => ({
                url: `mentee/support/get-ticket/${ticketId}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }),
            providesTags: (result, error, ticketId) => [
                { type: "SupportTickets", id: ticketId },
            ],
        }),

        // Get all support tickets (Admin)
        getAllSupportTickets: builder.query({
            query: (queryParams = "") => ({
                url: `mentee/support/get-all-tickets${queryParams ? `?${queryParams}` : ''}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }),
            providesTags: ["SupportTickets"],
        }),

        // Update a support ticket (Admin)
        updateSupportTicket: builder.mutation({
            query: ({ ticketId, updates }) => ({
                url: `mentee/support/update-ticket/${ticketId}`,
                method: "PATCH",
                body: updates,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["SupportTickets"],
        }),

    }),
});

export const {
    useCreateSupportTicketMutation,
    useGetSupportTicketsQuery,
    useGetSupportTicketByIdQuery,
    useGetAllSupportTicketsQuery,
    useUpdateSupportTicketMutation,
} = supportApiSlice;








