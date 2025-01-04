import { useState } from 'react';
import { Diagnosis, Entry, entryType, EntryWithoutId, HealthCheckRating } from '../../types';
import patientsService from '../../services/patients';
import axios from 'axios';
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import { addSpacesBeforeCapitalLetters } from '../../utils';

interface Props {
  id: string;
  entries: Entry[];
  setEntries: (entries: Entry[]) => void;
  diagnoses: Diagnosis[];
  setError: (message: string | null) => void;
}

const AddEntryForm = (props: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [type, setType] = useState<entryType>('Hospital' as entryType);
  const [dischargeDate, setDischargeDate] = useState('');
  const [dischargeCriteria, setDischargeCriteria] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(0);

  const healthCheckRatingOptions = Object.keys(HealthCheckRating)
    .filter((key) => !isNaN(Number(key)))
    .map((key) => Number(key));

  const resetFields = () => {
    setDescription('');
    setDate('');
    setSpecialist('');
    setDiagnosisCodes([]);
    setDischargeDate('');
    setDischargeCriteria('');
    setEmployerName('');
    setSickLeaveStartDate('');
    setSickLeaveEndDate('');
    setHealthCheckRating(0);
  };

  const handleAddEntry = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    let newEntry: EntryWithoutId | undefined = undefined;
    const diagnosisCodesOrUndefined = diagnosisCodes.length > 0 ? diagnosisCodes : undefined;

    switch (type) {
      case 'Hospital':
        newEntry = {
          type: type,
          description,
          date,
          specialist,
          diagnosisCodes: diagnosisCodesOrUndefined,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          },
        };
        break;
      case 'OccupationalHealthcare':
        newEntry = {
          type: type,
          description,
          date,
          specialist,
          diagnosisCodes: diagnosisCodesOrUndefined,
          employerName,
          sickLeave: {
            startDate: sickLeaveStartDate,
            endDate: sickLeaveEndDate,
          },
        };
        break;
      case 'HealthCheck':
        newEntry = {
          type: type,
          description,
          date,
          specialist,
          diagnosisCodes: diagnosisCodesOrUndefined,
          healthCheckRating,
        };
        break;
      default:
        throw new Error(`Unhandled entry type: ${type}`);
    }
    if (newEntry) {
      try {
        await patientsService
          .addEntry(props.id, newEntry)
          .then((response) => props.setEntries([...props.entries, response]));
        resetFields();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          props.setError(error.response?.data.error[0].message || 'An error occurred');
          setTimeout(() => props.setError(null), 5000);
        }
      }
    }
  };

  return (
    <div style={{ border: '1px solid black', padding: '1em', margin: '1em 0' }}>
      <h3>New entry</h3>
      <form onSubmit={handleAddEntry}>
        <TextField
          style={{ marginBottom: '0.5em' }}
          label='Description'
          type='text'
          fullWidth
          value={description}
          onChange={({ target }) => setDescription(target.value)}
        />
        <TextField
          style={{ marginBottom: '0.5em' }}
          label='Date'
          type='date'
          fullWidth
          value={date}
          onChange={({ target }) => setDate(target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          style={{ marginBottom: '0.5em' }}
          label='Specialist'
          type='text'
          fullWidth
          value={specialist}
          onChange={({ target }) => setSpecialist(target.value)}
        />
        <Select
          style={{ marginBottom: '0.5em' }}
          fullWidth
          multiple
          value={diagnosisCodes}
          displayEmpty
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <span style={{ color: 'gray' }}>Diagnoses</span>;
            }
            return (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            );
          }}
          onChange={({ target }) => setDiagnosisCodes(target.value as string[])}
        >
          <MenuItem disabled value=''>
            <em>Diagnoses</em>
          </MenuItem>
          {props.diagnoses.map((diagnosis) => (
            <MenuItem key={diagnosis.code} value={diagnosis.code}>
              {diagnosis.code} {diagnosis.name}
            </MenuItem>
          ))}
        </Select>
        <Select
          style={{ marginBottom: '0.5em' }}
          fullWidth
          value={type}
          onChange={({ target }) => setType(target.value as entryType)}
        >
          <MenuItem disabled value=''>
            <em>Type</em>
          </MenuItem>
          {Object.values(entryType).map((type) => (
            <MenuItem key={type} value={type}>
              {addSpacesBeforeCapitalLetters(type)}
            </MenuItem>
          ))}
        </Select>
        {type === 'Hospital' && (
          <div>
            <TextField
              style={{ marginBottom: '0.5em' }}
              label='Discharge date'
              type='date'
              fullWidth
              value={dischargeDate}
              onChange={({ target }) => setDischargeDate(target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              style={{ marginBottom: '0.5em' }}
              label='Discharge criteria'
              type='text'
              fullWidth
              value={dischargeCriteria}
              onChange={({ target }) => setDischargeCriteria(target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        )}
        {type === 'OccupationalHealthcare' && (
          <div>
            <TextField
              style={{ marginBottom: '0.5em' }}
              label='Employer name'
              type='text'
              fullWidth
              value={employerName}
              onChange={({ target }) => setEmployerName(target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              style={{ marginBottom: '0.5em' }}
              label='Sick leave start date'
              type='date'
              fullWidth
              value={sickLeaveStartDate}
              onChange={({ target }) => setSickLeaveStartDate(target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              style={{ marginBottom: '0.5em' }}
              label='Sick leave end date'
              type='date'
              fullWidth
              value={sickLeaveEndDate}
              onChange={({ target }) => setSickLeaveEndDate(target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </div>
        )}
        {type === 'HealthCheck' && (
          <div>
            <FormControl>
              <FormLabel>Health Check Rating</FormLabel>
              <RadioGroup
                style={{ marginBottom: '0.5em' }}
                row
                value={healthCheckRating}
                onChange={({ target }) => setHealthCheckRating(Number(target.value))}
              >
                {healthCheckRatingOptions.map((option) => (
                  <FormControlLabel
                    key={option}
                    value={option}
                    control={<Radio />}
                    label={addSpacesBeforeCapitalLetters(HealthCheckRating[option])}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        )}

        <Button type='submit' fullWidth variant='contained'>
          Add entry
        </Button>
      </form>
    </div>
  );
};

export default AddEntryForm;
