import Link from "next/link";
import React, { useEffect } from "react";
import { useContext } from "react";
import CheckoutWizard from "../components/CheckoutWizard";
import { Layout } from "../components/Layout";
import { Store } from "../utils/Store";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
import { getError } from "../utils/error";
import axios from "axios";
import Cookies from "js-cookie";

const PlaceOrderScreen = () => {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const { cartItems, shippingAddress, paymentMethod } = cart;
  const round2 = (x) => Math.round(x * 100 + Number.EPSILON) / 100;
  const itemsPrice = round2(cartItems.reduce((a, c) => a + c.price, 0));
  const shippingPrice = itemsPrice > 200 ? 0 : 15;
  const taxPrice = round2(itemsPrice * 0.15);
  const totalPrice = round2(itemsPrice + shippingPrice + taxPrice);
  const router = useRouter();
  useEffect(() => {
    if (!paymentMethod) {
      router.push("/payment");
    }
  }, [paymentMethod, router]);
  const [loading, setLoading] = useState(false);
  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post("/api/orders", {
        orderItems: cartItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      setLoading(false);
      dispatch({ type: "cart_clear_items" });
      Cookies.set(
        "cart",
        JSON.stringify({
          ...cart,
          cartItems: [],
        })
      );
      router.push(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      toast.error(getError(err));
    }
  };
  return (
    <Layout title="Place Order">
      <CheckoutWizard activeStep={3}></CheckoutWizard>
      <h1 className=" mb-4 text-xl">Place Order</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className=" overflow-x-auto md:col-span-3">
            <div className=" card p-5">
              <h2 className=" mb-2 text-lg">Shipping Address</h2>
              <div>
                {shippingAddress.fullName},{shippingAddress.address},
                {shippingAddress.city},{shippingAddress.postalCode} ,
                {shippingAddress.country}
              </div>
              <div>
                <Link href="/shipping">Edit</Link>
              </div>
            </div>
            <div className=" card p-5">
              <h2 className=" mb-2 text-lg"> Payment Method</h2>
              <div>{paymentMethod}</div>
              <div>
                <Link href="/payment">Edit</Link>
              </div>
            </div>
            <div className=" card overflow-x-auto p-5">
              <h2 className=" mb-2 text-lg">Order Items</h2>
              <table className=" min-w-full ">
                <thead className=" border-b">
                  <tr>
                    <th className=" px-5 text-left">Item</th>
                    <th className=" p-5 text-right">Quantity</th>
                    <th className=" p-5 text-right">Price</th>
                    <th className=" p-5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((x) => (
                    <tr key={x.slug} className="border-b">
                      <td className=" p-5 text-right">
                        <Link
                          href={`/products/${x.slug}`}
                          className="flex items-center"
                        >
                          <Image
                            src={x.image}
                            alt={x.name}
                            width={50}
                            height={50}
                          ></Image>
                          &nbsp;
                          {x.name}
                        </Link>
                      </td>
                      <td className=" p-5 text-right">{x.quantity}</td>
                      <td className=" p-5 text-right">${x.price}</td>
                      <td className=" p-5 text-right">
                        ${x.quantity * x.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Link href="/cart">Edit</Link>
            </div>
          </div>
          <div>
            <div>
              <div className=" card p-5">
                <ul>
                  <li>
                    <div className=" mb-2 flex justify-between">
                      <div>Items</div>
                      <div>${itemsPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className=" mb-2 flex justify-between">
                      <div>Tax</div>
                      <div>${taxPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className=" mb-2 flex justify-between">
                      <div>Shipping</div>
                      <div>${shippingPrice}</div>
                    </div>
                  </li>
                  <li>
                    <div className=" mb-2 flex justify-between">
                      <div>Total</div>
                      <div>${totalPrice}</div>
                    </div>
                  </li>
                  <li>
                    <button
                      disabled={loading}
                      onClick={placeOrderHandler}
                      className=" primary-button w-full"
                    >
                      {loading ? "...loading" : "Place Order"}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PlaceOrderScreen;

PlaceOrderScreen.auth = true;