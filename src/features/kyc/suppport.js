import { apiSlice } from "../../services/api/jaiMaxApi";

export const supportTicketApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    /* ============================
       GET ALL SUPPORT TICKETS
       ============================ */
    getSupportTickets: builder.query({
      query: (queryParams = "") => ({
        url: `/mentee/support/get-all-tickets`,
        method: "GET",
      }),
      providesTags: ["SupportTickets"],
    }),

    /* ============================
       GET SINGLE TICKET DETAILS
       ============================ */
    getSupportTicketById: builder.query({
      query: (ticketId) => ({
        url: `/support/tickets/${ticketId}`,
        method: "GET",
      }),
    }),

    /* ============================
       UPDATE TICKET STATUS
       (Approve / Reject / Solved / On Hold)
       ============================ */
    updateTicketStatus: builder.mutation({
      query: ({ ticketId, status, adminRemark }) => ({
        url: `/support/tickets/update-status`,
        method: "POST",
        body: {
          ticketId,
          status,        // APPROVED | REJECTED | SOLVED | ON_HOLD
          adminRemark,
        },
      }),
      invalidatesTags: ["SupportTickets"],
    }),

  }),
});

export const {
  useGetSupportTicketsQuery,
  useGetSupportTicketByIdQuery,
  useUpdateTicketStatusMutation,
} = supportTicketApiSlice;
