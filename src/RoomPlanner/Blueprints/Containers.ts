export const buildContainers = (room: Room) => {
    const controller = room.controller;
    if (controller == null) {
        return;
    }
    if (controller.level < 2) {
        return;
    }
    const sources = room.find(FIND_SOURCES);
    for (const source of sources) {
        room.createConstructionSite(source.pos.x - 2, source.pos.y, STRUCTURE_CONTAINER);
        room.createConstructionSite(source.pos.x + 2, source.pos.y, STRUCTURE_CONTAINER);
        room.createConstructionSite(source.pos.x, source.pos.y - 2, STRUCTURE_CONTAINER);
        room.createConstructionSite(source.pos.x, source.pos.y + 2, STRUCTURE_CONTAINER);
    }
    if (controller.level < 4) {
        return;
    }
    const terrain = room.getTerrain();
    if (terrain.get(controller.pos.x, controller.pos.y - 3) !== TERRAIN_MASK_WALL) {
        room.createConstructionSite(controller.pos.x, controller.pos.y - 3, STRUCTURE_STORAGE);
    } else if (terrain.get(controller.pos.x, controller.pos.y + 3) !== TERRAIN_MASK_WALL) {
        room.createConstructionSite(controller.pos.x, controller.pos.y + 3, STRUCTURE_STORAGE);
    } else if (terrain.get(controller.pos.x - 3, controller.pos.y) !== TERRAIN_MASK_WALL) {
        room.createConstructionSite(controller.pos.x - 3, controller.pos.y, STRUCTURE_STORAGE);
    } else if (terrain.get(controller.pos.x + 3, controller.pos.y) !== TERRAIN_MASK_WALL) {
        room.createConstructionSite(controller.pos.x + 3, controller.pos.y, STRUCTURE_STORAGE);
    }
}