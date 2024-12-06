import { createContext, useReducer, useContext } from "react"

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return action.data
        case 'RESET_NOTIFICATION':
            return null
        default:
            return state
    }
}

const NotificationContext = createContext()

export const NotificationProvider = (props) => {
    const [notification, dispatch] = useReducer(notificationReducer, null)

    return (
        <NotificationContext.Provider value={{ notification, dispatch }}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => {
    return useContext(NotificationContext)
}

export default NotificationContext