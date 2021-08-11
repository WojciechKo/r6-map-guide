import React from "react";
import { graphql } from "gatsby";

import Layout from "../../components/layout";
import MapViewer from "../../components/mapViewer";
import { SelectedMapContext } from "../../components/contexts/mapsContext";

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
