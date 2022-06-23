export const Keys = [
  "ALCHEMY",
  "COVALENT",
  "OPEN_SEA",
  "POAP",
  "SNAPSHOT",
  "TIN_TIN",
] as const;

export const Key: {
  readonly [key in typeof Keys[number]]: string;
} = {
  ALCHEMY: "alchemy",
  COVALENT: "covalent",
  OPEN_SEA: "opensea",
  POAP: "poap",
  SNAPSHOT: "snapshot",
  TIN_TIN: "tintin",
};
