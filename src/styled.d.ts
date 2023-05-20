import { CSSProperties } from "react";

declare module "@mui/material/styles" {
  interface Theme {
    sizes: {
      mapMenuWidth: CSSProperties["width"];
    };
    palette: Theme["palette"] & {
      primary: {
        main: CSSProperties["color"];
        light: CSSProperties["color"];
        dark: CSSProperties["color"];
      };
      secondary: {
        main: CSSProperties["color"];
        light: CSSProperties["color"];
        dark: CSSProperties["color"];
      };
      error: {
        main: CSSProperties["color"];
      };
      background: {
        default: CSSProperties["color"];
      };
    };
  }

  interface ThemeOptions {
    sizes: {
      mapMenuWidth: CSSProperties["width"];
    };
    palette: Theme["palette"] & {
      primary: {
        main: CSSProperties["color"];
        light: CSSProperties["color"];
        dark: CSSProperties["color"];
      };
      secondary: {
        main: CSSProperties["color"];
        light: CSSProperties["color"];
        dark: CSSProperties["color"];
      };
      error: {
        main: CSSProperties["color"];
      };
      background: {
        default: CSSProperties["color"];
      };
    };
  }
}
