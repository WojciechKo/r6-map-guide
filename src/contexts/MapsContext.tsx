import React, { FC, PropsWithChildren, useContext } from "react";

type MapsContext = {
  allMaps: Queries.MapPageDataQuery["allMaps"]["nodes"];
  selectedMap: Queries.MapPageDataQuery["selectedMap"];
};

const MapsContext = React.createContext<MapsContext | undefined>(undefined);

export const MapsProvider: FC<PropsWithChildren<{ value: MapsContext }>> = ({ children, value }) => {
  return <MapsContext.Provider value={{ ...value }}>{children}</MapsContext.Provider>;
};

export const useMaps = () => {
  const mapsContext = useContext(MapsContext);
  if (!mapsContext) {
    throw new Error("No MapsProvider found when calling useMaps.");
  }
  if (!mapsContext.selectedMap) {
    throw new Error("No Map is selected, this should never happen");
  }
  return mapsContext;
};
