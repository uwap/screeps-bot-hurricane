import { Fail, runAction } from "../Actions/Action";
import { buildConstructionSite } from "../Actions/buildConstructionSite";
import { harvestFromClosestActiveSource } from "../Actions/harvest";
import { repairStructure } from "../Actions/repairStructure";
import { upgradeController } from "../Actions/upgradeController";
import { withdrawEnergy } from "../Actions/withdrawEnergy";
import { WorkerDefinition } from "./worker";

export const Constructor: WorkerDefinition = {
    runAction: (creep: Creep) => runAction(creep, withdrawEnergy(creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (str: Structure) => str.structureType === STRUCTURE_STORAGE && (str as StructureStorage).store.getUsedCapacity(RESOURCE_ENERGY) > 0 }) as StructureStorage | null))
    .or(withdrawEnergy(creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (str: Structure) => str.structureType === STRUCTURE_CONTAINER && (str as StructureContainer).store.getUsedCapacity(RESOURCE_ENERGY) > 0 }) as StructureContainer | null))
        .or(harvestFromClosestActiveSource())
        .andThen(buildConstructionSite())
        .or(repairStructure())
        .or(creep.room.controller ? upgradeController(creep.room.controller) : Fail)
        .repeat(),
    name: 'constructor',
    requiredCreeps: (room: Room) => 1,
    bodyDefinition: (energy: number) => new Array(Math.floor(energy / 250)).fill([WORK, MOVE, CARRY, CARRY]).reduce((x, y) => x.concat(y), []),
    motivationalThougts: [
        "I 💗 making",
        "Fixin' 🔧"
    ]
}