var Page;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./page/source/cube/cube.ts":
/*!**********************************!*\
  !*** ./page/source/cube/cube.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CubeVertexIndices = exports.CubeVertexNormalData = exports.CubeVertexUvData = exports.CubeVertexPositionData = void 0;
// Create attributes data.
exports.CubeVertexPositionData = [
// Back
-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
// Front
-1.0, 1.0, -1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0];
exports.CubeVertexUvData = [
// Front 4,5,6
0.33333, 0.25, 0.66666, 0.25, 0.66666, 0.50,
// Front 4,6,7
0.33333, 0.25, 0.66666, 0.50, 0.33333, 0.50,
// Back 1,0,3
0.66666, 1, 0.33333, 1, 0.33333, 0.75,
// Back 1,3,2
0.66666, 1, 0.33333, 0.75, 0.66666, 0.75,
// Left 0,4,7
0, 0.25, 0.33333, 0.25, 0.33333, 0.50,
// Left 0,7,3
0, 0.25, 0.33333, 0.50, 0, 0.50,
// Right 5,1,2
0.66666, 0.25, 1, 0.25, 1, 0.50,
// Right 5,2,6
0.66666, 0.25, 1, 0.50, 0.66666, 0.50,
// Top 0,1,5
0.33333, 0, 0.66666, 0, 0.66666, 0.25,
// Top 0,5,4
0.33333, 0, 0.66666, 0.25, 0.33333, 0.25,
// Bottom 7,6,2
0.33333, 0.50, 0.66666, 0.50, 0.66666, 0.75,
// Bottom 7,2,3
0.33333, 0.50, 0.66666, 0.75, 0.33333, 0.75];
exports.CubeVertexNormalData = [
// Front
0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0,
// Back 1,0,3
0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0,
// Left 0,4,7
-1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0,
// Right 5,1,2
1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0,
// Top 0,1,5
0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0,
// Bottom 7,6,2
0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0];
// Create mesh.
exports.CubeVertexIndices = [
// Front
4, 5, 6, 4, 6, 7,
// Back
1, 0, 3, 1, 3, 2,
// Left
0, 4, 7, 0, 7, 3,
// Right
5, 1, 2, 5, 2, 6,
// Top
0, 1, 5, 0, 5, 4,
// Bottom
7, 6, 2, 7, 2, 3];

/***/ }),

/***/ "./page/source/math/euler.ts":
/*!***********************************!*\
  !*** ./page/source/math/euler.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Euler = void 0;
class Euler {
  /**
   * X axis degree.
   */
  get x() {
    return this.mX;
  }
  set x(pValue) {
    this.mX = pValue;
  }
  /**
   * Y axis degree.
   */
  get y() {
    return this.mY;
  }
  set y(pValue) {
    this.mY = pValue;
  }
  /**
   * Z axis degree.
   */
  get z() {
    return this.mZ;
  }
  set z(pValue) {
    this.mZ = pValue;
  }
  /**
   * Constructor.
   */
  constructor() {
    this.mX = 0;
    this.mY = 0;
    this.mZ = 0;
  }
}
exports.Euler = Euler;

/***/ }),

/***/ "./page/source/math/matrix.ts":
/*!************************************!*\
  !*** ./page/source/math/matrix.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Matrix = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const vector_1 = __webpack_require__(/*! ./vector */ "./page/source/math/vector.ts");
class Matrix {
  /**
   * Create matrix from data array.
   * Direction from reading columns than rows.
   * @param pArray - Array data.
   * @param pHeight
   * @param pWidth
   * @returns
   */
  static fromArray(pArray, pHeight, pWidth) {
    const lData = new Array();
    for (let lRowIndex = 0; lRowIndex < pHeight; lRowIndex++) {
      const lRowData = new Array(pWidth);
      for (let lColumnIndex = 0; lColumnIndex < pWidth; lColumnIndex++) {
        lRowData[lColumnIndex] = pArray[lColumnIndex * pHeight + lRowIndex];
      }
      // Add row to data array.
      lData.push(lRowData);
    }
    return new Matrix(lData);
  }
  /**
   * Create identity matrix.
   * @param pSize - Matix size: nxn
   * @param pValue - Value of identity.
   */
  static identity(pSize) {
    const lData = new Array();
    for (let lRowIndex = 0; lRowIndex < pSize; lRowIndex++) {
      // Create Array filled with zeros.
      const lRowData = new Array(pSize).fill(0);
      // Set identity column to value.
      lRowData[lRowIndex] = 1;
      // Add row to data array.
      lData.push(lRowData);
    }
    return new Matrix(lData);
  }
  /**
   * Get matix raw data.
   */
  get data() {
    return this.mData;
  }
  /**
   * Data as number array.
   */
  get dataArray() {
    const lData = new Array();
    // Read from columns to rows.
    for (let lColumnIndex = 0; lColumnIndex < this.width; lColumnIndex++) {
      for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
        lData.push(this.mData[lRowIndex][lColumnIndex]);
      }
    }
    return lData;
  }
  /**
   * Get matrix height.
   */
  get height() {
    return this.mData.length;
  }
  /**
   * Get matrix width.
   */
  get width() {
    return this.mData[0]?.length ?? 0;
  }
  /**
   * Constructor.
   * @param pData - Matrix data.
   */
  constructor(pData) {
    this.mData = pData;
  }
  /**
   * Add value to matrix.
   * @param pAddData - Matrix or scalar value.
   */
  add(pAddData) {
    const lData = new Array();
    if (pAddData instanceof Matrix) {
      // Restrict on same length.
      if (this.height !== pAddData.height && this.width !== pAddData.width) {
        throw new core_data_1.Exception('Matrices need to be the same size for calculation.', this);
      }
      // Iterate rows and extend data dynamicly by pushing new data rows.
      for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
        // Add each column of row.
        const lRowData = new Array(this.width);
        for (let lColumnIndex = 0; lColumnIndex < lRowData.length; lColumnIndex++) {
          lRowData[lColumnIndex] = this.mData[lRowIndex][lColumnIndex] + pAddData.data[lRowIndex][lColumnIndex];
        }
        lData.push(lRowData);
      }
    } else {
      // Add scalar to each matrix component.
      for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
        const lRowData = new Array(this.width);
        for (let lColumnIndex = 0; lColumnIndex < lRowData.length; lColumnIndex++) {
          lRowData[lColumnIndex] = this.mData[lRowIndex][lColumnIndex] + pAddData;
        }
        lData.push(lRowData);
      }
    }
    return new Matrix(lData);
  }
  /**
   * Adjoint matrix.
   */
  adjoint() {
    const lMatrixData = new Array();
    // Allways use first row and iterate over columns.
    for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
      const lMatrixRow = new Array();
      for (let lColumIndex = 0; lColumIndex < this.width; lColumIndex++) {
        // Calculate determant of matrix with omitted column and row.
        // Toggle sign on each new row or column.
        let lDeterminant = this.omit(lRowIndex, lColumIndex).determinant();
        lDeterminant *= Math.pow(-1, lRowIndex + 1 + (lColumIndex + 1));
        lMatrixRow.push(lDeterminant);
      }
      // Add row to matrix data.
      lMatrixData.push(lMatrixRow);
    }
    // Calculate transpose from cofactor matrix to get adjoint. 
    const lCofactorMatrix = new Matrix(lMatrixData);
    return lCofactorMatrix.transpose();
  }
  /**
   * Calculate determant of matrix.
   */
  determinant() {
    // Super fast determinant calculation of a 1x1 matrix.
    if (this.height === 1 && this.width === 1) {
      return this.data[0][0];
    }
    let lDeterminant = 0;
    for (let lIterationIndex = 0; lIterationIndex < this.width; lIterationIndex++) {
      // Get number of row iteration to detect if any calculation musst be done.
      let lSignedNumber = this.data[0][lIterationIndex];
      lSignedNumber *= lIterationIndex % 2 ? -1 : 1; // Toggle sign between iteration. Begin with plus.
      // Check if any calculation needs to be done. Zero multiplicated is allways zero.
      if (lSignedNumber !== 0) {
        // Calculate determinant of new matrix. Allways use first row.
        const lDeterminantMatrix = this.omit(0, lIterationIndex);
        lDeterminant += lSignedNumber * lDeterminantMatrix.determinant();
      }
    }
    return lDeterminant;
  }
  /**
   * Inverse matrix.
   */
  inverse() {
    const lAdjoint = this.adjoint();
    const lDeterminant = this.determinant();
    // Devide each adjoint matrix component by determinant.
    for (let lColumIndex = 0; lColumIndex < this.width; lColumIndex++) {
      for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
        lAdjoint.data[lRowIndex][lColumIndex] /= lDeterminant;
      }
    }
    return lAdjoint;
  }
  /**
   * Multiplicate matrix.
   * @param pMultData - Matrix or scalar value.
   */
  mult(pMultData) {
    const lData = new Array();
    if (pMultData instanceof Matrix) {
      // Restrict on same length.
      if (this.width !== pMultData.height) {
        throw new core_data_1.Exception('Matrices A width and B height must match for multiplication.', this);
      }
      // Iterate rows and extend data dynamicly by pushing new data rows.
      for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
        // Add each column of row.
        const lRowData = new Array(pMultData.width);
        for (let lColumnIndex = 0; lColumnIndex < lRowData.length; lColumnIndex++) {
          // Multiplicate target row with source column components.
          // Iteration length is eighter target.height or source.width.
          let lProduct = 0;
          for (let lComponentIndex = 0; lComponentIndex < this.height; lComponentIndex++) {
            lProduct += this.mData[lRowIndex][lComponentIndex] * pMultData.data[lComponentIndex][lColumnIndex];
          }
          lRowData[lColumnIndex] = lProduct;
        }
        lData.push(lRowData);
      }
    } else {
      // Multiplicate scalar to each matrix component.
      for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
        const lRowData = new Array(this.width);
        for (let lColumnIndex = 0; lColumnIndex < this.width; lColumnIndex++) {
          lRowData[lColumnIndex] = this.mData[lRowIndex][lColumnIndex] * pMultData;
        }
        lData.push(lRowData);
      }
    }
    return new Matrix(lData);
  }
  /**
   * Omit row and column from matrix.
   * @param pOmitRow - Omitting row.
   * @param pOmitColumn - Omiting column
   */
  omit(pOmitRow, pOmitColumn) {
    const lMatrixData = new Array();
    // Allways use first row and iterate over columns.
    for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
      if (lRowIndex !== pOmitRow) {
        const lMatrixRow = new Array();
        for (let lColumIndex = 0; lColumIndex < this.width; lColumIndex++) {
          // Skip column of
          if (lColumIndex !== pOmitColumn) {
            lMatrixRow.push(this.data[lRowIndex][lColumIndex]);
          }
        }
        // Add row to matrix data.
        lMatrixData.push(lMatrixRow);
      }
    }
    return new Matrix(lMatrixData);
  }
  /**
   * Substract value to matrix.
   * @param pAddData - Matrix or scalar value.
   */
  sub(pAddData) {
    const lData = new Array();
    if (pAddData instanceof Matrix) {
      // Restrict on same length.
      if (this.height !== pAddData.height && this.width !== pAddData.width) {
        throw new core_data_1.Exception('Matrices need to be the same size for calculation.', this);
      }
      // Iterate rows and extend data dynamicly by pushing new data rows.
      for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
        // Add each column of row.
        const lRowData = new Array(this.width);
        for (let lColumnIndex = 0; lColumnIndex < lRowData.length; lColumnIndex++) {
          lRowData[lColumnIndex] = this.mData[lRowIndex][lColumnIndex] - pAddData.data[lRowIndex][lColumnIndex];
        }
        lData.push(lRowData);
      }
    } else {
      // Add scalar to each matrix component.
      for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
        const lRowData = new Array(this.width);
        for (let lColumnIndex = 0; lColumnIndex < lRowData.length; lColumnIndex++) {
          lRowData[lColumnIndex] = this.mData[lRowIndex][lColumnIndex] - pAddData;
        }
        lData.push(lRowData);
      }
    }
    return new Matrix(lData);
  }
  /**
   * Transpose matrix.
   */
  transpose() {
    const lMatrixData = new Array();
    // Transpose by copying column into row.
    for (let lColumIndex = 0; lColumIndex < this.width; lColumIndex++) {
      const lMatrixRow = new Array();
      for (let lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
        lMatrixRow.push(this.data[lRowIndex][lColumIndex]);
      }
      // Add row to matrix data.
      lMatrixData.push(lMatrixRow);
    }
    return new Matrix(lMatrixData);
  }
  /**
   * Multiplicate matrix with vector.
   * @param pMultData - Vector.
   * @returns
   */
  vectorMult(pMultData) {
    // Restrict on same length.
    if (this.width !== pMultData.data.length) {
      throw new core_data_1.Exception('Matrices A width and B height must match for multiplication.', this);
    }
    // Convert vector to matrix by creating a 
    const lMatrixData = new Array();
    for (const lVectorComponent of pMultData.data) {
      lMatrixData.push([lVectorComponent]);
    }
    // Multiplicate
    const lMutiplicatedMatrix = this.mult(new Matrix(lMatrixData));
    const lVectorData = new Array();
    for (let lRowIndex = 0; lRowIndex < lMutiplicatedMatrix.height; lRowIndex++) {
      lVectorData.push(lMutiplicatedMatrix.data[lRowIndex][0]);
    }
    return new vector_1.Vector(lVectorData);
  }
}
exports.Matrix = Matrix;

/***/ }),

/***/ "./page/source/math/quaternion.ts":
/*!****************************************!*\
  !*** ./page/source/math/quaternion.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Quaternion = void 0;
const euler_1 = __webpack_require__(/*! ./euler */ "./page/source/math/euler.ts");
const matrix_1 = __webpack_require__(/*! ./matrix */ "./page/source/math/matrix.ts");
const vector_1 = __webpack_require__(/*! ./vector */ "./page/source/math/vector.ts");
class Quaternion {
  /**
   * Create new quaternion from degree rotation.
   * Rotate order XYZ (Pitch, Yaw, Roll)
   * @param pPitch - Pitch degree.
   * @param pYaw - Yaw degree.
   * @param pRoll - Roll degree.
   */
  static fromRotation(pPitch, pYaw, pRoll) {
    // Conversion to radian.
    const lPitchRadian = pPitch % 360 * Math.PI / 180;
    const lYawRadian = pYaw % 360 * Math.PI / 180;
    const lRollRadian = pRoll % 360 * Math.PI / 180;
    // Pre calculate.
    const lCosPitch = Math.cos(lPitchRadian * 0.5);
    const lSinPitch = Math.sin(lPitchRadian * 0.5);
    const lCosYaw = Math.cos(lYawRadian * 0.5);
    const lSinYaw = Math.sin(lYawRadian * 0.5);
    const lCosRoll = Math.cos(lRollRadian * 0.5);
    const lSinRoll = Math.sin(lRollRadian * 0.5);
    // Create quaternion.
    const lQuaternion = Quaternion.identity();
    lQuaternion.w = lCosPitch * lCosYaw * lCosRoll + lSinPitch * lSinYaw * lSinRoll;
    lQuaternion.x = lSinPitch * lCosYaw * lCosRoll - lCosPitch * lSinYaw * lSinRoll;
    lQuaternion.y = lCosPitch * lSinYaw * lCosRoll + lSinPitch * lCosYaw * lSinRoll;
    lQuaternion.z = lCosPitch * lCosYaw * lSinRoll - lSinPitch * lSinYaw * lCosRoll;
    return lQuaternion;
  }
  /**
   * Create identity quaternion.
   */
  static identity() {
    return new Quaternion(1, 0, 0, 0);
  }
  /**
   * Rotation forward vector.
   */
  get vectorForward() {
    // Products.
    const lSquareX = 2 * Math.pow(this.mX, 2);
    const lSquareY = 2 * Math.pow(this.mY, 2);
    const lProductXz = 2 * this.mX * this.mZ;
    const lProductYw = 2 * this.mY * this.mW;
    const lProductYz = 2 * this.mY * this.mZ;
    const lProductXw = 2 * this.mX * this.mW;
    const lX = lProductXz + lProductYw;
    const lY = lProductYz - lProductXw;
    const lZ = 1 - lSquareX - lSquareY;
    return new vector_1.Vector([lX, lY, lZ]);
  }
  /**
   * Rotation vector right.
   */
  get vectorRight() {
    // Products.
    const lSquareY = 2 * Math.pow(this.mY, 2);
    const lSquareZ = 2 * Math.pow(this.mZ, 2);
    const lProductXy = 2 * this.mX * this.mY;
    const lProductZw = 2 * this.mZ * this.mW;
    const lProductYz = 2 * this.mY * this.mZ;
    const lProductXw = 2 * this.mX * this.mW;
    const lX = 1 - lSquareY - lSquareZ;
    const lY = lProductXy + lProductZw;
    const lZ = lProductYz + lProductXw;
    return new vector_1.Vector([lX, lY, lZ]);
  }
  /**
   * Rotation up vector.
   */
  get vectorUp() {
    // Products.
    const lSquareX = 2 * Math.pow(this.mX, 2);
    const lSquareZ = 2 * Math.pow(this.mZ, 2);
    const lProductXy = 2 * this.mX * this.mY;
    const lProductZw = 2 * this.mZ * this.mW;
    const lProductYz = 2 * this.mY * this.mZ;
    const lProductXw = 2 * this.mX * this.mW;
    const lX = lProductXy - lProductZw;
    const lY = 1 - lSquareX - lSquareZ;
    const lZ = lProductYz + lProductXw;
    return new vector_1.Vector([lX, lY, lZ]);
  }
  /**
   * Get w value.
   */
  get w() {
    return this.mW;
  }
  set w(pValue) {
    this.mW = pValue;
  }
  /**
   * Get x value.
   */
  get x() {
    return this.mX;
  }
  set x(pValue) {
    this.mX = pValue;
  }
  /**
   * Get y value.
   */
  get y() {
    return this.mY;
  }
  set y(pValue) {
    this.mY = pValue;
  }
  /**
   * Get z value.
   */
  get z() {
    return this.mZ;
  }
  set z(pValue) {
    this.mZ = pValue;
  }
  /**
   * Constructor.
   * @param pW - W.
   * @param pX - X.
   * @param pY - Y.
   * @param pZ - Z.
   */
  constructor(pW, pX, pY, pZ) {
    this.mX = pX;
    this.mY = pY;
    this.mZ = pZ;
    this.mW = pW;
  }
  /**
   * Add angles to current euler rotation.
   * @param pPitch - Pitch degree.
   * @param pYaw - Yaw degree.
   * @param pRoll - Roll degree.
   */
  addEulerRotation(pPitch, pYaw, pRoll) {
    // Apply current rotation after setting new rotation to apply rotation as absolute euler rotation and not as relative quaternion.
    return this.mult(Quaternion.fromRotation(pPitch, pYaw, pRoll));
  }
  /**
   * Quaternion rotation as euler rotation
   */
  asEuler() {
    const lEuler = new euler_1.Euler();
    // Pitch (x-axis rotation)
    const lSinPitchCosYaw = 2 * (this.mW * this.mX + this.mY * this.mZ);
    const lCosPitchCosYaw = 1 - 2 * (this.mX * this.mX + this.mY * this.mY);
    const lPitchRadian = Math.atan2(lSinPitchCosYaw, lCosPitchCosYaw);
    const lPitchDegree = lPitchRadian * 180 / Math.PI % 360;
    lEuler.x = lPitchDegree < 0 ? lPitchDegree + 360 : lPitchDegree;
    // Yaw (y-axis rotation)
    const lSinYaw = Math.sqrt(1 + 2 * (this.mW * this.mY - this.mX * this.mZ));
    const lCosYaw = Math.sqrt(1 - 2 * (this.mW * this.mY - this.mX * this.mZ));
    const lYawRadian = 2 * Math.atan2(lSinYaw, lCosYaw) - Math.PI / 2;
    const lYawDegree = lYawRadian * 180 / Math.PI % 360;
    lEuler.y = lYawDegree < 0 ? lYawDegree + 360 : lYawDegree;
    // Roll (z-axis rotation)
    const lSinRollCosYaw = 2 * (this.mW * this.mZ + this.mX * this.mY);
    const lCosRollCosYaw = 1 - 2 * (this.mY * this.mY + this.mZ * this.mZ);
    const lRollRadian = Math.atan2(lSinRollCosYaw, lCosRollCosYaw);
    const lRollDegree = lRollRadian * 180 / Math.PI % 360;
    lEuler.z = lRollDegree < 0 ? lRollDegree + 360 : lRollDegree;
    return lEuler;
  }
  /**
   * Convert quaternion to a 4x4 rotation matrix.
   */
  asMatrix() {
    /*
        1 - 2*qy² - 2*qz²	2*qx*qy - 2*qz*qw	2*qx*qz + 2*qy*qw
        2*qx*qy + 2*qz*qw	1 - 2*qx² - 2*qz²	2*qy*qz - 2*qx*qw
        2*qx*qz - 2*qy*qw	2*qy*qz + 2*qx*qw	1 - 2*qx² - 2*qy²
    */
    // Sqares
    const lSquareX = 2 * Math.pow(this.mX, 2);
    const lSquareY = 2 * Math.pow(this.mY, 2);
    const lSquareZ = 2 * Math.pow(this.mZ, 2);
    // Products.
    const lProductXy = 2 * this.mX * this.mY;
    const lProductZw = 2 * this.mZ * this.mW;
    const lProductXz = 2 * this.mX * this.mZ;
    const lProductYw = 2 * this.mY * this.mW;
    const lProductYz = 2 * this.mY * this.mZ;
    const lProductXw = 2 * this.mX * this.mW;
    // Fill matrix
    const lMatrix = matrix_1.Matrix.identity(4);
    lMatrix.data[0][0] = 1 - lSquareY - lSquareZ;
    lMatrix.data[0][1] = lProductXy - lProductZw;
    lMatrix.data[0][2] = lProductXz + lProductYw;
    lMatrix.data[1][0] = lProductXy + lProductZw;
    lMatrix.data[1][1] = 1 - lSquareX - lSquareZ;
    lMatrix.data[1][2] = lProductYz - lProductXw;
    lMatrix.data[2][0] = lProductXz - lProductYw;
    lMatrix.data[2][1] = lProductYz + lProductXw;
    lMatrix.data[2][2] = 1 - lSquareX - lSquareY;
    return lMatrix;
  }
  /**
   * Multiplicate with quaternion.
   * @param pQuaternion - Quaterion source.
   */
  mult(pQuaternion) {
    const lW = this.mW * pQuaternion.w - this.mX * pQuaternion.x - this.mY * pQuaternion.y - this.mZ * pQuaternion.z;
    const lX = this.mW * pQuaternion.x + this.mX * pQuaternion.w + this.mY * pQuaternion.z - this.mZ * pQuaternion.y;
    const lY = this.mW * pQuaternion.y - this.mX * pQuaternion.z + this.mY * pQuaternion.w + this.mZ * pQuaternion.x;
    const lZ = this.mW * pQuaternion.z + this.mX * pQuaternion.y - this.mY * pQuaternion.x + this.mZ * pQuaternion.w;
    return new Quaternion(lW, lX, lY, lZ);
  }
  /**
   * Normalize quaternion.
   */
  normalize() {
    // Calculate length.
    const lLength = Math.hypot(Math.pow(this.mW, 2), Math.pow(this.mX, 2), Math.pow(this.mY, 2), Math.pow(this.mZ, 2));
    // Create new quaternion by dividing each dimension by length.
    return new Quaternion(this.mW / lLength, this.mX / lLength, this.mY / lLength, this.mZ / lLength);
  }
}
exports.Quaternion = Quaternion;

/***/ }),

/***/ "./page/source/math/vector.ts":
/*!************************************!*\
  !*** ./page/source/math/vector.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Vector = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
class Vector {
  /**
   * Get vector data.
   */
  get data() {
    return this.mData;
  }
  /**
   * W value quick access.
   */
  get w() {
    return this.mData[3];
  }
  /**
   * X value quick access.
   */
  get x() {
    return this.mData[0];
  }
  /**
   * Y value quick access.
   */
  get y() {
    return this.mData[1];
  }
  /**
   * Z value quick access.
   */
  get z() {
    return this.mData[2];
  }
  /**
   * Constructor.
   * @param pData - Vector data.
   */
  constructor(pData) {
    this.mData = [...pData];
  }
  /**
   * Add two vectors.
   * @param pAddData - Vector or scalar.
   */
  add(pAddData) {
    const lData = new Array();
    if (pAddData instanceof Vector) {
      // Restrict on same length.
      if (this.mData.length !== pAddData.data.length) {
        throw new core_data_1.Exception('Vectors need to be the same length for calculation.', this);
      }
      // Add values.
      for (let lIndex = 0; lIndex < this.mData.length; lIndex++) {
        lData.push(this.mData[lIndex] + pAddData.data[lIndex]);
      }
    } else {
      // Add scalar to each vector component.
      for (const lItem of this.mData) {
        lData.push(lItem + pAddData);
      }
    }
    return new Vector(lData);
  }
  /**
   * Get length of vector.
   */
  length() {
    // Square root sum.
    return Math.hypot(...this.mData);
  }
  /**
   * Calulate cross product of two vector3.
   * @param pVector - Vector3.
   */
  multCross(pVector) {
    // Restrict on same length.
    if (this.mData.length !== pVector.data.length && this.mData.length !== 3) {
      throw new core_data_1.Exception('Vectors need to be the length of 3 for corss product calculation.', this);
    }
    /*
     * cx = ay*bz − az*by
     * cy = az*bx − ax*bz
     * cz = ax*by − ay*bx
     */
    return new Vector([this.mData[1] * pVector.data[2] - this.mData[2] * pVector.data[1], this.mData[2] * pVector.data[0] - this.mData[0] * pVector.data[2], this.mData[0] * pVector.data[1] - this.mData[1] * pVector.data[0]]);
  }
  /**
   * Multiply with dot procedure.
   * @param pVector - Vector.
   */
  multDot(pVector) {
    // Restrict on same length.
    if (this.mData.length !== pVector.data.length) {
      throw new core_data_1.Exception('Vectors need to be the same length for calculation.', this);
    }
    // Calculate dot product.
    let lProduct = 0;
    for (let lIndex = 0; lIndex < this.mData.length; lIndex++) {
      lProduct += this.mData[lIndex] * pVector.data[lIndex];
    }
    return lProduct;
  }
  /**
   * Normalize vector.
   */
  normalize() {
    const lLength = this.length();
    // Devide each vector component with it vector length.
    const lData = new Array();
    for (const lItem of this.mData) {
      lData.push(lItem / lLength);
    }
    return new Vector(lData);
  }
  /**
   * Substract two vectors.
   * @param pSubData - Vector or scalar
   */
  sub(pSubData) {
    const lData = new Array();
    if (pSubData instanceof Vector) {
      // Restrict on same length.
      if (this.mData.length !== pSubData.data.length) {
        throw new core_data_1.Exception('Vectors need to be the same length for calculation.', this);
      }
      // Add values.
      for (let lIndex = 0; lIndex < this.mData.length; lIndex++) {
        lData.push(this.mData[lIndex] - pSubData.data[lIndex]);
      }
    } else {
      // Substract scalar to each vector component.
      for (const lItem of this.mData) {
        lData.push(lItem - pSubData);
      }
    }
    return new Vector(lData);
  }
}
exports.Vector = Vector;

/***/ }),

/***/ "./page/source/something_better/light/ambient-light.ts":
/*!*************************************************************!*\
  !*** ./page/source/something_better/light/ambient-light.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AmbientLight = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const vector_1 = __webpack_require__(/*! ../../math/vector */ "./page/source/math/vector.ts");
class AmbientLight {
  /**
   * Ambient light Vector4 data.
   */
  get data() {
    return this.mColor.data;
  }
  /**
   * Constructor.
   */
  constructor() {
    this.mColor = new vector_1.Vector([1, 1, 1, 1]);
  }
  /**
   * Set ambient light color.
   * @param pRed - Red.
   * @param pGreen - Green.
   * @param pBlue - Blue.
   */
  setColor(pRed, pGreen, pBlue) {
    if (pRed > 1 || pRed < 0 || pGreen > 1 || pGreen < 0 || pBlue > 1 || pBlue < 0) {
      throw new core_data_1.Exception(`Color values need to be in 0 to 1 range. (R:${pRed}, G:${pGreen}, B:${pBlue})`, this);
    }
    this.mColor.data[0] = pRed;
    this.mColor.data[1] = pGreen;
    this.mColor.data[2] = pBlue;
  }
}
exports.AmbientLight = AmbientLight;

/***/ }),

/***/ "./page/source/something_better/transform.ts":
/*!***************************************************!*\
  !*** ./page/source/something_better/transform.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TransformMatrix = exports.Transform = void 0;
const matrix_1 = __webpack_require__(/*! ../math/matrix */ "./page/source/math/matrix.ts");
const quaternion_1 = __webpack_require__(/*! ../math/quaternion */ "./page/source/math/quaternion.ts");
const vector_1 = __webpack_require__(/*! ../math/vector */ "./page/source/math/vector.ts");
class Transform {
  /**
   * X pivot point.
   */
  get pivotX() {
    return this.mPivot.data[0][3];
  }
  set pivotX(pValue) {
    this.mPivot.data[0][3] = pValue;
  }
  /**
   * Y pivot point.
   */
  get pivotY() {
    return this.mPivot.data[1][3];
  }
  set pivotY(pValue) {
    this.mPivot.data[1][3] = pValue;
  }
  /**
   * Z pivot point.
   */
  get pivotZ() {
    return this.mPivot.data[2][3];
  }
  set pivotZ(pValue) {
    this.mPivot.data[2][3] = pValue;
  }
  /**
   * Rotation on X angle.
   * Pitch.
   */
  get rotationPitch() {
    return this.mRotation.asEuler().x;
  }
  /**
   * Rotation on Z angle.
   * Roll.
   */
  get rotationRoll() {
    return this.mRotation.asEuler().z;
  }
  /**
   * Rotation on Y angle.
   * Yaw.
   */
  get rotationYaw() {
    return this.mRotation.asEuler().y;
  }
  /**
   * Depth scale.
   */
  get scaleDepth() {
    return this.mScale.data[2][2];
  }
  /**
   * Height scale.
   */
  get scaleHeight() {
    return this.mScale.data[1][1];
  }
  /**
   * Width scale.
   */
  get scaleWidth() {
    return this.mScale.data[0][0];
  }
  /**
   * X translation.
   */
  get translationX() {
    return this.mTranslation.data[0][3];
  }
  /**
   * Y translation.
   */
  get translationY() {
    return this.mTranslation.data[1][3];
  }
  /**
   * Z translation.
   */
  get translationZ() {
    return this.mTranslation.data[2][3];
  }
  /**
   * Constructor.
   */
  constructor() {
    this.mScale = matrix_1.Matrix.identity(4);
    this.mTranslation = matrix_1.Matrix.identity(4);
    this.mRotation = new quaternion_1.Quaternion(1, 0, 0, 0);
    this.mPivot = matrix_1.Matrix.identity(4);
  }
  /**
   * Add angles to current euler rotation angles.
   * @param pPitch - Pitch degree.
   * @param pYaw - Yaw degree.
   * @param pRoll - Roll degree.
   */
  addEulerRotation(pPitch, pYaw, pRoll) {
    // Apply rotation to current rotation.
    this.mRotation = this.mRotation.addEulerRotation(pPitch, pYaw, pRoll);
  }
  /**
   * Add rotation to already rotated object.
   * @param pPitch - Pitch degree.
   * @param pYaw - Yaw degree.
   * @param pRoll - Roll degree.
   */
  addRotation(pPitch, pYaw, pRoll) {
    // Apply rotation to current rotation.
    this.mRotation = quaternion_1.Quaternion.fromRotation(pPitch, pYaw, pRoll).mult(this.mRotation);
  }
  /**
   * Add scale.
   * @param pWidth - Width multiplier.
   * @param pHeight - Height multiplier.
   * @param pDepth - Depth multiplier.
   */
  addScale(pWidth, pHeight, pDepth) {
    this.mScale.data[0][0] += pWidth;
    this.mScale.data[1][1] += pHeight;
    this.mScale.data[2][2] += pDepth;
  }
  /**
   * Add translation.
   * @param pX - Movement on worlds X axis.
   * @param pY - Movement on worlds Y axis.
   * @param pZ - Movement on worlds Z axis.
   */
  addTranslation(pX, pY, pZ) {
    this.mTranslation.data[0][3] += pX;
    this.mTranslation.data[1][3] += pY;
    this.mTranslation.data[2][3] += pZ;
  }
  /**
   * Get transformation matrix.
   */
  getMatrix(pType) {
    switch (pType) {
      case TransformMatrix.Scale:
        {
          return this.mScale;
        }
      case TransformMatrix.Translation:
        {
          return this.mTranslation;
        }
      case TransformMatrix.Rotation:
        {
          return this.mRotation.asMatrix();
        }
      case TransformMatrix.PivotRotation:
        {
          const lRotationMatrix = this.getMatrix(TransformMatrix.Rotation);
          // Check if pivit point is used.
          let lPivotRotation;
          if (this.pivotX !== 0 || this.pivotY !== 0 || this.pivotZ !== 0) {
            // Translate pivot => rotate => reverse pivate translation.
            lPivotRotation = this.mPivot.inverse().mult(lRotationMatrix).mult(this.mPivot);
          } else {
            lPivotRotation = lRotationMatrix;
          }
          return lPivotRotation;
        }
      case TransformMatrix.Transformation:
        {
          const lScale = this.getMatrix(TransformMatrix.Scale);
          const lTranslation = this.getMatrix(TransformMatrix.Translation);
          const lRotation = this.getMatrix(TransformMatrix.PivotRotation);
          // First scale, second rotate, third translate.
          return lTranslation.mult(lRotation).mult(lScale);
        }
    }
  }
  /**
   * Reset current rotation and set new rotation.
   * @param pPitch - Pitch degree.
   * @param pYaw - Yaw degree.
   * @param pRoll - Roll degree.
   */
  setRotation(pPitch, pYaw, pRoll) {
    const lPitch = pPitch ?? this.rotationPitch;
    const lYaw = pYaw ?? this.rotationYaw;
    const lRoll = pRoll ?? this.rotationRoll;
    // Create new rotation.
    this.mRotation = quaternion_1.Quaternion.fromRotation(lPitch, lYaw, lRoll);
  }
  /**
   * Set scale.
   * @param pWidth - Width multiplier.
   * @param pHeight - Height multiplier.
   * @param pDepth - Depth multiplier.
   */
  setScale(pWidth, pHeight, pDepth) {
    this.mScale.data[0][0] = pWidth ?? this.scaleWidth;
    this.mScale.data[1][1] = pHeight ?? this.scaleHeight;
    this.mScale.data[2][2] = pDepth ?? this.scaleDepth;
  }
  /**
   * Set translation.
   * @param pX - Movement on worlds X axis.
   * @param pY - Movement on worlds Y axis.
   * @param pZ - Movement on worlds Z axis.
   */
  setTranslation(pX, pY, pZ) {
    this.mTranslation.data[0][3] = pX ?? this.translationX;
    this.mTranslation.data[1][3] = pY ?? this.translationY;
    this.mTranslation.data[2][3] = pZ ?? this.translationZ;
  }
  /**
   * Translate into rotation direction.
   * @param pForward - Forward movement.
   * @param pRight - Right movement.
   * @param pUp - Up movement.
   */
  translateInDirection(pForward, pRight, pUp) {
    const lTranslationVector = new vector_1.Vector([pRight, pUp, pForward, 1]);
    const lDirectionVector = this.getMatrix(TransformMatrix.Rotation).vectorMult(lTranslationVector);
    // Add direction.
    this.addTranslation(lDirectionVector.x, lDirectionVector.y, lDirectionVector.z);
  }
}
exports.Transform = Transform;
var TransformMatrix;
(function (TransformMatrix) {
  TransformMatrix[TransformMatrix["Rotation"] = 1] = "Rotation";
  TransformMatrix[TransformMatrix["PivotRotation"] = 2] = "PivotRotation";
  TransformMatrix[TransformMatrix["Translation"] = 3] = "Translation";
  TransformMatrix[TransformMatrix["Scale"] = 4] = "Scale";
  TransformMatrix[TransformMatrix["Transformation"] = 5] = "Transformation";
})(TransformMatrix || (exports.TransformMatrix = TransformMatrix = {}));

