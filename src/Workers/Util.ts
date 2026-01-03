export const closestTowerToFill = (pos: RoomPosition): StructureTower | null =>
  pos.findClosestByRange(FIND_MY_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_TOWER
      && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
  });

export const closestExtensionToFill
  = (pos: RoomPosition): StructureExtension | null =>
    pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_EXTENSION
        && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    });

export const closestContainerWithEnergy
  = (pos: RoomPosition): StructureContainer | null =>
    pos.findClosestByRange(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_CONTAINER
        && structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
    });
export const closestContainerToFill
  = (pos: RoomPosition): StructureContainer | null =>
    pos.findClosestByRange(FIND_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_CONTAINER
        && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    });

export const closestStorageWithResource
  = (pos: RoomPosition, t: ResourceConstant): StructureStorage | null =>
    pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_STORAGE
        && structure.store.getUsedCapacity(t) > 0,
    });
export const closestStorageToFill
  = (pos: RoomPosition, t: ResourceConstant): StructureStorage | null =>
    pos.findClosestByRange(FIND_MY_STRUCTURES, {
      filter: structure => structure.structureType === STRUCTURE_STORAGE
        && structure.store.getFreeCapacity(t) > 0,
    });
