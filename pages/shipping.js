import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import CheckoutWizard from "../components/CheckoutWizard";
import { Layout } from "../components/Layout";
import { Store } from "../utils/Store";

const ShippingScreen = () => {
  const { state, dispatch } = useContext(Store);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm();
  const { cart } = state;
  const { shippingAddress } = cart;
  useEffect(() => {
    setValue("fullName", shippingAddress.fullName);
    setValue("address", shippingAddress.address);
    setValue("city", shippingAddress.city);
    setValue("postalCode", shippingAddress.postalCode);
    setValue("country", shippingAddress.country);
  }, [setValue, shippingAddress]);

  const submitHandler = ({ fullName, address, city, postalCode, country }) => {
    console.log(fullName);
    dispatch({
      type: "save_shipping_address",
      payload: { fullName, address, city, postalCode, country },
    });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        shippingAddress: {
          fullName,
          address,
          city,
          postalCode,
          country,
        },
      })
    );
    router.push("/payment");
  };
  return (
    <Layout title={"Shipping Address"}>
      <CheckoutWizard activeStep={1}></CheckoutWizard>
      <form
        className=" mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className=" mb-4 text-xl">Shipping Address</h1>
        <div className=" mb-4">
          <label htmlFor="fullName">Full Name</label>
          <input
            className=" w-full"
            type="text"
            id="fullName"
            autoFocus
            {...register("fullName", { required: "Please Enter Name" })}
          />
          {errors.fullName ? (
            <div className=" text-red-500">{errors.fullName.message}</div>
          ) : null}
          <label htmlFor=" address">Address</label>

          <input
            className=" w-full"
            type="text"
            id="address"
            autoFocus
            {...register("address", {
              required: "Please Enter Address",
              minLength: {
                value: 3,
                message: "address is more than 3 characters",
              },
            })}
          />
          {errors.address ? (
            <div className=" text-red-500">{errors.address.message}</div>
          ) : null}
          <label htmlFor="city">City</label>
          <input
            className=" w-full"
            type="text"
            id="city"
            autoFocus
            {...register("city", { required: "Please Enter City" })}
          />
          {errors.city ? (
            <div className=" text-red-500">{errors.city.message}</div>
          ) : null}
          <label htmlFor="postalCode">Postal Code</label>
          <input
            className=" w-full"
            type="text"
            id="postalCode"
            autoFocus
            {...register("postalCode", {
              required: "Please Enter Postal Code",
            })}
          />
          {errors.postalCode ? (
            <div className=" text-red-500">{errors.postalCode.message}</div>
          ) : null}
          <label htmlFor="country">Country</label>
          <input
            className=" w-full"
            type="text"
            id="country"
            autoFocus
            {...register("country", { required: "Please Enter Country" })}
          />
          {errors.country ? (
            <div className=" text-red-500">{errors.country.message}</div>
          ) : null}
        </div>
        <div className=" mb-4 flex justify-between">
          <button className=" primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
};

export default ShippingScreen;
ShippingScreen.auth = true;
