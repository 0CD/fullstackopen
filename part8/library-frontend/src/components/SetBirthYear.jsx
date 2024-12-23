import { useState } from 'react'
import Select from 'react-select'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR } from '../queries.js'

const SetBirthYear = ({ loading, authors }) => {
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [year, setYear] = useState('')

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
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

export default SetBirthYear
