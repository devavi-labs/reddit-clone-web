import { Button, Center, Link, Spacer } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useLoginMutation } from "../generated/graphql";
import { createUrqlClient } from "../utis/createUrqlClient";
import { mapErrors } from "../utis/mapErrors";

const Login = () => {
  const router = useRouter();

  const [{ fetching }, login] = useLoginMutation();

  const handleSubmit = async (
    values: LoginValues,
    { setErrors }: FormikHelpers<LoginValues>
  ) => {
    const response = await login(values);
    if (response.data?.login.errors) {
      setErrors(mapErrors(response.data.login.errors));
    } else if (response.data?.login.user) {
      if (typeof router.query.from === "string") {
        router.replace(router.query.from);
      } else router.replace("/");
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
              name="usernameOrEmail"
              label="Username or Email"
              placeholder="Username Or Email"
              type="text"
            />
            <Spacer height={4} />
            <InputField
              name="password"
              label="Password"
              placeholder="Password"
              type="password"
            />

            <Spacer height={4} />

            <Center>
              <Button
                colorScheme="teal"
                type="submit"
                isLoading={fetching}
                loadingText="Logging in"
              >
                Login
              </Button>
              <Spacer height={4} />
              <NextLink href="forgot-password">
                <Link>Forgot password?</Link>
              </NextLink>
            </Center>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

interface LoginValues {
  usernameOrEmail: string;
  password: string;
}

const initialValues: LoginValues = {
  usernameOrEmail: "",
  password: "",
};

const validationSchema = Yup.object({
  usernameOrEmail: Yup.string().min(3).required().label("Username or Email"),
  password: Yup.string().min(6).required().label("Password"),
});

export default withUrqlClient(createUrqlClient)(Login);
