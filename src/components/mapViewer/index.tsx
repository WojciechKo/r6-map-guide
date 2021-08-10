import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";
import { useDrag, useGesture, useWheel } from '@use-gesture/react'
import { BiRadioCircleMarked } from "react-icons/bi";

import { useBlueprintReducer } from "./reducers";

const BlueprintsContainer = styled.div`
  height: 100%;
  width: 100%;
  user-select: none;
  display: grid;
  grid-template-columns: ${(props) => `repeat(${props.columns}, 1fr)`};
  grid-template-rows: ${(props) => `repeat(${props.rows}, 1fr)`};
  touch-action: none;
`;

const BlueprintFrame = styled.div`
  overflow: hidden;
  touch-action: none;
`;

const Blueprint = styled(animated.div)`
  pointer-events: none;
`;

const Mover = styled(animated.div)`
`;

const Zoomer = styled(animated.div)`
  transform-origin: top left;
`;

const Marker = styled.div`
  position: absolute;
  top: ${(props) => `${props.y}px`};
  left: ${(props) => `${props.x}px`};
  color: red;
  transform: translate(-50%, -50%);
`;

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

const MapViewer = ({ blueprints }: MapProps) => {
  const [gridDimentions, setGridDimentions] = useState({ columns: 2, rows: 2 })

  const [
    { blueprintMove, blueprintScale, markerPosition },
    { moveBlueprint, zoomBlueprint, zoomBlueprint2, placeMarker },
  ] = useBlueprintReducer();

  const [blueprintScaleStyles, blueprintScaleAnimation] = useSpring(() => blueprintScale);
  const [blueprintMoveStyles, blueprintMoveAnimation] = useSpring(() => blueprintMove);

  const bindDragAndPinch = useGesture({
    onDrag: ({ offset: [x, y] }) => moveBlueprint({ x, y }),
    onPinch: ({ target, pinching, delta: [dz] }) => {
      if (pinching) {
        const rect = target.getBoundingClientRect();
        zoomBlueprint2({
          scale: dz,
          focusPoint: { x: rect.width / gridDimentions.columns, y: rect.height / gridDimentions.rows },
        });
      }
    },
  });

  const bindWheel = useWheel(({ event, movement: [_, z] }) => {
    zoomBlueprint({
      scale: z,
      focusPoint: _getAbsoluteFramePostion(event),
    });
  });

  const bindTap = useDrag(({ tap, event }) => {
    if (tap) {
      placeMarker(_getAbsoluteFramePostion(event));
    }
  });

  const _getAbsoluteFramePostion = (event) => {
    const rect = event.target.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return { x, y };
  };

  useEffect(() => {
    blueprintMoveAnimation.start({ ...blueprintMove, config: { mass: 0.09 } });
  }, [blueprintMove]);

  useEffect(() => {
    blueprintScaleAnimation.start(blueprintScale);
  }, [blueprintScale]);

  return (
    <BlueprintsContainer rows={gridDimentions.rows} columns={gridDimentions.columns} {...bindDragAndPinch()}>
      {blueprints.map((blueprint) => (
        <BlueprintFrame key={blueprint.level} {...bindWheel()} {...bindTap()}>
          <Blueprint>
            <Mover style={blueprintMoveStyles}>
              <Zoomer style={blueprintScaleStyles}>
                <img src={blueprint.url} />
                <Marker {...markerPosition}>
                  <BiRadioCircleMarked />
                </Marker>
              </Zoomer>
            </Mover>
          </Blueprint>
        </BlueprintFrame>
      ))}
    </BlueprintsContainer>
  );
};

export default MapViewer;
