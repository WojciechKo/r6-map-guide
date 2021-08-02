import * as React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";

const Layout = ({ children }) => {
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
    <div>
      <title>{data.site.siteMetadata.title}</title>

      <nav>
        <ul>
          <li>
            <Link to="/maps">Maps</Link>
          </li>
        </ul>
      </nav>

      <main>{children}</main>
    </div>
  );
};
export default Layout;
