import express from 'express';
import diagnosesService from '../services/diagnosisService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diagnosesService.getAllEntries());
});

export default router;
