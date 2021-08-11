import React, { useContext } from "react";
import { navigate } from "gatsby";

import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemText from "@material-ui/core/ListItemText";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";

import { MapsContext, SelectedMapContext } from "../contexts/mapsContext";

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.secondary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const useStyles = makeStyles(() =>
  createStyles({
    menuButton: {
      width: "15em",
      textTransform: "capitalize",
      justifyContent: "space-between",
    },
    selectedMap: {},
  })
);

export default () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const classes = useStyles();

  const maps = useContext(MapsContext);
  const selectedMapId = useContext(SelectedMapContext);
  const selectedMap = maps.find((map) => map.id === selectedMapId);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        aria-controls="customized-menu"
        aria-haspopup="true"
        variant="contained"
        color="secondary"
        onClick={handleClick}
        className={classes.menuButton}
        endIcon={anchorEl ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        {selectedMap?.name}
      </Button>

      <Menu
        id="customized-menu"
        elevation={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {maps.map((map) => (
          <StyledMenuItem key={map.id} selected={map.id === selectedMapId}>
            <ListItemText
              key={map.id}
              primary={map.name}
              onClick={() => navigate(`/maps/${map.id}`)}
            />
          </StyledMenuItem>
        ))}
      </Menu>
    </div>
  );
};
