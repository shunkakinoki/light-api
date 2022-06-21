import { fetchPoapEvent } from "@lightdotso/services";
import { poapEventIdSchema, poapEventIdQuerySchema } from "@lightdotso/types";
import type { PoapEvent } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { eventId } = validator(poapEventIdQuerySchema, req.query);
  const result: PoapEvent = await fetchPoapEvent(eventId);
  const safeResult = validator(poapEventIdSchema, result);
  res.json(safeResult);
};

export const event = apiHandler({
  GET: getHandler,
});

export default event;
