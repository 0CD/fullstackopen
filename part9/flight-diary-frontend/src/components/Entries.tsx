import { DiaryEntry } from '../types';
import Entry from './Entry';

interface EntriesProps {
  diaryEntries: DiaryEntry[];
}

const Entries = (props: EntriesProps) => {
  return (
    <div>
      <h3>Diary entries</h3>
      <div>
        {props.diaryEntries.map((entry) => (
          <Entry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export default Entries;
