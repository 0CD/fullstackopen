interface ExerciseValues {
  dailyHours: number[];
  target: number;
}

interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const parseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error("Not enough arguments");

  const target = Number(args[2]);
  const dailyHours = args.slice(3).map((hours) => Number(hours));
  if (!isNaN(target) && dailyHours.every((hours) => !isNaN(hours))) {
    return {
      dailyHours,
      target,
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateExercises = (
  dailyHours: number[],
  target: number
): Result => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.filter((hours) => hours > 0).length;
  const average =
    dailyHours.reduce((sum, hours) => sum + hours, 0) / periodLength;
  const success = average >= target;

  // 1 = below target (bad)
  // 2 = met target (ok)
  // 3 = 30 minutes over target (excellent)
  let rating: number;
  let ratingDescription: string;

  if (average < target) {
    rating = 1;
    ratingDescription = "bad: below target value";
  } else if (average > target + 0.5) {
    rating = 3;
    ratingDescription = "excellent: 30+ minutes over target value";
  } else {
    rating = 2;
    ratingDescription = "ok: met target value";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

if (require.main === module) {
  try {
    const { dailyHours, target } = parseArguments(process.argv);
    console.log(calculateExercises(dailyHours, target));
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
