import { useMutation } from '@tanstack/react-query'
import loginService from '../services/login.js'
import { useUser } from '../contexts/UserContext.jsx'
import { useNotification } from '../contexts/NotificationContext.jsx'

const useLoginMutations = () => {
  const { dispatch: userDispatch } = useUser()
  const { dispatch: notificationDispatch } = useNotification()

  const loginMutation = useMutation({
    mutationFn: loginService.login,
    onSuccess: (user) => {
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      userDispatch({ type: 'SET_USER', data: user })
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        data: {
          text: `Successfully logged in as ${user.name || user.username}`,
          type: 'success',
        },
        timeout: 5,
      })
    },
    onError: () => {
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        data: {
          text: 'Wrong username or password',
          type: 'error',
        },
        timeout: 5,
      })
    },
  })

  return {
    loginMutation,
  }
}

export default useLoginMutations
