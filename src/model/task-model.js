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

  updateTaskStatus(taskId, newStatus) {
    const task = this.#tasks.find(t => t.id === taskId);
    if (task) {
      task.status = newStatus;
    }
  }
}