import {createElement} from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';

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


export default class TaskComponent extends AbstractComponent{

  constructor({task}) {
    super();
    this.task = task;
  }

  get template() {
    return createTaskComponentTemplate(this.task);
  }

}
