import { NewPatient, Gender, HealthCheckRating } from './types';
import { z } from 'zod';

export const NewPatientSchema = z.object({
  name: z.string().nonempty(),
  dateOfBirth: z.string().date().nonempty(),
  ssn: z.string().nonempty(),
  gender: z.nativeEnum(Gender),
  occupation: z.string().nonempty(),
  entries: z.array(z.any()).default([]),
});

export const NewEntrySchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('Hospital'),
    description: z.string().nonempty({ message: 'Description is required' }),
    date: z.string().nonempty({ message: 'Date is required' }),
    specialist: z.string().nonempty({ message: 'Specialist name is required' }),
    diagnosisCodes: z.array(z.string()).optional(),
    discharge: z.object({
      date: z.string().nonempty({ message: 'Discharge date is required' }),
      criteria: z.string().nonempty({ message: 'Discharge criteria is required' }),
    }),
  }),
  z.object({
    type: z.literal('OccupationalHealthcare'),
    description: z.string().nonempty({ message: 'Description is required' }),
    date: z.string().nonempty({ message: 'Date is required' }),
    specialist: z.string().nonempty({ message: 'Specialist name is required' }),
    diagnosisCodes: z.array(z.string()).optional(),
    employerName: z.string().nonempty({ message: 'Employer name is required' }),
    sickLeave: z
      .object({
        startDate: z.string().nonempty({ message: 'Sick leave start date is required' }),
        endDate: z.string().nonempty({ message: 'Sick leave end date is required' }),
      })
      .optional(),
  }),
  z.object({
    type: z.literal('HealthCheck'),
    description: z.string().nonempty({ message: 'Description is required' }),
    date: z.string().nonempty({ message: 'Date is required' }),
    specialist: z.string().nonempty({ message: 'Specialist name is required' }),
    diagnosisCodes: z.array(z.string()).optional(),
    healthCheckRating: z.nativeEnum(HealthCheckRating, {
      message: `Health Check Rating  must be between 0 and 3`,
    }),
  }),
]);

export const toNewPatientEntry = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};
