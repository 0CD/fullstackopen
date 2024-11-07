import React, {useState} from 'react'

import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456', id: 1 },
        { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
        { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
        { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [filteredPersons, setFilteredPersons] = useState([])

    const handleNameChange = (event) => {
        // console.log(event.target.value)
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        // console.log(event.target.value)
        setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
        // console.log(event.target.value)
        setFilter(event.target.value)
        const filtered = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
        setFilteredPersons(filtered)
        // console.log(filtered)
    }

    const addPerson = (event) => {
        event.preventDefault()
        const person = {
            name: newName,
            number: newNumber,
            id: persons.length + 1
        }
        if (newName !== '' && newNumber !== '') {
            if (persons.map(person => person.name).includes(newName)) {
                alert(`${newName} is already added to phonebook`)
            }
            else {
                setPersons(persons.concat(person))
                setNewName('')
                setNewNumber('')
            }
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Filter value={filter} onChange={handleFilterChange}/>
            <h2>Add a new</h2>
            <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
            <h2>Numbers</h2>
            <Persons persons={persons} filteredPersons={filteredPersons} filter={filter}/>
        </div>
    )
}

export default App