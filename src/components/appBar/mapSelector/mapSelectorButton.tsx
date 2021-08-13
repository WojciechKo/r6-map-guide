import Button from "@material-ui/core/Button";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import { animated, useSpring } from "@react-spring/web";
import React, { useEffect } from "react";
import styled from "styled-components";

const StyledButton = styled(animated(Button))`
  ${({ theme, isMenuOpen }) => `
    width: ${theme.spacing(22)}px;
    color: inherit;
    text-transform: capitalize;
    justify-content: space-between;
    background-color: ${
      isMenuOpen ? theme.palette.secondary.dark : theme.palette.secondary.main
    };
    & .MuiButton-endIcon {
      pointer-events: none;
    }
  `}
`;

const MapSelectorButton = React.forwardRef(
  ({ text, isMenuOpen, onClick }, ref) => {
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
        isMenuOpen={isMenuOpen}
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
  }
);

export default MapSelectorButton;
