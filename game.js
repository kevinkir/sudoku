"use strict"

import { createGrid } from './create-grid.js';
import { createSolution } from './create-solution.js';
import { range, shuffledRange } from './utils.js';

function numStartingSquaresForLevel(gridWidth, level) {
    return Math.floor(gridWidth ** 2 / (level * 3));
}

export function convert1DIndexTo2DIndex(gridWidth, oneDimensionalIndex) {
    const row = Math.floor(oneDimensionalIndex / gridWidth);
    const col = oneDimensionalIndex % gridWidth;
    return { row, col };
}

export class Game {
    constructor(gridWidth, level) {
        // First, compute a valid solution. It is possible that a particular configuration
        // shown to the user may have multiple solutions, but we want to at least make sure
        // that what we show has a possible solution.
        const solution = createSolution(gridWidth);

        this.grid = createGrid(gridWidth);
        this.startingSquares = createGrid(gridWidth);

        const oneDimensionalIndices = shuffledRange(0, gridWidth ** 2);
        const numStartingSquares = numStartingSquaresForLevel(gridWidth, level);

        for (let i = 0; i < numStartingSquares; i++) {
            const { row, col } = convert1DIndexTo2DIndex(gridWidth, oneDimensionalIndices[i]);
            this.startingSquares[row][col] = solution[row][col];
            this.grid[row][col] = solution[row][col];
        }
    }

    check() {
        for (let i = 0; i < this.grid.length; i++) {
            if (!this._isValid(this._row(i))) {
                return false;
            }
            if (!this._isValid(this._col(i))) {
                return false;
            }
            if (!this._isValid(this._box(i))) {
                return false;
            }
        }
        return true;
    }

    _isValid(collection) {
        const expectedValues = new Set(range(1, this.grid.length + 1));
        for (let i = 0; i < collection.length; i++) {
            if (!expectedValues.delete(collection[i])) {
                return false;
            }
        }
        return true;
    }

    _row(i) {
        return this.grid[i];
    }

    _col(i) {
        return this.grid.map((row) => row[i]);
    }

    _box(i) {
        const box = [];
        const boxSize = this.grid.length ** 0.5;
        const rowOffset = Math.floor(i / boxSize) * boxSize;
        const colOffset = Math.floor(i % boxSize) * boxSize;
        for (let row = rowOffset; row < boxSize + rowOffset; row++) {
            for (let col = colOffset; col < boxSize + colOffset; col++) {
                box.push(this.grid[row][col]);
            }
        }
        return box;
    }
}
