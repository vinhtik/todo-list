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

    #renderTrashList() {
        const status = Status.TRASH;
        const tasksListComponent = new TasksListComponent({
            status: status,
            label: StatusLabel[status]
        });
        
        render(tasksListComponent, this.#tasksBoardComponent.element);
        const tasksContainer = tasksListComponent.element;

        const trashTasks = this.#boardTasks.filter(task => task.status === status);

        if (trashTasks.length === 0) {
            this.#renderEmptyList(tasksContainer);
        } else {
            trashTasks.forEach((task) => {
                this.#renderTask(task, tasksContainer);
            });
        }

        render(new ButtonResetComponent(), tasksListComponent.element);
    }

    #renderTasksList(status) {
        const tasksListComponent = new TasksListComponent({
            status: status,
            label: StatusLabel[status]
        });
        
        render(tasksListComponent, this.#tasksBoardComponent.element);
        const tasksContainer = tasksListComponent.element;

        const tasksForStatus = this.#boardTasks.filter(task => task.status === status);

        if (tasksForStatus.length === 0) {
            this.#renderEmptyList(tasksContainer, status);
        } else {
            tasksForStatus.forEach((task) => {
                this.#renderTask(task, tasksContainer);
            });
        }
    }

    #renderBoard() {
        render(this.#tasksBoardComponent, this.#boardContainer);
        Object.values(Status).filter(status => status !== Status.TRASH).forEach((status) => {
            this.#renderTasksList(status);
        });

        this.#renderTrashList();
    }
}