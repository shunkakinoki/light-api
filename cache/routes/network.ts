/* eslint-disable no-restricted-imports */

import type { Network } from "@lightdotso/types";
import { compose } from "worktop";

import { fetchPoapActions } from "../models/poap";
import { fetchSnapshotVotes } from "../models/snapshot";
import { addressValidator } from "../utils/validator";

const gatherResponse = async (response: {
  json?: any;
  text?: any;
  headers?: any;
}) => {
  const { headers } = response;
  const contentType = headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  } else if (contentType.includes("application/text")) {
    return response.text();
  } else if (contentType.includes("text/html")) {
    return response.text();
  } else {
    return response.text();
  }
};

export const raw = compose(addressValidator, async (req, context) => {
  const address = context.params.address as string;
  const init = {
    cf: {
      cacheTtl: 300,
      cacheEverything: true,
    },
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  };

  const responses = await Promise.all([
    fetchPoapActions(address),
    fetchSnapshotVotes(address),
  ]);

  const results = await Promise.all([
    gatherResponse(responses[0]),
    gatherResponse(responses[1]),
  ]);

  const res = new Response(
    JSON.stringify({ poap: results[0] ?? null, snapshot: results[1] ?? null }),
    init,
  );
  res.headers.set("Cache-Control", "max-age=300");

  return res;
});

export const list = compose(addressValidator, async (req, context) => {
  const address = context.params.address as string;
  const init = {
    cf: {
      cacheTtl: 300,
      cacheEverything: true,
    },
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  };

  const responses = await Promise.all([
    fetchPoapActions(address),
    fetchSnapshotVotes(address),
  ]);

  const [poapResult, snapshotResult] = await Promise.all([
    gatherResponse(responses[0]),
    gatherResponse(responses[1]),
  ]);

  let result: Network[] = [];

  result = result.concat(
    //@ts-ignore
    poapResult.map(poap => {
      return {
        src: poap.event.image_url,
        name: poap.event.name,
        id: poap.event.id.toString() || "0",
        count: poap.event.supply,
        type: "POAP",
      } as Network;
    }),
  );

  result = result.concat(
    snapshotResult.data.votes
      //@ts-ignore
      ?.filter((vote, index, self) => {
        return (
          index ===
          //@ts-ignore
          self.findIndex(t => {
            return t.space.id === vote.space.id;
          })
        );
      })
      //@ts-ignore
      .map(shot => {
        return {
          src: shot.space.avatar,
          name: shot.space.name,
          id: shot.space.id,
          count: shot.space.followersCount,
          type: "DAO",
        } as Network;
      }),
  );

  const res = new Response(JSON.stringify(result), init);
  res.headers.set("Cache-Control", "max-age=300");

  return res;
});
