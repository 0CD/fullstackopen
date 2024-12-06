import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {getAnecdotes, updateAnecdote} from "./requests.js";
import {useNotification} from "./NotificationContext.jsx";

const App = () => {
  const queryClient = useQueryClient()
  const { dispatch } = useNotification()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (anecdote) => {
      queryClient.invalidateQueries({queryKey: ['anecdotes']})
      console.log(anecdote)
      dispatch({type: 'SET_NOTIFICATION', data: `Anecdote '${anecdote.content}' voted`})
      setTimeout(() => {
        dispatch({type: 'RESET_NOTIFICATION'})
      }, 5000)
    },
    onError: (error) => {
      dispatch({type: 'SET_NOTIFICATION', data: `${error.response.data.error}`})
      setTimeout(() => {
        dispatch({type: 'RESET_NOTIFICATION'})
      }, 5000)
    }
  })

  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    // console.log(anecdote)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 2,
    refetchOnWindowFocus: false
  })

  if (result.isLoading) {
    return <div>Loading...</div>
  }

  if (result.isError) {
    return <div>Error: {result.error.message}</div>
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
