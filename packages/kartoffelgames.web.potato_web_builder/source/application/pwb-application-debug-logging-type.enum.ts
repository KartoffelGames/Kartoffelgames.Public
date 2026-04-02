export const PwbApplicationDebugLoggingType = {
    None: 0,
    Component: 1,
    Module: 2,
    Extention: 4,
    All: 7
} as const;

export type PwbApplicationDebugLoggingType = typeof PwbApplicationDebugLoggingType[keyof typeof PwbApplicationDebugLoggingType];