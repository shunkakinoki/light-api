import { Contract, Provider } from "ethers-multicall";
import { namehash } from "ethers/lib/utils";

import {
  ENS_REGISTRY_CONTRACT_ADDRESS,
  ENS_REGISTRY_RESOLVER_ABI,
  ENS_REGISTRY_NAME_ABI,
} from "@lightdotso/api/config/ens";

import { provider } from "@lightdotso/api/libs/ethers/provider";

export const resolveENS = async (
  addresses: Array<string>,
): Promise<Record<string, string>> => {
  const multicallProvider = new Provider(provider);
  await multicallProvider.init();
  const ensRegistry = new Contract(
    ENS_REGISTRY_CONTRACT_ADDRESS,
    ENS_REGISTRY_RESOLVER_ABI,
  );
  const ownerCalls = Array.from(addresses).map(address => {
    return ensRegistry.resolver(
      namehash(`${address.toLowerCase().substring(2)}.addr.reverse`),
    );
  });
  const resolverCall = await multicallProvider.all(ownerCalls);

  const resolvers = resolverCall.map(owner => {
    return new Contract(owner, ENS_REGISTRY_NAME_ABI);
  });

  const nameIds = [];
  const nameResolvers = resolvers
    .map((call, i) => {
      return call.name(
        namehash(`${addresses[i].toLowerCase().substring(2)}.addr.reverse`),
      );
    })
    .filter((contract, i) => {
      if (
        contract.contract.address !==
        "0x0000000000000000000000000000000000000000"
      ) {
        nameIds.push(i);
        return true;
      } else {
        false;
      }
    });

  let dict: Record<string, string> = {};
  const names = await multicallProvider.all(nameResolvers);
  names.map((name, i) => {
    dict[addresses[nameIds[i]]] = name;
  });

  return dict;
};
