import { useNotification } from '../contexts/NotificationContext.jsx'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const { notification } = useNotification()
  if (notification === null) {
    return null
  }

  if (notification.type === 'error') {
    return (
      <div className="notification-container">
        <Alert variant="danger">{notification.text}</Alert>
      </div>
    )
  }

  if (notification.type === 'success') {
    return (
      <div className="notification-container">
        <Alert variant="success">{notification.text}</Alert>
      </div>
    )
  }
}

export default Notification
