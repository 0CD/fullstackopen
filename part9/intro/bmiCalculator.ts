// BMI basic categories
// Underweight (Severe thinness):	< 16.0
// Underweight (Moderate thinness):	16.0 – 16.9
// Underweight (Mild thinness):	17.0 – 18.4
// Normal range:	18.5 – 24.9
// Overweight (Pre-obese):	25.0 – 29.9
// Obese (Class I):	30.0 – 34.9
// Obese (Class II):	35.0 – 39.9
// Obese (Class III):	≥ 40.0

// height in cm, weight in kg
interface BmiValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      height: Number(args[2]),
      weight: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / Math.pow(height / 100, 2);

  if (bmi < 16) {
    return "Underweight (Severe thinness)";
  } else if (bmi >= 16 && bmi <= 16.9) {
    return "Underweight (Moderate thinness)";
  } else if (bmi >= 17 && bmi <= 18.4) {
    return "Underweight (Mild thinness)";
  } else if (bmi >= 18.5 && bmi <= 24.9) {
    return "Normal range";
  } else if (bmi >= 25 && bmi <= 29.9) {
    return "Overweight (Pre-obese)";
  } else if (bmi >= 30 && bmi <= 34.9) {
    return "Obese (Class I)";
  } else if (bmi >= 35 && bmi <= 39.9) {
    return "Obese (Class II)";
  } else {
    return "Obese (Class III)";
  }
};

if (require.main === module) {
  try {
    const { height, weight } = parseArguments(process.argv);
    console.log(calculateBmi(height, weight));
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    console.log(errorMessage);
  }
}
