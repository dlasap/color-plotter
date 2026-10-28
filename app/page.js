"use client";
import React, { useCallback, useState } from "react";
import Grid from "./components/grid";
import Moon from "./components/moon";
import styles from "./page.module.css";

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

  const [lineX, setLineX] = useState("");
  const [lineY, setLineY] = useState("");
  const [colorX, setColorX] = useState("#5ff042");
  const [colorY, setColorY] = useState("#5ff042");

  const [highlightedPlots, setHighlightedPlots] = useState({
    x: {},
    y: {},
  });

  const [cellSize, setCellSize] = useState(16);
  const [hoveredCell, setHoveredCell] = useState(null);
  const handleHoverCell = useCallback((cell) => setHoveredCell(cell), []);

  function parseInput(input) {
    const lines = input.trim().split("\n");
    const array = lines.map((line) => line.split(" ").map(Number));
    return array;
  }

  const handleHighlight = (line) => {
    if (line === "x") {
      setHighlightedPlots((prev) => {
        return {
          x: {
            ...prev.x,
            [lineX]: colorX,
          },
          y: prev.y,
        };
      });
    } else {
      setHighlightedPlots((prev) => {
        return {
          x: prev.x,
          y: {
            ...prev.y,
            [lineY]: colorY,
          },
        };
      });
    }
  };

  const handlePlot = (e) => {
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
  };

  // TURN OFF COLOR PLOTTER TEMPORARILY

  const TEMP_DISABLED = false;

  if (TEMP_DISABLED) {
    return null;
  }

  const pointCount = Object.keys(data).length;
  const highlightCount = Object.keys(highlightedPlots.x).length + Object.keys(highlightedPlots.y).length;
  const canPlot = mode === "multi" ? multilineXY.trim() !== "" : Boolean(x && y);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <Moon className={styles.moon} />
          <h1 className={styles.title}>
            <span className={styles.titleAccent}>Lunar&apos;s</span> Color Plotter
          </h1>
        </div>
        <form action="/api/lock" method="post">
          <button type="submit" className={`${styles.button} ${styles.ghost}`}>
            Lock
          </button>
        </form>
      </header>

      <main className={styles.workspace}>
        <aside className={styles.panel}>
          <section className={styles.section} aria-labelledby="grid-size-heading">
            <h2 id="grid-size-heading" className={styles.sectionTitle}>
              Grid
            </h2>
            <div className={styles.pair}>
              <div className={styles.field}>
                <label htmlFor="rows" className={styles.label}>
                  Rows
                </label>
                <input id="rows" className={styles.input} value={rows} type="number" min="1" onChange={(e) => setRows(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label htmlFor="cols" className={styles.label}>
                  Columns
                </label>
                <input id="cols" className={styles.input} value={cols} type="number" min="1" onChange={(e) => setCols(e.target.value)} />
              </div>
            </div>
            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label htmlFor="zoom" className={styles.label}>
                  Cell size
                </label>
                <span className={styles.value}>{cellSize}px</span>
              </div>
              <input id="zoom" className={styles.range} type="range" min="8" max="32" step="2" value={cellSize} onChange={(e) => setCellSize(Number(e.target.value))} />
            </div>
          </section>

          <section className={styles.section} aria-labelledby="plot-heading">
            <h2 id="plot-heading" className={styles.sectionTitle}>
              Plot points
            </h2>

            <div className={styles.segmented} role="group" aria-label="Input mode">
              <button type="button" aria-pressed={mode === "multi"} onClick={() => setMode("multi")}>
                Multiple
              </button>
              <button type="button" aria-pressed={mode === "single"} onClick={() => setMode("single")}>
                Single
              </button>
            </div>

            <form id="plot-form" className={styles.stack} onSubmit={handlePlot}>
              {mode === "single" ? (
                <div className={styles.pair}>
                  <div className={styles.field}>
                    <label htmlFor="input-x" className={styles.label}>
                      X
                    </label>
                    <input id="input-x" className={styles.input} type="number" value={x} onChange={(e) => setX(e.target.value)} />
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="input-y" className={styles.label}>
                      Y
                    </label>
                    <input id="input-y" className={styles.input} type="number" value={y} onChange={(e) => setY(e.target.value)} />
                  </div>
                </div>
              ) : (
                <div className={styles.field}>
                  <label htmlFor="multi-input" className={styles.label}>
                    Points
                  </label>
                  <textarea
                    id="multi-input"
                    className={`${styles.input} ${styles.textarea}`}
                    rows={5}
                    spellCheck={false}
                    placeholder={"3 4\n10 12\n15 8"}
                    value={multilineXY}
                    onChange={(e) => setMultilineXY(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        e.currentTarget.form.requestSubmit();
                      }
                    }}
                  />
                  <p className={styles.hint}>One point per line as x y. Ctrl+Enter to plot.</p>
                </div>
              )}

              <div className={styles.actionRow}>
                <label className={styles.swatchField}>
                  <input type="color" className={styles.swatch} value={color} onChange={(e) => setColor(e.target.value)} aria-label="Plot color" />
                  <span className={styles.hex}>{color}</span>
                </label>
                <button type="submit" className={`${styles.button} ${styles.primary}`} disabled={!canPlot}>
                  Plot
                </button>
              </div>
            </form>
          </section>

          <section className={styles.section} aria-labelledby="highlight-heading">
            <h2 id="highlight-heading" className={styles.sectionTitle}>
              Highlight lines
            </h2>

            <div id="highlight-line-form" className={styles.stack}>
              <form
                className={styles.highlightRow}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleHighlight("x");
                  setLineX("");
                }}
              >
                <label htmlFor="x-highlight" className={styles.axisLabel}>
                  X
                </label>
                <input type="number" id="x-highlight" className={styles.input} value={lineX} onChange={(e) => setLineX(e.target.value)} />
                <input type="color" className={styles.swatch} value={colorX} onChange={(e) => setColorX(e.target.value)} aria-label="X highlight color" />
                <button type="submit" className={styles.button} disabled={lineX === ""}>
                  Highlight
                </button>
              </form>

              <form
                className={styles.highlightRow}
                onSubmit={(e) => {
                  e.preventDefault();
                  handleHighlight("y");
                  setLineY("");
                }}
              >
                <label htmlFor="y-highlight" className={styles.axisLabel}>
                  Y
                </label>
                <input type="number" id="y-highlight" className={styles.input} value={lineY} onChange={(e) => setLineY(e.target.value)} />
                <input type="color" className={styles.swatch} value={colorY} onChange={(e) => setColorY(e.target.value)} aria-label="Y highlight color" />
                <button type="submit" className={styles.button} disabled={lineY === ""}>
                  Highlight
                </button>
              </form>

              <button
                type="button"
                className={`${styles.button} ${styles.ghost} ${styles.full}`}
                disabled={highlightCount === 0}
                onClick={() => {
                  setHighlightedPlots({
                    x: {},
                    y: {},
                  });
                }}
              >
                Reset highlighted lines{highlightCount > 0 ? ` (${highlightCount})` : ""}
              </button>
            </div>
          </section>

          <section className={styles.section}>
            <button type="button" className={`${styles.button} ${styles.danger} ${styles.full}`} disabled={pointCount === 0} onClick={() => setData({})}>
              Clear plotted data
            </button>
          </section>
        </aside>

        <section className={styles.canvas} aria-label="Plot grid">
          <div className={styles.toolbar}>
            <span className={styles.stat}>
              <strong>{pointCount}</strong> {pointCount === 1 ? "point" : "points"} plotted
            </span>
            <span className={styles.readout} aria-live="off">
              {hoveredCell ? (
                <>
                  <span>x {hoveredCell.x}</span>
                  <span>y {hoveredCell.y}</span>
                  {hoveredCell.color && <span className={styles.readoutSwatch} style={{ background: hoveredCell.color }} />}
                </>
              ) : (
                <span className={styles.readoutIdle}>Hover the grid for coordinates</span>
              )}
            </span>
          </div>
          <div className={styles.scroller} style={{ "--cell": `${cellSize}px` }}>
            <Grid rows={rows} cols={cols} data={data} highlighted={highlightedPlots} onHoverCell={handleHoverCell} />
          </div>
        </section>
      </main>
    </div>
  );
}
