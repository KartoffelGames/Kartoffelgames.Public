import { expect } from '@kartoffelgames/core-test';
import { Matrix } from '../../source/math/matrix.ts';
import { Vector } from '../../source/math/vector.ts';

Deno.test('Matrix.fromArray()', async (pContext) => {
    await pContext.step('Create 2x2 matrix from column-major array', () => {
        // Setup.
        const lArray: Array<number> = [1, 3, 2, 4];

        // Process.
        const lMatrix: Matrix = Matrix.fromArray(lArray, 2, 2);

        // Evaluation. Row-major data: [[1,2],[3,4]]
        expect(lMatrix.data[0][0]).toBe(1);
        expect(lMatrix.data[0][1]).toBe(2);
        expect(lMatrix.data[1][0]).toBe(3);
        expect(lMatrix.data[1][1]).toBe(4);
    });

    await pContext.step('Create 3x3 matrix from column-major array', () => {
        // Setup.
        const lArray: Array<number> = [1, 4, 7, 2, 5, 8, 3, 6, 9];

        // Process.
        const lMatrix: Matrix = Matrix.fromArray(lArray, 3, 3);

        // Evaluation.
        expect(lMatrix.data[0]).toEqual([1, 2, 3]);
        expect(lMatrix.data[1]).toEqual([4, 5, 6]);
        expect(lMatrix.data[2]).toEqual([7, 8, 9]);
    });

    await pContext.step('Create 2x3 non-square matrix from column-major array', () => {
        // Setup. 2 rows, 3 columns. Column-major: col0=[1,4], col1=[2,5], col2=[3,6]
        const lArray: Array<number> = [1, 4, 2, 5, 3, 6];

        // Process.
        const lMatrix: Matrix = Matrix.fromArray(lArray, 2, 3);

        // Evaluation.
        expect(lMatrix.data[0]).toEqual([1, 2, 3]);
        expect(lMatrix.data[1]).toEqual([4, 5, 6]);
    });

    await pContext.step('Round-trip fromArray to dataArray', () => {
        // Setup.
        const lArray: Array<number> = [1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15, 4, 8, 12, 16];

        // Process.
        const lMatrix: Matrix = Matrix.fromArray(lArray, 4, 4);
        const lResult: Array<number> = lMatrix.dataArray;

        // Evaluation.
        expect(lResult).toEqual(lArray);
    });
});

Deno.test('Matrix.identity()', async (pContext) => {
    await pContext.step('Create 1x1 identity matrix', () => {
        // Process.
        const lMatrix: Matrix = Matrix.identity(1);

        // Evaluation.
        expect(lMatrix.dataArray).toEqual([1]);
    });

    await pContext.step('Create 2x2 identity matrix', () => {
        // Process.
        const lMatrix: Matrix = Matrix.identity(2);

        // Evaluation.
        expect(lMatrix.dataArray).toEqual([1, 0, 0, 1]);
    });

    await pContext.step('Create 3x3 identity matrix', () => {
        // Process.
        const lMatrix: Matrix = Matrix.identity(3);

        // Evaluation.
        expect(lMatrix.dataArray).toEqual([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    });

    await pContext.step('Create 4x4 identity matrix', () => {
        // Process.
        const lMatrix: Matrix = Matrix.identity(4);

        // Evaluation.
        expect(lMatrix.dataArray).toEqual([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    });
});

Deno.test('Matrix.data', async (pContext) => {
    await pContext.step('Get raw data', () => {
        // Setup.
        const lData: Array<Array<number>> = [[1, 2], [3, 4]];

        // Process.
        const lMatrix: Matrix = new Matrix(lData);

        // Evaluation.
        expect(lMatrix.data).toBe(lData);
    });
});

Deno.test('Matrix.dataArray', async (pContext) => {
    await pContext.step('Get column-major flat array from 2x2 matrix', () => {
        // Setup. Row-major: [[1,2],[3,4]] => column-major: [1,3,2,4]
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);

        // Process.
        const lResult: Array<number> = lMatrix.dataArray;

        // Evaluation.
        expect(lResult).toEqual([1, 3, 2, 4]);
    });

    await pContext.step('Get column-major flat array from 3x3 matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

        // Process.
        const lResult: Array<number> = lMatrix.dataArray;

        // Evaluation.
        expect(lResult).toEqual([1, 4, 7, 2, 5, 8, 3, 6, 9]);
    });
});

Deno.test('Matrix.height', async (pContext) => {
    await pContext.step('Get height of 2x3 matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2, 3], [4, 5, 6]]);

        // Process.
        const lResult: number = lMatrix.height;

        // Evaluation.
        expect(lResult).toBe(2);
    });

    await pContext.step('Get height of 3x2 matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4], [5, 6]]);

        // Process.
        const lResult: number = lMatrix.height;

        // Evaluation.
        expect(lResult).toBe(3);
    });
});

