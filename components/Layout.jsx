import React, { useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { Store } from "../utils/Store";

export const Layout = ({ children, title }) => {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  return (
    <>
      <Head>
        <title>{title ? title + " --OSum" : "OSum"}</title>
        <meta name="OSum" content="OSum store" />
        <link rel="icon" href="" />
      </Head>
      <div className=" flex min-h-screen flex-col justify-between">
        <header>
          <nav className=" flex h-12 justify-between items-center px-4 shadow-md">
            <Link href="/" className=" text-lg font-bold ">
              Osum
            </Link>
            <div>
              <Link href="/cart" className="p-2">
                Cart
                {cart.cartItems.length > 0 ? (
                  <span className=" ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white  ">
                    {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </span>
                ) : null}
              </Link>
              <Link href="/login" className="p-2">
                Login
              </Link>
            </div>
          </nav>
        </header>
        <main className=" container m-auto mt-4 px-4">{children}</main>
        <footer className=" flex h-10 items-center justify-center shadow-inner">
          Copyright &#169; 2022 OSum
        </footer>
      </div>
    </>
  );
};
