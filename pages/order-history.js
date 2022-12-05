import axios from "axios";
import Link from "next/link";
import React from "react";
import { useReducer } from "react";
import { useEffect } from "react";
import { Layout } from "../components/Layout";
import { getError } from "../utils/error";

function reducer(state, action) {
  switch (action.type) {
    case "fetch_request":
      return { ...state, loading: true, error: "" };
    case "fetch_success":
      return { ...state, loading: false, error: "", orders: action.payload };
    case "fetch_fail":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const OrderHistory = () => {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: "fetch_request" });
        const { data } = await axios.get("api/orders/history");
        dispatch({ type: "fetch_success", payload: data });
      } catch (err) {
        dispatch({ type: "fetch_fail", payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);
  return (
    <Layout title="Order History">
      <h1 className=" text-xl mb-4">Order History</h1>
      {loading ? (
        <div>...loading</div>
      ) : error ? (
        <div className=" alert-error">{error}</div>
      ) : (
        <div className=" overflow-x-auto">
          <table className=" min-w-full">
            <thead className=" border-b">
              <tr>
                <th className=" px-5 text-left">ID</th>
                <th className=" px-5 text-left">DATE</th>
                <th className=" px-5 text-left">TOTAL</th>
                <th className=" px-5 text-left">PAID</th>
                <th className=" px-5 text-left">DELIVERED</th>
                <th className=" px-5 text-left">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((x) => (
                <tr className="border-b" key={x._id}>
                  <td className=" p-5">{x._id.substring(20, 24)}</td>
                  <td className=" p-5">{x.createdAt.substring(0, 10)}</td>
                  <td className=" p-5">{x.totalPrice}</td>
                  <td className=" p-5">{x.isPaid ? "paid" : "not paid"}</td>
                  <td className=" p-5">
                    {x.isDelivered ? "Delivered" : "not delivered"}
                  </td>
                  <td className=" p-5">
                    <Link href={`/order/${x._id}`}>Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

OrderHistory.auth = true;
export default OrderHistory;
