import Tasks from "../Tasks";
import { WorkerDefinition } from "./worker";

const assignTask = (creep: Creep) => {
  const source = creep.room.sources.find(
    s => s.container != null
      && s.assignedCreeps.find(c => c.name.startsWith("miner")) == null);
  if (source != null) {
    return Tasks.Harvest(source, { stopWhenFull: false });
  }
  return null;
};

const body = (energy: number) => {
  const maximumWorkParts
    = SOURCE_ENERGY_CAPACITY / ENERGY_REGEN_TIME / HARVEST_POWER;
  if (energy < BODYPART_COST.move + BODYPART_COST.work) {
    return [];
  }
  return [MOVE].concat(new Array(Math.min(maximumWorkParts,
    Math.floor((energy - BODYPART_COST.move) / BODYPART_COST.work)))
    .fill(WORK));
};

export const Miner: WorkerDefinition = {
  assignTask,
  name: "miner",
  requiredCreeps: (room: Room) =>
    room.sources.filter(s => s.container != null).length,
  bodyDefinition: body,
  motivationalThougts: [
    "RocknStone",
  ],
};
