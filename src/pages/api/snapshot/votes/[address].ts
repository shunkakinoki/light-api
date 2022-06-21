import { fetchSnapshotVotes } from "@lightdotso/services";
import type { SnapshotVotes } from "@lightdotso/types";
import {
  snapshotVotesQuerySchema,
  snapshotVotesSchema,
} from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address } = validator(snapshotVotesQuerySchema, req.query);
  const result = await fetchSnapshotVotes(address);
  const safeResult: SnapshotVotes = validator(snapshotVotesSchema, result);
  res.json(safeResult);
};

export const votes = apiHandler({
  GET: getHandler,
});

export default votes;
