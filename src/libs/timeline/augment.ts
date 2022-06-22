import type { Timeline } from "@prisma/client";

import { upstashRest } from "@lightdotso/api/libs/upstash";

export const augmentTimeline = async (timeline: Timeline[]) => {
  const cmd = ["MGET"];
  for (const item of timeline) {
    cmd.push(`${item.type.toLowerCase()}:::${item.chainId}:::${item.id}`);
  }
  const data = await upstashRest(cmd);

  const result = timeline.map((item, index) => {
    let dict = {};
    dict[item.type.toLowerCase()] = JSON.parse(data.result[index]);
    return Object.assign({}, item, dict);
  });

  return result;
};
