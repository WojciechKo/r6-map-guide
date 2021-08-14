import { graphql } from "gatsby";
import React from "react";
import Layout from "../../components/Layout";
import MapViewer from "../../components/MapViewer";
import { SelectedMapContext } from "../../contexts/MapsContext";

const MapPage = ({ data: { mapsYaml: mapData }, pageContext: { id } }) => {
  return (
    <SelectedMapContext.Provider value={id}>
      <Layout>
        <MapViewer {...mapData} />
      </Layout>
    </SelectedMapContext.Provider>
  );
};

export const query = graphql`
  query QueryMapById($id: String) {
    mapsYaml(id: { eq: $id }) {
      id
      name
      blueprints {
        name
        url
      }
    }
  }
`;

export default MapPage;
