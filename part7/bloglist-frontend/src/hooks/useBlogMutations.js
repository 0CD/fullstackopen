import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotification } from '../contexts/NotificationContext.jsx'
import { useNavigate } from 'react-router-dom'

const useBlogMutations = () => {
  const queryClient = useQueryClient()
  const { dispatch: notificationDispatch } = useNotification()
  const navigate = useNavigate()

  // BLOG MUTATIONS
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

  const addCommentMutation = useMutation({
    mutationFn: ({ blogObject, comment }) =>
      blogService.addComment(blogObject, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs'])
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        data: {
          text: 'Comment added',
          type: 'success',
        },
        timeout: 5,
      })
    },
    onError: () => {
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        data: {
          text: 'Error adding a comment',
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
      navigate('/blogs')
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        data: {
          text: 'Blog removed',
          type: 'success',
        },
        timeout: 5,
      })
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

  return {
    addBlogMutation,
    addCommentMutation,
    updateBlogMutation,
    removeBlogMutation,
  }
}

export default useBlogMutations
