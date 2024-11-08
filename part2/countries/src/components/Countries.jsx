import React from "react";

import Country from "./Country"

export const Countries = ({filteredCountries, setFilteredCountries, setFilter}) => {
    if (filteredCountries.length > 10) {
        return <div>Too many matches, specify another filter</div>;
    } else if ((filteredCountries.length < 10 && filteredCountries.length > 1) || filteredCountries.length === 0) {
        return (
            <div>
                {filteredCountries.map(country => (
                    <div key={country.name.common}>
                        {country.name.common}
                        <button onClick={() => setFilteredCountries([country])}>
                            Show
                        </button>
                    </div>
                ))}
            </div>
        )
    } else {
        const country = filteredCountries[0];
        return <Country country={country}/>
    }
}

export default Countries