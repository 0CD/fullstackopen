import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Message from './components/Message'
import LoginForm from './components/LoginForm.jsx'
import BlogForm from './components/BlogForm.jsx'
import Toggleable from './components/Toggleable.jsx'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')

    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      blogService.setToken(user.token)
      setUser(user)
    }

    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

      setMessage({
        text: `Successfully logged in as ${user.name || user.username}`,
        type: 'success'
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      console.log('Wrong credentials')
      setMessage({
        text: 'Wrong username or password',
        type: 'error'
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    blogService.setToken(null)
    setUser(null)

    setMessage({
      text: 'Successfully logged out',
      type: 'success'
    })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)

      const newBlogWithUser = { ...newBlog, user }
      setBlogs(blogs.concat(newBlogWithUser))
      blogFormRef.current.toggleVisibility()

      setMessage({
        text: `A new blog ${newBlog.title} by ${newBlog.author} added`,
        type: 'success'
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (exception) {
      console.log('Error creating')
      setMessage({
        text: 'Error creating a blog',
        type: 'error'
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const updateBlog = async (id, blogObject) => {
    try {
      const updatedBlog = await blogService.update(id, blogObject)
      setBlogs(blogs.map(blog => blog.id === id ? updatedBlog : blog))
    } catch (exception) {
      console.log('Error creating')
    }
  }

  const removeBlog = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}?`)) {
      try {
        await blogService.remove(blogObject.id)
        // console.log(blogObject)
        setBlogs(blogs.filter(blog => blog.id !== blogObject.id))

        setMessage({
          text: `A blog ${blogObject.title} by ${blogObject.author} removed`,
          type: 'success'
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      } catch (exception) {
        console.log('Error removing')
        setMessage({
          text: 'Error removing a blog',
          type: 'error'
        })
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      }
    }
  }

  const compareLikes = (a, b) => b.likes - a.likes

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Message message={message}/>
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
        />
      </div>
    )
  }
  return (
    <div>
      <div>
        <h2>blogs</h2>
        <Message message={message}/>
        <p>{user.name || user.username} logged-in <button onClick={handleLogout}>logout</button></p>
        <Toggleable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Toggleable>
        {blogs.sort(compareLikes).map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
            user={user}
          />
        )}
      </div>
    </div>
  )
}

export default App