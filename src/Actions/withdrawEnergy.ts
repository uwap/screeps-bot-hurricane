import { createAction, Fail, InProgress, Success } from "./Action";
import { moveTo } from "./moveTo";

export const withdrawEnergy = (target: StructureContainer | StructureStorage | null) => createAction('transferEnergy', (creep: Creep) => {
    if (target == null) {
        return Fail;
    }
    if (target.store.getUsedCapacity(RESOURCE_ENERGY) === 0) {
        return Fail;
    }
    switch(creep.withdraw(target, RESOURCE_ENERGY)) {
        case OK: {
            return InProgress;
        }
        case ERR_FULL: {
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