class Meta {
  #head;
  #tail;
  #size;
  #taken;

  constructor({ directionLength } = {}) {
    this.#head = Array(directionLength).fill(null);
    this.#tail = Array(directionLength).fill(null);
    this.#size = Array(directionLength).fill(0);
    this.#taken = false;
  }

  get head() {
    return this.#head
  }

  get tail() {
    return this.#tail;
  }

  get size() {
    return this.#size;
  }

  get taken() {
    return this.#taken;
  }

  setTaken(status) {
    this.#taken = status;
  }
}

class Memo {
  #row;
  #col;
  #letter;
  #targetLength;
  #directionLength;
  #next;
  #prev;
  #meta;
  #directions;
  #marker;
  #pointer;
  #state;

  constructor({ row, col, letter, targetLength, directionLength, directions, marker, pointer, state } = {}) {
    this.#row = row;
    this.#col = col;
    this.#letter = letter;
    this.#targetLength = targetLength;
    this.#directionLength = directionLength;
    this.#next = Array(directionLength);
    this.#prev = Array(directionLength);
    this.#meta = Array(directionLength);
    this.#directions = directions;
    this.#marker = marker;
    this.#pointer = pointer;
    this.#state = state;
  }

  get row() {
    return this.#row;
  }

  get col() {
    return this.#col;
  }

  get letter() {
    return this.#letter;
  }

  get next() {
    return this.#next;
  }

  get prev() {
    return this.#prev;
  }

  get meta() {
    return this.#meta;
  }

  emptyDir(dir) {
    return typeof this.#meta[dir] === "undefined";
  }

  emptyIdx(dir, idx) {
    return this.emptyDir(dir) || typeof this.#meta[dir][idx] === "undefined";
  }

