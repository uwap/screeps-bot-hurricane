import { Harvest, runHarvest } from "./Harvest";
import { runUpgrade, Upgrade } from "./Upgrade";

import { TaskType, TaskStatus, TaskData } from "./Task";
import { runWithdraw, Withdraw } from "./Withdraw";
import { runTransfer, Transfer } from "./Transfer";
import { Build, runBuild } from "./Build";
import { Repair, runRepair } from "./Repair";
import profiler from "screeps-profiler";
import { Pickup, runPickup } from "./Pickup";
export { TaskType, TaskStatus } from "./Task";

declare global {
  interface Creep {
    run: (generator?: (creep: Creep) => TaskData | null) => void;
  }
}

const runTask = profiler.registerFN((creep: Creep): TaskStatus => {
  switch (creep.task?.type) {
    case TaskType.Harvest:
      return runHarvest(creep);
    case TaskType.Upgrade:
      return runUpgrade(creep);
    case TaskType.Withdraw:
      return runWithdraw(creep);
    case TaskType.Transfer:
      return runTransfer(creep);
    case TaskType.Build:
      return runBuild(creep);
    case TaskType.Repair:
      return runRepair(creep);
    case TaskType.Pickup:
      return runPickup(creep);
    default:
      return TaskStatus.DONE;
  }
}, "Tasks.run") as (creep: Creep) => TaskStatus;

Creep.prototype.run = function (generator?: (creep: Creep) => TaskData | null) {
  const status = runTask(this);
  if (status === TaskStatus.DONE) {
    this.task = null;
    if (generator != null) {
      this.task = generator(this);
      runTask(this);
    }
  }
};

const Tasks = {
  Harvest,
  Upgrade,
  Withdraw,
  Transfer,
  Build,
  Repair,
  Pickup,
  ...TaskStatus,
};
profiler.registerObject(Tasks, "Tasks");

export default Tasks;
