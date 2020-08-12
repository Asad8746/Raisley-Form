import React from "react";
import ErrorMessage from "./ErrorMessage";

const Input = ({ label, type, name, id, placeholder, formik }) => {
  const checkIsValid = formik.touched[name] && formik.errors[name];
  const className = checkIsValid ? "required field error" : "required field";
  return (
    <div className={className}>
      {label ? <label htmlFor={id}>{label}</label> : null}
      <input
        type={type}
        name={name}
        id={id}
        placeholder={placeholder}
        {...formik.getFieldProps(name)}
      />
      {checkIsValid ? <ErrorMessage message={formik.errors[name]} /> : null}
    </div>
  );
};

export default Input;
