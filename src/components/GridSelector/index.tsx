import { useMapViewerGrid } from "@/contexts/MapViewerGridContext";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import { RiLayoutGridLine } from "react-icons/ri";

import GridItem from "./GridItem";

const dimention = 4;

const GridSelector: FC = () => {
  const { grid, setGrid } = useMapViewerGrid();

  const [anchorEl, setAnchorEl] = React.useState<Element | null>(null);

  const handleClick = (event: React.MouseEvent<Element>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "map-viewer-grid" : undefined;

  const xy = (index: number) => [(index % dimention) + 1, Math.floor(index / dimention) + 1];

  const index = (x: number, y: number) => (y - 1) * dimention + x - 1;

  const generateGridItems = (selectedIndex: number) => {
    const [selectedX, selectedY] = xy(selectedIndex);

    const selected = (index: number) => {
      const [x, y] = xy(index);
      return x <= selectedX && y <= selectedY;
    };

    return [...Array(dimention * dimention)].map((_, index) => selected(index));
  };

  // const [gridItems, setGridItems] = React.useState(
  //   generateGridItems(index(grid.columns, grid.rows))
  // );

  const gridItems = generateGridItems(index(grid.columns, grid.rows));

  const selectGrid = (index: number) => {
    const [columns, rows] = xy(index);
    setGrid({ columns, rows });

    // setGridItems(generateGridItems(index));
  };

  const updateLayout = (index: number) => {
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
              onHover={selectGrid}
              selected={gridItem}
              onClick={() => updateLayout(index)}
            />
          ))}
        </Container>
      </Popover>
    </div>
  );
};

const GridSelectorButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.common.white,
}));

const Container = styled("div")<{ dimention: number }>(({ theme, dimention }) => ({
  display: "grid",
  touchAction: "none",
  gridTemplateRows: `repeat(${dimention}, 1fr)`,
  gridTemplateColumns: `repeat(${dimention}, 1fr)`,
  margin: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
}));

export default GridSelector;
