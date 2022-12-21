import { createAction, Fail, InProgress, Success } from "./Action";
import { moveTo } from "./moveTo";

export const upgradeController = (controller: StructureController) => createAction('upgradeController', (creep: Creep) => {
    switch(creep.upgradeController(controller)) {
        case OK: {
            return InProgress;
        }
        case ERR_NOT_ENOUGH_RESOURCES: {
            return Success;
        }
        case ERR_NOT_IN_RANGE: {
            return moveTo(controller);
        }
        default: {
            return Fail;
        }
    }
});