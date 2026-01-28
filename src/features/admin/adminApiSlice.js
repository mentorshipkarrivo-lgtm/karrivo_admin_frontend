// icoApiSlice.js
import { apiSlice } from "../../services/api/jaiMaxApi";

export const sessionBookingApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Get all session bookings
        getSessionBookings: builder.query({
            query: (queryParams) => ({
                url: `Admin/get-session-bookings?${queryParams}`,
                method: 'GET',
            }),
            providesTags: ['SessionBookings']
        }),

        // Get single session booking by ID
        viewSessionBooking: builder.query({
            query: (bookingId) => ({
                url: `Admin/view-session-booking/${bookingId}`,
                method: 'GET',
            }),
            providesTags: (result, error, bookingId) => [
                { type: 'SessionBookings', id: bookingId }
            ]
        }),

        // Update session booking
        updateSessionBooking: builder.mutation({
            query: ({ bookingId, ...data }) => ({
                url: `Admin/update-session-booking/${bookingId}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['SessionBookings']
        }),

        // Update session status
        updateSessionStatus: builder.mutation({
            query: (credentials) => ({
                url: 'Admin/update-session-status',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['SessionBookings']
        }),

        // Update payment status
        updatePaymentStatus: builder.mutation({
            query: (credentials) => ({
                url: 'Admin/update-payment-status',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['SessionBookings']
        }),

        // Delete session booking
        deleteSessionBooking: builder.mutation({
            query: (bookingId) => ({
                url: `Admin/delete-session-booking/${bookingId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['SessionBookings']
        }),
    })
});

export const {
    useGetSessionBookingsQuery,
    useViewSessionBookingQuery,
    useUpdateSessionBookingMutation,
    useUpdateSessionStatusMutation,
    useUpdatePaymentStatusMutation,
    useDeleteSessionBookingMutation,
} = sessionBookingApiSlice;