import { useMaps } from "@/contexts/MapsContext";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { styled } from "@mui/material/styles";
import React from "react";
import { FC } from "react";

const FloorSelector: FC = () => {
  const { selectedMap, baseFloor, setBaseFloor } = useMaps();

  const marks = selectedMap!.blueprints.map((b, i) => ({
    value: i,
    label: b.name,
  }));

  function onBaseFloorChange(event: Event, value: number | number[]): void {
    if (typeof value === "number") {
      setBaseFloor(value);
    }
  }

  return (
    <Box sx={{ width: 300 }}>
      <StyledSlider
        aria-label="Floor Selector"
        color={"secondary"}
        value={baseFloor}
        onChange={onBaseFloorChange}
        track={false}
        max={marks.at(-1)!.value}
        marks={marks}
        sx={{
          "& .MuiSlider-markLabel": {
            color: "white",
          },
        }}
      />
    </Box>
  );
};

const StyledSlider = styled(Slider)(({ theme }) => ({
  "& .MuiSlider-markLabel": {
    color: theme.palette.secondary.contrastText,
  },
}));
export default FloorSelector;
