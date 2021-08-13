import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Collapse from "@material-ui/core/Collapse";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Paper from "@material-ui/core/Paper";
import Popper from "@material-ui/core/Popper";
import React from "react";
import styled from "styled-components";

const StyledPaper = styled(Paper)`
  ${({ theme }) => `
    width: ${theme.spacing(22)}px;
    max-height: calc(100vh - ${theme.spacing(10)}px);
    overflow: auto;
    border-radius: 0 0 4px 4px;
    & .MuiList-padding {
      padding: 0 0 ${theme.spacing(1)}px 0;
    }
  `}
`;

const StyledMenuItem = styled(MenuItem)`
  ${({ theme }) => `
    &:hover, &:focus {
      background-color: ${theme.palette.secondary.light};
    }
    &.Mui-selected {
      color: ${theme.palette.common.white};
      background-color: ${theme.palette.secondary.main};
      &:hover {
        background-color: ${theme.palette.secondary.light};
      }
    }
  `}
`;

const MapSelectorMenu = ({
  anchorEl,
  isMenuOpen,
  onClickAway,
  maps,
  selectedMapId,
  onMapSelected,
}) => {
  return (
    <Popper
      open={isMenuOpen}
      anchorEl={anchorEl}
      placement={"bottom"}
      role={undefined}
      transition
      disablePortal
      keepMounted
    >
      {({ TransitionProps }) => (
        <Collapse
          {...TransitionProps}
          style={{ transformOrigin: "center top" }}
        >
          <StyledPaper>
            <ClickAwayListener onClickAway={onClickAway}>
              <MenuList autoFocusItem={isMenuOpen} id="map-picker">
                {maps.map((map) => (
                  <StyledMenuItem
                    key={map.id}
                    dense={true}
                    selected={map.id === selectedMapId}
                    onClick={() => onMapSelected(map.id)}
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

export default MapSelectorMenu;