/***/ }),

/***/ "./page/source/something_better/view_projection/projection/perspective-projection.ts":
/*!*******************************************************************************************!*\
  !*** ./page/source/something_better/view_projection/projection/perspective-projection.ts ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PerspectiveProjection = void 0;
const matrix_1 = __webpack_require__(/*! ../../../math/matrix */ "./page/source/math/matrix.ts");
class PerspectiveProjection {
  /**
   * Angle of view.
   */
  get angleOfView() {
    return this.mAngleOfView;
  }
  set angleOfView(pValue) {
    this.mAngleOfView = pValue;
    // Reset cached matrix.
    this.mCacheProjectionMatrix = null;
  }
  /**
   * Angle of view.
   */
  get aspectRatio() {
    return this.mAspectRatio;
  }
  set aspectRatio(pValue) {
    this.mAspectRatio = pValue;
    // Reset cached matrix.
    this.mCacheProjectionMatrix = null;
  }
  /**
   * Far plane.
   */
  get far() {
    return this.mFar;
  }
  set far(pValue) {
    this.mFar = pValue;
    // Reset cached matrix.
    this.mCacheProjectionMatrix = null;
  }
  /**
   * Near plane.
   */
  get near() {
    return this.mNear;
  }
  set near(pValue) {
    this.mNear = pValue;
    // Reset cached matrix.
    this.mCacheProjectionMatrix = null;
  }
  /**
   * Projection matrix.
   */
  get projectionMatrix() {
    if (this.mCacheProjectionMatrix === null) {
      this.mCacheProjectionMatrix = this.createMatrix();
    }
    return this.mCacheProjectionMatrix;
  }
  /**
   * Constructor.
   */
  constructor() {
    this.mAngleOfView = 0;
    this.mNear = 0;
    this.mFar = 0;
    this.mAspectRatio = 0;
    // Cache.
    this.mCacheProjectionMatrix = null;
  }
  /**
   * Create projection matrix.
   */
  createMatrix() {
    const lMatrix = matrix_1.Matrix.identity(4);
    // Reset identity.
    lMatrix.data[0][0] = 0;
    lMatrix.data[1][1] = 0;
    lMatrix.data[2][2] = 0;
    lMatrix.data[3][3] = 0;
    // Calculate planes with centered camera on z-plane.
    const lFar = this.mFar;
    const lNear = this.mNear;
    // Top bottom calculated by get height from vertical angle of view.
    // Half angle is from y=>0 to top plane, as the angle descripes the distance between top and bottom plane.
    // Tan(angleOfView / 2) = Top / Near => Near * Tan(angleOfView / 2) = Top
    const lTop = this.mNear * Math.tan(this.angleOfView * Math.PI / 180 / 2);
    const lBottom = -lTop;
    // Left right calculated from aspect ratio.
    const lRight = lTop * this.aspectRatio;
    const lLeft = -lRight;
    // We need to set VectorZ to VectorW to devide VectorX and VectorY by the VectorZ.
    // So planes are smaller the further ways they are.
    // And scale VectorX and VectorY with the near plane to start the projection not on Z=0 but on Z=Near.
    // ┌ N  0  0   0  ┐   ┌ 1 ┐   ┌ 1 ┐
    // | 0  N  0   0  |   | 2 |   | 2 |
    // | 0  0  M1  M2 | x | 3 | = | 3 |
    // └ 0  0  1   0  ┘   └ 1 ┘   └ 3 ┘
    // Problem is: The VectorZ get also divided by VectorX and VectorW.
    // To fix the problem set VectorZ to VectorZ² with only M1 and M2 available.
    // As as M1 is the Scaling(M1 * Z) and M2 is Translating(M2 + Z) we get:
    // M1*Z + M2 = Z² => Quadratic means two solutions. But we need one.
    // So we constrains the equation to be only valid between Near and Far. So we set Z=Near or Z=Far.
    // All other Z Values are calculated quadratic ranging from Near to Far.
    // So we get:
    // M1*Near + M2 = Near²  => M1 = Far + Near
    // M1*Far  + M2 = Far²   => M2 = -(Far * Near)
    // ┌ N  0      0         0     ┐
    // | 0  N      0         0     |
    // | 0  0    F + N   -(F * N)  |
    // └ 0  0      1         0     ┘
    // Multiplicate this perspectiv matrix with the orthigraphic to center the camera.
    // ┌  2/(R-L)    0         0    -(R+L)/(R-L) ┐   ┌ N  0      0         0     ┐
    // |     0     2/(T-B)     0    -(T+B)/(T-B) |   | 0  N      0         0     |
    // |     0        0     1/(F-N)   -N/(F-N)   | x | 0  0    F + N   -(F * N)  |
    // └     0        0        0          1      ┘   └ 0  0      1         0     ┘
    // And we get.
    // ┌  2N/(R-L)    0        -(R+L)/(R-L)           0      ┐
    // |     0     2N/(T-B)    -(T+B)/(T-B)           0      |
    // |     0        0          F/(F-N)       -(F*N)/(F-N) |
    // └     0        0             1                0      ┘
    // Set matrix data. Row 1:
    lMatrix.data[0][0] = 2 * lNear / (lRight - lLeft);
    lMatrix.data[0][2] = -(lRight + lLeft) / (lRight - lLeft);
    // Set matrix data. Row 2:
    lMatrix.data[1][1] = 2 * lNear / (lTop - lBottom);
    lMatrix.data[1][2] = -(lTop + lBottom) / (lTop - lBottom);
    // Set matrix data. Row 3:
    lMatrix.data[2][2] = lFar / (lFar - lNear);
    lMatrix.data[2][3] = -(lFar * lNear) / (lFar - lNear);
    // Set matrix data. Row 4:
    lMatrix.data[3][2] = 1;
    return lMatrix;
  }
}
exports.PerspectiveProjection = PerspectiveProjection;

/***/ }),

/***/ "./page/source/something_better/view_projection/view-projection.ts":
/*!*************************************************************************!*\
  !*** ./page/source/something_better/view_projection/view-projection.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CameraMatrix = exports.ViewProjection = void 0;
const transform_1 = __webpack_require__(/*! ../transform */ "./page/source/something_better/transform.ts");
class ViewProjection {
  /**
   * Camera projection.
   */
  get projection() {
    return this.mProjection;
  }
  /**
   * Camera transformation.
   */
  get transformation() {
    return this.mTransformation;
  }
  /**
   * Constructor.
   */
  constructor(pProjection) {
    this.mProjection = pProjection;
    this.mTransformation = new transform_1.Transform();
  }
  /**
   * Get camera matrix.
   * @param pType - Matrix type.
   */
  getMatrix(pType) {
    switch (pType) {
      case CameraMatrix.Translation:
        {
          return this.mTransformation.getMatrix(transform_1.TransformMatrix.Translation);
        }
      case CameraMatrix.Rotation:
        {
          return this.mTransformation.getMatrix(transform_1.TransformMatrix.Rotation);
        }
      case CameraMatrix.PivotRotation:
        {
          return this.mTransformation.getMatrix(transform_1.TransformMatrix.PivotRotation);
        }
      case CameraMatrix.Projection:
        {
          return this.mProjection.projectionMatrix;
        }
      case CameraMatrix.View:
        {
          const lTranslation = this.getMatrix(CameraMatrix.Translation);
          const lRotation = this.getMatrix(CameraMatrix.Rotation);
          return lTranslation.mult(lRotation).inverse();
        }
      case CameraMatrix.ViewProjection:
        {
          const lView = this.getMatrix(CameraMatrix.View);
          const lProjection = this.getMatrix(CameraMatrix.Projection);
          return lProjection.mult(lView);
        }
    }
  }
}
exports.ViewProjection = ViewProjection;
var CameraMatrix;
(function (CameraMatrix) {
  CameraMatrix[CameraMatrix["Translation"] = 1] = "Translation";
  CameraMatrix[CameraMatrix["Rotation"] = 2] = "Rotation";
  CameraMatrix[CameraMatrix["PivotRotation"] = 3] = "PivotRotation";
  CameraMatrix[CameraMatrix["Projection"] = 4] = "Projection";
  CameraMatrix[CameraMatrix["View"] = 5] = "View";
  CameraMatrix[CameraMatrix["ViewProjection"] = 6] = "ViewProjection";
})(CameraMatrix || (exports.CameraMatrix = CameraMatrix = {}));

/***/ }),

/***/ "./source/base/base/binding/bind-data-group-layout.ts":
/*!************************************************************!*\
  !*** ./source/base/base/binding/bind-data-group-layout.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindDataGroupLayout = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const gpu_object_1 = __webpack_require__(/*! ../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const bind_data_group_1 = __webpack_require__(/*! ./bind-data-group */ "./source/base/base/binding/bind-data-group.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
class BindDataGroupLayout extends gpu_object_1.GpuObject {
  /**
   * Get binding names.
   */
  get bindingNames() {
    return [...this.mBindings.keys()];
  }
  /**
  * Get bindings of group.
  */
  get bindings() {
    const lBindingList = new Array();
    for (const lBinding of this.mBindings.values()) {
      lBindingList[lBinding.index] = lBinding;
    }
    return lBindingList;
  }
  /**
   * Get bind group identifier.
   * Same configured groups has the same identifier.
   */
  get identifier() {
    return this.mIdentifier;
  }
  /**
   * Constructor.
   * @param pDevice - Gpu Device reference.
   */
  constructor(pDevice) {
    super(pDevice);
    // Init storage.
    this.mBindings = new core_data_1.Dictionary();
    // Update identifier.
    this.mIdentifier = '';
    this.addUpdateListener(() => {
      let lIdentifier = '';
      for (const lBind of this.mBindings.values()) {
        // Simple chain of values.
        lIdentifier += lBind.index;
        lIdentifier += '-' + lBind.name;
        lIdentifier += '-' + lBind.layout.accessMode;
        lIdentifier += '-' + lBind.layout.bindingIndex;
        lIdentifier += '-' + lBind.layout.memoryType;
        lIdentifier += '-' + lBind.layout.name;
        lIdentifier += '-' + lBind.layout.visibility;
        lIdentifier += ';';
      }
      this.mIdentifier = lIdentifier;
    });
  }
  /**
   * Add layout to binding group.
   * @param pLayout - Memory layout.
   * @param pName - Binding name. For easy access only.
   * @param pIndex - Index of bind inside group.
   */
  addBinding(pLayout, pName) {
    if (pLayout.bindingIndex === null) {
      throw new core_data_1.Exception(`Layout "${pLayout.name}" binding needs a binding index.`, this);
    }
    // Set layout.
    this.mBindings.set(pName, {
      name: pName,
      index: pLayout.bindingIndex,
      layout: pLayout
    });
    // Register change listener for layout changes.
    pLayout.addUpdateListener(() => {
      this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
    });
    // Trigger next auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
  }
  /**
   * Create bind group from layout.
   */
  createGroup() {
    return new bind_data_group_1.BindDataGroup(this.device, this);
  }
  /**
   * Get full bind information.
   * @param pName - Bind name.
   */
  getBind(pName) {
    if (!this.mBindings.has(pName)) {
      throw new core_data_1.Exception(`Bind ${pName} does not exist.`, this);
    }
    return this.mBindings.get(pName);
  }
}
exports.BindDataGroupLayout = BindDataGroupLayout;

/***/ }),

/***/ "./source/base/base/binding/bind-data-group.ts":
/*!*****************************************************!*\
  !*** ./source/base/base/binding/bind-data-group.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindDataGroup = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const gpu_object_1 = __webpack_require__(/*! ../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
class BindDataGroup extends gpu_object_1.GpuObject {
  /**
   * Layout of bind group.
   */
  get layout() {
    return this.mLayout;
  }
  /**
   * Constructor.
   * @param pDevice - Gpu Device reference.
   */
  constructor(pDevice, pBindGroupLayout) {
    super(pDevice);
    this.mLayout = pBindGroupLayout;
    this.mBindData = new core_data_1.Dictionary();
    // Register change listener for layout changes.
    pBindGroupLayout.addUpdateListener(() => {
      this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
    });
  }
  /**
   * Get data of layout binding.
   * @param pBindName - Bind layout entry name.
   */
  getData(pBindName) {
    const lData = this.mBindData.get(pBindName);
    if (!lData) {
      throw new core_data_1.Exception(`Cant get bind data "${pBindName}". No data set.`, this);
    }
    return lData;
  }
  /**
   * Set data to layout binding.
   * @param pBindName - Bind layout entry name.
   * @param pData - Bind data.
   */
  setData(pBindName, pData) {
    // TODO: Validate data type with value type.
    // Set bind type to Teture for TS type check shutup.
    this.mBindData.set(pBindName, pData);
  }
}
exports.BindDataGroup = BindDataGroup;

/***/ }),

/***/ "./source/base/base/binding/pipeline-data-layout.ts":
/*!**********************************************************!*\
  !*** ./source/base/base/binding/pipeline-data-layout.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PipelineDataLayout = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const gpu_object_1 = __webpack_require__(/*! ../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
class PipelineDataLayout extends gpu_object_1.GpuObject {
  /**
   * Bind group count.
   */
  get groups() {
    return [...this.mBindGroups.keys()];
  }
  /**
   * Constructor.
   * @param pDevice - Gpu Device reference.
   */
  constructor(pDevice) {
    super(pDevice);
    // Init storage.
    this.mBindGroups = new core_data_1.Dictionary();
  }
  /**
   * Create bind group.
   * @param pIndex - Group index.
   * @param pLayout - [Optional] Bind group Layout.
   */
  addGroupLayout(pIndex, pLayout) {
    this.mBindGroups.add(pIndex, pLayout);
    // Register change listener for layout changes.
    pLayout.addUpdateListener(() => {
      this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
    });
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
  }
  /**
   * Get created bind group layout.
   * @param pIndex - Group index.
   */
  getGroupLayout(pIndex) {
    // Throw on unaccessable group.
    if (!this.mBindGroups.has(pIndex)) {
      throw new core_data_1.Exception(`Bind group layout (${pIndex}) does not exists.`, this);
    }
    // Bind group should allways exist.
    return this.mBindGroups.get(pIndex);
  }
}
exports.PipelineDataLayout = PipelineDataLayout;

/***/ }),

/***/ "./source/base/base/buffer/gpu-buffer.ts":
/*!***********************************************!*\
  !*** ./source/base/base/buffer/gpu-buffer.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuBuffer = void 0;
const gpu_object_1 = __webpack_require__(/*! ../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
/**
 * GpuBuffer. Uses local and native gpu buffers.
 */
class GpuBuffer extends gpu_object_1.GpuObject {
  /**
   * Data type of buffer.
   */
  get dataType() {
    return this.mDataType;
  }
  /**
   * Get buffer item count.
   */
  get length() {
    return this.mItemCount;
  }
  /**
   * Buffer layout.
   */
  get memoryLayout() {
    return this.mLayout;
  }
  /**
   * Buffer size in bytes aligned to 4 bytes.
   */
  get size() {
    return this.mItemCount * this.mDataType.BYTES_PER_ELEMENT + 3 & ~3;
  }
  /**
   * Constructor.
   * @param pDevice - GPU.
   * @param pLayout - Buffer layout.
   * @param pInitialData  - Inital data. Can be empty. Or Buffer size.
   */
  constructor(pDevice, pLayout, pInitialData) {
    super(pDevice);
    this.mLayout = pLayout;
    this.mDataType = pInitialData.constructor;
    // Set buffer initial data from buffer size or buffer data.
    if (typeof pInitialData === 'number') {
      this.mItemCount = pInitialData;
    } else {
      this.mItemCount = pInitialData.length;
      this.writeRaw(pInitialData, 0);
    }
    // Register change listener for layout changes.
    pLayout.addUpdateListener(() => {
      this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
    });
  }
  /**
   * Read buffer on layout location.
   * @param pLayoutPath - Layout path.
   */
  read(pLayoutPath) {
    var _this = this;
    return _asyncToGenerator(function* () {
      const lLocation = _this.mLayout.locationOf(pLayoutPath);
      return _this.readRaw(lLocation.offset, lLocation.size);
    })();
  }
  /**
   * Read data raw without layout.
   * @param pOffset - Data offset.
   * @param pSize - Data size.
   */
  readRaw(pOffset, pSize) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      const lOffset = pOffset ?? 0;
      const lSize = pSize ?? _this2.size;
      // Read data async
      const lBufferGenerator = _this2.device.generator.request(_this2);
      return yield lBufferGenerator.readRaw(lOffset, lSize);
    })();
  }
  /**
   * Write data on layout location.
   * @param pData - Data.
   * @param pLayoutPath - Layout path.
   */
  write(pData, pLayoutPath) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      const lLocation = _this3.mLayout.locationOf(pLayoutPath);
      // Skip new promise creation by returning original promise.
      return _this3.writeRaw(pData, lLocation.offset);
    })();
  }
  /**
   * Write data raw without layout.
   * @param pData - Data.
   * @param pOffset - Data offset.
   */
  writeRaw(pData, pOffset) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      const lOffset = pOffset ?? 0;
      // Write data async. Dont wait.
      const lBufferGenerator = _this4.device.generator.request(_this4);
      lBufferGenerator.writeRaw(pData, lOffset, pData.length);
    })();
  }
}
exports.GpuBuffer = GpuBuffer;

/***/ }),

/***/ "./source/base/base/execution/instruction-executor.ts":
/*!************************************************************!*\
  !*** ./source/base/base/execution/instruction-executor.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.InstructionExecuter = void 0;
const gpu_object_1 = __webpack_require__(/*! ../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const compute_instruction_1 = __webpack_require__(/*! ./instruction/compute-instruction */ "./source/base/base/execution/instruction/compute-instruction.ts");
const vertex_fragment_instruction_1 = __webpack_require__(/*! ./instruction/vertex-fragment-instruction */ "./source/base/base/execution/instruction/vertex-fragment-instruction.ts");
class InstructionExecuter extends gpu_object_1.GpuObject {
  constructor(pDevice) {
    super(pDevice);
    this.mInstructionList = new Array();
  }
  /**
   * Create and add new compute instruction
   */
  createComputeInstruction() {
    // Create instruction.
    const lInstruction = new compute_instruction_1.ComputeInstruction(this.device, this);
    // Add instruction to instruction list.
    this.mInstructionList.push(lInstruction);
    return lInstruction;
  }
  /**
   * Create and add new vertex fragment instruction
   * @param pRenderTargets - Instruction render targets.
   */
  createVertexFragmentInstruction(pRenderTargets) {
    // Create instruction.
    const lInstruction = new vertex_fragment_instruction_1.VertexFragmentInstruction(this.device, this, pRenderTargets);
    // Add instruction to instruction list.
    this.mInstructionList.push(lInstruction);
    return lInstruction;
  }
  /**
   * Execute all instructions on order.
   */
  execute() {
    const lInstructionExecutor = this.device.generator.request(this);
    // Start execution.
    lInstructionExecutor.startExecution();
    for (const lInstruction of this.mInstructionList) {
      lInstruction.execute();
    }
    // End Execution.
    lInstructionExecutor.endExecution();
  }
}
exports.InstructionExecuter = InstructionExecuter;

/***/ }),

/***/ "./source/base/base/execution/instruction/compute-instruction.ts":
/*!***********************************************************************!*\
  !*** ./source/base/base/execution/instruction/compute-instruction.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ComputeInstruction = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
class ComputeInstruction extends gpu_object_1.GpuObject {
  /**
   * Get executor.
   */
  get executor() {
    return this.mExecutor;
  }
  /**
   * Get all instruction steps.
   */
  get steps() {
    return this.mStepList;
  }
  /**
   * Constructor.
   * @param pDevice - Device reference.
   */
  constructor(pDevice, pExecutor) {
    super(pDevice);
    this.mStepList = new Array();
    this.mExecutor = pExecutor;
  }
  /**
   * Add instruction step.
   * @param pPipeline - Pipeline.
   * @param pBindData -  Pipeline bind data.
   */
  addStep(pPipeline, pBindData) {
    const lStep = {
      pipeline: pPipeline,
      bindData: new Array()
    };
    // Fill in data groups.
    for (const lGroup of pPipeline.shader.pipelineLayout.groups) {
      const lBindDataGroup = pBindData[lGroup];
      // Validate bind data group.
      if (!lBindDataGroup) {
        throw new core_data_1.Exception('Defined bind data group not set.', this);
      }
      // Validate same layout bind layout.
      const lBindGroupLayout = pPipeline.shader.pipelineLayout.getGroupLayout(lGroup);
      if (lBindDataGroup.layout.identifier !== lBindGroupLayout.identifier) {
        throw new core_data_1.Exception('Source bind group layout does not match target layout.', this);
      }
      lStep.bindData[lGroup] = pBindData[lGroup];
    }
    this.mStepList.push(lStep);
  }
  /**
   * Execute instruction.
   * @param pExecutor - Executor context.
   */
  execute() {
    this.device.generator.request(this).execute();
  }
}
exports.ComputeInstruction = ComputeInstruction;

/***/ }),

/***/ "./source/base/base/execution/instruction/vertex-fragment-instruction.ts":
/*!*******************************************************************************!*\
  !*** ./source/base/base/execution/instruction/vertex-fragment-instruction.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexFragmentInstruction = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
class VertexFragmentInstruction extends gpu_object_1.GpuObject {
  /**
   * Get executor.
   */
  get executor() {
    return this.mExecutor;
  }
  /**
   * Get instruction render target.
   */
  get renderTargets() {
    return this.mRenderTargets;
  }
  /**
   * Get all instruction steps.
   */
  get steps() {
    return this.mStepList;
  }
  /**
   * Constructor.
   * @param pDevice - Device reference.
   * @param pRenderTargets - Render targets.
   */
  constructor(pDevice, pExecutor, pRenderTargets) {
    super(pDevice);
    this.mStepList = new Array();
    this.mRenderTargets = pRenderTargets;
    this.mExecutor = pExecutor;
  }
  /**
   * Add instruction step.
   * @param pPipeline - Pipeline.
   * @param pParameter - Pipeline parameter.
   * @param pBindData - Pipline bind data groups.
   * @param pInstanceCount - Instance count.
   */
  addStep(pPipeline, pParameter, pBindData, pInstanceCount = 1) {
    // Validate same render targets.
    if (this.mRenderTargets !== pPipeline.renderTargets) {
      throw new core_data_1.Exception('Instruction render pass not valid for instruction set.', this);
    }
    const lStep = {
      pipeline: pPipeline,
      parameter: pParameter,
      instanceCount: pInstanceCount,
      bindData: new Array()
    };
    // Fill in data groups.
    for (const lGroup of pPipeline.shader.pipelineLayout.groups) {
      const lBindDataGroup = pBindData[lGroup];
      // Validate bind data group.
      if (!lBindDataGroup) {
        throw new core_data_1.Exception('Defined bind data group not set.', this);
      }
      // Validate same layout bind layout.
      const lBindGroupLayout = pPipeline.shader.pipelineLayout.getGroupLayout(lGroup);
      if (lBindDataGroup.layout.identifier !== lBindGroupLayout.identifier) {
        throw new core_data_1.Exception('Source bind group layout does not match target layout.', this);
      }
      lStep.bindData[lGroup] = pBindData[lGroup];
    }
    this.mStepList.push(lStep);
  }
  /**
   * Execute instruction.
   * @param pExecutor - Executor context.
   */
  execute() {
    this.device.generator.request(this).execute();
  }
}
exports.VertexFragmentInstruction = VertexFragmentInstruction;

/***/ }),

/***/ "./source/base/base/generator/base-generator-factory.ts":
/*!**************************************************************!*\
  !*** ./source/base/base/generator/base-generator-factory.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseGeneratorFactory = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
class BaseGeneratorFactory {
  get device() {
    if (!this.mDevice) {
      throw new core_data_1.Exception('Generator factory not initialized.', this);
    }
    return this.mDevice;
  }
  /**
   * Constructor.
   */
  constructor() {
    this.mGeneratorConstructors = new core_data_1.Dictionary();
    this.mGenerators = new core_data_1.Dictionary();
    this.mDevice = null;
  }
  /**
   * Init factory with gpu device.
   * @param pDevice - Gpu device.
   */
  init(pDevice) {
    var _this = this;
    return _asyncToGenerator(function* () {
      // Set device.
      _this.mDevice = pDevice;
      // Init internals.
      yield _this.initInternals();
      // Resolve with itself.
      return _this;
    })();
  }
  /**
   * Generate native.
   * @param pType - Type name of base object.
   * @param pBaseObject - Base gpu object.
   */
  request(pBaseObject) {
    // Check for cached generator.
    if (this.mGenerators.has(pBaseObject)) {
      return this.mGenerators.get(pBaseObject);
    }
    // Get and validate generator function.
    const lGeneratorConstructor = this.mGeneratorConstructors.get(pBaseObject.constructor);
    if (!lGeneratorConstructor) {
      // Currently only for 'none' Gpu objects or unset generators.
      const lNullCache = null;
      // Cache null.
      this.mGenerators.set(pBaseObject, lNullCache);
      return lNullCache;
    }
    // Create and cache generator.
    const lGenerator = new lGeneratorConstructor(pBaseObject);
    this.mGenerators.set(pBaseObject, lGenerator);
    return lGenerator;
  }
  /**
   * Register an generatpr for this type.
   * @param pType - Base gpu object type name.
   * @param pGenerator - Generator for this type.
   */
  registerGenerator(pType, pGenerator) {
    if (this.mGeneratorConstructors.has(pType)) {
      throw new core_data_1.Exception(`Generator already registed for "${pType.name}"`, this);
    }
    this.mGeneratorConstructors.set(pType, pGenerator);
  }
}
exports.BaseGeneratorFactory = BaseGeneratorFactory;

/***/ }),

/***/ "./source/base/base/generator/base-native-buffer-generator.ts":
/*!********************************************************************!*\
  !*** ./source/base/base/generator/base-native-buffer-generator.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseNativeBufferGenerator = void 0;
const base_native_generator_1 = __webpack_require__(/*! ./base-native-generator */ "./source/base/base/generator/base-native-generator.ts");
class BaseNativeBufferGenerator extends base_native_generator_1.BaseNativeGenerator {}
exports.BaseNativeBufferGenerator = BaseNativeBufferGenerator;

/***/ }),

/***/ "./source/base/base/generator/base-native-generator.ts":
/*!*************************************************************!*\
  !*** ./source/base/base/generator/base-native-generator.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.NativeObjectLifeTime = exports.BaseNativeGenerator = void 0;
const gpu_object_update_reason_1 = __webpack_require__(/*! ../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
class BaseNativeGenerator {
  /**
   * Generator factory.
   */
  get factory() {
    return this.mFactory;
  }
  /**
   * Get base object of generator.
   */
  get gpuObject() {
    return this.mGpuObject;
  }
  /**
   * Get generator update reasons.
   */
  get updateReasons() {
    return this.mUpdateReasons;
  }
  /**
   * Constructor.
   * @param pBaseObject - Base object containing all values.
   * @param pGeneratorFactory - Generator factory.
   */
  constructor(pFactory, pBaseObject) {
    this.mFactory = pFactory;
    this.mGpuObject = pBaseObject;
    this.mNative = null;
    this.mLastGeneratedFrame = 0;
    this.mUpdateReasons = new gpu_object_update_reason_1.GpuObjectUpdateReason();
  }
  /**
   * Generate native gpu object from base.
   */
  create() {
    // Validate life time.
    switch (this.nativeLifeTime) {
      case NativeObjectLifeTime.Persistent:
        {
          // Do nothing.
          break;
        }
      case NativeObjectLifeTime.Single:
        {
          // Invalidate every time.
          this.invalidate(gpu_object_update_reason_1.UpdateReason.LifeTime);
          break;
        }
      case NativeObjectLifeTime.Frame:
        {
          // Invalidate on different frame till last generated.
          if (this.factory.device.frameCount !== this.mLastGeneratedFrame) {
            this.invalidate(gpu_object_update_reason_1.UpdateReason.LifeTime);
          }
          break;
        }
    }
    // Clear and destroy old native when any update reason exists.
    if (this.mNative !== null && this.mUpdateReasons.any()) {
      this.destroy(this.mNative);
      this.mNative = null;
    }
    // Generate new native when not already generated.
    if (this.mNative === null) {
      this.mNative = this.generate();
      this.mLastGeneratedFrame = this.factory.device.frameCount;
      // Reset all update reasons.
      this.mUpdateReasons.clear();
    }
    return this.mNative;
  }
  /**
   * Invalidate and destroy generated native.
   */
  invalidate(pDestroyReason) {
    // Add update reason.
    this.mUpdateReasons.add(pDestroyReason);
  }
  /**
   * Destroy generated native.
   * @param _pNative - Generated native.
   * @param _pDestroyReason - Reason why the native should be destroyed.
   */
  destroy(_pNative) {
    return;
  }
}
exports.BaseNativeGenerator = BaseNativeGenerator;
var NativeObjectLifeTime;
(function (NativeObjectLifeTime) {
  NativeObjectLifeTime[NativeObjectLifeTime["Persistent"] = 0] = "Persistent";
  NativeObjectLifeTime[NativeObjectLifeTime["Frame"] = 1] = "Frame";
  NativeObjectLifeTime[NativeObjectLifeTime["Single"] = 2] = "Single";
})(NativeObjectLifeTime || (exports.NativeObjectLifeTime = NativeObjectLifeTime = {}));

/***/ }),

