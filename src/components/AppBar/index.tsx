import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import styled from "styled-components";
import MapSelector from "./MapSelector";
import GridSelector from "./GridSelector";
import Settings from "./Settings";

const StyledToolbar = styled(Toolbar)`
  justify-content: space-between;
`;

export default () => {
  return (
    <AppBar position="static" color="primary">
      <StyledToolbar>
        <MapSelector />

        <GridSelector />

        <Settings />
      </StyledToolbar>
    </AppBar>
  );
};
