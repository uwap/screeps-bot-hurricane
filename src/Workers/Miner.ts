import { Fail, runAction } from "../Actions/Action";
import { harvestFromClosestActiveSource } from "../Actions/harvest";
import { transferEnergy } from "../Actions/transferEnergy";
import { WorkerDefinition } from "./worker";

export const Miner: WorkerDefinition = {
    runAction: (creep: Creep) => runAction(creep, harvestFromClosestActiveSource())
        .andThen(transferEnergy(creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (str: Structure) => str.structureType === STRUCTURE_CONTAINER && (str as StructureContainer).store.getFreeCapacity(RESOURCE_ENERGY) > 0}) as StructureContainer | null))
        .repeat(),
    name: 'miner',
    requiredCreeps: (room: Room) => room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER }}).length > 0 ? 4 : 0,
    bodyDefinition: (energy: number) => [WORK, WORK, MOVE, CARRY].concat(new Array(Math.floor((energy - 300) / 100)).fill(WORK))
}