/***/ "./source/base/base/gpu/gpu-device.ts":
/*!********************************************!*\
  !*** ./source/base/base/gpu/gpu-device.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuDevice = void 0;
const instruction_executor_1 = __webpack_require__(/*! ../execution/instruction-executor */ "./source/base/base/execution/instruction-executor.ts");
const texture_group_1 = __webpack_require__(/*! ../pipeline/target/texture-group */ "./source/base/base/pipeline/target/texture-group.ts");
const shader_interpreter_factory_1 = __webpack_require__(/*! ../shader/interpreter/shader-interpreter-factory */ "./source/base/base/shader/interpreter/shader-interpreter-factory.ts");
const vertex_fragment_shader_1 = __webpack_require__(/*! ../shader/vertex-fragment-shader */ "./source/base/base/shader/vertex-fragment-shader.ts");
class GpuDevice {
  /**
   * Request new gpu device.
   * @param pGenerator - Native object generator.
   */
  static request(pGenerator, pShaderInterpreter) {
    return _asyncToGenerator(function* () {
      // Construct gpu device.
      const lDevice = new GpuDevice(pGenerator, pShaderInterpreter);
      // Init generator with created device.
      yield pGenerator.init(lDevice);
      return lDevice;
    })();
  }
  /**
   * Get frame count.
   */
  get frameCount() {
    return this.mFrameCounter;
  }
  /**
   * Native object generator.
   */
  get generator() {
    return this.mGenerator;
  }
  /**
   * Shader interpreter.
   */
  get shaderInterpreter() {
    return this.mShaderInterpreter;
  }
  /**
   * Constructor.
   * @param pGenerator - Native GPU-Object Generator.
   */
  constructor(pGenerator, pShaderInterpreter) {
    this.mFrameCounter = 0;
    this.mGenerator = pGenerator;
    this.mShaderInterpreter = new shader_interpreter_factory_1.ShaderInterpreterFactory(this, pShaderInterpreter);
  }
  /**
   * Create instruction executor.
   */
  instructionExecutor() {
    return new instruction_executor_1.InstructionExecuter(this);
  }
  /**
   * Create shader.
   * @param pSource - Shader source.
   * @param pVertexEntry - Vertex entry name.
   * @param pFragmentEntry - Optional fragment entry.
   */
  renderShader(pSource, pVertexEntry, pFragmentEntry) {
    return new vertex_fragment_shader_1.VertexFragmentShader(this, pSource, pVertexEntry, pFragmentEntry);
  }
  /**
   * Start new frame.
   */
  startNewFrame() {
    this.mFrameCounter++;
  }
  /**
   * Create texture group that shares the same dimensions.
   * @param pWidth - Texture width.
   * @param pHeight - Texture height.
   * @param pMultisampleLevel - Multisample level of textures.
   */
  textureGroup(pWidth, pHeight, pMultisampleLevel = 1) {
    return new texture_group_1.TextureGroup(this, pWidth, pHeight, pMultisampleLevel);
  }
}
exports.GpuDevice = GpuDevice;

/***/ }),

/***/ "./source/base/base/gpu/gpu-object-update-reason.ts":
/*!**********************************************************!*\
  !*** ./source/base/base/gpu/gpu-object-update-reason.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.UpdateReason = exports.GpuObjectUpdateReason = void 0;
class GpuObjectUpdateReason {
  /**
   * Constructor.
   */
  constructor() {
    this.mReasons = new Set();
  }
  /**
   * Add update reason.
   * @param pReason - Update reason.
   */
  add(pReason) {
    this.mReasons.add(pReason);
  }
  /**
   * If update reason has any existing reason.
   */
  any() {
    return this.mReasons.size > 0;
  }
  /**
   * Clear all reasons.
   */
  clear() {
    this.mReasons.clear();
  }
  /**
   * Check for update reason.
   * @param pReason - Update reason.
   */
  has(pReason) {
    return this.mReasons.has(pReason);
  }
}
exports.GpuObjectUpdateReason = GpuObjectUpdateReason;
var UpdateReason;
(function (UpdateReason) {
  UpdateReason[UpdateReason["Setting"] = 1] = "Setting";
  UpdateReason[UpdateReason["Data"] = 2] = "Data";
  UpdateReason[UpdateReason["ChildData"] = 3] = "ChildData";
  UpdateReason[UpdateReason["LifeTime"] = 4] = "LifeTime";
})(UpdateReason || (exports.UpdateReason = UpdateReason = {}));

/***/ }),

/***/ "./source/base/base/gpu/gpu-object.ts":
/*!********************************************!*\
  !*** ./source/base/base/gpu/gpu-object.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuObject = void 0;
class GpuObject {
  /**
   * Enable or disable auto update.
   */
  get autoUpdate() {
    return this.mAutoUpdate;
  }
  set autoUpdate(pValue) {
    this.mAutoUpdate = pValue;
  }
  /**
   * Gpu Device.
   */
  get device() {
    return this.mDevice;
  }
  /**
   * Constructor.
   * @param pDevice - Gpu device.
   */
  constructor(pDevice) {
    this.mAutoUpdate = true;
    this.mDevice = pDevice;
    this.mUpdateListenerList = new Set();
  }
  /**
   * Add update listener.
   * @param pListener - Listener.
   */
  addUpdateListener(pListener) {
    this.mUpdateListenerList.add(pListener);
  }
  /**
   * Add update listener.
   * @param pListener - Listener.
   */
  removeUpdateListener(pListener) {
    this.mUpdateListenerList.delete(pListener);
  }
  /**
   * Update gpu object.
   */
  update(pUpdateReason) {
    // Invalidate before calling parent listener. Only when a generator exists.
    const lGenerator = this.device.generator.request(this);
    if (lGenerator) {
      lGenerator.invalidate(pUpdateReason);
    }
    // Call parent update listerner.
    for (const lUpdateListener of this.mUpdateListenerList) {
      lUpdateListener();
    }
  }
  /**
   * Trigger auto update.
   * Does nothing on disabled auto update.
   */
  triggerAutoUpdate(pUpdateReason) {
    if (this.mAutoUpdate) {
      this.update(pUpdateReason);
    }
  }
}
exports.GpuObject = GpuObject;

/***/ }),

/***/ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-bind-data-group-generator.ts":
/*!*******************************************************************************************************!*\
  !*** ./source/base/base/implementation/web_gpu/native-generator/web-gpu-bind-data-group-generator.ts ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebGpuBindDataGroupGenerator = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const gpu_buffer_1 = __webpack_require__(/*! ../../../buffer/gpu-buffer */ "./source/base/base/buffer/gpu-buffer.ts");
const base_native_generator_1 = __webpack_require__(/*! ../../../generator/base-native-generator */ "./source/base/base/generator/base-native-generator.ts");
const canvas_texture_1 = __webpack_require__(/*! ../../../texture/canvas-texture */ "./source/base/base/texture/canvas-texture.ts");
const frame_buffer_texture_1 = __webpack_require__(/*! ../../../texture/frame-buffer-texture */ "./source/base/base/texture/frame-buffer-texture.ts");
const image_texture_1 = __webpack_require__(/*! ../../../texture/image-texture */ "./source/base/base/texture/image-texture.ts");
const texture_sampler_1 = __webpack_require__(/*! ../../../texture/texture-sampler */ "./source/base/base/texture/texture-sampler.ts");
const video_texture_1 = __webpack_require__(/*! ../../../texture/video-texture */ "./source/base/base/texture/video-texture.ts");
class WebGpuBindDataGroupGenerator extends base_native_generator_1.BaseNativeGenerator {
  /**
   * Set life time of generated native.
   */
  get nativeLifeTime() {
    return base_native_generator_1.NativeObjectLifeTime.Persistent;
  }
  /**
   * Generate native gpu bind data group.
   */
  generate() {
    const lEntryList = new Array();
    for (const lBindname of this.gpuObject.layout.bindingNames) {
      const lBindLayout = this.gpuObject.layout.getBind(lBindname);
      const lBindData = this.gpuObject.getData(lBindname);
      // Set resource to group entry for each 
      const lGroupEntry = {
        binding: lBindLayout.index,
        resource: null
      };
      // Buffer bind.
      if (lBindData instanceof gpu_buffer_1.GpuBuffer) {
        lGroupEntry.resource = {
          buffer: this.factory.request(lBindData).create()
        };
        lEntryList.push(lGroupEntry);
        continue;
      }
      // External/Video texture bind
      if (lBindData instanceof video_texture_1.VideoTexture) {
        lGroupEntry.resource = this.factory.request(lBindData).create();
        lEntryList.push(lGroupEntry);
        continue;
      }
      // Sampler bind
      if (lBindData instanceof texture_sampler_1.TextureSampler) {
        lGroupEntry.resource = this.factory.request(lBindData).create();
        lEntryList.push(lGroupEntry);
        continue;
      }
      // Frame buffer bind.
      if (lBindData instanceof frame_buffer_texture_1.FrameBufferTexture) {
        lGroupEntry.resource = this.factory.request(lBindData).create();
        lEntryList.push(lGroupEntry);
        continue;
      }
      // Image texture bind.
      if (lBindData instanceof image_texture_1.ImageTexture) {
        lGroupEntry.resource = this.factory.request(lBindData).create();
        lEntryList.push(lGroupEntry);
        continue;
      }
      // Canvas texture bind.
      if (lBindData instanceof canvas_texture_1.CanvasTexture) {
        lGroupEntry.resource = this.factory.request(lBindData).create();
        lEntryList.push(lGroupEntry);
        continue;
      }
      throw new core_data_1.Exception(`Bind type for "${lBindData}" not supported`, this);
    }
    return this.factory.gpu.createBindGroup({
      label: 'Bind-Group',
      layout: this.factory.request(this.gpuObject.layout).create(),
      entries: lEntryList
    });
  }
}
exports.WebGpuBindDataGroupGenerator = WebGpuBindDataGroupGenerator;

/***/ }),

/***/ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-bind-data-group-layout-generator.ts":
/*!**************************************************************************************************************!*\
  !*** ./source/base/base/implementation/web_gpu/native-generator/web-gpu-bind-data-group-layout-generator.ts ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebGpuBindDataGroupLayoutGenerator = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const access_mode_enum_1 = __webpack_require__(/*! ../../../../constant/access-mode.enum */ "./source/base/constant/access-mode.enum.ts");
const buffer_bind_type_enum_1 = __webpack_require__(/*! ../../../../constant/buffer-bind-type.enum */ "./source/base/constant/buffer-bind-type.enum.ts");
const sampler_type_enum_1 = __webpack_require__(/*! ../../../../constant/sampler-type.enum */ "./source/base/constant/sampler-type.enum.ts");
const texture_bind_type_enum_1 = __webpack_require__(/*! ../../../../constant/texture-bind-type.enum */ "./source/base/constant/texture-bind-type.enum.ts");
const base_native_generator_1 = __webpack_require__(/*! ../../../generator/base-native-generator */ "./source/base/base/generator/base-native-generator.ts");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ../../../memory_layout/buffer/base-buffer-memory-layout */ "./source/base/base/memory_layout/buffer/base-buffer-memory-layout.ts");
const sampler_memory_layout_1 = __webpack_require__(/*! ../../../memory_layout/sampler-memory-layout */ "./source/base/base/memory_layout/sampler-memory-layout.ts");
const texture_memory_layout_1 = __webpack_require__(/*! ../../../memory_layout/texture-memory-layout */ "./source/base/base/memory_layout/texture-memory-layout.ts");
class WebGpuBindDataGroupLayoutGenerator extends base_native_generator_1.BaseNativeGenerator {
  /**
   * Set life time of generated native.
   */
  get nativeLifeTime() {
    return base_native_generator_1.NativeObjectLifeTime.Persistent;
  }
  /**
   * Generate native bind data group layout object.
   */
  generate() {
    const lEntryList = new Array();
    // Generate layout entry for each binding.
    for (const lEntry of this.gpuObject.bindings) {
      // Generate default properties.
      const lLayoutEntry = {
        visibility: lEntry.layout.visibility,
        binding: lEntry.index
      };
      // Buffer layouts.
      if (lEntry.layout instanceof base_buffer_memory_layout_1.BaseBufferMemoryLayout) {
        let lBufferBindingType;
        switch (lEntry.layout.bindType) {
          case buffer_bind_type_enum_1.BufferBindType.Uniform:
            {
              lBufferBindingType = 'uniform';
              break;
            }
          case buffer_bind_type_enum_1.BufferBindType.Storage:
            {
              // Read only access. No bit compare.
              if (lEntry.layout.accessMode === access_mode_enum_1.AccessMode.Read) {
                lBufferBindingType = 'read-only-storage';
              } else {
                lBufferBindingType = 'storage';
              }
              break;
            }
          default:
            {
              throw new core_data_1.Exception('Can only bind buffers of bind type storage or uniform.', this);
            }
        }
        // Create buffer layout with all optional values.
        const lBufferLayout = {
          type: lBufferBindingType,
          minBindingSize: 0,
          hasDynamicOffset: false
        };
        lLayoutEntry.buffer = lBufferLayout;
        // Add buffer layout entry to bindings.
        lEntryList.push(lLayoutEntry);
        continue;
      }
      // Sampler layouts.
      if (lEntry.layout instanceof sampler_memory_layout_1.SamplerMemoryLayout) {
        let lSamplerBindingType;
        switch (lEntry.layout.samplerType) {
          case sampler_type_enum_1.SamplerType.Comparison:
            {
              lSamplerBindingType = 'comparison';
              break;
            }
          case sampler_type_enum_1.SamplerType.Filter:
            {
              lSamplerBindingType = 'filtering';
              break;
            }
        }
        // Create sampler layout with all optional values.
        const lSamplerLayout = {
          type: lSamplerBindingType
        };
        lLayoutEntry.sampler = lSamplerLayout;
        // Add sampler layout entry to bindings.
        lEntryList.push(lLayoutEntry);
        continue;
      }
      // Texture layouts.
      if (lEntry.layout instanceof texture_memory_layout_1.TextureMemoryLayout) {
        switch (lEntry.layout.bindType) {
          case texture_bind_type_enum_1.TextureBindType.External:
            {
              if (lEntry.layout.accessMode !== access_mode_enum_1.AccessMode.Read) {
                throw new core_data_1.Exception('External textures must have access mode read.', this);
              }
              const lExternalTextureLayout = {};
              lLayoutEntry.externalTexture = lExternalTextureLayout;
              break;
            }
          case texture_bind_type_enum_1.TextureBindType.Images:
            {
              if (lEntry.layout.accessMode !== access_mode_enum_1.AccessMode.Read) {
                throw new core_data_1.Exception('Image textures must have access mode read.', this);
              }
              const lTextureLayout = {
                sampleType: this.factory.sampleTypeFromLayout(lEntry.layout),
                multisampled: lEntry.layout.multisampled,
                viewDimension: lEntry.layout.dimension
              };
              lLayoutEntry.texture = lTextureLayout;
              break;
            }
          case texture_bind_type_enum_1.TextureBindType.Storage:
            {
              if (lEntry.layout.accessMode !== access_mode_enum_1.AccessMode.Write) {
                throw new core_data_1.Exception('Storage textures must have access mode write.', this);
              }
              const lStorageTextureLayout = {
                access: 'write-only',
                format: this.factory.formatFromLayout(lEntry.layout),
                viewDimension: lEntry.layout.dimension
              };
              lLayoutEntry.storageTexture = lStorageTextureLayout;
              break;
            }
          default:
            {
              throw new core_data_1.Exception('Cant bind attachment textures.', this);
            }
        }
        lEntryList.push(lLayoutEntry);
      }
      lEntryList.push(lLayoutEntry);
    }
    // Create binding group layout.
    return this.factory.gpu.createBindGroupLayout({
      label: 'Bind-Group-Layout',
      entries: lEntryList
    });
  }
}
exports.WebGpuBindDataGroupLayoutGenerator = WebGpuBindDataGroupLayoutGenerator;

/***/ }),

/***/ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-canvas-texture-generator.ts":
/*!******************************************************************************************************!*\
  !*** ./source/base/base/implementation/web_gpu/native-generator/web-gpu-canvas-texture-generator.ts ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebGpuCanvasTextureGenerator = void 0;
const base_native_generator_1 = __webpack_require__(/*! ../../../generator/base-native-generator */ "./source/base/base/generator/base-native-generator.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../../../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
class WebGpuCanvasTextureGenerator extends base_native_generator_1.BaseNativeGenerator {
  /**
   * Set life time of generated native.
   */
  get nativeLifeTime() {
    return base_native_generator_1.NativeObjectLifeTime.Frame;
  }
  /**
   * Constructor.
   * @param pBaseObject - Base object containing all values.
   * @param pGeneratorFactory - Generator factory.
   */
  constructor(pFactory, pBaseObject) {
    super(pFactory, pBaseObject);
    this.mContext = null;
  }
  /**
   * Destory texture object.
   * @param _pNativeObject - Native canvas texture.
   */
  destroy(_pNativeObject) {
    // Only destroy context when child data/layout has changes.
    if (this.updateReasons.has(gpu_object_update_reason_1.UpdateReason.ChildData)) {
      // Destory context.
      this.mContext?.unconfigure();
      this.mContext = null;
    }
    // Nothing else to destroy.
  }
  /**
   * Generate native canvas texture view.
   */
  generate() {
    // Configure context.
    if (!this.mContext) {
      // Create and configure canvas context.
      this.mContext = this.gpuObject.canvas.getContext('webgpu');
      this.mContext.configure({
        device: this.factory.gpu,
        format: this.factory.formatFromLayout(this.gpuObject.memoryLayout),
        usage: this.factory.usageFromLayout(this.gpuObject.memoryLayout),
        alphaMode: 'opaque'
      });
    }
    // Create texture and save it for destorying later.
    const lTexture = this.mContext.getCurrentTexture();
    // TODO: View descriptor.
    return lTexture.createView();
  }
}
exports.WebGpuCanvasTextureGenerator = WebGpuCanvasTextureGenerator;

/***/ }),

/***/ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-frame-buffer-texture-generator.ts":
/*!************************************************************************************************************!*\
  !*** ./source/base/base/implementation/web_gpu/native-generator/web-gpu-frame-buffer-texture-generator.ts ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebGpuFramebufferTextureGenerator = void 0;
const base_native_generator_1 = __webpack_require__(/*! ../../../generator/base-native-generator */ "./source/base/base/generator/base-native-generator.ts");
class WebGpuFramebufferTextureGenerator extends base_native_generator_1.BaseNativeGenerator {
  /**
   * Set life time of generated native.
   */
  get nativeLifeTime() {
    return base_native_generator_1.NativeObjectLifeTime.Frame;
  }
  /**
   * Constructor.
   * @param pBaseObject - Base object containing all values.
   * @param pGeneratorFactory - Generator factory.
   */
  constructor(pFactory, pBaseObject) {
    super(pFactory, pBaseObject);
    this.mTexture = null;
  }
  /**
   * Destory texture object.
   * @param _pNativeObject - Native canvas texture.
   */
  destroy(_pNativeObject) {
    this.mTexture?.destroy();
    this.mTexture = null;
  }
  /**
   * Generate native canvas texture view.
   */
  generate() {
    // Configure context.
    if (!this.mTexture) {
      // Create and configure canvas context.
      this.mTexture = this.factory.gpu.createTexture({
        label: 'Frame-Buffer-Texture',
        size: [this.gpuObject.width, this.gpuObject.height, this.gpuObject.depth],
        format: this.factory.formatFromLayout(this.gpuObject.memoryLayout),
        usage: this.factory.usageFromLayout(this.gpuObject.memoryLayout),
        dimension: this.factory.dimensionFromLayout(this.gpuObject.memoryLayout),
        sampleCount: this.gpuObject.multiSampleLevel
      });
    }
    // TODO: View descriptor.
    return this.mTexture.createView();
  }
}
exports.WebGpuFramebufferTextureGenerator = WebGpuFramebufferTextureGenerator;

/***/ }),

/***/ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-gpu-buffer-generator.ts":
/*!**************************************************************************************************!*\
  !*** ./source/base/base/implementation/web_gpu/native-generator/web-gpu-gpu-buffer-generator.ts ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebGpuGpuBufferGenerator = void 0;
const base_native_buffer_generator_1 = __webpack_require__(/*! ../../../generator/base-native-buffer-generator */ "./source/base/base/generator/base-native-buffer-generator.ts");
const base_native_generator_1 = __webpack_require__(/*! ../../../generator/base-native-generator */ "./source/base/base/generator/base-native-generator.ts");
const buffer_bind_type_enum_1 = __webpack_require__(/*! ../../../../constant/buffer-bind-type.enum */ "./source/base/constant/buffer-bind-type.enum.ts");
const memory_copy_type_enum_1 = __webpack_require__(/*! ../../../../constant/memory-copy-type.enum */ "./source/base/constant/memory-copy-type.enum.ts");
class WebGpuGpuBufferGenerator extends base_native_buffer_generator_1.BaseNativeBufferGenerator {
  /**
   * Set life time of generated native.
   */
  get nativeLifeTime() {
    return base_native_generator_1.NativeObjectLifeTime.Persistent;
  }
  constructor(pFactory, pBaseObject) {
    super(pFactory, pBaseObject);
    // Waving buffer list.
    this.mReadyBufferList = new Array();
    this.mWavingBufferList = new Array();
  }
  /**
   * Read raw buffer data.
   * @param pOffset - Data read offset.
   * @param pSize - Data read size.
   */
  readRaw(pOffset, pSize) {
    var _this = this;
    return _asyncToGenerator(function* () {
      // Get buffer and map data.
      const lBuffer = _this.create();
      yield lBuffer.mapAsync(GPUMapMode.READ, pOffset, pSize);
      // Get mapped data and force it into typed array.
      const lData = new _this.gpuObject.dataType(lBuffer.getMappedRange());
      return lData;
    })();
  }
  /**
   * Write data raw.
   * @param pData - Data.
   * @param pOffset - Data offset.
   * @param pSize - Data size.
   */
  writeRaw(pData, pOffset, pSize) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      // Create new buffer when no mapped buffer is available. 
      let lStagingBuffer;
      if (_this2.mReadyBufferList.length === 0) {
        lStagingBuffer = _this2.factory.gpu.createBuffer({
          label: `RingBuffer-WaveBuffer-${_this2.mWavingBufferList.length}`,
          size: _this2.gpuObject.size,
          usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
          mappedAtCreation: true
        });
        // Add new buffer to complete list.
        _this2.mWavingBufferList.push(lStagingBuffer);
      } else {
        lStagingBuffer = _this2.mReadyBufferList.pop();
      }
      // Execute write operations.
      const lBufferArray = new _this2.gpuObject.dataType(lStagingBuffer.getMappedRange(pOffset, pSize));
      lBufferArray.set(pData);
      // Unmap for copying data.
      lStagingBuffer.unmap();
      // Copy buffer data from staging into wavig buffer.
      const lCommandDecoder = _this2.factory.gpu.createCommandEncoder();
      lCommandDecoder.copyBufferToBuffer(lStagingBuffer, 0, _this2.create(), 0, _this2.gpuObject.size);
      _this2.factory.gpu.queue.submit([lCommandDecoder.finish()]);
      // Shedule staging buffer remaping.
      lStagingBuffer.mapAsync(GPUMapMode.WRITE).then(() => {
        _this2.mReadyBufferList.push(lStagingBuffer);
      });
    })();
  }
  /**
   * Destroy wave and ready buffer.
   */
  destroy(pNativeObject) {
    pNativeObject.destroy();
    // Destroy all wave buffer and clear list.
    for (let lCount = 0; this.mWavingBufferList.length < lCount; lCount++) {
      this.mWavingBufferList.pop()?.destroy();
    }
    // Clear ready buffer list.
    for (let lCount = 0; this.mReadyBufferList.length < lCount; lCount++) {
      // No need to destroy. All buffers have already destroyed.
      this.mReadyBufferList.pop();
    }
  }
  /**
   * Generate buffer. Write local gpu object data as initial native buffer data.
   */
  generate() {
    let lUsage = 0;
    // Append usage type from abstract bind type.
    switch (this.gpuObject.memoryLayout.bindType) {
      case buffer_bind_type_enum_1.BufferBindType.Undefined:
        {
          // Just an layout indicator. Does nothing to usage type.
          break;
        }
      case buffer_bind_type_enum_1.BufferBindType.Index:
        {
          lUsage |= GPUBufferUsage.INDEX;
          break;
        }
      case buffer_bind_type_enum_1.BufferBindType.Storage:
        {
          lUsage |= GPUBufferUsage.STORAGE;
          break;
        }
      case buffer_bind_type_enum_1.BufferBindType.Uniform:
        {
          lUsage |= GPUBufferUsage.UNIFORM;
          break;
        }
      case buffer_bind_type_enum_1.BufferBindType.Vertex:
        {
          lUsage |= GPUBufferUsage.VERTEX;
          break;
        }
    }
    // Append usage type from abstract usage type.
    if ((this.gpuObject.memoryLayout.memoryType & memory_copy_type_enum_1.MemoryCopyType.CopyDestination) !== 0) {
      lUsage |= GPUBufferUsage.COPY_DST;
    }
    if ((this.gpuObject.memoryLayout.memoryType & memory_copy_type_enum_1.MemoryCopyType.CopySource) !== 0) {
      lUsage |= GPUBufferUsage.COPY_SRC;
    }
    // Create gpu buffer mapped
    const lBuffer = this.factory.gpu.createBuffer({
      label: 'Ring-Buffer-Static-Buffer',
      size: this.gpuObject.size,
      usage: lUsage,
      mappedAtCreation: true // Map data when buffer would receive initial data.
    });
    // unmap buffer.
    lBuffer.unmap();
    return lBuffer;
  }
}
exports.WebGpuGpuBufferGenerator = WebGpuGpuBufferGenerator;

/***/ }),

/***/ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-image-texture-generator.ts":
/*!*****************************************************************************************************!*\
  !*** ./source/base/base/implementation/web_gpu/native-generator/web-gpu-image-texture-generator.ts ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebGpuImageTextureGenerator = void 0;
const base_native_generator_1 = __webpack_require__(/*! ../../../generator/base-native-generator */ "./source/base/base/generator/base-native-generator.ts");
class WebGpuImageTextureGenerator extends base_native_generator_1.BaseNativeGenerator {
  /**
   * Set life time of generated native.
   */
  get nativeLifeTime() {
    return base_native_generator_1.NativeObjectLifeTime.Persistent;
  }
  /**
   * Constructor.
   * @param pBaseObject - Base object containing all values.
   * @param pGeneratorFactory - Generator factory.
   */
  constructor(pFactory, pBaseObject) {
    super(pFactory, pBaseObject);
    this.mTexture = null;
  }
  /**
   * Destory texture object.
   * @param _pNativeObject - Native canvas texture.
   */
  destroy(_pNativeObject) {
    this.mTexture?.destroy();
    this.mTexture = null;
  }
  /**
   * Generate native canvas texture view.
   */
  generate() {
    // Create texture with set size, format and usage. Save it for destorying later.
    this.mTexture = this.factory.gpu.createTexture({
      label: 'Frame-Buffer-Texture',
      size: [this.gpuObject.width, this.gpuObject.height, this.gpuObject.depth],
      format: this.factory.formatFromLayout(this.gpuObject.memoryLayout),
      usage: this.factory.usageFromLayout(this.gpuObject.memoryLayout),
      dimension: this.factory.dimensionFromLayout(this.gpuObject.memoryLayout)
    });
    // Load images into texture.
    for (let lImageIndex = 0; lImageIndex < this.gpuObject.images.length; lImageIndex++) {
      const lBitmap = this.gpuObject.images[lImageIndex];
      // Copy image into depth layer.
      this.factory.gpu.queue.copyExternalImageToTexture({
        source: lBitmap
      }, {
        texture: this.mTexture,
        origin: [0, 0, lImageIndex]
      }, [lBitmap.width, lBitmap.height]);
    }
    // TODO: View descriptor.
    return this.mTexture.createView();
  }
}
exports.WebGpuImageTextureGenerator = WebGpuImageTextureGenerator;

/***/ }),

/***/ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-pipeline-data-layout-generator.ts":
/*!************************************************************************************************************!*\
  !*** ./source/base/base/implementation/web_gpu/native-generator/web-gpu-pipeline-data-layout-generator.ts ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebGpuPipelineDataLayoutGenerator = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const base_native_generator_1 = __webpack_require__(/*! ../../../generator/base-native-generator */ "./source/base/base/generator/base-native-generator.ts");
class WebGpuPipelineDataLayoutGenerator extends base_native_generator_1.BaseNativeGenerator {
  /**
   * Set life time of generated native.
   */
  get nativeLifeTime() {
    return base_native_generator_1.NativeObjectLifeTime.Persistent;
  }
  /**
   * Generate native gpu pipeline data layout.
   */
  generate() {
    const lBindGoupIndices = this.gpuObject.groups;
    // Generate pipeline layout from bind group layouts.
    const lPipelineLayoutDescriptor = {
      bindGroupLayouts: new Array()
    };
    for (const lIndex of lBindGoupIndices) {
      const lBindGroupLayout = this.gpuObject.getGroupLayout(lIndex);
      lPipelineLayoutDescriptor.bindGroupLayouts[lIndex] = this.factory.request(lBindGroupLayout).create();
    }
    // Validate continunity.
    if (lBindGoupIndices.length !== lPipelineLayoutDescriptor.bindGroupLayouts.length) {
      throw new core_data_1.Exception(`Bind group gap detected. Group not set.`, this);
    }
    // Generate pipeline layout from descriptor.
    return this.factory.gpu.createPipelineLayout(lPipelineLayoutDescriptor);
  }
}
exports.WebGpuPipelineDataLayoutGenerator = WebGpuPipelineDataLayoutGenerator;

/***/ }),

/***/ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-texture-sampler-generator.ts":
/*!*******************************************************************************************************!*\
  !*** ./source/base/base/implementation/web_gpu/native-generator/web-gpu-texture-sampler-generator.ts ***!
  \*******************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebGpuTextureSamplerGenerator = void 0;
const filter_mode_enum_1 = __webpack_require__(/*! ../../../../constant/filter-mode.enum */ "./source/base/constant/filter-mode.enum.ts");
const wrapping_mode_enum_1 = __webpack_require__(/*! ../../../../constant/wrapping-mode.enum */ "./source/base/constant/wrapping-mode.enum.ts");
const base_native_generator_1 = __webpack_require__(/*! ../../../generator/base-native-generator */ "./source/base/base/generator/base-native-generator.ts");
class WebGpuTextureSamplerGenerator extends base_native_generator_1.BaseNativeGenerator {
  /**
   * Set life time of generated native.
   */
  get nativeLifeTime() {
    return base_native_generator_1.NativeObjectLifeTime.Persistent;
  }
  /**
   * Generate native bind data group layout object.
   */
  generate() {
    // Convert compare function to native compare function.
    const lNativeCompareFunction = this.factory.compareFunctionToNative(this.gpuObject.compare);
    // Convert wrap mode to native address mode.
    let lAddressMode = 'clamp-to-edge';
    switch (this.gpuObject.wrapMode) {
      case wrapping_mode_enum_1.WrappingMode.ClampToEdge:
        {
          lAddressMode = 'clamp-to-edge';
          break;
        }
      case wrapping_mode_enum_1.WrappingMode.MirrorRepeat:
        {
          lAddressMode = 'mirror-repeat';
          break;
        }
      case wrapping_mode_enum_1.WrappingMode.Repeat:
        {
          lAddressMode = 'repeat';
          break;
        }
    }
    // Convert filter to native mipmap filter.
    let lMipMapFilter = 'linear';
    switch (this.gpuObject.mipmapFilter) {
      case filter_mode_enum_1.FilterMode.Linear:
        {
          lMipMapFilter = 'linear';
          break;
        }
      case filter_mode_enum_1.FilterMode.Nearest:
        {
          lMipMapFilter = 'nearest';
          break;
        }
    }
    const lSamplerOptions = {
      label: 'Texture-Sampler',
      addressModeU: lAddressMode,
      addressModeV: lAddressMode,
      addressModeW: lAddressMode,
      magFilter: this.toNativeFilterMode(this.gpuObject.magFilter),
      minFilter: this.toNativeFilterMode(this.gpuObject.minFilter),
      mipmapFilter: lMipMapFilter,
      lodMaxClamp: this.gpuObject.lodMaxClamp,
      lodMinClamp: this.gpuObject.lodMinClamp,
      maxAnisotropy: this.gpuObject.maxAnisotropy
    };
    if (lNativeCompareFunction) {
      lSamplerOptions.compare = lNativeCompareFunction;
    }
    return this.factory.gpu.createSampler(lSamplerOptions);
  }
  /**
   * Convert filter to native filter.
   * @param pFilerMode - Filter mode.
   */
  toNativeFilterMode(pFilerMode) {
    switch (pFilerMode) {
      case filter_mode_enum_1.FilterMode.Linear:
        {
          return 'linear';
        }
      case filter_mode_enum_1.FilterMode.Nearest:
        {
          return 'nearest';
        }
    }
  }
}
exports.WebGpuTextureSamplerGenerator = WebGpuTextureSamplerGenerator;

/***/ }),

