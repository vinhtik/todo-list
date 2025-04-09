import {createElement} from '../framework/render.js';
import { AbstractComponent } from '../framework/view/abstract-component.js';


function createFormAddTaskComponentTemplate() {
    return (
        `<form class="add-task__form" aria-label="Форма добавления задачи">
        <div class="add-task__input-wrapper">
        <label for="add-task">Новая задача</label>
          <input type="text" name="task-name" id="add-task" placeholder="Название задачи..." required>
        
        <button class="add-task__button button" type="submit">
          <span>+ Добавить</span>
        </button>
        </div>
      </form>`
      );
}


export default class FormAddTaskComponent extends AbstractComponent{
  get template() {
    return createFormAddTaskComponentTemplate();
  }


}
