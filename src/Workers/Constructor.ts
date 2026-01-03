import {
  closestContainerWithEnergy,
} from "./Util";
import Tasks from "../Tasks";
import { WorkerDefinition } from "./worker";

const assignTask = (creep: Creep) => {
  if (creep.store.energy === 0) {
    const storage = creep.room.storage;
    if (storage != null && storage.store.energy > 0) {
      return Tasks.Withdraw(storage);
    }
    const container = closestContainerWithEnergy(creep.pos);
    if (container != null) {
      return Tasks.Withdraw(container);
    }
    const source = creep.room.sources.find(s => s.energy > 0);
    if (source != null) {
      return Tasks.Harvest(source);
    }
  }
  else {
    const urgentRepair = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: s => ("my" in s
        ? s.my
        : s.structureType === STRUCTURE_CONTAINER)
      && s.hits < s.hitsMax * 0.3,
    });
    if (urgentRepair != null) {
      return Tasks.Repair(urgentRepair);
    }
    const constructionSite
      = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
    if (constructionSite != null) {
      return Tasks.Build(constructionSite);
    }
    const structure = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: s => s.hits < s.hitsMax * 0.8,
    }) ?? creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: s => s.hits < s.hitsMax * 0.8
        && ("my" in s ? s.my : true),
    });
    if (structure != null) {
      return Tasks.Repair(structure);
    }
    else if (creep.room.controller != null) {
      return Tasks.Upgrade(creep.room.controller);
    }
  }
  return null;
};

const body = (energy: number) =>
  new Array<BodyPartConstant[]>(Math.floor(energy / 250))
    .fill([WORK, MOVE, CARRY, CARRY]).reduce((x, y) => x.concat(y), []);

export const Constructor: WorkerDefinition = {
  assignTask,
  name: "constructor",
  requiredCreeps: () => 1,
  bodyDefinition: body,
  motivationalThougts: [
    "I 💗 making",
    "Fixin' 🔧",
  ],
};
