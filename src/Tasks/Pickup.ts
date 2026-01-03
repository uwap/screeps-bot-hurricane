import profiler from "screeps-profiler";
import { TaskData, TaskStatus, TaskType } from "./Task";

export const Pickup
  = (target: Resource): TaskData => ({
    target,
    targetPos: target.pos,
    type: TaskType.Pickup,
    options: {},
    data: { resource: target.resourceType },
  });

export const runPickup = profiler.registerFN(
  function (creep: Creep): TaskStatus {
    const task = creep.task;
    if (task == null) {
      return TaskStatus.DONE;
    }
    if (task.target == null && task.targetPos.roomName == creep.room.name) {
      return TaskStatus.DONE;
    }

    const target = task.target as Resource | null;
    const resource: ResourceConstant
      = (task.data as { resource: ResourceConstant }).resource;

    if (creep.store.getFreeCapacity(resource) == 0) {
      return TaskStatus.DONE;
    }

    if (target == null
      || creep.pickup(target) === ERR_NOT_IN_RANGE) {
      creep.travelTo(task.targetPos);
      return TaskStatus.IN_PROGRESS;
    }
    return TaskStatus.DONE;
  }, "Tasks.Pickup.run") as (creep: Creep) => TaskStatus;
