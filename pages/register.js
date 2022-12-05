import Link from "next/link";
import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { Layout } from "../components/Layout";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import { useRouter } from "next/router";
import axios from "axios";

const loginScreen = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect } = router.query;
  useEffect(() => {
    if (session?.user) {
      //means user has signed in
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
  } = useForm();
  const submitHandler = async ({ name, email, password }) => {
    // console.log(email);
    try {
      await axios.post("api/auth/signup", {
        name,
        email,
        password,
      });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Create Account">
      <form
        className=" mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className=" text-xl mb-4">Create Account</h1>
        <div className=" mb-4">
          <label htmlFor="name">Name</label>
          <input
            {...register("name", {
              required: "Please enter username",
            })}
            type="name"
            id="name"
            className=" w-full"
            autoFocus
          />
          {errors.name ? (
            <div className=" text-red-500">{errors.name.message}</div>
          ) : null}
        </div>
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
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            {...register("confirmPassword", {
              required: "Please Confirm password",
              validate: (value) => value === getValues("password"),
              minLength: {
                value: 5,
                message:
                  "Confirm Password should be at least 5 character long.",
              },
            })}
            type="password"
            id="confirmPassword"
            className=" w-full"
            autoFocus
          />
          {errors.confirmPassword && (
            <div className=" text-red-500">
              {errors.confirmPassword.message}
            </div>
          )}
          {errors.confirmPassword &&
            errors.confirmPassword.type === "validate" && (
              <div className=" text-red-500">Password does not match</div>
            )}
        </div>

        <div className=" mb-4">
          <button className=" primary-button">Register</button>
        </div>
        <div className=" mb-4">
          Don&apos;t have an account? &nbsp;
          <Link href={`/register?redirect${redirect || "/"}`}>Register</Link>
        </div>
      </form>
    </Layout>
  );
};

export default loginScreen;
