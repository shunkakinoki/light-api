import { fetchNetworksRaw } from "@lightdotso/services";
import type { NetworkRaw } from "@lightdotso/types";
import { networkRawSchema, networkRawQuerySchema } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address } = validator(networkRawQuerySchema, req.query);
  const result = await fetchNetworksRaw(address);
  const safeResult: NetworkRaw = validator(networkRawSchema, result);
  res.json(safeResult);
};

export const raw = apiHandler({
  GET: getHandler,
});

export default raw;
