import { ApiLinks } from "@lightdotso/const";

export const fetchPoapActions = (address: string) => {
  return fetch(`${ApiLinks.POAP}/actions/scan/${address}`, {
    method: "GET",
    cf: {
      cacheTtl: 300,
      cacheEverything: true,
    },
  });
};
