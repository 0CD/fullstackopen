import React from 'react'

export const Person = ({person}) => {
    return (
        <div>
            {person.name} {person.number}
        </div>
    )
}

export default Person