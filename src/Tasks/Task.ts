import {
  packPos, unpackPos,
} from "../../deps/screeps-packrat/src/packrat";

export enum TaskType {
  Harvest,
  Upgrade,
  Withdraw,
  Transfer,
  Build,
  Repair,
  Pickup,
}

export enum TaskStatus {
  DONE,
  IN_PROGRESS,
}

declare global {
  interface CreepMemory {
    task?: string;
  }
  interface Creep {
    readonly isIdle: boolean;
    task: TaskData | null;
    _task?: TaskData | null;
  }
  interface RoomObject {
    readonly assignedCreeps: Creep[];
  }
}

export interface TaskData {
  type: TaskType;
  targetPos: RoomPosition;
  target: RoomObject & _HasId | null;
  options: object;
  data: object;
}

const packTaskData = (td: TaskData): string =>
  String.fromCharCode(td.type + 65)
  + packPos(td.targetPos)
  + JSON.stringify({ o: td.options, d: td.data, t: td.target?.id });

const unpackTaskData = (s: string): TaskData => {
  const { o: options, d: data, t: targetId }
    = JSON.parse(s.substring(3)) as {
      o: object; d: object; t: Id<RoomObject & _HasId>; };
  const target = Game.getObjectById(targetId);
  return {
    type: s.charCodeAt(0) - 65,
    targetPos: unpackPos(s.substring(1, 3)),
    target,
    options,
    data,
  };
};

Object.defineProperty(Creep.prototype, "isIdle", {
  get: function (this: Creep) {
    return this.memory.task == null;
  },
  configurable: true,
});

Object.defineProperty(Creep.prototype, "task", {
  get: function (this: Creep) {
    if (this._task != null) {
      return this._task;
    }
    if (this.memory.task == null) {
      return null;
    }
    this._task = unpackTaskData(this.memory.task);
    return this._task;
  },
  set: function (this: Creep, task: TaskData | null) {
    this._task = task;
    if (task != null) {
      this.memory.task = packTaskData(task);
    }
    else {
      delete this.memory.task;
    }
  },
  configurable: true,
});

Object.defineProperty(RoomObject.prototype, "assignedCreeps", {
  get: function (this: RoomObject) {
    if ("id" in this) {
      return Object.values(Game.creeps)
        .filter(x => x.task?.target?.id == this.id);
    }
    return [];
  },
  configurable: true,
});
