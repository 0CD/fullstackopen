import diagnosesData from '../../data/diagnoses';
import { Diagnosis } from '../types';

const diagnoses: Array<Diagnosis> = diagnosesData;

const getAllEntries = (): Array<Diagnosis> => {
  return diagnoses;
};

export default {
  getAllEntries,
};
