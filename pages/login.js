import Link from "next/link";
import React from "react";
import { Layout } from "../components/Layout";
import { useForm } from "react-hook-form";

const loginScreen = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const submitHandler = ({ email, password }) => {
    console.log(email);
    console.log(password);
  };
  return (
    <Layout title="Login">
      <form
        className=" mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className=" text-xl mb-4">Login</h1>
        <div className=" mb-4">
          <label htmlFor="email">Email</label>
          <input
            {...register("email", {
              required: "Please enter email",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Enter valid email address",
              },
            })}
            type="email"
            id="email"
            className=" w-full"
            autoFocus
          />
          {errors.email ? (
            <div className=" text-red-500">{errors.email.message}</div>
          ) : null}
        </div>
        <div className=" mb-4">
          <label htmlFor="password">Password</label>
          <input
            {...register("password", {
              required: "Please enter password",
              minLength: {
                value: 5,
                message: "Password should be at least 5 character long.",
              },
            })}
            type="password"
            id="password"
            className=" w-full"
            autoFocus
          />
          {errors.password && (
            <div className=" text-red-500">{errors.password.message}</div>
          )}
        </div>
        <div className=" mb-4">
          <button className=" primary-button">Login</button>
        </div>
        <div className=" mb-4">
          Don&apos;t have an account? &nbsp;
          <Link href="/register">Register</Link>
        </div>
      </form>
    </Layout>
  );
};

export default loginScreen;
