import { createAction, Fail, InProgress, Success } from "./Action";
import { moveTo } from "./moveTo";

export const transferEnergy = (target: Creep | StructureSpawn | StructureContainer | StructureExtension | StructureStorage | null) => createAction('transferEnergy', (creep: Creep) => {
    if (target == null) {
        return Fail;
    }
    if (target.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
        return Fail;
    }
    switch(creep.transfer(target, RESOURCE_ENERGY)) {
        case OK: {
            return InProgress;
        }
        case ERR_NOT_ENOUGH_RESOURCES: {
            return Success;
        }
        case ERR_NOT_IN_RANGE: {
            return moveTo(target);
        }
        default: {
            return Fail;
        }
    }
});