import type { NextApiHandler } from "next";

import { tintinNetworkQuerySchema } from "@lightdotso/api/const/tintin";
import { seedTintin } from "@lightdotso/api/seeders/tintin";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { network } = validator(tintinNetworkQuerySchema, req.query);
  await seedTintin(network);
  res.json({ seeder: 200 });
};

export const featured = apiHandler({
  GET: getHandler,
});

export default featured;
