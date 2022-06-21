import { fetchPoapToken } from "@lightdotso/services";
import { poapTokenSchema, poapTokenQuerySchema } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { tokenId } = validator(poapTokenQuerySchema, req.query);
  const result = await fetchPoapToken(tokenId);
  const safeResult = validator(poapTokenSchema, result);
  res.json(safeResult);
};

export const tokenId = apiHandler({
  GET: getHandler,
});

export default tokenId;
