import { createContext, useReducer, useContext } from 'react'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return { ...action.data, timeout: action.timeout }
    case 'RESET_NOTIFICATION':
      return null
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationProvider = (props) => {
  const [notification, dispatch] = useReducer(notificationReducer, null)

  const dispatchWithTimeout = (action) => {
    if (action.type === 'SET_NOTIFICATION' && action.timeout) {
      const timeout = setTimeout(() => {
        dispatch({ type: 'RESET_NOTIFICATION' })
      }, action.timeout * 1000)
      dispatch({ ...action, timeout })
    } else {
      dispatch(action)
    }
  }

  return (
    <NotificationContext.Provider
      value={{ notification, dispatch: dispatchWithTimeout }}
    >
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  return useContext(NotificationContext)
}
