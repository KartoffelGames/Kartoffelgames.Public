/**
 * Light component light type enum.
 */
export const LightComponentLightType = {
    Directional: 'Directional',
    Point: 'Point',
    Spot: 'Spot'
} as const;
export type LightComponentLightType = typeof LightComponentLightType[keyof typeof LightComponentLightType];