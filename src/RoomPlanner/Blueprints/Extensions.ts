const extentionsAvailable = (roomlevel: number) => {
    return roomlevel > 2 ? roomlevel * 10 - 20 : (roomlevel - 1) * 5;
}

export const buildExtentions = (room: Room) => {
    const spawns = room.find(FIND_MY_SPAWNS);
    if (spawns.length < 1) return;
    const spawn = spawns[0];
    const exts = extentionsAvailable(room.controller?.level ?? 0)
    for (let x = -Math.floor(Math.sqrt(exts) / 2); x < Math.sqrt(exts) / 2; x++) {
        for (let y = -Math.floor(Math.sqrt(exts) / 2); y < Math.sqrt(exts) / 2; y++) {
            room.visual.circle(spawn.pos.x + x * 2, spawn.pos.y + y * 2);
            room.createConstructionSite(spawn.pos.x + x * 2, spawn.pos.y + y * 2, STRUCTURE_EXTENSION);
        }
    }
}