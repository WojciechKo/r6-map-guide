import React, { PropsWithChildren, useEffect, useState } from "react";
import { useContext } from "react";

type GridContext = {
  grid: Grid;
  setGrid: (grid: Grid) => void;
};

type Grid = {
  columns: number;
  rows: number;
};

const MapViewerGridContext = React.createContext<GridContext | undefined>(undefined);

const DefaultGrid = { columns: 2, rows: 2 };
const GridLocalStorageId = "map-grid";

export const MapViewerGridProvider = (props: PropsWithChildren) => {
  const [grid, setGridState] = useState<Grid>(DefaultGrid);

  useEffect(() => {
    const rawStoredGrid = localStorage.getItem(GridLocalStorageId);
    if (rawStoredGrid) {
      const storedGrid = JSON.parse(rawStoredGrid);
      setGridState(storedGrid);
    }
  }, []);

  const setGrid = (grid: Grid) => {
    localStorage.setItem(GridLocalStorageId, JSON.stringify(grid));
    setGridState(grid);
  };

  return <MapViewerGridContext.Provider value={{ grid, setGrid }} {...props} />;
};

export const useMapViewerGrid = () => {
  const gridContext = useContext(MapViewerGridContext);
  if (!gridContext) {
    throw new Error("No MapViewerGridProvider foune when calling useMapViewerGrid.");
  }
  return gridContext;
};
