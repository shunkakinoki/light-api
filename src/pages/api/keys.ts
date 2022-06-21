import { base64url, SignJWT } from "jose";
import { nanoid } from "nanoid";
import type { NextApiRequest, NextApiResponse } from "next";

import { Upstash } from "@lightdotso/api/config/upstash";
import { API_KEYS_JWT_SECRET_KEY } from "@lightdotso/api/libs/rate/constants";

import type { ApiTokenPayload } from "@lightdotso/api/libs/rate/keys";
import { upstashRest } from "@lightdotso/api/libs/upstash";

const decode = (jwt: string): any => {
  return JSON.parse(
    new TextDecoder().decode(base64url.decode(jwt.split(".")[1])),
  );
};

export const keys = async (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> => {
  try {
    switch (req.method) {
      case "PUT": {
        const payload: ApiTokenPayload = {
          jti: nanoid(),
          iat: Date.now() / 1000,
          limit: 500,
          timeframe: 60,
        };
        const token = await new SignJWT(payload)
          .setProtectedHeader({ alg: "HS256" })
          .sign(new TextEncoder().encode(API_KEYS_JWT_SECRET_KEY));
        const data = await upstashRest([
          "HSET",
          Upstash.API_KEYS,
          payload.jti,
          token,
        ]);

        return res.status(200).json({ done: data.result === 1 });
      }
      case "GET": {
        const { result } = await upstashRest(["HGETALL", Upstash.API_KEYS]);
        const apiKeys = [];

        for (let i = 0; i < result.length; i += 2) {
          apiKeys.push([result[i + 1], decode(result[i + 1])]);
        }

        return res.status(200).json({ apiKeys });
      }
      case "DELETE": {
        const { key } = req.query;
        const payload =
          key && typeof key === "string"
            ? (decode(key) as ApiTokenPayload)
            : null;

        if (!payload) {
          return res
            .status(400)
            .json({ error: { message: "Invalid request" } });
        }

        const data = await upstashRest(["HDEL", Upstash.API_KEYS, payload.jti]);

        return res.status(200).json({ done: data.result === 1 });
      }
      default:
        res.status(405).json({
          error: { message: "Method not allowed" },
        });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: { message: `An error ocurred, ${err}` },
    });
  }
};

export default keys;
