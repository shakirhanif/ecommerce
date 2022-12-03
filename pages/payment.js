import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import CheckoutWizard from "../components/CheckoutWizard";
import { Layout } from "../components/Layout";
import { Store } from "../utils/Store";

const PaymentScreen = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { shippingAddress, paymentMethod } = cart;
  const router = useRouter();
  function submitHandler(e) {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      return toast.error("Payment Method is required");
    }
    dispatch({ type: "save_payment_method", payload: selectedPaymentMethod });
    Cookies.set(
      "cart",
      JSON.stringify({
        ...cart,
        paymentMethod: selectedPaymentMethod,
      })
    );
    router.push("/placeorder");
  }
  useEffect(() => {
    if (!shippingAddress.address) {
      return router.push("/shipping");
    }
    setSelectedPaymentMethod(paymentMethod || "");
  }, [paymentMethod, router, shippingAddress.address]);
  return (
    <Layout title="Payment Method">
      <CheckoutWizard activeStep={2}></CheckoutWizard>
      <form className=" mx-auto max-w-screen-md" onSubmit={submitHandler}>
        <h1 className="mb-4 text-xl ">Payment Method</h1>
        {["Paypal", "Stripe", "CashOnDelivery"].map((x) => (
          <div key={x} className=" mb-4">
            <input
              type="radio"
              id={x}
              className=" p-2 outline-none focus:ring-0"
              checked={selectedPaymentMethod === x}
              onChange={() => setSelectedPaymentMethod(x)}
            />
            <label htmlFor={x} className=" p-2">
              {x}
            </label>
          </div>
        ))}
        <div className=" flex justify-between mb-4">
          <button
            className=" default-button"
            type="button"
            onClick={() => router.push("/shipping")}
          >
            Back
          </button>
          <button className="primary-button">Next</button>
        </div>
      </form>
    </Layout>
  );
};

export default PaymentScreen;
