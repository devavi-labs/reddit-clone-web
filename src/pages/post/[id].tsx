import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Center,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../../components/Layout";
import { LazyLoading } from "../../components/LazyLoading";
import { PostOptions } from "../../components/PostOptions";
import { UpdootSection } from "../../components/UpdootSection";
import { createUrqlClient } from "../../utis/createUrqlClient";
import { getPostFromId } from "../../utis/useGetPostFromId";

const Post = () => {
  const { data, error, fetching } = getPostFromId();

  return (
    <Layout variant="large">
      {error ? (
        <Center>
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </Center>
      ) : !fetching && !data?.post ? (
        <Center>
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>Couldn't find the post</AlertDescription>
          </Alert>
        </Center>
      ) : (
        <LazyLoading loading={fetching}>
          <Flex>
            <Box>
              <Flex justifyContent="space-between" alignItems="center">
                <Heading as="h1">{data?.post?.title}</Heading>
                <Flex>
                  <UpdootSection post={data?.post} dir="row" />
                  <PostOptions post={data?.post} />
                </Flex>
              </Flex>
              <Text>
                {data?.post?.creator.name +
                  " r/" +
                  data?.post?.creator.username}
              </Text>
              <p>{data?.post?.text}</p>
            </Box>
          </Flex>
        </LazyLoading>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
