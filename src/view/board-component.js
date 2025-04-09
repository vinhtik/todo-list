import {createElement} from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';

function createBoard() {
    return (
        `
        <section class="add-board">
        
        </section>
            
`
      );
}


export default class BoardComponent extends AbstractComponent{
  get template() {
    return createBoard();
  }

}
