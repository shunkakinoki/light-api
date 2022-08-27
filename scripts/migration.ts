import { Redis } from "@upstash/redis";
import * as dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config({ path: ".env.local" });

const redis = new Redis({
  url: `https://${process.env.UPSTASH_REST_API_DOMAIN}`,
  token: process.env.UPSTASH_REST_API_TOKEN,
});

const client = new MongoClient(process.env.MONGODB_URI);
const clientPromise = client.connect();

(async () => {
  const client = await clientPromise;
  let cursor: number = 0;
  try {
    do {
      const data = await redis.scan(cursor, {
        match: `alchemy:::1:::*`,
        count: 10,
      });
      const promises = data[1].map(key => {
        return redis.get(key);
      });
      const result = await Promise.all(promises);
      const bulk = result.map(res => {
        return {
          insertOne: {
            document: { chainId: 1, ...Object.assign({}, res) },
          },
        };
      });
      // try {
      //   client.db("activity").collection("alchemy").bulkWrite(bulk);
      // } catch (err) {
      //   console.error(err);
      // }
      // eslint-disable-next-line no-console
      console.log(data);
      if (data[1].length === 10) {
        cursor += 10;
      } else {
        cursor = -1;
      }
      // eslint-disable-next-line no-console
      console.log(cursor);
    } while (cursor > 0);
  } catch (error) {
    console.error(error);
  }
})();
