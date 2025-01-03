import { useEffect, useState } from 'react';
import { DiaryEntry } from './types';
import { getAllDiaryEntries } from './services/diaryService';
import Entries from './components/Entries';
import NewEntryForm from './components/NewEntryForm';

function App() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllDiaryEntries().then((entries) => setDiaryEntries(entries));
  });

  return (
    <div>
      <NewEntryForm />
      <Entries diaryEntries={diaryEntries} />
    </div>
  );
}

export default App;
