/* eslint-disable no-restricted-imports */

import { compose } from "worktop";

import { fetchGalaxyOats } from "../models/galaxy";
import { addressValidator } from "../utils/validator";

export const list = compose(addressValidator, async (req, context) => {
  const address = context.params.address as string;

  const result = await fetchGalaxyOats(address);
  const res = new Response(result.body, result);
  res.headers.set("Cache-Control", "max-age=300");

  return res;
});
