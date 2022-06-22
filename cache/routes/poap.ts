/* eslint-disable no-restricted-imports */

import { compose } from "worktop";

import { fetchPoapActions } from "../models/poap";
import { addressValidator } from "../utils/validator";

export const get = compose(addressValidator, async (req, context) => {
  const address = context.params.address as string;

  const result = await fetchPoapActions(address);
  const res = new Response(result.body, result);
  res.headers.set("Cache-Control", "max-age=300");

  return res;
});
