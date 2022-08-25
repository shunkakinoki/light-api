import { Redis } from "@upstash/redis";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const redis = new Redis({
  url: `https://${process.env.UPSTASH_REST_API_DOMAIN}`,
  token: process.env.UPSTASH_REST_API_TOKEN,
});

(async () => {
  let cursor: number = 0;
  try {
    do {
      const data = await redis.scan(cursor, {
        match: `alchemy:::1:::*`,
        count: 10,
      });
      if (data[1].length === 10) {
        cursor += 10;
      } else {
        cursor = -1;
      }
      console.log(data);
    } while (cursor > 0);
  } catch (error) {
    console.error(error);
  }
})();
