import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Center,
  Link,
  Spacer,
} from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import * as Yup from "yup";
import { InputField } from "../../components/InputField";
import { Layout } from "../../components/Layout";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utis/createUrqlClient";
import { mapErrors } from "../../utis/mapErrors";

const ChangePassword = () => {
  const router = useRouter();
  const [tokenError, setTokenError] = useState("");

  const [{ fetching }, changePassword] = useChangePasswordMutation();

  const handleSubmit = async (
    values: ChangePasswordValues,
    { setErrors }: FormikHelpers<ChangePasswordValues>
  ) => {
    const { data } = await changePassword({
      newPassword: values.newPassword,
      token: typeof router.query.token === "string" ? router.query.token : "",
    });
    if (data?.changePassword.errors) {
      const errors = mapErrors(data.changePassword.errors);
      if ("token" in errors) {
        setTokenError(errors.token);
      }
      setErrors(errors);
    } else if (data?.changePassword.user) {
      router.push("/");
    }
  };
  return (
    <Layout variant="small">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <InputField
              name="newPassword"
              label="New Password"
              placeholder="New Password"
              type="password"
            />
            <Spacer height={4} />
            {tokenError && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>{tokenError}</AlertTitle>
                <AlertDescription>
                  <NextLink href="/forgot-password">
                    <Link>Get new token.</Link>
                  </NextLink>
                  <ArrowForwardIcon />
                </AlertDescription>
              </Alert>
            )}
            <Spacer height={4} />
            <Center>
              <Button
                colorScheme="teal"
                type="submit"
                isLoading={fetching}
                loadingText="Changing"
              >
                Change Password
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

interface ChangePasswordValues {
  newPassword: string;
}

const initialValues: ChangePasswordValues = {
  newPassword: "",
};

const validationSchema = Yup.object({
  newPassword: Yup.string().min(6).required().label("Password"),
});

export default withUrqlClient(createUrqlClient)(ChangePassword);
