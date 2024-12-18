import { useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Form } from 'react-bootstrap'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>Add New Blog</h2>
      <Form onSubmit={addBlog}>
        <Form.Group controlId="formTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            name="Title"
            required
            placeholder="Enter title"
            onChange={(event) => setTitle(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formAuthor">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            value={author}
            name="Author"
            required
            placeholder="Enter author"
            onChange={(event) => setAuthor(event.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formURL">
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="text"
            value={url}
            name="URL"
            required
            placeholder="Enter URL"
            onChange={(event) => setUrl(event.target.value)}
          />
        </Form.Group>
        <Button variant="dark" type="submit" className="w-100 mt-3">
          Create
        </Button>
      </Form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
}

export default BlogForm
