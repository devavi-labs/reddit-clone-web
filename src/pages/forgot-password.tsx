import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Center,
  Link,
  Spacer,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import React from "react";
import * as Yup from "yup";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utis/createUrqlClient";

const ForgotPassword = () => {
  const [{ data, fetching }, forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (values: ForgotPasswordValues) => {
    await forgotPassword({ email: values.email });
  };

  return (
    <Layout variant="small">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() =>
          data?.forgotPassword ? (
            <Alert status="success">
              <AlertIcon />
              <AlertDescription>
                We've sent you an email with a link to change your password. Go
                to{" "}
                <NextLink href="/">
                  <Link>home.</Link>
                </NextLink>
              </AlertDescription>
            </Alert>
          ) : (
            <Form>
              <InputField name="email" label="Email" placeholder="Email" />
              <Spacer height={4} />
              <Center>
                <Button
                  colorScheme="teal"
                  type="submit"
                  isLoading={fetching}
                  loadingText="Sending"
                >
                  Send Link
                </Button>
              </Center>
            </Form>
          )
        }
      </Formik>
    </Layout>
  );
};

interface ForgotPasswordValues {
  email: string;
}

const initialValues: ForgotPasswordValues = {
  email: "",
};

const validationSchema = Yup.object({
  email: Yup.string().email().required().label("Email"),
});

export default withUrqlClient(createUrqlClient)(ForgotPassword);
