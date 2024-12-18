import { useState } from 'react'
import useLoginMutations from '../hooks/useLoginMutations.js'
import { Form, Button } from 'react-bootstrap'

const LoginForm = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { loginMutation } = useLoginMutations()

  const handleLogin = (event) => {
    event.preventDefault()
    loginMutation.mutate({ username, password })
  }

  return (
    <Form onSubmit={handleLogin}>
      <Form.Group controlId="formUsername">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          value={username}
          name="Username"
          placeholder="Enter username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </Form.Group>
      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={password}
          name="Password"
          placeholder="Enter password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </Form.Group>
      <Button variant="dark" type="submit" className="w-100 mt-3">
        Login
      </Button>
    </Form>
  )
}

export default LoginForm