Deno.test('Matrix.width', async (pContext) => {
    await pContext.step('Get width of 2x3 matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2, 3], [4, 5, 6]]);

        // Process.
        const lResult: number = lMatrix.width;

        // Evaluation.
        expect(lResult).toBe(3);
    });

    await pContext.step('Get width of 3x2 matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4], [5, 6]]);

        // Process.
        const lResult: number = lMatrix.width;

        // Evaluation.
        expect(lResult).toBe(2);
    });

    await pContext.step('Get width of empty matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([]);

        // Process.
        const lResult: number = lMatrix.width;

        // Evaluation.
        expect(lResult).toBe(0);
    });
});

Deno.test('Matrix.add()', async (pContext) => {
    await pContext.step('Add scalar to matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);
        const lScalar: number = 10;

        // Process.
        const lResult: Matrix = lMatrix.add(lScalar);

        // Evaluation.
        expect(lResult.dataArray).toEqual([11, 13, 12, 14]);
    });

    await pContext.step('Add two matrices of same size', () => {
        // Setup.
        const lMatrixA: Matrix = new Matrix([[1, 2], [3, 4]]);
        const lMatrixB: Matrix = new Matrix([[5, 6], [7, 8]]);

        // Process.
        const lResult: Matrix = lMatrixA.add(lMatrixB);

        // Evaluation.
        expect(lResult.dataArray).toEqual([6, 10, 8, 12]);
    });

    await pContext.step('Add does not mutate original matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);

        // Process.
        lMatrix.add(10);

        // Evaluation.
        expect(lMatrix.dataArray).toEqual([1, 3, 2, 4]);
    });

    await pContext.step('Error: Add matrices of different sizes', () => {
        // Setup.
        const lMatrixA: Matrix = new Matrix([[1, 2], [3, 4]]);
        const lMatrixB: Matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

        // Process.
        const lFailingFunction = () => {
            lMatrixA.add(lMatrixB);
        };

        // Evaluation.
        expect(lFailingFunction).toThrow('Matrices need to be the same size for calculation.');
    });
});

Deno.test('Matrix.sub()', async (pContext) => {
    await pContext.step('Subtract scalar from matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[10, 20], [30, 40]]);
        const lScalar: number = 5;

        // Process.
        const lResult: Matrix = lMatrix.sub(lScalar);

        // Evaluation.
        expect(lResult.dataArray).toEqual([5, 25, 15, 35]);
    });

    await pContext.step('Subtract two matrices of same size', () => {
        // Setup.
        const lMatrixA: Matrix = new Matrix([[5, 6], [7, 8]]);
        const lMatrixB: Matrix = new Matrix([[1, 2], [3, 4]]);

        // Process.
        const lResult: Matrix = lMatrixA.sub(lMatrixB);

        // Evaluation.
        expect(lResult.dataArray).toEqual([4, 4, 4, 4]);
    });

    await pContext.step('Subtract does not mutate original matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[10, 20], [30, 40]]);

        // Process.
        lMatrix.sub(5);

        // Evaluation.
        expect(lMatrix.dataArray).toEqual([10, 30, 20, 40]);
    });

    await pContext.step('Error: Subtract matrices of different sizes', () => {
        // Setup.
        const lMatrixA: Matrix = new Matrix([[1, 2], [3, 4]]);
        const lMatrixB: Matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

        // Process.
        const lFailingFunction = () => {
            lMatrixA.sub(lMatrixB);
        };

        // Evaluation.
        expect(lFailingFunction).toThrow('Matrices need to be the same size for calculation.');
    });
});

