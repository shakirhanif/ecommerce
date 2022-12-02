import React, { useContext, useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Store } from "../utils/Store";
import { signOut, useSession } from "next-auth/react";
import { Menu } from "@headlessui/react";
import Cookies from "js-cookie";

export const Layout = ({ children, title }) => {
  const { status, data: session } = useSession();
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);
  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a, c) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove("cart");
    dispatch({ type: "cart_reset" });
    signOut({ callbackUrl: "/login" });
  };

  return (
    <>
      <Head>
        <title>{title ? title + " | OSum" : "OSum"}</title>
        <meta name="OSum" content="OSum store" />
        <link rel="icon" href="" />
      </Head>
      <ToastContainer position="bottom-center" limit={1}></ToastContainer>
      <div className=" flex min-h-screen flex-col justify-between">
        <header>
          <nav className=" flex h-12 justify-between items-center px-4 shadow-md">
            <Link href="/" className=" text-lg font-bold ">
              Osum
            </Link>
            <div>
              <Link href="/cart" className="p-2">
                Cart
                {cartItemsCount > 0 ? (
                  <span className=" ml-1 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white  ">
                    {cartItemsCount}
                  </span>
                ) : null}
              </Link>
              {status === "loading" ? (
                "Loading"
              ) : session?.user ? (
                <Menu as="div" className=" relative inline-block">
                  <Menu.Button className=" text-blue-600">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className=" absolute right-0 w-56 origin-top-right bg-white shadow-lg">
                    <Menu.Item>
                      <Link className=" dropdown-link" href="/profile">
                        Profile
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link className=" dropdown-link" href="/order-history">
                        Order History
                      </Link>
                    </Menu.Item>
                    <Menu.Item>
                      <Link
                        className=" dropdown-link"
                        href="/#"
                        onClick={logoutClickHandler}
                      >
                        Logout
                      </Link>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link href="/login" className=" p-2">
                  Login
                </Link>
              )}
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
