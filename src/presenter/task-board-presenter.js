import TasksListComponent from "../view/list-component.js";
import TaskComponent from "../view/task-component.js";
import BoardComponent from "../view/board-component.js";
import { render } from "../framework/render.js";
import {Status, StatusLabel} from "../const.js";
import ButtonResetComponent from "../view/reset-button-component.js";
import EmptyListComponent from "../view/empty-list-component.js";
import LoadingViewComponent from "../view/loading-view-component.js";

export default class TasksBoardPresenter {
    #boardContainer = null;
    #tasksModel = null;
    #tasksBoardComponent = new BoardComponent();
    #boardTasks = [];
    #loadingComponent = new LoadingViewComponent();
    #isLoading = true;

    constructor({boardContainer, tasksModel}){
        this.#boardContainer = boardContainer;
        this.#tasksModel = tasksModel;
        this.#tasksModel.addObserver(this.#handleModelChange.bind(this));
    }

    get tasks(){
        return this.#tasksModel.tasks;
    }


    async init() {
        render(this.#loadingComponent, this.#boardContainer);
        await this.#tasksModel.init();
        this.#isLoading = false;
        this.#boardContainer.innerHTML = '';
        this.#clearBoard();
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
            label: StatusLabel[status],
            onTaskDrop: this.#handleTaskDrop.bind(this)
        });
        
        render(tasksListComponent, this.#tasksBoardComponent.element);
        const tasksContainer = tasksListComponent.element.querySelector('.tasks-container');
        const actionsContainer = tasksListComponent.element.querySelector('.list-actions');
        const tasksForStatus = this.tasks.filter(task => task.status === status);
      

        if (tasksForStatus.length === 0) {
            this.#renderEmptyList(tasksContainer, status);
        } else {
            tasksForStatus.forEach((task) => {
                this.#renderTask(task, tasksContainer);
            });
            if (status === 'trash'){
                this.#renderTrashButton(actionsContainer)
            }
        }
    }

    #renderBoard() {
        render(this.#tasksBoardComponent, this.#boardContainer);
        Object.values(Status).forEach((status) => {
            this.#renderTasksList(status);
        });

    }

    async createTask() {
        const taskTitle = document.querySelector('#add-task').value.trim();
        if (!taskTitle){
            return
        }
        try{
            await this.#tasksModel.addTask(taskTitle);
            document.querySelector('#add-task').value = '';
        } catch (err){
            console.error('Ошибка при создании задачи:', err);
        }
    }

    #handleModelChange() {
        this.#clearBoard();
        this.#renderBoard();
    }
    
    #clearBoard(){
        this.#tasksBoardComponent.element.innerHTML = '';
    }

    async #handleClearTrash() {
       try {
        await this.#tasksModel.clearBasketTasks();
       } catch (err){
        console.log('Ошибка при очистке корзины:', err);
       }
    }

    
    async #handleTaskDrop(taskId, newStatus){
        try{
        await this.#tasksModel.updateTaskStatus(taskId, newStatus);
        } catch (err){
            console.error('Ошибка при обновлении статуса задачи', err)
        }
    }
}