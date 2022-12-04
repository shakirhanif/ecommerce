import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import { Layout } from "../components/Layout";
import { ProductItems } from "../components/ProductItems";
import Product from "../models/Product";
import data from "../utils/data";
import db from "../utils/db";
import { Store } from "../utils/Store";

export default function Home({ products }) {
  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const addToCartHandler = async (product) => {
    const existItem = cart.cartItems.find((x) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      return toast.error("sorry product out of stock");
    }
    dispatch({
      type: "add_cart_item",
      payload: { ...product, quantity: quantity },
    });
    toast.success("successsfully added product to cart");
  };
  return (
    <Layout title="Home">
      <div className=" grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((pro) => {
          return (
            <ProductItems
              product={pro}
              key={pro.slug}
              addToCartHandler={() => addToCartHandler(pro)}
            ></ProductItems>
          );
        })}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
