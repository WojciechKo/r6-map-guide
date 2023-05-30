import { useMaps } from "@/contexts/MapsContext";
import { useMapViewerGrid } from "@/contexts/MapViewerGridContext";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { animated, useSpring } from "@react-spring/web";
import { useDrag, useGesture, useWheel } from "@use-gesture/react";
import React, { FC, useEffect } from "react";
import { BiRadioCircleMarked } from "react-icons/bi";

import { useBlueprintViewer } from "./reducers";

const MapViewer: FC = () => {
  const { selectedMap } = useMaps();
  const blueprints = selectedMap!.blueprints;

  const { grid } = useMapViewerGrid();

  const { blueprintMove, blueprintScale, markerPosition, viewerDispatch } = useBlueprintViewer();

  const bindDragAndPinch = useGesture({
    onDrag: ({ offset: [x, y] }) => viewerDispatch({ type: "move-blueprint", payload: { x, y } }),
    onPinch: ({ target, pinching, delta: [dz] }) => {
      if (pinching) {
        const rect = (target as Element).getBoundingClientRect();
        viewerDispatch({
          type: "zoom-blueprint2",
          payload: {
            scale: dz,
            focusPoint: {
              x: rect.width / grid.columns,
              y: rect.height / grid.rows,
            },
          },
        });
      }
    },
  });

  const bindWheel = useWheel(({ event, movement: [_, z] }) => {
    if (event.target) {
      viewerDispatch({
        type: "zoom-blueprint",
        payload: {
          scale: z,
          focusPoint: _getAbsoluteFramePostion(event),
        },
      });
    }
  });

  const bindTap = useDrag((state) => {
    console.log("onTap");
    const { tap, event } = state;
    if (tap) {
      viewerDispatch({
        type: "place-marker",
        payload: _getAbsoluteFramePostion(event as MouseEvent),
      });
    }
  });

  const _getAbsoluteFramePostion = (event: Pick<MouseEvent, "target" | "clientX" | "clientY">) => {
    const rect = (event.target as Element)?.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    return { x, y };
  };

  const [blueprintScaleStyles, blueprintScaleAnimation] = useSpring(() => blueprintScale);
  const [blueprintMoveStyles, blueprintMoveAnimation] = useSpring(() => blueprintMove);

  useEffect(() => {
    blueprintMoveAnimation.start({ ...blueprintMove, config: { mass: 0.09 } });
  }, [blueprintMoveAnimation, blueprintMove]);

  useEffect(() => {
    blueprintScaleAnimation.start(blueprintScale);
  }, [blueprintScaleAnimation, blueprintScale]);

  return (
    <BlueprintsContainer
      rows={grid.rows}
      columns={grid.columns}
      {...bindDragAndPinch()}
    >
      {Array.from({ length: grid.rows * grid.columns }).map((_, index) => (
        <BlueprintFrame
          key={index}
          {...bindWheel()}
          {...bindTap()}
        >
          {blueprints[index] && (
            <>
              <LabelContainer>
                <BlueprintLabel>{blueprints[index].name}</BlueprintLabel>
              </LabelContainer>
              <Blueprint>
                <Mover style={blueprintMoveStyles}>
                  <Zoomer style={blueprintScaleStyles}>
                    <img src={blueprints[index].url} />

                    {markerPosition && (
                      <Marker {...markerPosition}>
                        <BiRadioCircleMarked />
                      </Marker>
                    )}
                  </Zoomer>
                </Mover>
              </Blueprint>
            </>
          )}
        </BlueprintFrame>
      ))}
    </BlueprintsContainer>
  );
};

const LabelContainer = styled(Box)(() => ({
  position: "absolute",
  width: "100%",
  display: "flex",
  justifyContent: "left",
  zIndex: 1,
  pointerEvents: "none",
}));

const BlueprintLabel = styled(Typography)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.dark,
  color: theme.palette.secondary.contrastText,
  borderRadius: "0 0 0.5em 0",
  padding: "0 0.5em",
}));

const BlueprintsContainer = styled("div")<{ columns: number; rows: number }>(({ theme, columns, rows }) => ({
  backgroundColor: theme.palette.secondary.main,
  height: "100%",
  width: "100%",
  userSelect: "none",
  touchAction: "none",
  display: "grid",
  gridTemplateColumns: `repeat(${columns}, 1fr)`,
  gridTemplateRows: `repeat(${rows}, 1fr)`,
  gridGap: "3px",
}));

const BlueprintFrame = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  position: "relative",
  overflow: "hidden",
  touchAction: "none",
}));

const Blueprint = styled(animated.div)({
  pointerEvents: "none",
});

const Mover = animated.div;

const Zoomer = styled(animated.div)({
  transformOrigin: "top left",
});

const Marker = styled("div")<{ x: number; y: number }>(({ theme, y, x }) => ({
  position: "absolute",
  top: `${y}px`,
  left: `${x}px`,
  color: theme.palette.error.main,
  transform: "translate(-50%, -50%)",
  "& > svg": {
    display: "block",
  },
}));

export default MapViewer;
