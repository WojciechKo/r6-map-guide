import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import MuiToolbar from "@mui/material/Toolbar";
import React from "react";

import GridSelector from "@/components/GridSelector";
import MapSelector from "@/components/MapSelector";
import Settings from "./Settings";

const AppBar = () => {
  return (
    <MuiAppBar position="static" color="primary">
      <Toolbar>
        <MapSelector />
        <GridSelector />
        <Settings />
      </Toolbar>
    </MuiAppBar>
  );
};

const Toolbar = styled(MuiToolbar)({
  justifyContent: "space-between",
});

export default AppBar;
