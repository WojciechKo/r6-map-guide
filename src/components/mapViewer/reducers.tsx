import { useReducer } from "react";

export function blueprintReducer(state, action) {
  switch (action.type) {
    case "move-blueprint": {
      const newPro = {
        ...state,
        blueprintMove: {
          x: action.payload.position.x,
          y: action.payload.position.y,
        },
      };

      return newPro;
    }

    case "zoom-blueprint": {
      const scaleJump = 1.1;
      const scale = action.payload.scale < 0
        ? Math.min(5, state.blueprintScale.scale * scaleJump)
        : Math.max(0.1, state.blueprintScale.scale / scaleJump);

      const scaleRatio = scale / state.blueprintScale.scale;

      if (scaleRatio === 1) {
        return state;
      }

      const x =
        action.payload.focusPoint.x -
        state.blueprintMove.x -
        scaleRatio *
          (action.payload.focusPoint.x -
            state.blueprintMove.x -
            state.blueprintScale.x);
      const y =
        action.payload.focusPoint.y -
        state.blueprintMove.y -
        scaleRatio *
          (action.payload.focusPoint.y -
            state.blueprintMove.y -
            state.blueprintScale.y);

      return {
        ...state,
        blueprintScale: { x, y, scale },
      };
    }

    case "zoom-blueprint2": {
      const scale = action.payload.scale > 0
        ? Math.min(5, state.blueprintScale.scale + action.payload.scale)
        : Math.max(0.1, state.blueprintScale.scale + action.payload.scale);

        console.log(scale);
      const scaleRatio = scale / state.blueprintScale.scale;

      if (scaleRatio === 1) {
        return state;
      }

      const x =
        action.payload.focusPoint.x -
        state.blueprintMove.x -
        scaleRatio *
          (action.payload.focusPoint.x -
            state.blueprintMove.x -
            state.blueprintScale.x);
      const y =
        action.payload.focusPoint.y -
        state.blueprintMove.y -
        scaleRatio *
          (action.payload.focusPoint.y -
            state.blueprintMove.y -
            state.blueprintScale.y);

      return {
        ...state,
        blueprintScale: { x, y, scale },
      };
    }
    case "place-marker": {
      const x =
        (action.payload.position.x -
          state.blueprintMove.x -
          state.blueprintScale.x) /
        state.blueprintScale.scale;
      const y =
        (action.payload.position.y -
          state.blueprintMove.y -
          state.blueprintScale.y) /
        state.blueprintScale.scale;

      if (x < 0 || y < 0) {
        return state;
      }

      return {
        ...state,
        markerPosition: { x, y },
      };
    }
    default:
      return state;
  }
}

export function useBlueprintReducer() {
  const [blueprintState, blueprintDispatch] = useReducer(blueprintReducer, {
    markerPosition: { x: undefined, y: undefined },
    blueprintMove: { x: 0, y: 0 },
    blueprintScale: { x: 0, y: 0, scale: 1 },
  });

  return [
    blueprintState,
    {
      moveBlueprint: (position) => {
        blueprintDispatch({
          type: "move-blueprint",
          payload: { position },
        });
      },
      zoomBlueprint: (payload) => {
        blueprintDispatch({
          type: "zoom-blueprint",
          payload: payload,
        });
      },
      zoomBlueprint2: (payload) => {
        blueprintDispatch({
          type: "zoom-blueprint2",
          payload: payload,
        });
      },
      placeMarker: (position) => {
        blueprintDispatch({
          type: "place-marker",
          payload: { position },
        });
      },
    },
  ];
}
