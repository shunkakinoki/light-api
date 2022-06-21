import { fetchEnsResolveNameQuery } from "@lightdotso/services";
import type { EnsQuery } from "@lightdotso/types";
import {
  ensResolveNameQuerySchema,
  ensResolveNameSchema,
} from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { name } = validator(ensResolveNameQuerySchema, req.query);
  const result = await fetchEnsResolveNameQuery(name);
  const safeResult: EnsQuery = validator(ensResolveNameSchema, result);
  res.json(safeResult);
};

export const query = apiHandler({
  GET: getHandler,
});

export default query;
