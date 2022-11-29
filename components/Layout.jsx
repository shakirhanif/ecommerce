import React from "react";
import Head from "next/head";
import Link from "next/link";

export const Layout = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title ? title + " OSum" : "OSum"}</title>
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
