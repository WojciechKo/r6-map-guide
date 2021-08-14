import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import React, { useContext } from "react";
import { RiLayoutGridLine } from "react-icons/ri";
import styled from "styled-components";
import { GridContext, useGridContext } from "../../../contexts/GridContext";

const GridSelectorButton = styled(IconButton)`
  ${({ theme }) => `
    color: ${theme.palette.common.white};
  `}
`;

interface ContainerProps {
  readonly dimention: number;
}
const Container = styled.div<ContainerProps>`
  ${({ theme, dimention }) => `
    display: grid;
    grid-template-rows: repeat(${dimention}, 1fr);
    grid-template-columns: repeat(${dimention}, 1fr);
    margin: ${theme.spacing(2)}px ${theme.spacing(1)}px;
  `}
`;

const StyledGridItem = styled.div<{ selected: boolean }>`
  ${({ theme, selected }) => `
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1px;
    color: ${
      selected ? theme.palette.secondary.main : theme.palette.secondary.light
    };
  `}
`;

const GridItemIndicator = styled.div`
  width: 1em;
  height: 1em;
  border-radius: 2px;
  background: currentColor;
`;

const GridItem = ({ onHover, selected, onClick }) => (
  <StyledGridItem onMouseOver={onHover} selected={selected} onClick={onClick}>
    <GridItemIndicator />
  </StyledGridItem>
);

const GridSelector = () => {
  const {grid, setGrid} = useGridContext();
  const dimention = 4;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const xy = (index) => [index % dimention + 1, Math.floor(index / dimention) + 1];

  const generateGridItems = (selectedIndex) => {
    const [selectedX, selectedY] = xy(selectedIndex);

    const selected = (index) => {
      const [x, y] = xy(index);
      return x <= selectedX && y <= selectedY;
    };

    return [...Array(dimention * dimention)].map((_, index) => selected(index));
  };

  const selectGrid = (index) => {
    setGridItems(generateGridItems(index));
  };

  const [gridItems, setGridItems] = React.useState(
    generateGridItems(dimention)
  );

  const updateLayout = (index) => {
    const [x, y] = xy(index);
    setGrid({rows: y, columns: x});
  }

  return (
    <div>
      <GridSelectorButton
        aria-describedby={id}
        aria-label="settings"
        aria-haspopup="true"
        onClick={handleClick}
        color="inherit"
      >
        <RiLayoutGridLine />
      </GridSelectorButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Container dimention={dimention}>
          {gridItems.map((gridItem, index) => (
            <GridItem
              key={index}
              onHover={() => selectGrid(index)}
              selected={gridItem}
              onClick={() => updateLayout(index)}
            />
          ))}
        </Container>
      </Popover>
    </div>
  );
};

export default GridSelector;
