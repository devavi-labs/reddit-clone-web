import { Center, CircularProgress } from "@chakra-ui/react";
import React from "react";

interface ProtectedProps {
  loading: boolean;
}

export const LazyLoading: React.FC<ProtectedProps> = ({
  loading,
  children,
}) => {
  return (
    <>
      {loading ? (
        <Center>
          <CircularProgress isIndeterminate color="tomato" />
        </Center>
      ) : (
        children
      )}
    </>
  );
};
