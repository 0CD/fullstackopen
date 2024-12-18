import { useUser } from '../contexts/UserContext.jsx'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const UserList = ({ users, isLoading }) => {
  const { user } = useUser()

  if (!user || !users) {
    return null
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th></th>
          <th>Blogs created</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>
              <Link
                to={`/users/${user.id}`}
                style={{ color: 'black' }}
                className="text-decoration-none"
              >
                <strong>{user.name || user.username}</strong>
              </Link>
            </td>
            <td>{user.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default UserList
