

type GenericIndex = { [key: string]: any };

export const createFinder = (index: GenericIndex) => (n: string) => {
  const out = index[n];
  if (!out) throw new Error();
  return out;
}