/***/ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-vertex-fragment-shader-generator.ts":
/*!**************************************************************************************************************!*\
  !*** ./source/base/base/implementation/web_gpu/native-generator/web-gpu-vertex-fragment-shader-generator.ts ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebGpuVertexFragmentShaderGenerator = void 0;
const base_native_generator_1 = __webpack_require__(/*! ../../../generator/base-native-generator */ "./source/base/base/generator/base-native-generator.ts");
class WebGpuVertexFragmentShaderGenerator extends base_native_generator_1.BaseNativeGenerator {
  /**
   * Set life time of generated native.
   */
  get nativeLifeTime() {
    return base_native_generator_1.NativeObjectLifeTime.Persistent;
  }
  /**
   * Generate native gpu pipeline data layout.
   */
  generate() {
    return this.factory.gpu.createShaderModule({
      code: this.gpuObject.information.source
    });
  }
}
exports.WebGpuVertexFragmentShaderGenerator = WebGpuVertexFragmentShaderGenerator;

/***/ }),

/***/ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-video-texture-generator.ts":
/*!*****************************************************************************************************!*\
  !*** ./source/base/base/implementation/web_gpu/native-generator/web-gpu-video-texture-generator.ts ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebGpuVideoTextureGenerator = void 0;
const base_native_generator_1 = __webpack_require__(/*! ../../../generator/base-native-generator */ "./source/base/base/generator/base-native-generator.ts");
class WebGpuVideoTextureGenerator extends base_native_generator_1.BaseNativeGenerator {
  /**
   * Set life time of generated native.
   */
  get nativeLifeTime() {
    return base_native_generator_1.NativeObjectLifeTime.Persistent;
  }
  /**
   * Generate native canvas texture view.
   */
  generate() {
    return this.factory.gpu.importExternalTexture({
      label: 'External-Texture',
      source: this.gpuObject.video,
      colorSpace: 'srgb'
    });
  }
}
exports.WebGpuVideoTextureGenerator = WebGpuVideoTextureGenerator;

/***/ }),

/***/ "./source/base/base/implementation/web_gpu/web-gpu-generator-factory.ts":
/*!******************************************************************************!*\
  !*** ./source/base/base/implementation/web_gpu/web-gpu-generator-factory.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebGpuGeneratorFactory = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const memory_copy_type_enum_1 = __webpack_require__(/*! ../../../constant/memory-copy-type.enum */ "./source/base/constant/memory-copy-type.enum.ts");
