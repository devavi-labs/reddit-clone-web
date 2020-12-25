import {
  Stack,
  Heading,
  Flex,
  Button,
  Center,
  Alert,
  AlertIcon,
  AlertDescription,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { LazyLoading } from "../components/LazyLoading";
import { PostSnippetFragment, usePostsQuery } from "../generated/graphql";
import { createUrqlClient } from "../utis/createUrqlClient";
import NextLink from "next/link";
import React, { useState } from "react";
import { PostCard } from "../components/PostCard";

const Home = () => {
  const [variables, setVariables] = useState({ limit: 15, offset: 0 });
  const [{ data, fetching, error, stale }] = usePostsQuery({ variables });
  return (
    <Layout>
      <Flex alignItems="center" justifyContent="space-between" mb={4} px={4}>
        <Heading as="h2">All posts</Heading>
        <NextLink href="/create-post">
          <Button colorScheme="teal">Create Post</Button>
        </NextLink>
      </Flex>
      {error ? (
        <Center>
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </Center>
      ) : (
        <LazyLoading loading={fetching || data === null}>
          <Stack spacing={4}>
            {data?.posts.posts?.map(
              (postSnippet: PostSnippetFragment) =>
                postSnippet && (
                  <PostCard key={postSnippet.id} post={postSnippet} />
                )
            )}
          </Stack>
          {data?.posts.hasMore && (
            <Center>
              <Button
                my={8}
                onClick={() =>
                  setVariables({
                    limit: variables.limit,
                    offset: data?.posts.posts.length || 0,
                  })
                }
                isLoading={stale}
                loadingText="Loading"
              >
                Load more
              </Button>
            </Center>
          )}
        </LazyLoading>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Home);
