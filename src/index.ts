import "../deps/Traveler/Traveler.ts";
import "../deps/Traveler/index.d.ts";
import "./Proto";
import profiler from "screeps-profiler";

import { Clerk } from "./Workers/Clerk";
import { Constructor } from "./Workers/Constructor";
import { Miner } from "./Workers/Miner";
import { Upgrader } from "./Workers/Upgrader";
import { runWorkers, spawnWorkers } from "./Workers/worker";
import RoomPlanner from "./RoomPlanner";

const runTowers = profiler.registerFN((spawn: StructureSpawn) => {
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
}, "runTowers") as (spawn: StructureSpawn) => void;

profiler.enable();
export const loop = profiler.wrap(() => {
  const spawn = Game.spawns.Spawn1;
  const controller = spawn.room.controller;
  if (!controller) {
    return;
  }
  if (spawn.room.name != "sim") {
    const workerTypes = [Clerk, Miner, Upgrader, Constructor];
    spawnWorkers(spawn, workerTypes);
    runWorkers(workerTypes);
    runTowers(spawn);
  }

  for (const creep in Memory.creeps) {
    if (!(creep in Game.creeps)) {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete Memory.creeps[creep];
    }
  }
  if (Game.time % 101 === 0) {
    Game.profiler.email(100);
  }
  if (Game.cpu.bucket === 10000) {
    Game.cpu.generatePixel();
  }
  RoomPlanner(spawn.room);
});
