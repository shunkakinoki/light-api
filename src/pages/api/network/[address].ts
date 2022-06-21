import { fetchNetworks } from "@lightdotso/services";
import type { Network } from "@lightdotso/types";
import { networkSchema, networkQuerySchema } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address } = validator(networkQuerySchema, req.query);
  const result = await fetchNetworks(address);
  const safeResult: Network = validator(networkSchema, result);
  res.json(safeResult);
};

export const raw = apiHandler({
  GET: getHandler,
});

export default raw;
