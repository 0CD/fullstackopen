import React from 'react'

const Message = ({message}) => {
    if (message === null) {
        return null
    }

    if (message.type === 'error') {
        return (
            <div className="error">
                {message.text}
            </div>
        )
    }

    if (message.type === 'success') {
        return (
            <div className="success">
                {message.text}
            </div>
        )
    }
}

export default Message