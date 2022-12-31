export interface WorkerDefinition {
    runAction: (creep: Creep, spawn: StructureSpawn) => void,
    name: string,
    requiredCreeps: (room: Room) => number,
    bodyDefinition: (energy: number) => BodyPartConstant[],
    motivationalThougts?: string[]
}

export const spawnWorkers = (spawn: StructureSpawn, workers: WorkerDefinition[]): void => {
    for (const worker of workers) {
        for (let i = 0; i < worker.requiredCreeps(spawn.room); i++) {
            const ret = spawn.spawnCreep(worker.bodyDefinition(
                spawn.store.getCapacity(RESOURCE_ENERGY) + (spawn.room.find(FIND_MY_STRUCTURES, { filter: { structureType: STRUCTURE_EXTENSION }}).length * (Object.keys(Game.creeps).length < 2 ? (25 * Object.keys(Game.creeps).length) : 50))), worker.name + i.toString());
            if (ret === OK || ret === ERR_NOT_ENOUGH_ENERGY) {
                return;
            }
        }
    }
};

export const runWorkers = (spawn: StructureSpawn, workers: WorkerDefinition[]): void => {
    for (const worker of workers) {
        for (const creep of Object.values(Game.creeps)) {
            if (creep.spawning) {
                continue;
            }
            if (creep.name.startsWith(worker.name)) {
                worker.runAction(creep, spawn);
                if (worker.motivationalThougts != null && Math.random() < 0.1) {
                    creep.say(worker.motivationalThougts[Math.floor(worker.motivationalThougts.length * Math.random())], true);
                }
            }
        }
    }
};