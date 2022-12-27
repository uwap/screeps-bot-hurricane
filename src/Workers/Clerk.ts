import { Fail, runAction } from "../Actions/Action";
import { harvestFromClosestActiveSource } from "../Actions/harvest";
import { transferEnergy } from "../Actions/transferEnergy";
import { upgradeController } from "../Actions/upgradeController";
import { withdrawEnergy } from "../Actions/withdrawEnergy";
import { WorkerDefinition } from "./worker";

export const Clerk: WorkerDefinition = {
    runAction: (creep: Creep, spawn: StructureSpawn) => runAction(creep, withdrawEnergy(creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (str: Structure) => str.structureType === STRUCTURE_CONTAINER && (str as StructureContainer).store.getUsedCapacity(RESOURCE_ENERGY) > 0 }) as StructureContainer | null))
        .or(harvestFromClosestActiveSource())
        .andThen(transferEnergy(spawn))
        .or(transferEnergy(creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (structure: AnyOwnedStructure) => structure.structureType === STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0}) as StructureExtension | null))
        .or(transferEnergy(creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (str: Structure) => str.structureType === STRUCTURE_STORAGE && (str as StructureStorage).store.getFreeCapacity(RESOURCE_ENERGY) > 0 }) as StructureStorage | null))
        .or(creep.room.controller ? upgradeController(creep.room.controller) : Fail)
        .repeat(),
    name: 'clerk',
    requiredCreeps: (room: Room) => 2,
    bodyDefinition: (energy: number) => [WORK].concat(new Array(Math.floor(energy / 150)).fill([MOVE, CARRY, CARRY]).reduce((x, y) => x.concat(y), [])),
    motivationalThougts: [
        "Carrying 🎒",
        "💗 working"
    ]
}