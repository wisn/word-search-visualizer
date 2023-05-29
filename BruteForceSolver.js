class BruteForceSolver {
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

  solve() {
    const beginTime = new Date();

    for (let row = 0; row < this.#rowNumber; row += 1) {
      for (let col = 0; col < this.#colNumber; col += 1) {
        for (let dir = 0; dir < this.#directions.length; dir += 1) {
          const [deltaRow, deltaCol] = this.#directions[dir];
          let index = 0;
          let currentRow = row;
          let currentCol = col;
          let words = "";

          while (this.traversable(currentRow, currentCol) && this.indexable(index)) {
            words += this.#grid[currentRow][currentCol];

            this.#marker.queueMark({ row: currentRow, col: currentCol });
            this.#marker.animate();
            this.#state.set(`checking (${row},${col}) with (${deltaRow},${deltaCol}) direction`);

            index += 1;
            currentRow += deltaRow;
            currentCol += deltaCol;
          }

          if (words === this.#target) {
            this.#answer.push({ row, col, dir: [deltaRow, deltaCol] });

            index = 0;
            currentRow = row;
            currentCol = col;

            while (this.traversable(currentRow, currentCol) && this.indexable(index)) {
              this.#marker.queueMark({ row: currentRow, col: currentCol, answer: true });
              this.#marker.animate();
              this.#state.set("correct words. mark solution!");
              index += 1;
              currentRow += deltaRow;
              currentCol += deltaCol;
            }
          } else {
            index = 0;
            currentRow = row;
            currentCol = col;

            while (this.traversable(currentRow, currentCol) && this.indexable(index)) {
              this.#marker.queueRevert({ row: currentRow, col: currentCol });
              index += 1;
              currentRow += deltaRow;
              currentCol += deltaCol;
            }

            this.#marker.animate();
            this.#state.set("wrong words. move to the next!");
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
