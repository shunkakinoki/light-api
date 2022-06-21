import { ethers } from "ethers";

export const provider = new ethers.providers.InfuraProvider("homestead", {
  projectId: process.env.INFURA_ID,
});