const texture_dimension_enum_1 = __webpack_require__(/*! ../../../constant/texture-dimension.enum */ "./source/base/constant/texture-dimension.enum.ts");
const texture_format_enum_1 = __webpack_require__(/*! ../../../constant/texture-format.enum */ "./source/base/constant/texture-format.enum.ts");
const texture_usage_enum_1 = __webpack_require__(/*! ../../../constant/texture-usage.enum */ "./source/base/constant/texture-usage.enum.ts");
const bind_data_group_1 = __webpack_require__(/*! ../../binding/bind-data-group */ "./source/base/base/binding/bind-data-group.ts");
const bind_data_group_layout_1 = __webpack_require__(/*! ../../binding/bind-data-group-layout */ "./source/base/base/binding/bind-data-group-layout.ts");
const pipeline_data_layout_1 = __webpack_require__(/*! ../../binding/pipeline-data-layout */ "./source/base/base/binding/pipeline-data-layout.ts");
const gpu_buffer_1 = __webpack_require__(/*! ../../buffer/gpu-buffer */ "./source/base/base/buffer/gpu-buffer.ts");
const base_generator_factory_1 = __webpack_require__(/*! ../../generator/base-generator-factory */ "./source/base/base/generator/base-generator-factory.ts");
const vertex_fragment_shader_1 = __webpack_require__(/*! ../../shader/vertex-fragment-shader */ "./source/base/base/shader/vertex-fragment-shader.ts");
const canvas_texture_1 = __webpack_require__(/*! ../../texture/canvas-texture */ "./source/base/base/texture/canvas-texture.ts");
const frame_buffer_texture_1 = __webpack_require__(/*! ../../texture/frame-buffer-texture */ "./source/base/base/texture/frame-buffer-texture.ts");
const image_texture_1 = __webpack_require__(/*! ../../texture/image-texture */ "./source/base/base/texture/image-texture.ts");
const texture_sampler_1 = __webpack_require__(/*! ../../texture/texture-sampler */ "./source/base/base/texture/texture-sampler.ts");
const video_texture_1 = __webpack_require__(/*! ../../texture/video-texture */ "./source/base/base/texture/video-texture.ts");
const web_gpu_bind_data_group_generator_1 = __webpack_require__(/*! ./native-generator/web-gpu-bind-data-group-generator */ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-bind-data-group-generator.ts");
const web_gpu_bind_data_group_layout_generator_1 = __webpack_require__(/*! ./native-generator/web-gpu-bind-data-group-layout-generator */ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-bind-data-group-layout-generator.ts");
const web_gpu_canvas_texture_generator_1 = __webpack_require__(/*! ./native-generator/web-gpu-canvas-texture-generator */ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-canvas-texture-generator.ts");
const web_gpu_frame_buffer_texture_generator_1 = __webpack_require__(/*! ./native-generator/web-gpu-frame-buffer-texture-generator */ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-frame-buffer-texture-generator.ts");
const web_gpu_gpu_buffer_generator_1 = __webpack_require__(/*! ./native-generator/web-gpu-gpu-buffer-generator */ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-gpu-buffer-generator.ts");
const web_gpu_image_texture_generator_1 = __webpack_require__(/*! ./native-generator/web-gpu-image-texture-generator */ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-image-texture-generator.ts");
const web_gpu_pipeline_data_layout_generator_1 = __webpack_require__(/*! ./native-generator/web-gpu-pipeline-data-layout-generator */ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-pipeline-data-layout-generator.ts");
const web_gpu_vertex_fragment_shader_generator_1 = __webpack_require__(/*! ./native-generator/web-gpu-vertex-fragment-shader-generator */ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-vertex-fragment-shader-generator.ts");
const web_gpu_texture_sampler_generator_1 = __webpack_require__(/*! ./native-generator/web-gpu-texture-sampler-generator */ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-texture-sampler-generator.ts");
const web_gpu_video_texture_generator_1 = __webpack_require__(/*! ./native-generator/web-gpu-video-texture-generator */ "./source/base/base/implementation/web_gpu/native-generator/web-gpu-video-texture-generator.ts");
const compare_function_enum_1 = __webpack_require__(/*! ../../../constant/compare-function.enum */ "./source/base/constant/compare-function.enum.ts");
const buffer_primitive_format_1 = __webpack_require__(/*! ../../../constant/buffer-primitive-format */ "./source/base/constant/buffer-primitive-format.ts");
class WebGpuGeneratorFactory extends base_generator_factory_1.BaseGeneratorFactory {
  static {
    this.mAdapters = new core_data_1.Dictionary();
  }
  static {
    this.mDevices = new core_data_1.Dictionary();
  }
  /**
   * GPU device.
   */
  get gpu() {
    if (this.mGpuDevice === null) {
      throw new core_data_1.Exception('Web GPU device not initialized.', this);
    }
    return this.mGpuDevice;
  }
  /**
   * Preferred texture format.
   */
  get preferredFormat() {
    return window.navigator.gpu.getPreferredCanvasFormat();
  }
  /**
   * Constructor.
   */
  constructor(pMode) {
    super();
    this.mPerformance = pMode;
    this.mGpuAdapter = null;
    this.mGpuDevice = null;
    // Data.
    this.registerGenerator(gpu_buffer_1.GpuBuffer, web_gpu_gpu_buffer_generator_1.WebGpuGpuBufferGenerator);
    // Data binding.
    this.registerGenerator(bind_data_group_layout_1.BindDataGroupLayout, web_gpu_bind_data_group_layout_generator_1.WebGpuBindDataGroupLayoutGenerator);
    this.registerGenerator(bind_data_group_1.BindDataGroup, web_gpu_bind_data_group_generator_1.WebGpuBindDataGroupGenerator);
    this.registerGenerator(pipeline_data_layout_1.PipelineDataLayout, web_gpu_pipeline_data_layout_generator_1.WebGpuPipelineDataLayoutGenerator);
    // Textures.
    this.registerGenerator(canvas_texture_1.CanvasTexture, web_gpu_canvas_texture_generator_1.WebGpuCanvasTextureGenerator);
    this.registerGenerator(frame_buffer_texture_1.FrameBufferTexture, web_gpu_frame_buffer_texture_generator_1.WebGpuFramebufferTextureGenerator);
    this.registerGenerator(video_texture_1.VideoTexture, web_gpu_video_texture_generator_1.WebGpuVideoTextureGenerator);
    this.registerGenerator(image_texture_1.ImageTexture, web_gpu_image_texture_generator_1.WebGpuImageTextureGenerator);
    this.registerGenerator(texture_sampler_1.TextureSampler, web_gpu_texture_sampler_generator_1.WebGpuTextureSamplerGenerator);
    // Shader.
    this.registerGenerator(vertex_fragment_shader_1.VertexFragmentShader, web_gpu_vertex_fragment_shader_generator_1.WebGpuVertexFragmentShaderGenerator);
  }
  /**
   * Parse primitive vertex format into native vertex format.
   * @param pPrimitiveFormat - Primitive buffer format.
   */
  byteCountOfVertexFormat(pPrimitiveFormat) {
    switch (pPrimitiveFormat) {
      case buffer_primitive_format_1.BufferPrimitiveFormat.Float:
      case buffer_primitive_format_1.BufferPrimitiveFormat.Int:
      case buffer_primitive_format_1.BufferPrimitiveFormat.Uint:
        {
          return 4;
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec2Float:
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec2Uint:
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec2Int:
        {
          return 4 * 2;
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec3Int:
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec3Float:
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec3Uint:
        {
          return 4 * 3;
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec4Int:
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec4Float:
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec4Uint:
        {
          return 4 * 4;
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Unsupported:
        {
          throw new core_data_1.Exception('Vertex format not supported', this);
        }
    }
  }
  /**
   * Convert constant to native GPUCompareFunction.
   * @param pCompareFunction - Constant compare value.
   */
  compareFunctionToNative(pCompareFunction) {
    let lNativeCompareFunction = null;
    switch (pCompareFunction) {
      case compare_function_enum_1.CompareFunction.Allways:
        {
          lNativeCompareFunction = 'always';
          break;
        }
      case compare_function_enum_1.CompareFunction.Greater:
        {
          lNativeCompareFunction = 'greater';
          break;
        }
      case compare_function_enum_1.CompareFunction.Equal:
        {
          lNativeCompareFunction = 'equal';
          break;
        }
      case compare_function_enum_1.CompareFunction.GreaterEqual:
        {
          lNativeCompareFunction = 'greater-equal';
          break;
        }
      case compare_function_enum_1.CompareFunction.LessEqual:
        {
          lNativeCompareFunction = 'less-equal';
          break;
        }
      case compare_function_enum_1.CompareFunction.Less:
        {
          lNativeCompareFunction = 'less';
          break;
        }
      case compare_function_enum_1.CompareFunction.Never:
        {
          lNativeCompareFunction = 'never';
          break;
        }
      case compare_function_enum_1.CompareFunction.NotEqual:
        {
          lNativeCompareFunction = 'not-equal';
          break;
        }
    }
    return lNativeCompareFunction;
  }
  /**
   * GPU Dimension from layout texture dimension.
   */
  dimensionFromLayout(pLayout) {
    // "Calculate" texture dimension from texture size.
    switch (pLayout.dimension) {
      case texture_dimension_enum_1.TextureDimension.OneDimension:
        {
          return '1d';
        }
      case texture_dimension_enum_1.TextureDimension.TwoDimension:
        {
          return '2d';
        }
      case texture_dimension_enum_1.TextureDimension.Cube:
      case texture_dimension_enum_1.TextureDimension.CubeArray:
      case texture_dimension_enum_1.TextureDimension.ThreeDimension:
      case texture_dimension_enum_1.TextureDimension.TwoDimensionArray:
        {
          return '3d';
        }
    }
  }
  /**
   * Format from layout.
   */
  formatFromLayout(pLayout) {
    // Convert base to web gpu texture format.
    switch (pLayout.format) {
      case texture_format_enum_1.TextureFormat.BlueRedGreenAlpha:
        {
          return 'bgra8unorm';
        }
      case texture_format_enum_1.TextureFormat.Depth:
        {
          return 'depth24plus';
        }
      case texture_format_enum_1.TextureFormat.DepthStencil:
        {
          return 'depth24plus-stencil8';
        }
      case texture_format_enum_1.TextureFormat.Red:
        {
          return 'r8unorm';
        }
      case texture_format_enum_1.TextureFormat.RedGreen:
        {
          return 'rg8unorm';
        }
      case texture_format_enum_1.TextureFormat.RedGreenBlueAlpha:
        {
          return 'rgba8unorm';
        }
      case texture_format_enum_1.TextureFormat.RedGreenBlueAlphaInteger:
        {
          return 'rgba8uint';
        }
      case texture_format_enum_1.TextureFormat.RedGreenInteger:
        {
          return 'rg8uint';
        }
      case texture_format_enum_1.TextureFormat.RedInteger:
        {
          return 'r8uint';
        }
      case texture_format_enum_1.TextureFormat.Stencil:
        {
          return 'stencil8';
        }
    }
  }
  /**
   * Init devices.
   */
  initInternals() {
    var _this = this;
    return _asyncToGenerator(function* () {
      // Try to load cached adapter. When not cached, request new one.
      const lAdapter = WebGpuGeneratorFactory.mAdapters.get(_this.mPerformance) ?? (yield window.navigator.gpu.requestAdapter({
        powerPreference: _this.mPerformance
      }));
      if (!lAdapter) {
        throw new core_data_1.Exception('Error requesting GPU adapter', WebGpuGeneratorFactory);
      }
      WebGpuGeneratorFactory.mAdapters.set(_this.mPerformance, lAdapter);
      // Try to load cached device. When not cached, request new one.
      const lDevice = WebGpuGeneratorFactory.mDevices.get(lAdapter) ?? (yield lAdapter.requestDevice());
      if (!lDevice) {
        throw new core_data_1.Exception('Error requesting GPU device', WebGpuGeneratorFactory);
      }
      WebGpuGeneratorFactory.mDevices.set(lAdapter, lDevice);
      _this.mGpuAdapter = lAdapter;
      _this.mGpuDevice = lDevice;
    })();
  }
  /**
   * Get sample type from texture layout.
   */
  sampleTypeFromLayout(pLayout) {
    // Convert texture format to sampler values.
    switch (pLayout.format) {
      case texture_format_enum_1.TextureFormat.Depth:
      case texture_format_enum_1.TextureFormat.DepthStencil:
        {
          return 'depth';
        }
      case texture_format_enum_1.TextureFormat.Stencil:
      case texture_format_enum_1.TextureFormat.BlueRedGreenAlpha:
      case texture_format_enum_1.TextureFormat.Red:
      case texture_format_enum_1.TextureFormat.RedGreen:
      case texture_format_enum_1.TextureFormat.RedGreenBlueAlpha:
        {
          return 'float';
        }
      case texture_format_enum_1.TextureFormat.RedGreenBlueAlphaInteger:
      case texture_format_enum_1.TextureFormat.RedGreenInteger:
      case texture_format_enum_1.TextureFormat.RedInteger:
        {
          return 'uint';
        }
    }
  }
  /**
   * Parse primitive vertex format into native vertex format.
   * @param pPrimitiveFormat - Primitive buffer format.
   */
  toNativeVertexFormat(pPrimitiveFormat) {
    switch (pPrimitiveFormat) {
      case buffer_primitive_format_1.BufferPrimitiveFormat.Float:
        {
          return 'float32';
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Int:
        {
          return 'sint32';
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Uint:
        {
          return 'uint32';
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec2Float:
        {
          return 'float32x2';
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec3Float:
        {
          return 'float32x3';
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec4Float:
        {
          return 'float32x4';
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec2Int:
        {
          return 'sint32x2';
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec3Int:
        {
          return 'sint32x3';
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec4Int:
        {
          return 'sint32x4';
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec2Uint:
        {
          return 'uint32x2';
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec3Uint:
        {
          return 'uint32x3';
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Vec4Uint:
        {
          return 'uint32x4';
        }
      case buffer_primitive_format_1.BufferPrimitiveFormat.Unsupported:
        {
          throw new core_data_1.Exception('Vertex format not supported', this);
        }
    }
  }
  /**
   * Usage from layout.
   */
  usageFromLayout(pLayout) {
    // Parse base to web gpu usage.
    let lUsage = 0;
    if ((pLayout.memoryType & memory_copy_type_enum_1.MemoryCopyType.CopyDestination) !== 0) {
      lUsage |= GPUTextureUsage.COPY_DST;
    }
    if ((pLayout.memoryType & memory_copy_type_enum_1.MemoryCopyType.CopySource) !== 0) {
      lUsage |= GPUTextureUsage.COPY_SRC;
    }
    if ((pLayout.usage & texture_usage_enum_1.TextureUsage.RenderAttachment) !== 0) {
      lUsage |= GPUTextureUsage.RENDER_ATTACHMENT;
    }
    if ((pLayout.usage & texture_usage_enum_1.TextureUsage.StorageBinding) !== 0) {
      lUsage |= GPUTextureUsage.STORAGE_BINDING;
    }
    if ((pLayout.usage & texture_usage_enum_1.TextureUsage.TextureBinding) !== 0) {
      lUsage |= GPUTextureUsage.TEXTURE_BINDING;
    }
    return lUsage;
  }
}
exports.WebGpuGeneratorFactory = WebGpuGeneratorFactory;

/***/ }),

/***/ "./source/base/base/implementation/web_gpu/web-gpu-shader-interpreter.ts":
/*!*******************************************************************************!*\
  !*** ./source/base/base/implementation/web_gpu/web-gpu-shader-interpreter.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WebGpuShaderInterpreter = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const access_mode_enum_1 = __webpack_require__(/*! ../../../constant/access-mode.enum */ "./source/base/constant/access-mode.enum.ts");
const buffer_bind_type_enum_1 = __webpack_require__(/*! ../../../constant/buffer-bind-type.enum */ "./source/base/constant/buffer-bind-type.enum.ts");
const compute_stage_enum_1 = __webpack_require__(/*! ../../../constant/compute-stage.enum */ "./source/base/constant/compute-stage.enum.ts");
const sampler_type_enum_1 = __webpack_require__(/*! ../../../constant/sampler-type.enum */ "./source/base/constant/sampler-type.enum.ts");
const texture_bind_type_enum_1 = __webpack_require__(/*! ../../../constant/texture-bind-type.enum */ "./source/base/constant/texture-bind-type.enum.ts");
const texture_dimension_enum_1 = __webpack_require__(/*! ../../../constant/texture-dimension.enum */ "./source/base/constant/texture-dimension.enum.ts");
const texture_format_enum_1 = __webpack_require__(/*! ../../../constant/texture-format.enum */ "./source/base/constant/texture-format.enum.ts");
const array_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/array-buffer-memory-layout */ "./source/base/base/memory_layout/buffer/array-buffer-memory-layout.ts");
const linear_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/linear-buffer-memory-layout */ "./source/base/base/memory_layout/buffer/linear-buffer-memory-layout.ts");
const struct_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/struct-buffer-memory-layout */ "./source/base/base/memory_layout/buffer/struct-buffer-memory-layout.ts");
const sampler_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/sampler-memory-layout */ "./source/base/base/memory_layout/sampler-memory-layout.ts");
const texture_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/texture-memory-layout */ "./source/base/base/memory_layout/texture-memory-layout.ts");
const base_shader_interpreter_1 = __webpack_require__(/*! ../../shader/interpreter/base-shader-interpreter */ "./source/base/base/shader/interpreter/base-shader-interpreter.ts");
const wgsl_type_enum_1 = __webpack_require__(/*! ./wgsl_enum/wgsl-type.enum */ "./source/base/base/implementation/web_gpu/wgsl_enum/wgsl-type.enum.ts");
const buffer_primitive_format_1 = __webpack_require__(/*! ../../../constant/buffer-primitive-format */ "./source/base/constant/buffer-primitive-format.ts");
class WebGpuShaderInterpreter extends base_shader_interpreter_1.BaseShaderInterpreter {
  /**
   * Fetch al function definitions.
   * @param pSourceCode - Source code.
   */
  fetchFunctionDefinitions(pSourceCode) {
    const lFunctionRegex = /(?<attributes>(?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:\s)*?fn\s+(?<name>\w*)\s*\((?<parameter>(?:.|\r?\n)*?)\)(?:\s*->\s*(?<result>[^{]+))?\s*{/gm;
    const lFunctionList = new Array();
    for (const lFunctionMatch of pSourceCode.matchAll(lFunctionRegex)) {
      const lFunctionName = lFunctionMatch.groups['name'];
      const lFunctionResult = lFunctionMatch.groups['result'];
      const lFunctionAttributes = lFunctionMatch.groups['attributes'];
      const lFunctionParameter = lFunctionMatch.groups['parameter'];
      // Fetch attributes.
      const lAttachments = {};
      if (lFunctionAttributes) {
        // Split string of multiple attributes.
        for (const lAttributeMatch of lFunctionAttributes.matchAll(/@(?<name>[\w])+\((?<value>[^)]*)\)/g)) {
          const lAttributeName = lAttributeMatch.groups['name'];
          const lAttributeValue = lAttributeMatch.groups['value'];
          // Add each attribute as value attachment.
          lAttachments[lAttributeName] = lAttributeValue;
        }
      }
      // Cut source code after function head match. Head includes first bracket.
      const lFunctionBodyStart = pSourceCode.slice(lFunctionMatch.index + lFunctionMatch[0].length);
      const lBracketRegex = /(?:".*?"|'.*?'|\/\*.*?\*\/|\/\/.*?$)|(?<bracket>{|})/gms;
      // Read function body. Match opening and closing brackets. Count layers and find exit bracket. 
      let lBracketLayer = 1;
      let lClosingBracketIndex = -1;
      let lBracketMatch;
      while ((lBracketMatch = lBracketRegex.exec(lFunctionBodyStart)) !== null) {
        if (lBracketMatch.groups?.['bracket']) {
          const lBracket = lBracketMatch.groups['bracket'];
          // Count closing and opening layers.
          if (lBracket === '{') {
            lBracketLayer++;
          } else {
            lBracketLayer--;
            // Exit search on exiting last layer.
            if (lBracketLayer === 0) {
              lClosingBracketIndex = lBracketMatch.index;
              break;
            }
          }
        }
      }
      // Validate found closing bracket.
      if (lClosingBracketIndex < 0) {
        throw new core_data_1.Exception(`Error closing function "${lFunctionName}"`, this);
      }
      // Cut string on opening and exit braket.
      const lFunctionBody = lFunctionBodyStart.slice(0, lClosingBracketIndex);
      // Fetch Parameter.
      const lParameterVariableList = this.fetchVariableDefinitions(lFunctionParameter);
      // Fetch result type.
      const lReturnTypes = this.fetchVariableDefinitions(lFunctionResult).at(0);
      lFunctionList.push({
        name: lFunctionName,
        returnType: lReturnTypes,
        parameter: lParameterVariableList,
        attachments: lAttachments,
        body: lFunctionBody
      });
    }
    return lFunctionList;
  }
  /**
   * Fetch all struct definitions of shader.
   * @param pSourceCode - Shader source code.
   */
  fetchStructDefinitions(pSourceCode) {
    const lStuctRegex = /^\s*struct\s+(?<name>\w+)\s*{(?<typeinfo>[^}]*)}$/smg;
    // Fetch all found structs.
    const lStructDefinitionList = new Array();
    for (const lStructMatch of pSourceCode.matchAll(lStuctRegex)) {
      const lStructName = lStructMatch.groups['name'];
      const lStructBody = lStructMatch.groups['typeinfo'];
      lStructDefinitionList.push({
        name: lStructName,
        properies: this.fetchVariableDefinitions(lStructBody)
      });
    }
    return lStructDefinitionList;
  }
  /**
   * Fetch all global bindings.
   * @param pSourceCode - Source code.
   */
  fetchValueDefinitions(pSourceCode) {
    // Get only lines with group attributes.
    const lAllGroupLines = [...pSourceCode.matchAll(/^.*@group.*$/gm)].reduce((pCurrent, pLine) => {
      return pCurrent + pLine[0];
    }, '');
    return this.fetchVariableDefinitions(lAllGroupLines);
  }
  /**
   * Convert definition into function.
   * @param pDefinition - Function definitions.
   */
  functionFromDefinition(pDefinition) {
    // Create memory layouts
    const lParameter = pDefinition.parameter.map(pParameterDefintion => {
      return this.valueFromDefinition(pParameterDefintion).value;
    });
    const lReturnType = this.valueFromDefinition(pDefinition.returnType).value;
    // Read tags from attachments.
    let lTag = compute_stage_enum_1.ComputeStage.None;
    if (pDefinition.attachments['vertex']) {
      lTag |= compute_stage_enum_1.ComputeStage.Vertex;
    }
    if (pDefinition.attachments['fragment']) {
      lTag |= compute_stage_enum_1.ComputeStage.Fragment;
    }
    if (pDefinition.attachments['compute']) {
      lTag |= compute_stage_enum_1.ComputeStage.Compute;
    }
    // "Calculate" used globals by using deep mathematic learning block chain algorithms.
    const lUsedGlobals = new Array();
    for (const lGlobalValue of this.fetchValueDefinitions(this.source)) {
      if (pDefinition.body.includes(lGlobalValue.name)) {
        lUsedGlobals.push(lGlobalValue.name);
      }
    }
    const lAttachmentValueRexgex = /".*?"|'.*?'|[^,"']+/g;
    // Save all attachments.
    const lAttachment = {};
    for (const lAttachmentName in pDefinition.attachments) {
      const lAttachmentValues = pDefinition.attachments[lAttachmentName];
      // Split values by comma. Filter every empty value.
      lAttachment[lAttachmentName] = [...lAttachmentValues.matchAll(lAttachmentValueRexgex)].map(pMatch => {
        return pMatch[0].trim();
      }).filter(pValue => {
        return pValue !== '';
      });
    }
    return {
      name: pDefinition.name,
      entryPoints: lTag,
      parameter: lParameter,
      return: lReturnType,
      usedGlobals: lUsedGlobals,
      attachments: lAttachment
    };
  }
  /**
   * Setup shader types.
   * @param pAddType - Add type callback.
   */
  setupShaderTypes(pAddType) {
    // Scalar types.
    pAddType({
      name: wgsl_type_enum_1.WgslType.Boolean,
      variants: [{
        size: 1,
        align: 1
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Integer32,
      variants: [{
        size: 4,
        align: 4,
        format: buffer_primitive_format_1.BufferPrimitiveFormat.Int
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.UnsignedInteger32,
      variants: [{
        size: 4,
        align: 4,
        format: buffer_primitive_format_1.BufferPrimitiveFormat.Uint
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Float32,
      variants: [{
        size: 4,
        align: 4,
        format: buffer_primitive_format_1.BufferPrimitiveFormat.Float
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Float16,
      variants: [{
        size: 2,
        align: 2
      }]
    });
    // Vector types.
    pAddType({
      name: wgsl_type_enum_1.WgslType.Vector2,
      variants: [{
        size: 8,
        align: 8,
        generic: [wgsl_type_enum_1.WgslType.Integer32],
        format: buffer_primitive_format_1.BufferPrimitiveFormat.Vec2Int
      }, {
        size: 8,
        align: 8,
        generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32],
        format: buffer_primitive_format_1.BufferPrimitiveFormat.Vec2Uint
      }, {
        size: 8,
        align: 8,
        generic: [wgsl_type_enum_1.WgslType.Float32],
        format: buffer_primitive_format_1.BufferPrimitiveFormat.Vec2Float
      }, {
        size: 4,
        align: 4,
        generic: [wgsl_type_enum_1.WgslType.Float16]
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Vector3,
      variants: [{
        size: 12,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.Integer32],
        format: buffer_primitive_format_1.BufferPrimitiveFormat.Vec3Int
      }, {
        size: 12,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32],
        format: buffer_primitive_format_1.BufferPrimitiveFormat.Vec3Uint
      }, {
        size: 12,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.Float32],
        format: buffer_primitive_format_1.BufferPrimitiveFormat.Vec3Float
      }, {
        size: 6,
        align: 8,
        generic: [wgsl_type_enum_1.WgslType.Float16]
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Vector4,
      variants: [{
        size: 16,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.Integer32],
        format: buffer_primitive_format_1.BufferPrimitiveFormat.Vec4Int
      }, {
        size: 16,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32],
        format: buffer_primitive_format_1.BufferPrimitiveFormat.Vec4Uint
      }, {
        size: 16,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.Float32],
        format: buffer_primitive_format_1.BufferPrimitiveFormat.Vec4Float
      }, {
        size: 8,
        align: 8,
        generic: [wgsl_type_enum_1.WgslType.Float16]
      }]
    });
    // Matrix types.
    pAddType({
      name: wgsl_type_enum_1.WgslType.Matrix22,
      variants: [{
        size: 16,
        align: 8,
        generic: [wgsl_type_enum_1.WgslType.Integer32]
      }, {
        size: 16,
        align: 8,
        generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
      }, {
        size: 16,
        align: 8,
        aliases: ['mat2x2f'],
        generic: [wgsl_type_enum_1.WgslType.Float32]
      }, {
        size: 8,
        align: 4,
        aliases: ['mat2x2h'],
        generic: [wgsl_type_enum_1.WgslType.Float16]
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Matrix23,
      variants: [{
        size: 32,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.Integer32]
      }, {
        size: 32,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
      }, {
        size: 32,
        align: 16,
        aliases: ['mat2x3f'],
        generic: [wgsl_type_enum_1.WgslType.Float32]
      }, {
        size: 16,
        align: 8,
        aliases: ['mat2x3h'],
        generic: [wgsl_type_enum_1.WgslType.Float16]
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Matrix24,
      variants: [{
        size: 32,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.Integer32]
      }, {
        size: 32,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
      }, {
        size: 32,
        align: 16,
        aliases: ['mat2x4f'],
        generic: [wgsl_type_enum_1.WgslType.Float32]
      }, {
        size: 16,
        align: 8,
        aliases: ['mat2x4h'],
        generic: [wgsl_type_enum_1.WgslType.Float16]
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Matrix32,
      variants: [{
        size: 24,
        align: 8,
        generic: [wgsl_type_enum_1.WgslType.Integer32]
      }, {
        size: 24,
        align: 8,
        generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
      }, {
        size: 24,
        align: 8,
        aliases: ['mat3x2f'],
        generic: [wgsl_type_enum_1.WgslType.Float32]
      }, {
        size: 12,
        align: 4,
        aliases: ['mat3x2h'],
        generic: [wgsl_type_enum_1.WgslType.Float16]
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Matrix33,
      variants: [{
        size: 48,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.Integer32]
      }, {
        size: 48,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
      }, {
        size: 48,
        align: 16,
        aliases: ['mat3x3f'],
        generic: [wgsl_type_enum_1.WgslType.Float32]
      }, {
        size: 24,
        align: 8,
        aliases: ['mat3x3h'],
        generic: [wgsl_type_enum_1.WgslType.Float16]
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Matrix34,
      variants: [{
        size: 48,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.Integer32]
      }, {
        size: 48,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
      }, {
        size: 48,
        align: 16,
        aliases: ['mat3x4f'],
        generic: [wgsl_type_enum_1.WgslType.Float32]
      }, {
        size: 24,
        align: 8,
        aliases: ['mat3x4h'],
        generic: [wgsl_type_enum_1.WgslType.Float16]
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Matrix42,
      variants: [{
        size: 32,
        align: 8,
        generic: [wgsl_type_enum_1.WgslType.Integer32]
      }, {
        size: 32,
        align: 8,
        generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
      }, {
        size: 32,
        align: 8,
        aliases: ['mat4x2f'],
        generic: [wgsl_type_enum_1.WgslType.Float32]
      }, {
        size: 16,
        align: 4,
        aliases: ['mat4x2h'],
        generic: [wgsl_type_enum_1.WgslType.Float16]
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Matrix43,
      variants: [{
        size: 64,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.Integer32]
      }, {
        size: 64,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
      }, {
        size: 64,
        align: 16,
        aliases: ['mat4x3f'],
        generic: [wgsl_type_enum_1.WgslType.Float32]
      }, {
        size: 32,
        align: 8,
        aliases: ['mat4x3h'],
        generic: [wgsl_type_enum_1.WgslType.Float16]
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Matrix44,
      variants: [{
        size: 64,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.Integer32]
      }, {
        size: 64,
        align: 16,
        generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
      }, {
        size: 64,
        align: 16,
        aliases: ['mat4x4f'],
        generic: [wgsl_type_enum_1.WgslType.Float32]
      }, {
        size: 32,
        align: 8,
        aliases: ['mat4x4h'],
        generic: [wgsl_type_enum_1.WgslType.Float16]
      }]
    });
    // Bundled types.
    pAddType({
      name: wgsl_type_enum_1.WgslType.Array,
      variants: [{
        size: -1,
        align: -1,
        generic: ['*']
      }, {
        size: -1,
        align: -1,
        generic: ['*', '*']
      }]
    });
    // Specials
    pAddType({
      name: wgsl_type_enum_1.WgslType.Atomic,
      variants: [{
        size: 4,
        align: 4,
        generic: [wgsl_type_enum_1.WgslType.Integer32]
      }, {
        size: 4,
        align: 4,
        generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
      }]
    });
    // Image textures.
    pAddType({
      name: wgsl_type_enum_1.WgslType.Texture1d,
      variants: [{
        size: -1,
        align: -1,
        generic: ['*']
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Texture2d,
      variants: [{
        size: -1,
        align: -1,
        generic: ['*']
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Texture2dArray,
      variants: [{
        size: -1,
        align: -1,
        generic: ['*']
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Texture3d,
      variants: [{
        size: -1,
        align: -1,
        generic: ['*']
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.TextureCube,
      variants: [{
        size: -1,
        align: -1,
        generic: ['*']
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.TextureCubeArray,
      variants: [{
        size: -1,
        align: -1,
        generic: ['*']
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.TextureMultisampled2d,
      variants: [{
        size: -1,
        align: -1,
        generic: ['*']
      }]
    });
    // External tetures.
    pAddType({
      name: wgsl_type_enum_1.WgslType.TextureExternal,
      variants: [{
        size: -1,
        align: -1,
        generic: []
      }]
    });
    // Storage textures.
    pAddType({
      name: wgsl_type_enum_1.WgslType.TextureStorage1d,
      variants: [{
        size: -1,
        align: -1,
        generic: ['*', '*']
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.TextureStorage2d,
      variants: [{
        size: -1,
        align: -1,
        generic: ['*', '*']
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.TextureStorage2dArray,
      variants: [{
        size: -1,
        align: -1,
        generic: ['*', '*']
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.TextureStorage3d,
      variants: [{
        size: -1,
        align: -1,
        generic: ['*', '*']
      }]
    });
    // Depth Textures.
    pAddType({
      name: wgsl_type_enum_1.WgslType.TextureDepth2d,
      variants: [{
        size: -1,
        align: -1,
        generic: []
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.TextureDepth2dArray,
      variants: [{
        size: -1,
        align: -1,
        generic: []
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.TextureDepthCube,
      variants: [{
        size: -1,
        align: -1,
        generic: []
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.TextureDepthCubeArray,
      variants: [{
        size: -1,
        align: -1,
        generic: []
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.TextureDepthMultisampled2d,
      variants: [{
        size: -1,
        align: -1,
        generic: []
      }]
    });
    // Sampler
    pAddType({
      name: wgsl_type_enum_1.WgslType.Sampler,
      variants: [{
        size: -1,
        align: -1,
        generic: []
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.SamplerComparison,
      variants: [{
        size: -1,
        align: -1,
        generic: []
      }]
    });
    // Reference and Pointer Types.
    pAddType({
      name: wgsl_type_enum_1.WgslType.Reference,
      variants: [{
        size: -1,
        align: -1,
        generic: ['*', '*', '*']
      }]
    });
    pAddType({
      name: wgsl_type_enum_1.WgslType.Pointer,
      variants: [{
        size: -1,
        align: -1,
        generic: ['*', '*', '*']
      }]
    });
  }
  /**
   * Create shader value from definition.
   * @param pValueDefinition - Shader value definition.
   */
  valueFromDefinition(pValueDefinition) {
    const lDefinitionType = this.typeFor(pValueDefinition.name, pValueDefinition.typeGenerics);
    /*
     * Read generic settings.
     */
    // BufferBindType
    // Parameter is only an layout type that can happend when specifed as function return type of parameter.
    let lBufferBindType = buffer_bind_type_enum_1.BufferBindType.Undefined;
    if (pValueDefinition.attachments['bindingType']) {
      const lBindingTypeEnum = pValueDefinition.attachments['bindingType'];
      switch (lBindingTypeEnum) {
        case 'uniform':
          {
            lBufferBindType = buffer_bind_type_enum_1.BufferBindType.Uniform;
            break;
          }
        case 'storage':
          {
            lBufferBindType = buffer_bind_type_enum_1.BufferBindType.Storage;
            break;
          }
      }
    }
    // AccessMode
    let lAccessMode = access_mode_enum_1.AccessMode.None;
    if (pValueDefinition.attachments['accessMode']) {
      const lAccessEnum = pValueDefinition.attachments['accessMode'];
      switch (lAccessEnum) {
        case 'read':
          {
            lAccessMode = access_mode_enum_1.AccessMode.Read;
            break;
          }
        case 'write':
          {
            lAccessMode = access_mode_enum_1.AccessMode.Write;
            break;
          }
        case 'read_write':
          {
            lAccessMode = access_mode_enum_1.AccessMode.Read | access_mode_enum_1.AccessMode.Write;
            break;
          }
      }
    }
    // Binding Index.
    const lBindingIndex = pValueDefinition.attachments['binding'] ? parseInt(pValueDefinition.attachments['binding']) : null;
    const lParameterIndex = pValueDefinition.attachments['location'] ? parseInt(pValueDefinition.attachments['location']) : null;
    const lCreationParameter = {
      valueDefinition: pValueDefinition,
      typeDefinition: lDefinitionType,
      accessMode: lAccessMode,
      bufferBindType: lBufferBindType,
      groupIndex: pValueDefinition.attachments['group'] ? parseInt(pValueDefinition.attachments['group']) : null,
      memoryIndex: {
        binding: lBindingIndex,
        location: lParameterIndex
      },
      visibility: this.visibilityOf(pValueDefinition.name)
    };
    /*
     * Convert different memory layouts.
     */
    // Struct.
    if (lDefinitionType.type === 'struct') {
      return this.createStructBufferLayout(lCreationParameter);
    }
    // Sampler
    if (wgsl_type_enum_1.WgslSamplerTypes.includes(lDefinitionType.typeName)) {
      return this.createSamplerLayout(lCreationParameter);
    }
    // Array buffer.
    if (wgsl_type_enum_1.WgslBufferArrayTypes.includes(lDefinitionType.typeName)) {
      return this.createArrayBufferLayout(lCreationParameter);
    }
    // Linear buffer.
    if (wgsl_type_enum_1.WgslBufferLinearTypes.includes(lDefinitionType.typeName)) {
      return this.createLinearBufferLayout(lCreationParameter);
    }
    // Textures.
    if (wgsl_type_enum_1.WgslTextureTypes.includes(lDefinitionType.typeName)) {
      return this.createTextureLayout(lCreationParameter);
    }
    // Unsupported behaviour.
    throw new core_data_1.Exception(`Shader value "${pValueDefinition.name}" has an unsupported type.`, this);
  }
  /**
   * Create array buffer layout shader value.
   * @param pParameter - Creation parameter.
   */
  createArrayBufferLayout(pParameter) {
    let lArraySize = -1;
    if (pParameter.valueDefinition.typeGenerics.length === 2) {
      const lArraySizeGeneric = pParameter.valueDefinition.typeGenerics[1];
      lArraySize = parseInt(lArraySizeGeneric);
      // Validate size generic.
      if (isNaN(lArraySize)) {
        throw new core_data_1.Exception(`Wrong size generic "${lArraySizeGeneric}" on array type.`, this);
      }
    }
    // Read inner type from generic.
    const lInnerTypeDefinition = this.fetchVariableDefinitions(pParameter.valueDefinition.typeGenerics[0])[0];
    const lInnerType = this.valueFromDefinition(lInnerTypeDefinition);
    const lArrayMemoryLayout = new array_buffer_memory_layout_1.ArrayBufferMemoryLayout(this.device, {
      arraySize: lArraySize,
      innerType: lInnerType.value,
      bindType: pParameter.bufferBindType,
      access: pParameter.accessMode,
      bindingIndex: pParameter.memoryIndex.binding,
      name: pParameter.valueDefinition.name,
      visibility: pParameter.visibility
    });
    return {
      group: pParameter.groupIndex,
      value: lArrayMemoryLayout
    };
  }
  /**
   * Create linear buffer layout shader value.
   * @param pParameter - Creation parameter.
   */
  createLinearBufferLayout(pParameter) {
    if (pParameter.typeDefinition.type !== 'buildIn') {
      throw new core_data_1.Exception('Type not supported.', this);
    }
    const lLinearBufferLayout = new linear_buffer_memory_layout_1.LinearBufferMemoryLayout(this.device, {
      size: pParameter.typeDefinition.size,
      alignment: pParameter.typeDefinition.align,
      bindType: pParameter.bufferBindType,
      access: pParameter.accessMode,
      bindingIndex: pParameter.memoryIndex.binding,
      locationIndex: pParameter.memoryIndex.location,
      name: pParameter.valueDefinition.name,
      visibility: pParameter.visibility,
      primitiveFormat: pParameter.typeDefinition.primitiveFormat ?? buffer_primitive_format_1.BufferPrimitiveFormat.Unsupported
    });
    return {
      group: pParameter.groupIndex,
      value: lLinearBufferLayout
    };
  }
  /**
   * Create sampler layout shader value.
   * @param pParameter - Creation parameter.
   */
  createSamplerLayout(pParameter) {
    if (pParameter.typeDefinition.type !== 'buildIn') {
      throw new core_data_1.Exception('Type not supported.', this);
    }
    const lSamplerType = pParameter.typeDefinition.typeName === wgsl_type_enum_1.WgslType.Sampler ? sampler_type_enum_1.SamplerType.Filter : sampler_type_enum_1.SamplerType.Comparison;
    const lSamplerMemoryLayout = new sampler_memory_layout_1.SamplerMemoryLayout(this.device, {
      samplerType: lSamplerType,
      access: pParameter.accessMode,
      bindingIndex: pParameter.memoryIndex.binding,
      name: pParameter.valueDefinition.name,
      visibility: pParameter.visibility
    });
    return {
      group: pParameter.groupIndex,
      value: lSamplerMemoryLayout
    };
  }
  /**
   * Create struct buffer layout shader value.
   * @param pParameter - Creation parameter.
   */
  createStructBufferLayout(pParameter) {
    if (pParameter.typeDefinition.type !== 'struct') {
      throw new core_data_1.Exception('Type not supported.', this);
    }
    const lStructMemoryLayout = new struct_buffer_memory_layout_1.StructBufferMemoryLayout(this.device, {
      structName: pParameter.typeDefinition.struct.name,
      bindType: pParameter.bufferBindType,
      access: pParameter.accessMode,
      bindingIndex: pParameter.memoryIndex.binding,
      name: pParameter.valueDefinition.name,
      visibility: pParameter.visibility
    });
    // Add all properties.
    for (let lPropertyIndex = 0; lPropertyIndex < pParameter.typeDefinition.struct.properties.length; lPropertyIndex++) {
      const lProperty = pParameter.typeDefinition.struct.properties[lPropertyIndex];
      lStructMemoryLayout.addProperty(lPropertyIndex, lProperty.value);
    }
    return {
      group: pParameter.groupIndex,
      value: lStructMemoryLayout
    };
  }
  /**
   * Create struct buffer layout shader value.
   * @param pParameter - Creation parameter.
   */
  createTextureLayout(pParameter) {
    if (pParameter.typeDefinition.type !== 'buildIn') {
      throw new core_data_1.Exception('Type not supported.', this);
    }
    const lTextureWgslType = pParameter.typeDefinition.typeName;
    // Uses multisamples or not.
    const lUsesMultisample = lTextureWgslType === wgsl_type_enum_1.WgslType.TextureMultisampled2d || lTextureWgslType === wgsl_type_enum_1.WgslType.TextureDepthMultisampled2d;
    const lTextureLayout = new texture_memory_layout_1.TextureMemoryLayout(this.device, {
      dimension: this.textureDimensionFromType(lTextureWgslType),
      format: this.textureDefaultFormatFromType(lTextureWgslType),
      bindType: this.textureBindTypeFromType(lTextureWgslType),
      multisampled: lUsesMultisample,
      access: pParameter.accessMode,
      bindingIndex: pParameter.memoryIndex.binding,
      name: pParameter.valueDefinition.name,
      visibility: pParameter.visibility
    });
    return {
      group: pParameter.groupIndex,
      value: lTextureLayout
    };
  }
  /**
   * Find all variable definitions and fetch data.
   * @param pSourceSnipped - Source snipped with variables.
   */
  fetchVariableDefinitions(pSourceSnipped) {
    const lDefinitionRegex = /(?<attributes>(?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:var(?:<(?<access>[\w\s,]+)?>)?\s+)?(?:(?<variable>\w+)\s*:\s*)?(?<type>(?<typename>\w+)(?:<(?<generics>[<>\w\s,]+)>)?)/gm;
    const lVariableList = new Array();
    for (const lDefinitionMatch of pSourceSnipped.matchAll(lDefinitionRegex)) {
      const lVariableTypeName = lDefinitionMatch.groups['typename'];
      const lVariableName = lDefinitionMatch.groups['variable'] ?? '';
      const lVariableAttributes = lDefinitionMatch.groups['attributes'];
      const lVariableAccess = lDefinitionMatch.groups['access'];
      const lVariableGenerics = lDefinitionMatch.groups['generics'];
      const lAttachments = {};
      // Fetch attributes.
      if (lVariableAttributes) {
        // Split string of multiple attributes.
        for (const lAttributeMatch of lVariableAttributes.matchAll(/@(?<name>[\w])+\((?<value>[^)]*)\)/g)) {
          const lAttributeName = lAttributeMatch.groups['name'];
          const lAttributeValue = lAttributeMatch.groups['value'];
          // Add each attribute as value attachment.
          lAttachments[lAttributeName] = lAttributeValue;
        }
      }
      // Parse optional acccess modifier.
      if (lVariableAccess) {
        // var<bindType|addressSpace [,accessMode]> => var<storage, read>
        const lAccessList = lVariableAccess.split(',').map(pValue => pValue.trim()).filter(pValue => pValue.length);
        // Add bind type attachment.
        lAttachments['bindingType'] = lAccessList[0];
        // Add optional accessMode attachment.
        if (lAccessList[1]) {
          lAttachments['accessMode'] = lAccessList[1];
        }
      }
      // Split generic types.
      const lGenericList = new Array();
      if (lVariableGenerics) {
        for (const lGenericMatch of lVariableGenerics.matchAll(/(?<generictype>(?:\w+(?:<.+>)?))[,\s]*/g)) {
          lGenericList.push(lGenericMatch.groups['generictype']);
        }
      }
      lVariableList.push({
        name: lVariableName,
        type: this.typeFor(lVariableTypeName, lGenericList),
        typeGenerics: lGenericList,
        attachments: lAttachments
      });
    }
    return lVariableList;
  }
  /**
   * Read texture bind type from texture wgsl type.
   * @param pTextureType - Texture wgsl type.
   * @returns
   */
  textureBindTypeFromType(pTextureType) {
    // Map every texture type for bind type.
    switch (pTextureType) {
      case wgsl_type_enum_1.WgslType.TextureExternal:
        {
          return texture_bind_type_enum_1.TextureBindType.External;
        }
      case wgsl_type_enum_1.WgslType.TextureStorage1d:
      case wgsl_type_enum_1.WgslType.TextureStorage2d:
      case wgsl_type_enum_1.WgslType.TextureStorage2dArray:
      case wgsl_type_enum_1.WgslType.TextureStorage3d:
        {
          return texture_bind_type_enum_1.TextureBindType.Storage;
        }
      case wgsl_type_enum_1.WgslType.Texture1d:
      case wgsl_type_enum_1.WgslType.TextureDepth2d:
      case wgsl_type_enum_1.WgslType.Texture2d:
      case wgsl_type_enum_1.WgslType.TextureDepthMultisampled2d:
      case wgsl_type_enum_1.WgslType.TextureMultisampled2d:
      case wgsl_type_enum_1.WgslType.TextureDepth2dArray:
      case wgsl_type_enum_1.WgslType.Texture2dArray:
      case wgsl_type_enum_1.WgslType.Texture3d:
      case wgsl_type_enum_1.WgslType.TextureCube:
      case wgsl_type_enum_1.WgslType.TextureDepthCube:
      case wgsl_type_enum_1.WgslType.TextureCubeArray:
      case wgsl_type_enum_1.WgslType.TextureDepthCubeArray:
        {
          return texture_bind_type_enum_1.TextureBindType.Images;
        }
      default:
        {
          throw new core_data_1.Exception(`Texture type "${pTextureType}" not supported for any texture bind type.`, null);
        }
    }
  }
  /**
   * Work in process texture format from texture type.
   * @param pTextureType - Texture type.
   */
  textureDefaultFormatFromType(pTextureType) {
    // Map every texture type for view dimension.
    switch (pTextureType) {
      case wgsl_type_enum_1.WgslType.Texture1d:
      case wgsl_type_enum_1.WgslType.TextureStorage1d:
      case wgsl_type_enum_1.WgslType.Texture2d:
      case wgsl_type_enum_1.WgslType.TextureStorage2d:
      case wgsl_type_enum_1.WgslType.TextureMultisampled2d:
      case wgsl_type_enum_1.WgslType.TextureExternal:
      case wgsl_type_enum_1.WgslType.Texture2dArray:
      case wgsl_type_enum_1.WgslType.TextureStorage2dArray:
      case wgsl_type_enum_1.WgslType.Texture3d:
      case wgsl_type_enum_1.WgslType.TextureStorage3d:
      case wgsl_type_enum_1.WgslType.TextureCube:
      case wgsl_type_enum_1.WgslType.TextureCubeArray:
        {
          return texture_format_enum_1.TextureFormat.BlueRedGreenAlpha;
        }
      case wgsl_type_enum_1.WgslType.TextureDepth2dArray:
      case wgsl_type_enum_1.WgslType.TextureDepthCubeArray:
      case wgsl_type_enum_1.WgslType.TextureDepthCube:
      case wgsl_type_enum_1.WgslType.TextureDepthMultisampled2d:
      case wgsl_type_enum_1.WgslType.TextureDepth2d:
        {
          return texture_format_enum_1.TextureFormat.DepthStencil;
        }
      default:
        {
          throw new core_data_1.Exception(`Texture type "${pTextureType}" not supported for any texture dimension.`, null);
        }
    }
  }
  /**
   * Read texture dimension from texture type.
   * @param pTextureType - Texture type.
   */
  textureDimensionFromType(pTextureType) {
    // Map every texture type for view dimension.
    switch (pTextureType) {
      case wgsl_type_enum_1.WgslType.Texture1d:
      case wgsl_type_enum_1.WgslType.TextureStorage1d:
        {
          return texture_dimension_enum_1.TextureDimension.OneDimension;
        }
      case wgsl_type_enum_1.WgslType.TextureDepth2d:
      case wgsl_type_enum_1.WgslType.Texture2d:
      case wgsl_type_enum_1.WgslType.TextureStorage2d:
      case wgsl_type_enum_1.WgslType.TextureDepthMultisampled2d:
      case wgsl_type_enum_1.WgslType.TextureMultisampled2d:
      case wgsl_type_enum_1.WgslType.TextureExternal:
        {
          return texture_dimension_enum_1.TextureDimension.TwoDimension;
        }
      case wgsl_type_enum_1.WgslType.TextureDepth2dArray:
      case wgsl_type_enum_1.WgslType.Texture2dArray:
      case wgsl_type_enum_1.WgslType.TextureStorage2dArray:
        {
          return texture_dimension_enum_1.TextureDimension.TwoDimensionArray;
        }
      case wgsl_type_enum_1.WgslType.Texture3d:
      case wgsl_type_enum_1.WgslType.TextureStorage3d:
        {
          return texture_dimension_enum_1.TextureDimension.ThreeDimension;
        }
      case wgsl_type_enum_1.WgslType.TextureCube:
      case wgsl_type_enum_1.WgslType.TextureDepthCube:
        {
          return texture_dimension_enum_1.TextureDimension.Cube;
        }
      case wgsl_type_enum_1.WgslType.TextureCubeArray:
      case wgsl_type_enum_1.WgslType.TextureDepthCubeArray:
        {
          return texture_dimension_enum_1.TextureDimension.CubeArray;
        }
      default:
        {
          throw new core_data_1.Exception(`Texture type "${pTextureType}" not supported for any texture dimension.`, null);
        }
    }
  }
}
exports.WebGpuShaderInterpreter = WebGpuShaderInterpreter;

/***/ }),

/***/ "./source/base/base/implementation/web_gpu/wgsl_enum/wgsl-type.enum.ts":
/*!*****************************************************************************!*\
  !*** ./source/base/base/implementation/web_gpu/wgsl_enum/wgsl-type.enum.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WgslSamplerTypes = exports.WgslTextureTypes = exports.WgslBufferArrayTypes = exports.WgslBufferLinearTypes = exports.WgslType = void 0;
var WgslType;
(function (WgslType) {
  // Scalar types.
  WgslType["Boolean"] = "bool";
  WgslType["Integer32"] = "i32";
  WgslType["UnsignedInteger32"] = "u32";
  WgslType["Float32"] = "f32";
  WgslType["Float16"] = "f16";
  // Vector types.
  WgslType["Vector2"] = "vec2";
  WgslType["Vector3"] = "vec3";
  WgslType["Vector4"] = "vec4";
  // Matrix types.
  WgslType["Matrix22"] = "mat2x2";
  WgslType["Matrix23"] = "mat2x3";
  WgslType["Matrix24"] = "mat2x4";
  WgslType["Matrix32"] = "mat3x2";
  WgslType["Matrix33"] = "mat3x3";
  WgslType["Matrix34"] = "mat3x4";
  WgslType["Matrix42"] = "mat4x2";
  WgslType["Matrix43"] = "mat4x3";
  WgslType["Matrix44"] = "mat4x4";
  // Container.
  WgslType["Array"] = "array";
  //Special.
  WgslType["Atomic"] = "atomic";
  WgslType["Pointer"] = "ptr";
  WgslType["Reference"] = "ref";
  // Textures.
  WgslType["Texture1d"] = "texture_1d";
  WgslType["Texture2d"] = "texture_2d";
  WgslType["Texture2dArray"] = "texture_2d_array";
  WgslType["Texture3d"] = "texture_3d";
  WgslType["TextureCube"] = "texture_cube";
  WgslType["TextureCubeArray"] = "texture_cube_array";
  WgslType["TextureMultisampled2d"] = "texture_multisampled_2d";
  WgslType["TextureExternal"] = "texture_external";
  // Depth texture.
  WgslType["TextureDepth2d"] = "texture_depth_2d";
  WgslType["TextureDepth2dArray"] = "texture_depth_2d_array";
  WgslType["TextureDepthCube"] = "texture_depth_cube";
  WgslType["TextureDepthCubeArray"] = "texture_depth_cube_array";
  WgslType["TextureDepthMultisampled2d"] = "texture_depth_multisampled_2d";
  // Storage textures.
  WgslType["TextureStorage1d"] = "texture_storage_1d";
  WgslType["TextureStorage2d"] = "texture_storage_2d";
  WgslType["TextureStorage2dArray"] = "texture_storage_2d_array";
  WgslType["TextureStorage3d"] = "texture_storage_3d";
  // Sampler.
  WgslType["Sampler"] = "sampler";
  WgslType["SamplerComparison"] = "sampler_comparison";
})(WgslType || (exports.WgslType = WgslType = {}));
exports.WgslBufferLinearTypes = [WgslType.Boolean, WgslType.Integer32, WgslType.UnsignedInteger32, WgslType.Float32, WgslType.Float16, WgslType.Vector2, WgslType.Vector3, WgslType.Vector4, WgslType.Matrix22, WgslType.Matrix23, WgslType.Matrix24, WgslType.Matrix32, WgslType.Matrix33, WgslType.Matrix34, WgslType.Matrix42, WgslType.Matrix43, WgslType.Matrix44];
exports.WgslBufferArrayTypes = [WgslType.Array];
exports.WgslTextureTypes = [WgslType.Texture1d, WgslType.Texture2d, WgslType.Texture2dArray, WgslType.Texture3d, WgslType.TextureCube, WgslType.TextureCubeArray, WgslType.TextureMultisampled2d, WgslType.TextureExternal, WgslType.TextureDepth2d, WgslType.TextureDepth2dArray, WgslType.TextureDepthCube, WgslType.TextureDepthCubeArray, WgslType.TextureDepthMultisampled2d, WgslType.TextureStorage1d, WgslType.TextureStorage2d, WgslType.TextureStorage2dArray, WgslType.TextureStorage3d];
exports.WgslSamplerTypes = [WgslType.Sampler, WgslType.SamplerComparison];

/***/ }),

/***/ "./source/base/base/memory_layout/base-memory-layout.ts":
/*!**************************************************************!*\
  !*** ./source/base/base/memory_layout/base-memory-layout.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseMemoryLayout = void 0;
const memory_copy_type_enum_1 = __webpack_require__(/*! ../../constant/memory-copy-type.enum */ "./source/base/constant/memory-copy-type.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
class BaseMemoryLayout extends gpu_object_1.GpuObject {
  /**
   * Buffer type access mode.
   */
  get accessMode() {
    return this.mAccessMode;
  }
  /**
   * Get binding index.
   */
  get bindingIndex() {
    return this.mBindingIndex;
  }
  /**
   * Memory type.
   */
  get memoryType() {
    return this.mMemoryType;
  }
  set memoryType(pValue) {
    this.mMemoryType = pValue;
    // Request update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Variable name of buffer.
   */
  get name() {
    return this.mName;
  }
  /**
   * Memory visibility on compute state.
   */
  get visibility() {
    return this.mVisibility;
  }
  /**
   * Constuctor.
   * @param pParameter - Parameter.
   */
  constructor(pGpu, pParameter) {
    super(pGpu);
    this.mAccessMode = pParameter.access;
    this.mName = pParameter.name;
    this.mVisibility = pParameter.visibility;
    this.mMemoryType = memory_copy_type_enum_1.MemoryCopyType.None;
    // Set optional memory indices.
    this.mBindingIndex = pParameter.bindingIndex ?? null;
  }
}
exports.BaseMemoryLayout = BaseMemoryLayout;

/***/ }),

/***/ "./source/base/base/memory_layout/buffer/array-buffer-memory-layout.ts":
/*!*****************************************************************************!*\
  !*** ./source/base/base/memory_layout/buffer/array-buffer-memory-layout.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ArrayBufferMemoryLayout = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ./base-buffer-memory-layout */ "./source/base/base/memory_layout/buffer/base-buffer-memory-layout.ts");
class ArrayBufferMemoryLayout extends base_buffer_memory_layout_1.BaseBufferMemoryLayout {
  /**
   * Alignment of type.
   */
  get alignment() {
    return this.innerType.alignment;
  }
  /**
   * Array item count.
   */
  get arraySize() {
    return this.mArraySize;
  }
  /**
   * Array type.
   */
  get innerType() {
    return this.mInnerType;
  }
  /**
   * Type size in byte.
   */
  get size() {
    if (this.arraySize === -1) {
      return this.arraySize;
    }
    return this.arraySize * (Math.ceil(this.innerType.size / this.innerType.alignment) * this.innerType.alignment);
  }
  /**
   * Constructor.
   * @param pParameter - Parameter.
   */
  constructor(pGpu, pParameter) {
    super(pGpu, pParameter);
    // Static properties.
    this.mArraySize = pParameter.arraySize;
    this.mInnerType = pParameter.innerType;
    // Set inner type parent.
    pParameter.innerType.parent = this;
  }
  /**
   * Get location of path.
   * @param pPathName - Path name. Divided by dots.
   */
  locationOf(pPathName) {
    const lPathName = [...pPathName];
    // Complete array.
    const lItemIndexString = lPathName.shift();
    if (!lItemIndexString) {
      // Only valid for ststic arrays.
      if (this.mArraySize < 0) {
        throw new core_data_1.Exception('No size can be calculated for dynamic array buffer locations.', this);
      }
      return {
        size: this.size,
        offset: 0
      };
    }
    // Validate item index.
    if (isNaN(lItemIndexString)) {
      throw new core_data_1.Exception('Array index must be a number.', this);
    }
    // Calculate size of single item.s
    const lArrayItemSize = Math.ceil(this.innerType.size / this.innerType.alignment) * this.innerType.alignment;
    const lArrayItemOffset = parseInt(lItemIndexString) * lArrayItemSize;
    // Single item.
    if (lPathName.length === 0) {
      return {
        size: lArrayItemSize,
        offset: lArrayItemSize * lArrayItemOffset
      };
    }
    // Inner property.
    const lInnerLocation = this.innerType.locationOf(lPathName);
    return {
      size: lInnerLocation.size,
      offset: lArrayItemOffset + lInnerLocation.offset
    };
  }
}
exports.ArrayBufferMemoryLayout = ArrayBufferMemoryLayout;

/***/ }),

/***/ "./source/base/base/memory_layout/buffer/base-buffer-memory-layout.ts":
/*!****************************************************************************!*\
  !*** ./source/base/base/memory_layout/buffer/base-buffer-memory-layout.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseBufferMemoryLayout = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const gpu_buffer_1 = __webpack_require__(/*! ../../buffer/gpu-buffer */ "./source/base/base/buffer/gpu-buffer.ts");
const base_memory_layout_1 = __webpack_require__(/*! ../base-memory-layout */ "./source/base/base/memory_layout/base-memory-layout.ts");
class BaseBufferMemoryLayout extends base_memory_layout_1.BaseMemoryLayout {
  /**
   * Buffer bind type.
   */
  get bindType() {
    return this.mBindType;
  }
  /**
   * Parent type. Stuct or Array.
   */
  get parent() {
    return this.mParent;
  }
  set parent(pValue) {
    this.mParent = pValue;
  }
  /**
   * Constructor.
   * @param pParameter - Parameter.
   */
  constructor(pGpu, pParameter) {
    super(pGpu, pParameter);
    // Static properties.
    this.mBindType = pParameter.bindType;
    this.mParent = null;
  }
  /**
   * Create buffer from current layout.
   * @param pInitialData - Inital buffer data.
   */
  create(pInitialData) {
    return new gpu_buffer_1.GpuBuffer(this.device, this, pInitialData);
  }
  /**
   * Get location of path.
   * @param pPathName - Path name. Divided by dots.
   */
  locationOf(pPathName) {
    // Only validate name.
    if (pPathName.length !== 0) {
      throw new core_data_1.Exception(`Simple buffer layout has no properties.`, this);
    }
    return {
      size: this.size,
      offset: 0
    };
  }
}
exports.BaseBufferMemoryLayout = BaseBufferMemoryLayout;

/***/ }),

/***/ "./source/base/base/memory_layout/buffer/linear-buffer-memory-layout.ts":
/*!******************************************************************************!*\
  !*** ./source/base/base/memory_layout/buffer/linear-buffer-memory-layout.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.LinearBufferMemoryLayout = void 0;
const base_buffer_memory_layout_1 = __webpack_require__(/*! ./base-buffer-memory-layout */ "./source/base/base/memory_layout/buffer/base-buffer-memory-layout.ts");
class LinearBufferMemoryLayout extends base_buffer_memory_layout_1.BaseBufferMemoryLayout {
  /**
   * Type byte alignment.
   */
  get alignment() {
    return this.mAlignment;
  }
  /**
   * Primitive format
   */
  get format() {
    return this.mFormat;
  }
  /**
   * Get parameter index.
   */
  get locationIndex() {
    return this.mLocationIndex;
  }
  /**
   * Buffer size in bytes.
   */
  get size() {
    return this.mSize;
  }
  /**
   * Constructor.
   * @param pParameter - Parameter.
   */
  constructor(pGpu, pParameter) {
    super(pGpu, pParameter);
    // Static properties.
    this.mAlignment = pParameter.alignment;
    this.mSize = pParameter.size;
    this.mFormat = pParameter.primitiveFormat;
    this.mLocationIndex = pParameter.locationIndex ?? null;
  }
}
exports.LinearBufferMemoryLayout = LinearBufferMemoryLayout;

/***/ }),

/***/ "./source/base/base/memory_layout/buffer/struct-buffer-memory-layout.ts":
/*!******************************************************************************!*\
  !*** ./source/base/base/memory_layout/buffer/struct-buffer-memory-layout.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StructBufferMemoryLayout = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ./base-buffer-memory-layout */ "./source/base/base/memory_layout/buffer/base-buffer-memory-layout.ts");
const linear_buffer_memory_layout_1 = __webpack_require__(/*! ./linear-buffer-memory-layout */ "./source/base/base/memory_layout/buffer/linear-buffer-memory-layout.ts");
class StructBufferMemoryLayout extends base_buffer_memory_layout_1.BaseBufferMemoryLayout {
  /**
   * Alignment of type.
   */
  get alignment() {
    return this.mAlignment;
  }
  /**
   * Ordered inner properties.
   */
  get properties() {
    return this.mInnerProperties.map(pProperty => pProperty[1]);
  }
  /**
   * Type size in byte.
   */
  get size() {
    return this.mSize;
  }
  /**
   * Struct name.
   */
  get structName() {
    return this.mStructName;
  }
  /**
   * Constructor.
   * @param pParameter - Parameter.
   */
  constructor(pGpu, pParameter) {
    super(pGpu, pParameter);
    // Calculated properties.
    this.mAlignment = 0;
    this.mSize = 0;
    // Static properties.
    this.mStructName = pParameter.structName;
    this.mInnerProperties = new Array();
  }
  /**
   * Add property to struct.
   * @param pName - Property name.
   * @param pOrder - Index of property.
   * @param pType - Property type.
   */
  addProperty(pOrder, pType) {
    this.mInnerProperties.push([pOrder, pType]);
    pType.parent = this;
    // Order properties.
    this.mInnerProperties = this.mInnerProperties.sort((pA, pB) => {
      return pA[0] - pB[0];
    });
    // Call recalculation. Or other usefull things.
    this.recalculateAlignment();
  }
  /**
   * Get types of properties with a set memory index.
   */
  bindingLayouts() {
    const lLocationTypes = new Array();
    // Include itself.
    if (this.bindingIndex !== null) {
      lLocationTypes.push(this);
    }
    // Check all properties.
    for (const [, lPropertyType] of this.mInnerProperties.values()) {
      // Get all inner locations when property is a struct type.
      if (lPropertyType instanceof StructBufferMemoryLayout) {
        // Result does include itself 
        lLocationTypes.push(...lPropertyType.bindingLayouts());
      } else if (lPropertyType.bindingIndex !== null) {
        lLocationTypes.push(lPropertyType);
      }
    }
    return lLocationTypes;
  }
  /**
   * Get types of properties with a set memory index.
   */
  locationLayouts() {
    const lLocationTypes = new Array();
    // Check all properties.
    for (const [, lPropertyType] of this.mInnerProperties.values()) {
      // Get all inner locations when property is a struct type.
      if (lPropertyType instanceof StructBufferMemoryLayout) {
        // Result does include itself 
        lLocationTypes.push(...lPropertyType.locationLayouts());
      } else if (lPropertyType instanceof linear_buffer_memory_layout_1.LinearBufferMemoryLayout && lPropertyType.locationIndex !== null) {
        lLocationTypes.push(lPropertyType);
      }
    }
    return lLocationTypes;
  }
  /**
   * Get location of path.
   * @param pPathName - Path name. Divided by dots.
   */
  locationOf(pPathName) {
    const lPathName = [...pPathName];
    // Complete array.
    const lPropertyName = lPathName.shift();
    if (!lPropertyName) {
      return {
        size: this.size,
        offset: 0
      };
    }
    // Get ordered types.
    const lOrderedTypeList = this.mInnerProperties.sort(([pOrderA], [pOrderB]) => {
      return pOrderA - pOrderB;
    }).map(([, pType]) => pType);
    // Recalculate size.
    let lPropertyOffset = 0;
    let lPropertyLayout = null;
    for (const lProperty of lOrderedTypeList) {
      // Increase offset to needed alignment.
      lPropertyOffset = Math.ceil(lPropertyOffset / lProperty.alignment) * lProperty.alignment;
      // Inner property is found. Skip searching.
      // Alignment just applied so it can be skipped later.
      if (lProperty.name === lPropertyName) {
        lPropertyLayout = lProperty;
        break;
      }
      // Increase offset for complete property.
      lPropertyOffset += lProperty.size;
    }
    // Validate property.
    if (!lPropertyLayout) {
      throw new core_data_1.Exception(`Struct buffer layout property "${lPropertyName}" not found.`, this);
    }
    const lPropertyLocation = lPropertyLayout.locationOf(lPathName);
    return {
      size: lPropertyLocation.size,
      offset: lPropertyOffset + lPropertyLocation.offset
    };
  }
  /**
   * Recalculate size and alignment.
   */
  recalculateAlignment() {
    // Recalculate size.
    let lRawDataSize = 0;
    for (const lType of this.properties) {
      // Increase offset to needed alignment.
      lRawDataSize = Math.ceil(lRawDataSize / lType.alignment) * lType.alignment;
      // Increase offset for type.
      lRawDataSize += lType.size;
      if (lType.alignment > this.mAlignment) {
        this.mAlignment = lType.alignment;
      }
    }
    // Apply struct alignment to raw data size.
    this.mSize = Math.ceil(lRawDataSize / this.mAlignment) * this.mAlignment;
  }
}
exports.StructBufferMemoryLayout = StructBufferMemoryLayout;

/***/ }),

/***/ "./source/base/base/memory_layout/sampler-memory-layout.ts":
/*!*****************************************************************!*\
  !*** ./source/base/base/memory_layout/sampler-memory-layout.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SamplerMemoryLayout = void 0;
const texture_sampler_1 = __webpack_require__(/*! ../texture/texture-sampler */ "./source/base/base/texture/texture-sampler.ts");
const base_memory_layout_1 = __webpack_require__(/*! ./base-memory-layout */ "./source/base/base/memory_layout/base-memory-layout.ts");
class SamplerMemoryLayout extends base_memory_layout_1.BaseMemoryLayout {
  /**
   * Sampler type.
   */
  get samplerType() {
    return this.mSamplerType;
  }
  /**
   * Constructor.
   * @param pParameter - Parameter.
   */
  constructor(pGpu, pParameter) {
    super(pGpu, pParameter);
    this.mSamplerType = pParameter.samplerType;
  }
  /**
   * Create texture sampler.
   */
  create() {
    return new texture_sampler_1.TextureSampler(this.device, this);
  }
}
exports.SamplerMemoryLayout = SamplerMemoryLayout;

/***/ }),

/***/ "./source/base/base/memory_layout/texture-memory-layout.ts":
/*!*****************************************************************!*\
  !*** ./source/base/base/memory_layout/texture-memory-layout.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureMemoryLayout = void 0;
const texture_usage_enum_1 = __webpack_require__(/*! ../../constant/texture-usage.enum */ "./source/base/constant/texture-usage.enum.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
const canvas_texture_1 = __webpack_require__(/*! ../texture/canvas-texture */ "./source/base/base/texture/canvas-texture.ts");
const frame_buffer_texture_1 = __webpack_require__(/*! ../texture/frame-buffer-texture */ "./source/base/base/texture/frame-buffer-texture.ts");
const image_texture_1 = __webpack_require__(/*! ../texture/image-texture */ "./source/base/base/texture/image-texture.ts");
const video_texture_1 = __webpack_require__(/*! ../texture/video-texture */ "./source/base/base/texture/video-texture.ts");
const base_memory_layout_1 = __webpack_require__(/*! ./base-memory-layout */ "./source/base/base/memory_layout/base-memory-layout.ts");
class TextureMemoryLayout extends base_memory_layout_1.BaseMemoryLayout {
  /**
   * Texture dimension.
   */
  get bindType() {
    return this.mBindType;
  }
  /**
   * Texture dimension.
   */
  get dimension() {
    return this.mDimension;
  }
  /**
   * Texture format.
   */
  get format() {
    return this.mFormat;
  }
  /**
   * Texture uses multisample.
   */
  get multisampled() {
    return this.mMultisampled;
  }
  /**
   * Texture usage. // TODO: Move into creation.
   */
  get usage() {
    return this.mUsage;
  }
  set usage(pValue) {
    this.mUsage = pValue;
    // Request update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Constructor.
   * @param pParameter - Parameter.
   */
  constructor(pGpu, pParameter) {
    super(pGpu, pParameter);
    this.mBindType = pParameter.bindType;
    this.mDimension = pParameter.dimension;
    this.mFormat = pParameter.format;
    this.mUsage = texture_usage_enum_1.TextureUsage.None;
    this.mMultisampled = pParameter.multisampled;
  }
  /**
   * Create canvas texture.
   * @param pWidth - Texture width.
   * @param pHeight - Texture height.
   */
  createCanvasTexture(pWidth, pHeight) {
    // Create and set canvas sizes.
    const lCanvasTexture = new canvas_texture_1.CanvasTexture(this.device, this);
    lCanvasTexture.width = pWidth;
    lCanvasTexture.height = pHeight;
    return lCanvasTexture;
  }
  /**
   * Create frame buffer texture.
   * @param pWidth - Texture width.
   * @param pHeight - Texture height.
   * @param pDepth - Texture depth.
   */
  createFrameBufferTexture(pWidth, pHeight, pDepth) {
    // Create and set frame buffer sizes.
    const lFrameBufferTexture = new frame_buffer_texture_1.FrameBufferTexture(this.device, this);
    lFrameBufferTexture.width = pWidth;
    lFrameBufferTexture.height = pHeight;
    lFrameBufferTexture.depth = pDepth;
    return lFrameBufferTexture;
  }
  /**
   * Create texture from images.
   * @param pSourceList - Image source list.
   */
  createImageTexture(...pSourceList) {
    var _this = this;
    return _asyncToGenerator(function* () {
      // Create and load images async.
      const lImageTexture = new image_texture_1.ImageTexture(_this.device, _this);
      yield lImageTexture.load(...pSourceList);
      return lImageTexture;
    })();
  }
  /**
   * Create texture from a video source.
   * @param pSource - Video source.
   */
  createVideoTexture(pSource) {
    // Create and set video source.
    const lVideoTexture = new video_texture_1.VideoTexture(this.device, this);
    lVideoTexture.source = pSource;
    return lVideoTexture;
  }
}
exports.TextureMemoryLayout = TextureMemoryLayout;

/***/ }),

/***/ "./source/base/base/pipeline/parameter/vertex-parameter-layout.ts":
/*!************************************************************************!*\
  !*** ./source/base/base/pipeline/parameter/vertex-parameter-layout.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexParameterLayout = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const struct_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/struct-buffer-memory-layout */ "./source/base/base/memory_layout/buffer/struct-buffer-memory-layout.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
const linear_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/linear-buffer-memory-layout */ "./source/base/base/memory_layout/buffer/linear-buffer-memory-layout.ts");
const vertex_parameter_1 = __webpack_require__(/*! ./vertex-parameter */ "./source/base/base/pipeline/parameter/vertex-parameter.ts");
class VertexParameterLayout extends gpu_object_1.GpuObject {
  /**
   * Parameter count.
   */
  get count() {
    // Highest index plus one.
    return Math.max(...this.mParameter.keys()) + 1;
  }
  /**
   * Get all parameter names.
   */
  get parameter() {
    return [...this.mParameterNames.keys()];
  }
  /**
   *
   * @param pDevice - Device reference.
   * @param pLayout - Buffer layout of parameter.
   */
  constructor(pDevice) {
    super(pDevice);
    this.mParameter = new core_data_1.Dictionary();
    this.mParameterNames = new core_data_1.Dictionary();
  }
  /**
   * Add parameter layout.
   * @param pName - Parameter name.
   * @param pLayout - Parameter layout.
   */
  add(pLayout) {
    // Find all childs of layout with locations.
    const lLocationLayoutList = new Array();
    if (pLayout instanceof struct_buffer_memory_layout_1.StructBufferMemoryLayout) {
      lLocationLayoutList.push(...pLayout.locationLayouts());
    } else if (pLayout instanceof linear_buffer_memory_layout_1.LinearBufferMemoryLayout) {
      lLocationLayoutList.push(pLayout);
    }
    // Validate existing parameter layout.
    if (lLocationLayoutList.length === 0) {
      throw new core_data_1.Exception('Pipeline parameter layout needs a parameter index.', this);
    }
    // Add each location as seperate parameter.
    for (const lLocationLayout of lLocationLayoutList) {
      // Validate existing parameter index.
      if (lLocationLayout.locationIndex === null) {
        throw new core_data_1.Exception('Pipeline parameter layout needs a parameter index.', this);
      }
      // Do not override existing parameter.
      if (this.mParameter.has(lLocationLayout.locationIndex)) {
        throw new core_data_1.Exception('Parameter does already exist.', this);
      }
      // Generate name by iterating its parents.
      let lName = lLocationLayout.name;
      let lParentLayout = lLocationLayout;
      while ((lParentLayout = lParentLayout.parent) !== null) {
        // Extend current name by its parent name.
        lName = `${lParentLayout.name}.${lName}`;
      }
      // Link name with index and index with layout.
      this.mParameterNames.set(lName, lLocationLayout.locationIndex);
      this.mParameter.set(lLocationLayout.locationIndex, lLocationLayout);
      // Register change listener for layout changes.
      lLocationLayout.addUpdateListener(() => {
        this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
      });
    }
    // Trigger update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
  }
  /**
   * Create vertex parameters from layout.
   * @param pIndexData - Index data.
   */
  createData(pIndexData) {
    return new vertex_parameter_1.VertexParameter(this.device, this, pIndexData);
  }
  /**
   * Get index of parameter.
   * @param pName - Parameter name.
   */
  getIndexOf(pName) {
    // Validate name.
    if (!this.mParameterNames.has(pName)) {
      throw new core_data_1.Exception(`Parameter name "${pName}" does not exist`, this);
    }
    return this.mParameterNames.get(pName);
  }
  /**
   * Get layout of name.
   * @param pName - Parameter name.
   */
  getLayoutOf(pName) {
    const lIndex = this.getIndexOf(pName);
    // Layout should exist when it name exists.
    return this.mParameter.get(lIndex);
  }
}
exports.VertexParameterLayout = VertexParameterLayout;

/***/ }),

/***/ "./source/base/base/pipeline/parameter/vertex-parameter.ts":
/*!*****************************************************************!*\
  !*** ./source/base/base/pipeline/parameter/vertex-parameter.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexParameter = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const access_mode_enum_1 = __webpack_require__(/*! ../../../constant/access-mode.enum */ "./source/base/constant/access-mode.enum.ts");
const buffer_bind_type_enum_1 = __webpack_require__(/*! ../../../constant/buffer-bind-type.enum */ "./source/base/constant/buffer-bind-type.enum.ts");
const buffer_primitive_format_1 = __webpack_require__(/*! ../../../constant/buffer-primitive-format */ "./source/base/constant/buffer-primitive-format.ts");
const compute_stage_enum_1 = __webpack_require__(/*! ../../../constant/compute-stage.enum */ "./source/base/constant/compute-stage.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const array_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/array-buffer-memory-layout */ "./source/base/base/memory_layout/buffer/array-buffer-memory-layout.ts");
const linear_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/linear-buffer-memory-layout */ "./source/base/base/memory_layout/buffer/linear-buffer-memory-layout.ts");
class VertexParameter extends gpu_object_1.GpuObject {
  /**
   * Get index buffer.
   */
  get indexBuffer() {
    return this.mIndexBuffer;
  }
  /**
   * Get parameter layout.
   */
  get layout() {
    return this.mLayout;
  }
  /**
   * Constructor.
   * @param pDevice - Device reference.
   * @param pVertexParameterLayout - Parameter layout.
   * @param pIndices - Index buffer data.
   */
  constructor(pDevice, pVertexParameterLayout, pIndices) {
    super(pDevice);
    // Set vertex parameter layout.
    this.mLayout = pVertexParameterLayout;
    this.mData = new core_data_1.Dictionary();
    // Create index layout.
    const lIndexLayout = new linear_buffer_memory_layout_1.LinearBufferMemoryLayout(pDevice, {
      primitiveFormat: buffer_primitive_format_1.BufferPrimitiveFormat.Uint,
      bindType: buffer_bind_type_enum_1.BufferBindType.Index,
      size: 4,
      alignment: 4,
      locationIndex: null,
      access: access_mode_enum_1.AccessMode.Read,
      bindingIndex: null,
      name: '',
      visibility: compute_stage_enum_1.ComputeStage.Vertex
    });
    // Create index buffer layout.
    const lIndexBufferLayout = new array_buffer_memory_layout_1.ArrayBufferMemoryLayout(pDevice, {
      innerType: lIndexLayout,
      arraySize: pIndices.length,
      bindType: buffer_bind_type_enum_1.BufferBindType.Index,
      access: access_mode_enum_1.AccessMode.Read,
      bindingIndex: null,
      name: '',
      visibility: compute_stage_enum_1.ComputeStage.Vertex
    });
    // Create index buffer.
    this.mIndexBuffer = lIndexBufferLayout.create(new Uint32Array(pIndices));
  }
  /**
   * Get parameter buffer.
   * @param pName - Parameter name.
   */
  get(pName) {
    // Validate.
    if (!this.mData.has(pName)) {
      throw new core_data_1.Exception(`Vertex parameter "${pName}" not found.`, this);
    }
    return this.mData.get(pName);
  }
  /**
   * Set parameter data.
   * @param pName - Parameter name.
   * @param pData - Parameter data.
   */
  set(pName, pData) {
    const lBufferLayout = this.mLayout.getLayoutOf(pName);
    // TODO: Load typed array from layout format.
    const lParameterBuffer = lBufferLayout.create(new Float32Array(pData));
    // Save gpu buffer in correct index.
    this.mData.set(pName, lParameterBuffer);
  }
}
exports.VertexParameter = VertexParameter;

/***/ }),

/***/ "./source/base/base/pipeline/target/render-targets.ts":
/*!************************************************************!*\
  !*** ./source/base/base/pipeline/target/render-targets.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderTargets = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
const texture_format_enum_1 = __webpack_require__(/*! ../../../constant/texture-format.enum */ "./source/base/constant/texture-format.enum.ts");
class RenderTargets extends gpu_object_1.GpuObject {
  /**
   * Get all color buffer.
   */
  get colorBuffer() {
    return this.mColorBuffer;
  }
  /**
   * Get depth stencil buffer.
   */
  get depthStencilBuffer() {
    return this.mDepthBuffer;
  }
  /**
   * Render targets multisamples count.
   */
  get multisampleCount() {
    return this.mTextureGroup.multiSampleLevel;
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   * @param pTextureGroup - Texture group.
   */
  constructor(pDevice, pTextureGroup) {
    super(pDevice);
    this.mTextureGroup = pTextureGroup;
    this.mColorBuffer = new Array();
    this.mDepthBuffer = null;
  }
  addColorBuffer(pBufferName, pClearValue, pLoadOp, pStoreOp, pTargetName) {
    // Read texture buffer from texture group.
    const lColorBuffer = this.mTextureGroup.getBufferTextureOf(pBufferName);
    // Read potential target buffer.
    let lTargetBuffer = null;
    if (pTargetName) {
      lTargetBuffer = this.mTextureGroup.getTargetTextureOf(pTargetName);
      // Add update listener.
      lTargetBuffer.addUpdateListener(() => {
        this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
      });
    }
    // Add update listener.
    lColorBuffer.addUpdateListener(() => {
      this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
    });
    this.mColorBuffer.push({
      texture: lColorBuffer,
      clearValue: pClearValue,
      loadOperation: pLoadOp,
      storeOperation: pStoreOp,
      resolveTarget: lTargetBuffer
    });
  }
  /**
   * Set depth and or stencil buffer.
   * @param pBufferName - Buffer Texture name.
   * @param pClearValue - Clear value in hex 0xffffff.
   * @param pLoadOp - Operation on load.
   * @param pStoreOp - Operation on store.
   */
  setDepthStencilBuffer(pBufferName, pClearValue, pLoadOp, pStoreOp) {
    // Read texture buffer from texture group.
    const lDepthBuffer = this.mTextureGroup.getBufferTextureOf(pBufferName);
    // Validate depth or stencil format.
    switch (lDepthBuffer.memoryLayout.format) {
      case texture_format_enum_1.TextureFormat.Depth:
      case texture_format_enum_1.TextureFormat.DepthStencil:
      case texture_format_enum_1.TextureFormat.Stencil:
        {
          break;
        }
      default:
        {
          throw new core_data_1.Exception('Depth and or stencil buffer needs to have depth or stencil texture formats.', this);
        }
    }
    // Update depth buffer update listener.
    if (this.mDepthBuffer) {
      this.mDepthBuffer.texture.removeUpdateListener(this.onDepthBufferUpdate);
    }
    lDepthBuffer.addUpdateListener(this.onDepthBufferUpdate);
    // Set new buffer.
    this.mDepthBuffer = {
      texture: lDepthBuffer,
      depthClearValue: pClearValue,
      depthLoadOperation: pLoadOp,
      depthStoreOperation: pStoreOp,
      stencilClearValue: pClearValue,
      stencilLoadOperation: pLoadOp,
      stencilStoreOperation: pStoreOp
    };
  }
  /**
   * Call auto update onbuffer data update.
   */
  onDepthBufferUpdate() {
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
  }
}
exports.RenderTargets = RenderTargets;

/***/ }),

/***/ "./source/base/base/pipeline/target/texture-group.ts":
/*!***********************************************************!*\
  !*** ./source/base/base/pipeline/target/texture-group.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureGroup = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const access_mode_enum_1 = __webpack_require__(/*! ../../../constant/access-mode.enum */ "./source/base/constant/access-mode.enum.ts");
const compute_stage_enum_1 = __webpack_require__(/*! ../../../constant/compute-stage.enum */ "./source/base/constant/compute-stage.enum.ts");
const texture_bind_type_enum_1 = __webpack_require__(/*! ../../../constant/texture-bind-type.enum */ "./source/base/constant/texture-bind-type.enum.ts");
const texture_dimension_enum_1 = __webpack_require__(/*! ../../../constant/texture-dimension.enum */ "./source/base/constant/texture-dimension.enum.ts");
const texture_format_enum_1 = __webpack_require__(/*! ../../../constant/texture-format.enum */ "./source/base/constant/texture-format.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const texture_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/texture-memory-layout */ "./source/base/base/memory_layout/texture-memory-layout.ts");
const render_targets_1 = __webpack_require__(/*! ./render-targets */ "./source/base/base/pipeline/target/render-targets.ts");
class TextureGroup extends gpu_object_1.GpuObject {
  /**
   * Render target height.
   */
  get height() {
    return this.mSize.height;
  }
  set height(pValue) {
    this.resize(this.mSize.width, pValue);
  }
  /**
   * Render target multisample level.
   */
  get multiSampleLevel() {
    return this.mMultisampleLevel;
  }
  /**
   * Render target height.
   */
  get width() {
    return this.mSize.width;
  }
  set width(pValue) {
    this.resize(pValue, this.mSize.height);
  }
  /**
   * Constuctor.
   * @param pDevice - Gpu device reference.
   * @param pWidth - Textures width.
   * @param pHeight - Textures height.
   * @param pMultisampleLevel - Multisample level of all buffer textures.
   */
  constructor(pDevice, pWidth, pHeight, pMultisampleLevel) {
    super(pDevice);
    // Set "fixed" 
    this.mSize = {
      width: pWidth,
      height: pHeight
    };
    this.mMultisampleLevel = pMultisampleLevel;
    // Saved.
    this.mBufferTextures = new core_data_1.Dictionary();
    this.mTargetTextures = new core_data_1.Dictionary();
  }
  /**
   * Add buffer texture to group.
   * Uses multisample values.
   * @param pName - Texture name.
   * @param pType - Texture type.
   */
  addBuffer(pName, pType) {
    // Validate existing buffer textures.
    if (this.mBufferTextures.has(pName)) {
      throw new core_data_1.Exception(`Buffer texture "${pName}" already exists.`, this);
    }
    // Create correct memory layout for texture type.
    let lMemoryLayout;
    switch (pType) {
      case 'Color':
        {
          lMemoryLayout = this.createColorMemoryLayout(this.mMultisampleLevel > 1);
          break;
        }
      case 'Depth':
        {
          lMemoryLayout = this.createDepthMemoryLayout(this.mMultisampleLevel > 1);
          break;
        }
    }
    // Create new texture and assign multisample level.
    const lTexture = lMemoryLayout.createFrameBufferTexture(this.mSize.height, this.mSize.width, 1);
    lTexture.multiSampleLevel = this.mMultisampleLevel;
    // Set buffer texture.
    this.mBufferTextures.set(pName, lTexture);
    return lTexture;
  }
  /**
   * Add target texture to group.
   * Ignores multisample values.
   * @param pName - Texture name.
   * @param pType - Texture type.
   */
  addTarget(pName) {
    // Validate existing target textures.
    if (this.mTargetTextures.has(pName)) {
      throw new core_data_1.Exception(`Target texture "${pName}" already exists.`, this);
    }
    // Create correct memory layout for texture type.
    const lMemoryLayout = this.createCanvasMemoryLayout();
    const lTexture = lMemoryLayout.createCanvasTexture(this.mSize.height, this.mSize.width);
    // Set target texture.
    this.mTargetTextures.set(pName, lTexture);
    return lTexture;
  }
  /**
   * Create render targets.
   */
  create() {
    return new render_targets_1.RenderTargets(this.device, this);
  }
  /**
   * Get buffer texture.
   * @param pName - texture name.
   */
  getBufferTextureOf(pName) {
    // Validate existing canvas.
    if (this.mBufferTextures.has(pName)) {
      throw new core_data_1.Exception(`Buffer texture "${pName}" not found.`, this);
    }
    return this.mBufferTextures.get(pName);
  }
  /**
   * Get target texture.
   * @param pName - texture name.
   */
  getTargetTextureOf(pName) {
    // Validate existing canvas.
    if (this.mTargetTextures.has(pName)) {
      throw new core_data_1.Exception(`Target texture "${pName}" not found.`, this);
    }
    return this.mTargetTextures.get(pName);
  }
  /**
   * Create layout for a canvas texture.
   */
  createCanvasMemoryLayout() {
    return new texture_memory_layout_1.TextureMemoryLayout(this.device, {
      dimension: texture_dimension_enum_1.TextureDimension.TwoDimension,
      format: texture_format_enum_1.TextureFormat.RedGreenBlueAlpha,
      bindType: texture_bind_type_enum_1.TextureBindType.RenderTarget,
      multisampled: false,
      access: access_mode_enum_1.AccessMode.Write | access_mode_enum_1.AccessMode.Read,
      bindingIndex: null,
      name: '',
      visibility: compute_stage_enum_1.ComputeStage.Fragment
    });
  }
  /**
   * Create layout for a color texture.
   */
  createColorMemoryLayout(pMultisampled) {
    return new texture_memory_layout_1.TextureMemoryLayout(this.device, {
      dimension: texture_dimension_enum_1.TextureDimension.TwoDimension,
      format: texture_format_enum_1.TextureFormat.RedGreenBlueAlpha,
      bindType: texture_bind_type_enum_1.TextureBindType.RenderTarget,
      multisampled: pMultisampled,
      access: access_mode_enum_1.AccessMode.Write | access_mode_enum_1.AccessMode.Read,
      bindingIndex: null,
      name: '',
      visibility: compute_stage_enum_1.ComputeStage.Fragment
    });
  }
  /**
   * Create layout for a depth texture.
   */
  createDepthMemoryLayout(pMultisampled) {
    return new texture_memory_layout_1.TextureMemoryLayout(this.device, {
      dimension: texture_dimension_enum_1.TextureDimension.TwoDimension,
      format: texture_format_enum_1.TextureFormat.Depth,
      bindType: texture_bind_type_enum_1.TextureBindType.RenderTarget,
      multisampled: pMultisampled,
      access: access_mode_enum_1.AccessMode.Write | access_mode_enum_1.AccessMode.Read,
      bindingIndex: null,
      name: '',
      visibility: compute_stage_enum_1.ComputeStage.Fragment
    });
  }
  /**
   * Resize all textures.
   * @param pWidth - Textures width.
   * @param pHeight - Textures height.
   */
  resize(pWidth, pHeight) {
    // Update size.
    this.mSize.width = pWidth;
    this.mSize.width = pHeight;
    // Update buffer texture sizes.
    for (const lTexture of this.mBufferTextures.values()) {
      lTexture.height = pHeight;
      lTexture.height = pWidth;
    }
    // Update target texture sizes.
    for (const lTexture of this.mTargetTextures.values()) {
      lTexture.height = pHeight;
      lTexture.height = pWidth;
    }
  }
}
exports.TextureGroup = TextureGroup;

/***/ }),

/***/ "./source/base/base/pipeline/vertex-fragment-pipeline.ts":
/*!***************************************************************!*\
  !*** ./source/base/base/pipeline/vertex-fragment-pipeline.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexFragmentPipeline = void 0;
const compare_function_enum_1 = __webpack_require__(/*! ../../constant/compare-function.enum */ "./source/base/constant/compare-function.enum.ts");
const primitive_cullmode_1 = __webpack_require__(/*! ../../constant/primitive-cullmode */ "./source/base/constant/primitive-cullmode.ts");
const primitive_front_face_1 = __webpack_require__(/*! ../../constant/primitive-front-face */ "./source/base/constant/primitive-front-face.ts");
const primitive_topology_1 = __webpack_require__(/*! ../../constant/primitive-topology */ "./source/base/constant/primitive-topology.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
class VertexFragmentPipeline extends gpu_object_1.GpuObject {
  /**
   * Set depth compare function.
   */
  get depthCompare() {
    return this.mDepthCompare;
  }
  set depthCompare(pValue) {
    this.mDepthCompare = pValue;
    // Set data changed flag.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Defines which polygon orientation will be culled.
   */
  get primitiveCullMode() {
    return this.mPrimitiveCullMode;
  }
  set primitiveCullMode(pValue) {
    this.mPrimitiveCullMode = pValue;
    // Set data changed flag.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Defines which polygons are considered front-facing.
   */
  get primitiveFrontFace() {
    return this.mPrimitiveFrontFace;
  }
  set primitiveFrontFace(pValue) {
    this.mPrimitiveFrontFace = pValue;
    // Set data changed flag.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * The type of primitive to be constructed from the vertex inputs.
   */
  get primitiveTopology() {
    return this.mPrimitiveTopology;
  }
  set primitiveTopology(pValue) {
    this.mPrimitiveTopology = pValue;
    // Set data changed flag.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Render targets.
   */
  get renderTargets() {
    return this.mRenderTargets;
  }
  /**
   * Pipeline shader.
   */
  get shader() {
    return this.mShader;
  }
  /**
   * Set depth write enabled / disabled.
   */
  get writeDepth() {
    return this.mDepthWriteEnabled;
  }
  set writeDepth(pValue) {
    this.mDepthWriteEnabled = pValue;
    // Set data changed flag.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Constructor.
   * Set default data.
   * @param pDevice - Device.
   * @param pShader - Pipeline shader.
   */
  constructor(pDevice, pShader, pRenderTargets) {
    super(pDevice);
    this.mShader = pShader;
    this.mRenderTargets = pRenderTargets;
    // Listen for render target and shader changes.
    pShader.addUpdateListener(() => {
      this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
    });
    pRenderTargets.addUpdateListener(() => {
      this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
    });
    // Depth default settings.
    this.mDepthCompare = compare_function_enum_1.CompareFunction.Less;
    this.mDepthWriteEnabled = true;
    // Primitive default settings.
    this.mPrimitiveTopology = primitive_topology_1.PrimitiveTopology.TriangleList;
    this.mPrimitiveCullMode = primitive_cullmode_1.PrimitiveCullMode.Back;
    this.mPrimitiveFrontFace = primitive_front_face_1.PrimitiveFrontFace.ClockWise;
  }
}
exports.VertexFragmentPipeline = VertexFragmentPipeline;

/***/ }),

/***/ "./source/base/base/shader/base-shader.ts":
/*!************************************************!*\
  !*** ./source/base/base/shader/base-shader.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseShader = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const bind_data_group_layout_1 = __webpack_require__(/*! ../binding/bind-data-group-layout */ "./source/base/base/binding/bind-data-group-layout.ts");
const pipeline_data_layout_1 = __webpack_require__(/*! ../binding/pipeline-data-layout */ "./source/base/base/binding/pipeline-data-layout.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
// TODO: Split into Compute- and RenderShader AND ModuleShader(Block any entry point.)
// TODO: Add ShaderModules. With own PreCompile command. (import/if/define ....)
// TODO: Maybe own language??? 
class BaseShader extends gpu_object_1.GpuObject {
  static {
    this.mBindGroupLayoutCache = new core_data_1.Dictionary();
  }
  /**
   * Shader information.
   */
  get information() {
    return this.mShaderInformation;
  }
  /**
   * Shader pipeline layout.
   */
  get pipelineLayout() {
    return this.mPipelineLayout;
  }
  /**
   * Constructor.
   * @param pDevice - Gpu Device reference.
   */
  constructor(pDevice, pSource) {
    super(pDevice);
    // Create shader information for source.
    this.mShaderInformation = this.device.shaderInterpreter.interpret(pSource);
    // Generate layout.
    this.mPipelineLayout = new pipeline_data_layout_1.PipelineDataLayout(this.device);
    for (const [lGroupIndex, lBindingList] of this.mShaderInformation.bindings) {
      // Create group layout and add each binding.
      let lGroupLayout = new bind_data_group_layout_1.BindDataGroupLayout(this.device);
      for (const lBinding of lBindingList) {
        lGroupLayout.addBinding(lBinding, lBinding.name);
      }
      // Read from cache.
      if (BaseShader.mBindGroupLayoutCache.has(lGroupLayout.identifier)) {
        lGroupLayout = BaseShader.mBindGroupLayoutCache.get(lGroupLayout.identifier);
      }
      // Cache group layout.
      BaseShader.mBindGroupLayoutCache.set(lGroupLayout.identifier, lGroupLayout);
      // Add group to pipeline.
      this.mPipelineLayout.addGroupLayout(lGroupIndex, lGroupLayout);
    }
  }
  /**
   * Get entry point name of compute stage.
   * @param pStage - Compute stage of entry point.
   */
  getEntryPoints(pStage) {
    // Ignore shader function generic. Does not matter for this function. Use only function names.
    const lEntryPointFunctions = this.mShaderInformation.entryPoints.get(pStage) ?? new Array();
    return lEntryPointFunctions.map(pFunction => {
      return pFunction.name;
    });
  }
}
exports.BaseShader = BaseShader;

/***/ }),

/***/ "./source/base/base/shader/interpreter/base-shader-interpreter.ts":
/*!************************************************************************!*\
  !*** ./source/base/base/shader/interpreter/base-shader-interpreter.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseShaderInterpreter = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const compute_stage_enum_1 = __webpack_require__(/*! ../../../constant/compute-stage.enum */ "./source/base/constant/compute-stage.enum.ts");
const buffer_primitive_format_1 = __webpack_require__(/*! ../../../constant/buffer-primitive-format */ "./source/base/constant/buffer-primitive-format.ts");
class BaseShaderInterpreter {
  /**
   * Shader bindings. Grouped by group.
   */
  get bindings() {
    return this.mBindings;
  }
  /**
   * Shader entry points.
   */
  get entryPoints() {
    return this.mEntryPoints;
  }
  /**
   * Shader source code.
   */
  get source() {
    return this.mSourceCode;
  }
  /**
   * Gpu device.
   */
  get device() {
    return this.mDevice;
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   * @param pSourceCode - Shader source code.
   */
  constructor(pDevice, pSourceCode) {
    this.mDevice = pDevice;
    this.mSourceCode = pSourceCode;
    // Setup all shader types.
    this.mShaderTypes = new core_data_1.Dictionary();
    this.mShaderTypeAliases = new core_data_1.Dictionary();
    this.setupShaderTypes(pType => {
      this.mShaderTypes.set(pType.name, pType);
      // Map all aliases of type.
      for (const lVariant of pType.variants) {
        // No aliases specified.
        if (!lVariant.aliases) {
          continue;
        }
        // Map each alias with its generics.
        for (const lAlias of lVariant.aliases) {
          this.mShaderTypeAliases.set(lAlias, {
            type: pType.name,
            generics: lVariant.generic ?? []
          });
        }
      }
    });
    // Read defintions.
    const lShaderFunctionDefinitionList = this.fetchFunctionDefinitions(pSourceCode);
    const lShaderValueDefinitionList = this.fetchValueDefinitions(pSourceCode);
    const lShaderStructDefinitionList = this.fetchStructDefinitions(pSourceCode);
    // Map shader structs.
    this.mShaderStructDefinitions = new core_data_1.Dictionary();
    for (const lStructDefinition of lShaderStructDefinitionList) {
      this.mShaderStructDefinitions.set(lStructDefinition.name, lStructDefinition);
    }
    // Meta data storages placeholders.
    this.mShaderFunctions = this.convertFunctions(lShaderFunctionDefinitionList);
    this.mShaderValue = this.convertValues(lShaderValueDefinitionList);
    // Set entry point and bindings.
    this.mEntryPoints = this.readEntryPoints();
    this.mBindings = this.readBindings();
  }
  /**
   * Get shader function.
   * @param pName - Function name.
   */
  getFunction(pName) {
    return this.mShaderFunctions.get(pName) ?? null;
  }
  /**
   * Create struct from value definition.
   * @param pValueDefinition - value definition.
   */
  structFromDefinition(pStructDefinition) {
    const lShaderStruct = {
      name: pStructDefinition.name,
      properties: new Array()
    };
    // Convert all properties to struct values.
    for (const lProperty of pStructDefinition.properies) {
      lShaderStruct.properties.push(this.valueFromDefinition(lProperty));
    }
    return lShaderStruct;
  }
  /**
   * Get type of type, alias or struct name
   * @param pTypeName - Type, alias or struct name.
   * @param pGenericNames - Generics of type. Only valid on type names.
   */
  typeFor(pTypeName, pGenericNames = []) {
    // Search for regular type.
    if (this.mShaderTypes.has(pTypeName)) {
      const lRegularType = this.mShaderTypes.get(pTypeName);
      for (const lVariant of lRegularType.variants) {
        const lVariantGenerics = lVariant.generic ?? [];
        // Validate generics.
        if (lVariantGenerics.length !== pGenericNames.length) {
          continue;
        }
        // Validate each generic value.
        let lGenericsMatches = true;
        for (let lIndex = 0; lIndex < lVariantGenerics.length; lIndex++) {
          const lTargetGeneric = lVariantGenerics[lIndex];
          const lSourceGeneric = pGenericNames[lIndex];
          // Matches any on wildcard or strict match otherwise.
          if (lTargetGeneric !== '*' && lTargetGeneric !== lSourceGeneric) {
            lGenericsMatches = false;
            break;
          }
        }
        // Generics does not match. Search next variant.
        if (!lGenericsMatches) {
          continue;
        }
        return {
          typeName: lRegularType.name,
          type: 'buildIn',
          size: lVariant.size,
          align: lVariant.align,
          primitiveFormat: lVariant.format ?? buffer_primitive_format_1.BufferPrimitiveFormat.Unsupported
        };
      }
    }
    // No gernics allows after this point.
    if (pGenericNames.length > 0) {
      throw new core_data_1.Exception(`No generics allowed for struct or alias types. Regular type "${pTypeName}<${pGenericNames.toString()}>" not found.`, this);
    }
    // Search alias type.
    if (this.mShaderTypeAliases.has(pTypeName)) {
      const lAliasType = this.mShaderTypeAliases.get(pTypeName);
      return this.typeFor(lAliasType.type, lAliasType.generics);
    }
    // Search for struct.
    if (this.mShaderStructDefinitions.has(pTypeName)) {
      const lStructDefinition = this.mShaderStructDefinitions.get(pTypeName);
      return {
        type: 'struct',
        struct: this.structFromDefinition(lStructDefinition)
      };
    }
    // Nothing found.
    throw new core_data_1.Exception(`Type "${pTypeName}" not found.`, this);
  }
  /**
   * Get visibility of global name.
   * @param pName - Name of a global.
   */
  visibilityOf(pName) {
    let lComputeStage = 0;
    for (const lShaderFunction of this.searchEntryPointsOf(pName, new Set())) {
      lComputeStage |= lShaderFunction.entryPoints;
    }
    return lComputeStage;
  }
  /**
   * Get all functions.
   * @param pSourceCode - Source code of shader.
   */
  convertFunctions(pFunctionDefinitions) {
    const lShaderFunctions = new core_data_1.Dictionary();
    for (const lDefnition of pFunctionDefinitions) {
      const lShaderFunction = this.functionFromDefinition(lDefnition);
      lShaderFunctions.set(lShaderFunction.name, lShaderFunction);
    }
    return lShaderFunctions;
  }
  /**
   * Get all global values.
   * @param pSourceCode - Source code of shader.
   */
  convertValues(pValueDefinitions) {
    const lShaderValues = new core_data_1.Dictionary();
    for (const lDefnition of pValueDefinitions) {
      const lShaderValue = this.valueFromDefinition(lDefnition);
      lShaderValues.set(lShaderValue.value.name, lShaderValue);
    }
    return lShaderValues;
  }
  /**
   * Fetch shader binds.
   * @param pSourceCode - Shader source code.
   */
  readBindings() {
    const lBindings = new core_data_1.Dictionary();
    for (const lShaderValue of this.mShaderValue.values()) {
      // Skip all values without binding group.
      if (lShaderValue.group === null) {
        continue;
      }
      // Init new bind group.
      if (!lBindings.has(lShaderValue.group)) {
        lBindings.set(lShaderValue.group, new Array());
      }
      lBindings.get(lShaderValue.group).push(lShaderValue.value);
    }
    return lBindings;
  }
  /**
   * Read entry points from crawled shader functions.
   */
  readEntryPoints() {
    const lEntryPoints = new core_data_1.Dictionary();
    // Map shader function to entry point by function tags.
    for (const lShaderFunction of this.mShaderFunctions.values()) {
      if ((lShaderFunction.entryPoints & compute_stage_enum_1.ComputeStage.Compute) === compute_stage_enum_1.ComputeStage.Compute) {
        // Init shader stage container.
        if (!lEntryPoints.has(compute_stage_enum_1.ComputeStage.Compute)) {
          lEntryPoints.set(compute_stage_enum_1.ComputeStage.Compute, new Array());
        }
        lEntryPoints.get(compute_stage_enum_1.ComputeStage.Compute).push(lShaderFunction);
      }
      if ((lShaderFunction.entryPoints & compute_stage_enum_1.ComputeStage.Vertex) === compute_stage_enum_1.ComputeStage.Vertex) {
        // Init shader stage container.
        if (!lEntryPoints.has(compute_stage_enum_1.ComputeStage.Vertex)) {
          lEntryPoints.set(compute_stage_enum_1.ComputeStage.Vertex, new Array());
        }
        lEntryPoints.get(compute_stage_enum_1.ComputeStage.Vertex).push(lShaderFunction);
      }
      if ((lShaderFunction.entryPoints & compute_stage_enum_1.ComputeStage.Fragment) === compute_stage_enum_1.ComputeStage.Fragment) {
        // Init shader stage container.
        if (!lEntryPoints.has(compute_stage_enum_1.ComputeStage.Fragment)) {
          lEntryPoints.set(compute_stage_enum_1.ComputeStage.Fragment, new Array());
        }
        lEntryPoints.get(compute_stage_enum_1.ComputeStage.Fragment).push(lShaderFunction);
      }
    }
    return lEntryPoints;
  }
  /**
   * Search for all functions hat uses the global name.
   * @param pName - variable or function name.
   * @param pScannedNames - All already scanned names. Prevents recursion.
   */
  searchEntryPointsOf(pName, pScannedNames) {
    // Add current searched name to already scanned names.
    pScannedNames.add(pName);
    const lUsedFunctionList = new Array();
    // Search all global names of all functions.
    for (const lShaderFunction of this.mShaderFunctions.values()) {
      for (const lGlobal of lShaderFunction.usedGlobals) {
        // Prevent endless recursion.
        if (pScannedNames.has(lGlobal)) {
          continue;
        }
        // Further down the rabbithole. Search for 
        if (this.mShaderFunctions.has(lGlobal)) {
          // Add found function to used function list.
          lUsedFunctionList.push(this.mShaderFunctions.get(lGlobal));
          // Recursive search for all functions that use this function.
          lUsedFunctionList.push(...this.searchEntryPointsOf(lGlobal, pScannedNames));
        }
      }
    }
    return [...new Set(lUsedFunctionList)];
  }
}
exports.BaseShaderInterpreter = BaseShaderInterpreter;

/***/ }),

/***/ "./source/base/base/shader/interpreter/shader-interpreter-factory.ts":
/*!***************************************************************************!*\
  !*** ./source/base/base/shader/interpreter/shader-interpreter-factory.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShaderInterpreterFactory = void 0;
class ShaderInterpreterFactory {
  /**
   * Constructor.
   * @param pDevice - Gpu device.
   * @param pInterpreter - Shader Interpreter
   */
  constructor(pDevice, pInterpreter) {
    this.mDevice = pDevice;
    this.mInterpreterConstructor = pInterpreter;
  }
  /**
   * Interpret source code.
   * Executes precompile commands.
   * @param pSource - Source.
   */
  interpret(pSource) {
    // TODO: Process precompile commands.
    return new this.mInterpreterConstructor(this.mDevice, pSource);
  }
}
exports.ShaderInterpreterFactory = ShaderInterpreterFactory;

/***/ }),

/***/ "./source/base/base/shader/vertex-fragment-shader.ts":
/*!***********************************************************!*\
  !*** ./source/base/base/shader/vertex-fragment-shader.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexFragmentShader = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const compute_stage_enum_1 = __webpack_require__(/*! ../../constant/compute-stage.enum */ "./source/base/constant/compute-stage.enum.ts");
const struct_buffer_memory_layout_1 = __webpack_require__(/*! ../memory_layout/buffer/struct-buffer-memory-layout */ "./source/base/base/memory_layout/buffer/struct-buffer-memory-layout.ts");
const vertex_parameter_layout_1 = __webpack_require__(/*! ../pipeline/parameter/vertex-parameter-layout */ "./source/base/base/pipeline/parameter/vertex-parameter-layout.ts");
const base_shader_1 = __webpack_require__(/*! ./base-shader */ "./source/base/base/shader/base-shader.ts");
const linear_buffer_memory_layout_1 = __webpack_require__(/*! ../memory_layout/buffer/linear-buffer-memory-layout */ "./source/base/base/memory_layout/buffer/linear-buffer-memory-layout.ts");
const vertex_fragment_pipeline_1 = __webpack_require__(/*! ../pipeline/vertex-fragment-pipeline */ "./source/base/base/pipeline/vertex-fragment-pipeline.ts");
class VertexFragmentShader extends base_shader_1.BaseShader {
  /**
   * Fragment entry point name.
   */
  get fragmentEntry() {
    return this.mFragmentEntry;
  }
  /**
   * Render parameter layout.
   */
  get parameterLayout() {
    return this.mParameterLayout;
  }
  /**
   * Shader attachment count.
   */
  get renderTargetCount() {
    return this.mAttachmentCount;
  }
  /**
   * Vertex entry point name.
   */
  get vertexEntry() {
    return this.mVertexEntry;
  }
  /**
   * Constructor.
   * @param pDevice - Gpu Device reference.
   */
  constructor(pDevice, pSource, pVertexEntry, pFragmentEntry) {
    super(pDevice, pSource);
    // Set entry points.
    this.mVertexEntry = pVertexEntry;
    this.mFragmentEntry = pFragmentEntry ?? null;
    // Validate vertex entry point.
    const lVertexEntryFunction = this.information.getFunction(this.mVertexEntry);
    if (!lVertexEntryFunction) {
      throw new core_data_1.Exception(`Vertex entry "${this.mVertexEntry}" not defined.`, this);
    } else if ((lVertexEntryFunction.entryPoints & compute_stage_enum_1.ComputeStage.Vertex) !== compute_stage_enum_1.ComputeStage.Vertex) {
      throw new core_data_1.Exception(`Vertex entry "${this.mVertexEntry}" not an defined vertex entry.`, this);
    }
    // Validate fragment entry point.
    const lFragmentEntryFunction = this.mFragmentEntry ? this.information.getFunction(this.mFragmentEntry) : null;
    if (this.mFragmentEntry) {
      // Validate entry points existance.
      if (!lFragmentEntryFunction) {
        throw new core_data_1.Exception(`Fragment entry "${this.mFragmentEntry}" not defined.`, this);
      } else if ((lFragmentEntryFunction.entryPoints & compute_stage_enum_1.ComputeStage.Fragment) !== compute_stage_enum_1.ComputeStage.Fragment) {
        throw new core_data_1.Exception(`Fragment entry "${this.mFragmentEntry}" not an defined fragment entry.`, this);
      }
    }
    // Create parameter layout and append every parameter.
    this.mParameterLayout = new vertex_parameter_layout_1.VertexParameterLayout(this.device);
    for (const lParameter of lVertexEntryFunction.parameter) {
      // Validate buffer type.
      if (!(lParameter instanceof linear_buffer_memory_layout_1.LinearBufferMemoryLayout)) {
        throw new core_data_1.Exception('Only simple data types are allowed for vertex attributes.', this);
      }
      this.mParameterLayout.add(lParameter);
    }
    // Get attachment count based on fragment function return values with an memory index.
    this.mAttachmentCount = 0;
    if (this.mFragmentEntry) {
      // Fragment has only buffer return types.
      const lFragmentReturn = lFragmentEntryFunction.return;
      if (lFragmentReturn instanceof struct_buffer_memory_layout_1.StructBufferMemoryLayout) {
        this.mAttachmentCount = lFragmentReturn.locationLayouts().length;
      } else {
        this.mAttachmentCount = 1;
      }
    }
  }
  /**
   * Create pipeline from shader.
   * @param pRenderTargets - Render targets.
   */
  createPipeline(pRenderTargets) {
    return new vertex_fragment_pipeline_1.VertexFragmentPipeline(this.device, this, pRenderTargets);
  }
}
exports.VertexFragmentShader = VertexFragmentShader;

/***/ }),

/***/ "./source/base/base/texture/canvas-texture.ts":
/*!****************************************************!*\
  !*** ./source/base/base/texture/canvas-texture.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CanvasTexture = void 0;
const gpu_object_1 = __webpack_require__(/*! ../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
class CanvasTexture extends gpu_object_1.GpuObject {
  /**
   * HTML canvas element.
   */
  get canvas() {
    return this.mCanvas;
  }
  /**
   * Texture height.
   */
  get height() {
    return this.mCanvas.height;
  }
  set height(pValue) {
    this.mCanvas.height = pValue;
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Textures memory layout.
   */
  get memoryLayout() {
    return this.mMemoryLayout;
  }
  /**
   * Texture width.
   */
  get width() {
    return this.mCanvas.width;
  }
  set width(pValue) {
    this.mCanvas.width = pValue;
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   * @param pCanvas - Canvas of texture.
   * @param pLayout - Texture layout.
   * @param pDepth - Depth of texture. Can only be set to one.
   */
  constructor(pDevice, pLayout) {
    super(pDevice);
    // Set canvas reference.
    this.mCanvas = document.createElement('canvas');
    this.mMemoryLayout = pLayout;
    // Set defaults.
    this.height = 1;
    this.width = 1;
    // Register change listener for layout changes.
    pLayout.addUpdateListener(() => {
      this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
    });
  }
}
exports.CanvasTexture = CanvasTexture;

/***/ }),

/***/ "./source/base/base/texture/frame-buffer-texture.ts":
/*!**********************************************************!*\
  !*** ./source/base/base/texture/frame-buffer-texture.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.FrameBufferTexture = void 0;
const gpu_object_1 = __webpack_require__(/*! ../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
class FrameBufferTexture extends gpu_object_1.GpuObject {
  /**
   * Texture depth.
   */
  get depth() {
    return this.mDepth;
  }
  set depth(pValue) {
    this.mDepth = pValue;
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Texture height.
   */
  get height() {
    return this.mHeight;
  }
  set height(pValue) {
    this.mHeight = pValue;
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Textures memory layout.
   */
  get memoryLayout() {
    return this.mMemoryLayout;
  }
  /**
   * Texture multi sample level.
   */
  get multiSampleLevel() {
    return this.mMultiSampleLevel;
  }
  set multiSampleLevel(pValue) {
    this.mMultiSampleLevel = pValue;
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Texture width.
   */
  get width() {
    return this.mWidth;
  }
  set width(pValue) {
    this.mWidth = pValue;
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   * @param pLayout - Texture memory layout.
   * @param pDepth - Texture depth.
   */
  constructor(pDevice, pLayout) {
    super(pDevice);
    // Fixed values.
    this.mMemoryLayout = pLayout;
    // Set defaults.
    this.mDepth = 1;
    this.mHeight = 1;
    this.mWidth = 1;
    this.mMultiSampleLevel = 1;
    // Register change listener for layout changes.
    pLayout.addUpdateListener(() => {
      this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
    });
  }
}
exports.FrameBufferTexture = FrameBufferTexture;

/***/ }),

/***/ "./source/base/base/texture/image-texture.ts":
/*!***************************************************!*\
  !*** ./source/base/base/texture/image-texture.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ImageTexture = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const gpu_object_1 = __webpack_require__(/*! ../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
class ImageTexture extends gpu_object_1.GpuObject {
  /**
   * Texture depth.
   */
  get depth() {
    return this.mDepth;
  }
  /**
   * Texture height.
   */
  get height() {
    return this.mHeight;
  }
  /**
   * Loaded html image list.
   */
  get images() {
    return this.mImageList;
  }
  /**
   * Textures memory layout.
   */
  get memoryLayout() {
    return this.mMemoryLayout;
  }
  /**
   * Texture width.
   */
  get width() {
    return this.mWidth;
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   * @param pLayout - Texture memory layout.
   */
  constructor(pDevice, pLayout) {
    super(pDevice);
    // Fixed values.
    this.mMemoryLayout = pLayout;
    // Set defaults.
    this.mDepth = 1;
    this.mHeight = 1;
    this.mWidth = 1;
    this.mImageList = new Array();
    // Register change listener for layout changes.
    pLayout.addUpdateListener(() => {
      this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
    });
  }
  /**
   * Load image into texture.
   * Images needs to have the same dimensions.
   * @param pSorceList - Source for each depth layer.
   */
  load(...pSourceList) {
    var _this = this;
    return _asyncToGenerator(function* () {
      let lHeight = 0;
      let lWidth = 0;
      // Parallel load images.
      const lImageLoadPromiseList = pSourceList.map( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(function* (pSource) {
          // Load image with html image element.
          const lImage = new Image();
          lImage.src = pSource;
          yield lImage.decode();
          // Init size.
          if (lHeight === 0 || lWidth === 0) {
            lWidth = lImage.naturalWidth;
            lHeight = lImage.naturalHeight;
          }
          // Validate same image size for all layers.
          if (lHeight !== lImage.naturalHeight || lWidth !== lImage.naturalWidth) {
            throw new core_data_1.Exception(`Texture image layers are not the same size. (${lImage.naturalWidth}, ${lImage.naturalHeight}) needs (${lWidth}, ${lHeight}).`, _this);
          }
          return createImageBitmap(lImage);
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
      // Resolve all bitmaps.
      _this.mImageList = yield Promise.all(lImageLoadPromiseList);
      // Set new texture size.
      _this.mWidth = lWidth;
      _this.mHeight = lHeight;
      _this.mDepth = pSourceList.length;
      // Trigger change.
      _this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Data);
    })();
  }
}
exports.ImageTexture = ImageTexture;

/***/ }),

/***/ "./source/base/base/texture/texture-sampler.ts":
/*!*****************************************************!*\
  !*** ./source/base/base/texture/texture-sampler.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureSampler = void 0;
const filter_mode_enum_1 = __webpack_require__(/*! ../../constant/filter-mode.enum */ "./source/base/constant/filter-mode.enum.ts");
const wrapping_mode_enum_1 = __webpack_require__(/*! ../../constant/wrapping-mode.enum */ "./source/base/constant/wrapping-mode.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
class TextureSampler extends gpu_object_1.GpuObject {
  /**
   * When provided the sampler will be a comparison sampler with the specified compare function.
   */
  get compare() {
    return this.mCompare;
  }
  set compare(pValue) {
    this.mCompare = pValue;
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Specifies the maximum levels of detail, respectively, used internally when sampling a texture.
   */
  get lodMaxClamp() {
    return this.mLodMaxClamp;
  }
  set lodMaxClamp(pValue) {
    this.mLodMaxClamp = pValue;
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Specifies the minimum levels of detail, respectively, used internally when sampling a texture.
   */
  get lodMinClamp() {
    return this.mLodMinClamp;
  }
  set lodMinClamp(pValue) {
    this.mLodMinClamp = pValue;
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * How the texture is sampled when a texel covers more than one pixel.
   */
  get magFilter() {
    return this.mMagFilter;
  }
  set magFilter(pValue) {
    this.mMagFilter = pValue;
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Specifies the maximum anisotropy value clamp used by the sampler.
   */
  get maxAnisotropy() {
    return this.mMaxAnisotropy;
  }
  set maxAnisotropy(pValue) {
    this.mMaxAnisotropy = pValue;
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Sampler memory layout.
   */
  get memoryLayout() {
    return this.mMemoryLayout;
  }
  /**
   * How the texture is sampled when a texel covers less than one pixel.
   */
  get minFilter() {
    return this.mMinFilter;
  }
  set minFilter(pValue) {
    this.mMinFilter = pValue;
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Specifies behavior for sampling between mipmap levels.
   */
  get mipmapFilter() {
    return this.mMipmapFilter;
  }
  set mipmapFilter(pValue) {
    this.mMipmapFilter = pValue;
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Texture sampler edge wrap mode.
   */
  get wrapMode() {
    return this.mWrapMode;
  }
  set wrapMode(pValue) {
    this.mWrapMode = pValue;
    // Trigger auto update.
    this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.Setting);
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   * @param pLayout - Sampler memory layout.
   */
  constructor(pDevice, pLayout) {
    super(pDevice);
    this.mMemoryLayout = pLayout;
    // Set defaults.
    this.mCompare = null;
    this.mWrapMode = wrapping_mode_enum_1.WrappingMode.ClampToEdge;
    this.mMagFilter = filter_mode_enum_1.FilterMode.Nearest;
    this.mMinFilter = filter_mode_enum_1.FilterMode.Nearest;
    this.mMipmapFilter = filter_mode_enum_1.FilterMode.Nearest;
    this.mLodMinClamp = 0;
    this.mLodMaxClamp = 32;
    this.mMaxAnisotropy = 1;
    // Register change listener for layout changes.
    pLayout.addUpdateListener(() => {
      this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
    });
  }
}
exports.TextureSampler = TextureSampler;

/***/ }),

/***/ "./source/base/base/texture/video-texture.ts":
/*!***************************************************!*\
  !*** ./source/base/base/texture/video-texture.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VideoTexture = void 0;
const gpu_object_1 = __webpack_require__(/*! ../gpu/gpu-object */ "./source/base/base/gpu/gpu-object.ts");
const gpu_object_update_reason_1 = __webpack_require__(/*! ../gpu/gpu-object-update-reason */ "./source/base/base/gpu/gpu-object-update-reason.ts");
class VideoTexture extends gpu_object_1.GpuObject {
  /**
   * Texture height.
   */
  get height() {
    return this.mVideo.videoHeight;
  }
  /**
   * If video should be looped.
   */
  get loop() {
    return this.mVideo.loop;
  }
  set loop(pValue) {
    this.mVideo.loop = pValue;
  }
  /**
   * Textures memory layout.
   */
  get memoryLayout() {
    return this.mMemoryLayout;
  }
  /**
   * Video source.
   */
  get source() {
    return this.mVideo.src;
  }
  set source(pValue) {
    this.mVideo.src = pValue;
  }
  /**
   * Video element.
   */
  get video() {
    return this.mVideo;
  }
  /**
   * Video width.
   */
  get width() {
    return this.mVideo.videoWidth;
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   * @param pLayout - Texture memory layout.
   * @param pDepth - Texture depth.
   */
  constructor(pDevice, pLayout) {
    super(pDevice);
    // Fixed values.
    this.mMemoryLayout = pLayout;
    // Create video.
    this.mVideo = new HTMLVideoElement();
    this.mVideo.loop = false;
    this.mVideo.muted = true; // Allways muted.
    // Register change listener for layout changes.
    pLayout.addUpdateListener(() => {
      this.triggerAutoUpdate(gpu_object_update_reason_1.UpdateReason.ChildData);
    });
  }
  /**
   * Pause video.
   */
  pause() {
    this.mVideo.pause();
  }
  /**
   * Play video.
   */
  play() {
    this.mVideo.play();
  }
}
exports.VideoTexture = VideoTexture;

/***/ }),

/***/ "./source/base/constant/access-mode.enum.ts":
/*!**************************************************!*\
  !*** ./source/base/constant/access-mode.enum.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AccessMode = void 0;
var AccessMode;
(function (AccessMode) {
  AccessMode[AccessMode["None"] = 0] = "None";
  AccessMode[AccessMode["Read"] = 1] = "Read";
  AccessMode[AccessMode["Write"] = 2] = "Write";
})(AccessMode || (exports.AccessMode = AccessMode = {}));

/***/ }),

/***/ "./source/base/constant/buffer-bind-type.enum.ts":
/*!*******************************************************!*\
  !*** ./source/base/constant/buffer-bind-type.enum.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BufferBindType = void 0;
var BufferBindType;
(function (BufferBindType) {
  BufferBindType["Undefined"] = "Undefined";
  BufferBindType["Index"] = "Index";
  BufferBindType["Vertex"] = "Vertex";
  BufferBindType["Uniform"] = "Uniform";
  BufferBindType["Storage"] = "Storage";
})(BufferBindType || (exports.BufferBindType = BufferBindType = {}));

/***/ }),

/***/ "./source/base/constant/buffer-primitive-format.ts":
/*!*********************************************************!*\
  !*** ./source/base/constant/buffer-primitive-format.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BufferPrimitiveFormat = void 0;
var BufferPrimitiveFormat;
(function (BufferPrimitiveFormat) {
  BufferPrimitiveFormat["Unsupported"] = "Unsupported primitive format";
  BufferPrimitiveFormat["Float"] = "float";
  BufferPrimitiveFormat["Vec2Float"] = "vector-2-float";
  BufferPrimitiveFormat["Vec3Float"] = "vector-3-float";
  BufferPrimitiveFormat["Vec4Float"] = "vector-4-float";
  BufferPrimitiveFormat["Uint"] = "unsigned-integer";
  BufferPrimitiveFormat["Vec2Uint"] = "vector-2-unsigned-integer";
  BufferPrimitiveFormat["Vec3Uint"] = "vector-3-unsigned-integer";
  BufferPrimitiveFormat["Vec4Uint"] = "vector-4-unsigned-integer";
  BufferPrimitiveFormat["Int"] = "integer";
  BufferPrimitiveFormat["Vec2Int"] = "vector-2-integer";
  BufferPrimitiveFormat["Vec3Int"] = "vector-3-integer";
  BufferPrimitiveFormat["Vec4Int"] = "vector-4-integer";
})(BufferPrimitiveFormat || (exports.BufferPrimitiveFormat = BufferPrimitiveFormat = {}));

/***/ }),

/***/ "./source/base/constant/compare-function.enum.ts":
/*!*******************************************************!*\
  !*** ./source/base/constant/compare-function.enum.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CompareFunction = void 0;
var CompareFunction;
(function (CompareFunction) {
  CompareFunction["Never"] = "never";
  CompareFunction["Less"] = "less";
  CompareFunction["Equal"] = "equal";
  CompareFunction["LessEqual"] = "less-equal";
  CompareFunction["Greater"] = "greater";
  CompareFunction["NotEqual"] = "not-equal";
  CompareFunction["GreaterEqual"] = "greater-equal";
  CompareFunction["Allways"] = "always";
})(CompareFunction || (exports.CompareFunction = CompareFunction = {}));

/***/ }),

/***/ "./source/base/constant/compute-stage.enum.ts":
/*!****************************************************!*\
  !*** ./source/base/constant/compute-stage.enum.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ComputeStage = void 0;
var ComputeStage;
(function (ComputeStage) {
  ComputeStage[ComputeStage["None"] = 0] = "None";
  ComputeStage[ComputeStage["Fragment"] = 1] = "Fragment";
  ComputeStage[ComputeStage["Vertex"] = 2] = "Vertex";
  ComputeStage[ComputeStage["Compute"] = 4] = "Compute";
})(ComputeStage || (exports.ComputeStage = ComputeStage = {}));

/***/ }),

/***/ "./source/base/constant/filter-mode.enum.ts":
/*!**************************************************!*\
  !*** ./source/base/constant/filter-mode.enum.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.FilterMode = void 0;
var FilterMode;
(function (FilterMode) {
  FilterMode["Nearest"] = "nearest";
  FilterMode["Linear"] = "linear";
})(FilterMode || (exports.FilterMode = FilterMode = {}));

/***/ }),

/***/ "./source/base/constant/memory-copy-type.enum.ts":
/*!*******************************************************!*\
  !*** ./source/base/constant/memory-copy-type.enum.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.MemoryCopyType = void 0;
var MemoryCopyType;
(function (MemoryCopyType) {
  MemoryCopyType[MemoryCopyType["None"] = 0] = "None";
  MemoryCopyType[MemoryCopyType["CopySource"] = 1] = "CopySource";
  MemoryCopyType[MemoryCopyType["CopyDestination"] = 2] = "CopyDestination";
})(MemoryCopyType || (exports.MemoryCopyType = MemoryCopyType = {}));

/***/ }),

/***/ "./source/base/constant/primitive-cullmode.ts":
/*!****************************************************!*\
  !*** ./source/base/constant/primitive-cullmode.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PrimitiveCullMode = void 0;
var PrimitiveCullMode;
(function (PrimitiveCullMode) {
  PrimitiveCullMode["None"] = "none";
  PrimitiveCullMode["Front"] = "front";
  PrimitiveCullMode["Back"] = "back";
})(PrimitiveCullMode || (exports.PrimitiveCullMode = PrimitiveCullMode = {}));

/***/ }),

/***/ "./source/base/constant/primitive-front-face.ts":
/*!******************************************************!*\
  !*** ./source/base/constant/primitive-front-face.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PrimitiveFrontFace = void 0;
var PrimitiveFrontFace;
(function (PrimitiveFrontFace) {
  PrimitiveFrontFace["CounterClockWise"] = "counter-clockwise";
  PrimitiveFrontFace["ClockWise"] = "clockwise";
})(PrimitiveFrontFace || (exports.PrimitiveFrontFace = PrimitiveFrontFace = {}));

/***/ }),

/***/ "./source/base/constant/primitive-topology.ts":
/*!****************************************************!*\
  !*** ./source/base/constant/primitive-topology.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PrimitiveTopology = void 0;
var PrimitiveTopology;
(function (PrimitiveTopology) {
  PrimitiveTopology["PointList"] = "point-list";
  PrimitiveTopology["LineList"] = "line-list";
  PrimitiveTopology["LineStrip"] = "line-strip";
  PrimitiveTopology["TriangleList"] = "triangle-list";
  PrimitiveTopology["TriangleStrip"] = "triangle-strip";
})(PrimitiveTopology || (exports.PrimitiveTopology = PrimitiveTopology = {}));

/***/ }),

/***/ "./source/base/constant/sampler-type.enum.ts":
/*!***************************************************!*\
  !*** ./source/base/constant/sampler-type.enum.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SamplerType = void 0;
var SamplerType;
(function (SamplerType) {
  SamplerType["Filter"] = "Filter";
  SamplerType["Comparison"] = "Comparison";
})(SamplerType || (exports.SamplerType = SamplerType = {}));

/***/ }),

/***/ "./source/base/constant/texture-bind-type.enum.ts":
/*!********************************************************!*\
  !*** ./source/base/constant/texture-bind-type.enum.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureBindType = void 0;
var TextureBindType;
(function (TextureBindType) {
  TextureBindType["Images"] = "Image-Texture";
  TextureBindType["External"] = "External-Texture";
  TextureBindType["Storage"] = "Storage-Texture";
  TextureBindType["RenderTarget"] = "Render-Texture";
})(TextureBindType || (exports.TextureBindType = TextureBindType = {}));

/***/ }),

/***/ "./source/base/constant/texture-dimension.enum.ts":
/*!********************************************************!*\
  !*** ./source/base/constant/texture-dimension.enum.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureDimension = void 0;
var TextureDimension;
(function (TextureDimension) {
  TextureDimension["OneDimension"] = "1d";
  TextureDimension["TwoDimension"] = "2d";
  TextureDimension["TwoDimensionArray"] = "2d-array";
  TextureDimension["Cube"] = "cube";
  TextureDimension["CubeArray"] = "cube-array";
  TextureDimension["ThreeDimension"] = "3d";
})(TextureDimension || (exports.TextureDimension = TextureDimension = {}));

/***/ }),

