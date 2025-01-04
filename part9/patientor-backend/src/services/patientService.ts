import patients from '../../data/patients';
import { Patient, PublicPatient, NewPatient, Entry, EntryWithoutId } from '../types';
import { v1 as uuid } from 'uuid';

const getAllPatients = (): Array<Patient> => {
  return patients;
};

const getOnePatient = (id: string): Patient | undefined => {
  return patients.find((patient) => patient.id === id);
};

const getPublicPatientEntries = (): Array<PublicPatient> => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatientEntry = {
    id: uuid(),
    ...entry,
    entries: entry.entries || [],
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

const addEntry = (entry: EntryWithoutId, patientId: string): Entry => {
  const patient = patients.find((p) => p.id === patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }

  const newEntry = {
    id: uuid(),
    ...entry,
  };

  patient.entries.push(newEntry);
  return newEntry;
};

export default {
  getAllPatients,
  getOnePatient,
  getPublicPatientEntries,
  addPatient,
  addEntry,
};
