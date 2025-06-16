import { apiSlice } from "../../services/api/jaiMaxApi";

export const excludedUsersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getExcludedUsers: builder.query({
      query: () => ({
        url: `/Admin/get-excluded-users`,
        method: "GET",
      }),
      providesTags: ["ExcludedUsers"],
    }),

    addExcludedUser: builder.mutation({
      query: (userData) => ({
        url: `/Admin//add-excluded-users`,
        method: "POST",
        body: userData, // { name, username, email }
      }),
      invalidatesTags: ["ExcludedUsers"],
    }),

    deleteExcludedUser: builder.mutation({
      query: (username) => ({
        url: `/Admin/delete-excluded-users`,
        method: "POST",
        body: { username },
      }),
      invalidatesTags: ["ExcludedUsers"],
    }),
  }),
});

export const {
  useGetExcludedUsersQuery,
  useAddExcludedUserMutation,
  useDeleteExcludedUserMutation,
} = excludedUsersApiSlice;