/***/ "./source/base/constant/texture-format.enum.ts":
/*!*****************************************************!*\
  !*** ./source/base/constant/texture-format.enum.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureFormat = void 0;
var TextureFormat;
(function (TextureFormat) {
  TextureFormat["Red"] = "r8unorm";
  TextureFormat["RedInteger"] = "r8uint";
  TextureFormat["RedGreen"] = "rg8unorm";
  TextureFormat["RedGreenInteger"] = "rg8uint";
  TextureFormat["RedGreenBlueAlpha"] = "rgba8unorm";
  TextureFormat["RedGreenBlueAlphaInteger"] = "rgba8uint";
  TextureFormat["BlueRedGreenAlpha"] = "bgra8unorm";
  TextureFormat["Depth"] = "depth24plus";
  TextureFormat["Stencil"] = "stencil8";
  TextureFormat["DepthStencil"] = "depth24plus-stencil8";
})(TextureFormat || (exports.TextureFormat = TextureFormat = {}));

/***/ }),

/***/ "./source/base/constant/texture-operation.ts":
/*!***************************************************!*\
  !*** ./source/base/constant/texture-operation.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureOperation = void 0;
var TextureOperation;
(function (TextureOperation) {
  TextureOperation["Keep"] = "keep";
  TextureOperation["Clear"] = "clear";
})(TextureOperation || (exports.TextureOperation = TextureOperation = {}));

/***/ }),

