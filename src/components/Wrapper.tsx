import { Box } from "@chakra-ui/react";

export type WrapperVariant = "small" | "regular" | "large";

interface WrapperProps {
  variant?: WrapperVariant;
}

export const Wrapper: React.FC<WrapperProps> = ({
  variant = "regular",
  children,
}) => {
  let maxW: "400px" | "800px" | "1280px";
  switch (variant) {
    case "small":
      maxW = "400px";
      break;
    case "regular":
      maxW = "800px";
      break;
    case "large":
      maxW = "1280px";
      break;
    default:
      maxW = "800px";
  }
  return (
    <Box mt={4} mx="auto" maxW={maxW} w="100%" px={2}>
      {children}
    </Box>
  );
};
