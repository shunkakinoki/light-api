import { ApiLinks } from "@lightdotso/const";
import { SNAPSHOT_VOTES_QUERY } from "@lightdotso/queries";

export const fetchSnapshotVotes = (address: string) => {
  return fetch(ApiLinks.SNAPSHOT, {
    method: "POST",
    cf: {
      cacheTtl: 300,
      cacheEverything: true,
    },
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: SNAPSHOT_VOTES_QUERY,
      variables: {
        address: address,
      },
    }),
  });
};
