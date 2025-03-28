import {createElement} from '../framework/render.js';


function createTaskComponentTemplate(task) {

  const{title, status} = task;
    return (
        `
           <li class="taskboard__item task task--${status}">
           <div class="task-body">
              <p class="task--view">${title}</p> 
           </div>
           </li>
`
      );
}


export default class TaskComponent {

  constructor({task}) {
    this.task = task;
  }

  getTemplate() {
    return createTaskComponentTemplate(this.task);
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
