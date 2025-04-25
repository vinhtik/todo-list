import HeaderComponent from './view/header-component.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import {render, RenderPosition} from './framework/render.js';
import TasksModel from './model/task-model.js';
import TasksBoardPresenter from './presenter/task-board-presenter.js';
import TasksApiService from './tasks-api-service.js';


const END_POINT = 'https://680b2517d5075a76d989fa79.mockapi.io';
const bodyContainer = document.querySelector('.board-app');
const formContainer = document.querySelector('.add-task');
const boardContainer = document.querySelector(".taskboard");
const formAddTaskComponent = new FormAddTaskComponent({onClick: handleNewTaskButtonCLick});

function handleNewTaskButtonCLick(){
    tasksBoardPresenter.createTask();
}

const tasksModel = new TasksModel({
    tasksApiService: new TasksApiService(END_POINT)
});
const tasksBoardPresenter = new TasksBoardPresenter({
    boardContainer: boardContainer,
    tasksModel,
});


render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);
render(formAddTaskComponent, formContainer);

tasksBoardPresenter.init();


