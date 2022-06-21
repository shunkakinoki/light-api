import { openseaEventsQuerySchema } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { seedAlchemy } from "@lightdotso/api/seeders/alchemy";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { castAddress } from "@lightdotso/api/utils/castAddress";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address } = validator(openseaEventsQuerySchema, req.query);
  await seedAlchemy(castAddress(address));
  res.json({ seeder: 200 });
};

export const alchemy = apiHandler({
  GET: getHandler,
});

export default alchemy;
