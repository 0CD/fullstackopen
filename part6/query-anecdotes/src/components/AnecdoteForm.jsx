import {useMutation, useQueryClient} from "@tanstack/react-query"
import { createAnecdote } from "../requests.js"
import {useNotification} from "../NotificationContext.jsx";

const AnecdoteForm = () => {
    const queryClient = useQueryClient()
    const { dispatch } = useNotification()

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (anecdote) => {
            queryClient.invalidateQueries({queryKey: ['anecdotes']})
            // console.log(anecdote)
            dispatch({type: 'SET_NOTIFICATION', data: `Anecdote '${anecdote.content}' created`})
            setTimeout(() => {
                dispatch({type: 'RESET_NOTIFICATION'})
            }, 5000)
        },
        onError: (error) => {
            // console.error(error)
            dispatch({type: 'SET_NOTIFICATION', data: `${error.response.data.error}`})
            setTimeout(() => {
                dispatch({type: 'RESET_NOTIFICATION'})
            }, 5000)
        }
    })

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({content, votes: 0})
    // console.log(content)
}

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={addAnecdote}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
