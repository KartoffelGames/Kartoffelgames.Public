/**
 * Interpolate type enum.
 */
export const PgslInterpolateType = {
    Perspective: 'perspective',
    Linear: 'linear',
    Flat: 'flat'
} as const;

export type PgslInterpolateType = (typeof PgslInterpolateType)[keyof typeof PgslInterpolateType];
