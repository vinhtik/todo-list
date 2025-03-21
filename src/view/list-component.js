import {createElement} from '../framework/render.js';

function createList() {
    return (
        `
        <ul class="add-list">
        <h3>Название</h3>


        </ul>
            
`
      );
}


export default class ListComponent {
  getTemplate() {
    return createList();
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
