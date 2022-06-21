import { fetchPoapEventTokens } from "@lightdotso/services";
import {
  poapEventTokensQuerySchema,
  poapEventTokensSchema,
} from "@lightdotso/types";
import type { PoapEventTokens } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { eventId, offset, limit } = validator(
    poapEventTokensQuerySchema,
    req.query,
  );
  const result = await fetchPoapEventTokens(
    eventId,
    parseInt(offset),
    limit ? parseInt(limit) : 3,
  );
  const safeResult: PoapEventTokens = validator(poapEventTokensSchema, result);
  res.json(safeResult);
};

export const metadata = apiHandler({
  GET: getHandler,
});

export default metadata;
