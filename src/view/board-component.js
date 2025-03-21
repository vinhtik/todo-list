import {createElement} from '../framework/render.js';

function createBoard() {
    return (
        `
        <section class="add-board">
        
        </section>
            
`
      );
}


export default class BoardComponent {
  getTemplate() {
    return createBoard();
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
