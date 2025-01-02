import express from "express";
import { calculateBmi } from "./bmiCalculator";
import { calculateExercises } from "./exerciseCalculator";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    res.status(400).send({ error: "malformatted parameters" });
  } else {
    const bmi = calculateBmi(height, weight);
    res.send({
      weight: weight,
      height: height,
      bmi: bmi,
    });
  }
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.status(400).json({ error: "parameters missing" });
  } else if (isNaN(Number(target)) || !Array.isArray(daily_exercises)) {
    res.status(400).json({ error: "malformatted parameters" });
  } else {
    const dailyHours = daily_exercises.map((hours) => Number(hours));
    if (dailyHours.some((hours) => isNaN(hours))) {
      res.status(400).json({ error: "malformatted parameters" });
    } else {
      const results = calculateExercises(dailyHours, Number(target));
      res.json(results);
    }
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
