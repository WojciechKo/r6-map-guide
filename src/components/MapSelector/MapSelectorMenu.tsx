import { useMaps } from "@/contexts/MapsContext";
import Collapse from "@mui/material/Collapse";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover, { PopoverProps } from "@mui/material/Popover";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";

type Props = {
  anchorEl: HTMLElement | null;
  isMenuOpen: boolean;
  onClose: PopoverProps["onClose"];
  onMapSelected: (mapSlug: string) => void;
};

const MapSelectorMenu: FC<Props> = ({ anchorEl, isMenuOpen, onClose, onMapSelected }) => {
  const { allMaps, selectedMap } = useMaps();
  return (
    <StyledPopover
      open={isMenuOpen}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      transformOrigin={{ vertical: "top", horizontal: "center" }}
      TransitionComponent={Collapse}
      keepMounted
    >
      <MenuList
        id="map-picker"
        sx={{ pt: 0 }}
        autoFocusItem={isMenuOpen}
      >
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
    </StyledPopover>
  );
};

const StyledPopover = styled(Popover)(({ theme }) => ({
  "& .MuiPopover-paper": {
    width: theme.sizes.mapMenuWidth,
    maxHeight: `calc(100vh - ${theme.spacing(10)})`,
    overflowY: "auto",
    borderRadius: "0 0 4px 4px",
  },
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
