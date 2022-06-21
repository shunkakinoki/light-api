import { fetchAlchemyTokenTransactions } from "@lightdotso/services";
import {
  alchemyTransactionsSchema,
  alchemyTransactionsQuerySchema,
} from "@lightdotso/types";
import type { AlchemyTransactions } from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address } = validator(alchemyTransactionsQuerySchema, req.query);
  const result = await fetchAlchemyTokenTransactions(address);
  const safeResult: AlchemyTransactions = validator(
    alchemyTransactionsSchema,
    result,
  );
  res.json(safeResult);
};

export const identity = apiHandler({
  GET: getHandler,
});

export default identity;
