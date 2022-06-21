import { fetchCyberconnectFollowings } from "@lightdotso/services";
import type { CyberConnectFollowings } from "@lightdotso/types";
import {
  cyberconnectFollowingsQuerySchema,
  cyberconnectFollowingsSchema,
} from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address, first, after } = validator(
    cyberconnectFollowingsQuerySchema,
    req.query,
  );
  const result = await fetchCyberconnectFollowings(
    address,
    first ? parseInt(first) : 3,
    after,
  );
  const safeResult: CyberConnectFollowings = validator(
    cyberconnectFollowingsSchema,
    result,
  );
  res.json(safeResult);
};

export const followings = apiHandler({
  GET: getHandler,
});

export default followings;
