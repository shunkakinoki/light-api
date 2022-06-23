import Bull from "bull";

export const bullQueue = (name: string) => {
  return new Bull(name, {
    redis: {
      host: process.env.UPSTASH_REST_API_DOMAIN,
      port: parseInt(
        process.env.UPSTASH_REST_API_DOMAIN.match(/[0-9]{3,5}/)[0],
      ),
      password: process.env.UPSTASH_REST_API_PASSWORD,
      tls: {},
    },
  });
};
