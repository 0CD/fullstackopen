import { useState } from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries.js'

const SetBirthYear = ({ loading, authors }) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [year, setYear] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (error) => {
      console.error(error.graphQLErrors[0].message)
    },
    update: (cache, response) => {
      cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
        return {
          allAuthors: allAuthors.map((author) => {
            if (author.name === response.data.editAuthor.name) {
              return {
                ...author,
                born: response.data.editAuthor.born,
              }
            }
            return author
          }),
        }
      })
    },
  })

  if (loading) return null

  const authorOptions = authors.map((author) => ({
    value: author.name,
    label: author.name,
  }))

  const submit = (event) => {
    event.preventDefault()

    editAuthor({
      variables: { name: selectedAuthor.value, setBornTo: parseInt(year, 10) },
    })

    setSelectedAuthor(null)
    setYear('')
  }

  return (
    <div>
      <h2>Set birth year</h2>
      <form onSubmit={submit}>
        <div>
          <Select
            value={selectedAuthor}
            onChange={setSelectedAuthor}
            options={authorOptions}
            placeholder="Select author"
          />
        </div>
        <div>
          year
          <input
            name="year"
            type="number"
            value={year}
            onChange={({ target }) => setYear(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

SetBirthYear.propTypes = {
  loading: PropTypes.bool.isRequired,
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      born: PropTypes.number,
    })
  ).isRequired,
}

export default SetBirthYear
