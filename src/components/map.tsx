import * as React from "react";

type MapProps = {
  name: string;
};

const Map = (map: MapProps) => {
  return <h1>{map.name}</h1>;
};

export default Map;
