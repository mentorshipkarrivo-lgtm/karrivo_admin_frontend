
import {apiSlice} from "../../services/api/jaiMaxApi"

export const dashboardApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDetails: builder.query({
            query: () => ({
                url: 'Admin/dashboard_details',
                method: 'GET', 
            })
        })
    })
})

export const {useGetDetailsQuery} = dashboardApiSlice;