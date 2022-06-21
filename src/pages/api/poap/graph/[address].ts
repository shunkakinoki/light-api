import { fetchPoapGraph } from "@lightdotso/services";
import type { PoapGraph } from "@lightdotso/types";
import { poapAccountSchema, poapAccountQuerySchema } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address } = validator(poapAccountQuerySchema, req.query);
  const result: PoapGraph = await fetchPoapGraph(address);
  const safeResult = validator(poapAccountSchema, result);
  res.json(safeResult);
};

export const graph = apiHandler({
  GET: getHandler,
});

export default graph;
