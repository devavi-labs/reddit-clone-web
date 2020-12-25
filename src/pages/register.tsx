import { Button, Center, Spacer } from "@chakra-ui/react";
import { Form, Formik, FormikHelpers } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { useRegisterMutation } from "../generated/graphql";
import { createUrqlClient } from "../utis/createUrqlClient";
import { mapErrors } from "../utis/mapErrors";

const Register = () => {
  const router = useRouter();

  const [, register] = useRegisterMutation();

  const handleSubmit = async (
    values: RegisterValues,
    { setErrors }: FormikHelpers<RegisterValues>
  ) => {
    const response = await register({ options: values });
    if (response.data?.register.errors) {
      setErrors(mapErrors(response.data.register.errors));
    } else if (response.data?.register.user) {
      router.push("/");
    }
  };

  return (
    <Layout>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form>
            <InputField
              name="name"
              label="Name"
              placeholder="Name"
              type="text"
            />
            <Spacer height={4} />
            <InputField
              name="email"
              label="Email"
              placeholder="Email"
              type="text"
            />
            <Spacer height={4} />
            <InputField
              name="username"
              label="Username"
              placeholder="Username"
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
              <Button colorScheme="teal" type="submit">
                Register
              </Button>
            </Center>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

interface RegisterValues {
  name: string;
  email: string;
  username: string;
  password: string;
}

const initialValues: RegisterValues = {
  name: "",
  email: "",
  username: "",
  password: "",
};

const validationSchema = Yup.object({
  name: Yup.string().min(3).required().label("Name"),
  email: Yup.string().email().label("Email"),
  username: Yup.string().min(3).required().label("Username"),
  password: Yup.string().min(6).required().label("Password"),
});

export default withUrqlClient(createUrqlClient)(Register);
