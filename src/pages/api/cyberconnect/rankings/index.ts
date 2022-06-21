import { fetchCyberconnectRankings } from "@lightdotso/services";
import type { CyberConnectRankings } from "@lightdotso/types";
import {
  cyberconnectRankingsQuerySchema,
  cyberconnectRankingsSchema,
} from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { first, after } = validator(
    cyberconnectRankingsQuerySchema,
    req.query,
  );
  const result = await fetchCyberconnectRankings(
    first ? parseInt(first) : 3,
    after,
  );
  const safeResult: CyberConnectRankings = validator(
    cyberconnectRankingsSchema,
    result,
  );
  res.json(safeResult);
};

export const rankings = apiHandler({
  GET: getHandler,
});

export default rankings;
