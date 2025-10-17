/**
 * Interpolate sampling enum.
 */
export const PgslInterpolateSampling = {
    Center: 'center',
    Centroid: 'centroid',
    Sample: 'sample',
    First: 'first',
    Either: 'either'
} as const;

export type PgslInterpolateSampling = (typeof PgslInterpolateSampling)[keyof typeof PgslInterpolateSampling];