/***/ "./source/base/constant/texture-usage.enum.ts":
/*!****************************************************!*\
  !*** ./source/base/constant/texture-usage.enum.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureUsage = void 0;
var TextureUsage;
(function (TextureUsage) {
  TextureUsage[TextureUsage["None"] = 0] = "None";
  TextureUsage[TextureUsage["TextureBinding"] = 1] = "TextureBinding";
  TextureUsage[TextureUsage["StorageBinding"] = 2] = "StorageBinding";
  TextureUsage[TextureUsage["RenderAttachment"] = 4] = "RenderAttachment";
})(TextureUsage || (exports.TextureUsage = TextureUsage = {}));

/***/ }),

/***/ "./source/base/constant/wrapping-mode.enum.ts":
/*!****************************************************!*\
  !*** ./source/base/constant/wrapping-mode.enum.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WrappingMode = void 0;
var WrappingMode;
(function (WrappingMode) {
  WrappingMode["ClampToEdge"] = "clamp-to-edge";
  WrappingMode["Repeat"] = "repeat";
  WrappingMode["MirrorRepeat"] = "mirror-repeat";
})(WrappingMode || (exports.WrappingMode = WrappingMode = {}));

/***/ }),

/***/ "./page/source/shader.wgsl":
/*!*********************************!*\
  !*** ./page/source/shader.wgsl ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// ------------------------- Object Values ---------------------- //\r\n@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;\r\n@group(0) @binding(1) var<storage, read> instancePositions: array<vec4<f32>>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// ------------------------- World Values ---------------------- //\r\n@group(1) @binding(0) var<uniform> viewProjectionMatrix: mat4x4<f32>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// ------------------------- User Inputs ------------------------ //\r\n@group(2) @binding(0) var cubeTextureSampler: sampler;\r\n@group(2) @binding(1) var cubeTexture: texture_2d<f32>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// --------------------- Light calculations --------------------- //\r\nstruct AmbientLight {\r\n    color: vec4<f32>\r\n}\r\n@group(1) @binding(1) var<uniform> ambientLight: AmbientLight;\r\n\r\nstruct PointLight {\r\n    position: vec4<f32>,\r\n    color: vec4<f32>,\r\n    range: f32\r\n}\r\n@group(1) @binding(2) var<storage, read> pointLights: array<PointLight>;\r\n\r\n/**\r\n * Calculate point light output.\r\n */\r\nfn calculatePointLights(fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r\n    // Count of point lights.\r\n    let pointLightCount: u32 = arrayLength(&pointLights);\r\n\r\n    var lightResult: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r\n\r\n    for (var index: u32 = 0; index < pointLightCount; index++) {\r\n        var pointLight: PointLight = pointLights[index];\r\n\r\n        // Calculate light strength based on angle of incidence.\r\n        let lightDirection: vec4<f32> = normalize(pointLight.position - fragmentPosition);\r\n        let diffuse: f32 = max(dot(normal, lightDirection), 0.0);\r\n\r\n        lightResult += pointLight.color * diffuse;\r\n    }\r\n\r\n    return lightResult;\r\n}\r\n\r\n/**\r\n * Apply lights to fragment color.\r\n */\r\nfn applyLight(colorIn: vec4<f32>, fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r\n    var lightColor: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r\n\r\n    lightColor += ambientLight.color;\r\n    lightColor += calculatePointLights(fragmentPosition, normal);\r\n\r\n    return lightColor * colorIn;\r\n}\r\n// -------------------------------------------------------------- //\r\n\r\nstruct VertexOut {\r\n    @builtin(position) position: vec4<f32>,\r\n    @location(0) uv: vec2<f32>,\r\n    @location(1) normal: vec4<f32>,\r\n    @location(2) fragmentPosition: vec4<f32>\r\n}\r\n\r\nstruct VertexIn {\r\n    @builtin(instance_index) instanceId : u32,\r\n    @location(0) position: vec4<f32>,\r\n    @location(1) uv: vec2<f32>,\r\n    @location(2) normal: vec4<f32>\r\n}\r\n\r\n@vertex\r\nfn vertex_main(vertex: VertexIn) -> VertexOut {\r\n    var instancePosition: vec4<f32> = instancePositions[vertex.instanceId];\r\n    var instancePositionMatrix: mat4x4<f32> = mat4x4<f32>(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, instancePosition.x * 5, instancePosition.y * 5, instancePosition.z * 5, 1);\r\n\r\n    var out: VertexOut;\r\n    out.position = viewProjectionMatrix * transformationMatrix * instancePositionMatrix * vertex.position;\r\n    out.uv = vertex.uv;\r\n    out.normal = vertex.normal;\r\n    out.fragmentPosition = transformationMatrix * instancePositionMatrix * vertex.position;\r\n\r\n    return out;\r\n}\r\n\r\nstruct FragmentIn {\r\n    @location(0) uv: vec2<f32>,\r\n    @location(1) normal: vec4<f32>,\r\n    @location(2) fragmentPosition: vec4<f32>\r\n}\r\n\r\n@fragment\r\nfn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {\r\n    return applyLight(textureSample(cubeTexture, cubeTextureSampler, fragment.uv), fragment.fragmentPosition, fragment.normal);\r\n}");

/***/ }),

