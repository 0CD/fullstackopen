import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS, ALL_BOOKS_BY_GENRE } from '../queries.js'

const Books = () => {
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [genres, setGenres] = useState([])

  const { loading: allBooksLoading, data: allBooksData } = useQuery(ALL_BOOKS, {
    onCompleted: (data) => {
      setGenres(
        data.allBooks.reduce((genres, book) => {
          book.genres.forEach((genre) => {
            if (!genres.includes(genre)) {
              genres.push(genre)
            }
          })
          return genres
        }, [])
      )
    },
  })

  const {
    loading: filteredBooksLoading,
    data: filteredBooksData,
    refetch,
  } = useQuery(ALL_BOOKS_BY_GENRE, {
    variables: { genre: selectedGenre },
    skip: selectedGenre === 'all',
  })

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre)
    if (genre !== 'all') {
      refetch({ genre })
    }
  }

  if (allBooksLoading || filteredBooksLoading) {
    return <div>Loading...</div>
  }

  const books =
    selectedGenre === 'all' ? allBooksData.allBooks : filteredBooksData.allBooks

  return (
    <div>
      <h2>books</h2>
      <div>
        {genres.map((genre) => (
          <button
            key={genre}
            onClick={() => {
              handleGenreChange(genre)
            }}
          >
            {genre}
          </button>
        ))}
        <button
          onClick={() => {
            handleGenreChange('all')
          }}
        >
          all genres
        </button>
      </div>

      {selectedGenre != 'all' && (
        <p>
          in genre <b>{selectedGenre}</b>
        </p>
      )}

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Books
