import React from "react";
import { graphql } from "gatsby";
import Layout from "../../components/layout";
import Map from "../../components/map";

const MapPage = ({ data }) => {
  const {
    mapsYaml: { name },
  } = data;

  return (
    <Layout>
      <Map name={name} />
    </Layout>
  );
};

export const query = graphql`
  query QueryMapById($id: String) {
    mapsYaml(id: { eq: $id }) {
      name
    }
  }
`;

export default MapPage;
