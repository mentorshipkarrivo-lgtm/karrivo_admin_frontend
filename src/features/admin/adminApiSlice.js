import { apiSlice } from "../../services/api/jaiMaxApi";


export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAdminUser: builder.query({
            query: (queryParams) => ({
                url:`admin/get-admin-users?${queryParams}`,
                method: 'GET', 
            })     
        }),
        viewUser: builder.query({
            query: (userId) => ({
                url:`admin/viewUser/${userId}`,
                method: 'GET', 
            }) 
        }),
        blockUser: builder.mutation({
            query: (credentials) => ({
                url:'admin/userBlock',
                method: 'POST', 
                body: credentials,
            }) 
        }),
        sendUser: builder.mutation({
            query: (data) => ({
                url:'admin/create-admin-user',
                method: 'POST', 
                body: data,
            }) 
        }),
        editUser: builder.mutation({
            query: (data) => ({
                url:'admin/edit-admin-user',
                method: 'POST', 
                body: data,
            }) 
        }),
    })
})


export const { useGetAdminUserQuery , useViewUserQuery, useBlockUserMutation, useSendUserMutation, useEditUserMutation } = adminApiSlice;

