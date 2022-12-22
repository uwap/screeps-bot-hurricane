import { Fail, runAction } from "../Actions/Action";
import { buildConstructionSite } from "../Actions/buildConstructionSite";
import { harvestFromClosestActiveSource } from "../Actions/harvest";
import { upgradeController } from "../Actions/upgradeController";
import { WorkerDefinition } from "./worker";

export const Constructor: WorkerDefinition = {
    runAction: (creep: Creep) => runAction(creep, harvestFromClosestActiveSource())
        .andThen(buildConstructionSite())
        .or(creep.room.controller ? upgradeController(creep.room.controller) : Fail)
        .repeat(),
    name: 'constructor',
    requiredCreeps: (room: Room) => room.find(FIND_MY_CONSTRUCTION_SITES).length / 5 + 1,
    bodyDefinition: (energy: number) => [WORK, MOVE, MOVE, CARRY, CARRY]
}