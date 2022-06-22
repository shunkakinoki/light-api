import type * as worktop from "worktop";
import type { KV } from "worktop/cfw.kv";

export type Handler = worktop.Handler<Context, Params>;

export interface Params {
  address?: string;
}

export interface Context extends worktop.Context {
  params: Params & worktop.Params;

  bindings: {
    CF_ACCOUNT_TOKEN: string;
    CF_ACCOUNT_ID: string;
    KV_NAMESPACE_ID: string;
    DATABASE: KV.Namespace;
  };
}
