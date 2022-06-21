import { fetchSnapshotVoters } from "@lightdotso/services";
import type { SnapshotVoters } from "@lightdotso/types";
import {
  snapshotVotersQuerySchema,
  snapshotVotersSchema,
} from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { spaceId, first, skip } = validator(
    snapshotVotersQuerySchema,
    req.query,
  );
  const result = await fetchSnapshotVoters(
    spaceId,
    first ? parseInt(first) : 3,
    parseInt(skip),
  );
  const safeResult: SnapshotVoters = validator(snapshotVotersSchema, result);
  res.json(safeResult);
};

export const voters = apiHandler({
  GET: getHandler,
});

export default voters;
