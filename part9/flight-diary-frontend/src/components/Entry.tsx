import { DiaryEntry } from '../types';

interface EntryProps {
  entry: DiaryEntry;
}

const Entry = (props: EntryProps) => {
  return (
    <div>
      <h4>{props.entry.date}</h4>
      <div>Visibility: {props.entry.visibility}</div>
      <div>Weather: {props.entry.weather}</div>
    </div>
  );
};

export default Entry;
