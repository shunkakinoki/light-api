import type { z, ZodRawShape } from "zod";

export const validator = <
  T extends ZodRawShape,
  Q extends Record<string, unknown>,
>(
  zodSchema: z.ZodObject<T>,
  schema: Q,
) => {
  const result = zodSchema.safeParse(schema);
  if (!result.success) {
    //@ts-expect-error
    console.error(result.error);
    //TODO: Add discord bot
    //@ts-expect-error
    throw Error(JSON.stringify(result.error));
  }
  return result.data;
};