/***/ "../kartoffelgames.core.data/library/source/data_container/dictionary/dictionary.js":
/*!******************************************************************************************!*\
  !*** ../kartoffelgames.core.data/library/source/data_container/dictionary/dictionary.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Dictionary = void 0;
const list_1 = __webpack_require__(/*! ../list/list */ "../kartoffelgames.core.data/library/source/data_container/list/list.js");
const exception_1 = __webpack_require__(/*! ../../exception/exception */ "../kartoffelgames.core.data/library/source/exception/exception.js");
/**
 * Default dictionary.
 */
class Dictionary extends Map {
    /**
     * Add value and key to dictionary.
     * @param pKey - Key of item.
     * @param pValue - value of item.
     */
    add(pKey, pValue) {
        // Add value and key to containers.
        if (!this.has(pKey)) {
            this.set(pKey, pValue);
        }
        else {
            throw new exception_1.Exception("Can't add dublicate key to dictionary.", this);
        }
    }
    /**
     * Get all keys that have the set value.
     * @param pValue - Value.
     */
    getAllKeysOfValue(pValue) {
        // Add entires iterator to list and filter for pValue = Value
        const lKeyValuesWithValue = list_1.List.newListWith(...this.entries()).filter((pItem) => {
            return pItem[1] === pValue;
        });
        // Get only keys of key values.
        const lKeysOfKeyValue = lKeyValuesWithValue.map((pItem) => {
            return pItem[0];
        });
        return lKeysOfKeyValue;
    }
    /**
     * Get item of dictionary. If key does not exists the default value gets returned.
     * @param pKey - key of item.
     * @param pDefault - Default value if key was not found.
     */
    getOrDefault(pKey, pDefault) {
        const lValue = this.get(pKey);
        if (typeof lValue !== 'undefined') {
            return lValue;
        }
        else {
            return pDefault;
        }
    }
    /**
     * Maps information into new list.
     * @param pFunction - Mapping funktion.
     */
    map(pFunction) {
        const lResultList = new list_1.List();
        for (const lKeyValuePair of this) {
            // Execute callback and add result to list.
            const lMappingResult = pFunction(lKeyValuePair[0], lKeyValuePair[1]);
            lResultList.push(lMappingResult);
        }
        return lResultList;
    }
}
exports.Dictionary = Dictionary;
//# sourceMappingURL=dictionary.js.map

/***/ }),

/***/ "../kartoffelgames.core.data/library/source/data_container/list/list.js":
/*!******************************************************************************!*\
  !*** ../kartoffelgames.core.data/library/source/data_container/list/list.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.List = void 0;
/**
 * Extended array functionality.
 */
class List extends Array {
    /**
     * Create list and add items.
     * @param pItemList - Items.
     */
    static newListWith(...pItemList) {
        const lNewList = new List();
        lNewList.push(...pItemList);
        return lNewList;
    }
    /**
     * Clear list.
     */
    clear() {
        this.splice(0, this.length);
    }
    /**
     * Copy first layer of object.
     */
    clone() {
        return List.newListWith(...this);
    }
    /**
     * Distinct values inside list.
     */
    distinct() {
        const lSelf = this;
        // Get all values where index is same index as first index of first appearance.
        const lDistinctArray = this.filter((pValue, pIndex) => {
            return lSelf.indexOf(pValue) === pIndex;
        });
        return List.newListWith(...lDistinctArray);
    }
    /**
     * Check if arrays are the same.
     * @param pArray - Array.
     */
    equals(pArray) {
        // Check if array are same, dont null and have same length.
        if (this === pArray) {
            return true;
        }
        else if (!pArray || this.length !== pArray.length) {
            return false;
        }
        // Check each item.
        for (let lIndex = 0; lIndex < this.length; ++lIndex) {
            if (this[lIndex] !== pArray[lIndex]) {
                return false;
            }
        }
        return true;
    }
    /**
     * Removes the first appearence of value.
     * @param pValue - value requested for removement.
     */
    remove(pValue) {
        const lFoundIndex = this.indexOf(pValue);
        // Only remove if found.
        if (lFoundIndex !== -1) {
            return this.splice(lFoundIndex, 1)[0];
        }
        return undefined;
    }
    /**
     * Replace first appearence of value.
     * @param pOldValue - Target value to replace.
     * @param pNewValue - Replacement value.
     */
    replace(pOldValue, pNewValue) {
        const lFoundIndex = this.indexOf(pOldValue);
        // Only replace if found.
        if (lFoundIndex !== -1) {
            // Save old value and replace it with new value.
            const lOldValue = this[lFoundIndex];
            this[lFoundIndex] = pNewValue;
            return lOldValue;
        }
        return undefined;
    }
    /**
     * List to string.
     */
    toString() {
        return `[${super.join(', ')}]`;
    }
}
exports.List = List;
//# sourceMappingURL=list.js.map

/***/ }),

/***/ "../kartoffelgames.core.data/library/source/data_container/tree/base-tree.js":
/*!***********************************************************************************!*\
  !*** ../kartoffelgames.core.data/library/source/data_container/tree/base-tree.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseTree = void 0;
const dictionary_1 = __webpack_require__(/*! ../dictionary/dictionary */ "../kartoffelgames.core.data/library/source/data_container/dictionary/dictionary.js");
const list_1 = __webpack_require__(/*! ../list/list */ "../kartoffelgames.core.data/library/source/data_container/list/list.js");
/**
 * BaseTree with generic path.
 */
class BaseTree {
    /**
     * Get all child branches of branch.
     */
    get branchList() {
        return list_1.List.newListWith(...this.mBranches.values());
    }
    /**
     * Get parent branch.
     */
    get parent() {
        return this.mParent;
    }
    /**
     * Constructor.
     * Basic initialization.
     */
    constructor() {
        this.mBranches = new dictionary_1.Dictionary();
        this.mParent = null;
    }
    /**
     * Adds new branch to tree.
     * Does nothing if branch already exists.
     * Returns last added branch.
     * @param pBranchPath -  Branch to add.
     */
    addBranch(...pBranchPath) {
        // If new branch can be added.
        if (pBranchPath.length !== 0) {
            const lCurrentBranchKey = pBranchPath.splice(0, 1)[0];
            // Create new branch if not created.
            if (!this.mBranches.has(lCurrentBranchKey)) {
                // Set this as new branch parent.
                const lNewBranch = this.createNewBranch(lCurrentBranchKey);
                lNewBranch.mParent = this;
                this.mBranches.add(lCurrentBranchKey, lNewBranch);
            }
            // Add next branch path.
            const lCurrentBranch = this.mBranches.get(lCurrentBranchKey);
            return lCurrentBranch.addBranch(...pBranchPath);
        }
        return this;
    }
    /**
     * Get all paths of tree.
     * @param pPath - Additional paths.
     */
    getAllPaths() {
        return this.extendPath(new list_1.List());
    }
    /**
     * Get Tree by branch path. Return undefined if no branch was found.
     * @param pBranchPath - Branch path.
     */
    getBranch(...pBranchPath) {
        // If no path was specified. Return this tree.
        if (pBranchPath.length === 0) {
            return this;
        }
        // Check if this tree has branch
        if (this.mBranches.has(pBranchPath[0])) {
            // remove first item in branch and safe.
            const lCurrentLocationBranchValue = pBranchPath.splice(0, 1)[0];
            const lCurrentLocationBranch = this.mBranches.get(lCurrentLocationBranchValue);
            // Seach branch in next tree with modified path.
            return lCurrentLocationBranch.getBranch(...pBranchPath);
        }
        // No branch found.
        return undefined;
    }
    /**
     * Check if path exists.
     * Path specifed path doesn't need to have values.
     * @param pBranchPath - Path to branch.
     */
    hasPath(...pBranchPath) {
        return !!this.getBranch(...pBranchPath);
    }
    /**
     * Removes branch by path.
     * Returns undefined if branch does not exist.
     * @param pBranchPath - Path to branch.
     */
    removeBranch(...pBranchPath) {
        const lFoundBranch = this.getBranch(...pBranchPath);
        // Check if parameter or branch exists.
        if (pBranchPath.length === 0 || !lFoundBranch) {
            return undefined;
        }
        else if (pBranchPath.length === 1) {
            const lFirstBranchPathValue = pBranchPath[0];
            // Remove branch if path has only one level.
            // Does not throw if no element was found.
            const lRemovedBranch = this.mBranches.get(lFirstBranchPathValue);
            this.mBranches.delete(lFirstBranchPathValue);
            // Remove parent and return.
            lRemovedBranch.mParent = null;
            return lRemovedBranch;
        }
        // Get parent and remove branch last path element. Parent of child is always set.
        const lParentBranch = lFoundBranch.parent;
        return lParentBranch.removeBranch(pBranchPath.pop());
    }
    /**
     * Extends specified path with all possible paths of current tree branches.
     * @param pStartingPath - Staring path.
     */
    extendPath(pStartingPath) {
        const lExtendedPaths = new Array();
        // Get extended path of all branches.
        for (const lBranchKey of this.mBranches.keys()) {
            const lBranchPath = list_1.List.newListWith(...pStartingPath, lBranchKey);
            // Add path to current branch.
            lExtendedPaths.push(lBranchPath);
            // Get all paths of branch.
            const lBranch = this.mBranches.get(lBranchKey);
            lExtendedPaths.push(...lBranch.extendPath(lBranchPath));
        }
        return lExtendedPaths;
    }
}
exports.BaseTree = BaseTree;
//# sourceMappingURL=base-tree.js.map

/***/ }),

/***/ "../kartoffelgames.core.data/library/source/data_container/tree/list-tree.js":
/*!***********************************************************************************!*\
  !*** ../kartoffelgames.core.data/library/source/data_container/tree/list-tree.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListTree = void 0;
const base_tree_1 = __webpack_require__(/*! ./base-tree */ "../kartoffelgames.core.data/library/source/data_container/tree/base-tree.js");
const list_1 = __webpack_require__(/*! ../list/list */ "../kartoffelgames.core.data/library/source/data_container/list/list.js");
/**
 * Tree with additional item list.
 */
class ListTree extends base_tree_1.BaseTree {
    /**
     * Get all items of this branch and all of its childs.
     */
    get deepItemList() {
        return this.getDeepItemList();
    }
    /**
     * Get item of this branch
     */
    get itemList() {
        return this.mItemList.clone();
    }
    /**
     * Initialise list.
     */
    constructor() {
        super();
        this.mItemList = new list_1.List();
    }
    /**
     * Add items to branch.
     * @param pItemList - Item list.
     */
    addItem(...pItemList) {
        this.mItemList.push(...pItemList);
        return this;
    }
    /**
     * Creates new branch.
     * @param pBranchKey - Branch key for new branch.
     */
    createNewBranch(_pBranchKey) {
        return new ListTree();
    }
    /**
     * Get all listed items on branch and its childs.
     */
    getDeepItemList() {
        const lFoundItems = list_1.List.newListWith(...this.mItemList);
        // Find all items recurive.
        for (const lBranch of this.branchList) {
            lFoundItems.push(...lBranch.getDeepItemList());
        }
        return lFoundItems;
    }
}
exports.ListTree = ListTree;
//# sourceMappingURL=list-tree.js.map

/***/ }),

/***/ "../kartoffelgames.core.data/library/source/data_container/tree/tree.js":
/*!******************************************************************************!*\
  !*** ../kartoffelgames.core.data/library/source/data_container/tree/tree.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tree = void 0;
const base_tree_1 = __webpack_require__(/*! ./base-tree */ "../kartoffelgames.core.data/library/source/data_container/tree/base-tree.js");
/**
 * Tree with generic path.
 */
class Tree extends base_tree_1.BaseTree {
    /**
     * Create new emtpy branch.
     */
    createNewBranch(_pBranchKey) {
        return new Tree();
    }
}
exports.Tree = Tree;
//# sourceMappingURL=tree.js.map

/***/ }),

/***/ "../kartoffelgames.core.data/library/source/exception/exception.js":
/*!*************************************************************************!*\
  !*** ../kartoffelgames.core.data/library/source/exception/exception.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Exception = void 0;
/**
 * Basic exception.
 */
class Exception extends Error {
    /**
     * Target exception throws.
     */
    get target() {
        return this.mTarget;
    }
    /**
     * Constructor. Create exception.
     * @param pMessage - Messsage of exception.
     * @param pTarget - Target exception throws.
     */
    constructor(pMessage, pTarget) {
        super(pMessage);
        this.mTarget = pTarget;
    }
}
exports.Exception = Exception;
//# sourceMappingURL=exception.js.map

/***/ }),

/***/ "../kartoffelgames.core.data/library/source/index.js":
/*!***********************************************************!*\
  !*** ../kartoffelgames.core.data/library/source/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/* istanbul ignore file */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeUtil = exports.EnumUtil = exports.Exception = exports.Tree = exports.ListTree = exports.List = exports.Dictionary = void 0;
// Container.
var dictionary_1 = __webpack_require__(/*! ./data_container/dictionary/dictionary */ "../kartoffelgames.core.data/library/source/data_container/dictionary/dictionary.js");
Object.defineProperty(exports, "Dictionary", ({ enumerable: true, get: function () { return dictionary_1.Dictionary; } }));
var list_1 = __webpack_require__(/*! ./data_container/list/list */ "../kartoffelgames.core.data/library/source/data_container/list/list.js");
Object.defineProperty(exports, "List", ({ enumerable: true, get: function () { return list_1.List; } }));
var list_tree_1 = __webpack_require__(/*! ./data_container/tree/list-tree */ "../kartoffelgames.core.data/library/source/data_container/tree/list-tree.js");
Object.defineProperty(exports, "ListTree", ({ enumerable: true, get: function () { return list_tree_1.ListTree; } }));
var tree_1 = __webpack_require__(/*! ./data_container/tree/tree */ "../kartoffelgames.core.data/library/source/data_container/tree/tree.js");
Object.defineProperty(exports, "Tree", ({ enumerable: true, get: function () { return tree_1.Tree; } }));
var exception_1 = __webpack_require__(/*! ./exception/exception */ "../kartoffelgames.core.data/library/source/exception/exception.js");
Object.defineProperty(exports, "Exception", ({ enumerable: true, get: function () { return exception_1.Exception; } }));
// Handler.
var enum_util_1 = __webpack_require__(/*! ./util/enum-util */ "../kartoffelgames.core.data/library/source/util/enum-util.js");
Object.defineProperty(exports, "EnumUtil", ({ enumerable: true, get: function () { return enum_util_1.EnumUtil; } }));
var type_util_1 = __webpack_require__(/*! ./util/type-util */ "../kartoffelgames.core.data/library/source/util/type-util.js");
Object.defineProperty(exports, "TypeUtil", ({ enumerable: true, get: function () { return type_util_1.TypeUtil; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../kartoffelgames.core.data/library/source/util/enum-util.js":
/*!********************************************************************!*\
  !*** ../kartoffelgames.core.data/library/source/util/enum-util.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnumUtil = void 0;
/**
 * Enumaration helper.
 */
class EnumUtil {
    /**
     * Return enum of enum value.
     * @param pEnum - typeof Enum object.
     * @param pValue - Value of enum.
     */
    static enumKeyByValue(pEnum, pValue) {
        // Thats it... :)
        if (EnumUtil.enumValueExists(pEnum, pValue)) {
            return pValue;
        }
        else {
            return undefined;
        }
    }
    /**
     * Return all keys of an enum as array.
     * @param pEnum - typeof Enum object.
     */
    static enumNamesToArray(pEnum) {
        // Convert enum to key array.
        return Object.keys(pEnum).filter((pKey) => isNaN(Number(pKey)));
    }
    /**
     * Check if value exists in enum object.
     * @param pEnum - typeof Enum object.
     * @param pValue - Value of enum.
     */
    static enumValueExists(pEnum, pValue) {
        return EnumUtil.enumValuesToArray(pEnum).includes(pValue);
    }
    /**
     * Return all values of an enum as array.
     * @param pEnum - typeof Enum object.
     */
    static enumValuesToArray(pEnum) {
        const lEnumValues = new Array();
        // Convert enum to vaue array by iterating over all keys.
        for (const lKey of EnumUtil.enumNamesToArray(pEnum)) {
            lEnumValues.push(pEnum[lKey]);
        }
        return lEnumValues;
    }
}
exports.EnumUtil = EnumUtil;
//# sourceMappingURL=enum-util.js.map

/***/ }),

/***/ "../kartoffelgames.core.data/library/source/util/type-util.js":
/*!********************************************************************!*\
  !*** ../kartoffelgames.core.data/library/source/util/type-util.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeUtil = void 0;
/**
 * Type helper.
 */
class TypeUtil {
    /**
     * Check existence of a member name and return that name.
     * @param pName - Property name.
     */
    static nameOf(pName) {
        return pName;
    }
}
exports.TypeUtil = TypeUtil;
//# sourceMappingURL=type-util.js.map

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!******************************!*\
  !*** ./page/source/index.ts ***!
  \******************************/


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
const gpu_device_1 = __webpack_require__(/*! ../../source/base/base/gpu/gpu-device */ "./source/base/base/gpu/gpu-device.ts");
const web_gpu_generator_factory_1 = __webpack_require__(/*! ../../source/base/base/implementation/web_gpu/web-gpu-generator-factory */ "./source/base/base/implementation/web_gpu/web-gpu-generator-factory.ts");
const web_gpu_shader_interpreter_1 = __webpack_require__(/*! ../../source/base/base/implementation/web_gpu/web-gpu-shader-interpreter */ "./source/base/base/implementation/web_gpu/web-gpu-shader-interpreter.ts");
const primitive_cullmode_1 = __webpack_require__(/*! ../../source/base/constant/primitive-cullmode */ "./source/base/constant/primitive-cullmode.ts");
const texture_operation_1 = __webpack_require__(/*! ../../source/base/constant/texture-operation */ "./source/base/constant/texture-operation.ts");
const cube_1 = __webpack_require__(/*! ./cube/cube */ "./page/source/cube/cube.ts");
const shader_wgsl_1 = __webpack_require__(/*! ./shader.wgsl */ "./page/source/shader.wgsl");
const ambient_light_1 = __webpack_require__(/*! ./something_better/light/ambient-light */ "./page/source/something_better/light/ambient-light.ts");
const transform_1 = __webpack_require__(/*! ./something_better/transform */ "./page/source/something_better/transform.ts");
const perspective_projection_1 = __webpack_require__(/*! ./something_better/view_projection/projection/perspective-projection */ "./page/source/something_better/view_projection/projection/perspective-projection.ts");
const view_projection_1 = __webpack_require__(/*! ./something_better/view_projection/view-projection */ "./page/source/something_better/view_projection/view-projection.ts");
const gHeight = 10;
const gWidth = 10;
const gDepth = 10;
_asyncToGenerator(function* () {
  const lGpu = yield gpu_device_1.GpuDevice.request(new web_gpu_generator_factory_1.WebGpuGeneratorFactory('high-performance'), web_gpu_shader_interpreter_1.WebGpuShaderInterpreter);
  // Create and configure render targets.
  const lTextureGroup = lGpu.textureGroup(640, 640, 2);
  lTextureGroup.addBuffer('color', 'Color');
  lTextureGroup.addBuffer('depth', 'Depth');
  lTextureGroup.addTarget('canvas');
  // Create shader.
  const lShader = lGpu.renderShader(shader_wgsl_1.default, 'vertex_main', 'fragment_main');
  /*
   * Transformation and position group.
   */
  const lTransformationGroupLayout = lShader.pipelineLayout.getGroupLayout(0);
  const lTransformationGroup = lTransformationGroupLayout.createGroup();
  // Create transformation.
  const lCubeTransform = new transform_1.Transform();
  lCubeTransform.setScale(0.1, 0.1, 0.1);
  lTransformationGroup.setData('transformationMatrix', lTransformationGroupLayout.getBind('transformationMatrix').layout.create(new Float32Array(lCubeTransform.getMatrix(transform_1.TransformMatrix.Transformation).dataArray)));
  // Create instance positions.
  const lCubeInstanceTransformationData = new Array();
  for (let lWidthIndex = 0; lWidthIndex < gWidth; lWidthIndex++) {
    for (let lHeightIndex = 0; lHeightIndex < gHeight; lHeightIndex++) {
      for (let lDepthIndex = 0; lDepthIndex < gDepth; lDepthIndex++) {
        lCubeInstanceTransformationData.push(lWidthIndex, lHeightIndex, lDepthIndex, 1);
      }
    }
  }
  lTransformationGroup.setData('transformationMatrix', lTransformationGroupLayout.getBind('transformationMatrix').layout.create(new Float32Array(lCubeInstanceTransformationData)));
  /*
   * Camera and world group.
   */
  const lWorldGroupLayout = lShader.pipelineLayout.getGroupLayout(1);
  const lWorldGroup = lWorldGroupLayout.createGroup();
  // Create camera perspective.
  const lPerspectiveProjection = new perspective_projection_1.PerspectiveProjection();
  lPerspectiveProjection.aspectRatio = lTextureGroup.width / lTextureGroup.height;
  lPerspectiveProjection.angleOfView = 72;
  lPerspectiveProjection.near = 0.1;
  lPerspectiveProjection.far = 9999999;
  // Create camera.
  const lCamera = new view_projection_1.ViewProjection(lPerspectiveProjection);
  lCamera.transformation.setTranslation(0, 0, -4);
  lWorldGroup.setData('viewProjectionMatrix', lWorldGroupLayout.getBind('viewProjectionMatrix').layout.create(new Float32Array(lCamera.getMatrix(view_projection_1.CameraMatrix.ViewProjection).dataArray)));
  // Create ambient light.
  const lAmbientLight = new ambient_light_1.AmbientLight();
  lAmbientLight.setColor(0.1, 0.1, 0.1);
  lWorldGroup.setData('ambientLight', lWorldGroupLayout.getBind('ambientLight').layout.create(new Float32Array(lCamera.getMatrix(view_projection_1.CameraMatrix.ViewProjection).dataArray)));
  // Create point lights.
  lWorldGroup.setData('pointLights', lWorldGroupLayout.getBind('pointLights').layout.create(new Float32Array([/* Position */1, 1, 1, 1, /* Color */1, 0, 0, 1, /* Range */200, 0, 0, 0, /* Position */10, 10, 10, 1, /* Color */0, 0, 1, 1, /* Range */200, 0, 0, 0])));
  /*
   * User defined group.
   */
  const lUserGroupLayout = lShader.pipelineLayout.getGroupLayout(2);
  const lUserGroup = lUserGroupLayout.createGroup();
  // Setup cube texture.
  const lCubeTexture = yield lUserGroupLayout.getBind('cubeTexture').layout.createImageTexture('/source/cube_texture/cube-texture.png');
  lUserGroup.setData('cubeTexture', lCubeTexture);
  // Setup Sampler.
  const lCubeSampler = lUserGroupLayout.getBind('cubeTextureSampler').layout.create();
  lUserGroup.setData('cubeTextureSampler', lCubeSampler);
  // Generate render parameter from parameter layout.
  const lMesh = lShader.parameterLayout.createData(cube_1.CubeVertexIndices);
  lMesh.set('vertex.position', cube_1.CubeVertexPositionData);
  lMesh.set('vertex.uv', cube_1.CubeVertexUvData); // TODO: Convert to Indexbased parameter.
  lMesh.set('vertex.normal', cube_1.CubeVertexNormalData); // TODO: Convert to Indexbased parameter.
  // Set render targets.
  const lRenderTargets = lTextureGroup.create();
  lRenderTargets.addColorBuffer('color', 0xaaaaaa, texture_operation_1.TextureOperation.Clear, texture_operation_1.TextureOperation.Keep, 'canvas');
  lRenderTargets.setDepthStencilBuffer('depth', 0xff, texture_operation_1.TextureOperation.Clear, texture_operation_1.TextureOperation.Keep);
  // Create pipeline.
  const lPipeline = lShader.createPipeline(lRenderTargets);
  lPipeline.primitiveCullMode = primitive_cullmode_1.PrimitiveCullMode.Back;
  // Create executor.
  const lInstructionExecutor = lGpu.instructionExecutor();
  // Create instruction.
  const lRenderInstruction = lInstructionExecutor.createVertexFragmentInstruction(lRenderTargets);
  lRenderInstruction.addStep(lPipeline, lMesh, {
    0: lTransformationGroup,
    1: lWorldGroup,
    2: lUserGroup
  });
  // TODO: Instruction set execution.
  let lLastTime = 0;
  const lRender = pTime => {
    // Start new frame.
    lGpu.startNewFrame();
    // Generate encoder and add render commands.
    lInstructionExecutor.execute();
    const lFps = 1000 / (pTime - lLastTime);
    window.currentFps = lFps;
    lLastTime = pTime;
    // Refresh canvas
    requestAnimationFrame(lRender);
  };
  requestAnimationFrame(lRender);
})();
})();

Page = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=page.js.map