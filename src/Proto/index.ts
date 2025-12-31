declare global {
  interface RoomMemory {
    sources: {
      [id: Id<Source>]: SourceMemory;
    };
    spawn: Id<StructureSpawn> | null;
    _spawnCacheTimeout?: number;
  }

  interface SourceMemory {
    container: Id<StructureContainer> | null;
  }

  interface Source {
    memory: SourceMemory;
    get container(): StructureContainer | null;
  }

  interface Room {
    get sources(): Source[];
    get spawn(): StructureSpawn | null;
  }
}

Object.defineProperty(Room.prototype, "sources", {
  get: function (this: Room) {
    if (this == Room.prototype || this == undefined) return undefined;
    if (!this.memory.sources) {
      this.memory.sources = {};
      const sources = this.find(FIND_SOURCES);
      for (const source of sources) {
        this.memory.sources[source.id] = {
          container: null,
        };
      }
    }
    return Object.keys(this.memory.sources).map(Game.getObjectById);
  },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(Room.prototype, "spawn", {
  get: function (this: Room) {
    if (this == Room.prototype || this == undefined) return undefined;
    if (!this.memory.spawn) {
      if (this.memory._spawnCacheTimeout == null
        || this.memory._spawnCacheTimeout > Game.time) {
        const spawns = this.find(FIND_MY_SPAWNS);
        if (spawns.length > 0) {
          this.memory.spawn = spawns[0].id;
        }
        else {
          this.memory._spawnCacheTimeout = Game.time + 100;
        }
      }
    }
    return this.memory.spawn == null
      ? null
      : Game.getObjectById(this.memory.spawn);
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(Source.prototype, "memory", {
  get: function (this: Source) {
    return this.room.memory.sources[this.id];
  },
  set: function (this: Source, mem: SourceMemory) {
    this.room.memory.sources[this.id] = mem;
  },
  enumerable: false,
  configurable: true,
});

Object.defineProperty(Source.prototype, "container", {
  get: function (this: Source) {
    if (this.memory.container == null
      || Game.getObjectById(this.memory.container) == null) {
      const containers = this.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: (s: Structure) => s.structureType === STRUCTURE_CONTAINER,
      }) as StructureContainer[];
      if (containers.length > 0) {
        this.memory.container = containers[0].id;
      }
    }
    return this.memory.container == null
      ? null
      : Game.getObjectById(this.memory.container);
  },
  enumerable: false,
  configurable: true,
});

export default {};
