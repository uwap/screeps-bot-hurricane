import { runAction } from "../Actions/Action";
import { harvestFromClosestActiveSource } from "../Actions/harvest";
import { transferEnergy } from "../Actions/transferEnergy";
import { closestContainerToFill } from "../Actions/Util";
import { WorkerDefinition } from "./worker";

const action = (creep: Creep) => runAction(creep,
  harvestFromClosestActiveSource())
  .andThen(transferEnergy(closestContainerToFill(creep.pos)))
  .repeat();

const body = (energy: number) => (
  energy < 300
    ? []
    : ([WORK, WORK, MOVE, CARRY]
        .concat(new Array(Math.floor((energy - 300) / 100)).fill(WORK)))
);

export const Miner: WorkerDefinition = {
  runAction: action,
  name: "miner",
  requiredCreeps: (room: Room) =>
    room.find(FIND_STRUCTURES,
      { filter: { structureType: STRUCTURE_CONTAINER } }).length > 0
      ? 4
      : 0,
  bodyDefinition: body,
  motivationalThougts: [
    "RocknStone",
  ],
};
