class BacktrackingSolver {
  #grid;
  #rowNumber;
  #colNumber;
  #target;
  #targetLength;
  #marker;
  #directions;
  #answer;
  #state;
  #elapsedTime;

  constructor({ grid, target, marker, directions, state } = {}) {
    this.#grid = grid;
    this.#rowNumber = grid.length;
    this.#colNumber = grid[0].length;
    this.#target = target;
    this.#targetLength = target.length;
    this.#marker = marker;
    this.#directions = directions;
    this.#answer = Array();
    this.#state = state;
    this.#elapsedTime = 0;
  }

  indexable(index) {
    return 0 <= index && index < this.#targetLength;
  }

  traversable(row, col) {
    return (0 <= row && row < this.#rowNumber) && (0 <= col && col < this.#colNumber);
  }

  recurse(currentRow, currentCol, deltaRow, deltaCol, index) {
    if (!this.traversable(currentRow, currentCol) || !this.indexable(index)) {
      return false;
    }

    this.#marker.queueMark({ row: currentRow, col: currentCol });
    if (index > 1) {
      this.#marker.queueRevert({ row: currentRow + (deltaRow * -1), col: currentCol + (deltaCol * -1) });
    }
    this.#marker.animate();

    if (this.#grid[currentRow][currentCol] !== this.#target[index]) {
      this.#state.set(`${this.#grid[currentRow][currentCol]} vs ${this.#target[index]} (doesn't match)`);
      return false;
    }

    if (index === this.#targetLength - 1) {
      this.#state.set(`${this.#grid[currentRow][currentCol]} vs ${this.#target[index]} (matches so far)`);
      return true;
    }

    this.#state.set(`${this.#grid[currentRow][currentCol]} vs ${this.#target[index]} (matches so far)`);

    return this.recurse(currentRow + deltaRow, currentCol + deltaCol, deltaRow, deltaCol, index + 1);
  }

  solve() {
    const beginTime = new Date();

    for (let row = 0; row < this.#rowNumber; row += 1) {
      for (let col = 0; col < this.#colNumber; col += 1) {
        if (this.#grid[row][col] !== this.#target[0]) {
          this.#marker.queueMark({ row, col });
          this.#marker.animate();
          this.#state.set(`checking (${row},${col}): ${this.#grid[row][col]} vs ${this.#target[0]} (doesn't match)`);
          this.#marker.queueRevert({ row, col });
          this.#marker.animate();
          this.#state.set(`move to the next!`);
          continue;
        }

        for (let dir = 0; dir < this.#directions.length; dir += 1) {
          const [deltaRow, deltaCol] = this.#directions[dir];

          this.#marker.queueMark({ row, col });
          this.#marker.animate();
          this.#state.set(`checking (${row},${col}) with (${deltaRow},${deltaCol}) direction`);

          const matches = this.recurse(row, col, deltaRow, deltaCol, 0);

          if (matches) {
            this.#answer.push({ row, col, dir: [deltaRow, deltaCol] });

            let index = 0;
            let currentRow = row;
            let currentCol = col;

            while (this.traversable(currentRow, currentCol) && this.indexable(index)) {
              this.#marker.queueMark({ row: currentRow, col: currentCol, answer: true });
              this.#marker.animate();
              this.#state.set("correct words. mark solution!");
              index += 1;
              currentRow += deltaRow;
              currentCol += deltaCol;
            }
          } else {
            let index = 0;
            let currentRow = row;
            let currentCol = col;

            while (this.traversable(currentRow, currentCol) && this.indexable(index)) {
              this.#marker.queueRevert({ row: currentRow, col: currentCol });
              index += 1;
              currentRow += deltaRow;
              currentCol += deltaCol;
            }

            this.#marker.animate();
            this.#state.set("move to the next!");
          }
        }
      }
    }

    const endTime = new Date();
    this.#elapsedTime = endTime - beginTime;

    this.#state.set(`done searching. found ${this.#answer.length} words`);
  }

  get answer() {
    return this.#answer;
  }

  get elapsedTime() {
    return this.#elapsedTime;
  }
}
