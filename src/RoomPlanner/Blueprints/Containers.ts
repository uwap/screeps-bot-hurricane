export const buildContainers = (room: Room) => {
  const controller = room.controller;
  if (controller == null) {
    return;
  }
  if (controller.level < 2
    && room.find(FIND_MY_STRUCTURES,
      { filter: STRUCTURE_EXTENSION }).length > 1) {
    return;
  }
  const sources = room.find(FIND_SOURCES);
  for (const source of sources) {
    const pos = source.pos;
    room.createConstructionSite(pos.x - 1, pos.y, STRUCTURE_CONTAINER);
    room.createConstructionSite(pos.x + 1, pos.y, STRUCTURE_CONTAINER);
    room.createConstructionSite(pos.x, pos.y - 1, STRUCTURE_CONTAINER);
    room.createConstructionSite(pos.x, pos.y + 1, STRUCTURE_CONTAINER);
    room.createConstructionSite(pos.x - 1, pos.y + 1, STRUCTURE_CONTAINER);
    room.createConstructionSite(pos.x + 1, pos.y - 1, STRUCTURE_CONTAINER);
    room.createConstructionSite(pos.x - 1, pos.y - 1, STRUCTURE_CONTAINER);
    room.createConstructionSite(pos.x + 1, pos.y + 1, STRUCTURE_CONTAINER);
  }
  if (controller.level < 4) {
    return;
  }
  const terrain = room.getTerrain();
  if (terrain.get(controller.pos.x, controller.pos.y - 3)
    !== TERRAIN_MASK_WALL) {
    room.createConstructionSite(
      controller.pos.x, controller.pos.y - 3, STRUCTURE_STORAGE);
  }
  else if (terrain.get(controller.pos.x, controller.pos.y + 3)
    !== TERRAIN_MASK_WALL) {
    room.createConstructionSite(
      controller.pos.x, controller.pos.y + 3, STRUCTURE_STORAGE);
  }
  else if (terrain.get(controller.pos.x - 3, controller.pos.y)
    !== TERRAIN_MASK_WALL) {
    room.createConstructionSite(
      controller.pos.x - 3, controller.pos.y, STRUCTURE_STORAGE);
  }
  else if (terrain.get(controller.pos.x + 3, controller.pos.y)
    !== TERRAIN_MASK_WALL) {
    room.createConstructionSite(
      controller.pos.x + 3, controller.pos.y, STRUCTURE_STORAGE);
  }
};
