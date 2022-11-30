import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { Layout } from "../components/Layout";
import { Store } from "../utils/Store";
import { useRouter } from "next/router";

export const CartScreen = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const removeItemHandler = (item) => {
    dispatch({ type: "cart_remove_item", payload: item });
  };
  return (
    <Layout title="Shopping Cart">
      <h1 className=" text-xl mb-4">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty.<Link href="/">Go Shopping</Link>:
        </div>
      ) : (
        <div className=" grid md:grid-cols-4 md:gap-5">
          <div className=" overflow-x-auto md:col-span-3">
            <table className=" min-w-full ">
              <thead className=" border-b">
                <tr>
                  <th className=" px-5 text-left">Item</th>
                  <th className=" p-5 text-right">Quantity</th>
                  <th className=" p-5 text-right">Price</th>
                  <th className=" p-5">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((x) => (
                  <tr key={x.slug} className="border-b">
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
                    <td>{x.quantity}</td>
                    <td>${x.price}</td>
                    <td>
                      <button onClick={() => removeItemHandler(x)}>
                        <XCircleIcon className="h-5 w-5"></XCircleIcon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className=" card p-5">
            <ul>
              <li>
                <div className=" pb-2 text-xl text-center">
                  Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}):
                  {" $"}
                  {cartItems.reduce((a, c) => a + c.price, 0)}
                </div>
              </li>
              <li>
                <button
                  className=" w-full primary-button"
                  onClick={() => router.push("/shipping")}
                >
                  {" "}
                  Check Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CartScreen;
