import {createElement} from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskComponentTemplate(task) {
  const {title, status, id} = task;
  return `
    <li class="taskboard__item task task--${status}" data-id="${id}">
      <div class="task-body">
        <p class="task--view">${title}</p> 
      </div>
    </li>
  `;
}

export default class TaskComponent extends AbstractComponent {
  #dragHandlers = {
    start: null,
    end: null
  };

  constructor({task}) {
    super();
    this.task = task;
    this.#afterCreateElement();
  }

  get template() {
    return createTaskComponentTemplate(this.task);
  }

  #afterCreateElement() {
    this.#makeTaskDraggable();
  }

  #makeTaskDraggable() {
    this.element.setAttribute('draggable', 'true');
    this.element.dataset.id = this.task.id;
    this.#setupDragHandlers();
  }


  #setupDragHandlers() {
    this.#dragHandlers.start = (e) => {
      e.dataTransfer.setData('text/plain', this.task.id);
      this.#startDrag();
    };

    this.#dragHandlers.end = () => {
      this.#endDrag();
    };

    this.element.addEventListener('dragstart', this.#dragHandlers.start);
    this.element.addEventListener('dragend', this.#dragHandlers.end);
  }


  #startDrag() {
    this.element.classList.add('is-dragging');
    document.querySelectorAll('.tasks-container').forEach(list => {
      list.classList.add('drag-active');
    });
  }

  #endDrag() {
    this.element.classList.remove('is-dragging');
    document.querySelectorAll('.tasks-container').forEach(list => {
      list.classList.remove('drag-active');
    });
  }


}