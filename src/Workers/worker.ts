import profiler from "screeps-profiler";
import { TaskData } from "../Tasks/Task";

export interface WorkerDefinition {
  assignTask: (creep: Creep) => TaskData | null;
  name: string;
  requiredCreeps: (room: Room) => number;
  bodyDefinition: (energy: number) => BodyPartConstant[];
  motivationalThougts?: string[];
}

export const spawnWorkers = profiler.registerFN(
  function spawnWorkers(spawn: StructureSpawn, workers: WorkerDefinition[]) {
    for (const worker of workers) {
      for (let i = 0; i < worker.requiredCreeps(spawn.room); i++) {
        const ret = spawn.spawnCreep(
          worker.bodyDefinition(spawn.room.energyCapacityAvailable),
          worker.name + i.toString());
        if (ret === OK || ret === ERR_NOT_ENOUGH_ENERGY) {
          return;
        }
      }
    }
  }) as (spawn: StructureSpawn, workers: WorkerDefinition[]) => void;

export const runWorkers = profiler.registerFN(
  function runWorkers(workers: WorkerDefinition[]) {
    for (const worker of workers) {
      for (const creep of Object.values(Game.creeps)) {
        if (creep.spawning) {
          continue;
        }
        if (creep.name.startsWith(worker.name)) {
          creep.run(worker.assignTask);
          if (worker.motivationalThougts != null && Math.random() < 0.1) {
            creep.say(
              worker.motivationalThougts[
                Math.floor(worker.motivationalThougts.length * Math.random())
              ], true);
          }
        }
      }
    }
  }) as (workers: WorkerDefinition[]) => void;
