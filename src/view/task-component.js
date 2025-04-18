import {createElement} from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';

function createTaskComponentTemplate(task) {

  const{title, status, id} = task;
    return (
        `
           <li class="taskboard__item task task--${status}" data-id="${id}">
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
    this.#afterCreateElement();
  }

  get template() {
    return createTaskComponentTemplate(this.task);
  }

  #afterCreateElement(){
    this.#makeTaskDraggable();
  }

  #makeTaskDraggable() {
    this.element.setAttribute('draggable', true);
    this.element.dataset.id = this.task.id;
    
    let startY, startX, touchOffset;

    this.element.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', this.task.id);
        this.#startDrag();
    });

    this.element.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        startY = touch.clientY;
        startX = touch.clientX;
        this.#startDrag();
        
        const rect = this.element.getBoundingClientRect();
        touchOffset = {
            x: touch.clientX - rect.left,
            y: touch.clientY - rect.top
        };
    }, { passive: false });

    this.element.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const x = touch.clientX - touchOffset.x;
        const y = touch.clientY - touchOffset.y;
        
        this.element.style.position = 'absolute';
        this.element.style.left = `${x}px`;
        this.element.style.top = `${y}px`;
        this.element.style.zIndex = '1000';
        this.element.style.width = `${this.element.offsetWidth}px`;
        
        const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
        const currentList = elementUnderTouch?.closest('.task-list');
        
        if (currentList) {
            const tasksContainer = currentList.querySelector('.tasks-container');
            const tasks = Array.from(tasksContainer.querySelectorAll('.task:not(.is-dragging)'));
            
            let closestTask = null;
            let minDistance = Infinity;
            
            tasks.forEach(task => {
                const rect = task.getBoundingClientRect();
                const distance = Math.abs(touch.clientY - (rect.top + rect.height/2));
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestTask = task;
                }
            });
            
            if (closestTask) {
                tasksContainer.insertBefore(this.element, closestTask);
            } else {
                tasksContainer.appendChild(this.element);
            }
            
            const status = currentList.querySelector('h3').className;
            this.element.classList.remove(
                'task--backlog', 'task--processing', 'task--done', 'task--trash'
            );
            this.element.classList.add(`task--${status}`);
        }
    }, { passive: false });

    this.element.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.#endDrag();
        
        const touch = e.changedTouches[0];
        const elementUnderTouch = document.elementFromPoint(touch.clientX, touch.clientY);
        const targetList = elementUnderTouch?.closest('.task-list');
        
        if (targetList) {
            const status = targetList.querySelector('h3').className;
            const tasksContainer = targetList.querySelector('.tasks-container');
            const tasks = Array.from(tasksContainer.querySelectorAll('.task:not(.is-dragging)'));
            
            let insertBeforeId = null;
            for (const task of tasks) {
                const rect = task.getBoundingClientRect();
                if (touch.clientY < rect.top + rect.height/2) {
                    insertBeforeId = task.dataset.id;
                    break;
                }
            }
            
            this.element.dispatchEvent(new CustomEvent('taskdropped', {
                bubbles: true,
                detail: {
                    taskId: this.task.id,
                    status: status,
                    insertBeforeId: insertBeforeId
                }
            }));
        }
        
        this.element.style.position = '';
        this.element.style.left = '';
        this.element.style.top = '';
        this.element.style.zIndex = '';
        this.element.style.width = '';
    }, { passive: false });

    this.element.addEventListener('dragend', () => {
        this.#endDrag();
    });
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

}
