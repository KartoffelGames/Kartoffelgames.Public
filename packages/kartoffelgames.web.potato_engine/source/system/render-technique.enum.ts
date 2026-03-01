/**
 * Render technique used for shader compilation.
 * Determines which shader imports and entry points are used.
 */
export enum RenderTechnique {
    Forward = 'Forward',
    Deferred = 'Deferred',
    Particle = 'Particle'
}