  makeChain(dir, idx, memo) {
    if (this.emptyDir(dir)) {
      this.#next[dir] = Array(this.#targetLength);
      this.#prev[dir] = Array(this.#targetLength);
      this.#meta[dir] = Array(this.#targetLength);
    }

    if (memo.emptyDir(dir)) {
      memo.next[dir] = Array(this.#targetLength);
      memo.prev[dir] = Array(this.#targetLength);
      memo.meta[dir] = Array(this.#targetLength);
    }

    this.#next[dir][idx] = memo;
    memo.prev[dir][idx + 1] = this;

    if (this.emptyIdx(dir, idx) && memo.emptyIdx(dir, idx + 1)) {
      const meta = new Meta({ directionLength: this.#directionLength });
      meta.head[dir] = this;
      meta.tail[dir] = memo;
      meta.size[dir] = 2;

      this.#prev[dir][idx] = null;

      this.#meta[dir][idx] = meta;
      memo.meta[dir][idx + 1] = meta;
    } else if (this.emptyIdx(dir, idx)) {
      memo.meta[dir][idx + 1].head[dir] = this;
      memo.meta[dir][idx + 1].size[dir] += 1;

      this.#prev[dir][idx] = null;

      this.#meta[dir][idx] = memo.meta[dir][idx + 1];
    } else if (memo.emptyIdx(dir, idx + 1)) {
      this.#meta[dir][idx].tail[dir] = memo;
      this.#meta[dir][idx].size[dir] += 1;

      memo.meta[dir][idx + 1] = this.#meta[dir][idx];
    }

    this.#marker.queueMark({ row: memo.row, col: memo.col });
    this.#marker.animate();
    this.#pointer.queuePoint({ row: this.#row, col: this.#col, direction: this.#directions[dir] });
    this.#pointer.animate();
    this.#state.set(`make chain from (${this.#row},${this.#col}) to (${memo.row},${memo.col})`);

    this.#marker.queueRevert({ row: memo.row, col: memo.col });
    this.#marker.animate();
    this.#state.set(`move to the next!`);
    this.#pointer.queuePoint({ row: this.#row, col: this.#col, direction: [] });
    this.#pointer.animate();
  }
}

class DynamicProgrammingSolver {
  #grid;
  #rowNumber;
  #colNumber;
  #target;
  #targetLength;
  #marker;
  #pointer;
  #directions;
  #directionLength;
  #indexes;
  #memos;
  #answer;
  #state;
  #elapsedTime;

  constructor({ grid, target, marker, pointer, directions, state } = {}) {
    this.#grid = grid;
    this.#rowNumber = grid.length;
    this.#colNumber = grid[0].length;
    this.#target = target;
    this.#targetLength = target.length;
    this.#marker = marker;
    this.#pointer = pointer;
    this.#directions = directions;
    this.#directionLength = directions.length;
    this.#indexes = {};
    this.#answer = Array();
    this.#state = state;
    this.#elapsedTime = 0;

    for (let i = 0; i < this.#targetLength; i += 1) {
      const letter = this.#target[i];
      if (typeof this.#indexes[letter] === "undefined") {
        this.#indexes[letter] = Array();
      }
      this.#indexes[letter].push(i);
    }

    this.#memos = Array(this.#rowNumber);
    for (let row = 0; row < this.#rowNumber; row += 1) {
      this.#memos[row] = Array(this.#colNumber);
    }
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
        const letter = this.#grid[row][col];

        if (typeof this.#indexes[letter] === "undefined") {
          this.#marker.queueMark({ row, col });
          this.#marker.animate();
          this.#state.set(`checking (${row},${col}): 0 indexes`);
          this.#marker.queueRevert({ row, col })
          this.#marker.animate();
          this.#state.set(`move to the next!`);
          this.#pointer.queuePoint({ row, col, direction: [] });
          this.#pointer.animate();
          this.#pointer.queuePoint({ row, col, direction: [] });
          this.#pointer.animate();
          continue;
        }

        if (typeof this.#memos[row][col] === "undefined") {
          this.#memos[row][col] = new Memo({
            row,
            col,
            letter,
            targetLength: this.#targetLength,
            directionLength: this.#directionLength,
            directions: this.#directions,
            marker: this.#marker,
            pointer: this.#pointer,
            state: this.#state,
          });
        }

        for (let dir = 0; dir < this.#directionLength; dir += 1) {
          const deltaRow = this.#directions[dir][0];
          const deltaCol = this.#directions[dir][1];
          const nextRow = row + deltaRow;
          const nextCol = col + deltaCol;

          this.#marker.queueMark({ row, col });
          this.#marker.animate();
          this.#pointer.queuePoint({ row, col, direction: [] });
          this.#pointer.animate();
          this.#state.set(`checking (${row},${col}) with (${deltaRow},${deltaCol}) direction`);

          if (!this.traversable(nextRow, nextCol)) {
            continue;
          }

          this.#indexes[letter].forEach(idx => {
            if (this.indexable(idx + 1) && this.#grid[nextRow][nextCol] === this.#target[idx + 1]) {
              if (typeof this.#memos[nextRow][nextCol] === "undefined") {
                this.#memos[nextRow][nextCol] = new Memo({
                  row: nextRow,
                  col: nextCol,
                  letter: this.#grid[nextRow][nextCol],
                  targetLength: this.#targetLength,
                  directionLength: this.#directionLength,
                  directions: this.#directions,
                  marker: this.#marker,
                  pointer: this.#pointer,
                  state: this.#state,
                });
              }

              this.#memos[row][col].makeChain(dir, idx, this.#memos[nextRow][nextCol]);

              if (this.#memos[row][col].meta[dir][idx].size[dir] === this.#targetLength) {
                if (!this.#memos[row][col].meta[dir][idx].taken) {
                  this.#answer.push({ row, col, dir: [deltaRow, deltaCol] });
                  this.#memos[row][col].meta[dir][idx].setTaken(true);

                  let index = 0;
                  let currentRow = this.#memos[row][col].meta[dir][idx].head[dir].row;
                  let currentCol = this.#memos[row][col].meta[dir][idx].head[dir].col;

                  while (this.traversable(currentRow, currentCol) && this.indexable(index)) {
                    this.#marker.queueMark({ row: currentRow, col: currentCol, answer: true });
                    this.#marker.animate();
                    this.#pointer.queuePoint({ row, col, direction: [] });
                    this.#pointer.animate();
                    this.#state.set("correct words. mark solution!");
                    index += 1;
                    currentRow += deltaRow;
                    currentCol += deltaCol;
                  }
                }
              }
            }
          });
        }

        this.#marker.queueRevert({ row, col });
        this.#marker.animate();
        this.#state.set(`move to the next!`);
        this.#pointer.queuePoint({ row, col, direction: [] });
        this.#pointer.animate();
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
