// import { apiSlice } from "../../services/api/jaiMaxApi";

// export const userBusinessRefsApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getUserBusinessDirectRefs: builder.mutation({
//       query: (username) => ({
//         url: `/Admin/user-business-directrefs`,
//         method: "POST",
//         body: { username },
//       }),
//     }),
//   }),
// });

// export const { useGetUserBusinessDirectRefsMutation } =
//   userBusinessRefsApiSlice;

import { apiSlice } from "../../services/api/jaiMaxApi";

export const userBusinessRefsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserBusinessDirectRefs: builder.mutation({
      query: (username) => ({
        url: `/Admin/user-business-directrefs`,
        method: "POST",
        body: { username },
      }),
    }),
    getUserBusinessRefsExcluding: builder.mutation({
      query: ({
        username,
        excludedDirectRefs,
        excludedChainRefs,
        fromDate,
        toDate,
      }) => ({
        url: `/Admin/user-business-selected-dates-excluding-requested-directrefs`,
        method: "POST",
        body: {
          username,
          excludedDirectRefs,
          excludedChainRefs,
          fromDate,
          toDate,
        },
      }),
    }),
  }),
});

export const {
  useGetUserBusinessDirectRefsMutation,
  useGetUserBusinessRefsExcludingMutation,
} = userBusinessRefsApiSlice;
