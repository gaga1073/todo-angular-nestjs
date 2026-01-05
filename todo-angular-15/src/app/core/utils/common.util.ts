export const assertNever = (_x: never): never => {
  throw new Error('到達できない処理です');
};
