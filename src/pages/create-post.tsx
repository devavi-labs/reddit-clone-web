import { Button, Center, Spacer } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import * as Yup from "yup";
import { InputField } from "../components/InputField";
import { Layout } from "../components/Layout";
import { LazyLoading } from "../components/LazyLoading";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utis/createUrqlClient";
import { useIsAuth } from "../utis/useIsAuth";

const CreatePost = () => {
  const router = useRouter();

  const { fetching: checkingAuth } = useIsAuth();

  const [{ fetching }, createPost] = useCreatePostMutation();
  const handleSubmit = async (values: CreatePostValues) => {
    const { data } = await createPost({ options: values });
    if (data?.createPost) {
      router.push("/");
    }
  };
  return (
    <Layout variant="small">
      <LazyLoading loading={checkingAuth}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form>
              <InputField
                name="title"
                label="Title"
                placeholder="Title"
                type="text"
              />
              <Spacer height={4} />
              <InputField
                textarea
                name="text"
                label="Body"
                placeholder="Body"
                type="text"
              />
              <Spacer height={4} />
              <Center>
                <Button
                  colorScheme="teal"
                  type="submit"
                  isLoading={fetching}
                  loadingText="Creating"
                >
                  Create
                </Button>
              </Center>
            </Form>
          )}
        </Formik>
      </LazyLoading>
    </Layout>
  );
};

interface CreatePostValues {
  title: string;
  text: string;
}

const initialValues: CreatePostValues = {
  title: "",
  text: "",
};

const validationSchema = Yup.object({
  title: Yup.string().label("Title"),
  text: Yup.string().label("Body"),
});

export default withUrqlClient(createUrqlClient)(CreatePost);
