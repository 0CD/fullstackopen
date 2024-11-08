import React, {useEffect, useState} from 'react'
import axios from 'axios'

import Filter from './components/Filter'
import Countries from './components/Countries'

function App() {
    const [countries, setCountries] = useState([])
    const [filteredCountries, setFilteredCountries] = useState([])
    const [filter, setFilter] = useState('')

    useEffect(() => {
        axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then(response => {
                setCountries(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [])

    useEffect(() => {
        const filtered = countries.filter(country =>
            country.name.common.toLowerCase().includes(filter.toLowerCase())
        )
        setFilteredCountries(filtered)
    }, [filter])

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    return (
        <div>
            <Filter value={filter} onChange={handleFilterChange} />
            <Countries
                filteredCountries={filteredCountries}
                setFilteredCountries={setFilteredCountries}
                setFilter={setFilter}
            />
        </div>
    )
}

export default App;
