import { pipe } from "fp-ts/lib/function";

export type DmsAngle = {
  degrees: number;
  minutes: number;
  seconds: number;
};

const multiply = (num1: number) => (num2: number) => num1 * num2;

const divideBy = (divisor: number) => (dividend: number) => dividend / divisor;

const decimalRound = (places: number) => (num: number) =>
  pipe(
    num,
    multiply(Math.pow(10, places)),
    Math.round,
    divideBy(Math.pow(10, places))
  );

export const toDms = (decimal: number) => ({
  degrees: Math.trunc(decimal),
  minutes: Math.trunc((Math.abs(decimal) * 60) % 60),
  seconds: decimalRound(4)((Math.abs(decimal) * 3600) % 60),
});
