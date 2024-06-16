"use client";
import React, { memo, useCallback } from "react";
import "./grid.css";

const Grid = memo(({ rows, cols, data, highlighted }) => {
  const xHighlightsKeys = Object.keys(highlighted.x);
  const yHighlightsKeys = Object.keys(highlighted.y);

  const renderCell = (row, col) => {
    const color = data[`${row}-${col}`] || "white";
    return (
      <div
        key={`${row}-${col}`}
        className="cell"
        style={{
          backgroundColor: color,
          borderBottom: xHighlightsKeys.includes(`${row + 2}`) ? `solid 2px ${highlighted.x[row + 2]}` : "",
          borderRight: yHighlightsKeys.includes(`${col + 2}`) ? `solid 2px  ${highlighted.y[col + 2]}` : "",
        }}
      ></div>
    );
  };

  const renderRow = useCallback(
    (row) => {
      const cells = [];
      for (let col = 0; col < cols; col++) {
        cells.push(renderCell(row, col));
      }
      return (
        <div key={row} className="row">
          {cells}
        </div>
      );
    },
    [rows, cols, data, renderCell]
  );

  const grid = [];
  for (let row = 0; row < rows; row++) {
    grid.push(renderRow(row));
  }

  return (
    <div
      className="grid"
      style={{
        marginTop: "50px",
      }}
    >
      {grid}
    </div>
  );
});
Grid.displayName = "Grid";
export default Grid;
