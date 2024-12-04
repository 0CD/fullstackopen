import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

describe('BlogForm component', () => {
  const newBlog = {
    title: 'Test new blog title',
    author: 'Test new blog author',
    url: 'https://testnewurl.com'
  }

  const mockAddBlog = vi.fn()

  test('adds a new blog with correct details', async () => {
    render(<BlogForm createBlog={mockAddBlog} />)

    const user = userEvent.setup()

    const titleInput = screen.getByPlaceholderText('Title')
    await user.type(titleInput, newBlog.title)

    const authorInput = screen.getByPlaceholderText('Author')
    await user.type(authorInput, newBlog.author)

    const urlInput = screen.getByPlaceholderText('URL')
    await user.type(urlInput, newBlog.url)

    const createButton = screen.getByText('create')
    await user.click(createButton)

    // console.log(mockAddBlog.mock.calls)
    expect(mockAddBlog.mock.calls).toHaveLength(1)
    expect(mockAddBlog.mock.calls[0][0]).toEqual(newBlog)
  })
})
