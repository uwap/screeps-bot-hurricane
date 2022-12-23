import { Fail, runAction } from "../Actions/Action";
import { buildConstructionSite } from "../Actions/buildConstructionSite";
import { harvestFromClosestActiveSource } from "../Actions/harvest";
import { upgradeController } from "../Actions/upgradeController";
import { withdrawEnergy } from "../Actions/withdrawEnergy";
import { WorkerDefinition } from "./worker";

export const Constructor: WorkerDefinition = {
    runAction: (creep: Creep) => runAction(creep, withdrawEnergy(<StructureContainer | null> creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_CONTAINER }})))
        .or(harvestFromClosestActiveSource())
        .andThen(buildConstructionSite())
        .or(creep.room.controller ? upgradeController(creep.room.controller) : Fail)
        .repeat(),
    name: 'constructor',
    requiredCreeps: (room: Room) => room.find(FIND_MY_CONSTRUCTION_SITES).length / 5 + 1,
    bodyDefinition: (energy: number) => new Array(Math.floor(energy / 300)).fill([WORK, MOVE, MOVE, CARRY, CARRY]).reduce((x, y) => x.concat(y), [])
}