import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,


  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Custom base query to handle token refresh and retry logic.
 */
const baseQueryWithReAuth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Token refresh for 408 errors
  if (result?.error?.status === 408 || result?.error?.data?.status_code === 408) {
    console.log("Token expired, attempting refresh...");

    const refreshResult = await baseQuery(
      { url: "/Auth/refreshToken", method: "GET" },
      api,
      extraOptions
    );

    const newToken = refreshResult?.data?.data?.token;
    if (newToken) {
      localStorage.setItem("token", newToken);
      console.log("Token refreshed successfully");
      result = await baseQuery(args, api, extraOptions); // Retry original query
    } else {
      console.error("Token refresh failed, logging out");
      localStorage.clear();
      window.location.href = "/login";
      return refreshResult;
    }
  }

  // Logout on 401 unauthorized
  if (result?.error?.status === 401 || result?.error?.data?.status_code === 401) {
    console.error("Unauthorized: Logging out");
    localStorage.clear();
    window.location.href = "/login";
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "apiSlice",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getComment", "updateDetails", "getTicket", "shareholder"],
  endpoints: (builder) => ({}),
});

export const { usePrefetch } = apiSlice;
