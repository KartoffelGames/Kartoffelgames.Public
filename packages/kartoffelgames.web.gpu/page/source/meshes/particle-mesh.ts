// Create attributes data.
export const ParticleVertexPositionUvData: Array<number> = [ // 4x Position, 2x uv
    // 1
    -1.0, 0.5, 0.0, 1.0,/* UV */ 0.0, 0.0,
    0.0, -0.5, 0.0, 1.0,/* UV */ 0.5, 1.0,
    - 1.0, -0.5, -0.6, 1.0,/* UV */ 0.0, 1.0,

    // 2
    - 1.0, 0.5, 0.0, 1.0,/* UV */ 0.0, 0.0,
    0.0, 0.5, 0.0, 1.0,/* UV */ 0.5, 0.0,
    0.0, -0.5, 0.0, 1.0,/* UV */ 0.5, 1.0,

    // 3
    0.0, 0.5, 0.0, 1.0,/* UV */ 0.5, 0.0,
    1.0, -0.5, -0.6, 1.0,/* UV */ 1.0, 1.0,
    0.0, -0.5, 0.0, 1.0,/* UV */ 0.5, 1.0,

    // 4
    0.0, 0.5, 0.0, 1.0,/* UV */ 0.5, 0.0,
    1.0, 0.5, -1.2, 1.0,/* UV */ 1.0, 0.0,
    1.0, -0.5, -0.6, 1.0,/* UV */ 1.0, 1.0,
];

// Create mesh.
export const ParticleVertexIndices = [
    0, 1, 2,
    3, 4, 5,
    6, 7, 8,
    9, 10, 11
];