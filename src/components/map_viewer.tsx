import React from "react";
import styled from "styled-components";

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

const BlueprintContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
`;

const Blueprint = styled.div`
  overflow: hidden;
  flex: 0 0 50%;
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BlueprintImage = styled.img`
`;

const MapViewer = ({ blueprints }: MapProps) => {
  return (
    <BlueprintContainer>
      {blueprints.map((blueprint) => (
        <Blueprint key={blueprint.level}>
          <BlueprintImage  src={blueprint.url} />
        </Blueprint>
      ))}
    </BlueprintContainer>
  );
};

export default MapViewer;
