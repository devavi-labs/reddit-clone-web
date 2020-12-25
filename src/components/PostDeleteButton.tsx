import { DeleteIcon } from "@chakra-ui/icons";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  IconButton,
  useDisclosure,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import {
  PostSnippetFragment,
  RegularPostFragment,
  useDeletePostByIdMutation,
  useMeQuery,
} from "../generated/graphql";
import { isServer } from "../utis/isServer";

interface PostDeleteButtonProps {
  post: RegularPostFragment | PostSnippetFragment | undefined | null;
}

export const PostDeleteButton: React.FC<PostDeleteButtonProps> = ({ post }) => {
  const [{ data }] = useMeQuery({
    pause: isServer(),
  });
  const [
    { data: postData, fetching, error },
    deletePost,
  ] = useDeletePostByIdMutation();

  const toast = useToast();
  const router = useRouter();

  const cancelRef = useRef(null);

  useEffect(() => {
    if (postData?.deletePostById && router.pathname !== "/") {
      router.replace("/");
    }
  }, [postData, router]);

  useEffect(() => {
    if (error) {
      toast({
        title: error.name,
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  }, [error, toast]);
  const { onClose, onOpen, isOpen } = useDisclosure();

  return (
    <>
      {data?.me?.id === post?.creatorId && (
        <Tooltip label="Delete post" fontSize="sm">
          <IconButton
            aria-label="post-delete-button"
            icon={<DeleteIcon />}
            onClick={onOpen}
            size="sm"
          />
        </Tooltip>
      )}
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Post</AlertDialogHeader>
            <Tooltip label="Close" fontSize="sm">
              <AlertDialogCloseButton onClick={onClose} />
            </Tooltip>
            <AlertDialogBody>
              This will delete this post permanently and you will not be able to
              restore it again in the future, are you sure you want to delete?
            </AlertDialogBody>
            <AlertDialogFooter>
              <ButtonGroup>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => post && deletePost({ id: post?.id })}
                  isLoading={fetching}
                >
                  Delete
                </Button>
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
