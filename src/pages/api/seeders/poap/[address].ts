import { poapActionsQuerySchema } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { seedPoap } from "@lightdotso/api/seeders/poap";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { castAddress } from "@lightdotso/api/utils/castAddress";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address } = validator(poapActionsQuerySchema, req.query);
  await seedPoap(castAddress(address));
  res.json({ seeder: 200 });
};

export const featured = apiHandler({
  GET: getHandler,
});

export default featured;
