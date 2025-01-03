import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from '../types';

const baseUrl = 'http://localhost:3000/api/diaries';

export const getAllDiaryEntries = async () => {
  return await axios.get<DiaryEntry[]>(baseUrl).then((response) => response.data);
};

export const addDiaryEntry = async (entry: NewDiaryEntry) => {
  return await axios.post<DiaryEntry>(baseUrl, entry).then((response) => response.data);
};
