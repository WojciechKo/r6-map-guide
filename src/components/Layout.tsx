import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider as MuiThemeProvider } from "@material-ui/core/styles";
import { graphql, useStaticQuery } from "gatsby";
import React from "react";
import { Helmet } from "react-helmet";
import styled, { createGlobalStyle, ThemeProvider } from "styled-components";
import { GridContextProvider } from "../contexts/GridContext";
import { MapsContext } from "../contexts/MapsContext";
import AppBar from "./AppBar";
import theme from "./theme";

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
          <GridContextProvider>
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
          </GridContextProvider>
        </MapsContext.Provider>
      </ThemeProvider>
    </MuiThemeProvider>
  );
};

export default Layout;
