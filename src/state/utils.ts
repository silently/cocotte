// modulo output is always positive (contrary to %)
export const modulo = (x: number, mod: number): number =>
  ((x % mod) + mod) % mod;
