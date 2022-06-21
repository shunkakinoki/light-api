import { fetchEnsQuery } from "@lightdotso/services";
import type { EnsQuery } from "@lightdotso/types";
import { ensQueryQuerySchema, ensQuerySchema } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { name } = validator(ensQueryQuerySchema, req.query);
  const result = await fetchEnsQuery(name);
  const safeResult: EnsQuery = validator(ensQuerySchema, result);
  res.json(safeResult);
};

export const query = apiHandler({
  GET: getHandler,
});

export default query;
