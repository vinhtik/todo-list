import {createElement} from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';

function createList(label, status) {

    return (
        `
        <div class="task-list">
            <h3 class="${status}">${label}</h3>
            <ul class="tasks-container"></ul>
            <div class="list-actions"></div>
        </div>  
`
      );
}


export default class ListComponent extends AbstractComponent{

  constructor({ label, status, onTaskDrop }) {
    super();
    this.label = label;
    this.status = status;
    this.#setDropHandler(onTaskDrop);
}

  get template() {
    return createList(this.label, this.status);
  }

  #insertAboveTask(mouseY) {
    const tasks = this.element.querySelectorAll('.task:not(.is-dragging)');
    let closestTask = null;
    let closestOffset = Number.NEGATIVE_INFINITY;

    tasks.forEach((task) => {
      const { top } = task.getBoundingClientRect();
      const offset = mouseY - top;

      if (offset < 0 && offset > closestOffset) {
        closestOffset = offset;
        closestTask = task;
      }
    });
    
    return closestTask;
  }


  #setDropHandler(onTaskDrop) {
    const container = this.element.querySelector('.tasks-container');
    let currentDragElement = null;
    let originalList = null;

    container.addEventListener('taskdropped', (e) => {
      const { taskId, status, insertBeforeId } = e.detail;
      if (status === this.status) {
          onTaskDrop(taskId, status, insertBeforeId);
      }
  });

    container.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('task')) {
            originalList = this.element;
        }
    }, true);

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        const afterElement = this.#insertAboveTask(e.clientY);
        const draggable = document.querySelector('.is-dragging');
        
        if (!draggable) return;
        
        currentDragElement = draggable;
        
        if (!afterElement) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement);
        }
        
        draggable.classList.remove(
            'task--backlog', 'task--processing', 'task--done', 'task--trash'
        );
        draggable.classList.add(`task--${this.status}`);
    });

    container.addEventListener('drop', (e) => {
        e.preventDefault();
        if (!currentDragElement) return;
        
        const taskId = currentDragElement.dataset.id;
        const afterElement = this.#insertAboveTask(e.clientY);
        
        onTaskDrop(taskId, this.status, afterElement?.dataset.id ?? null);
        currentDragElement = null;
        originalList = null;
    });

    document.addEventListener('dragend', (e) => {
        if (currentDragElement && originalList) {
            const originalContainer = originalList.querySelector('.tasks-container');
            originalContainer.appendChild(currentDragElement);
            
            currentDragElement.classList.remove('is-dragging');
            currentDragElement = null;
            originalList = null;
        }
    });
}
}
