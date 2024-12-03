import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Message from "./components/Message";

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

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
      const user = await loginService.login({username, password})
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
        text: `Wrong username or password`,
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
      text: `Successfully logged out`,
      type: 'success'
    })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const loginForm = () => {
    return (
        <div>
          <form onSubmit={handleLogin}>
            <div> username <input type="text" value={username} name="Username"
                                  onChange={({target}) => setUsername(target.value)}/></div>
            <div> password <input type="password" value={password} name="Password"
                                  onChange={({target}) => setPassword(target.value)}/></div>
            <button type="submit">login</button>
          </form>
        </div>
    )
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    console.log('creating blog with', title, author, url)

    try {
      const newBlog = await blogService.create({title, author, url})

      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')

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
        text: `Error creating a blog`,
        type: 'error'
      })
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const blogForm = () => {
    return (
      <div>
        <h2>create new</h2>
        <form onSubmit={handleCreate}>
          <div>title: <input type="text" value={title} name="Title"
                             onChange={({target}) => setTitle(target.value)}/></div>
          <div>author: <input type="text" value={author} name="Author"
                              onChange={({target}) => setAuthor(target.value)}/></div>
          <div>url: <input type="text" value={url} name="URL"
                           onChange={({target}) => setUrl(target.value)}/></div>
          <button type="submit">create</button>
        </form>
      </div>
    )
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Message message={message}/>
        {loginForm()}
      </div>
    )
  }
  return (
    <div>
      <div>
        <h2>blogs</h2>
        <Message message={message}/>
        <p>{user.name || user.username} logged-in <button onClick={handleLogout}>logout</button></p>
        {blogForm()}
        {blogs.map(blog =>
            <Blog key={blog.id} blog={blog}/>
        )}
      </div>
    </div>
  )
}

export default App