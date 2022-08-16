/* eslint-disable no-restricted-imports */

import { compose } from "worktop";

import { fetchGalaxyCampaign, fetchGalaxyOats } from "../models/galaxy";
import { addressValidator } from "../utils/validator";

export const get = compose(undefined, async (req, context) => {
  const oatId = context.params.oatId as string;

  const result = await fetchGalaxyCampaign(oatId);
  const res = new Response(result.body, result);
  res.headers.set("Cache-Control", "max-age=300");

  return res;
});

export const list = compose(addressValidator, async (req, context) => {
  const address = context.params.address as string;

  const result = await fetchGalaxyOats(address);
  const res = new Response(result.body, result);
  res.headers.set("Cache-Control", "max-age=300");

  return res;
});
