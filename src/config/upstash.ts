export const Hashes = [
  "ALCHEMY",
  "API_KEYS",
  "COVALENT",
  "FOUR_BYTE",
  "IP_RULES",
  "OPEN_SEA",
  "POAP",
  "SNAPSHOT",
  "TIN_TIN",
] as const;

export const Upstash: {
  readonly [key in typeof Hashes[number]]: string;
} = {
  ALCHEMY: "alchemy",
  API_KEYS: "api:keys",
  COVALENT: "covalent",
  FOUR_BYTE: "fourbyte",
  OPEN_SEA: "opensea",
  POAP: "poap",
  IP_RULES: "ip:rules",
  SNAPSHOT: "snapshot",
  TIN_TIN: "tintin",
};
