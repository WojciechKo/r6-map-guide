import React, { useState } from "react";
import { useContext } from "react";

const GridContext = React.createContext(null);

const useGridContext = () => {
    return useContext(GridContext);
};

const GridContextProvider = (props) => {
  const [grid, setGrid] = useState({ rows: 2, columns: 2 });
  console.log(grid);

  const value = {
    grid,
    setGrid: ({ rows, columns }) => setGrid({ rows, columns }),
  };
  return <GridContext.Provider value={value} {...props} />;
};

export { GridContextProvider, useGridContext };
