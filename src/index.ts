import { runAction } from "./Actions/Action";
import { harvestFromClosestActiveSource } from "./Actions/harvest";
import { transferEnergy } from "./Actions/transferEnergy";
import { upgradeController } from "./Actions/upgradeController";
import { buildRoads } from "./RoomPlanner/Blueprints/Roads";

export function loop() {
    const spawn = Game.spawns.Spawn1;
    const controller = spawn.room.controller;
    if (!controller) {
        return;
    }
    spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'w6');
    spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'w5');
    spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'w4');
    spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'w3');
    spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'w2');
    spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'w1');
    for (const creep of Object.values(Game.creeps)) {
        runAction(creep, harvestFromClosestActiveSource())
            .andThen(transferEnergy(spawn))
            .or(upgradeController(controller))
            .repeat()
    }
    if (Game.time % 100 === 0) {
        buildRoads(spawn.room);
    }
    if (Game.cpu.bucket === 10000) {
        Game.cpu.generatePixel();
    }
}