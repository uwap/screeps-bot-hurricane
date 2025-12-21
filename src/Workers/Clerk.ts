import { runAction } from "../Actions/Action";
import { harvestFromClosestActiveSource } from "../Actions/harvest";
import { transferEnergy } from "../Actions/transferEnergy";
import { upgradeController } from "../Actions/upgradeController";
import {
  closestContainerWithEnergy,
  closestExtensionToFill,
  closestStorageToFill,
  closestTowerToFill,
  notNull,
} from "../Actions/Util";
import { withdrawEnergy } from "../Actions/withdrawEnergy";
import { WorkerDefinition } from "./worker";

const action = (creep: Creep, spawn: StructureSpawn) => runAction(creep,
  withdrawEnergy(closestContainerWithEnergy(creep.pos)))
  .or(harvestFromClosestActiveSource())
  .andThen(transferEnergy(closestExtensionToFill(creep.pos)))
  .or(transferEnergy(spawn))
  .or(transferEnergy(closestTowerToFill(creep.pos)))
  .or(transferEnergy(closestStorageToFill(creep.pos, RESOURCE_ENERGY)))
  .or(notNull(creep.room.controller, upgradeController))
  .repeat();

const body = (energy: number) => (
  energy < 100
    ? []
    : [WORK].concat(new Array(Math.floor((energy - 100) / 150))
        .fill([MOVE, CARRY, CARRY]).reduce((x, y) => x.concat(y), []))
);

export const Clerk: WorkerDefinition = {
  runAction: action,
  name: "clerk",
  requiredCreeps: () => 3,
  bodyDefinition: body,
  motivationalThougts: [
    "Carrying 🎒",
    "💗 working",
  ],
};
