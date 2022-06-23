import type { Timeline } from "@prisma/client";

import { bulkRead } from "@lightdotso/api/libs/cf/bulk";

export const augmentTimelineKV = async (timeline: Timeline[]) => {
  const bulk = [];
  for (const item of timeline) {
    bulk.push(`${item.type.toLowerCase()}:::${item.chainId}:::${item.id}`);
  }
  const res = await bulkRead(bulk);
  const json = (await res.json()) as string;
  const data = JSON.stringify(json);

  const result = timeline.map((item, index) => {
    let dict = {};
    dict[item.type.toLowerCase()] = JSON.parse(data)[index];
    return Object.assign({}, item, dict);
  });

  return result;
};
