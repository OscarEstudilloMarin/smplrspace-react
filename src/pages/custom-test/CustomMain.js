import React, {
  useState,
  useCallback,
  useReducer,
  useEffect,
  Fragment,
} from "react";
// import { Group } from "@mantine/core";
// import { useMediaQuery } from "@mantine/hooks";
import {
  append,
  compose,
  isEmpty,
  map,
  reject,
  intersperse,
  evolve,
  max,
  forEach,
} from "ramda";

import DefaultPage from "../../components/DefaultPage";
import Viewer from "./Viwer";

const INITIAL_MODE = "3d";

const CustomMain = () => {
  const [space, setSpace] = useState();
  const [task, setTask] = useState("idle");
  const [mode, setMode] = useState(INITIAL_MODE);
  const [editingId, setEditingId] = useState();

  const [points, dispatchPoint] = useReducer((points, action) => {
    switch (action.type) {
      case "add":
        return [...points, action.point];
      case "update":
        return points.map((pt) =>
          pt.id === action.id ? { ...pt, ...action.updates } : pt
        );
      case "remove":
        return reject((r) => r.id === action.id)(points);
      default:
        console.error(`Unknown action type ${action.type}`);
    }
  }, []);

  const [icons, dispatchIcon] = useReducer((icons, action) => {
    switch (action.type) {
      case "add":
        return [...icons, action.icon];
      case "update":
        return icons.map((pt) =>
          pt.id === action.id ? { ...pt, ...action.updates } : pt
        );
      case "remove":
        return reject((r) => r.id === action.id)(icons);
      default:
        console.error(`Unknown action type ${action.type}`);
    }
  }, []);

  const [polygons, dispatchPolygon] = useReducer((polygons, action) => {
    switch (action.type) {
      case "addPolygon":
        return append(
          {
            id: action.id,
            name: "RANDOM NAME",
            coordinates: [],
          },
          polygons
        );
      case "addCoordinate":
        return polygons.map((r) =>
          r.id === action.id
            ? { ...r, coordinates: [...r.coordinates, action.coordinate] }
            : r
        );
      case "updateCoordinates":
        return polygons.map((r) =>
          r.id === action.id ? { ...r, coordinates: action.coordinates } : r
        );
      case "removePolygon":
        return reject((r) => r.id === action.id)(polygons);
      default:
        console.error(`Unknown action type ${action.type}`);
    }
  }, []);

  const [polylines, dispatchPolyline] = useReducer((polylines, action) => {
    switch (action.type) {
      case "addPolyline":
        return append(
          {
            id: action.id,
            name: "RANDOM NAME",
            coordinates: [],
          },
          polylines
        );
      case "addCoordinate":
        return polylines.map((r) =>
          r.id === action.id
            ? { ...r, coordinates: [...r.coordinates, action.coordinate] }
            : r
        );
      case "updateCoordinates":
        return polylines.map((r) =>
          r.id === action.id ? { ...r, coordinates: action.coordinates } : r
        );
      case "removePolyline":
        return reject((r) => r.id === action.id)(polylines);
      default:
        console.error(`Unknown action type ${action.type}`);
    }
  }, []);

  // memoize so Viewer render once only (wrapped in memo)
  const onReady = useCallback((space) => setSpace(space), []);

  const onModeChange = useCallback(setMode, [setMode]);

  const noElevationIn2D = useCallback(
    (value) => (mode === "3d" ? value : 0),
    [mode]
  );
  const autoElevation = map(
    evolve({ position: { elevation: noElevationIn2D } })
  );

  // switch picking mode
  useEffect(() => {
    if (!space) {
      return;
    }
    if (task === "drawPoint") {
      space.enablePickingMode({
        onPick: ({ coordinates }) => {
          dispatchPoint({
            type: "add",
            point: {
              id: Date.now(), // RANDOM VALUE
              name: "RANDOM NAME",
              position: coordinates,
            },
          });
        },
      });
    } else if (task === "drawIcon") {
      space.enablePickingMode({
        onPick: ({ coordinates }) => {
          dispatchIcon({
            type: "add",
            icon: {
              id: Date.now(), // RANDOM VALUE
              name: "RANDOM NAME",
              position: coordinates,
            },
          });
        },
      });
    } else if (task === "drawPolygon") {
      space.enablePickingMode({
        onPick: ({ coordinates }) => {
          dispatchPolygon({
            type: "addCoordinate",
            id: editingId,
            coordinate: coordinates,
          });
        },
      });
    } else if (task === "drawPolyline") {
      space.enablePickingMode({
        onPick: ({ coordinates }) => {
          dispatchPolyline({
            type: "addCoordinate",
            id: editingId,
            coordinate: coordinates,
          });
        },
      });
    } else {
      space.disablePickingMode();
    }
  }, [space, editingId, task]);

  // render elements
  useEffect(() => {
    if (!space) {
      return;
    }
    space.addDataLayer({
      id: "points",
      type: "point",
      data: autoElevation(points),
      diameter: 0.5,
      anchor: "bottom",
      tooltip: (d) => d.name,
      onDrop: ({ data, position }) =>
        dispatchPoint({
          type: "update",
          id: data.id,
          updates: { position },
        }),
    });
  }, [space, points, autoElevation]);

  useEffect(() => {
    if (!space) {
      return;
    }
    space.addDataLayer({
      id: "icons",
      type: "icon",
      data: map(evolve({ position: { elevation: max(0.25) } }))(
        autoElevation(icons)
      ),
      icon: {
        url: "/img/logo.png",
        width: 180,
        height: 180,
      },
      width: 0.5,
      tooltip: (d) => d.name,
      onDrop: ({ data, position }) =>
        dispatchIcon({
          type: "update",
          id: data.id,
          updates: { position },
        }),
    });
  }, [space, icons, autoElevation]);

  useEffect(() => {
    if (!space) {
      return;
    }
    space.addDataLayer({
      id: "polygons",
      type: "polygon",
      data: reject((p) => isEmpty(p.coordinates))(polygons),
      height: mode === "3d" ? 3.05 : 0.0045,
      alpha: 0.5,
      tooltip: (d) => d.name,
      onDrop: ({ data, coordinates }) =>
        dispatchPolygon({
          type: "updateCoordinates",
          id: data.id,
          coordinates,
        }),
    });
  }, [space, polygons, mode]);

  useEffect(() => {
    if (!space) {
      return;
    }
    space.addDataLayer({
      id: "polylines",
      type: "polyline",
      data: compose(
        map(
          evolve({ coordinates: map(evolve({ elevation: noElevationIn2D })) })
        ),
        reject((p) => isEmpty(p.coordinates))
      )(polylines),
      scale: 0.2,
      tooltip: (d) => d.name,
      onDrop: ({ data, coordinates }) =>
        dispatchPolyline({
          type: "updateCoordinates",
          id: data.id,
          coordinates,
        }),
    });
  }, [space, polylines, noElevationIn2D]);

  const ButtonListContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "start",
    justifyContent: "center",
    gap: "1rem",
  };

  return (
    <DefaultPage>
      <h1>Custom Test</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: "1rem",
          "@media (maxWidth: 600px)": {
            flexDirection: "column",
          },
        }}
      >
        <Viewer
          mode={INITIAL_MODE}
          onReady={onReady}
          onModeChange={onModeChange}
        />
        <div style={ButtonListContainer}>
          {space ? (
            <>
              <button
                onClick={() => {
                  task === "drawPoint" ? setTask("idle") : setTask("drawPoint");
                }}
              >
                {task === "drawPoint" ? "Finish" : "Draw Point"}
              </button>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  width: "100%",
                }}
              >
                {points.map((point) => {
                  return (
                    <div>
                      <span
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          dispatchPoint({ type: "remove", id: point.id })
                        }
                      >
                        {"[X]"}
                      </span>{" "}
                      {point.id}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div>Space is not ready</div>
          )}
        </div>
      </div>
    </DefaultPage>
  );
};

export default CustomMain;
