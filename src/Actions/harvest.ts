import { createAction, Fail, InProgress, Success } from "./Action";
import { moveTo } from "./moveTo";

export const harvestFromClosestActiveSource = () => createAction('harvestFromClosestActiveSource', (creep: Creep) => {
    const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (!source) {
        return Fail;
    }
    if (creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        return Success;
    }
    switch(creep.harvest(source)) {
        case OK: {
            return InProgress;
        }
        case ERR_NOT_IN_RANGE: {
            return moveTo(source);
        }
        default: {
            return Fail;
        }
    }
});