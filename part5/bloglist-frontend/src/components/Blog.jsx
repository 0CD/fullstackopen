import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = (props) => {
  const [blog, setBlog] = useState(props.blog)
  const [visible, setVisible] = useState(false)
  const showWhenVisible = { display: visible ? '' : 'none' }
  const buttonLabel = visible ? 'hide' : 'view'

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const increaseLikes = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    props.updateBlog(blog.id, updatedBlog)
    setBlog(updatedBlog)
  }

  const removeBlog = () => {
    props.removeBlog(blog)
  }

  return (
    <div style={blogStyle} className="blog">
      <div className="blog-title-author">
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible} className="blog-details">
        <div>{blog.url}</div>
        <div>{blog.likes} <button onClick={increaseLikes}>like</button></div>
        <div>{blog.user.name}</div>
        <button onClick={removeBlog}>remove</button>
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired
}

export default Blog