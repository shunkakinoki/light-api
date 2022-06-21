import { fetchCyberconnectFollowers } from "@lightdotso/services";
import type { CyberConnectFollowers } from "@lightdotso/types";
import {
  cyberconnectFollowersQuerySchema,
  cyberconnectFollowersSchema,
} from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address, first, after } = validator(
    cyberconnectFollowersQuerySchema,
    req.query,
  );
  const result = await fetchCyberconnectFollowers(
    address,
    first ? parseInt(first) : 3,
    after,
  );
  const safeResult: CyberConnectFollowers = validator(
    cyberconnectFollowersSchema,
    result,
  );
  res.json(safeResult);
};

export const followers = apiHandler({
  GET: getHandler,
});

export default followers;
