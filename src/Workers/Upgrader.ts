import { Fail, runAction } from "../Actions/Action";
import { harvestFromClosestActiveSource } from "../Actions/harvest";
import { transferEnergy } from "../Actions/transferEnergy";
import { upgradeController } from "../Actions/upgradeController";
import { withdrawEnergy } from "../Actions/withdrawEnergy";
import { WorkerDefinition } from "./worker";

export const Upgrader: WorkerDefinition = {
    runAction: (creep: Creep, spawn: StructureSpawn) => runAction(creep, withdrawEnergy(<StructureContainer | null> creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER }})))
        .or(harvestFromClosestActiveSource())
        .andThen(transferEnergy(spawn))
        .or(transferEnergy(<StructureExtension | null> creep.pos.findClosestByRange(FIND_MY_STRUCTURES, { filter: (structure: StructureExtension) => structure.structureType === STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0})))
        .or(creep.room.controller ? upgradeController(creep.room.controller) : Fail)
        .repeat(),
    name: 'upgrader',
    requiredCreeps: (room: Room) => 4,
    bodyDefinition: (energy: number) => new Array(Math.floor(energy / 300)).fill([WORK, WORK, MOVE, CARRY]).reduce((x, y) => x.concat(y), [])
}