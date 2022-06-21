import type { Timeline } from "@prisma/client";

import { upstashRest } from "@lightdotso/api/libs/upstash";

export const augmentTimeline = async (timeline: Timeline[]) => {
  const cmd = ["MGET"];
  for (const item of timeline) {
    cmd.push(`${item.type.toLowerCase()}:::${item.id}`);
  }
  const data = await upstashRest(cmd);

  const result = timeline.map((item, index) => {
    return Object.assign({}, item, { data: JSON.parse(data.result[index]) });
  });

  return result;
};
