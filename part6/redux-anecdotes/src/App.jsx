import AnecdoteForm from "./components/AnecdoteForm.jsx";
import AnecdoteList from "./components/AnecdoteList.jsx";
import Filter from "./components/Filter.jsx";
import Notification from "./components/Notification.jsx";
import anecdoteService from "./services/anecdotes";
import {useDispatch} from "react-redux";
import {useEffect} from "react";
import {setAnecdotes} from "./reducers/anecdoteReducer.js";

const App = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        anecdoteService
            .getAll()
            .then(anecdotes => dispatch(setAnecdotes(anecdotes)))
    }, [dispatch]);

    return (
        <div>
            <Notification/>
            <h2>Anecdotes</h2>
            <Filter/>
            <AnecdoteList/>
            <AnecdoteForm/>
        </div>
    )
}

export default App