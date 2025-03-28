import {createElement} from '../framework/render.js';

function createList(title, status) {
  const clearButton = status === "trash" ? `<button class="clear">Очистить</button>`:'';

    return (
        `
        <div class="task-list">
            <h3 class="${status}">${title}</h3>
            <ul class="tasks-container"></ul>
            ${clearButton}
        </div>  
`
      );
}


export default class ListComponent {

  constructor({ title, status }) {
    this.title = title;
    this.status = status;
}

  getTemplate() {
    return createList(this.title, this.status);
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