Deno.test('Matrix.mult()', async (pContext) => {
    await pContext.step('Multiply matrix by scalar', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);
        const lScalar: number = 3;

        // Process.
        const lResult: Matrix = lMatrix.mult(lScalar);

        // Evaluation.
        expect(lResult.dataArray).toEqual([3, 9, 6, 12]);
    });

    await pContext.step('Multiply two 2x2 matrices', () => {
        // Setup. A=[[1,2],[3,4]], B=[[5,6],[7,8]]
        // Result: [[1*5+2*7, 1*6+2*8],[3*5+4*7, 3*6+4*8]] = [[19,22],[43,50]]
        const lMatrixA: Matrix = new Matrix([[1, 2], [3, 4]]);
        const lMatrixB: Matrix = new Matrix([[5, 6], [7, 8]]);

        // Process.
        const lResult: Matrix = lMatrixA.mult(lMatrixB);

        // Evaluation.
        expect(lResult.dataArray).toEqual([19, 43, 22, 50]);
    });

    await pContext.step('Multiply 2x3 by 3x2 matrices', () => {
        // Setup. A=[[1,2,3],[4,5,6]], B=[[7,8],[9,10],[11,12]]
        // Result: [[1*7+2*9+3*11, 1*8+2*10+3*12],[4*7+5*9+6*11, 4*8+5*10+6*12]] = [[58,64],[139,154]]
        const lMatrixA: Matrix = new Matrix([[1, 2, 3], [4, 5, 6]]);
        const lMatrixB: Matrix = new Matrix([[7, 8], [9, 10], [11, 12]]);

        // Process.
        const lResult: Matrix = lMatrixA.mult(lMatrixB);

        // Evaluation.
        expect(lResult.height).toBe(2);
        expect(lResult.width).toBe(2);
        expect(lResult.dataArray).toEqual([58, 139, 64, 154]);
    });

    await pContext.step('Multiply matrix by identity returns same matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);
        const lIdentity: Matrix = Matrix.identity(2);

        // Process.
        const lResult: Matrix = lMatrix.mult(lIdentity);

        // Evaluation.
        expect(lResult.dataArray).toEqual(lMatrix.dataArray);
    });

    await pContext.step('Multiply does not mutate original matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);

        // Process.
        lMatrix.mult(3);

        // Evaluation.
        expect(lMatrix.dataArray).toEqual([1, 3, 2, 4]);
    });

    await pContext.step('Error: Multiply matrices with incompatible dimensions', () => {
        // Setup.
        const lMatrixA: Matrix = new Matrix([[1, 2], [3, 4]]);
        const lMatrixB: Matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

        // Process.
        const lFailingFunction = () => {
            lMatrixA.mult(lMatrixB);
        };

        // Evaluation.
        expect(lFailingFunction).toThrow('Matrices A width and B height must match for multiplication.');
    });
});

Deno.test('Matrix.vectorMult()', async (pContext) => {
    await pContext.step('Multiply 2x2 matrix by 2D vector', () => {
        // Setup. [[1,2],[3,4]] * [5,6] = [1*5+2*6, 3*5+4*6] = [17, 39]
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);
        const lVector: Vector = new Vector([5, 6]);

        // Process.
        const lResult: Vector = lMatrix.vectorMult(lVector);

        // Evaluation.
        expect(lResult.data).toEqual([17, 39]);
    });

    await pContext.step('Multiply 3x3 matrix by 3D vector', () => {
        // Setup. [[1,2,3],[4,5,6],[7,8,9]] * [1,2,3] = [14, 32, 50]
        const lMatrix: Matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        const lVector: Vector = new Vector([1, 2, 3]);

        // Process.
        const lResult: Vector = lMatrix.vectorMult(lVector);

        // Evaluation.
        expect(lResult.data).toEqual([14, 32, 50]);
    });

    await pContext.step('Multiply identity matrix by vector returns same vector', () => {
        // Setup.
        const lMatrix: Matrix = Matrix.identity(3);
        const lVector: Vector = new Vector([5, 10, 15]);

        // Process.
        const lResult: Vector = lMatrix.vectorMult(lVector);

        // Evaluation.
        expect(lResult.data).toEqual([5, 10, 15]);
    });

    await pContext.step('Error: Multiply matrix with incompatible vector', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);
        const lVector: Vector = new Vector([1, 2, 3]);

        // Process.
        const lFailingFunction = () => {
            lMatrix.vectorMult(lVector);
        };

        // Evaluation.
        expect(lFailingFunction).toThrow('Matrices A width and B height must match for multiplication.');
    });
});

