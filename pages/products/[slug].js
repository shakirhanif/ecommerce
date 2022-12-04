import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext } from "react";
import { Layout } from "../../components/Layout";
import Product from "../../models/Product";
import data from "../../utils/data";
import db from "../../utils/db";
import { Store } from "../../utils/Store";

export const ProductDetail = (props) => {
  const router = useRouter();
  const { product } = props;
  if (!product) {
    return <Layout title="Product not Found">Product not Found</Layout>;
  }
  const { state, dispatch } = useContext(Store);
  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      alert("Sorry, Product Out of Stock");
      return;
    }
    dispatch({
      type: "add_cart_item",
      payload: { ...product, quantity: quantity },
    });
    router.push("/cart");
  };
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
          <button
            className=" primary-button w-full "
            onClick={addToCartHandler}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(con) {
  const { params } = con;
  const { slug } = params;
  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}

export default ProductDetail;
