import {
  FormControl,
  FormErrorIcon,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "formik";
import React, { InputHTMLAttributes } from "react";

type InputFielsProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label: string;
  textarea?: boolean;
};

export const InputField: React.FC<InputFielsProps> = ({
  name,
  label,
  textarea = false,
  size: _,
  ...props
}) => {
  let InputOrTextarea = Input as React.FC<any>;
  if (textarea) {
    InputOrTextarea = Textarea as React.FC<any>;
  }
  return (
    <Field name={name}>
      {({ field, form }: any) => (
        <FormControl isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel htmlFor={name}>{label}</FormLabel>
          <InputOrTextarea id={name} {...field} {...props} />

          <FormErrorMessage>
            <FormErrorIcon /> {form.errors[name]}
          </FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
