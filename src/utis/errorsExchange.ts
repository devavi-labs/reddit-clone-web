import { Exchange } from "urql";
import { pipe, tap } from "wonka";
import Router from "next/router";

export const errorsExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if (error?.message.includes("Not Authenticated")) {
          Router.replace("/login");
        }
      }
    })
  );
};
