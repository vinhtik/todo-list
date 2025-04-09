import {createElement} from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';

function createList(label, status) {

    return (
        `
        <div class="task-list">
            <h3 class="${status}">${label}</h3>
            <ul class="tasks-container"></ul>
        </div>  
`
      );
}


export default class ListComponent extends AbstractComponent{

  constructor({ label, status }) {
    super();
    this.label = label;
    this.status = status;
}

  get template() {
    return createList(this.label, this.status);
  }


}
