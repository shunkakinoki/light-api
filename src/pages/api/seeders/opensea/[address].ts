import { openseaEventsQuerySchema } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { seedOpensea } from "@lightdotso/api/seeders/opensea";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { castAddress } from "@lightdotso/api/utils/castAddress";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address } = validator(openseaEventsQuerySchema, req.query);
  await seedOpensea(castAddress(address));
  res.json({ seeder: 200 });
};

export const featured = apiHandler({
  GET: getHandler,
});

export default featured;
