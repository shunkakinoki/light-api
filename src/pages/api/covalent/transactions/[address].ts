import { fetchCovalentTransactions } from "@lightdotso/services";
import {
  covalentTransactionsSchema,
  covalentTransactionsQuerySchema,
} from "@lightdotso/types";
import type { CovalentTransactions } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address } = validator(covalentTransactionsQuerySchema, req.query);
  const result = await fetchCovalentTransactions(address);
  const safeResult: CovalentTransactions = validator(
    covalentTransactionsSchema,
    result,
  );
  res.json(safeResult);
};

export const identity = apiHandler({
  GET: getHandler,
});

export default identity;
