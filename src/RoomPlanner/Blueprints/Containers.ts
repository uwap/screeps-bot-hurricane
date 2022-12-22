export const buildContainers = (room: Room) => {
    if ((room.controller?.level ?? 0) < 2) {
        return;
    }
    const sources = room.find(FIND_SOURCES);
    for (const source of sources) {
        room.createConstructionSite(source.pos.x - 2, source.pos.y, STRUCTURE_CONTAINER);
        room.createConstructionSite(source.pos.x + 2, source.pos.y, STRUCTURE_CONTAINER);
        room.createConstructionSite(source.pos.x, source.pos.y - 2, STRUCTURE_CONTAINER);
        room.createConstructionSite(source.pos.x, source.pos.y + 2, STRUCTURE_CONTAINER);
    }
}