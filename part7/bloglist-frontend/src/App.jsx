import { useEffect, useRef } from 'react'
import blogService from './services/blogs'
import { useQuery } from '@tanstack/react-query'
import { useUser } from './contexts/UserContext.jsx'
import userService from './services/users.js'
import useBlogMutations from './hooks/useBlogMutations.js'
import { Navigate, Route, Routes } from 'react-router-dom'
import Notification from './components/Notification.jsx'
import LoginForm from './components/LoginForm.jsx'
import Header from './components/Header.jsx'
import Toggleable from './components/Toggleable.jsx'
import BlogForm from './components/BlogForm.jsx'
import BlogList from './components/BlogList.jsx'
import UserList from './components/UserList.jsx'
import User from './components/User.jsx'
import Blog from './components/Blog.jsx'

const App = () => {
  const { user, dispatch: userDispatch } = useUser()
  const blogFormRef = useRef()

  const {
    addBlogMutation,
    addCommentMutation,
    updateBlogMutation,
    removeBlogMutation,
  } = useBlogMutations()

  const { data: blogs, blogsIsLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    enabled: !!user,
  })

  const { data: users, usersIsLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
    enabled: !!user,
  })

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      blogService.setToken(user.token)
      userDispatch({ type: 'SET_USER', data: user })
    }
  }, [userDispatch])

  // BLOG HANDLERS
  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    addBlogMutation.mutate(blogObject)
  }

  const addComment = async (blogObject, comment) => {
    addCommentMutation.mutate({ blogObject, comment })
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

  return (
    <div>
      <Header />
      <Notification />

      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={
              user === null ? (
                <div>
                  <LoginForm />
                </div>
              ) : (
                <Navigate to="/blogs" />
              )
            }
          />
          <Route
            path={'/blogs'}
            element={
              <div>
                <h2>Blogs</h2>
                {user && (
                  <Toggleable buttonLabel="new blog" ref={blogFormRef}>
                    <BlogForm createBlog={addBlog} />
                  </Toggleable>
                )}
                <BlogList blogs={blogs} isLoading={blogsIsLoading} />
              </div>
            }
          />
          <Route
            path={'/users'}
            element={
              <div>
                <h2>Users</h2>
                <UserList users={users} isLoading={usersIsLoading} />
              </div>
            }
          />
          <Route
            path={'/users/:id'}
            element={
              <div>
                <h2>Users</h2>
                <User users={users} />
              </div>
            }
          />
          <Route
            path={'/blogs/:id'}
            element={
              <div>
                <h2>Blogs</h2>
                <Blog
                  blogs={blogs}
                  updateBlog={updateBlog}
                  removeBlog={removeBlog}
                  addComment={addComment}
                />
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  )
}
export default App
