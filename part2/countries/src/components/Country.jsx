import React, {useState} from "react";
import axios from "axios";

const Country = ({country}) => {
    const [weather, setWeather] = useState([])

    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${import.meta.env.VITE_OPEN_WEATHER_MAP_API_KEY}&units=metric`)
        .then(response => {
            setWeather(response.data)
        })
        .catch(error => {
            console.log(error)
        })

    if (weather.length === 0) {
        return (
            <div>
                <h1>{country.name.common}</h1>
                <div>capital {country.capital[0]}</div>
                <div>area {country.area}</div>
                <h3>languages:</h3>
                <ul>
                    {Object.entries(country.languages).map(([key, value]) => (
                        <li key={key}>{value}</li>
                    ))}
                </ul>
                <img src={country.flags.png} alt={`${country.name.common} flag`} width="200"/>
            </div>
        )
    } else {
        return (
            <div>
                <h1>{country.name.common}</h1>
                <div>capital {country.capital[0]}</div>
                <div>area {country.area}</div>
                <h3>languages:</h3>
                <ul>
                    {Object.entries(country.languages).map(([key, value]) => (
                        <li key={key}>{value}</li>
                    ))}
                </ul>
                <img src={country.flags.png} alt={`${country.name.common} flag`} width="200"/>
                <h1>Weather in {country.name.common}</h1>
                <div>temperature {weather.main.temp} °C</div>
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather icon"/>
                <div>wind {weather.wind.speed} m/s</div>
            </div>
        )
    }
}

export default Country