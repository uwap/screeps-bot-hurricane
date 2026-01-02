import profiler from "screeps-profiler";

const roomSize = 50;
const OBSTACLE = 1000;
const UNSET = 999;

declare global {
  interface RoomMemory {
    _planner: string;
  }
}
const structureCoding: (BuildableStructureConstant | null)[]
  = [null, STRUCTURE_ROAD, STRUCTURE_CONTAINER, STRUCTURE_EXTENSION,
    STRUCTURE_FACTORY, STRUCTURE_EXTRACTOR, STRUCTURE_WALL, STRUCTURE_SPAWN,
    STRUCTURE_POWER_SPAWN, STRUCTURE_STORAGE, STRUCTURE_NUKER,
    STRUCTURE_TERMINAL, STRUCTURE_LAB, STRUCTURE_LINK,
    STRUCTURE_TOWER, STRUCTURE_RAMPART];

const getCoord = (x: number, y: number): number => {
  return x + y * roomSize;
};

const distanceTransform = (mask: (0 | 999 | 1000)[]): number[] => {
  const arr: number[] = new Array(...mask);
  for (let i = 0; arr.find(x => x === UNSET) != null; i++) {
    for (let x = 0; x < roomSize; x++) {
      for (let y = 0; y < roomSize; y++) {
        if (arr[getCoord(x, y)] === i) {
          for (let dx = -1; dx < 2; dx++) {
            for (let dy = -1; dy < 2; dy++) {
              if (x + dx < 0 || y + dy < 0 || x + dx >= 50 || y + dy >= 50
                || arr[getCoord(x, y)] === OBSTACLE) {
                continue;
              }
              if (arr[getCoord(x + dx, y + dy)] === UNSET) {
                arr[getCoord(x + dx, y + dy)] = i + 1;
              }
            }
          }
        }
      }
    }
  }
  return arr;
};

/* const renderHeatmap = (mask: number[], visual: RoomVisual) => {
  for (let x = 0; x < 50; x++) {
    for (let y = 0; y < 50; y++) {
      if (mask[getCoord(x, y)] === OBSTACLE) {
        continue;
      }
      visual.rect(x - 0.5, y - 0.5, 1, 1, {
        fill: "#" + (127 + mask[getCoord(x, y)] * 3).toString(16)
        + 127..toString(16)
        + (255 - mask[getCoord(x, y)] * 5).toString(16),
        opacity: 0.2
      }).text(mask[getCoord(x, y)].toString(), x, y + 0.25);
    }
  }
} */

const createBuildSites = (room: Room) => {
  const structures = [];
  for (let i = 0; i < room.memory._planner.length; i++) {
    structures.push(
      structureCoding[(room.memory._planner.charCodeAt(i) - 32) & 0b11111],
    );
    structures.push(
      structureCoding[(room.memory._planner.charCodeAt(i) - 32) >> 5],
    );
  }
  for (let x = 0; x < roomSize; x++) {
    for (let y = 0; y < roomSize; y++) {
      if ((room.controller?.level ?? 0) < 2
        && structures[getCoord(x, y)] != STRUCTURE_CONTAINER) {
        continue;
      }
      if ((room.controller?.level ?? 0) < 3
        && !(structures[getCoord(x, y)] == STRUCTURE_CONTAINER
          || structures[getCoord(x, y)] == STRUCTURE_ROAD
          || structures[getCoord(x, y)] == STRUCTURE_EXTENSION)) {
        continue;
      }
      if ((room.controller?.level ?? 0) < 4
        && !(structures[getCoord(x, y)] == STRUCTURE_CONTAINER
          || structures[getCoord(x, y)] == STRUCTURE_ROAD
          || structures[getCoord(x, y)] == STRUCTURE_EXTENSION
          || structures[getCoord(x, y)] == STRUCTURE_RAMPART
          || structures[getCoord(x, y)] == STRUCTURE_TOWER)) {
        continue;
      }
      if ((room.controller?.level ?? 0) < 5
        && !(structures[getCoord(x, y)] == STRUCTURE_CONTAINER
          || structures[getCoord(x, y)] == STRUCTURE_ROAD
          || structures[getCoord(x, y)] == STRUCTURE_EXTENSION
          || structures[getCoord(x, y)] == STRUCTURE_RAMPART
          || structures[getCoord(x, y)] == STRUCTURE_TOWER
          || structures[getCoord(x, y)] == STRUCTURE_WALL)) {
        continue;
      }
      if ((room.controller?.level ?? 0) < 6
        && !(structures[getCoord(x, y)] == STRUCTURE_CONTAINER
          || structures[getCoord(x, y)] == STRUCTURE_ROAD
          || structures[getCoord(x, y)] == STRUCTURE_EXTENSION
          || structures[getCoord(x, y)] == STRUCTURE_RAMPART
          || structures[getCoord(x, y)] == STRUCTURE_TOWER
          || structures[getCoord(x, y)] == STRUCTURE_WALL
          || structures[getCoord(x, y)] == STRUCTURE_STORAGE)) {
        continue;
      }
      if ((room.controller?.level ?? 0) < 8
        && !(structures[getCoord(x, y)] == STRUCTURE_CONTAINER
          || structures[getCoord(x, y)] == STRUCTURE_ROAD
          || structures[getCoord(x, y)] == STRUCTURE_EXTENSION
          || structures[getCoord(x, y)] == STRUCTURE_RAMPART
          || structures[getCoord(x, y)] == STRUCTURE_TOWER
          || structures[getCoord(x, y)] == STRUCTURE_WALL
          || structures[getCoord(x, y)] == STRUCTURE_STORAGE
          || structures[getCoord(x, y)] == STRUCTURE_EXTRACTOR)) {
        continue;
      }
      if (structures[getCoord(x, y)] != null) {
        if (room.createConstructionSite(x, y, structures[getCoord(x, y)])
          === ERR_FULL) {
          return;
        }
      }
    }
  }
};

