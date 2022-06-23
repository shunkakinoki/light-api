export const Hashes = ["API_KEYS", "FOUR_BYTE", "IP_RULES"] as const;

export const Upstash: {
  readonly [key in typeof Hashes[number]]: string;
} = {
  API_KEYS: "api:keys",
  FOUR_BYTE: "fourbyte",
  IP_RULES: "ip:rules",
};
