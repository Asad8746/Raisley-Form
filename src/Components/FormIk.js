import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Input from "./Input";
import SuccessMessage from "./SuccessMessage";
import ErrorMessage from "./ErrorMessage";
import "./form.css";

// Component
const MyForm = () => {
  const [isSucceed, setSucceed] = useState(null);
  const [message, setMessage] = useState("");
  // FormIk Hook
  // For validating form i am using yup with Formik
  const formik = useFormik({
    initialValues: {
      f_name: "",
      l_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: yup.object({
      f_name: yup
        .string()
        .required("First Name is required")
        .min(3, "First Name must be greater than 3")
        .max(25, "First Name must be greater than 15"),
      l_name: yup
        .string()
        .required("Last Name is required")
        .min(3, "Last Name must be greater than 3")
        .max(25, "Last Name must be greater than 15"),
      email: yup
        .string()
        .required("Email is required")
        .email("Provide a Valid Email"),
      password: yup
        .string()
        .required("Password is Required")
        .min(8, "Use At Least 8 Characters")
        .matches(
          /^(?=.*[\d])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,}$/,
          "Please Enter a Strong Password that must contains 1 capital letter 1 number and 1 special character (@,#,$,%)"
        ),
      confirmPassword: yup
        .string()
        .oneOf(
          [yup.ref("password"), ""],
          "Confirm Password must match Password"
        )
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      sendReq(values);
    },
  });

  // Axios Function to send post REquest to Raisely Servers
  const sendReq = async (formvalues) => {
    setMessage("");
    setSucceed(null);
    try {
      const response = await axios.post("https://api.raisely.com/v3/signup", {
        campaignUuid: "46aa3270-d2ee-11ea-a9f0-e9a68ccff42a",
        data: {
          firstName: formvalues.f_name,
          lastName: formvalues.l_name,
          email: formvalues.email,
          password: formvalues.password,
        },
      });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        setMessage(response.data.message);
        setSucceed("success");
      }
    } catch (err) {
      const { errors } = err.response.data;
      setMessage(errors[0].message);
      setSucceed("failed");
    }
  };

  // Helper Functions
  // A function that will render Component based on isSucceed
  const renderMessage = () => {
    if (isSucceed === "success") {
      return <SuccessMessage message={message} />;
    } else if (isSucceed === "failed") {
      return <ErrorMessage message={message} />;
    }
  };
  return (
    <div className="ui segment" id="form-container">
      <h1>Raisely</h1>
      <h4 class="ui dividing header">Create your Account</h4>
      <form onSubmit={formik.handleSubmit} className="ui form error">
        <div className="required field">
          <label htmlFor="name">Name</label>
          <div className="two fields">
            <Input
              type="text"
              name="f_name"
              id="name"
              formik={formik}
              placeholder="First Name"
            />
            <Input
              type="text"
              name="l_name"
              formik={formik}
              placeholder="Last Name"
            />
          </div>
        </div>

        <Input
          type="email"
          label="Email"
          name="email"
          formik={formik}
          placeholder="Email"
        />
        <Input
          type="password"
          label="Password"
          name="password"
          formik={formik}
          placeholder="Password"
        />
        <Input
          type="password"
          label="Confirm Password"
          name="confirmPassword"
          formik={formik}
          placeholder="Confrim Password"
        />
        <div style={{ width: "100%", textAlign: "center" }}>
          <button type="submit" className="ui orange button">
            Sign Up
          </button>
        </div>
      </form>
      {renderMessage()}
    </div>
  );
};

export default MyForm;
