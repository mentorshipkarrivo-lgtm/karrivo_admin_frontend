import { apiSlice } from "../../services/api/jaiMaxApi";

export const referralApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRef: builder.query({
    query: (queryParams) => ({
        url:`Admin/AdminReport?${queryParams}`,
        method: "GET",
    })
    }),
  }),
});


export const { useGetRefQuery } = referralApiSlice;
