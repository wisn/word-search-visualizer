class GridMaker {
  #grid;
  #rowNumber;
  #colNumber;
  #canvasId;
  #tableElement;
  #tableObject;

  constructor({ grid, canvasId } = {}) {
    this.#grid = grid;
    this.#rowNumber = grid.length;
    this.#colNumber = grid[0].length;
    this.#canvasId = canvasId;
    this.#tableElement = document.createElement("table");
    this.#tableObject = Array(this.#rowNumber);
  }

  draw() {
    this.#tableElement.classList.add("grid");
    this.#tableElement.style.display = "inline-block";
    this.#tableElement.style.margin = 0;
    this.#tableElement.style.padding = 0;

    for (let row = 0; row < this.#rowNumber; row += 1) {
      const tableRow = document.createElement("tr");
      tableRow.classList.add("row");
      tableRow.dataset["row"] = row;
      tableRow.style.display = "block";
      tableRow.style.margin = 0;
      tableRow.style.padding = 0;
      tableRow.style.borderLeft = "1px solid black";
      tableRow.style.borderRight = "1px solid black";
      tableRow.style.borderTop = row == 0 ? "1px solid black" : 0;
      tableRow.style.borderBottom = row == this.#rowNumber - 1 ? "1px solid black" : 0;

      this.#tableObject[row] = Array(this.#colNumber);

      for (let col = 0; col < this.#colNumber; col += 1) {
        const tableCol = document.createElement("td");
        tableCol.classList.add("col");
        tableCol.dataset["row"] = row;
        tableCol.dataset["col"] = col;
        tableCol.style.display = "inline-block";
        tableCol.style.textAlign = "center";
        tableCol.style.verticalAlign = "center";
        tableCol.style.minWidth = "20px";
        tableCol.style.margin = 0;
        tableCol.style.padding = "20px";
        tableCol.style.fontSize = "14pt";
        tableCol.style.fontWeight = 900;
        tableCol.style.border = "2px solid #222";
        tableCol.style.position = "relative";
        tableCol.append(document.createTextNode(this.#grid[row][col]));

        tableRow.append(tableCol);

        this.#tableObject[row][col] = tableCol;
      }

      this.#tableElement.append(tableRow);
    }

    document.getElementById(this.#canvasId).replaceChildren();
    document.getElementById(this.#canvasId).append(this.#tableElement);
  }

  get table() {
    return this.#tableObject;
  }
}
