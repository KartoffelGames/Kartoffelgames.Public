/**
 * Light component item type enum.
 */
export const LightComponentItemType = {
    Directional: 0,
    Point: 1,
    Spot: 2,
    Area: 3,
    Ambient: 4,
} as const;
export type LightComponentItemType = typeof LightComponentItemType[keyof typeof LightComponentItemType];