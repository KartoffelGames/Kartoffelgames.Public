/**
 * Defines the type of component state changes. Used to determine when to update.
 */
export const ComponentStateType = {
    get: 1,
    set: 2,
    manual: 4,
} as const;

export type ComponentStateType = typeof ComponentStateType[keyof typeof ComponentStateType];