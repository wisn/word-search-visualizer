class StateManager {
  #targetElement;
  #seconds;

  constructor({ targetElement } = {}) {
    this.#targetElement = targetElement;
    this.#seconds = 0;

    this.#targetElement.innerHTML = "N/A";
  }

  set(state = "N/A") {
    setTimeout(updateState(this.#targetElement, state), window.globals.intervalTime * this.#seconds);

    function updateState(target, state) {
      return function() {
        target.innerHTML = state;
      };
    }

    this.#seconds += 1;
  }
}
