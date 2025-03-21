import {createElement} from '../framework/render.js';


function createTask() {
    return (
        `
            <li>
                new task
            </li>
`
      );
}


export default class TaskComponent {
  getTemplate() {
    return createTask();
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
