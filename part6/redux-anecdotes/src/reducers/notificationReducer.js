import { createSlice } from "@reduxjs/toolkit"

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        setNotification(state, action) {
            return action.payload
        },
        resetNotification() {
            return null
        }
    }
})

export const notification = (message, time) => {
    return async dispatch => {
        dispatch(setNotification(message))
        setTimeout(() => {
            dispatch(resetNotification())
        }, time * 1000)
    }
}

export const { setNotification, resetNotification } = notificationSlice.actions
export default notificationSlice.reducer