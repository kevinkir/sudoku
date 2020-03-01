"use strict"

import { convert1DIndexTo2DIndex, Game } from './game.js';

const GRID_WIDTH = 9;

window.onload = () => {
    const levelDropdown = document.querySelector('.level-dropdown');

    // Close over a mutable object, rather than values, so that event handlers
    // do not operate on stale values.
    const context = {
        level: Number.parseInt(levelDropdown.value),
        game: null,
    };

    document.querySelector('.check-button').addEventListener('click', () => {
        if (context.game.check()) {
            alert('Compete!');
        } else {
            alert('Solution is incorrect!');
        }
    });

    levelDropdown.addEventListener('change', (event) => {
        context.level = Number.parseInt(event.target.value);
    });

    const cells = document.querySelectorAll('.sudoku-grid-cell-input');
    cells.forEach((cell, i) => {
        const { row, col } = convert1DIndexTo2DIndex(GRID_WIDTH, i);
        cell.addEventListener('change', (event) => {
            context.game.grid[row][col] = Number.parseInt(event.target.value);
        });
    });

    function newGame() {
        context.game = new Game(GRID_WIDTH, context.level);
        cells.forEach((cell, i) => {
            const { row, col } = convert1DIndexTo2DIndex(GRID_WIDTH, i);

            const initialValue = context.game.grid[row][col];
            if (typeof initialValue !== 'undefined') {
                cell.value = String(initialValue);
                cell.disabled = true;
            } else {
                cell.disabled = false;
                cell.value = '';
            }
        });
    }

    document.querySelector('.new-game-button').addEventListener('click', newGame);

    newGame();
};
