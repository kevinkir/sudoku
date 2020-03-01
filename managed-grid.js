"use strict"

import { createGrid } from './create-grid.js';
import { intersection, range, shuffleInPlace } from './utils.js';

function computeBoxWidth(gridWidth) {
    return gridWidth ** 0.5;
}

export class ManagedGrid {
    constructor(gridWidth, nextRowIndex = 0, nextColIndex = 0) {
        this.grid = createGrid(gridWidth);
    
        // These keep track of the next unfilled cell, going left-to-right and top-to-bottom.
        this._nextRowIndex = nextRowIndex;
        this._nextColIndex = nextColIndex;

        this.missingInRows = new Array(gridWidth);
        this.missingInCols = new Array(gridWidth);
        this.missingInBoxes = new Array(gridWidth);
    }

    init() {
        const oneThroughWidth = range(1, this.grid.length + 1);
        for (let i = 0; i < this.grid.length; i++) {
            this.missingInRows[i] = new Set(oneThroughWidth);
            this.missingInCols[i] = new Set(oneThroughWidth);
            this.missingInBoxes[i] = new Set(oneThroughWidth);
        }
    }

    print() {
        this.grid.forEach((row) => {
            let rowStr = '';
            for (let i = 0; i < row.length; i++) {
                if (typeof row[i] !== 'undefined') {
                    rowStr += row[i] + ' ';
                } else {
                    rowStr += '_ ';
                }
            }
            console.log(rowStr.slice(0, -1));
        });
    }

    /**
     * This returns an array of clones of the grid with the next cell filled in with all its
     * possible values.
     */
    nextCellPossibilities() {
        const possibleValuesSet = intersection(
            this.missingInRows[this._nextRowIndex],
            this.missingInCols[this._nextColIndex],
            this.missingInBoxes[this._nextBoxIndex()]
        );
        const possibleValues = [...possibleValuesSet];

        // We want to construct the solution in a random solution, so randomize the possible
        // values before proceeding.
        shuffleInPlace(possibleValues);

        return possibleValues.map((value) => {
            const clone = this._clone();
            clone.setNextValue(value);
            return clone;
        });
    }

    setNextValue(value) {
        this.grid[this._nextRowIndex][this._nextColIndex] = value;

        this.missingInRows[this._nextRowIndex].delete(value);
        this.missingInCols[this._nextColIndex].delete(value);
        this.missingInBoxes[this._nextBoxIndex()].delete(value);

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
        const cloned = new ManagedGrid(this.grid.length, this._nextRowIndex, this._nextColIndex);

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
        const boxWidth = computeBoxWidth(this.grid.length);
        const boxRowIndex = Math.floor(this._nextRowIndex / boxWidth);
        const boxColIndex = Math.floor(this._nextColIndex / boxWidth);
        return boxRowIndex * boxWidth + boxColIndex;
    }
}
