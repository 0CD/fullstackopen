import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../contexts/UserContext.jsx'
import blogService from '../services/blogs.js'
import { useNotification } from '../contexts/NotificationContext.jsx'
import { Button, Navbar, Nav, Container } from 'react-bootstrap'

const Header = () => {
  const { user, dispatch: userDispatch } = useUser()
  const { dispatch: notificationDispatch } = useNotification()
  const navigate = useNavigate()

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
    navigate('/')
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Bloglist
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/blogs">
              Blogs
            </Nav.Link>
            <Nav.Link as={Link} to="/users">
              Users
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {user ? (
              <>
                <Navbar.Text className="me-2">
                  {user.name || user.username} logged-in
                </Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
