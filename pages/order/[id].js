import axios from "axios";
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

  return <Layout title={`Order ${orderId}`}></Layout>;
};
OrderScreen.auth = true;
export default OrderScreen;
