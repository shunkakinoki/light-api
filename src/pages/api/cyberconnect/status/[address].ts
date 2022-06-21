import { fetchCyberconnectStatus } from "@lightdotso/services";
import type { CyberConnectStatus } from "@lightdotso/types";
import {
  cyberconnectStatusQuerySchema,
  cyberconnectStatusSchema,
} from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address, to } = validator(cyberconnectStatusQuerySchema, req.query);
  const result = await fetchCyberconnectStatus(address, to);
  const safeResult: CyberConnectStatus = validator(
    cyberconnectStatusSchema,
    result,
  );
  res.json(safeResult);
};

export const status = apiHandler({
  GET: getHandler,
});

export default status;
