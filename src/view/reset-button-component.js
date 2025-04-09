import { createElement } from "../framework/render.js";
import { AbstractComponent } from '../framework/view/abstract-component.js';

function createResetButton(){
    return(
        `<button class="clear">Очистить</button>`
    );
}

export default class ButtonResetComponent extends AbstractComponent{
  get template() {
    return createResetButton();
  }


}

