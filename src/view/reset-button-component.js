import { createElement } from "../framework/render.js";
import { AbstractComponent } from '../framework/view/abstract-component.js';

function createResetButton(){
    return(
        `<button class="clear" type="reset">Очистить</button>`
    );
}

export default class ButtonResetComponent extends AbstractComponent{
  #handleClick = null;

  constructor({onClick}){
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('click', this.#clickHandler)
  }

  get template() {
    return createResetButton();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  }

}

