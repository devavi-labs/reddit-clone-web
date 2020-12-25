import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { PostSnippetFragment, RegularPostFragment } from "../generated/graphql";
import { VoteButton } from "./VoteButton";

interface UpdootSectionProps {
  post: PostSnippetFragment | RegularPostFragment | undefined | null;
  dir?: "column" | "row";
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({
  post,
  dir = "column",
}) => {
  return (
    <Flex flexDir={dir} alignItems="center" justifyContent="center" mr={4}>
      <VoteButton postId={post?.id} voteStatus={post?.voteStatus} value={1} />
      <Text m={dir === "column" ? "8px 0" : "0 8px"}>{post?.points}</Text>
      <VoteButton postId={post?.id} voteStatus={post?.voteStatus} value={-1} />
    </Flex>
  );
};
