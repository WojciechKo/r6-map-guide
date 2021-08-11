import React from "react";

import { createStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";

import MapPicker from "./mapPicker";
import Settings from "./settings";

const useStyles = makeStyles(() =>
  createStyles({
    appbarContent: {
      justifyContent: 'space-between'
    }
  })
);

export default () => {
  const classes = useStyles();

  return (
    <AppBar position="static" color="primary">
      <Toolbar className={classes.appbarContent}>
        <MapPicker />

        <Settings />
      </Toolbar>
    </AppBar>
  );
};
