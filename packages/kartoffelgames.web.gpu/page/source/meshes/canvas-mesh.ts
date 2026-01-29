// Create attributes data.
export const CanvasVertexPositionData: Array<number> = [ // 4x Position
    -1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, -1.0, 0.0, 1.0,
    -1.0, -1.0, 0.0, 1.0,
];

export const CanvasVertexUvData: Array<number> = [ // 4x Position
    //  0, 1, 3
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0,
    // 1, 2, 3
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
];

export const CanvasVertexNormalData: Array<number> = [ // 4x Position
    // Back 1,0,3
    0, 0, -1, 0,
    0, 0, -1, 0,
    0, 0, -1, 0,

    0, 0, -1, 0,
    0, 0, -1, 0,
    0, 0, -1, 0,
];

// Create mesh.
export const CanvasVertexIndices = [
    0, 1, 3,
    1, 2, 3,
];