import React from "react";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "react-use-gesture";
import { useState } from "react";
import { BiRadioCircleMarked } from "react-icons/bi";

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

const Marker = styled.div`
  position: absolute;
  top: ${(props) => `${props.y}px`};
  left: ${(props) => `${props.x}px`};
  pointer-events: none;
  color: red;
  transform: translate(-50%, -50%);
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

  const [markerPosition, setMarkerPosition] = useState(() => ({
    x: undefined,
    y: undefined,
  }));

  const bindTap = useDrag(({ tap, event }) => {
    if (tap) {
      const rect = event.target.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setMarkerPosition({ x, y });
    }
  });

  return (
    <BlueprintContainer {...bindDrag()}>
      {blueprints.map((blueprint) => (
        <Blueprint key={blueprint.level}>
          <animated.div style={blueprintStyles}>
            <img src={blueprint.url} draggable={false} {...bindTap()} />
            <Marker {...markerPosition}>
              <BiRadioCircleMarked />
            </Marker>
          </animated.div>
        </Blueprint>
      ))}
    </BlueprintContainer>
  );
};

export default MapViewer;
