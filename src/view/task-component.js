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
  #touchHandlers = {
    start: null,
    move: null,
    end: null
  };
  
  #dragHandlers = {
    start: null,
    end: null
  };

  constructor({task}) {
    super();
    this.task = task;
    this.isTouchDevice = 'ontouchstart' in window;
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
    
    if (this.isTouchDevice) {
      this.#setupTouchHandlers();
    } else {
      this.#setupDragHandlers();
    }
  }

  #setupTouchHandlers() {
    let touchOffset, elementWidth;

    this.#touchHandlers.start = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this.element.getBoundingClientRect();
      
      elementWidth = this.element.offsetWidth;
      touchOffset = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
      
      this.element.style.position = 'fixed';
      this.element.style.left = `${rect.left}px`;
      this.element.style.top = `${rect.top}px`;
      this.element.style.width = `${elementWidth}px`;
      this.element.style.zIndex = '1000';
      this.element.style.margin = '0'; 
      
      this.#startDrag();
    };

    this.#touchHandlers.move = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      
      const x = touch.clientX - touchOffset.x;
      const y = touch.clientY - touchOffset.y;
      
      this.element.style.left = `${x}px`;
      this.element.style.top = `${y}px`;
      
      this.#handleListHover(touch.clientX, touch.clientY);
    };

    this.#touchHandlers.end = (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      this.#handleDrop(touch.clientX, touch.clientY);
      this.#resetElementPosition();
      this.#endDrag();
    };

    this.element.addEventListener('touchstart', this.#touchHandlers.start, { passive: false });
    this.element.addEventListener('touchmove', this.#touchHandlers.move, { passive: false });
    this.element.addEventListener('touchend', this.#touchHandlers.end, { passive: false });
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

  #resetElementPosition() {
    this.element.style.position = '';
    this.element.style.left = '';
    this.element.style.top = '';
    this.element.style.zIndex = '';
    this.element.style.width = '';
    this.element.style.margin = '';
  }

  #handleListHover(clientX, clientY) {
    const elementUnderTouch = document.elementFromPoint(clientX, clientY);
    const currentList = elementUnderTouch?.closest('.task-list');
    
    if (!currentList) return;

    const tasksContainer = currentList.querySelector('.tasks-container');
    const tasks = Array.from(tasksContainer.querySelectorAll('.task:not(.is-dragging)'));
    
    const closestTask = this.#findClosestTask(tasks, clientY);
    this.#moveElementToContainer(tasksContainer, closestTask);
    
    const status = currentList.querySelector('h3').className;
    this.#updateTaskStatusVisual(status);
  }

  #findClosestTask(tasks, clientY) {
    let closestTask = null;
    let minDistance = Infinity;
    
    tasks.forEach(task => {
      const rect = task.getBoundingClientRect();
      const distance = Math.abs(clientY - (rect.top + rect.height/2));
      
      if (distance < minDistance) {
        minDistance = distance;
        closestTask = task;
      }
    });
    
    return closestTask;
  }

  #moveElementToContainer(container, beforeElement) {
    if (beforeElement) {
      container.insertBefore(this.element, beforeElement);
    } else {
      container.appendChild(this.element);
    }
  }

  #updateTaskStatusVisual(status) {
    this.element.classList.remove(
      'task--backlog', 'task--processing', 'task--done', 'task--trash'
    );
    this.element.classList.add(`task--${status}`);
  }

  #handleDrop(clientX, clientY) {
    const elementUnderTouch = document.elementFromPoint(clientX, clientY);
    const targetList = elementUnderTouch?.closest('.tasks-container');
    
    if (!targetList) return;

    const status = targetList.querySelector('h3').className;
    const tasksContainer = targetList.querySelector('.tasks-container');
    const tasks = Array.from(tasksContainer.querySelectorAll('.task:not(.is-dragging)'));
    
    const insertBeforeId = this.#findInsertPosition(tasks, clientY);
    this.#dispatchDropEvent(status, insertBeforeId);
  }

  #findInsertPosition(tasks, clientY) {
    for (const task of tasks) {
      const rect = task.getBoundingClientRect();
      if (clientY < rect.top + rect.height/2) {
        return task.dataset.id;
      }
    }
    return null;
  }

  #dispatchDropEvent(status, insertBeforeId) {
    this.element.dispatchEvent(new CustomEvent('taskdropped', {
      bubbles: true,
      detail: {
        taskId: this.task.id,
        status: status,
        insertBeforeId: insertBeforeId
      }
    }));
  }

  #startDrag() {
    this.element.classList.add('is-dragging');
    document.querySelectorAll('.task-list').forEach(list => {
      list.classList.add('drag-active');
    });
  }

  #endDrag() {
    this.element.classList.remove('is-dragging');
    document.querySelectorAll('.task-list').forEach(list => {
      list.classList.remove('drag-active');
    });
  }

  destroy() {
    if (this.isTouchDevice) {
      this.element.removeEventListener('touchstart', this.#touchHandlers.start);
      this.element.removeEventListener('touchmove', this.#touchHandlers.move);
      this.element.removeEventListener('touchend', this.#touchHandlers.end);
    } else {
      this.element.removeEventListener('dragstart', this.#dragHandlers.start);
      this.element.removeEventListener('dragend', this.#dragHandlers.end);
    }
    super.destroy();
  }
}