import { runAction } from "../Actions/Action";
import { buildConstructionSite } from "../Actions/buildConstructionSite";
import { harvestFromClosestActiveSource } from "../Actions/harvest";
import { repairStructure } from "../Actions/repairStructure";
import { upgradeController } from "../Actions/upgradeController";
import {
  closestContainerWithEnergy,
  closestStorageWithResource,
  notNull,
} from "../Actions/Util";
import { withdrawEnergy } from "../Actions/withdrawEnergy";
import { WorkerDefinition } from "./worker";

const action = (creep: Creep) => runAction(creep,
  withdrawEnergy(closestStorageWithResource(creep.pos, RESOURCE_ENERGY)))
  .or(withdrawEnergy(closestContainerWithEnergy(creep.pos)))
  .or(harvestFromClosestActiveSource())
  .andThen(buildConstructionSite())
  .or(repairStructure())
  .or(notNull(creep.room.controller, upgradeController))
  .repeat();

const body = (energy: number) =>
  new Array(Math.floor(energy / 250))
    .fill([WORK, MOVE, CARRY, CARRY]).reduce((x, y) => x.concat(y), []);

export const Constructor: WorkerDefinition = {
  runAction: action,
  name: "constructor",
  requiredCreeps: (room: Room) =>
    room.find(FIND_CONSTRUCTION_SITES).length > 10 ? 2 : 1,
  bodyDefinition: body,
  motivationalThougts: [
    "I 💗 making",
    "Fixin' 🔧",
  ],
};
