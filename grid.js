"use strict"

import { range } from './utils.js';

export class Grid {
    constructor(gridWidth) {
        this.grid = new Array(gridWidth);

        this.missingInRows = new Array(gridWidth);
        this.missingInCols = new Array(gridWidth);
        this.missingInBoxes = new Array(gridWidth);
    }

    init() {
        const oneThroughWidth = range(1, this.grid.length + 1);
        for (let i = 0; i < this.grid.length; i++) {
            this.grid[i] = new Array(this.grid.length);

            this.missingInRows[i] = new Set(oneThroughWidth);
            this.missingInCols[i] = new Set(oneThroughWidth);
            this.missingInBoxes[i] = new Set(oneThroughWidth);
        }
    }

    setValue(row, col, value) {
        this.grid[row][col] = value;

        this.missingInRows[row].delete(value);
        this.missingInCols[col].delete(value);
        this.missingInBoxes[this._boxIndex(row, col)].delete(value);

        // Fill left-to-right and top-to-bottom.
        if (this.nextColIndex === this.grid.length - 1) {
            this.nextRowIndex++;
            this.nextColIndex = 0;
        } else {
            this.nextColIndex++;
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

    _boxIndex(row, col) {
        const boxRowIndex = Math.floor(row / 3);
        const boxColIndex = Math.floor(col / 3);
        return boxRowIndex * 3 + boxColIndex;
    }
}
