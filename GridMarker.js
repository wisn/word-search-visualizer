class GridMarker {
  #table;
  #rowNumber;
  #colNumber;
  #markerColor;
  #answerColor;
  #originalColor;
  #answers;
  #queue;
  #seconds;

  constructor({ table, markerColor, answerColor, originalColor = "#ffffff" } = {}) {
    this.#table = table;
    this.#rowNumber = table.length;
    this.#colNumber = table[0].length;
    this.#markerColor = markerColor;
    this.#answerColor = answerColor;
    this.#originalColor = originalColor;

    this.#answers = Array(this.#rowNumber);
    for (let row = 0; row < this.#rowNumber; row += 1) {
      this.#answers[row] = Array(this.#colNumber).fill(false);
      for (let col = 0; col < this.#colNumber; col += 1) {
        this.#table[row][col].style.backgroundColor = this.#originalColor;
      }
    }

    this.#queue = Array();
    this.#seconds = 0;
  }

  mark({ row, col, answer = false } = {}) {
    if ((0 <= row && row < this.#rowNumber) && (0 <= col && col < this.#colNumber)) {
      if (answer) {
        this.#table[row][col].style.backgroundColor = this.#answerColor;
        this.#answers[row][col] = true;
      } else {
        this.#table[row][col].style.backgroundColor = this.#markerColor;
      }
    }
  }

  revert({ row, col } = {}) {
    if ((0 <= row && row < this.#rowNumber) && (0 <= col && col < this.#colNumber)) {
      if (this.#answers[row][col]) {
        this.#table[row][col].style.backgroundColor = this.#answerColor;
      } else {
        this.#table[row][col].style.backgroundColor = this.#originalColor;
      }
    }
  }

  queue(method, obj = {}) {
    this.#queue.push({ method , obj });
  }

  queueMark(obj = {}) {
    this.queue(this.mark, obj);
  }

  queueRevert(obj = {}) {
    this.queue(this.revert, obj);
  }

  animate() {
    setTimeout(draw(this, this.#queue, this.#seconds), window.globals.intervalTime * this.#seconds);

    function draw(marker, queue) {
      return function() {
        queue.forEach(({ method, obj }) => {
          marker[method.name]({ ...obj });
        });
      };
    }

    this.#queue = Array();
    this.#seconds += 1;
  }
}
