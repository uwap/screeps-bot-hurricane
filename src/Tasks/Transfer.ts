import profiler from "screeps-profiler";
import { TaskData, TaskStatus, TaskType } from "./Task";

interface TransferOptions {
  // The amount of resources to transfer
  amount: number | null;
  // The type of resource to transfer
  resource: ResourceConstant;
}

const defaultOptions: TransferOptions = {
  amount: null,
  resource: RESOURCE_ENERGY,
};

export const Transfer
  = (target: Structure | Creep | PowerCreep,
    opts: Partial<TransferOptions> = {}): TaskData => ({
    target,
    targetPos: target.pos,
    type: TaskType.Transfer,
    options: { ...defaultOptions, ...opts },
    data: {},
  });

export const runTransfer = profiler.registerFN(
  function (creep: Creep): TaskStatus {
    const task = creep.task;
    if (task == null) {
      return TaskStatus.DONE;
    }

    const target = task.target as Structure | Creep | PowerCreep | null;
    const opts = task.options as TransferOptions;

    if (target == null
      || creep.transfer(
        target, opts.resource, opts.amount ?? undefined) === ERR_NOT_IN_RANGE) {
      creep.travelTo(task.targetPos);
      return TaskStatus.IN_PROGRESS;
    }
    return TaskStatus.DONE;
  }, "Tasks.Transfer.run") as (creep: Creep) => TaskStatus;
