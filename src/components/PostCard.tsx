import { Box, Flex, Heading, Link, Text } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";
import { PostSnippetFragment } from "../generated/graphql";
import { PostOptions } from "./PostOptions";
import { UpdootSection } from "./UpdootSection";

interface PostCardProps {
  post: PostSnippetFragment;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => (
  <Flex p={5} shadow="md" borderWidth="1px">
    <UpdootSection post={post} />
    <Box flex={1}>
      <Flex justifyContent="space-between" alignItems="center">
        <NextLink href="/post/[id]" as={`/post/${post.id}`}>
          <Heading as={Link} fontSize="xl">
            {post.title}
          </Heading>
        </NextLink>
        <PostOptions post={post} />
      </Flex>
      <Flex>
        <Text as={Link}>{post.creator.name}</Text>
        <Text as={Link} ml={2}>
          r/{post.creator.username}
        </Text>
      </Flex>
      <Text mt={4}>{post.textSnippet}</Text>
    </Box>
  </Flex>
);
