import { useRouter } from "next/router";
import { usePostQuery } from "../generated/graphql";

export const getPostFromId = () => {
  const { id: rawId } = useRouter().query;
  const id = typeof rawId === "string" ? parseInt(rawId) : -1;
  const [{ data, error, fetching }] = usePostQuery({ variables: { id } });

  return { data, error, fetching, id };
};
