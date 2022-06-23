import { isAddress } from "@ethersproject/address";

// eslint-disable-next-line no-restricted-imports
import type { Handler } from "../types/context";

import { response } from "./response";

export const addressValidator: Handler = async (req, context) => {
  const { address } = context.params;

  if (!address) {
    return response(400, "Invalid address identifier");
  }

  if (!isAddress(address!)) {
    return response(400, "Invalid address identifier");
  }
};
