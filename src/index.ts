export function loop() {
    const spawn = Game.spawns.Spawn1;
    spawn.spawnCreep([WORK, CARRY, CARRY, MOVE], 'w1');
    for (const creep of Object.values(Game.creeps)) {
        const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if (source && creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    }
}