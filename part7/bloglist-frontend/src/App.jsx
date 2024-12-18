import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification.jsx'
import LoginForm from './components/LoginForm.jsx'
import BlogForm from './components/BlogForm.jsx'
import Toggleable from './components/Toggleable.jsx'
import { useNotification } from './contexts/NotificationContext.jsx'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUser } from './contexts/UserContext.jsx'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { user, dispatch: userDispatch } = useUser()
  const { dispatch: notificationDispatch } = useNotification()
  const blogFormRef = useRef()
  const queryClient = useQueryClient()

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')

    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', data: user })
    }
  }, [userDispatch])

  // USER HANDLERS
  const handleLogin = async (event) => {
    event.preventDefault()
    // console.log('logging in with', username, password)

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))

      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', data: user })
      setUsername('')
      setPassword('')

      notificationDispatch({
        type: 'SET_NOTIFICATION',
        data: {
          text: `Successfully logged in as ${user.name || user.username}`,
          type: 'success',
        },
        timeout: 5,
      })
    } catch (exception) {
      // console.log('Wrong credentials')
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        data: {
          text: 'Wrong username or password',
          type: 'error',
        },
        timeout: 5,
      })
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    blogService.setToken(null)
    userDispatch({ type: 'RESET_USER' })

    notificationDispatch({
      type: 'SET_NOTIFICATION',
      data: {
        text: 'Successfully logged out',
        type: 'success',
      },
      timeout: 5,
    })
  }

  // BLOG MUTATIONS
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
  })

  const addBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (newBlog) => {
      queryClient.invalidateQueries(['blogs'])
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        data: {
          text: `A new blog ${newBlog.title} by ${newBlog.author} added`,
          type: 'success',
        },
        timeout: 5,
      })
    },
    onError: () => {
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        data: {
          text: 'Error creating a blog',
          type: 'error',
        },
        timeout: 5,
      })
    },
  })

  const updateBlogMutation = useMutation({
    mutationFn: blogService.update,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
    },
    onError: () => {
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        data: {
          text: 'Error updating a blog',
          type: 'error',
        },
        timeout: 5,
      })
    },
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
    },
    onError: () => {
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        data: {
          text: 'Error removing a blog',
          type: 'error',
        },
        timeout: 5,
      })
    },
  })

  // BLOG HANDLERS
  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    addBlogMutation.mutate(blogObject)
  }

  const updateBlog = async (blogObject) => {
    updateBlogMutation.mutate(blogObject)
  }

  const removeBlog = async (blogObject) => {
    if (
      window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}?`)
    ) {
      removeBlogMutation.mutate(blogObject)
    }
  }

  const compareLikes = (a, b) => b.likes - a.likes

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification />
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
  if (isLoading) {
    return (
      <div>
        <div>
          <h2>blogs</h2>
          <Notification />
          <p>
            {user.name || user.username} logged-in{' '}
            <button onClick={handleLogout}>logout</button>
          </p>
          <p>Loading...</p>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div>
        <h2>blogs</h2>
        <Notification />
        <p>
          {user.name || user.username} logged-in{' '}
          <button onClick={handleLogout}>logout</button>
        </p>
        <Toggleable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Toggleable>
        {blogs.sort(compareLikes).map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            removeBlog={removeBlog}
            user={user}
          />
        ))}
      </div>
    </div>
  )
}

export default App
