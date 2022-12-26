import { createAction, Fail, InProgress, Success } from "./Action";
import { moveTo } from "./moveTo";

export const repairStructure = () => createAction('repairStructure', (creep: Creep) => {
    const cs = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (str) => str.hits < str.hitsMax * 0.8 });
    if (!cs) {
        return Fail;
    }
    switch (creep.repair(cs)) {
        case OK: {
            return InProgress;
        }
        case ERR_NOT_ENOUGH_RESOURCES: {
            return Success;
        }
        case ERR_NOT_IN_RANGE: {
            return moveTo(cs);
        }
        default: {
            return Fail;
        }
    }
})