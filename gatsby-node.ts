import path from "path";

import type { GatsbyNode } from "gatsby";
export const createPages: GatsbyNode["createPages"] = ({ actions }) => {
  const { createRedirect } = actions;

  createRedirect({
    fromPath: `/`,
    toPath: `/maps`,
    isPermanent: true,
  });
};

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({ actions }) => {
  const { createTypes } = actions;

  createTypes(`
    type MapsYaml implements Node {
      slug: String!,
      name: String!,
      blueprints: [MapsYamlBlueprints!]!,
    }
    type MapsYamlBlueprints implements Node {
      name: String!,
      url: String!,
    }
  `);
};
