import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import { animated } from "@react-spring/web";
import React, { FC } from "react";

type Props = {
  text: string;
  isMenuOpen: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

const MapSelectorButton: FC<Props> = ({ text, isMenuOpen, onClick }) => {
  return (
    <StyledButton
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
};

const StyledButton = styled(animated(Button), { shouldForwardProp: (prop: string) => !prop.startsWith("$") })<{
  $isMenuOpen: boolean;
}>(({ theme, $isMenuOpen }) => ({
  width: theme.sizes.mapMenuWidth,
  justifyContent: "space-between",
  textTransform: "none",
  borderRadius: $isMenuOpen ? "4px 4px 0 0" : "4px",
  backgroundColor: $isMenuOpen ? theme.palette.secondary.dark : theme.palette.secondary.main,
  "& .MuiButton-endIcon": {
    pointerEvents: "none",
  },
}));

export default MapSelectorButton;
