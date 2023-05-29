class TestcaseGenerator {
  #rowNumber;
  #colNumber;
  #targetLength;
  #startPointNumber;
  #grid;
  #target;
  #options;
  #directions;

  constructor({ rowNumber, colNumber, targetLength, startPointNumber, directions } = {}) {
    this.#rowNumber = rowNumber;
    this.#colNumber = colNumber;
    this.#targetLength = targetLength;
    this.#startPointNumber = startPointNumber;
    this.#options = {
      targetOverride: null, // in the form of "ABCDEFG" string
      gridOverride: null, // in the form of "X" character
    };
    this.#directions = directions;
  }

  generate(overridedOptions = {}) {
    const options = { ...this.#options, ...overridedOptions };
    const grid = Array(this.#rowNumber);

    if (options.targetOverride !== null && options.targetOverride.length !== this.#targetLength) {
      throw new RangeError(`the length of targetOverride should be the same with targetLength: ${options.targetOverride.length} vs ${this.#targetLength}`);
    }

    for (let row = 0; row < this.#rowNumber; row += 1) {
      grid[row] = Array(this.#colNumber);

      for (let col = 0; col < this.#colNumber; col += 1) {
        if (typeof options.gridOverride === "string") {
          grid[row][col] = options.gridOverride;
        } else {
          grid[row][col] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
      }
    }

    let target = "";
    if (typeof options.targetOverride === "string") {
      target = options.targetOverride;
    } else {
      for (let i = 0; i < this.#targetLength; i += 1) {
        target += String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }

    for (let i = 0; i < this.#startPointNumber; i += 1) {
      let currentRow = Math.floor(Math.random() * this.#rowNumber);
      let currentCol = Math.floor(Math.random() * this.#colNumber);

      const [deltaRow, deltaCol] = this.#directions[Math.floor(Math.random() * this.#directions.length)];
      let targetRow = currentRow;
      let targetCol = currentCol;

      for (let k = 0; k < this.#targetLength; k += 1) {
        const traversable = (0 <= targetRow && targetRow < this.#rowNumber) && (0 <= targetCol && targetCol < this.#colNumber);
        if (!traversable) {
          break;
        }

        grid[targetRow][targetCol] = target[k];
        targetRow += deltaRow;
        targetCol += deltaCol;
      }
    }

    this.#grid = grid;
    this.#target = target;
  }

  get grid() {
    return this.#grid;
  }

  get target() {
    return this.#target;
  }
}
