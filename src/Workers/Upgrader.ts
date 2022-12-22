import { Fail, runAction } from "../Actions/Action";
import { harvestFromClosestActiveSource } from "../Actions/harvest";
import { transferEnergy } from "../Actions/transferEnergy";
import { upgradeController } from "../Actions/upgradeController";
import { WorkerDefinition } from "./worker";

export const Upgrader: WorkerDefinition = {
    runAction: (creep: Creep, spawn: StructureSpawn) => runAction(creep, harvestFromClosestActiveSource())
        .andThen(transferEnergy(spawn))
        .or(creep.room.controller ? upgradeController(creep.room.controller) : Fail)
        .repeat(),
    name: 'upgrader',
    requiredCreeps: (room: Room) => 2,
    bodyDefinition: (energy: number) => [WORK, WORK, MOVE, CARRY]
}