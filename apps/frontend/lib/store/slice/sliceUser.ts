import { User } from '@ebuddy/shared';
import { createSlice, PayloadAction } from '@reduxjs/toolkit'


interface UserState {
    user: User;
    accessToken: string | null
    uid: string | null
}

const initialState: UserState = {
    uid: "",
    accessToken: "",
    user: {
        uid: "",
        displayName: "",
        email: "",
        phone: "",
        address: ""
    }
};

const sliceUser = createSlice({
    name: 'sliceUser',
    initialState,
    reducers: {
        updateData: (state, action: PayloadAction<UserState>) => {
            state.user = action.payload.user
            state.accessToken = action.payload.accessToken
            state.uid = action.payload.uid
        },
        updateUser: (state, action) => {
            state.user = action.payload
        },
        updateToken: (state, action) => {
            state.accessToken = action.payload
        },
        clearUser: (state, action) => {
            state.user = {
                uid: "",
                displayName: "",
                email: "",
                phone: "",
                address: ""
            }
            state.accessToken = ""
            state.uid = ""
        }
    }
})

export const {
    updateData, updateUser, clearUser, updateToken
} = sliceUser.actions

export default sliceUser.reducer