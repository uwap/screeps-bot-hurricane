import profiler from "screeps-profiler";
import { TaskData, TaskStatus, TaskType } from "./Task";

export const Upgrade
  = (target: StructureController): TaskData => ({
    target,
    targetPos: target.pos,
    type: TaskType.Upgrade,
    options: {},
    data: {},
  });

export const runUpgrade = profiler.registerFN(
  function (creep: Creep): TaskStatus {
    const task = creep.task;
    if (task == null) {
      return TaskStatus.DONE;
    }

    if (creep.store.energy === 0) {
      return TaskStatus.DONE;
    }

    const target = task.target as StructureController | null;

    if (target == null
      || creep.upgradeController(target) === ERR_NOT_IN_RANGE) {
      creep.travelTo(task.targetPos);
    }
    return TaskStatus.IN_PROGRESS;
  }, "Tasks.Upgrade.run") as (creep: Creep) => TaskStatus;
