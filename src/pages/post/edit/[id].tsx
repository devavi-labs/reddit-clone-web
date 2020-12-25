import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Center,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React from "react";
import { Layout } from "../../../components/Layout";
import { LazyLoading } from "../../../components/LazyLoading";
import { createUrqlClient } from "../../../utis/createUrqlClient";
import { getPostFromId } from "../../../utis/useGetPostFromId";
import * as Yup from "yup";
import { InputField } from "../../../components/InputField";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { useRouter } from "next/router";

const EditPost = () => {
  const { data, error, fetching, id } = getPostFromId();
  const [{ fetching: updating }, updatePost] = useUpdatePostMutation();

  const router = useRouter();
  const toast = useToast();

  const initialValues: EditPostValues = {
    title: data?.post?.title || "",
    text: data?.post?.text || "",
  };
  const handleSubmit = async ({ text, title }: EditPostValues) => {
    const { data, error } = await updatePost({ id, text, title });
    if (data?.updatePost) {
      router.push((router.query.from as string) || "/");
    }
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
  };
  return (
    <Layout>
      {error ? (
        <Center>
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        </Center>
      ) : !fetching && !data?.post ? (
        <Center>
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>Couldn't find the post</AlertDescription>
          </Alert>
        </Center>
      ) : (
        <LazyLoading loading={fetching}>
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
                    isLoading={updating}
                    loadingText="Updating"
                  >
                    Update
                  </Button>
                </Center>
              </Form>
            )}
          </Formik>
        </LazyLoading>
      )}
    </Layout>
  );
};

interface EditPostValues {
  title: string;
  text: string;
}

const validationSchema = Yup.object({
  title: Yup.string().label("Title"),
  text: Yup.string().label("Body"),
});

export default withUrqlClient(createUrqlClient, { ssr: true })(EditPost);
