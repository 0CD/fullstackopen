import { useState } from 'react'

const StatisticLine = ({text, value}) => {
    if (text === 'Positive') {
        return (
            <tr>
                <td>{text}</td>
                <td>{value}%</td>
            </tr>
        )
    } else {
        return (
            <tr>
                <td>{text}</td>
                <td>{value}</td>
            </tr>
        )
    }
}

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>


const Statistics = (props) => {
    const { good, neutral, bad } = props
    const total = good + neutral + bad
    const average = (good - bad) / total
    const positive = good / total * 100

    if (total === 0 ) {
        return (
            <div>
                <h1>Statistics</h1>
                <p>No feedback given</p>
            </div>
        )
    }
    else {
        return (
            <div>
                <h1>Statistics</h1>
                <table>
                    <tbody>
                        <StatisticLine text='Good' value={good}/>
                        <StatisticLine text='Neutral' value={neutral}/>
                        <StatisticLine text='Bad' value={bad}/>
                        <StatisticLine text='Total' value={total}/>
                        <StatisticLine text='Average' value={average}/>
                        <StatisticLine text='Positive' value={positive}/>
                    </tbody>
                </table>
            </div>
        )
    }
}

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const handleGoodClick = () => setGood(good + 1)
    const handleNeutralClick = () => setNeutral(neutral + 1)
    const handleBadClick = () => setBad(bad + 1)

    return (
        <div>
            <h1>Give feedback</h1>
            <Button onClick={handleGoodClick} text='Good'/>
            <Button onClick={handleNeutralClick} text='Neutral'/>
            <Button onClick={handleBadClick} text='Bad'/>

            <Statistics good={good} neutral={neutral} bad={bad}/>
        </div>
    )
}

export default App