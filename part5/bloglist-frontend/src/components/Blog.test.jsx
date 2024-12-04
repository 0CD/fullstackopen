import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

describe('Blog component', () => {
  const blog = {
    title: 'Test blog title',
    author: 'Test blog author',
    url: 'https://testurl.com',
    likes: 5,
    user: {
      name: 'Test user'
    }
  }

  const mockUpdateBlog = vi.fn()
  const mockRemoveBlog = vi.fn()

  test('renders title and author but not url and likes by default', () => {
    const { container } = render(<Blog blog={blog} updateBlog={mockUpdateBlog} removeBlog={mockRemoveBlog} />)

    const titleAndAuthor = container.querySelector('.blog-title-author')
    expect(titleAndAuthor).not.toHaveStyle('display: none')

    const blogDetails = container.querySelector('.blog-details')
    expect(blogDetails).toHaveStyle('display: none')
  })

  test('renders url and likes when view button is clicked', async () => {
    const { container } = render(<Blog blog={blog} updateBlog={mockUpdateBlog} removeBlog={mockRemoveBlog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const blogDetails = container.querySelector('.blog-details')
    expect(blogDetails).not.toHaveStyle('display: none')
  })

  test('like button is clicked twice', async () => {
    render(<Blog blog={blog} updateBlog={mockUpdateBlog} removeBlog={mockRemoveBlog} />)

    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    // console.log(mockUpdateBlog.mock.calls)
    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })
})
