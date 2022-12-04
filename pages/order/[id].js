import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useReducer } from "react";
import { Layout } from "../../components/Layout";
import { getError } from "../../utils/error";

const OrderScreen = () => {
  function reducer(state, action) {
    switch (action.type) {
      case "fetch_request":
        return { ...state, loading: true, error: "" };
      case "fetch_success":
        return { ...state, loading: false, order: action.payload, error: "" };
      case "fetch_fail":
        return { ...state, loading: false, error: action.payload };
      default:
        state;
    }
  }
  const { query } = useRouter();
  const orderId = query.id;
  const [{ loading, error, order }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
  });
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "fetch_request" });
        const response = await axios.get(`/api/orders/${orderId}`);
        console.log(response);
        const data = response.data;
        dispatch({ type: "fetch_success", payload: data });
      } catch (err) {
        dispatch({ type: "fetch_fail", payload: getError(err) });
      }
    };
    if (!order._id || (order._id && order._id !== orderId)) {
      fetchOrder();
    }
  }, [order, orderId]);
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  return (
    <Layout title={`Order ${orderId}`}>
      <h1 className=" mb-4 text-xl">{`Order ${orderId}`}</h1>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="alert-erro">{error}</div>
      ) : (
        <div className=" grid md:grid-cols-4 md:gap-5">
          <div className=" overflow-x-auto md:col-span-3">
            <div className=" card p-5">
              <h2 className=" mb-2 text-lg">Shipping Address</h2>
              <div>
                {shippingAddress.fullName},{shippingAddress.address},
                {shippingAddress.city},{shippingAddress.postalCode} ,
                {shippingAddress.country}
              </div>
              {isDelivered ? (
                <div className=" alert-success">{deliveredAt}</div>
              ) : (
                <div className=" alert-error">Not Delivered</div>
              )}
            </div>
            <div className=" card p-5">
              <h2 className=" mb-2 text-lg">Payment Method</h2>
              <div>{paymentMethod}</div>
              {isPaid ? (
                <div className=" alert-success">Paid at {paidAt}</div>
              ) : (
                <div className=" alert-error">Not Paid</div>
              )}
            </div>
            <div className=" card overflow-x-auto p-5">
              <h2 className="text-lg mb-2">Order Items</h2>
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
                  {orderItems.map((x) => (
                    <tr key={x._id} className="border-b">
                      <td>
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
                      <td className=" p-5 text-right">{x.price}</td>
                      <td className=" p-5 text-right">
                        {x.quantity * x.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <div className=" card p-5">
              <h2 className=" text-lg mb-2">Order Summary</h2>
              <ul>
                <li>
                  <div className="  mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="  mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="  mb-2 flex justify-between">
                    <div>Shipping Price</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="  mb-2 flex justify-between">
                    <div>Total Price</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
OrderScreen.auth = true;
export default OrderScreen;
