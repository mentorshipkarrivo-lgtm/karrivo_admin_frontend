// import { apiSlice } from "../../services/api/jaiMaxApi";

// export const menteesApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     // Get all mentees (users with mentorId == null)
//     getMentees: builder.query({
//       query: (queryParams) => ({
//         url: `/admin/mentees?${queryParams}`,
//         method: "GET",
//       }),
//       providesTags: ["Mentees"],
//     }),

//     // Get single mentee details
//     getMenteeById: builder.query({
//       query: (id) => ({
//         url: `/admin/mentees/${id}`,
//         method: "GET",
//       }),
//       providesTags: (result, error, id) => [{ type: "Mentees", id }],
//     }),

//     // Block/Unblock mentee
//     toggleBlockMentee: builder.mutation({
//       query: ({ id, isBlock }) => ({
//         url: `/admin/mentees/${id}/block`,
//         method: "PUT",
//         body: { isBlock },
//       }),
//       invalidatesTags: ["Mentees"],
//     }),

//     // Assign mentor to mentee
//     assignMentor: builder.mutation({
//       query: ({ menteeId, mentorId }) => ({
//         url: `/admin/mentees/${menteeId}/assign-mentor`,
//         method: "PUT",
//         body: { mentorId },
//       }),
//       invalidatesTags: ["Mentees"],
//     }),

//     // Delete mentee
//     deleteMentee: builder.mutation({
//       query: (id) => ({
//         url: `/admin/mentees/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Mentees"],
//     }),
//   }),
// });

// export const {
//   useGetMenteesQuery,
//   useGetMenteeByIdQuery,
//   useToggleBlockMenteeMutation,
//   useAssignMentorMutation,
//   useDeleteMenteeMutation,
// } = menteesApiSlice;



import { apiSlice } from "../../services/api/jaiMaxApi";

export const menteesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all mentees
    getMentees: builder.query({
      query: (queryParams) => ({
        url: `/admin/mentees?${queryParams}`,
        method: "GET",
      }),
      providesTags: ["Mentees"],
    }),

    // Get single mentee details
    getMenteeById: builder.query({
      query: (id) => ({
        url: `/admin/mentees/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Mentees", id }],
    }),

    // Block/Unblock mentee
    toggleBlockMentee: builder.mutation({
      query: ({ id, isBlock }) => ({
        url: `/admin/mentees/${id}/block`,
        method: "PUT",
        body: { isBlock },
      }),
      invalidatesTags: ["Mentees"],
    }),

    // Assign mentor to mentee
    assignMentor: builder.mutation({
      query: ({ menteeId, mentorId }) => ({
        url: `/admin/mentees/${menteeId}/assign-mentor`,
        method: "PUT",
        body: { mentorId },
      }),
      invalidatesTags: ["Mentees"],
    }),

    // Delete mentee
    deleteMentee: builder.mutation({
      query: (id) => ({
        url: `/admin/mentees/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Mentees"],
    }),

    // Update mentee details by ID
    updateMentee: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/mentees/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Mentees"],
    }),
  }),
});

export const {
  useGetMenteesQuery,
  useGetMenteeByIdQuery,
  useToggleBlockMenteeMutation,
  useAssignMentorMutation,
  useDeleteMenteeMutation,
  useUpdateMenteeMutation,   // ← NEW
} = menteesApiSlice;