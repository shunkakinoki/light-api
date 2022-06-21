import type { NextApiHandler } from "next";

import prisma from "@lightdotso/api/libs/prisma";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";

const getHandler: NextApiHandler = async (req, res) => {
  const [users, activity, address] = await Promise.all([
    prisma.user.aggregate({
      _count: {
        id: true,
      },
    }),
    prisma.activity.aggregate({
      _count: {
        id: true,
      },
    }),
    prisma.address.aggregate({
      _count: {
        id: true,
      },
    }),
  ]);

  res.json({
    users: users._count.id,
    activity: activity._count.id,
    address: address._count.id,
  });
};

export const stats = apiHandler({
  GET: getHandler,
});

export default stats;
