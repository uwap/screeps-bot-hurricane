import { buildContainers } from "./RoomPlanner/Blueprints/Containers";
import { buildExtentions } from "./RoomPlanner/Blueprints/Extensions";
import { buildRoads } from "./RoomPlanner/Blueprints/Roads";
import { Clerk } from "./Workers/Clerk";
import { Constructor } from "./Workers/Constructor";
import { Miner } from "./Workers/Miner";
import { Upgrader } from "./Workers/Upgrader";
import { runWorkers, spawnWorkers } from "./Workers/worker";

const runTowers = (spawn: StructureSpawn) => {
  const towers: StructureTower[] = spawn.room.find(FIND_MY_STRUCTURES,
    { filter: s => s.structureType === STRUCTURE_TOWER });
  for (const tower of towers) {
    const enemy = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (enemy != null) {
      if (tower.attack(enemy) === OK) {
        continue;
      }
    }
    const creep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
      filter: (creep: Creep) => creep.hits < creep.hitsMax,
    });
    if (creep != null) {
      if (tower.heal(creep) === OK) {
        continue;
      }
    }
    const str = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: s => s.hits < s.hitsMax * 0.8,
    });
    console.log(str);
    if (str != null) {
      console.log(tower.repair(str));
    }
  };
};

export function loop() {
  const spawn = Game.spawns.Spawn1;
  const controller = spawn.room.controller;
  if (!controller) {
    return;
  }
  const workerTypes = [Clerk, Upgrader, Miner, Constructor];
  spawnWorkers(spawn, workerTypes);
  runWorkers(spawn, workerTypes);
  runTowers(spawn);
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
