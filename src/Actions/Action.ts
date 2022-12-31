declare global {
    interface CreepMemory {
        state?: number
    }
}

export interface ChainableAction {
    or: (action: Action) => ChainableAction,
    and: (action: Action) => ChainableAction,
    andThen: (action: Action) => ChainableAction,
    repeat: () => void
}

export const NoOp: Action = (creep: Creep, state: number = 0) => ({
    or: () => NoOp(creep, state),
    and: () => NoOp(creep, state),
    andThen: () => NoOp(creep, state),
    repeat: () => {}
});

export const Success: Action = (creep: Creep, state: number = 0) => ({
    or: () => Success(creep, state),
    and: (action: Action) => action(creep, state),
    andThen: (action: Action) => {
        creep.memory.state = state + 1;
        return action(creep, state + 1);
    },
    repeat: () => {
        creep.memory.state = 0;
    }
});

export const InProgress: Action = (creep: Creep, state: number = 0) => ({
    or: () => InProgress(creep, state),
    and: (action: Action) => action(creep, state),
    andThen: () => NoOp(creep, state),
    repeat: () => {}
});

export const Fail: Action = (creep: Creep, state: number = 0) => ({
    or: (action: Action) => action(creep, state),
    and: () => NoOp(creep, state),
    andThen: () => NoOp(creep, state),
    repeat: () => {
        console.log('Warning: Last task in series failed for creep ' + creep.name);
    }
})

export const createAction = (name: string, action: (creep: Creep) => Action): Action => {
    return (creep: Creep, state: number = 0) => {
        if ((creep.memory.state ?? 0) > state) {
            return Success(creep, state);
        }
        return action(creep)(creep, state);
    }
}

export const runAction = (creep: Creep, action: Action): ChainableAction => action(creep);

export type Action = (creep: Creep, state?: number) => ChainableAction;