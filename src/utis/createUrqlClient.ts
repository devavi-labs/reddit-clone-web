import { dedupExchange, fetchExchange } from "urql";
import { cacheExchange } from "./cacheExchange";

import { errorsExchange } from "./errorsExchange";
import { isServer } from "./isServer";

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) cookie = ctx?.req.headers.cookie;
  return {
    url: process.env.NEXT_PUBLIC_SERVER || "http://localhost:2608/graphql",
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange,
      errorsExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
