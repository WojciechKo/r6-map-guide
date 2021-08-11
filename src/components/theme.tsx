import { createTheme } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";

const theme = createTheme({
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
