"use client";
import React, { useState } from "react";
import Grid from "./components/grid";
import { debounce } from "lodash";

export default function Home() {
  const [rows, setRows] = useState(30);
  const [cols, setCols] = useState(30);
  const [data, setData] = useState({
    "3-3": "green",
  });

  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [multilineXY, setMultilineXY] = useState("");
  const [color, setColor] = useState("#5ff042");
  const [mode, setMode] = useState("multi");

  function parseInput(input) {
    const lines = input.trim().split("\n");
    const array = lines.map((line) => line.split(" ").map(Number));
    return array;
  }

  return (
    <main>
      <div
        style={{
          margin: "2rem",
          display: "flex",
          gap: "1rem",
        }}
      >
        <div>
          <h1>
            <span
              style={{
                color: "pink",
              }}
            >
              Lunar&apos;s
            </span>{" "}
            Color Plotter
          </h1>

          <div
            style={{
              margin: "1rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <label>Rows</label>
            <input value={rows} type="number" onChange={(e) => setRows(e.target.value)} />
            <label>Columns</label>
            <input value={cols} type="number" onChange={(e) => setCols(e.target.value)} />
          </div>

          <div
            style={{
              margin: "2rem",
            }}
          >
            <form
              id="plot-form"
              onSubmit={(e) => {
                e.preventDefault();

                if (mode === "multi") {
                  const parsedKeys = parseInput(multilineXY);

                  const multiData = parsedKeys.reduce((acc, curr) => {
                    return {
                      ...acc,
                      [`${curr[1]}-${curr[0]}`]: color,
                    };
                  }, {});

                  setData((prev) => ({
                    ...prev,
                    ...multiData,
                  }));
                } else {
                  if (!x || !y) return;

                  setData((data) => ({
                    ...data,
                    [`${y}-${x}`]: color,
                  }));
                }

                setX("");
                setY("");
                setColor("#5ff042");
              }}
            >
              <div
                style={{
                  marginBottom: "2rem",
                }}
              >
                <button
                  style={{
                    borderRadius: "1rem",
                    padding: "2px 5px 2px 5px",
                    background: "yellow",
                    color: "black",
                    cursor: "pointer",
                    border: "none",
                  }}
                  onClick={() => setMode((prev) => (prev === "multi" ? "single" : "multi"))}
                >
                  Toggle Input Mode
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto",
                  gap: "1rem",
                  width: "200px",
                }}
              >
                {mode === "single" ? (
                  <>
                    <div>
                      <label>Input X</label>
                      <input type="number" value={x} onChange={(e) => setX(e.target.value)} />
                    </div>
                    <div>
                      <label>Input Y</label>
                      <input type="number" value={y} onChange={(e) => setY(e.target.value)} />
                    </div>
                  </>
                ) : (
                  <div>
                    <label>Multi-line Plot Input</label>
                    <textarea rows={5} cols={20} value={multilineXY} onChange={(e) => setMultilineXY(e.target.value)} />
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: "1rem",
                  }}
                >
                  <label>Color</label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      setColor(e.target.value);
                    }}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: "100px",
                    height: "25px",
                  }}
                >
                  {" "}
                  Plot!
                </button>
              </div>
            </form>
          </div>

          <div
            style={{
              margin: "2rem",
            }}
          >
            {Object.keys(data).length > 0 && (
              <button
                style={{
                  padding: "0.33rem",
                  background: "red",
                  border: "none",
                  borderRadius: "2rem",
                  fontWeight: 700,
                }}
                onClick={() => setData({})}
              >
                {" "}
                CLEAR PLOTTED DATA
              </button>
            )}
          </div>
        </div>

        <Grid rows={rows} cols={cols} data={data} />
      </div>
    </main>
  );
}
