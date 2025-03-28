import TasksListComponent from "../view/list-component.js";
import TaskComponent from "../view/task-component.js";
import BoardComponent from "../view/board-component.js";
import { render } from "../framework/render.js";
import {Status, StatusLabel} from "../const.js";

export default class TasksBoardPresenter {
    #boardContainer = null;
    #tasksModel = null;
    #tasksBoardComponent = new BoardComponent();

    constructor({boardContainer, tasksModel}){
        this.#boardContainer = boardContainer;
        this.#tasksModel = tasksModel;
    }


    init(){
        this.boardTasks = [...this.#tasksModel.getTasks()];
        const statues = Object.values(Status);

        render(this.#tasksBoardComponent, this.#boardContainer);

        for(let i = 0;i < statues.length; i++){
            const currentStatus = statues[i];
            const listComponent = new TasksListComponent({
                title: StatusLabel[currentStatus],
                status: currentStatus
            });

            const filterTasks = this.boardTasks.filter(task => task.status === currentStatus)

            render(listComponent, this.#tasksBoardComponent.getElement());
            
            for(let j = 0; j < filterTasks.length; j++){
                const taskComponent = new TaskComponent({task: filterTasks[j]});
                render(taskComponent, listComponent.getElement());  
            }
        }
    }
}