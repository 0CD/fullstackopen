import {useDispatch} from "react-redux";
import {createAnecdote} from "../reducers/anecdoteReducer.js";
import {resetNotification, setNotification} from "../reducers/notificationReducer.js";
import anecdoteService from "../services/anecdotes"

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        const newAnecdote = await anecdoteService.create(content)
        dispatch(createAnecdote(newAnecdote))
        dispatch(setNotification(`you added '${newAnecdote.content}'`))
        setTimeout(() => {
            dispatch(resetNotification(''))
        }, 5000)
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <input name="anecdote"/>
                <button name="submit">create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm