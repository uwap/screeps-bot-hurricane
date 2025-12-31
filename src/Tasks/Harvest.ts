import profiler from "screeps-profiler";
import { TaskData, TaskStatus, TaskType } from "./Task";

interface HarvestOptions {
  stopWhenFull: boolean;
}

interface HarvestData {
  resource: ResourceConstant;
};

const defaultOptions: HarvestOptions = {
  stopWhenFull: true,
};

export const Harvest
  = (target: Source | Mineral<MineralConstant>,
    opts: Partial<HarvestOptions> = {}): TaskData => ({
    target,
    targetPos: target.pos,
    type: TaskType.Harvest,
    options: { ...defaultOptions, ...opts },
    data: {
      resource: target instanceof Source
        ? RESOURCE_ENERGY
        : target.mineralType,
    },
  });

export const runHarvest = profiler.registerFN((creep: Creep): TaskStatus => {
  const task = creep.task;
  if (task == null) {
    return TaskStatus.DONE;
  }

  const target = task.target as Source | Mineral<MineralConstant> | null;
  const opts = task.options as HarvestOptions;
  const data = task.data as HarvestData;

  if (opts.stopWhenFull && creep.store.getFreeCapacity(data.resource) == 0) {
    return TaskStatus.DONE;
  }

  if (target == null
    || creep.harvest(target) === ERR_NOT_IN_RANGE) {
    creep.travelTo(task.targetPos);
  }
  return TaskStatus.IN_PROGRESS;
}, "runHarvest");
