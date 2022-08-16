import { ApiLinks } from "@lightdotso/const";
import { GALAXY_OAT_QUERY, GALAXY_CAMPAIGN_QUERY} from "@lightdotso/queries";

export const fetchGalaxyCampaign = (oatId: string) => {
  return fetch(ApiLinks.GALAXY, {
    method: "POST",
    cf: {
      cacheTtl: 300,
      cacheEverything: true,
    },
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GALAXY_CAMPAIGN_QUERY,
      variables: {
        id: oatId,
      },
    }),
  });
};


export const fetchGalaxyOats = (address: string) => {
  return fetch(ApiLinks.GALAXY, {
    method: "POST",
    cf: {
      cacheTtl: 300,
      cacheEverything: true,
    },
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GALAXY_OAT_QUERY,
      variables: {
        address: address,
      },
    }),
  });
};
