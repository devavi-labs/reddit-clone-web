import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utis/isServer";

export const Navbar = () => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  });

  const router = useRouter();

  const [{ fetching: loggingOut }, logout] = useLogoutMutation();

  const handleLogout = async () => {
    const { data } = await logout();
    if (data?.logout) router.reload();
  };

  let body = null;

  // data is loading
  if (fetching) {
    // user is not logged in
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href={`/login?from=${router.asPath}`}>
          <Link mr={4} fontWeight="bold">
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link fontWeight="bold">Register</Link>
        </NextLink>
      </>
    );
    // user is logged in
  } else {
    body = (
      <Flex>
        <Menu>
          <MenuButton as={IconButton} variant="outlined" size="sm">
            <Avatar size="xs" />
          </MenuButton>
          <MenuList>
            <MenuGroup title="Profile">
              <MenuItem>
                <NextLink href="/">
                  <Link mr={4} fontWeight="bold">
                    {data?.me.name}
                  </Link>
                </NextLink>
              </MenuItem>
              <MenuItem
                as={Button}
                variant="link"
                colorScheme="black"
                onClick={handleLogout}
                isLoading={loggingOut}
              >
                Logout
              </MenuItem>
            </MenuGroup>
          </MenuList>
        </Menu>
      </Flex>
    );
  }
  return (
    <Flex bg="tomato" p={4}>
      <Flex
        alignItems="center"
        justifyContent="space-between"
        maxW="1280px"
        flex={1}
        m="auto"
      >
        <NextLink href="/">
          <Heading as={Link}>LiReddit</Heading>
        </NextLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};
