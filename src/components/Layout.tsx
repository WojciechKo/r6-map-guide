import React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import theme from "./theme";
import AppBar from "./AppBar";
import { MapsContext } from "../contexts/MapsContext";

const GlobalStyle = createGlobalStyle`
  a, a:hover, a:focus, a:active {
    text-decoration: none;
    color: inherit;
  }
`;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-flow: column nowrap;
`;

const Page = styled.main`
  overflow: hidden;
  flex: 1 1;
`;

const Layout = ({ children }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
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
  `);

  const maps = data.allMapsYaml.nodes.map((mapData) => ({
    name: mapData.name,
    id: mapData.parent.name,
  }));

  return (
    <MuiThemeProvider theme={theme}>
      <ThemeProvider theme={theme}>
        <MapsContext.Provider value={maps}>
          <CssBaseline />
          <GlobalStyle />

          <Helmet>
            <meta charSet="utf-8" />
            <title>{data.site.siteMetadata.title}</title>

            <meta
              name="viewport"
              content="minimum-scale=1, initial-scale=1, width=device-width"
            />

            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/icon?family=Material+Icons"
            />
          </Helmet>

          <Container>
            <AppBar />

            <Page>{children}</Page>
          </Container>
        </MapsContext.Provider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default Layout;
