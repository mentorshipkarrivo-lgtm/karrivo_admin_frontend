import { apiSlice } from "../../services/api/jaiMaxApi";

export const walletApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    transList: builder.query({
      query: (queryParams) => ({
        url: `/wallet/transactions-admin?${queryParams}`,
        method: "GET",
      }),
      providesTags: ["getTdetails"],
    }),
    allTransList: builder.query({
      query: (queryParams) => ({
        url: `/wallet/all-transactions?${queryParams}`,
        method: "GET",
      }),
      providesTags: ["getTdetails"],
    }),

    transUpdate: builder.mutation({
      query: (credentials) => ({
        url: `/wallet/updateStatus`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["getTdetails"],
    }),

    transAmountUpdate: builder.mutation({
      query: (credentials) => ({
        url: `/wallet/updateTransaction`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["getTdetails"],
    }),

    getkycDetails: builder.query({
      query: (id) => {
        // console.log('Request ID:', id);
        return {
          url: `kyc/KycStatus/${id}`,
          method: "GET",
        };
      },
    }),

    // getkycDetails: builder.query({

    //   query: (id) => ({
    //     url: `kyc/KycStatus/${id}`,
    //     method: "GET",
    //   }),
    // }),
  }),
});

export const {
  useTransListQuery,
  useTransUpdateMutation,
  useGetkycDetailsQuery,
  useTransAmountUpdateMutation,
  useAllTransListQuery,
} = walletApiSlice;
