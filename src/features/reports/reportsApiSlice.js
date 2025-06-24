// marketingReportsApiSlice.js
import { apiSlice } from "../../services/api/jaiMaxApi";

export const marketingReportsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getInactiveUsers: builder.query({
      query: () => ({
        url: `/Admin/inactive-users`,
        method: 'GET',
      })
    }),
    getUsersWithLessThanTenDirectRefs: builder.query({
      query: () => ({
        url: `/Admin/users/direct-refs/less-than-10`,
        method: 'GET',
      })
    }),
    getUsersWithLessThan10AndGreaterThan25DirectRefs: builder.query({
      query: () => ({
        url: `/Admin/users/direct-refs/less-than-25`,
        method: 'GET',
      })
    })
  })
});

export const { 
  useGetInactiveUsersQuery,
  useGetUsersWithLessThanTenDirectRefsQuery,
  useGetUsersWithLessThan10AndGreaterThan25DirectRefsQuery
} = marketingReportsApiSlice;