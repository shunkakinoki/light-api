import { fetchOpenseaAssets } from "@lightdotso/services";
import {
  openseaAssetsQuerySchema,
  openseaAssetsSchema,
} from "@lightdotso/types";
import type { OpenseaAssets } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address } = validator(openseaAssetsQuerySchema, req.query);
  const result = await fetchOpenseaAssets(address);
  const safeResult: OpenseaAssets = validator(openseaAssetsSchema, result);
  res.json(safeResult);
};

export const assets = apiHandler({
  GET: getHandler,
});

export default assets;
