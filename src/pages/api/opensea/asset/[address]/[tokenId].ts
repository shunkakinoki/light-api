import { fetchOpenseaAsset } from "@lightdotso/services";
import { openseaAssetQuerySchema, openseaAssetSchema } from "@lightdotso/types";
import type { OpenseaAsset } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address, tokenId } = validator(openseaAssetQuerySchema, req.query);
  const result = await fetchOpenseaAsset(address, tokenId);
  const safeResult: OpenseaAsset = validator(openseaAssetSchema, result);
  res.json(safeResult);
};

export const asset = apiHandler({
  GET: getHandler,
});

export default asset;
