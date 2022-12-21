import { runAction } from "./Actions/Action";
import { buildConstructionSite } from "./Actions/buildConstructionSite";
import { harvestFromClosestActiveSource } from "./Actions/harvest";
import { transferEnergy } from "./Actions/transferEnergy";
import { upgradeController } from "./Actions/upgradeController";
import { buildExtentions } from "./RoomPlanner/Blueprints/Extensions";
import { buildRoads } from "./RoomPlanner/Blueprints/Roads";

export function loop() {
    const spawn = Game.spawns.Spawn1;
    const controller = spawn.room.controller;
    if (!controller) {
        return;
    }
    spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'builder6');
    spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'uprader5');
    spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'builder4');
    spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'builder3');
    spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'upgrader2');
    spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'upgrader1');
    for (const creep of Object.values(Game.creeps)) {
        if (creep.name.startsWith('u') || creep.name.startsWith('w')) {
            runAction(creep, harvestFromClosestActiveSource())
            .andThen(transferEnergy(spawn))
            .or(upgradeController(controller))
            .repeat()
        } else if (creep.name.startsWith('b')) {
            runAction(creep, harvestFromClosestActiveSource())
            .andThen(buildConstructionSite())
            .or(upgradeController(controller))
            .repeat()
        }
    }
    if (Game.time % 100 === 0) {
        buildRoads(spawn.room);
    }
    if (Game.time % 100 === 50) {
        buildExtentions(spawn.room)
    }
    if (Game.cpu.bucket === 10000) {
        Game.cpu.generatePixel();
    }
}