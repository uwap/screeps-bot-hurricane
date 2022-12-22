export interface WorkerDefinition {
    runAction: (creep: Creep, spawn: StructureSpawn) => void,
    name: string,
    requiredCreeps: (room: Room) => number,
    bodyDefinition: (energy: number, spawn: StructureSpawn) => BodyPartConstant[]
}

export const spawnWorkers = (spawn: StructureSpawn, workers: WorkerDefinition[]): void => {
    for (const worker of workers) {
        for (let i = 0; i < worker.requiredCreeps(spawn.room); i++) {
            spawn.spawnCreep(worker.bodyDefinition(spawn.store.getCapacity(RESOURCE_ENERGY), spawn), worker.name + i.toString());
        }
    }
};

export const runWorkers = (spawn: StructureSpawn, workers: WorkerDefinition[]): void => {
    for (const worker of workers) {
        for (const creep of Object.values(Game.creeps)) {
            if (creep.name.startsWith(worker.name)) {
                worker.runAction(creep, spawn);
            }
        }
    }
};