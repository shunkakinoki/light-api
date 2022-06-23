import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

export const isProduction = publicRuntimeConfig.env === "production";

export const bulkWrite = async (data: any): Promise<Response> => {
  const CF_BULK_URL = `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/storage/kv/namespaces/${process.env.KV_NAMESPACE_ID}/bulk`;

  return fetch(CF_BULK_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-Auth-Email": "shunkakinoki@light.so",
      "X-Auth-Key": process.env.CF_ACCOUNT_TOKEN,
    },
    body: JSON.stringify(data),
  });
};

export const bulkRead = async (keys: string[]) => {
  const CF_BULK_URL = `${
    isProduction
      ? "https://lightkv.net"
      : "https://kv-preview.lightdotso.workers.dev"
  }/${keys.join(",")}`;

  return fetch(CF_BULK_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};