Deno.test('Matrix.transpose()', async (pContext) => {
    await pContext.step('Transpose 2x2 matrix', () => {
        // Setup. [[1,2],[3,4]] => [[1,3],[2,4]]
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);

        // Process.
        const lResult: Matrix = lMatrix.transpose();

        // Evaluation.
        expect(lResult.data[0]).toEqual([1, 3]);
        expect(lResult.data[1]).toEqual([2, 4]);
    });

    await pContext.step('Transpose 2x3 matrix to 3x2', () => {
        // Setup. [[1,2,3],[4,5,6]] => [[1,4],[2,5],[3,6]]
        const lMatrix: Matrix = new Matrix([[1, 2, 3], [4, 5, 6]]);

        // Process.
        const lResult: Matrix = lMatrix.transpose();

        // Evaluation.
        expect(lResult.height).toBe(3);
        expect(lResult.width).toBe(2);
        expect(lResult.data[0]).toEqual([1, 4]);
        expect(lResult.data[1]).toEqual([2, 5]);
        expect(lResult.data[2]).toEqual([3, 6]);
    });

    await pContext.step('Double transpose returns original', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2, 3], [4, 5, 6]]);

        // Process.
        const lResult: Matrix = lMatrix.transpose().transpose();

        // Evaluation.
        expect(lResult.dataArray).toEqual(lMatrix.dataArray);
    });

    await pContext.step('Transpose does not mutate original matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);

        // Process.
        lMatrix.transpose();

        // Evaluation.
        expect(lMatrix.dataArray).toEqual([1, 3, 2, 4]);
    });
});

Deno.test('Matrix.omit()', async (pContext) => {
    await pContext.step('Omit row and column from 3x3 matrix', () => {
        // Setup. Omit row 0, column 0 from [[1,2,3],[4,5,6],[7,8,9]] => [[5,6],[8,9]]
        const lMatrix: Matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

        // Process.
        const lResult: Matrix = lMatrix.omit(0, 0);

        // Evaluation.
        expect(lResult.height).toBe(2);
        expect(lResult.width).toBe(2);
        expect(lResult.data[0]).toEqual([5, 6]);
        expect(lResult.data[1]).toEqual([8, 9]);
    });

    await pContext.step('Omit middle row and column from 3x3 matrix', () => {
        // Setup. Omit row 1, column 1 from [[1,2,3],[4,5,6],[7,8,9]] => [[1,3],[7,9]]
        const lMatrix: Matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

        // Process.
        const lResult: Matrix = lMatrix.omit(1, 1);

        // Evaluation.
        expect(lResult.data[0]).toEqual([1, 3]);
        expect(lResult.data[1]).toEqual([7, 9]);
    });

    await pContext.step('Omit last row and column from 3x3 matrix', () => {
        // Setup. Omit row 2, column 2 from [[1,2,3],[4,5,6],[7,8,9]] => [[1,2],[4,5]]
        const lMatrix: Matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

        // Process.
        const lResult: Matrix = lMatrix.omit(2, 2);

        // Evaluation.
        expect(lResult.data[0]).toEqual([1, 2]);
        expect(lResult.data[1]).toEqual([4, 5]);
    });

    await pContext.step('Omit from 2x2 matrix produces 1x1', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);

        // Process.
        const lResult: Matrix = lMatrix.omit(0, 0);

        // Evaluation.
        expect(lResult.height).toBe(1);
        expect(lResult.width).toBe(1);
        expect(lResult.data[0]).toEqual([4]);
    });

    await pContext.step('Omit does not mutate original matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

        // Process.
        lMatrix.omit(0, 0);

        // Evaluation.
        expect(lMatrix.height).toBe(3);
        expect(lMatrix.width).toBe(3);
    });
});

