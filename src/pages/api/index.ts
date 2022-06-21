import type { NextApiRequest, NextApiResponse } from "next";

type Reply = {
  name: string;
};

export const index = (req: NextApiRequest, res: NextApiResponse<Reply>) => {
  res.status(200).json({ name: "Hello World" });
};

export default index;
