import { fetchCyberconnectRecommendations } from "@lightdotso/services";
import type { CyberConnectRecommendations } from "@lightdotso/types";
import {
  cyberconnectRecommendationsQuerySchema,
  cyberconnectRecommendationsSchema,
} from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address, first, after } = validator(
    cyberconnectRecommendationsQuerySchema,
    req.query,
  );
  const result = await fetchCyberconnectRecommendations(
    address,
    first ? parseInt(first) : 3,
    after,
  );
  const safeResult: CyberConnectRecommendations = validator(
    cyberconnectRecommendationsSchema,
    result,
  );
  res.json(safeResult);
};

export const recommendations = apiHandler({
  GET: getHandler,
});

export default recommendations;
