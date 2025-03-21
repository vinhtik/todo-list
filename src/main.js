import HeaderComponent from './view/header-component.js';
import FormAddTaskComponent from './view/form-add-task-component.js';
import {render, RenderPosition} from './framework/render.js';
import BoardComponent from './view/board-component.js';
import ListComponent from './view/list-component.js';
import TaskComponent from './view/task-component.js';


const bodyContainer = document.querySelector('.board-app');
const formContainer = document.querySelector('.add-task');
const boardContainer = document.querySelector(".taskboard");




render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);
render(new FormAddTaskComponent(), formContainer);
render(new BoardComponent(), boardContainer);


for(let i = 0;i < 4; i++){
    const listComponent = new ListComponent;
    render(listComponent, boardContainer);
    const listContainerPart = listComponent.getElement();
    for(let j = 0;j < 4;j++){
        render(new TaskComponent(), listContainerPart);
    }
}
