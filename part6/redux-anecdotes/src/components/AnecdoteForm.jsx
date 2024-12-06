import {useDispatch} from "react-redux";
import {createAnecdote} from "../reducers/anecdoteReducer.js";
import {notification} from "../reducers/notificationReducer.js";

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        dispatch(createAnecdote(content))
        dispatch(notification(`you added '${content}'`, 5))
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