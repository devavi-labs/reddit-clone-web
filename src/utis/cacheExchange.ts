import { cacheExchange as CE } from "@urql/exchange-graphcache";
import { gql } from "urql";
import {
  DeletePostByIdMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  VoteMutationVariables,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { clearPostsCache } from "./clearPostsCache";
import { pagination } from "./pagination";

export const cacheExchange = CE({
  keys: {
    PaginatedPosts: () => null,
  },
  resolvers: {
    Query: {
      posts: pagination(),
    },
  },
  updates: {
    Mutation: {
      logout: (result, _, cache) => {
        betterUpdateQuery<LogoutMutation, MeQuery>(
          cache,
          { query: MeDocument },
          result,
          () => ({ me: null })
        );

        clearPostsCache(cache);
      },
      login: (_result, _, cache) => {
        betterUpdateQuery<LoginMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          (result, query) => {
            if (result.login.errors) {
              return query;
            } else {
              return {
                me: result.login.user,
              };
            }
          }
        );
        clearPostsCache(cache);
      },
      register: (_result, _, cache) => {
        betterUpdateQuery<RegisterMutation, MeQuery>(
          cache,
          { query: MeDocument },
          _result,
          (result, query) => {
            if (result.register.errors) {
              return query;
            } else {
              return {
                me: result.register.user,
              };
            }
          }
        );
        clearPostsCache(cache);
      },
      createPost: (_result, _, cache) => {
        clearPostsCache(cache);
      },
      deletePostById: (_result, args, cache) => {
        cache.invalidate({
          __typename: "Post",
          id: (args as DeletePostByIdMutationVariables).id,
        });
      },
      vote: (_, args, cache) => {
        const { postId, value } = args as VoteMutationVariables;
        const data = cache.readFragment(
          gql`
            fragment _ on Post {
              id
              points
              voteStatus
            }
          `,
          { id: postId }
        );
        if (data) {
          if (data.postStatus === value) return;
          const newPoints =
            (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
          cache.writeFragment(
            gql`
              fragment _ on Post {
                points
                voteStatus
              }
            `,
            { id: postId, points: newPoints, voteStatus: value }
          );
        }
      },
    },
  },
});
