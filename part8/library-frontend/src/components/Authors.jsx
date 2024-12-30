import SetBirthYear from './SetBirthYear.jsx'
import PropTypes from 'prop-types'

const Authors = ({ allAuthorsLoading, allAuthorsData }) => {
  if (allAuthorsLoading) {
    return <div>Loading...</div>
  }

  const authors = allAuthorsData.allAuthors

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((author) => (
            <tr key={author.name}>
              <td>{author.name}</td>
              <td>{author.born}</td>
              <td>{author.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SetBirthYear authors={authors} loading={allAuthorsLoading} />
    </div>
  )
}

Authors.propTypes = {
  allAuthorsLoading: PropTypes.bool.isRequired,
  allAuthorsData: PropTypes.object.isRequired,
}

Authors.defaultProps = {
  allAuthorsData: { allAuthors: [] },
}

export default Authors
