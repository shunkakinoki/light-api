import type { LoggerService } from "@nestjs/common";
import { Logger } from "@nestjs/common";

import fetch from "cross-fetch";

import { Upstash } from "@lightdotso/api/config/upstash";
import { fourbyteURL } from "@lightdotso/api/const/fourbyte";
import { upstashRest } from "@lightdotso/api/libs/upstash";

export const seedFourbyte = async (logger?: LoggerService) => {
  if (!logger) {
    logger = new Logger("seedFourbyte");
  }
  const baseUrl = `${fourbyteURL}/?page=`;
  let pageNum = 1;
  let lastResult;
  do {
    try {
      logger.log(`Fetching page ${baseUrl}${pageNum}`);

      const result = await fetch(`${baseUrl}${pageNum}`, {
        headers: new Headers({
          "content-type": "application/json",
          "Access-Control-Allow-Origin": "*",
        }),
      });
      const data: any = await result.json();

      logger.log(`Found ${data.results.length} events on ${pageNum}`);

      let entries = [];
      lastResult = data;
      data.results.forEach(person => {
        const { text_signature, hex_signature } = person;
        const sig = text_signature?.split("(")?.[0];
        return entries.push([hex_signature, sig]);
      });

      try {
        const cmd = ["HMSET", Upstash.FOUR_BYTE];
        for (const [address, name] of entries) {
          cmd.push(address, name);
        }
        const redisResult = await upstashRest(cmd);
        logger.log(`Resulted ${redisResult.result} on redis`);
      } catch (err) {
        console.error(err);
      }

      logger.log(`Created activities on page${pageNum}`);
      pageNum++;
    } catch (err) {
      console.error(err);
    }
  } while (lastResult.next !== null);
};
