import React from "react";
import { graphql } from "gatsby";
import Layout from "../../components/layout";
import Map from "../../components/map";

const MapPage = ({ data: { mapsYaml: mapData } }) => {
  return (
    <Layout>
      <Map {...mapData} />
    </Layout>
  );
};

export const query = graphql`
  query QueryMapById($id: String) {
    mapsYaml(id: { eq: $id }) {
      name
      blueprints {
        name
        url
        level
      }
    }
  }
`;

export default MapPage;
