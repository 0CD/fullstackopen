import React from 'react'
import Part from './Part'

const Content = ({ parts }) => {
    return (
        <div>
            {parts.map((part, i) => <Part key={i} part={part}/>)}
        </div>
    )
}

export default Content