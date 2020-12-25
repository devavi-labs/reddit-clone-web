import { EditIcon } from "@chakra-ui/icons";
import { Tooltip, IconButton } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import {
  Post,
  PostSnippetFragment,
  RegularPostFragment,
  useMeQuery,
} from "../generated/graphql";
import { isServer } from "../utis/isServer";

interface EditPostButtonProps {
  post: Post | PostSnippetFragment | RegularPostFragment | undefined | null;
}

export const EditPostButton: React.FC<EditPostButtonProps> = ({ post }) => {
  const [{ data }] = useMeQuery({
    pause: isServer(),
  });
  const router = useRouter();
  return (
    <>
      {data?.me?.id === post?.creatorId && (
        <Tooltip label="Edit post" fontSize="sm">
          <IconButton
            aria-label="post-delete-button"
            icon={<EditIcon />}
            onClick={() =>
              router.push(`/post/edit/${post?.id}?from=${router.asPath}`)
            }
            size="sm"
          />
        </Tooltip>
      )}
    </>
  );
};
