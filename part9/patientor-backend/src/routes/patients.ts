import express, { Request, Response, NextFunction } from 'express';
import patientsService from '../services/patientService';
import { NewEntrySchema, NewPatientSchema } from '../utils';
import { z } from 'zod';
import { NewPatient, Patient } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientsService.getPublicPatientEntries());
});

router.get('/:id', (req, res) => {
  const patient = patientsService.getOnePatient(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.sendStatus(404);
  }
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.post('/', newPatientParser, (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
  const addedEntry = patientsService.addPatient(req.body);
  res.json(addedEntry);
});

router.post('/:id/entries', (req, res) => {
  const patient = patientsService.getOnePatient(req.params.id);
  if (patient) {
    try {
      const newEntry = NewEntrySchema.parse(req.body);
      const addedEntry = patientsService.addEntry(newEntry, req.params.id);
      res.json(addedEntry);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        res.status(400).send({ error: error.issues });
      } else {
        res.sendStatus(500);
      }
    }
  } else {
    res.sendStatus(404);
  }
});

router.use(errorMiddleware);

export default router;
