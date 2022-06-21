import { fetchCyberconnectPopular } from "@lightdotso/services";
import type { CyberConnectPopular } from "@lightdotso/types";
import {
  cyberconnectPopularQuerySchema,
  cyberconnectPopularSchema,
} from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address, first, after } = validator(
    cyberconnectPopularQuerySchema,
    req.query,
  );
  const result = await fetchCyberconnectPopular(
    address,
    first ? parseInt(first) : 3,
    after,
  );
  const safeResult: CyberConnectPopular = validator(
    cyberconnectPopularSchema,
    result,
  );
  res.json(safeResult);
};

export const popular = apiHandler({
  GET: getHandler,
});

export default popular;
