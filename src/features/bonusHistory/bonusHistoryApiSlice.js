import { apiSlice } from "../../services/api/jaiMaxApi";


export const bonusHistoryApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        bonusHistory: builder.query({
            query: (queryParams) => ({
                url: `Admin/bonusHistory?${queryParams}`,
                method: 'GET', 
            })
        })
    })
})


export const { useBonusHistoryQuery } = bonusHistoryApiSlice;

