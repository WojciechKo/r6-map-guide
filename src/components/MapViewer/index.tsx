import { animated, useSpring } from "@react-spring/web";
import { useDrag, useGesture, useWheel } from "@use-gesture/react";
import React, { useEffect, useState } from "react";
import { BiRadioCircleMarked } from "react-icons/bi";
import styled from "styled-components";
import { useGridContext } from "../../contexts/GridContext";
import { useBlueprintReducer } from "./reducers";

const BlueprintsContainer = styled.div`
  ${({ theme, columns, rows }) => `
    background-color: ${theme.palette.secondary.main};
    height: 100%;
    width: 100%;
    user-select: none;
    touch-action: none;
    display: grid;
    grid-template-columns: ${`repeat(${columns}, 1fr)`};
    grid-template-rows: ${`repeat(${rows}, 1fr)`};
    grid-gap: 3px;
  `}
`;

const BlueprintFrame = styled.div`
  ${({ theme }) => `
    background-color: ${theme.palette.primary.dark};
    position: relative;
    overflow: hidden;
    touch-action: none;
  `}
`;

const Blueprint = styled(animated.div)`
  pointer-events: none;
`;

const Mover = styled(animated.div)``;

const Zoomer = styled(animated.div)`
  transform-origin: top left;
`;

const Marker = styled.div`
  ${({ theme, y, x }) => `
    position: absolute;
    top: ${`${y}px`};
    left: ${`${x}px`};
    color: ${theme.palette.error.main};
    transform: translate(-50%, -50%);
  `}
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
  const {grid} = useGridContext();
  // const [gridDimentions, setGridDimentions] = useState({ columns: 2, rows: 2 });

  const [
    { blueprintMove, blueprintScale, markerPosition },
    { moveBlueprint, zoomBlueprint, zoomBlueprint2, placeMarker },
  ] = useBlueprintReducer();

  const [blueprintScaleStyles, blueprintScaleAnimation] = useSpring(
    () => blueprintScale
  );
  const [blueprintMoveStyles, blueprintMoveAnimation] = useSpring(
    () => blueprintMove
  );

  const bindDragAndPinch = useGesture({
    onDrag: ({ offset: [x, y] }) => moveBlueprint({ x, y }),
    onPinch: ({ target, pinching, delta: [dz] }) => {
      if (pinching) {
        const rect = target.getBoundingClientRect();
        zoomBlueprint2({
          scale: dz,
          focusPoint: {
            x: rect.width / grid.columns,
            y: rect.height / grid.rows,
          },
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
    <BlueprintsContainer
      rows={grid.rows}
      columns={grid.columns}
      {...bindDragAndPinch()}
    >
      {[...Array(grid.rows * grid.columns)].map((_, index) => (
        <BlueprintFrame key={index} {...bindWheel()} {...bindTap()}>
          <Blueprint>
            <Mover style={blueprintMoveStyles}>
              <Zoomer style={blueprintScaleStyles}>
                <img src={blueprints[index]?.url} />
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
