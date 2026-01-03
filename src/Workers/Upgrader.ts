import Tasks from "../Tasks";
import { closestContainerWithEnergy, closestStorageWithResource } from "./Util";
import { WorkerDefinition } from "./worker";

const assignTask = (creep: Creep) => {
  if (creep.store.energy > 0
    && creep.room.controller != null) {
    return Tasks.Upgrade(creep.room.controller);
  }
  const storage = closestStorageWithResource(creep.pos, RESOURCE_ENERGY);
  if (storage != null) {
    return Tasks.Withdraw(storage);
  }
  const container = closestContainerWithEnergy(creep.pos);
  if (container != null) {
    return Tasks.Withdraw(container);
  }
  const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
  if (source != null) {
    return Tasks.Harvest(source);
  }
  return null;
};

const body = (energy: number) =>
  new Array<BodyPartConstant[]>(Math.floor(energy / 300))
    .fill([WORK, WORK, MOVE, CARRY]).reduce((x, y) => x.concat(y), []);

export const Upgrader: WorkerDefinition = {
  assignTask,
  name: "upgrader",
  requiredCreeps: () => 1,
  bodyDefinition: body,
  motivationalThougts: [
    "🏳️‍⚧️",
  ],
};
