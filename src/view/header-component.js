import {createElement} from '../framework/render.js'; 
import { AbstractComponent } from '../framework/view/abstract-component.js';

function createHeaderComponentTemplate() {
    return (
        `<header class="board-app__header">
          <div class="board-app__inner">
            <h1>Список задач</h1>
          </div>
        </header>`
      );
}


export default class HeaderComponent extends AbstractComponent{
  get template() {
    return createHeaderComponentTemplate();
  }



}
