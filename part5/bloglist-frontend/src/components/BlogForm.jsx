import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>title: <input type="text" value={title} name="Title" placeholder="Title"
          onChange={event => setTitle(event.target.value)}/></div>
        <div>author: <input type="text" value={author} name="Author" placeholder="Author"
          onChange={event => setAuthor(event.target.value)}/></div>
        <div>url: <input type="text" value={url} name="URL" placeholder="URL"
          onChange={event => setUrl(event.target.value)}/></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm