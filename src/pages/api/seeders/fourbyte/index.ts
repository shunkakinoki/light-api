import type { NextApiHandler } from "next";

import { seedFourbyte } from "@lightdotso/api/seeders/fourbyte";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";

const getHandler: NextApiHandler = async (req, res) => {
  await seedFourbyte();
  res.json({ seeder: 200 });
};

export const fourbyte = apiHandler({
  GET: getHandler,
});

export default fourbyte;
