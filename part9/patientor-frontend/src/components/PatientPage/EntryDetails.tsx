import {
  Diagnosis,
  Entry,
  HealthCheckEntry,
  HealthCheckRating,
  HospitalEntry,
  OccupationalHealthcareEntry,
} from '../../types';
import { addSpacesBeforeCapitalLetters } from '../../utils';

const assertNever = (value: never): never => {
  throw new Error(`Unhandled discriminated union member: ${JSON.stringify(value)}`);
};

const HospitalEntryDetails = ({ entry }: { entry: HospitalEntry }) => {
  return (
    <div>
      <div>Discharge: {entry.discharge?.date}</div>
      <div>Reason for discharge: {entry.discharge?.criteria} </div>
    </div>
  );
};

const OccupationalHealthcareEntryDetails = ({ entry }: { entry: OccupationalHealthcareEntry }) => {
  return (
    <div>
      <div>Employer: {entry.employerName}</div>
      {entry.sickLeave && (
        <div>
          Sick leave: from {entry.sickLeave?.startDate} to {entry.sickLeave?.endDate}
        </div>
      )}
    </div>
  );
};

const HealthCheckEntryDetails = ({ entry }: { entry: HealthCheckEntry }) => {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        Health check rating: {addSpacesBeforeCapitalLetters(HealthCheckRating[entry.healthCheckRating])}
      </div>
    </div>
  );
};

const EntryDetails = ({ entry, diagnoses }: { entry: Entry; diagnoses: Diagnosis[] }) => {
  return (
    <div style={{ border: '1px solid black', padding: '1em', margin: '1em 0' }}>
      <div>{entry.date}</div>
      <div>{entry.description}</div>
      {entry.diagnosisCodes && (
        <div>
          <h4>Diagnoses</h4>
          <ul>
            {entry.diagnosisCodes?.map((code) => (
              <li key={code}>
                {code} {diagnoses.find((d) => d.code === code)?.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      {(() => {
        switch (entry.type) {
          case 'Hospital':
            return <HospitalEntryDetails entry={entry} />;
          case 'OccupationalHealthcare':
            return <OccupationalHealthcareEntryDetails entry={entry} />;
          case 'HealthCheck':
            return <HealthCheckEntryDetails entry={entry} />;
          default:
            return assertNever(entry);
        }
      })()}
      <div>Diagnose by {entry.specialist}</div>
    </div>
  );
};

export default EntryDetails;
