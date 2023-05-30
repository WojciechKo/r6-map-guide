import GridSelector from "@/components/GridSelector";
import MapSelector from "@/components/MapSelector";
import { Box } from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import MuiToolbar from "@mui/material/Toolbar";
import React from "react";

import Settings from "./Settings";

const AppBar = () => {
  return (
    <MuiAppBar
      position="static"
      color="primary"
    >
      <Toolbar>
        <Box sx={{ display: "flex", flex: 1 }}>
          <MapSelector />
        </Box>
        <Box sx={{ display: "flex" }}>
          <GridSelector />
        </Box>
        <Box sx={{ display: "flex", flex: 1, justifyContent: "flex-end" }}>
          <Settings />
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

const Toolbar = styled(MuiToolbar)({
  justifyContent: "space-between",
});

export default AppBar;
