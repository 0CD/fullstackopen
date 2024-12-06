import AnecdoteForm from "./components/AnecdoteForm.jsx";
import AnecdoteList from "./components/AnecdoteList.jsx";
import Filter from "./components/Filter.jsx";
import Notification from "./components/Notification.jsx";

const App = () => {

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