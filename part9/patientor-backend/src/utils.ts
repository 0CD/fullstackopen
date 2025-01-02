import { NewPatient, Gender } from './types';
import { z } from 'zod';

export const NewEntrySchema = z.object({
  name: z.string().nonempty(),
  dateOfBirth: z.string().date().nonempty(),
  ssn: z.string().nonempty(),
  gender: z.nativeEnum(Gender),
  occupation: z.string().nonempty(),
});

export const toNewPatientEntry = (object: unknown): NewPatient => {
  return NewEntrySchema.parse(object);
};
