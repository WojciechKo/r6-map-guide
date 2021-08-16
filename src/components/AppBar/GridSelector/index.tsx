import IconButton from "@material-ui/core/IconButton";
import Popover from "@material-ui/core/Popover";
import { useDrag, useGesture, useHover } from "@use-gesture/react";
import React from "react";
import { RiLayoutGridLine } from "react-icons/ri";
import styled from "styled-components";
import { useGridContext } from "../../../contexts/GridContext";

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
    touch-action: none;
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
  width: 3em;
  height: 3em;
  border-radius: 2px;
  background: currentColor;
`;

const GridItem = ({ index, onHover, selected, onClick }) => {
  const bindGestures = useGesture({
    onHover: ({ args: [callback] }) => {
      callback();
    },
  });

  const onTouchMove = (event) => {
    const myLocation = event.touches[0];
    const realTarget = document.elementFromPoint(
      myLocation.clientX,
      myLocation.clientY
    );
    const index = parseInt(realTarget.getAttribute("data-index"));
    if (isNaN(index)) {
      return;
    }

    onHover(index);
  };

  return (
    <StyledGridItem
      selected={selected}
      onTouchMove={onTouchMove}
      onTouchStart={() => onHover(index)}
      data-index={index}
      // onClick={onClick}
    >
      <GridItemIndicator />
    </StyledGridItem>
  );
};

const GridSelector = () => {
  const { grid, setGrid } = useGridContext();
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

  const xy = (index) => [
    (index % dimention) + 1,
    Math.floor(index / dimention) + 1,
  ];

  const index = (x, y) => (y - 1) * dimention + x - 1;

  const generateGridItems = (selectedIndex) => {
    const [selectedX, selectedY] = xy(selectedIndex);

    const selected = (index) => {
      const [x, y] = xy(index);
      return x <= selectedX && y <= selectedY;
    };

    return [...Array(dimention * dimention)].map((_, index) => selected(index));
  };

  // const [gridItems, setGridItems] = React.useState(
  //   generateGridItems(index(grid.columns, grid.rows))
  // );

  const gridItems = generateGridItems(index(grid.columns, grid.rows));

  const selectGrid = (index) => {
    const [columns, rows] = xy(index);
    setGrid({ columns, rows });

    // setGridItems(generateGridItems(index));
  };

  const updateLayout = (index) => {
    const [columns, rows] = xy(index);
    setGrid({ columns, rows });
  };

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
              index={index}
              onHover={(idx) => selectGrid(idx)}
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
