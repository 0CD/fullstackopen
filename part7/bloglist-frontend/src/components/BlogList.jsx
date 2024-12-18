import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const BlogList = ({ blogs, isLoading }) => {
  const compareLikes = (a, b) => b.likes - a.likes

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  if (!blogs) {
    return null
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Table striped bordered hover className="mt-3">
      <tbody>
        {blogs.sort(compareLikes).map((blog) => (
          <tr key={blog.id}>
            <td>
              <Link
                to={`/blogs/${blog.id}`}
                style={{ color: 'black' }}
                className="text-decoration-none"
              >
                <strong>{blog.title}</strong>{' '}
                <span className="text-muted">{blog.author}</span>
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default BlogList
