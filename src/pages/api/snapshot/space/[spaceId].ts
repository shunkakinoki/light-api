import { fetchSnapshotSpace } from "@lightdotso/services";
import type { SnapshotSpace } from "@lightdotso/types";
import {
  snapshotSpaceQuerySchema,
  snapshotSpaceSchema,
} from "@lightdotso/types";
import type { NextApiHandler } from "next";

import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { spaceId } = validator(snapshotSpaceQuerySchema, req.query);
  const result = await fetchSnapshotSpace(spaceId);
  const safeResult: SnapshotSpace = validator(snapshotSpaceSchema, result);
  res.json(safeResult);
};

export const space = apiHandler({
  GET: getHandler,
});

export default space;
