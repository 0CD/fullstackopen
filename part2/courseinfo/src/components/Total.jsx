import React from 'react'

const Total = ({ parts }) => {
    const sum = parts.reduce((sum, part) => sum + part.exercises, 0)

    return (
        <p><b>Number of exercises {sum}</b></p>
    )
}

export default Total