Deno.test('Matrix.determinant()', async (pContext) => {
    await pContext.step('Determinant of 1x1 matrix', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[7]]);

        // Process.
        const lResult: number = lMatrix.determinant();

        // Evaluation.
        expect(lResult).toBe(7);
    });

    await pContext.step('Determinant of 2x2 matrix', () => {
        // Setup. det([[1,2],[3,4]]) = 1*4 - 2*3 = -2
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);

        // Process.
        const lResult: number = lMatrix.determinant();

        // Evaluation.
        expect(lResult).toBe(-2);
    });

    await pContext.step('Determinant of 3x3 matrix', () => {
        // Setup. det([[6,1,1],[4,-2,5],[2,8,7]]) = 6*(-2*7-5*8) - 1*(4*7-5*2) + 1*(4*8-(-2)*2)
        //      = 6*(-14-40) - 1*(28-10) + 1*(32+4) = 6*(-54) - 18 + 36 = -324 - 18 + 36 = -306
        const lMatrix: Matrix = new Matrix([[6, 1, 1], [4, -2, 5], [2, 8, 7]]);

        // Process.
        const lResult: number = lMatrix.determinant();

        // Evaluation.
        expect(lResult).toBe(-306);
    });

    await pContext.step('Determinant of 4x4 matrix', () => {
        // Setup.
        // [[1,2,3,4],[5,6,7,8],[2,6,4,8],[3,1,1,2]]
        // Verified determinant = 72
        const lMatrix: Matrix = new Matrix([
            [1, 2, 3, 4],
            [5, 6, 7, 8],
            [2, 6, 4, 8],
            [3, 1, 1, 2]
        ]);

        // Process.
        const lResult: number = lMatrix.determinant();

        // Evaluation.
        expect(lResult).toBe(72);
    });

    await pContext.step('Determinant of identity matrix is 1', () => {
        // Setup.
        const lMatrix: Matrix = Matrix.identity(3);

        // Process.
        const lResult: number = lMatrix.determinant();

        // Evaluation.
        expect(lResult).toBe(1);
    });

    await pContext.step('Determinant of singular matrix is 0', () => {
        // Setup. Rows are linearly dependent.
        const lMatrix: Matrix = new Matrix([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

        // Process.
        const lResult: number = lMatrix.determinant();

        // Evaluation.
        expect(lResult).toBe(0);
    });

    await pContext.step('Determinant with zero row', () => {
        // Setup. First row is all zeros.
        const lMatrix: Matrix = new Matrix([[0, 0, 0], [4, 5, 6], [7, 8, 9]]);

        // Process.
        const lResult: number = lMatrix.determinant();

        // Evaluation.
        expect(lResult).toBe(0);
    });
});

Deno.test('Matrix.adjoint()', async (pContext) => {
    await pContext.step('Adjoint of 2x2 matrix', () => {
        // Setup. adj([[1,2],[3,4]]) = [[4,-2],[-3,1]]
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);

        // Process.
        const lResult: Matrix = lMatrix.adjoint();

        // Evaluation.
        expect(lResult.data[0]).toEqual([4, -2]);
        expect(lResult.data[1]).toEqual([-3, 1]);
    });

    await pContext.step('Adjoint of 3x3 matrix', () => {
        // Setup. A=[[1,2,3],[0,4,5],[1,0,6]]
        // Cofactor matrix:
        // C(0,0) = det([[4,5],[0,6]]) = 24, C(0,1) = -det([[0,5],[1,6]]) = -(0-5)=5, C(0,2) = det([[0,4],[1,0]]) = -4
        // C(1,0) = -det([[2,3],[0,6]]) = -(12-0)=-12, C(1,1) = det([[1,3],[1,6]]) = 3, C(1,2) = -det([[1,2],[1,0]]) = -(-2)=2
        // C(2,0) = det([[2,3],[4,5]]) = -2, C(2,1) = -det([[1,3],[0,5]]) = -5, C(2,2) = det([[1,2],[0,4]]) = 4
        // Adjoint = transpose of cofactor = [[24,-12,-2],[5,3,-5],[-4,2,4]]
        const lMatrix: Matrix = new Matrix([[1, 2, 3], [0, 4, 5], [1, 0, 6]]);

        // Process.
        const lResult: Matrix = lMatrix.adjoint();

        // Evaluation.
        expect(lResult.data[0]).toEqual([24, -12, -2]);
        expect(lResult.data[1]).toEqual([5, 3, -5]);
        expect(lResult.data[2]).toEqual([-4, 2, 4]);
    });

    await pContext.step('Adjoint does not mutate original matrix', () => {
        // Setup.
        const lOriginalData: Array<number> = [1, 3, 2, 4];
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);

        // Process.
        lMatrix.adjoint();

        // Evaluation.
        expect(lMatrix.dataArray).toEqual(lOriginalData);
    });
});

