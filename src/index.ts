import { runAction } from "./Actions/Action";
import { buildConstructionSite } from "./Actions/buildConstructionSite";
import { harvestFromClosestActiveSource } from "./Actions/harvest";
import { transferEnergy } from "./Actions/transferEnergy";
import { upgradeController } from "./Actions/upgradeController";
import { buildContainers } from "./RoomPlanner/Blueprints/Containers";
import { buildExtentions } from "./RoomPlanner/Blueprints/Extensions";
import { buildRoads } from "./RoomPlanner/Blueprints/Roads";
import { Constructor } from "./Workers/Constructor";
import { Miner } from "./Workers/Miner";
import { Upgrader } from "./Workers/Upgrader";
import { runWorkers, spawnWorkers } from "./Workers/worker";

export function loop() {
    const spawn = Game.spawns.Spawn1;
    const controller = spawn.room.controller;
    if (!controller) {
        return;
    }
    const workerTypes = [Constructor, Upgrader, Miner];
    spawnWorkers(spawn, workerTypes);
    runWorkers(spawn, workerTypes);
    if (Game.time % 100 === 0) {
        buildRoads(spawn.room);
    }
    if (Game.time % 100 === 50) {
        buildExtentions(spawn.room);
    }
    if (Game.time % 100 === 25) {
        buildContainers(spawn.room);
    }
    if (Game.cpu.bucket === 10000) {
        Game.cpu.generatePixel();
    }
}