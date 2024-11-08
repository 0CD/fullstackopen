import React, {useEffect, useState} from 'react'

import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import Filter from "./components/Filter"
import personsService from "./services/persons"
import Message from "./components/Message"

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [filteredPersons, setFilteredPersons] = useState([])
    const [message, setMessage] = useState(null)

    useEffect(() => {
        personsService
            .getAll()
            .then(initialPersons => {
                setPersons(initialPersons)
                console.log('Fetched persons')
            })
            .catch(error => {
                console.log(error)
            })
    }, []);

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
        if (newName !== '' && newNumber !== '') {
            if (persons.map(person => person.name).includes(newName)) {
                if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                    const existingPerson = persons.find(person => person.name === newName)
                    const updatedPerson = {...existingPerson, number: newNumber}
                    personsService
                        .update(existingPerson.id, updatedPerson)
                        .then(returnedPerson => {
                            setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson))
                            setNewName('')
                            setNewNumber('')
                            console.log(`Updated ${returnedPerson.name}`)
                            setMessage({
                                text: `Updated ${returnedPerson.name}`,
                                type: 'success'
                            })
                            setTimeout(() => {
                                setMessage(null)
                            }, 3500)
                        })
                        .catch(error => {
                            console.log(error)
                            setMessage({
                                text: `Could not update ${existingPerson.name}. Check console for more information.`,
                                type: 'error'
                            })
                            setTimeout(() => {
                                setMessage(null)
                            }, 3500)
                        })
                }
            }
            else {
                const person = {
                    name: newName,
                    number: newNumber
                }
                personsService
                    .create(person)
                    .then(returnedPerson => {
                        setPersons(persons.concat(returnedPerson))
                        setNewName('')
                        setNewNumber('')
                        console.log(`Added ${returnedPerson.name}`)
                        setMessage({
                            text: `Added ${returnedPerson.name}`,
                            type: 'success'
                        })
                        setTimeout(() => {
                            setMessage(null)
                        }, 3500)
                    })
                    .catch(error => {
                        console.log(error)
                        setMessage({
                            text: `Could not add ${person.name}. Check console for more information.`,
                            type: 'error'
                        })
                        setTimeout(() => {
                            setMessage(null)
                        }, 3500)
                    })
            }
        }
    }

    const deletePerson = (id) => {
        const person = persons.find(person => person.id === id)
        if (window.confirm(`Delete ${person.name}?`)) {
            personsService
                .remove(id)
                .then(response => {
                    setPersons(persons.filter(person => person.id !== id))
                    console.log(`Deleted ${person.name}`)
                    setMessage({
                        text: `Deleted ${person.name}`,
                        type: 'success'
                    })
                    setTimeout(() => {
                        setMessage(null)
                    }, 3500)
                })
                .catch(error => {
                    console.log(error)
                    setMessage({
                        text: `Information of ${person.name} has already been removed from server.`,
                        type: 'error'
                    })
                    setTimeout(() => {
                        setMessage(null)
                    }, 3500)
                })
        }
    }

    return (
        <div>
            <h2>Phonebook</h2>
            <Message message={message}/>
            <Filter value={filter} onChange={handleFilterChange}/>
            <h2>Add a new</h2>
            <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange}/>
            <h2>Numbers</h2>
            <Persons persons={persons} filteredPersons={filteredPersons} filter={filter} deletePerson={deletePerson}/>
        </div>
    )
}

export default App