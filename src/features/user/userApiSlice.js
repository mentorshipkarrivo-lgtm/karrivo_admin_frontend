import { apiSlice } from "../../services/api/jaiMaxApi";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (queryParams) => ({
        url: `mentor/applications?${queryParams}`,
        method: "GET",
      }),
      providesTags: ["MentorApplications"],
    }),
    viewUser: builder.query({
      query: (userId) => ({
        url: `Admin/viewUser/${userId}`,
        method: "GET",
      }),
    }),
    blockUser: builder.mutation({
      query: (credentials) => ({
        url: "Admin/userBlock",
        method: "POST",
        body: credentials,
      }),
    }),
    sendTransaction: builder.mutation({
      query: (credentials) => ({
        url: "Admin/send_transaction_user",
        method: "POST",
        body: credentials,
      }),
    }),

    // ✅ FIXED — mentorCategory now included in request body
    approveRejectApplication: builder.mutation({
      query: ({ id, action, mentorCategory }) => ({
        url: `mentor/applications/${id}/approve-reject`,
        method: "PATCH",
        body: { action, mentorCategory }, // ← was missing mentorCategory
      }),
      invalidatesTags: ["MentorApplications"],
    }),

    // Update mentor application details
    updateMentor: builder.mutation({
      query: ({ id, data }) => ({
        url: `mentor/applications/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["MentorApplications"],
    }),
    userData: builder.query({
      query: () => ({
        url: "/user/userDetails",
        method: "GET",
      }),
      providesTags: ["updateDetails"],
    }),
    updateAddress: builder.mutation({
      query: (credentials) => ({
        url: "/user/userUpdate",
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["updateDetails"],
    }),
    changePwd: builder.mutation({
      query: (credentials) => ({
        url: "/Auth/changePassword",
        method: "POST",
        body: credentials,
      }),
    }),
    changePwdReq: builder.mutation({
      query: (credentials) => ({
        url: "/Auth/changePasswordReq",
        method: "POST",
        body: credentials,
      }),
    }),
    verify: builder.mutation({
      query: (data) => ({
        url: "/Auth/isVerify",
        method: "POST",
        body: { ...data },
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useViewUserQuery,
  useBlockUserMutation,
  useSendTransactionMutation,
  useApproveRejectApplicationMutation,
  useUpdateMentorMutation,
  useUserDataQuery,
  useUpdateAddressMutation,
  useChangePwdMutation,
  useChangePwdReqMutation,
  useVerifyMutation,
} = userApiSlice;