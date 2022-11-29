import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { Layout } from "../../components/Layout";
import data from "../../utils/data";

export const ProductDetail = () => {
  const slug = useRouter().query.slug;
  const product = data.products.find((x) => slug === x.slug);
  if (!product) {
    return <div>Product not Found</div>;
  }
  return (
    <Layout title={product.name}>
      <div className=" py-2">
        <Link href="/"> Back to Products</Link>
      </div>
      <div className=" grid md:grid-cols-4 md:gap-3">
        <div className=" md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>{product.name}</li>
            <li>Category: {product.category}</li>
            <li>Brand: {product.brand}</li>
            <li>
              {product.rating} of {product.numReviews} Reviews
            </li>
            <li>Description: {product.description}</li>
          </ul>
        </div>
        <div className=" card p-5">
          next div
          <div className=" mb-2 flex justify-between">
            <div>Price: </div>
            <div>${product.price}</div>
          </div>
          <div className=" mb-2 flex justify-between">
            <div>Status</div>
            <div>
              {product.countInStock > 0 ? "In stock" : "Out of Stock "}{" "}
            </div>
          </div>
          <button className=" primary-button w-full ">Add to Cart</button>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
