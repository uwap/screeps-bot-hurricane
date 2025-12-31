import profiler from "screeps-profiler";
import { TaskData, TaskStatus, TaskType } from "./Task";

export const Repair
  = (target: Structure): TaskData => ({
    target,
    targetPos: target.pos,
    type: TaskType.Repair,
    options: {},
    data: {},
  });

export const runRepair = profiler.registerFN((creep: Creep): TaskStatus => {
  const task = creep.task;
  if (task == null) {
    return TaskStatus.DONE;
  }

  if (creep.store.energy === 0) {
    return TaskStatus.DONE;
  }

  const target = task.target as Structure;
  if (target == null && task.targetPos.roomName === creep.room.name) {
    return TaskStatus.DONE;
  }

  if (target == null
    || creep.repair(target) === ERR_NOT_IN_RANGE) {
    creep.travelTo(task.targetPos);
    return TaskStatus.IN_PROGRESS;
  }
  return TaskStatus.DONE;
}, "runRepair");
