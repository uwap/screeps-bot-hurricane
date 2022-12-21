export const buildRoads = (room: Room) => {
    if ((room.controller?.level ?? 0) < 2) {
        return;
    }
    const sources = room.find(FIND_SOURCES);
    room.visual.clear();
    for (const source of sources) {
        for (const source2 of sources) {
            const path = source.pos.findPathTo(source2, {
                ignoreCreeps: true,
                ignoreRoads: true
            });
            for (const point of path) {
                room.visual.line(point.x, point.y, point.x - point.dx, point.y - point.dy);
                room.createConstructionSite(point.x, point.y, STRUCTURE_ROAD);
            }
        }
    }
}