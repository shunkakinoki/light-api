import type { NextApiHandler } from "next";

import prisma from "@lightdotso/api/libs/prisma";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";

const getHandler: NextApiHandler = async (req, res) => {
  const [users] = await Promise.all([
    prisma.user.aggregate({
      _count: {
        id: true,
      },
    }),
  ]);

  res.json({ users: users._count.id });
};

export const featured = apiHandler({
  GET: getHandler,
});

export default featured;
