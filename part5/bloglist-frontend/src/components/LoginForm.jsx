import PropTypes from 'prop-types'

const LoginForm = (props) => {
  return (
    <div>
      <form onSubmit={props.handleLogin}>
        <div> username <input type="text" value={props.username} name="Username"
          onChange={props.handleUsernameChange}/></div>
        <div> password <input type="password" value={props.password} name="Password"
          onChange={props.handlePasswordChange}/></div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired
}

export default LoginForm