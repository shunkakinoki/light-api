import { z } from "zod";

const networkNamesEnum = z.enum([
  "MAINNET",
  "KOVAN",
  "POLYGON",
  "POLYGON_MUMBAI",
  "ARBITRUM",
  "ARBITRUM_RINKEBY",
]);

export const tintinNetworkQuerySchema = z.object({
  network: networkNamesEnum,
});

export type TinTinNetwork = z.infer<typeof networkNamesEnum>;

export const tintinURL: Record<TinTinNetwork, string> = {
  MAINNET: `https://raw.githubusercontent.com/tintinweb/smart-contract-sanctuary-ethereum/master/contracts/mainnet/contracts.json`,
  KOVAN: `https://raw.githubusercontent.com/tintinweb/smart-contract-sanctuary-ethereum/master/contracts/kovan/contracts.json`,
  POLYGON: `https://raw.githubusercontent.com/tintinweb/smart-contract-sanctuary-polygon/master/contracts/mainnet/contracts.json`,
  POLYGON_MUMBAI: `https://raw.githubusercontent.com/tintinweb/smart-contract-sanctuary-polygon/master/contracts/mumbai/contracts.json`,
  ARBITRUM: `https://raw.githubusercontent.com/tintinweb/smart-contract-sanctuary-arbitrum/master/contracts/mainnet/contracts.json`,
  ARBITRUM_RINKEBY: `https://raw.githubusercontent.com/tintinweb/smart-contract-sanctuary-arbitrum/master/contracts/testnet/contracts.json`,
};

export const tintinChainId: Record<TinTinNetwork, number> = {
  MAINNET: 1,
  KOVAN: 42,
  POLYGON: 137,
  POLYGON_MUMBAI: 80_001,
  ARBITRUM: 42_161,
  ARBITRUM_RINKEBY: 421_611,
};
