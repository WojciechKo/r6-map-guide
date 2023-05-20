import { styled } from "@mui/material/styles";
import { useGesture } from "@use-gesture/react";
import React, { FC } from "react";

type GridItemProps = {
  index: number;
  onHover: (index: number) => void;
  selected: boolean;
  onClick: () => void;
};

const GridItem: FC<GridItemProps> = ({ index, onHover, selected, onClick }) => {
  const bindGestures = useGesture({
    onHover: ({ args: [callback] }) => {
      callback();
    },
  });

  const onTouchMove: React.TouchEventHandler<Element> = (event) => {
    const myLocation = event.touches[0];
    const realTarget = document.elementFromPoint(myLocation.clientX, myLocation.clientY);
    const attrValue = realTarget?.getAttribute("data-index");
    if (!attrValue) {
      return;
    }
    const gridIndex = parseInt(attrValue);
    if (isNaN(gridIndex)) {
      return;
    }
    onHover(gridIndex);
  };

  return (
    <StyledGridItem
      selected={selected}
      onTouchMove={onTouchMove}
      onTouchStart={() => onHover(index)}
      data-index={index}
      onClick={onClick}
    >
      <GridItemIndicator />
    </StyledGridItem>
  );
};

const StyledGridItem = styled("div")<{ selected: boolean }>(({ theme, selected }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "1px",
  color: `${selected ? theme.palette.secondary.main : theme.palette.secondary.light}`,
}));

const GridItemIndicator = styled("div")({
  width: "3em",
  height: "3em",
  borderRadius: "2px",
  background: "currentColor",
});

export default GridItem;
