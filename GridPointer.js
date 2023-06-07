class GridPointer {
  #table;
  #rowNumber;
  #colNumber;
  #rotator;
  #pointed;
  #queue;
  #seconds;

  constructor({ table } = {}) {
    this.#table = table;
    this.#rowNumber = table.length;
    this.#colNumber = table[0].length;
    this.#rotator = {
      "0,-1": { transform: "rotate(180deg)", top: "15%", left: "-35%", width: "35px" },
      "-1,-1": { transform: "rotate(225deg)", top: "-25%", left: "-60%", width: "60px" },
      "-1,0": { transform: "rotate(270deg)", top: "-30%", left: "15%", width: "35px" },
      "-1,1": { transform: "rotate(315deg)", top: "-35%", left: "55%", width: "60px" },
      "0,1": { transform: "rotate(0deg)", top: "35%", left: "75%", width: "35px" },
      "1,1": { transform: "rotate(45deg)", top: "80%", left: "65%", width: "60px" },
      "1,0": { transform: "rotate(90deg)", top: "85%", left: "30%", width: "35px" },
      "1,-1": { transform: "rotate(135deg)", top: "90%", left: "-55%", width: "60px" },
    };
    this.#pointed = Array(this.#rowNumber);
    for (let row = 0; row < this.#rowNumber; row += 1) {
      this.#pointed[row] = Array(this.#colNumber);
      for (let col = 0; col < this.#colNumber; col += 1) {
        this.#pointed[row][col] = {};
      }
    }
    this.#queue = Array();
    this.#seconds = 0;

    document.querySelectorAll("img.arrow").forEach(elm => elm.remove());
  }

  point({ row, col, direction } = {}) {
    if (!(0 <= row && row < this.#rowNumber) || !(0 <= col && col < this.#colNumber)) {
      return;
    }

    if (typeof this.#rotator[direction.toString()] === "undefined") {
      return;
    }

    if (this.#pointed[row][col][direction.toString()]) {
      return;
    }

    const arrow = document.createElement("img");
    arrow.src = "./arrow.png";
    arrow.classList.add("arrow");
    arrow.style.zIndex = 9999;

    const styles = this.#rotator[direction.toString()];
    Object.keys(styles).forEach(key => {
      arrow.style[key] = styles[key];
    });

    this.#table[row][col].appendChild(arrow);
    this.#pointed[row][col][direction.toString()] = true;
  }

  queue(method, obj = {}) {
    this.#queue.push({ method , obj });
  }

  queuePoint(obj = {}) {
    this.queue(this.point, obj);
  }

  animate() {
    setTimeout(draw(this, this.#queue, this.#seconds), window.globals.intervalTime * this.#seconds);

    function draw(pointer, queue) {
      return function() {
        queue.forEach(({ method, obj }) => {
          pointer[method.name]({ ...obj });
        });
      };
    }

    this.#queue = Array();
    this.#seconds += 1;
  }
}
