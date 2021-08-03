import React from "react";
import { graphql } from "gatsby";
import Layout from "../../components/layout";
import MapViewer from "../../components/map_viewer";

const MapPage = ({ data: { mapsYaml: mapData } }) => {
  return (
    <Layout>
      <MapViewer {...mapData} />
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
