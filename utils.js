"use strict"

export function union(...sets) {
    const unionSet = new Set();
    sets.forEach((set) => {
        set.forEach((value) => {
            unionSet.add(value);
        });
    });
    return unionSet;
}

export function intersection(...sets) {
    const unionSet = union(...sets);
    const intersectionSet = new Set();
    unionSet.forEach((val) => {
        if (sets.every((set) => set.has(val))) {
            intersectionSet.add(val);
        }
    });
    return intersectionSet;
}

export function range(begin, end) {
    const arr = new Array(end - begin);
    for (let i = begin; i < end; i++) {
        arr[i - begin] = i;
    }
    return arr;
}

export function random(upperBound) {
    return Math.floor(Math.random() * upperBound);
}

function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

export function shuffleInPlace(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        const j = random(arr.length - i);
        swap(arr, i, j);
    }
}

export function shuffledRange(begin, end) {
    const arr = range(begin, end);
    shuffleInPlace(arr);
    return arr;
}
