import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: "https://www.yourdomain.tld",
    title: "Rainbow Six Siege | Map guide",
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-tsconfig-paths",
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-styled-components",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    `gatsby-transformer-yaml`,
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/data/`,
      },
    },
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        icon: "src/images/favicon-96.png",
        icons: [
          {
            src: "src/images/favicon-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "src/images/favicon-32.png",
            sizes: "32x32",
            type: "image/png",
          },
          {
            src: "src/images/favicon-16.png",
            sizes: "16x16",
            type: "image/png",
          },
        ],
      },
    },
  ],
};

export default config;
