import { tasks as mockTasks } from '../mock/task.js';
import { Status } from '../const.js';

export default class TasksModel {
  #tasks = [...mockTasks];

  get tasks() {
    return this.#tasks;
  }

  getTasksByStatus(status) {
    return this.#tasks.filter(task => task.status === status);
  }

 
}