import red from "@mui/material/colors/red";
import { Theme, createTheme } from "@mui/material/styles";

const theme: Theme = createTheme({
  sizes: {
    mapMenuWidth: "220px",
  },
  palette: {
    primary: {
      main: "#008400",
      light: "#4db53b",
      dark: "#005600",
    },
    secondary: {
      main: "#ff7e00",
      light: "#ffaf43",
      dark: "#c54f00",
      contrastText: "#fff",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fff",
    },
  },
});

export default theme;
