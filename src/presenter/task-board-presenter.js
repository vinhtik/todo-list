import TasksListComponent from "../view/list-component.js";
import TaskComponent from "../view/task-component.js";
import BoardComponent from "../view/board-component.js";
import { render } from "../framework/render.js";
import {Status, StatusLabel} from "../const.js";
import ButtonResetComponent from "../view/reset-button-component.js";
import EmptyListComponent from "../view/empty-list-component.js";

export default class TasksBoardPresenter {
    #boardContainer = null;
    #tasksModel = null;
    #tasksBoardComponent = new BoardComponent();
    #boardTasks = [];

    constructor({boardContainer, tasksModel}){
        this.#boardContainer = boardContainer;
        this.#tasksModel = tasksModel;

        this.#tasksModel.addObserver(this.#handleModelChange.bind(this));
    }

    get tasks(){
        return this.#tasksModel.tasks;
    }


    init() {
        this.#boardTasks = [...this.#tasksModel.tasks];
        this.#renderBoard();
    }

    #renderTask(task, container) {
        const taskComponent = new TaskComponent({task});
        render(taskComponent, container);
    }

    #renderEmptyList(container) {
        render(new EmptyListComponent(), container);
    }

    #renderTrashButton(container) {
        const resetButton = new ButtonResetComponent({
            onClick: () => this.#handleClearTrash()
        });
        render(resetButton, container);
    }

    #renderTasksList(status) {
        const tasksListComponent = new TasksListComponent({
            status: status,
            label: StatusLabel[status]
        });
        
        render(tasksListComponent, this.#tasksBoardComponent.element);
        const tasksContainer = tasksListComponent.element;

        const tasksForStatus = this.tasks.filter(task => task.status === status);
      

        if (tasksForStatus.length === 0) {
            this.#renderEmptyList(tasksContainer, status);
        } else {
            tasksForStatus.forEach((task) => {
                this.#renderTask(task, tasksContainer);
            });
            if (status === 'trash'){
                this.#renderTrashButton(tasksContainer)
            }
        }
    }

    #renderBoard() {
        render(this.#tasksBoardComponent, this.#boardContainer);
        Object.values(Status).forEach((status) => {
            this.#renderTasksList(status);
        });

    }

    createTask() {
        const taskTitle = document.querySelector('#add-task').value.trim();
        if (!taskTitle){
            return
        }
        this.#tasksModel.addTask(taskTitle);

        document.querySelector('#add-task').value = '';
    }

    #handleModelChange() {
        this.#clearBoard();
        this.#renderBoard();
    }
    
    #clearBoard(){
        this.#tasksBoardComponent.element.innerHTML = '';
    }

    #handleClearTrash() {
        const trashTasks = this.tasks.filter(task => task.status === 'trash');
        trashTasks.forEach(task => this.#tasksModel.removeTask(task.id));
    }
}