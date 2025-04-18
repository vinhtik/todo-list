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

  removeTask(taskId){
    this.#boardtasks = this.#boardtasks.filter(task => task.id !== taskId);
    this._notifyObservers();
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

  updateTaskStatus(taskId, newStatus, insertBeforeId = null) {
    const task = this.#boardtasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.status === newStatus && !insertBeforeId) return;

    const updatedTasks = this.#boardtasks.filter(t => t.id !== taskId);
    task.status = newStatus;

    if (insertBeforeId) {
        const insertIndex = updatedTasks.findIndex(t => t.id === insertBeforeId);
        if (insertIndex !== -1) {
            updatedTasks.splice(insertIndex, 0, task);
        } else {
            updatedTasks.push(task);
        }
    } else {
        updatedTasks.push(task);
    }

    this.#boardtasks = updatedTasks;
    this._notifyObservers('task-moved');
}

}