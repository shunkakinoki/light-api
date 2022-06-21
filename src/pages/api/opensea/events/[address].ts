import { fetchOpenseaEvents } from "@lightdotso/services";
import {
  openseaEventsQuerySchema,
  openseaEventsSchema,
} from "@lightdotso/types";
import type { OpenseaEvents } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address, cursor } = validator(openseaEventsQuerySchema, req.query);
  const result = await fetchOpenseaEvents(address);
  const safeResult: OpenseaEvents = validator(openseaEventsSchema, result);
  res.json(safeResult);
};

export const identity = apiHandler({
  GET: getHandler,
});

export default identity;
