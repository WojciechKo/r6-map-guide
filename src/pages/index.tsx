import React from "react";
import { Link, PageProps } from "gatsby";
import Layout from "../components/layout";

const IndexPage = () => (
  <Layout>
    <h1>Welcome to my Gatsby site!</h1>
    <ul>
      <li>
        <Link to="/maps/bank">Bank</Link>
      </li>
      <li>
        <Link to="/maps/clubhouse">Clubhouse</Link>
      </li>
    </ul>
  </Layout>
);

export default IndexPage;
