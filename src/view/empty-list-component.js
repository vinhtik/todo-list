import { AbstractComponent } from "../framework/view/abstract-component.js";

function createEmptyListTemplate() {
    return (
        `
        <li class="task-list__empty">
           <div class="task-body">
              <p class="task--view">Перетащите карточку</p> 
           </div>
           </li>
        `
    );
}

export default class EmptyListComponent extends AbstractComponent {
    get template() {
        return createEmptyListTemplate();
    }
}