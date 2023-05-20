import { ImmerReducer, useImmerReducer } from "use-immer";

const blueprintViewerReducer: ImmerReducer<State, Action> = (draft, action) => {
  switch (action.type) {
    case "move-blueprint": {
      draft.blueprintMove.x = action.payload.x;
      draft.blueprintMove.y = action.payload.y;
      break;
    }

    case "zoom-blueprint": {
      const scaleJump = 1.1;
      const scale =
        action.payload.scale < 0
          ? Math.min(5, draft.blueprintScale.scale * scaleJump)
          : Math.max(0.1, draft.blueprintScale.scale / scaleJump);

      const scaleRatio = scale / draft.blueprintScale.scale;

      if (scaleRatio === 1) {
        break;
      }

      const x =
        action.payload.focusPoint.x -
        draft.blueprintMove.x -
        scaleRatio * (action.payload.focusPoint.x - draft.blueprintMove.x - draft.blueprintScale.x);
      const y =
        action.payload.focusPoint.y -
        draft.blueprintMove.y -
        scaleRatio * (action.payload.focusPoint.y - draft.blueprintMove.y - draft.blueprintScale.y);

      draft.blueprintScale = { x, y, scale };
      break;
    }

    case "zoom-blueprint2": {
      const scale =
        action.payload.scale > 0
          ? Math.min(5, draft.blueprintScale.scale + action.payload.scale)
          : Math.max(0.1, draft.blueprintScale.scale + action.payload.scale);

      const scaleRatio = scale / draft.blueprintScale.scale;

      if (scaleRatio === 1) {
        break;
      }

      const x =
        action.payload.focusPoint.x -
        draft.blueprintMove.x -
        scaleRatio * (action.payload.focusPoint.x - draft.blueprintMove.x - draft.blueprintScale.x);
      const y =
        action.payload.focusPoint.y -
        draft.blueprintMove.y -
        scaleRatio * (action.payload.focusPoint.y - draft.blueprintMove.y - draft.blueprintScale.y);

      draft.blueprintScale = { x, y, scale };
      break;
    }
    case "place-marker": {
      const x = (action.payload.x - draft.blueprintMove.x - draft.blueprintScale.x) / draft.blueprintScale.scale;
      const y = (action.payload.y - draft.blueprintMove.y - draft.blueprintScale.y) / draft.blueprintScale.scale;

      if (x < 0 || y < 0) {
        break;
      }

      draft.markerPosition = { x, y };
      break;
    }
  }
};

export const useBlueprintViewer = () => {
  const [blueprintState, viewerDispatch] = useImmerReducer(blueprintViewerReducer, {
    markerPosition: undefined,
    blueprintMove: { x: 0, y: 0 },
    blueprintScale: { x: 0, y: 0, scale: 1 },
  });

  return { ...blueprintState, viewerDispatch };
};

type State = {
  blueprintScale: { scale: number; x: number; y: number };
  blueprintMove: { x: number; y: number };
  markerPosition?: { x: number; y: number };
};

type Action = MoveBlueprintAction | ZoomBlueprintAction | ZoomBlueprint2Action | PlaceMarkerAction;

type MoveBlueprintAction = {
  type: "move-blueprint";
  payload: {
    x: number;
    y: number;
  };
};

type ZoomBlueprintAction = {
  type: "zoom-blueprint";
  payload: {
    scale: number;
    focusPoint: {
      x: number;
      y: number;
    };
  };
};

type ZoomBlueprint2Action = {
  type: "zoom-blueprint2";
  payload: {
    scale: number;
    focusPoint: {
      x: number;
      y: number;
    };
  };
};

type PlaceMarkerAction = {
  type: "place-marker";
  payload: {
    x: number;
    y: number;
  };
};
