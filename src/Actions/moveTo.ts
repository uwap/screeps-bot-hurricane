import { createAction, Fail, InProgress } from "./Action";

export const moveTo = (pos: _HasRoomPosition | RoomPosition) => createAction('moveTo', (creep: Creep) => {
    switch(creep.moveTo(pos)) {
        case OK: {
            return InProgress;
        }
        case ERR_TIRED: {
            return InProgress;
        }
        default: {
            return Fail;
        }
    }
});