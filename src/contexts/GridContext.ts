import React, { useState } from "react";
import { useContext } from "react";

const GridContext = React.createContext(null);

const GridContextProvider = (props) => {
  const GridLocalStorageId = "map-grid";
  const storedGrid = JSON.parse(localStorage.getItem(GridLocalStorageId));

  const defaultGrid = { columns: 2, rows: 2 };
  const [grid, setGridState] = useState(storedGrid || defaultGrid);

  const setGrid = (grid) => {
    localStorage.setItem(GridLocalStorageId, JSON.stringify(grid));
    setGridState(grid);
  };

  const value = { grid, setGrid };
  return <GridContext.Provider value={value} {...props} />;
};

const useGridContext = () => {
  return useContext(GridContext);
};

export { GridContextProvider, useGridContext };
