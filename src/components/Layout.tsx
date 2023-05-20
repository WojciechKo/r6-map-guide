import { MapViewerGridProvider } from "@/contexts/MapViewerGridContext";
import theme from "@/theme";
import { GlobalStyles } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { styled, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { graphql, useStaticQuery } from "gatsby";
import React, { FC, PropsWithChildren } from "react";
import { Helmet } from "react-helmet";

import AppBar from "./AppBar";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const data = useStaticQuery<Queries.LayoutDataQuery>(graphql`
    query LayoutData {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          "a, a:hover, a:focus, a:active": {
            textDecoration: "none",
            color: "inherit",
          },
        }}
      />

      <Head title={data.site!.siteMetadata!.title ?? ""} />
      <Main>
        <MapViewerGridProvider>
          <AppBar />

          <Page>{children}</Page>
        </MapViewerGridProvider>
      </Main>
    </MuiThemeProvider>
  );
};

const Head: FC<{ title: string }> = ({ title }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title}</title>

      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />

      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
    </Helmet>
  );
};

const Main = styled("div")({
  height: "100%",
  width: "100%",
  position: "fixed",
  display: "flex",
  flexFlow: "column nowrap",
});

const Page = styled("main")({
  overflow: "hidden",
  flex: "1 1",
});

export default Layout;
