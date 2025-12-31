import profiler from "screeps-profiler";
import { TaskData, TaskStatus, TaskType } from "./Task";

export const Build
  = (target: ConstructionSite): TaskData => ({
    target,
    targetPos: target.pos,
    type: TaskType.Build,
    options: {},
    data: {},
  });

export const runBuild = profiler.registerFN((creep: Creep): TaskStatus => {
  const task = creep.task;
  if (task == null) {
    return TaskStatus.DONE;
  }

  if (creep.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
    return TaskStatus.DONE;
  }

  const target = task.target as ConstructionSite;
  if (target == null && task.targetPos.roomName === creep.room.name) {
    return TaskStatus.DONE;
  }

  if (target == null
    || creep.build(target) === ERR_NOT_IN_RANGE) {
    creep.travelTo(task.targetPos);
    return TaskStatus.IN_PROGRESS;
  }
  return TaskStatus.DONE;
}, "runBuild");
