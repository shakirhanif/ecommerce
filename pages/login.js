import Link from "next/link";
import React from "react";
import { signIn, useSession } from "next-auth/react";
import { Layout } from "../components/Layout";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import { useRouter } from "next/router";

const loginScreen = () => {
  const { data: session } = useSession();
  router = useRouter();
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
  } = useForm();
  const submitHandler = async ({ email, password }) => {
    // console.log(email);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: email,
        password: password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
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
