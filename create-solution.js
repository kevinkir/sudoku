"use strict"

import { ManagedGrid } from './managed-grid.js';
import { shuffledRange } from './utils.js';

function fillManagedGrid(managedGrid) {
    if (managedGrid.isFull()) {
        return managedGrid;
    }
    const next = managedGrid.nextCellPossibilities();

    for (let i = 0; i < next.length; i++) {
        const filled = fillManagedGrid(next[i]);
        if (filled) {
            return filled;
        }
    };
    return null;
}

export function createSolution(gridWidth) {
    const managedGrid = new ManagedGrid(gridWidth);
    managedGrid.init();

    // Start with a randomized first row, since this is what is going to happen anyways
    // with a bunch of unnecessary cloning.
    const firstRow = shuffledRange(1, gridWidth + 1);
    firstRow.forEach((val) => managedGrid.setNextValue(val));

    const filledManagedGrid = fillManagedGrid(managedGrid);
    filledManagedGrid.print();
    return filledManagedGrid.grid;
}
