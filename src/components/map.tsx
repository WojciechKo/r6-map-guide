import React from "react";

type MapProps = {
  name: string;
  blueprints: [
    {
      name: string;
      url: string;
      level: number;
    }
  ];
};

const Map = (map: MapProps) => {
  return (
    <>
      <h1>{map.name}</h1>

      {map.blueprints.map((blueprint) => (
        <img key={blueprint.level} src={blueprint.url} />
      ))}
    </>
  );
};

export default Map;
