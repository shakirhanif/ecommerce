import { Layout } from "../components/Layout";
import { ProductItems } from "../components/ProductItems";
import Product from "../models/Product";
import data from "../utils/data";
import db from "../utils/db";

export default function Home({ products }) {
  return (
    <Layout title="Home">
      <div className=" grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((pro) => {
          return <ProductItems product={pro} key={pro.slug}></ProductItems>;
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
