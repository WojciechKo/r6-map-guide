import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import styled from "styled-components";
import MapSelector from "./mapSelector";
import Settings from "./settings";

const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
`;

export default () => {
  return (
    <AppBar position="static" color="primary">
      <StyledToolbar>
        <MapSelector />

        <Settings />
      </StyledToolbar>
    </AppBar>
  );
};
