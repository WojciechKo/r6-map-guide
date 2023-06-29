import Layout from "@/components/Layout";
import MapViewer from "@/components/MapViewer";
import { MapsProvider } from "@/contexts/MapsContext";
import { graphql, PageProps } from "gatsby";
import React, { FC, useState } from "react";

export const query = graphql`
  query MapPageData($id: String) {
    allMaps: allMapsYaml(sort: { name: ASC }) {
      nodes {
        slug
        name
      }
    }
    selectedMap: mapsYaml(id: { eq: $id }) {
      slug
      name
      blueprints {
        name
        url
      }
    }
  }
`;

const MapPage: FC<PageProps<Queries.MapPageDataQuery>> = ({ data: { allMaps, selectedMap } }) => {
  const [baseFloor, setBaseFloor] = useState(0);
  return (
    <MapsProvider value={{ allMaps: allMaps.nodes, selectedMap, baseFloor, setBaseFloor }}>
      <Layout>
        <MapViewer />
      </Layout>
    </MapsProvider>
  );
};

export default MapPage;
