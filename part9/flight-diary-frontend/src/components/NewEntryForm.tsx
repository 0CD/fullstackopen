import { useState } from 'react';
import { NewDiaryEntry } from '../types';
import { addDiaryEntry } from '../services/diaryService';
import axios from 'axios';

// I hate how radio buttons look so I changed them to dropdown menus
// sorry for this

const NewEntryForm = () => {
  const [date, setDate] = useState<string>('');
  const [weather, setWeather] = useState<string>('');
  const [visibility, setVisibility] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    const newEntry: NewDiaryEntry = {
      date,
      weather,
      visibility,
      comment,
    };

    try {
      await addDiaryEntry(newEntry);

      setDate('');
      setWeather('');
      setVisibility('');
      setComment('');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || 'An error occurred');
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  return (
    <div>
      <h3>Add new entry</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          Date
          <input type='date' name='date' value={date} onChange={(event) => setDate(event.target.value)} />
        </div>
        <div>
          Weather
          <select name='weather' value={weather} onChange={(event) => setWeather(event.target.value)}>
            <option disabled value=''>
              Select...
            </option>
            <option value='sunny'>Sunny</option>
            <option value='rainy'>Rainy</option>
            <option value='cloudy'>Cloudy</option>
            <option value='stormy'>Stormy</option>
            <option value='windy'>Windy</option>
          </select>
        </div>
        <div>
          Visibility
          <select name='visibility' value={visibility} onChange={(event) => setVisibility(event.target.value)}>
            <option disabled value=''>
              Select...
            </option>
            <option value='great'>Great</option>
            <option value='good'>Good</option>
            <option value='ok'>Ok</option>
            <option value='poor'>Poor</option>
          </select>
        </div>
        <div>
          Comment
          <input name='comment' value={comment} onChange={(event) => setComment(event.target.value)} />
        </div>
        <button type='submit'>Add</button>
      </form>
    </div>
  );
};

export default NewEntryForm;
