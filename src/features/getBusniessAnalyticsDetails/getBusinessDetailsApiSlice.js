// businessDetailsApiSlice.js
import { apiSlice } from "../../services/api/jaiMaxApi";

export const businessDetailsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessDetailsByDate: builder.mutation({
      query: (payload) => ({
        url: `/Admin/two-dates`,
        method: 'POST',
        body: payload,
      })
    })
  })
});

export const { useGetBusinessDetailsByDateMutation } = businessDetailsApiSlice;