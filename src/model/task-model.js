import { tasks as mockTasks } from '../mock/task.js';
import { Status } from '../const.js';

export default class TasksModel {
  #tasks = [...mockTasks];

  getTasks() {
    return this.#tasks;
  }

  getTasksByStatus(status) {
    return this.#tasks.filter(task => task.status === status);
  }

 
}