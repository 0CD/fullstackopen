import React from 'react'

import Person from './Person'

export const Persons = ({persons, filteredPersons, filter, deletePerson}) => {
    if (filter === '') {
        return (
            <div>
                {persons.map(person =>
                    <Person key={person.id} person={person} deletePerson={deletePerson}/>
                )}
            </div>
        )
    } else {
        return (
            <div>
                {filteredPersons.map(person =>
                    <Person key={person.id} person={person} deletePerson={deletePerson}/>
                )}
            </div>
        )
    }
}

export default Persons