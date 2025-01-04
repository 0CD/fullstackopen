import { useMatch } from 'react-router-dom';
import { Diagnosis, Entry, Patient } from '../../types';
import { useEffect, useState } from 'react';

import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';

import patientService from '../../services/patients';
import diagnosesService from '../../services/diagnoses';
import EntryDetails from './EntryDetails';
import AddEntryForm from './AddEntryForm';
import { Alert } from '@mui/material';
import axios from 'axios';

const PatientPage = () => {
  const match = useMatch('/patients/:id');
  const [patient, setPatient] = useState<Patient>();
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>();
  const [entries, setEntries] = useState<Entry[]>([]);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const patient = await patientService.getOne(match?.params.id as string);
        setPatient(patient);
        setEntries(patient.entries);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        }
      }
    };

    const fetchDiagnoses = async () => {
      try {
        const diagnoses = await diagnosesService.getAll();
        setDiagnoses(diagnoses);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        }
      }
    };

    fetchPatient().catch((e) => console.error(e));
    fetchDiagnoses().catch((e) => console.error(e));
  }, [match?.params.id]);

  return (
    <div>
      <h2 style={{ display: 'flex', alignItems: 'center' }}>
        {patient?.name}
        {patient?.gender === 'male' ? (
          <MaleIcon />
        ) : patient?.gender === 'female' ? (
          <FemaleIcon />
        ) : (
          <TransgenderIcon />
        )}
      </h2>
      <div>
        <div>ssn: {patient?.ssn}</div>
        <div>occupation: {patient?.occupation}</div>
      </div>
      {error && <Alert severity='error'>{error}</Alert>}
      {patient && (
        <AddEntryForm
          id={patient.id}
          entries={entries}
          setEntries={setEntries}
          diagnoses={diagnoses || []}
          setError={setError}
        />
      )}
      <h3>entries</h3>
      <div>
        {entries.map((entry) => (
          <EntryDetails key={entry.id} entry={entry} diagnoses={diagnoses || []} />
        ))}
      </div>
    </div>
  );
};

export default PatientPage;
