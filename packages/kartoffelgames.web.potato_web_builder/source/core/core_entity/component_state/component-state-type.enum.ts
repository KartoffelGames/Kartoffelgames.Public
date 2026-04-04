export const ComponentStateType = {
    Set: 1,
    Get: 2
} as const;

export type ComponentStateType = typeof ComponentStateType[keyof typeof ComponentStateType];