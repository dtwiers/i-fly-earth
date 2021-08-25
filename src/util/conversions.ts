export type Speed = {
  knots: number;
  kmph: number;
  mph: number;
  mps: number;
};

const toMph = (mps: number) => mps * 2.2369311202577;

const toKmph = (mps: number) => mps * 3.6;

const toKnots = (mps: number) => mps * 1.94384;

export const convertSpeed = (mps: number): Speed => ({
  mps,
  knots: toKnots(mps),
  kmph: toKmph(mps),
  mph: toMph(mps),
});

export const metersToFeet = (m: number) => m * 3.28084;
