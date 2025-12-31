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

export const runWithdraw = (creep: Creep): TaskStatus => {
  const task = creep.task;
  if (task == null) {
    return TaskStatus.DONE;
  }

  const target = task.target as Structure | Tombstone | Ruin;
  const opts = task.options as WithdrawOptions;

  if (opts.limit != null
    && creep.store.getUsedCapacity(opts.resource) >= opts.limit) {
    return TaskStatus.DONE;
  }
  const capacity = creep.store.getFreeCapacity(opts.resource);
  const amount = Math.min(opts.amount ?? capacity,
    opts.limit ?? capacity - creep.store.getUsedCapacity(opts.resource));

  if (amount <= 0) {
    return TaskStatus.DONE;
  }

  if (target == null
    || creep.withdraw(target, opts.resource, amount) === ERR_NOT_IN_RANGE) {
    creep.travelTo(task.targetPos);
    return TaskStatus.IN_PROGRESS;
  }
  return TaskStatus.DONE;
};
