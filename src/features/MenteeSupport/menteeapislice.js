// // src/features/admin/menteeSupportApiSlice.js
// import { apiSlice } from "../../services/api/jaiMaxApi";

// export const adminMenteeSupportApiSlice = apiSlice.injectEndpoints({
//     endpoints: (builder) => ({
//         // Get all mentee support tickets (Admin)
//         getAllMenteeSupportTickets: builder.query({
//             query: (queryParams = "") => ({
//                 url: `mentee/support/get-all-tickets${queryParams ? `?${queryParams}` : ''}`,
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             }),
//             providesTags: ["MenteeSupportTickets"],
//         }),

//         // Get a single mentee support ticket by ID (Admin)
//         getMenteeSupportTicketById: builder.query({
//             query: (ticketId) => ({
//                 url: `mentee/support/get-ticket/${ticketId}`,
//                 method: "GET",
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             }),
//             providesTags: (result, error, ticketId) => [
//                 { type: "MenteeSupportTickets", id: ticketId },
//             ],
//         }),

//         // Update mentee support ticket (Admin)
//         updateMenteeSupportTicket: builder.mutation({
//             query: ({ ticketId, updates }) => ({
//                 url: `mentee/support/update-ticket/${ticketId}`,
//                 method: "PATCH",
//                 body: updates,
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     "Content-Type": "application/json",
//                 },
//             }),
//             invalidatesTags: ["MenteeSupportTickets"],
//         }),

//         // Admin: Respond to mentee ticket
//         respondToMenteeTicket: builder.mutation({
//             query: ({ ticketId, response, respondedBy }) => ({
//                 url: `mentee/support/respond/${ticketId}`,
//                 method: "POST",
//                 body: { response, respondedBy },
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     "Content-Type": "application/json",
//                 },
//             }),
//             invalidatesTags: ["MenteeSupportTickets"],
//         }),
//     }),
// });

// export const {
//     useGetAllMenteeSupportTicketsQuery,
//     useGetMenteeSupportTicketByIdQuery,
//     useUpdateMenteeSupportTicketMutation,
//     useRespondToMenteeTicketMutation,
// } = adminMenteeSupportApiSlice;


// src/features/admin/menteeSupportApiSlice.js
import { apiSlice } from "../../services/api/jaiMaxApi";

export const adminMenteeSupportApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all mentee support tickets (Admin)
        getAllMenteeSupportTickets: builder.query({
            query: (queryParams = "") => ({
                url: `mentee/support/get-all-tickets${queryParams ? `?${queryParams}` : ''}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }),
            providesTags: ["MenteeSupportTickets"],
        }),

        // Get a single mentee support ticket by ID (Admin)
        getMenteeSupportTicketById: builder.query({
            query: (ticketId) => ({
                url: `mentee/support/get-ticket/${ticketId}`,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }),
            providesTags: (result, error, ticketId) => [
                { type: "MenteeSupportTickets", id: ticketId },
            ],
        }),

        // Update mentee support ticket status (Admin) — quick status change
        updateMenteeSupportTicket: builder.mutation({
            query: ({ ticketId, updates }) => ({
                url: `mentee/support/update-ticket/${ticketId}`, // ← ticketId in URL
                method: "POST",                                   // ← changed PATCH to POST
                body: updates,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["MenteeSupportTickets"],
        }),

        // Admin: Respond to mentee ticket
        respondToMenteeTicket: builder.mutation({
            query: ({ ticketId, response, respondedBy }) => ({
                url: `mentee/support/update-ticket/${ticketId}`, // ← fixed URL (was /respond/)
                method: "POST",
                body: { response, respondedBy },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json",
                },
            }),
            invalidatesTags: ["MenteeSupportTickets"],
        }),
    }),
});

export const {
    useGetAllMenteeSupportTicketsQuery,
    useGetMenteeSupportTicketByIdQuery,
    useUpdateMenteeSupportTicketMutation,
    useRespondToMenteeTicketMutation,
} = adminMenteeSupportApiSlice;