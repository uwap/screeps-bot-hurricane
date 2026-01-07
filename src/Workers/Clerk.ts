import {
  closestContainerWithEnergy,
  closestExtensionToFill,
  closestTowerToFill,
} from "./Util";
import Tasks from "../Tasks";
import { WorkerDefinition } from "./worker";

const assignTask = (creep: Creep) => {
  if (creep.store.energy > 0) {
    const ext = closestExtensionToFill(creep.pos);
    if (ext != null) {
      return Tasks.Transfer(ext);
    }
    if ((creep.room.spawn?.store.getFreeCapacity(RESOURCE_ENERGY) ?? 0) > 0) {
      if (creep.room.spawn != null) {
        return Tasks.Transfer(creep.room.spawn);
      }
    }
    const tower = closestTowerToFill(creep.pos);
    if (tower != null) {
      return Tasks.Transfer(tower);
    }
    if (creep.room.storage != null
      && creep.room.storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
      return Tasks.Transfer(creep.room.storage);
    }
    if (creep.room.controller != null) {
      if (creep.room.controller.ticksToDowngrade > 5000) {
        const urgentRepair = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: s => s.hits < s.hitsMax * 0.3 && ("my" in s
            ? s.my
            : s.structureType === STRUCTURE_CONTAINER),
        });
        if (urgentRepair != null) {
          return Tasks.Repair(urgentRepair);
        }
        const buildSite
          = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
        if (buildSite != null) {
          return Tasks.Build(buildSite);
        }
        return null;
      }
      return Tasks.Upgrade(creep.room.controller);
    }
  }
  else {
    const resource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES,
      { filter: r => r.resourceType === RESOURCE_ENERGY });
    if (resource != null) {
      return Tasks.Pickup(resource);
    }
    const container = closestContainerWithEnergy(creep.pos);
    if (container != null) {
      return Tasks.Withdraw(container);
    }
    const source = creep.room.sources.find(s => s.energy > 0
      && s.assignedCreeps.length == 0);
    if (source != null) {
      return Tasks.Harvest(source);
    }
  }
  return null;
};

const body = (energy: number): BodyPartConstant[] => (
  energy < 100
    ? []
    : ([WORK] as BodyPartConstant[]).concat(
        new Array<BodyPartConstant[]>(Math.floor((energy - 100) / 150))
          .fill([MOVE, CARRY, CARRY]).reduce((x, y) => x.concat(y), []))
);

export const Clerk: WorkerDefinition = {
  assignTask,
  name: "clerk",
  requiredCreeps: () => 1,
  bodyDefinition: body,
  motivationalThougts: [
    "Carrying 🎒",
    "💗 working",
  ],
};
