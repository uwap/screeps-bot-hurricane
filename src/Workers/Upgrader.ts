import { Fail, runAction } from "../Actions/Action";
import { harvestFromClosestActiveSource } from "../Actions/harvest";
import { transferEnergy } from "../Actions/transferEnergy";
import { upgradeController } from "../Actions/upgradeController";
import { withdrawEnergy } from "../Actions/withdrawEnergy";
import { WorkerDefinition } from "./worker";

export const Upgrader: WorkerDefinition = {
    runAction: (creep: Creep, spawn: StructureSpawn) => runAction(creep, withdrawEnergy(creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (str: Structure) => str.structureType === STRUCTURE_STORAGE && (str as StructureStorage).store.getUsedCapacity(RESOURCE_ENERGY) > 0 }) as StructureStorage | null))
        .or(withdrawEnergy(creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (str: Structure) => str.structureType === STRUCTURE_CONTAINER && (str as StructureContainer).store.getUsedCapacity(RESOURCE_ENERGY) > 0 }) as StructureContainer | null))
        .or(harvestFromClosestActiveSource())
        .andThen(creep.room.controller ? upgradeController(creep.room.controller) : Fail)
        .repeat(),
    name: 'upgrader',
    requiredCreeps: (room: Room) => 1,
    bodyDefinition: (energy: number) => new Array(Math.floor(energy / 300)).fill([WORK, WORK, MOVE, CARRY]).reduce((x, y) => x.concat(y), []),
    motivationalThougts: [
        '🏳️‍⚧️'
    ]
}