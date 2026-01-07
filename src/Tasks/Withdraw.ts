import profiler from "screeps-profiler";
import { TaskData, TaskStatus, TaskType } from "./Task";

interface WithdrawOptions {
  // The maximum number of resources the creep should carry after the withdraw.
  limit: number | null;
  // The amount of resources to withdraw
  amount: number | null;
  // The type of resource to withdraw
  resource: ResourceConstant;
}

const defaultOptions: WithdrawOptions = {
  limit: null,
  amount: null,
  resource: RESOURCE_ENERGY,
};

export const Withdraw
  = (target: Structure | Tombstone | Ruin,
    opts: Partial<WithdrawOptions> = {}): TaskData => ({
    target,
    targetPos: target.pos,
    type: TaskType.Withdraw,
    options: { ...defaultOptions, ...opts },
    data: {},
  });

export const runWithdraw = profiler.registerFN(
  function (creep: Creep): TaskStatus {
    const task = creep.task;
    if (task == null) {
      return TaskStatus.DONE;
    }
    if (task.target == null && task.targetPos.roomName == creep.room.name) {
      return TaskStatus.DONE;
    }

    const target = task.target as Structure | Tombstone | Ruin | null;
    const opts = task.options as WithdrawOptions;

    if (opts.limit != null
      && creep.store.getUsedCapacity(opts.resource) >= opts.limit) {
      return TaskStatus.DONE;
    }
    const capacity = creep.store.getFreeCapacity(opts.resource);
    const amount = Math.min(opts.amount ?? capacity,
      opts.limit ?? capacity - creep.store.getUsedCapacity(opts.resource));
    const amountS = (target != null && "store" in target)
      ? Math.min(amount, target.store.getUsedCapacity(opts.resource))
      : amount;

    if (amountS <= 0) {
      return TaskStatus.DONE;
    }

    if (target == null
      || creep.withdraw(target, opts.resource, amountS) === ERR_NOT_IN_RANGE) {
      creep.travelTo(task.targetPos);
      return TaskStatus.IN_PROGRESS;
    }
    return TaskStatus.DONE;
  }, "Tasks.Withdraw.run") as (creep: Creep) => TaskStatus;
