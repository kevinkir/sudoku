"use strict"

function isValidGridWidth(gridWidth) {
    return Number.isInteger(gridWidth ** 0.5);
}

export function createGrid(gridWidth) {
    if (!isValidGridWidth(gridWidth)) {
        throw new Error(`Cannot create a grid of width ${gridWidth}. Grid width must be a square number`);
    }
    const grid = new Array(gridWidth);
    for (let i = 0; i < gridWidth; i++) {
        grid[i] = new Array(gridWidth);
    }
    return grid;
}
