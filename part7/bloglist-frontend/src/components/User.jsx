import { Link, useParams } from 'react-router-dom'
import { Card, ListGroup } from 'react-bootstrap'

const User = ({ users }) => {
  const { id } = useParams()

  if (!users) {
    return <div>Loading...</div>
  }

  const user = users.find((user) => user.id === id)

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title>{user.name}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Blogs</Card.Subtitle>
        <ListGroup variant="flush">
          {user.blogs.map((blog) => (
            <ListGroup.Item key={blog.id}>
              <Link to={`/blogs/${blog.id}`} style={{ color: 'black' }}>
                {blog.title}
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default User
