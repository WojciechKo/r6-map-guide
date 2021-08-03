import React from "react";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import { useState } from "react";

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
  touch-action: none;
`;

const Blueprint = styled.div`
  overflow: hidden;
  flex: 0 0 50%;
  height: 50%;
`;

const MapViewer = ({ blueprints }: MapProps) => {
  const [offset, setOffset] = useState(() => ({ x: 0, y: 0 }));
  const [blueprintStyles, blueprintAnimation] = useSpring(() => offset);

  const bindDrag = useDrag(({ last, movement: [dx, dy] }) => {
    blueprintAnimation.start({ x: offset.x + dx, y: offset.y + dy });

    if (last) {
      setOffset({
        x: blueprintStyles.x.animation.to,
        y: blueprintStyles.y.animation.to,
      });
    }
  });

  return (
    <BlueprintContainer {...bindDrag()}>
      {blueprints.map((blueprint) => (
        <Blueprint key={blueprint.level}>
          <animated.div style={blueprintStyles}>
            <img
              src={blueprint.url}
              draggable={false}
            />
          </animated.div>
        </Blueprint>
      ))}
    </BlueprintContainer>
  );
};

export default MapViewer;
