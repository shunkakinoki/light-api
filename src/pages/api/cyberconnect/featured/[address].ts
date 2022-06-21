import { fetchCyberconnectFeatured } from "@lightdotso/services";

import {
  cyberconnectFeaturedQuerySchema,
  cyberconnectFeaturedSchema,
} from "@lightdotso/types";
import type { CyberConnectFeatured } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address } = validator(cyberconnectFeaturedQuerySchema, req.query);
  const result = await fetchCyberconnectFeatured(address);
  const safeResult: CyberConnectFeatured = validator(
    cyberconnectFeaturedSchema,
    result,
  );
  res.json(safeResult);
};

export const featured = apiHandler({
  GET: getHandler,
});

export default featured;
