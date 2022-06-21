import { getAddress, isAddress } from "ethers/lib/utils";
import { z } from "zod";

export const castAddressSchema = z.string().transform((val, ctx) => {
  if (!isAddress(val)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Not a valid address",
    });
  }
  return getAddress(val);
});

export const castAddress = (val: string) => {
  return castAddressSchema.parse(val.toLowerCase());
};
