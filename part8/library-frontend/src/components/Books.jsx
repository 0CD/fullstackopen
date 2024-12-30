import { useQuery } from '@apollo/client'
import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { ALL_BOOKS_BY_GENRE } from '../queries.js'

const Books = ({ allBooksLoading, allBooksData }) => {
  const [selectedGenre, setSelectedGenre] = useState('all')
  const [genres, setGenres] = useState([])

  useEffect(() => {
    if (allBooksData) {
      setGenres(
        allBooksData.allBooks.reduce((genres, book) => {
          book.genres.forEach((genre) => {
            if (!genres.includes(genre)) {
              genres.push(genre)
            }
          })
          return genres
        }, [])
      )
    }
  }, [allBooksData])

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

Books.propTypes = {
  allBooksLoading: PropTypes.bool.isRequired,
  allBooksData: PropTypes.object,
}

export default Books
