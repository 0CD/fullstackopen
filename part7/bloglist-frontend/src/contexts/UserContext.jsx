import { createContext, useReducer, useContext } from 'react'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.data
    case 'RESET_USER':
      return null
    default:
      return state
  }
}

const UserContext = createContext()

export const UserProvider = (props) => {
  const [user, dispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={{ user, dispatch }}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  return useContext(UserContext)
}
