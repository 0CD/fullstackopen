import { Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useApolloClient, useQuery, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommendations from './components/Recommendations'
import { BOOK_ADDED, ALL_BOOKS, ALL_AUTHORS } from './queries'
import { updateCache } from './utils/cacheHelper'

const App = () => {
  const { loading: allAuthorsLoading, data: allAuthorsData } =
    useQuery(ALL_AUTHORS)
  const { loading: allBooksLoading, data: allBooksData } = useQuery(ALL_BOOKS)
  const [token, setToken] = useState(null)
  const navigate = useNavigate()
  const client = useApolloClient()

  useEffect(() => {
    const token = localStorage.getItem('library-user-token')
    if (token) {
      setToken(token)
    }
  }, [setToken])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded
      window.alert(`New book added: ${addedBook.title}`)

      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })

  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    navigate('/')
  }

  return (
    <div>
      <div>
        <button onClick={() => navigate('/')}>authors</button>
        <button onClick={() => navigate('/books')}>books</button>
        {token ? (
          <>
            <button onClick={() => navigate('/add')}>add book</button>
            <button onClick={() => navigate('/recommendations')}>
              recommend
            </button>
            <button onClick={handleLogout}>logout</button>
          </>
        ) : (
          <button onClick={() => navigate('/login')}>login</button>
        )}
      </div>

      <Routes>
        <Route
          path="/"
          element={
            <Authors
              allAuthorsData={allAuthorsData}
              allAuthorsLoading={allAuthorsLoading}
            />
          }
        />
        <Route
          path="/books"
          element={
            <Books
              allBooksData={allBooksData}
              allBooksLoading={allBooksLoading}
            />
          }
        />
        <Route path="/add" element={<NewBook />} />
        <Route path="/recommendations" element={<Recommendations />} />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
      </Routes>
    </div>
  )
}

export default App
