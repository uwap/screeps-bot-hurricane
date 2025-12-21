import { runAction } from "../Actions/Action";
import { harvestFromClosestActiveSource } from "../Actions/harvest";
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
  .andThen(notNull(creep.room.controller, upgradeController))
  .repeat();

const body = (energy: number) =>
  new Array(Math.floor(energy / 300))
    .fill([WORK, WORK, MOVE, CARRY]).reduce((x, y) => x.concat(y), []);

export const Upgrader: WorkerDefinition = {
  runAction: action,
  name: "upgrader",
  requiredCreeps: () => 1,
  bodyDefinition: body,
  motivationalThougts: [
    "🏳️‍⚧️",
  ],
};
