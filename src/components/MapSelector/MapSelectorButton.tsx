import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { animated, useSpring } from "@react-spring/web";
import React, { useEffect } from "react";

type Props = {
  text: string;
  isMenuOpen: boolean;
  onClick: () => void;
};

const MapSelectorButton = React.forwardRef<HTMLButtonElement, Props>(({ text, isMenuOpen, onClick }, ref) => {
  const [roundedCorners, roundedCornersApi] = useSpring(() => ({
    borderBottomLeftRadius: "4px",
    borderBottomRightRadius: "4px",
  }));

  useEffect(() => {
    const radius = isMenuOpen ? "0" : "4px";

    roundedCornersApi.start({
      borderBottomLeftRadius: radius,
      borderBottomRightRadius: radius,
    });
  }, [roundedCornersApi, isMenuOpen]);

  return (
    <StyledButton
      style={roundedCorners}
      ref={ref}
      $isMenuOpen={isMenuOpen}
      aria-controls="map-picker"
      aria-haspopup="true"
      variant="contained"
      color="secondary"
      onClick={onClick}
      endIcon={isMenuOpen ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
    >
      {text}
    </StyledButton>
  );
});

const StyledButton = styled(animated(Button))<{ $isMenuOpen: boolean }>(({ theme, $isMenuOpen }) => ({
  "&&": {
    width: theme.sizes.mapMenuWidth,
    justifyContent: "space-between",
    textTransform: "none",
    backgroundColor: $isMenuOpen ? theme.palette.secondary.dark : theme.palette.secondary.main,
    "&:hover": {
      backgroundColor: theme.palette.secondary.dark,
    },
    "& .MuiButton-endIcon": {
      pointerEvents: "none",
    },
  },
}));

export default MapSelectorButton;
