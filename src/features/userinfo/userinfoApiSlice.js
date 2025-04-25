import { apiSlice } from "../services/api/jaiMaxApi";
export const userInfoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserInfo: builder.query({
      query: () => `Admin/userifo`,
      method: "POST",
    }),
  }),
});

export const { useGetUserInfoQuery } = userInfoApiSlice;
