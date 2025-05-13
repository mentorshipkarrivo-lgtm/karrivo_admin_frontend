import { apiSlice } from "../../services/api/jaiMaxApi";

export const shareHoldersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getShareHolders: builder.query({
      query: (page = 1) => ({
        url: `share-holders/get-shareholders`,
        method: "GET",
        params: { page },
      }),
      transformResponse: (response) => {
        // Return the entire response to maintain the structure
        // This preserves access to pagination data and shareholder data
        return response;
      },
      transformErrorResponse: (response) => {
        return response;
      },
      // Adding providesTags for cache invalidation if needed
      providesTags: (result) =>
        result?.success
          ? [
              ...result.data.data.map(({ username }) => ({
                type: "ShareHolders",
                id: username,
              })),
              { type: "ShareHolders", id: "LIST" },
            ]
          : [{ type: "ShareHolders", id: "LIST" }],
    }),
  }),
});

export const { useGetShareHoldersQuery } = shareHoldersApiSlice;