Deno.test('Matrix.inverse()', async (pContext) => {
    await pContext.step('Inverse of 2x2 matrix', () => {
        // Setup. inv([[1,2],[3,4]]) = (1/-2) * [[4,-2],[-3,1]] = [[-2,1],[1.5,-0.5]]
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);

        // Process.
        const lResult: Matrix = lMatrix.inverse();

        // Evaluation.
        expect(lResult.data[0][0]).toBe(-2);
        expect(lResult.data[0][1]).toBe(1);
        expect(lResult.data[1][0]).toBe(1.5);
        expect(lResult.data[1][1]).toBe(-0.5);
    });

    await pContext.step('Inverse of 3x3 matrix', () => {
        // Setup. A=[[1,2,3],[0,4,5],[1,0,6]], det=22
        // inv = adj/det = [[24/22,-12/22,-2/22],[5/22,3/22,-5/22],[-4/22,2/22,4/22]]
        const lMatrix: Matrix = new Matrix([[1, 2, 3], [0, 4, 5], [1, 0, 6]]);

        // Process.
        const lResult: Matrix = lMatrix.inverse();

        // Evaluation.
        expect(lResult.data[0][0]).toBe(24 / 22);
        expect(lResult.data[0][1]).toBe(-12 / 22);
        expect(lResult.data[0][2]).toBe(-2 / 22);
        expect(lResult.data[1][0]).toBe(5 / 22);
        expect(lResult.data[1][1]).toBe(3 / 22);
        expect(lResult.data[1][2]).toBe(-5 / 22);
        expect(lResult.data[2][0]).toBe(-4 / 22);
        expect(lResult.data[2][1]).toBe(2 / 22);
        expect(lResult.data[2][2]).toBe(4 / 22);
    });

    await pContext.step('Matrix multiplied by its inverse equals identity', () => {
        // Setup.
        const lMatrix: Matrix = new Matrix([[1, 2], [3, 4]]);
        const lIdentity: Matrix = Matrix.identity(2);

        // Process.
        const lResult: Matrix = lMatrix.mult(lMatrix.inverse());

        // Evaluation. Use toBeCloseTo for floating point.
        for (let lRowIndex = 0; lRowIndex < 2; lRowIndex++) {
            for (let lColIndex = 0; lColIndex < 2; lColIndex++) {
                expect(lResult.data[lRowIndex][lColIndex]).toBe(lIdentity.data[lRowIndex][lColIndex]);
            }
        }
    });

    await pContext.step('Inverse of identity matrix is identity', () => {
        // Setup.
        const lMatrix: Matrix = Matrix.identity(3);

        // Process.
        const lResult: Matrix = lMatrix.inverse();

        // Evaluation.
        for (let lRowIndex = 0; lRowIndex < 3; lRowIndex++) {
            for (let lColIndex = 0; lColIndex < 3; lColIndex++) {
                // Shit has to cover -0 for some reason.
                expect(lResult.data[lRowIndex][lColIndex]).toBeCloseTo(lMatrix.data[lRowIndex][lColIndex], 0);
            }
        }
    });

    await pContext.step('Inverse of 1x1 matrix', () => {
        // Setup. inv([[5]]) = [[1/5]]
        const lMatrix: Matrix = new Matrix([[5]]);

        // Process.
        const lResult: Matrix = lMatrix.inverse();

        // Evaluation.
        expect(lResult.data[0][0]).toBe(0.2);
    });
});
