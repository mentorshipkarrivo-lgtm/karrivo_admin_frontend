import { apiSlice } from "../../services/api/jaiMaxApi";

export const userInfoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: (username) => ({
        url: `Admin/userinfo`,
        method: "POST",
        body: { username },
      }),

      transformResponse: (response) => {
        return response;
      },
      transformErrorResponse: (response) => {
        return response;
      },
    }),
  }),
});

export const { useGetUserInfoQuery } = userInfoApiSlice;
