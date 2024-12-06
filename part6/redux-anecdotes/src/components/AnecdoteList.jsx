import {useDispatch, useSelector} from "react-redux"
import {voteFor} from "../reducers/anecdoteReducer.js"
import {notification} from "../reducers/notificationReducer.js"

const Anecdote = ({anecdote, handleClick}) => {
    return (
        <div>
            <div>
                {anecdote.content}
            </div>
            <div>
                has {anecdote.votes}
                <button onClick={handleClick}>vote</button>
            </div>
        </div>
    )
}

const AnecdoteList = () => {
    const anecdotes = useSelector(state => {
        if (state.filter === '') {
            return state.anecdotes
        }
        return state.anecdotes.filter(a =>
            a.content.toLowerCase().includes(state.filter.toLowerCase())
        )
    })
    const dispatch = useDispatch()

    const vote = (id) => {
        // console.log('vote for', id)
        const anecdote = [...anecdotes].find(a => a.id === id)
        dispatch(voteFor(anecdote))
        dispatch(notification(`you voted for '${anecdote.content}'`, 5))
    }

    const byVotes = (a, b) => b.votes - a.votes

    return (
        <div>
            {[...anecdotes]
                .sort(byVotes)
                .map(anecdote =>
                    <Anecdote
                        key={anecdote.id}
                        anecdote={anecdote}
                        handleClick={() => vote(anecdote.id)}
                    />
                )}
        </div>
    )
}

export default AnecdoteList