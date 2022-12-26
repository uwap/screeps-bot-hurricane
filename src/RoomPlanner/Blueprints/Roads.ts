export const buildRoads = (room: Room) => {
    if ((room.controller?.level ?? 0) < 2) {
        return;
    }
    const sources: _HasRoomPosition[] = room.find(FIND_SOURCES);
    const sourcesAndSpawns = sources.concat(room.find(FIND_MY_SPAWNS));
    const sourcesAndMinerals = sources.concat(room.find(FIND_MINERALS));
    room.visual.clear();
    for (const source of sourcesAndSpawns) {
        for (const source2 of (room.controller?.level ?? 0) > 4 ? sourcesAndMinerals : sources) {
            const path = source.pos.findPathTo(source2, {
                ignoreCreeps: true,
                ignoreRoads: true
            });
            for (const point of path) {
                if ((point.x === source.pos.x && point.y === source.pos.y) || (point.x === source2.pos.x && point.y === source2.pos.y)) {
                    continue;
                }
                room.visual.line(point.x, point.y, point.x - point.dx, point.y - point.dy);
                room.createConstructionSite(point.x, point.y, STRUCTURE_ROAD);
            }
        }
    }
}