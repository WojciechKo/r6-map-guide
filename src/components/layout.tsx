import React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import { Normalize } from "styled-normalize";
import styled, { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  body {
    background: blue;
  }
`;

const Container = styled.main`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-flow: column;
`;

const AppBar = styled.nav`
  background: green;
  flex: 0 0 36px;
  padding: 0 20px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
`;

const Page = styled.main`
  height: 100%;
  width: 100%;
  flex: 1 1;
  overflow: hidden;
  background: pink;
`;

const Layout = ({ children }) => {
  document.addEventListener("gesturestart", (e) => e.preventDefault());
  document.addEventListener("gesturechange", (e) => e.preventDefault());

  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <>
      <Normalize />
      <GlobalStyle />

      <title>{data.site.siteMetadata.title}</title>

      <Container>
        <AppBar>
          <Link to="/maps">Maps</Link>
        </AppBar>

        <Page>{children}</Page>
      </Container>
    </>
  );
};

export default Layout;
