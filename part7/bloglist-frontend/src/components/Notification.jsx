import PropTypes from 'prop-types'
import { useNotification } from '../contexts/NotificationContext.jsx'

const Notification = () => {
  const { notification } = useNotification()
  if (notification === null) {
    return null
  }

  if (notification.type === 'error') {
    return <div className="error">{notification.text}</div>
  }

  if (notification.type === 'success') {
    return <div className="success">{notification.text}</div>
  }
}

export default Notification
