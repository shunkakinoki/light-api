import { DataType } from "@prisma/client";
import type { NextApiHandler } from "next";

import prisma from "@lightdotso/api/libs/prisma";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";

const getHandler: NextApiHandler = async (req, res) => {
  const [activities] = await Promise.all([
    prisma.activity.findMany({
      where: { type: DataType.POAP },
      orderBy: { createdAt: "desc" },
    }),
  ]);
  res.json({ activity: activities });
};

export const poap = apiHandler({
  GET: getHandler,
});

export default poap;
