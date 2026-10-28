"use client";
import React, { memo } from "react";
import "./grid.css";

const AXIS_STEP = 5;

const Grid = memo(({ rows, cols, data, highlighted, onHoverCell }) => {
  const xHighlightsKeys = Object.keys(highlighted.x);
  const yHighlightsKeys = Object.keys(highlighted.y);

  const renderCell = (row, col) => {
    const color = data[`${row}-${col}`] || "white";
    return (
      <div
        key={`${row}-${col}`}
        className="cell"
        data-row={row}
        data-col={col}
        style={{
          backgroundColor: color,
          borderBottom: xHighlightsKeys.includes(`${row + 2}`) ? `solid 2px ${highlighted.x[row + 2]}` : "",
          borderRight: yHighlightsKeys.includes(`${col + 2}`) ? `solid 2px  ${highlighted.y[col + 2]}` : "",
        }}
      ></div>
    );
  };

  const renderRow = (row) => {
    const cells = [];
    for (let col = 0; col < cols; col++) {
      cells.push(renderCell(row, col));
    }
    return (
      <div key={row} className="row">
        {cells}
      </div>
    );
  };

  const grid = [];
  const xAxis = [];
  const yAxis = [];
  for (let row = 0; row < rows; row++) {
    grid.push(renderRow(row));
    yAxis.push(
      <div key={row} className="axis-tick">
        {row % AXIS_STEP === 0 ? row : ""}
      </div>
    );
  }
  for (let col = 0; col < cols; col++) {
    xAxis.push(
      <div key={col} className="axis-tick">
        {col % AXIS_STEP === 0 ? col : ""}
      </div>
    );
  }

  const handleMouseOver = (e) => {
    const cell = e.target.closest("[data-row]");
    if (!cell || !onHoverCell) return;
    const row = Number(cell.dataset.row);
    const col = Number(cell.dataset.col);
    onHoverCell({ x: col, y: row, color: data[`${row}-${col}`] || null });
  };

  return (
    <div className="grid-frame">
      <div className="axis-corner" aria-hidden="true" />
      <div className="axis axis-x" aria-hidden="true">
        {xAxis}
      </div>
      <div className="axis axis-y" aria-hidden="true">
        {yAxis}
      </div>
      <div className="grid" onMouseOver={handleMouseOver} onMouseLeave={() => onHoverCell && onHoverCell(null)}>
        {grid}
      </div>
    </div>
  );
});
Grid.displayName = "Grid";
export default Grid;
