// Create attributes data.
export const CubeVertexPositionData: Array<number> = [ // 4x Position
    // Back
    -1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, -1.0, 1.0, 1.0,
    -1.0, -1.0, 1.0, 1.0,

    // Front
    -1.0, 1.0, -1.0, 1.0,
    1.0, 1.0, -1.0, 1.0,
    1.0, -1.0, -1.0, 1.0,
    -1.0, -1.0, -1.0, 1.0
];

export const CubeVertexUvData: Array<number> = [ // 4x Position
    // Front 4,5,6
    0.33333, 0.25,
    0.66666, 0.25,
    0.66666, 0.50,
    // Front 4,6,7
    0.33333, 0.25,
    0.66666, 0.50,
    0.33333, 0.50,

    // Back 1,0,3
    0.66666, 1,
    0.33333, 1,
    0.33333, 0.75,
    // Back 1,3,2
    0.66666, 1,
    0.33333, 0.75,
    0.66666, 0.75,

    // Left 0,4,7
    0, 0.25,
    0.33333, 0.25,
    0.33333, 0.50,
    // Left 0,7,3
    0, 0.25,
    0.33333, 0.50,
    0, 0.50,

    // Right 5,1,2
    0.66666, 0.25,
    1, 0.25,
    1, 0.50,
    // Right 5,2,6
    0.66666, 0.25,
    1, 0.50,
    0.66666, 0.50,

    // Top 0,1,5
    0.33333, 0,
    0.66666, 0,
    0.66666, 0.25,
    // Top 0,5,4
    0.33333, 0,
    0.66666, 0.25,
    0.33333, 0.25,

    // Bottom 7,6,2
    0.33333, 0.50,
    0.66666, 0.50,
    0.66666, 0.75,
    // Bottom 7,2,3
    0.33333, 0.50,
    0.66666, 0.75,
    0.33333, 0.75,
];

export const CubeVertexNormalData: Array<number> = [ // 4x Position
    // Front
    0, 0, -1, 0,
    0, 0, -1, 0,
    0, 0, -1, 0,
    0, 0, -1, 0,
    0, 0, -1, 0,
    0, 0, -1, 0,

    // Back 1,0,3
    0, 0, 1, 0,
    0, 0, 1, 0,
    0, 0, 1, 0,
    0, 0, 1, 0,
    0, 0, 1, 0,
    0, 0, 1, 0,

    // Left 0,4,7
    -1, 0, 0, 0,
    -1, 0, 0, 0,
    -1, 0, 0, 0,
    -1, 0, 0, 0,
    -1, 0, 0, 0,
    -1, 0, 0, 0,

    // Right 5,1,2
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 0, 0, 0,
    1, 0, 0, 0,

    // Top 0,1,5
    0, 1, 0, 0,
    0, 1, 0, 0,
    0, 1, 0, 0,
    0, 1, 0, 0,
    0, 1, 0, 0,
    0, 1, 0, 0,

    // Bottom 7,6,2
    0, -1, 0, 0,
    0, -1, 0, 0,
    0, -1, 0, 0,
    0, -1, 0, 0,
    0, -1, 0, 0,
    0, -1, 0, 0,
];

// Create mesh.
export const CubeVertexIndices = [
    // Front
    4, 5, 6,
    4, 6, 7,
    // Back
    1, 0, 3,
    1, 3, 2,
    // Left
    0, 4, 7,
    0, 7, 3,
    // Right
    5, 1, 2,
    5, 2, 6,
    // Top
    0, 1, 5,
    0, 5, 4,
    // Bottom
    7, 6, 2,
    7, 2, 3
];