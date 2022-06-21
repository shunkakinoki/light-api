import { fetchPoapActions } from "@lightdotso/services";
import { poapActionsSchema, poapActionsQuerySchema } from "@lightdotso/types";
import type { PoapActions } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address } = validator(poapActionsQuerySchema, req.query);
  const result = await fetchPoapActions(address);
  //TODO: Fix ZodArray Type Error
  //@ts-expect-error
  const safeResult: PoapActions = validator(poapActionsSchema, result);
  res.json(safeResult);
};

export const poaps = apiHandler({
  GET: getHandler,
});

export default poaps;
