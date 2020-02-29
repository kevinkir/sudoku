"use strict"

import { Grid } from './grid.js';
import { createSolution } from './create-solution.js';

export class Game {
    constructor(gridWidth, level) {
        // First, compute a valid solution. It is possible that a particular configuration
        // shown to the user may have multiple solutions, but we want to at least make sure
        // that what we show has a possible solution.
        const solution = createSolution(gridWidth);
        solution.print();

        this._grid = new Grid(gridWidth);
        this._grid.init();
    }


}
