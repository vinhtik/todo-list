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
  #handleClick = null;

  constructor({onClick}){
    super();
    this.#handleClick = onClick;
    this.element.addEventListener('submit', this.#clickHandler)
  }

  get template() {
    return createFormAddTaskComponentTemplate();
  }
  
  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleClick();
  };

}
