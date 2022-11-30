import Link from "next/link";
import React from "react";

export const ProductItems = ({ product }) => {
  return (
    <div className=" card">
      <Link href={`products/${product.slug}`}>
        <img
          src={product.image}
          alt={product.name}
          className=" rounded shadow"
        ></img>
      </Link>
      <div className=" flex flex-col items-center justify-center p-5">
        <Link href={`products/${product.slug}`}>
          <h2 className=" text-lg">{product.name}</h2>
        </Link>
        <p className=" mb-2">{product.brand}</p>
        <p>${product.price}</p>
        <button className=" primary-button " type="button">
          Add to Cart
        </button>
      </div>
    </div>
  );
};