export default profiler.registerFN(function RoomPlanner(room: Room) {
  if (!room.controller?.my) {
    return;
  }
  if (Game.cpu.bucket < 100 && room.name != "sim") {
    return;
  }
  if (room.name != "sim" && Game.time % 113 !== 0) {
    return;
  }
  if (room.memory._planner != null) {
    createBuildSites(room);
    return;
  }
  const terrain = room.getTerrain();
  const mask: number[] = new Array(roomSize * roomSize).fill(0);
  for (let x = 0; x < roomSize; x++) {
    for (let y = 0; y < roomSize; y++) {
      mask[getCoord(x, y)] = terrain.get(x, y);
    }
  }
  const wallDistance = distanceTransform(
    mask.map(t => t === TERRAIN_MASK_WALL ? 0 : UNSET));
  const controllerCoord
    = (room.controller?.pos.x ?? 0) + (room.controller?.pos.y ?? -1) * roomSize;
  const controllerDistance = distanceTransform(
    mask.map((t, i) =>
      i === controllerCoord
        ? 0
        : (
            t === TERRAIN_MASK_WALL ? OBSTACLE : UNSET
          )),
  );
  const buildCenter = wallDistance.map(
    (x, i) => [x * 2.5 - controllerDistance[i], i]).sort(
    (a, b) => b[0] - a[0])[0][1];
  const buildCenterX = buildCenter % roomSize;
  const buildCenterY = Math.floor(buildCenter / roomSize);
  const buildCenterPos = room.getPositionAt(buildCenterX, buildCenterY)!;
  /* room.visual.rect(buildCenterX - 0.5, buildCenterY - 0.5, 1, 1, {
    stroke: "#FF0000",
  }); */

  //
  // Build structures
  //

  const structures: (BuildableStructureConstant | null)[]
    = new Array(roomSize * roomSize);

  // Build Roads + Containers
  const roadTargets = (room.sources as (_HasRoomPosition | null)[])
    .concat([room.controller, room.mineral])
    .concat([room.find(FIND_EXIT_TOP)?.[0],
      room.find(FIND_EXIT_LEFT)?.[0],
      room.find(FIND_EXIT_RIGHT)?.[0],
      room.find(FIND_EXIT_BOTTOM)?.[0]]
      .map(pos => pos == null ? null : ({ pos, highRange: true })));
  for (const target of roadTargets) {
    if (target == null) {
      continue;
    }
    const { path } = PathFinder.search(buildCenterPos,
      { pos: target.pos, range: "highRange" in target ? 3 : 1 }, {
        swampCost: 10,
        plainCost: 2,
        roomCallback: function (roomName) {
          if (roomName != room.name) {
            return false;
          }

          const costs = new PathFinder.CostMatrix();
          for (let x = 0; x < roomSize; x++) {
            for (let y = 0; y < roomSize; y++) {
              if (structures[getCoord(x, y)] === STRUCTURE_ROAD) {
                costs.set(x, y, 1);
              }
            }
          }
          return costs;
        },
      });
    for (let i = 0; i < path.length; i++) {
      const pos = path[i];
      structures[getCoord(pos.x, pos.y)]
        = (i === path.length - 1 && "energy" in target)
          ? STRUCTURE_CONTAINER
          : STRUCTURE_ROAD;
    }
  }

  // Build Core
  for (let dx = -2; dx < 3; dx++) {
    for (let dy = -2; dy < 3; dy++) {
      structures[getCoord(buildCenterX + dx, buildCenterY + dy)]
        = STRUCTURE_ROAD;
    }
  }
  structures[getCoord(buildCenterX, buildCenterY)] = STRUCTURE_RAMPART;
  structures[getCoord(buildCenterX + 1, buildCenterY)] = STRUCTURE_STORAGE;
  structures[getCoord(buildCenterX + 1, buildCenterY - 1)] = STRUCTURE_TERMINAL;
  structures[getCoord(buildCenterX, buildCenterY - 1)] = STRUCTURE_LINK;
  structures[getCoord(buildCenterX - 1, buildCenterY - 1)] = STRUCTURE_FACTORY;
  structures[getCoord(buildCenterX - 1, buildCenterY)] = STRUCTURE_NUKER;
  structures[getCoord(buildCenterX - 1, buildCenterY + 1)] = STRUCTURE_SPAWN;
  structures[getCoord(buildCenterX, buildCenterY + 1)] = STRUCTURE_POWER_SPAWN;
  structures[getCoord(buildCenterX + 1, buildCenterY + 1)] = STRUCTURE_ROAD;

  // Labs
  const coreCorners = [
    [buildCenterX - 2, buildCenterY - 2],
    [buildCenterX - 2, buildCenterY + 2],
    [buildCenterX + 2, buildCenterY - 2],
    [buildCenterX + 2, buildCenterY + 2],
  ].map(([x, y]) => [x, y, controllerDistance[x + y * roomSize]],
  ).sort(([_x, _y, i], [_x2, _y2, j]) => i - j);

  for (const [x, y, _i] of coreCorners) {
    const directionX = (x - buildCenterX) / Math.abs(x - buildCenterX);
    const directionY = (y - buildCenterY) / Math.abs(y - buildCenterY);
    let ok = true;
    s: for (let dx = 0; Math.abs(dx) < 4; dx += directionX) {
      for (let dy = 0; Math.abs(dy) < 4; dy += directionY) {
        if ((structures[getCoord(x + dx, y + dy)] == null
          || structures[getCoord(x + dx, y + dy)] === STRUCTURE_ROAD)
        && mask[getCoord(x + dx, y + dy)] === 0) {
          continue;
        }
        ok = false;
        break s;
      }
    }
    if (ok) {
      for (let dx = 0; Math.abs(dx) < 5; dx += directionX) {
        for (let dy = 0; Math.abs(dy) < 5; dy += directionY) {
          if (Math.abs(dx) == Math.abs(dy)) {
            structures[getCoord(x + dx, y + dy)] = STRUCTURE_ROAD;
            continue;
          }
          if (Math.abs(dx) === 4 || Math.abs(dy) === 4) {
            if (mask[getCoord(x + dx, y + dy)] === 0) {
              structures[getCoord(x + dx, y + dy)] = STRUCTURE_ROAD;
            }
          }
          if (!(dx === 0 && Math.abs(dy) === 3)
            && !(dy === 0 && Math.abs(dx) === 3)) {
            structures[getCoord(x + dx, y + dy)] = STRUCTURE_LAB;
          }
        }
      }
      break;
    }
  }

  // Extensions
  let extensions = 0;
  a: for (let dx = 0; dx < roomSize / 2; dx++) {
    const dylimit = wallDistance[getCoord(buildCenterX, buildCenterY)];
    for (let dy = 0; dy < dylimit; dy++) {
      for (let cardinal = 0; cardinal < 4; cardinal++) {
        const x = cardinal < 2 ? buildCenterX + dx : buildCenterX - dx;
        const y = cardinal % 2 == 0 ? buildCenterY + dy : buildCenterY - dy;
        if (extensions >= 60) {
          break a;
        }
        if (structures[getCoord(x, y)] == null
          && (mask[getCoord(x, y)] === 0
            || mask[getCoord(x, y)] === TERRAIN_MASK_SWAMP)) {
          let ok = false;
          s: for (let ddx = -1; ddx < 2; ddx++) {
            for (let ddy = -1; ddy < 2; ddy++) {
              if (structures[getCoord(x + ddx, y + ddy)] === STRUCTURE_ROAD) {
                ok = true;
                break s;
              }
            }
          }
          if (ok) {
            if (x % 2 == y % 3 || x % 3 == y % 2) {
              structures[getCoord(x, y)] = STRUCTURE_ROAD;
            }
            else {
              structures[getCoord(x, y)] = STRUCTURE_EXTENSION;
              extensions++;
            }
          }
        }
      }
    }
  }

  if (room.mineral != null) {
    structures[getCoord(room.mineral.pos.x, room.mineral.pos.y)]
      = STRUCTURE_EXTRACTOR;
  }

  // Walls
  let smallestX = roomSize;
  let largestX = 0;
  let smallestY = roomSize;
  let largestY = 0;
  for (let x = 0; x < roomSize; x++) {
    for (let y = 0; y < roomSize; y++) {
      if (structures[getCoord(x, y)] != null
        && structures[getCoord(x, y)] != STRUCTURE_ROAD
        && structures[getCoord(x, y)] != STRUCTURE_CONTAINER) {
        if (x < smallestX) {
          smallestX = x;
        }
        if (x > largestX) {
          largestX = x;
        }
        if (y < smallestY) {
          smallestY = y;
        }
        if (y > largestY) {
          largestY = y;
        }
      }
    }
  }

  smallestX = Math.max(2, smallestX - 3);
  smallestY = Math.max(2, smallestY - 3);
  largestX = Math.min(48, largestX + 3);
  largestY = Math.min(48, largestY + 3);

  const centerLine = Math.floor(largestY / 2 + smallestY / 2);

  const { path } = PathFinder.search(
    room.getPositionAt(smallestX - 1, centerLine + 1)!,
    room.getPositionAt(smallestX - 1, centerLine - 1)!,
    {
      plainCost: 100,
      swampCost: 100,

      roomCallback: function (roomName) {
        if (roomName != room.name) {
          return false;
        }

        const costs = new PathFinder.CostMatrix();
        for (let x = 0; x < roomSize; x++) {
          for (let y = 0; y < roomSize; y++) {
            if (mask[getCoord(x, y)] === TERRAIN_MASK_WALL) {
              costs.set(x, y, 1);
            }
            if (structures[getCoord(x, y)] != null) {
              if (structures[getCoord(x, y)] == STRUCTURE_ROAD) {
                costs.set(x, y, 254);
              }
              else {
                costs.set(x, y, 255);
              }
            }
          }
        }
        for (let x = smallestX; x <= largestX; x++) {
          for (let y = smallestY; y <= largestY; y++) {
            costs.set(x, y, 255);
          }
        }
        for (let x = 0; x < smallestX; x++) {
          costs.set(x, centerLine, 255);
        }

        return costs;
      },
    });

  path.push(room.getPositionAt(smallestX - 1, centerLine)!);
  for (const pos of path) {
    const s = structures[getCoord(pos.x, pos.y)] === STRUCTURE_ROAD
      || structures[getCoord(pos.x + 1, pos.y)] === STRUCTURE_ROAD
      || structures[getCoord(pos.x - 1, pos.y)] === STRUCTURE_ROAD
      || structures[getCoord(pos.x + 1, pos.y + 1)] === STRUCTURE_ROAD
      || structures[getCoord(pos.x + 1, pos.y - 1)] === STRUCTURE_ROAD
      || structures[getCoord(pos.x - 1, pos.y + 1)] === STRUCTURE_ROAD
      || structures[getCoord(pos.x - 1, pos.y - 1)] === STRUCTURE_ROAD
      || structures[getCoord(pos.x, pos.y + 1)] === STRUCTURE_ROAD
      || structures[getCoord(pos.x, pos.y - 1)] === STRUCTURE_ROAD
      ? STRUCTURE_RAMPART
      : STRUCTURE_WALL;
    if (mask[getCoord(pos.x, pos.y)] != TERRAIN_MASK_WALL) {
      structures[getCoord(pos.x, pos.y)] = s;
    }
    else {
      continue;
    }
    if (mask[getCoord(pos.x + 1, pos.y)] != TERRAIN_MASK_WALL
      && structures[getCoord(pos.x + 1, pos.y)] != STRUCTURE_RAMPART) {
      structures[getCoord(pos.x + 1, pos.y)] = s;
    }
    if (mask[getCoord(pos.x - 1, pos.y)] != TERRAIN_MASK_WALL
      && structures[getCoord(pos.x - 1, pos.y)] != STRUCTURE_RAMPART) {
      structures[getCoord(pos.x - 1, pos.y)] = s;
    }
    if (mask[getCoord(pos.x, pos.y + 1)] != TERRAIN_MASK_WALL
      && structures[getCoord(pos.x, pos.y + 1)] != STRUCTURE_RAMPART) {
      structures[getCoord(pos.x, pos.y + 1)] = s;
    }
    if (mask[getCoord(pos.x, pos.y - 1)] != TERRAIN_MASK_WALL
      && structures[getCoord(pos.x, pos.y - 1)] != STRUCTURE_RAMPART) {
      structures[getCoord(pos.x, pos.y - 1)] = s;
    }
  }

  // Render
  // renderHeatmap(controllerDistance, room.visual);
  /* for (let x = 0; x < roomSize; x++) {
    for (let y = 0; y < roomSize; y++) {
      if (structures[getCoord(x, y)] != null) {
        room.visual.structure(x, y, structures[getCoord(x, y)]);
      }
    }
  }
  room.visual.connectRoads(); */

  let str = "";
  for (let i = 0; i < structures.length; i += 2) {
    str += String.fromCharCode(32
      + (structureCoding.findIndex(s => s == structures[i]))
      + (structureCoding.findIndex(s => s == structures[i + 1]) << 5),
    );
  }

  room.memory._planner = str;
});
