"use strict"

import { Grid } from './grid.js';
import { intersection, shuffledRange, shuffleInPlace } from './utils.js';

class SelfFillingGrid extends Grid {
    constructor(gridWidth, nextRowIndex = 0, nextColIndex = 0) {
        super(gridWidth);

        // These keep track of the next unfilled cell, going left-to-right and top-to-bottom.
        this._nextRowIndex = nextRowIndex;
        this._nextColIndex = nextColIndex;
    }

    /**
     * This returns an array of clones of the grid with the next cell filled in with all its
     * possible values.
     */
    nextCellPossibilities() {
        const possibleValues = intersection(
            this.missingInRows[this._nextRowIndex],
            this.missingInCols[this._nextColIndex],
            this.missingInBoxes[this._nextBoxIndex()]
        );
        return [...possibleValues].map((value) => {
            const clone = this._clone();
            clone.setNextValue(value);
            return clone;
        });
    }

    setNextValue(value) {
        this.setValue(this._nextRowIndex, this._nextColIndex, value)

        // Fill left-to-right and top-to-bottom.
        if (this._nextColIndex === this.grid.length - 1) {
            this._nextRowIndex++;
            this._nextColIndex = 0;
        } else {
            this._nextColIndex++;
        }
    }

    isFull() {
        return this._nextRowIndex >= this.grid.length;
    }

    _clone() {
        const cloned = new SelfFillingGrid(this.grid.length, this._nextRowIndex, this._nextColIndex);

        for (let i = 0; i < this.grid.length; i++) {
            cloned.grid[i] = new Array(this.grid.length);
            if (i <= this._nextRowIndex) {
                for (let j = 0; j < this.grid.length; j++) {
                    cloned.grid[i][j] = this.grid[i][j];
                }
            }

            cloned.missingInRows[i] = new Set(this.missingInRows[i]);
            cloned.missingInCols[i] = new Set(this.missingInCols[i]);
            cloned.missingInBoxes[i] = new Set(this.missingInBoxes[i]);
        }
        return cloned;
    }

    _nextBoxIndex() {
        return this._boxIndex(this._nextRowIndex, this._nextColIndex);
    }
}

function fillGrid(grid) {
    if (grid.isFull()) {
        return grid;
    }
    const next = grid.nextCellPossibilities();
    shuffleInPlace(next);
    for (let i = 0; i < next.length; i++) {
        const filled = fillGrid(next[i]);
        if (filled) {
            return filled;
        }
    };
    return null;
}

export function createSolution(gridWidth) {
    const grid = new SelfFillingGrid(gridWidth);
    grid.init();

    // Start with a randomized first row, since this is what is going to happen anyways
    // with a bunch of unnecessary cloning.
    const firstRow = shuffledRange(1, gridWidth + 1);
    firstRow.forEach((val) => grid.setNextValue(val));

    return fillGrid(grid);
}