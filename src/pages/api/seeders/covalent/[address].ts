import { covalentTransactionsQuerySchema } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { seedCovalent } from "@lightdotso/api/seeders/covalent";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { castAddress } from "@lightdotso/api/utils/castAddress";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address } = validator(covalentTransactionsQuerySchema, req.query);
  await seedCovalent(castAddress(address));
  res.json({ seeder: 200 });
};

export const covalent = apiHandler({
  GET: getHandler,
});

export default covalent;
