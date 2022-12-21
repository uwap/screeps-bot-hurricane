import { createAction, Fail, InProgress, Success } from "./Action";
import { moveTo } from "./moveTo";

export const buildConstructionSite = () => createAction('buildConstructionSite', (creep: Creep) => {
    const cs = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
    if (!cs) {
        return Fail;
    }
    switch (creep.build(cs)) {
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