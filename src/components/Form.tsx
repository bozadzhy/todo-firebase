import React, { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface FormProps {
  title: string;
  handleClick: (email: string, password: string, name: string) => void;
}
interface FormValues {
  name: string;
  email: string;
  password: string;
}

const FormComponent: FC<FormProps> = ({ title, handleClick }) => {
  const initialValues = {
    name: "",
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Ім'я занадто коротке")
      .required("Ім'я обов'язкове"),
    email: Yup.string()
      .email("Неправильний формат email")
      .required("Email обов'язковий"),
    password: Yup.string()
      .min(6, "Пароль має містити щонайменше 6 символів")
      .required("Пароль обов'язковий"),
  });

  const onSubmit = (values: FormValues) => {
    const { email, password, name } = values;
    handleClick(email, password, name);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white flex flex-col gap-4">
      <h2 className="text-2xl font-bold text-center">{title}</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <div className="flex flex-col">
              <Field
                type="text"
                name="name"
                placeholder="Name"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-green-500"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="flex flex-col">
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-green-500"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="flex flex-col">
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-green-500"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-500 text-white rounded-lg p-2 hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {title}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default FormComponent;
