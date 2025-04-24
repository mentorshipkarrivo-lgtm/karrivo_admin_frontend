import { apiSlice } from "../../services/api/jaiMaxApi";


export const buyHistoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        buyHistory: builder.query({
            query: (queryParams) => ({
                url: `order/buyHistory?${queryParams}`,
                method: 'GET', 
            })
        })
    })
})


export const { useBuyHistoryQuery } = buyHistoryApiSlice;

