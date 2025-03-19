import { createSlice } from '@reduxjs/toolkit'

const frontend = createSlice({
    name: 'frontend',
    initialState: {
        data: {}
    },
    reducers: {
        storeData: () => { 
            
        }
    }
})

export const {
    storeData
} = frontend.actions

export default frontend.reducer