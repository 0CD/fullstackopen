import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useUser } from '../contexts/UserContext.jsx'
import { useParams } from 'react-router-dom'
import { Button, Form, Card, ListGroup } from 'react-bootstrap'

const Blog = ({ blogs, updateBlog, removeBlog, addComment }) => {
  const { user } = useUser()
  const [blog, setBlog] = useState(null)
  const [comment, setComment] = useState('')
  const { id } = useParams()

  useEffect(() => {
    if (blogs) {
      const blog = blogs.find((blog) => blog.id === id)
      setBlog(blog)
    }
  }, [blogs, id])

  if (!blogs) {
    return <div>Loading...</div>
  }

  if (!blog) {
    return <div>Blog not found</div>
  }

  const increaseLikes = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }

    updateBlog(updatedBlog)
    setBlog(updatedBlog)
  }

  const handleRemoveBlog = () => {
    removeBlog(blog)
  }

  const handleAddComment = (event) => {
    event.preventDefault()
    addComment(blog, comment)
    setComment('')
  }

  let canRemove = false
  if (blog.user && user) {
    if (blog.user.username === user.username) {
      canRemove = true
    }
  }

  return (
    <Card className="mt-3">
      <Card.Body>
        <Card.Title className="d-flex justify-content-between align-items-center">
          <span>
            {blog.title} by {blog.author}
          </span>
          {canRemove && (
            <Button variant="secondary" size="sm" onClick={handleRemoveBlog}>
              remove
            </Button>
          )}
        </Card.Title>
        <Card.Text as="div">
          <div>
            <strong>URL: </strong>
            <a href={blog.url} style={{ color: 'black' }}>
              {blog.url}
            </a>
          </div>
          <div>
            <strong>Likes: </strong>
            {blog.likes} likes{' '}
            {user && (
              <Button onClick={increaseLikes} variant="dark" size="sm">
                like
              </Button>
            )}
          </div>
          <div>
            <strong>Posted by: </strong>
            {blog.user ? blog.user.name || blog.user.username || '' : ''}
          </div>
        </Card.Text>
        <Form onSubmit={handleAddComment} className="mb-3 mt-2">
          <Form.Group controlId="formComment">
            <Form.Control
              type="text"
              value={comment}
              required
              placeholder="Add a comment"
              onChange={({ target }) => setComment(target.value)}
            />
          </Form.Group>
          <Button type="submit" variant="dark" className="w-100 mt-2">
            Add comment
          </Button>
        </Form>
        <Card.Subtitle className="mt-2 mb-2 text-muted">Comments</Card.Subtitle>
        <ListGroup variant="flush">
          {blog.comments.map((comment, index) => (
            <ListGroup.Item key={index}>{comment}</ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

Blog.propTypes = {
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  addComment: PropTypes.func.isRequired,
}

export default Blog
