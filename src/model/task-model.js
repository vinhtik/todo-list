import { tasks } from '../mock/task.js';
import { Status } from '../const.js';
import { generateID } from '../utils.js';
import TasksBoardPresenter from '../presenter/task-board-presenter.js';

export default class TasksModel {
  #boardtasks = tasks;
  #observers = [];

  get tasks() {
    return this.#boardtasks;
  }

  getTasksByStatus(status) {
    return this.#boardtasks.filter(task => task.status === status);
  }

  addTask(title) {
    const newTask = {
      id: generateID(),
      title,
      status: Status.BACKLOG,
    };
    this.#boardtasks.push(newTask);
    this._notifyObservers();
    return newTask;
  }

  addObserver(observer){
    this.#observers.push(observer);
  }

  removeObserver(observer){
    this.#observers = this.#observers.filter((obs) => obs !== observer);
  }

  _notifyObservers(){
    this.#observers.forEach((observer) => observer());
  }

  removeTask(taskId){
    this.#boardtasks = this.#boardtasks.filter(task => task.id !== taskId);
    this._notifyObservers();
  }
}