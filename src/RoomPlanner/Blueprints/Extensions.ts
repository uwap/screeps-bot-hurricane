const extentionsAvailable = (roomlevel: number) => {
  return roomlevel > 2 ? roomlevel * 10 - 20 : (roomlevel - 1) * 5;
};

export const buildExtentions = (room: Room) => {
  const spawns = room.find(FIND_MY_SPAWNS);
  if (spawns.length < 1) return;
  const spawn = spawns[0];
  const exts = extentionsAvailable(room.controller?.level ?? 0);
  const terrain = room.getTerrain();
  const sqroffset = Math.sqrt(exts) / 2;
  for (let x = -Math.floor(sqroffset); x < sqroffset; x++) {
    for (let y = -Math.floor(sqroffset); y < sqroffset; y++) {
      room.visual.circle(spawn.pos.x + x * 2, spawn.pos.y + y * 2);
      if (terrain.get(spawn.pos.x + x * 2 - 1, spawn.pos.y + y * 2 - 1)
        !== TERRAIN_MASK_WALL) {
        room.createConstructionSite(
          spawn.pos.x + x * 2 - 1, spawn.pos.y + y * 2 - 1, STRUCTURE_ROAD);
      }
      if (terrain.get(spawn.pos.x + x * 2, spawn.pos.y + y * 2 - 1)
        !== TERRAIN_MASK_WALL) {
        room.createConstructionSite(
          spawn.pos.x + x * 2, spawn.pos.y + y * 2 - 1, STRUCTURE_ROAD);
      }
      if (terrain.get(spawn.pos.x + x * 2 - 1, spawn.pos.y + y * 2)
        !== TERRAIN_MASK_WALL) {
        room.createConstructionSite(
          spawn.pos.x + x * 2 - 1, spawn.pos.y + y * 2, STRUCTURE_ROAD);
      }
      room.createConstructionSite(
        spawn.pos.x + x * 2, spawn.pos.y + y * 2, STRUCTURE_EXTENSION);
    }
  }
};
