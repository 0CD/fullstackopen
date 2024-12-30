import { useQuery } from '@apollo/client'
import { ALL_BOOKS_BY_GENRE, ME } from '../queries'

const Recommendations = () => {
  const user = useQuery(ME)
  const favoriteGenre = user.data?.me?.favoriteGenre

  const { loading: filteredBooksLoading, data: filteredBooksData } = useQuery(
    ALL_BOOKS_BY_GENRE,
    {
      variables: { genre: favoriteGenre },
      skip: !favoriteGenre,
    }
  )

  if (filteredBooksLoading || user.loading) {
    return <div>Loading...</div>
  }

  const books = filteredBooksData.allBooks

  return (
    <div>
      <h2>Recommendations</h2>
      <p>
        Books in your favorite genre <b>{favoriteGenre}</b>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommendations
