import { createElement } from "../framework/render.js";

function createResetButton(){
    return(
        `<button class="clear">Очистить</button>`
    );
}

export default class ButtonResetComponent {
  getTemplate() {
    return createResetButton();
  }


  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }


    return this.element;
  }


  removeElement() {
    this.element = null;
  }
}

