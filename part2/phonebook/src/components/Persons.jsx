import React from 'react'

import Person from './Person'

export const Persons = ({persons, filteredPersons, filter}) => {
    if (filter === '') {
        return (
            <div>
                {persons.map(person =>
                    <Person key={person.id} person={person}/>
                )}
            </div>
        )
    } else {
        return (
            <div>
                {filteredPersons.map(person =>
                    <Person key={person.id} person={person}/>
                )}
            </div>
        )
    }
}

export default Persons