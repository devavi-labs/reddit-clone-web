import { ButtonGroup } from "@chakra-ui/react";
import React from "react";
import {
  Post,
  PostSnippetFragment,
  RegularPostFragment,
} from "../generated/graphql";
import { EditPostButton } from "./EditPostButton";
import { PostDeleteButton } from "./PostDeleteButton";

interface PostOptionsProps {
  post: Post | PostSnippetFragment | RegularPostFragment | undefined | null;
}

export const PostOptions: React.FC<PostOptionsProps> = ({ post }) => (
  <ButtonGroup>
    <EditPostButton post={post} />
    <PostDeleteButton post={post} />
  </ButtonGroup>
);
