import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Layout } from "../components/Layout";
import { getError } from "../utils/error";

const ProfileScreen = () => {
  const { data: session } = useSession();
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    setValue("name", session.user.name);
    setValue("email", session.user.email);
  }, [session.user, getValues]);
  const submitHandler = async ({ name, email, password }) => {
    try {
      await axios.put("/api/auth/update", {
        name,
        email,
        password,
      });
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      toast.success("profile updated");
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Profile">
      <form
        className=" mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className=" mb-4 text-xl">Update Profile</h1>
        <div className=" mb-4">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            className=" w-full"
            autoFocus
            {...register("name", {
              required: "please enter name",
            })}
          />
          {errors.name ? (
            <div className=" text-red-500">{errors.name.message}</div>
          ) : null}
        </div>
        <div className=" mb-4">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            className=" w-full"
            autoFocus
            {...register("email", {
              required: "please enter email",
            })}
          />
          {errors.email ? (
            <div className=" text-red-500">{errors.email.message}</div>
          ) : null}
        </div>
        <div className=" mb-4">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            className=" w-full"
            autoFocus
            {...register("password", {
              required: "please enter password",
            })}
          />
          {errors.password ? (
            <div className=" text-red-500">{errors.password.message}</div>
          ) : null}
        </div>
        <div className=" mb-4">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            className=" w-full"
            autoFocus
            {...register("confirmPassword", {
              validate: (x) => x === getValues("password"),
            })}
          />
          {errors.confirmPassword ? (
            <div className=" text-red-500">
              {errors.confirmPassword.message}
            </div>
          ) : null}
          {errors.confirmPassword ? (
            errors.confirmPassword.type === "validate" ? (
              <div className=" text-red-500">password did not match</div>
            ) : null
          ) : null}
        </div>
        <div className=" mb-4">
          <button className=" primary-button">Update Profile</button>
        </div>
      </form>
    </Layout>
  );
};

ProfileScreen.auth = true;
export default ProfileScreen;
