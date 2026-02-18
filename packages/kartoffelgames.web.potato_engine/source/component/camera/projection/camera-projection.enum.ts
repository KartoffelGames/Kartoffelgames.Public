/**
 * Camera component projection enum.
 */
export const CameraComponentProjection = {
    Perspective: 'Perspective',
    Orthographic: 'Orthographic'
} as const;
export type CameraComponentProjection = typeof CameraComponentProjection[keyof typeof CameraComponentProjection];