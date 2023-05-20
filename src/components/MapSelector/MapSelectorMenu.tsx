import { useMaps } from "@/contexts/MapsContext";
import ClickAwayListener, { ClickAwayListenerProps } from "@mui/material/ClickAwayListener";
import Collapse from "@mui/material/Collapse";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";

type Props = {
  anchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  onClickAway: ClickAwayListenerProps["onClickAway"];
  onMapSelected: (mapSlug: string) => void;
};

const MapSelectorMenu: FC<Props> = ({ anchorEl, isMenuOpen, onClickAway, onMapSelected }) => {
  const { allMaps, selectedMap } = useMaps();
  return (
    <Popper open={isMenuOpen} anchorEl={anchorEl} placement={"bottom-end"} transition keepMounted>
      {({ TransitionProps }) => (
        <Collapse {...TransitionProps} style={{ transformOrigin: "center top" }}>
          <StyledPaper sx={{ overflowY: "auto" }}>
            <ClickAwayListener onClickAway={onClickAway}>
              <MenuList color={"danger"} sx={{ pt: 0 }} autoFocusItem={isMenuOpen} id="map-picker">
                {allMaps.map((map) => (
                  <StyledMenuItem
                    key={map.slug}
                    dense={true}
                    selected={map.slug === selectedMap?.slug}
                    onClick={() => onMapSelected(map.slug)}
                  >
                    {map.name}
                  </StyledMenuItem>
                ))}
              </MenuList>
            </ClickAwayListener>
          </StyledPaper>
        </Collapse>
      )}
    </Popper>
  );
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  width: theme.sizes.mapMenuWidth,
  maxHeight: `calc(100vh - ${theme.spacing(10)})`,
  borderRadius: "0 0 4px 4px",
}));

const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
  color: theme.palette.common.black,
  "&:hover, &:focus": {
    backgroundColor: theme.palette.secondary.main,
  },
  "&.Mui-selected": {
    backgroundColor: theme.palette.secondary.light,
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
    },
  },
}));

export default MapSelectorMenu;
