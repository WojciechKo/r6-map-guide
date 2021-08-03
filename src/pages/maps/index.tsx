import React from "react";
import { Link, graphql } from "gatsby";
import Layout from "../../components/layout";

const MapsPage = ({ data }) => (
  <Layout>
    <ul>
      {data.allMapsYaml.nodes.map((map) => (
        <li key={map.parent.id}>
          <Link to={`/maps/${map.parent.name}`}>{map.name}</Link>
        </li>
      ))}
    </ul>
  </Layout>
);

export const query = graphql`
  query {
    allMapsYaml(sort: { fields: name, order: ASC }) {
      nodes {
        parent {
          ... on File {
            id
            name
          }
        }
        name
      }
    }
  }
`;

export default MapsPage;
