import type { Timeline } from "@prisma/client";

import { bulkRead } from "@lightdotso/api/libs/cf/bulk";

export const augmentTimeline = async (timeline: Timeline[]) => {
  const cmd = [];
  for (const item of timeline) {
    cmd.push(`${item.type.toLowerCase()}:::${item.chainId}:::${item.id}`);
  }
  const res = await bulkRead(cmd);
  const json = (await res.json()) as string;
  const data = JSON.stringify(json);

  const result = timeline.map((item, index) => {
    let dict = {};
    dict[item.type.toLowerCase()] = JSON.parse(data)[index];
    return Object.assign({}, item, dict);
  });

  return result;
};
