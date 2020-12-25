import { IconButton, Text, Tooltip, useToast } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useVoteMutation } from "../generated/graphql";

interface VoteButtonProps {
  postId: number | undefined | null;
  voteStatus: number | undefined | null;
  value: 1 | -1;
}

export const VoteButton: React.FC<VoteButtonProps> = ({
  postId,
  voteStatus,
  value,
}) => {
  const [{ fetching, error }, vote] = useVoteMutation();

  const toast = useToast();

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

  return (
    <Tooltip label={value === 1 ? "Updoot" : "Downdoot"} fontSize="sm">
      <IconButton
        aria-label={value === 1 ? "updoot-button" : "downdoot-button"}
        icon={value === 1 ? <Text>+1</Text> : <Text>-1</Text>}
        onClick={() =>
          !(voteStatus === value) && postId && vote({ postId, value })
        }
        size="sm"
        isLoading={fetching}
        disabled={voteStatus === value}
        _disabled={{
          bg: `${voteStatus === 1 ? "green" : "red"} !important`,
          color: "white !important",
          cursor: "not-allowed",
        }}
      />
    </Tooltip>
  );
};
