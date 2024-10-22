var Page;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../../node_modules/ansi-html-community/index.js":
/*!*******************************************************!*\
  !*** ../../node_modules/ansi-html-community/index.js ***!
  \*******************************************************/
/***/ ((module) => {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),

/***/ "./page/source/camera/light/ambient-light.ts":
/*!***************************************************!*\
  !*** ./page/source/camera/light/ambient-light.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AmbientLight = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const vector_1 = __webpack_require__(/*! ../math/vector */ "./page/source/camera/math/vector.ts");
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
      throw new core_1.Exception(`Color values need to be in 0 to 1 range. (R:${pRed}, G:${pGreen}, B:${pBlue})`, this);
    }
    this.mColor.data[0] = pRed;
    this.mColor.data[1] = pGreen;
    this.mColor.data[2] = pBlue;
  }
}
exports.AmbientLight = AmbientLight;

/***/ }),

/***/ "./page/source/camera/math/euler.ts":
/*!******************************************!*\
  !*** ./page/source/camera/math/euler.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


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

/***/ "./page/source/camera/math/matrix.ts":
/*!*******************************************!*\
  !*** ./page/source/camera/math/matrix.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Matrix = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const vector_1 = __webpack_require__(/*! ./vector */ "./page/source/camera/math/vector.ts");
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
        throw new core_1.Exception('Matrices need to be the same size for calculation.', this);
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
        throw new core_1.Exception('Matrices A width and B height must match for multiplication.', this);
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
        throw new core_1.Exception('Matrices need to be the same size for calculation.', this);
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
      throw new core_1.Exception('Matrices A width and B height must match for multiplication.', this);
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

/***/ "./page/source/camera/math/quaternion.ts":
/*!***********************************************!*\
  !*** ./page/source/camera/math/quaternion.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Quaternion = void 0;
const euler_1 = __webpack_require__(/*! ./euler */ "./page/source/camera/math/euler.ts");
const matrix_1 = __webpack_require__(/*! ./matrix */ "./page/source/camera/math/matrix.ts");
const vector_1 = __webpack_require__(/*! ./vector */ "./page/source/camera/math/vector.ts");
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

/***/ "./page/source/camera/math/vector.ts":
/*!*******************************************!*\
  !*** ./page/source/camera/math/vector.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Vector = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
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
        throw new core_1.Exception('Vectors need to be the same length for calculation.', this);
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
      throw new core_1.Exception('Vectors need to be the length of 3 for corss product calculation.', this);
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
      throw new core_1.Exception('Vectors need to be the same length for calculation.', this);
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
        throw new core_1.Exception('Vectors need to be the same length for calculation.', this);
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

/***/ "./page/source/camera/transform.ts":
/*!*****************************************!*\
  !*** ./page/source/camera/transform.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TransformMatrix = exports.Transform = void 0;
const matrix_1 = __webpack_require__(/*! ./math/matrix */ "./page/source/camera/math/matrix.ts");
const quaternion_1 = __webpack_require__(/*! ./math/quaternion */ "./page/source/camera/math/quaternion.ts");
const vector_1 = __webpack_require__(/*! ./math/vector */ "./page/source/camera/math/vector.ts");
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

/***/ "./page/source/camera/view_projection/projection/perspective-projection.ts":
/*!*********************************************************************************!*\
  !*** ./page/source/camera/view_projection/projection/perspective-projection.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PerspectiveProjection = void 0;
const matrix_1 = __webpack_require__(/*! ../../math/matrix */ "./page/source/camera/math/matrix.ts");
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

/***/ "./page/source/camera/view_projection/view-projection.ts":
/*!***************************************************************!*\
  !*** ./page/source/camera/view_projection/view-projection.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CameraMatrix = exports.ViewProjection = void 0;
const transform_1 = __webpack_require__(/*! ../transform */ "./page/source/camera/transform.ts");
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

/***/ "./page/source/index.ts":
/*!******************************!*\
  !*** ./page/source/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
const bind_group_layout_1 = __webpack_require__(/*! ../../source/binding/bind-group-layout */ "./source/binding/bind-group-layout.ts");
const buffer_item_format_enum_1 = __webpack_require__(/*! ../../source/constant/buffer-item-format.enum */ "./source/constant/buffer-item-format.enum.ts");
const buffer_item_multiplier_enum_1 = __webpack_require__(/*! ../../source/constant/buffer-item-multiplier.enum */ "./source/constant/buffer-item-multiplier.enum.ts");
const compare_function_enum_1 = __webpack_require__(/*! ../../source/constant/compare-function.enum */ "./source/constant/compare-function.enum.ts");
const compute_stage_enum_1 = __webpack_require__(/*! ../../source/constant/compute-stage.enum */ "./source/constant/compute-stage.enum.ts");
const primitive_cullmode_enum_1 = __webpack_require__(/*! ../../source/constant/primitive-cullmode.enum */ "./source/constant/primitive-cullmode.enum.ts");
const sampler_type_enum_1 = __webpack_require__(/*! ../../source/constant/sampler-type.enum */ "./source/constant/sampler-type.enum.ts");
const storage_binding_type_enum_1 = __webpack_require__(/*! ../../source/constant/storage-binding-type.enum */ "./source/constant/storage-binding-type.enum.ts");
const texture_blend_factor_enum_1 = __webpack_require__(/*! ../../source/constant/texture-blend-factor.enum */ "./source/constant/texture-blend-factor.enum.ts");
const texture_blend_operation_enum_1 = __webpack_require__(/*! ../../source/constant/texture-blend-operation.enum */ "./source/constant/texture-blend-operation.enum.ts");
const texture_format_enum_1 = __webpack_require__(/*! ../../source/constant/texture-format.enum */ "./source/constant/texture-format.enum.ts");
const texture_view_dimension_enum_1 = __webpack_require__(/*! ../../source/constant/texture-view-dimension.enum */ "./source/constant/texture-view-dimension.enum.ts");
const vertex_buffer_item_format_enum_1 = __webpack_require__(/*! ../../source/constant/vertex-buffer-item-format.enum */ "./source/constant/vertex-buffer-item-format.enum.ts");
const vertex_parameter_step_mode_enum_1 = __webpack_require__(/*! ../../source/constant/vertex-parameter-step-mode.enum */ "./source/constant/vertex-parameter-step-mode.enum.ts");
const gpu_device_1 = __webpack_require__(/*! ../../source/gpu/gpu-device */ "./source/gpu/gpu-device.ts");
const render_targets_1 = __webpack_require__(/*! ../../source/pipeline/target/render-targets */ "./source/pipeline/target/render-targets.ts");
const ambient_light_1 = __webpack_require__(/*! ./camera/light/ambient-light */ "./page/source/camera/light/ambient-light.ts");
const transform_1 = __webpack_require__(/*! ./camera/transform */ "./page/source/camera/transform.ts");
const perspective_projection_1 = __webpack_require__(/*! ./camera/view_projection/projection/perspective-projection */ "./page/source/camera/view_projection/projection/perspective-projection.ts");
const view_projection_1 = __webpack_require__(/*! ./camera/view_projection/view-projection */ "./page/source/camera/view_projection/view-projection.ts");
const cube_shader_wgsl_1 = __webpack_require__(/*! ./game_objects/cube/cube-shader.wgsl */ "./page/source/game_objects/cube/cube-shader.wgsl");
const light_box_shader_wgsl_1 = __webpack_require__(/*! ./game_objects/light/light-box-shader.wgsl */ "./page/source/game_objects/light/light-box-shader.wgsl");
const sky_box_shader_wgsl_1 = __webpack_require__(/*! ./game_objects/skybox/sky-box-shader.wgsl */ "./page/source/game_objects/skybox/sky-box-shader.wgsl");
const video_canvas_shader_wgsl_1 = __webpack_require__(/*! ./game_objects/video_canvas/video-canvas-shader.wgsl */ "./page/source/game_objects/video_canvas/video-canvas-shader.wgsl");
const canvas_mesh_1 = __webpack_require__(/*! ./meshes/canvas-mesh */ "./page/source/meshes/canvas-mesh.ts");
const cube_mesh_1 = __webpack_require__(/*! ./meshes/cube-mesh */ "./page/source/meshes/cube-mesh.ts");
const util_1 = __webpack_require__(/*! ./util */ "./page/source/util.ts");
const gGenerateCubeStep = (pGpu, pRenderTargets, pWorldGroup) => {
  const lHeight = 50;
  const lWidth = 50;
  const lDepth = 50;
  // Create shader.
  const lWoodBoxShader = pGpu.shader(cube_shader_wgsl_1.default).setup(pShaderSetup => {
    // Set parameter.
    pShaderSetup.parameter('animationSeconds', compute_stage_enum_1.ComputeStage.Vertex);
    // Vertex entry.
    pShaderSetup.vertexEntryPoint('vertex_main', pVertexParameterSetup => {
      pVertexParameterSetup.buffer('position', vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Index).withParameter('position', 0, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
      pVertexParameterSetup.buffer('uv', vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Vertex).withParameter('uv', 1, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector2);
      pVertexParameterSetup.buffer('normal', vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Vertex).withParameter('normal', 2, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
    });
    // Fragment entry.
    pShaderSetup.fragmentEntryPoint('fragment_main').addRenderTarget('main', 0, buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
    // Object bind group.
    pShaderSetup.group(0, 'object', pBindGroupSetup => {
      pBindGroupSetup.binding(0, 'transformationMatrix', compute_stage_enum_1.ComputeStage.Vertex).withPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix44);
      pBindGroupSetup.binding(1, 'instancePositions', compute_stage_enum_1.ComputeStage.Vertex, storage_binding_type_enum_1.StorageBindingType.Read).withArray().withPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
    });
    // World bind group.
    pShaderSetup.group(1, pWorldGroup.layout);
    // User bind group
    pShaderSetup.group(2, 'user', pBindGroupSetup => {
      pBindGroupSetup.binding(0, 'cubeTextureSampler', compute_stage_enum_1.ComputeStage.Fragment).withSampler(sampler_type_enum_1.SamplerType.Filter);
      pBindGroupSetup.binding(1, 'cubeTexture', compute_stage_enum_1.ComputeStage.Fragment | compute_stage_enum_1.ComputeStage.Vertex).withTexture(texture_view_dimension_enum_1.TextureViewDimension.TwoDimensionArray, texture_format_enum_1.TextureFormat.Rgba8unorm);
    });
  });
  // Create render module from shader.
  const lWoodBoxRenderModule = lWoodBoxShader.createRenderModule('vertex_main', 'fragment_main');
  // Transformation and position group. 
  const lWoodBoxTransformationGroup = lWoodBoxRenderModule.layout.getGroupLayout('object').create();
  // Create transformation.
  const lWoodBoxTransform = new transform_1.Transform();
  lWoodBoxTransform.setScale(1, 1, 1);
  lWoodBoxTransformationGroup.data('transformationMatrix').createBuffer(new Float32Array(lWoodBoxTransform.getMatrix(transform_1.TransformMatrix.Transformation).dataArray));
  // Create instance positions.
  const lCubeInstanceTransformationData = new Array();
  for (let lWidthIndex = 0; lWidthIndex < lWidth; lWidthIndex++) {
    for (let lHeightIndex = 0; lHeightIndex < lHeight; lHeightIndex++) {
      for (let lDepthIndex = 0; lDepthIndex < lDepth; lDepthIndex++) {
        lCubeInstanceTransformationData.push(lWidthIndex * 3, lHeightIndex * 3, lDepthIndex * 3, 1);
      }
    }
  }
  lWoodBoxTransformationGroup.data('instancePositions').createBuffer(new Float32Array(lCubeInstanceTransformationData));
  /*
   * User defined group.
   */
  const lWoodBoxUserGroup = lWoodBoxRenderModule.layout.getGroupLayout('user').create();
  // Setup cube texture.
  const lImageTexture = lWoodBoxUserGroup.data('cubeTexture').createTexture().texture;
  lImageTexture.depth = 3;
  lImageTexture.mipCount = 20;
  _asyncToGenerator(function* () {
    const lSourceList = ['/source/game_objects/cube/texture_one/cube-texture.png', '/source/game_objects/cube/texture_two/cube-texture.png', '/source/game_objects/cube/texture_three/cube-texture.png'];
    let lHeight = 0;
    let lWidth = 0;
    // "Random" colors.
    const lColorList = new Array();
    for (let lIndex = 0; lIndex < 20; lIndex++) {
      lColorList.push('#' + Math.floor(Math.random() * 16777215).toString(16));
    }
    // Parallel load images.
    const lImageLoadPromiseList = lSourceList.map( /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(function* (pSource, pIndex) {
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
          throw new Error(`Texture image layers are not the same size. (${lImage.naturalWidth}, ${lImage.naturalHeight}) needs (${lWidth}, ${lHeight}).`);
        }
        const lWaiter = new Array();
        const lMipList = new Array();
        // Add level one.
        lWaiter.push(createImageBitmap(lImage).then(pBitmap => {
          lMipList.push({
            data: pBitmap,
            mipLevel: 0,
            targetOrigin: {
              x: 0,
              y: 0,
              z: pIndex
            }
          });
        }));
        // Generate all mips.
        const lMaxMipCount = 1 + Math.floor(Math.log2(Math.max(lWidth, lHeight)));
        for (let lMipLevel = 1; lMipLevel < lMaxMipCount; lMipLevel++) {
          const lCanvas = new OffscreenCanvas(Math.max(1, Math.floor(lWidth / Math.pow(2, lMipLevel))), Math.max(1, Math.floor(lHeight / Math.pow(2, lMipLevel))));
          // Fill canvas.
          const lCanvasContext = lCanvas.getContext('2d');
          lCanvasContext.globalAlpha = 1;
          lCanvasContext.drawImage(lImage, 0, 0, lWidth, lHeight, 0, 0, lCanvas.width, lCanvas.height);
          lCanvasContext.globalAlpha = 0.5;
          lCanvasContext.fillStyle = lColorList[lMipLevel];
          lCanvasContext.fillRect(0, 0, lCanvas.width, lCanvas.height);
          lWaiter.push(createImageBitmap(lCanvas).then(pBitmap => {
            lMipList.push({
              data: pBitmap,
              mipLevel: lMipLevel,
              targetOrigin: {
                x: 0,
                y: 0,
                z: pIndex
              }
            });
          }));
        }
        // Wait for all images to resolve.
        yield Promise.all(lWaiter);
        return lMipList;
      });
      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    }()).flat();
    // Resolve all bitmaps.
    const lImageList = (yield Promise.all(lImageLoadPromiseList)).flat();
    // Set new texture size.
    lImageTexture.width = lWidth;
    lImageTexture.height = lHeight;
    lImageTexture.depth = lSourceList.length;
    // Copy images into texture.
    lImageTexture.copyFrom(...lImageList);
  })();
  // Setup Sampler.
  lWoodBoxUserGroup.data('cubeTextureSampler').createSampler();
  // Generate render parameter from parameter layout.
  const lMesh = lWoodBoxRenderModule.vertexParameter.create(cube_mesh_1.CubeVertexIndices);
  lMesh.set('position', cube_mesh_1.CubeVertexPositionData);
  lMesh.set('uv', cube_mesh_1.CubeVertexUvData);
  lMesh.set('normal', cube_mesh_1.CubeVertexNormalData);
  // Create pipeline.
  const lWoodBoxPipeline = lWoodBoxRenderModule.create(pRenderTargets);
  lWoodBoxPipeline.primitiveCullMode = primitive_cullmode_enum_1.PrimitiveCullMode.Front;
  lWoodBoxPipeline.setParameter('animationSeconds', 3);
  window.animationSpeed = pSeconds => {
    lWoodBoxPipeline.setParameter('animationSeconds', pSeconds);
  };
  return {
    pipeline: lWoodBoxPipeline,
    parameter: lMesh,
    instanceCount: lWidth * lHeight * lDepth,
    data: lWoodBoxPipeline.layout.withData([lWoodBoxTransformationGroup, pWorldGroup, lWoodBoxUserGroup])
  };
};
const gGenerateLightBoxStep = (pGpu, pRenderTargets, pWorldGroup) => {
  // Create shader.
  const lLightBoxShader = pGpu.shader(light_box_shader_wgsl_1.default).setup(pShaderSetup => {
    // Vertex entry.
    pShaderSetup.vertexEntryPoint('vertex_main', pVertexParameterSetup => {
      pVertexParameterSetup.buffer('position', vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Index).withParameter('position', 0, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
      pVertexParameterSetup.buffer('uv', vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Vertex).withParameter('uv', 1, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector2);
      pVertexParameterSetup.buffer('normal', vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Vertex).withParameter('normal', 2, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
    });
    // Fragment entry.
    pShaderSetup.fragmentEntryPoint('fragment_main').addRenderTarget('main', 0, buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
    // Object bind group.
    pShaderSetup.group(0, 'object', pBindGroupSetup => {
      pBindGroupSetup.binding(0, 'transformationMatrix', compute_stage_enum_1.ComputeStage.Vertex).withPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix44);
    });
    // World bind group.
    pShaderSetup.group(1, pWorldGroup.layout);
  });
  // Create render module from shader.
  const lLightBoxRenderModule = lLightBoxShader.createRenderModule('vertex_main', 'fragment_main');
  // Transformation and position group. 
  const lLightBoxTransformationGroup = lLightBoxShader.layout.getGroupLayout('object').create();
  // Create transformation.
  const lLightBoxTransform = new transform_1.Transform();
  lLightBoxTransform.setScale(1, 1, 1);
  lLightBoxTransformationGroup.data('transformationMatrix').createBuffer(new Float32Array(lLightBoxTransform.getMatrix(transform_1.TransformMatrix.Transformation).dataArray));
  const lLightBoxPipeline = lLightBoxRenderModule.create(pRenderTargets);
  lLightBoxPipeline.primitiveCullMode = primitive_cullmode_enum_1.PrimitiveCullMode.Front;
  // Generate render parameter from parameter layout.
  const lMesh = lLightBoxRenderModule.vertexParameter.create(cube_mesh_1.CubeVertexIndices);
  lMesh.set('position', cube_mesh_1.CubeVertexPositionData);
  lMesh.set('uv', cube_mesh_1.CubeVertexUvData);
  lMesh.set('normal', cube_mesh_1.CubeVertexNormalData);
  // Create buffer view for pointlights.
  const lPointLightsBuffer = pWorldGroup.data('pointLights').asBufferView(Float32Array);
  return {
    pipeline: lLightBoxPipeline,
    parameter: lMesh,
    instanceCount: lPointLightsBuffer.length / 12,
    data: lLightBoxPipeline.layout.withData([lLightBoxTransformationGroup, pWorldGroup])
  };
};
const gGenerateSkyboxStep = (pGpu, pRenderTargets, pWorldGroup) => {
  const lSkyBoxShader = pGpu.shader(sky_box_shader_wgsl_1.default).setup(pShaderSetup => {
    // Vertex entry.
    pShaderSetup.vertexEntryPoint('vertex_main', pVertexParameterSetup => {
      pVertexParameterSetup.buffer('position', vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Index).withParameter('position', 0, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
    });
    // Fragment entry.
    pShaderSetup.fragmentEntryPoint('fragment_main').addRenderTarget('main', 0, buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
    pShaderSetup.group(0, 'object', pBindGroupSetup => {
      pBindGroupSetup.binding(0, 'cubeTextureSampler', compute_stage_enum_1.ComputeStage.Fragment).withSampler(sampler_type_enum_1.SamplerType.Filter);
      pBindGroupSetup.binding(1, 'cubeMap', compute_stage_enum_1.ComputeStage.Fragment).withTexture(texture_view_dimension_enum_1.TextureViewDimension.Cube, texture_format_enum_1.TextureFormat.Rgba8unorm);
    });
    // World bind group.
    pShaderSetup.group(1, pWorldGroup.layout);
  });
  // Create render module from shader.
  const lSkyBoxRenderModule = lSkyBoxShader.createRenderModule('vertex_main', 'fragment_main');
  // Transformation and position group. 
  const lSkyBoxTextureGroup = lSkyBoxShader.layout.getGroupLayout('object').create();
  const lImageTexture = lSkyBoxTextureGroup.data('cubeMap').createTexture().texture;
  lImageTexture.depth = 6;
  _asyncToGenerator(function* () {
    const lSourceList = ['/source/game_objects/skybox/right.jpg', '/source/game_objects/skybox/left.jpg', '/source/game_objects/skybox/top.jpg', '/source/game_objects/skybox/bottom.jpg', '/source/game_objects/skybox/front.jpg', '/source/game_objects/skybox/back.jpg'];
    let lHeight = 0;
    let lWidth = 0;
    // Parallel load images.
    const lImageLoadPromiseList = lSourceList.map( /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(function* (pSource) {
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
          throw new Error(`Texture image layers are not the same size. (${lImage.naturalWidth}, ${lImage.naturalHeight}) needs (${lWidth}, ${lHeight}).`);
        }
        return createImageBitmap(lImage);
      });
      return function (_x3) {
        return _ref4.apply(this, arguments);
      };
    }());
    // Resolve all bitmaps.
    const lImageList = yield Promise.all(lImageLoadPromiseList);
    // Set new texture size.
    lImageTexture.width = lWidth;
    lImageTexture.height = lHeight;
    lImageTexture.depth = lSourceList.length;
    // Copy images into texture.
    lImageTexture.copyFrom(...lImageList);
  })();
  // Setup Sampler.
  lSkyBoxTextureGroup.data('cubeTextureSampler').createSampler();
  // Generate render parameter from parameter layout.
  const lMesh = lSkyBoxRenderModule.vertexParameter.create(cube_mesh_1.CubeVertexIndices);
  lMesh.set('position', cube_mesh_1.CubeVertexPositionData);
  const lSkyBoxPipeline = lSkyBoxRenderModule.create(pRenderTargets);
  lSkyBoxPipeline.primitiveCullMode = primitive_cullmode_enum_1.PrimitiveCullMode.Back;
  lSkyBoxPipeline.depthCompare = compare_function_enum_1.CompareFunction.Allways;
  lSkyBoxPipeline.writeDepth = false;
  return {
    pipeline: lSkyBoxPipeline,
    parameter: lMesh,
    instanceCount: 1,
    data: lSkyBoxPipeline.layout.withData([lSkyBoxTextureGroup, pWorldGroup])
  };
};
const gGenerateVideoCanvasStep = (pGpu, pRenderTargets, pWorldGroup) => {
  // Create shader.
  const lWoodBoxShader = pGpu.shader(video_canvas_shader_wgsl_1.default).setup(pShaderSetup => {
    // Vertex entry.
    pShaderSetup.vertexEntryPoint('vertex_main', pVertexParameterSetup => {
      pVertexParameterSetup.buffer('position', vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Index).withParameter('position', 0, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
      pVertexParameterSetup.buffer('uv', vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Vertex).withParameter('uv', 1, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector2);
      pVertexParameterSetup.buffer('normal', vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Vertex).withParameter('normal', 2, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
    });
    // Fragment entry.
    pShaderSetup.fragmentEntryPoint('fragment_main').addRenderTarget('main', 0, buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
    // Object bind group.
    pShaderSetup.group(0, 'object', pBindGroupSetup => {
      pBindGroupSetup.binding(0, 'transformationMatrix', compute_stage_enum_1.ComputeStage.Vertex).withPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix44);
    });
    // World bind group.
    pShaderSetup.group(1, pWorldGroup.layout);
    // User bind group
    pShaderSetup.group(2, 'user', pBindGroupSetup => {
      pBindGroupSetup.binding(0, 'videoTextureSampler', compute_stage_enum_1.ComputeStage.Fragment).withSampler(sampler_type_enum_1.SamplerType.Filter);
      pBindGroupSetup.binding(1, 'videoTexture', compute_stage_enum_1.ComputeStage.Fragment).withTexture(texture_view_dimension_enum_1.TextureViewDimension.TwoDimension, texture_format_enum_1.TextureFormat.Rgba8unorm);
    });
  });
  // Create render module from shader.
  const lWoodBoxRenderModule = lWoodBoxShader.createRenderModule('vertex_main', 'fragment_main');
  // Transformation and position group. 
  const lTransformationGroup = lWoodBoxRenderModule.layout.getGroupLayout('object').create();
  // Create transformation.
  const lWoodBoxTransform = new transform_1.Transform();
  lWoodBoxTransform.setScale(15, 8.4, 0);
  lWoodBoxTransform.addTranslation(-0.5, -0.5, 100);
  lTransformationGroup.data('transformationMatrix').createBuffer(new Float32Array(lWoodBoxTransform.getMatrix(transform_1.TransformMatrix.Transformation).dataArray));
  /*
   * User defined group.
   */
  const lUserGroup = lWoodBoxRenderModule.layout.getGroupLayout('user').create();
  // Setup cube texture.
  const lVideoTexture = lUserGroup.data('videoTexture').createTexture().texture;
  // Create video.
  const lVideo = document.createElement('video');
  lVideo.preload = 'auto';
  lVideo.loop = true;
  lVideo.muted = true; // Allways muted.
  lVideo.src = '/source/game_objects/video_canvas/earth.mp4';
  lVideo.addEventListener('resize', () => {
    lVideoTexture.height = Math.max(lVideo.videoHeight, 1);
    lVideoTexture.width = Math.max(lVideo.videoWidth, 1);
  });
  lVideo.play();
  let lTimeStamp = performance.now();
  pGpu.addFrameChangeListener(() => {
    // Has at least one frame buffered.
    if (lVideo.readyState > 1) {
      const lFrameTimeStamp = performance.now();
      createImageBitmap(lVideo).then(pImageBitmap => {
        if (lFrameTimeStamp < lTimeStamp) {
          return;
        }
        lTimeStamp = lFrameTimeStamp;
        lVideoTexture.copyFrom(pImageBitmap);
      });
    }
  });
  // Setup Sampler.
  lUserGroup.data('videoTextureSampler').createSampler();
  // Generate render parameter from parameter layout.
  const lMesh = lWoodBoxRenderModule.vertexParameter.create(canvas_mesh_1.CanvasVertexIndices);
  lMesh.set('position', canvas_mesh_1.CanvasVertexPositionData);
  lMesh.set('uv', canvas_mesh_1.CanvasVertexUvData);
  lMesh.set('normal', canvas_mesh_1.CanvasVertexNormalData);
  // Create pipeline.
  const lPipeline = lWoodBoxRenderModule.create(pRenderTargets);
  lPipeline.primitiveCullMode = primitive_cullmode_enum_1.PrimitiveCullMode.None;
  lPipeline.writeDepth = false;
  lPipeline.targetConfig('color').alphaBlend(texture_blend_operation_enum_1.TextureBlendOperation.Add, texture_blend_factor_enum_1.TextureBlendFactor.One, texture_blend_factor_enum_1.TextureBlendFactor.OneMinusSrcAlpha);
  lPipeline.targetConfig('color').colorBlend(texture_blend_operation_enum_1.TextureBlendOperation.Add, texture_blend_factor_enum_1.TextureBlendFactor.SrcAlpha, texture_blend_factor_enum_1.TextureBlendFactor.OneMinusSrcAlpha);
  return {
    pipeline: lPipeline,
    parameter: lMesh,
    instanceCount: 1,
    data: lPipeline.layout.withData([lTransformationGroup, pWorldGroup, lUserGroup])
  };
};
const gGenerateWorldBindGroup = pGpu => {
  const lWorldGroupLayout = new bind_group_layout_1.BindGroupLayout(pGpu, 'world').setup(pBindGroupSetup => {
    pBindGroupSetup.binding(0, 'camera', compute_stage_enum_1.ComputeStage.Vertex).withStruct(pStructSetup => {
      pStructSetup.property('viewProjection').asPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix44);
      pStructSetup.property('view').asPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix44);
      pStructSetup.property('projection').asPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix44);
      pStructSetup.property('translation').asStruct(pTranslationStruct => {
        pTranslationStruct.property('rotation').asPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix44);
        pTranslationStruct.property('translation').asPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix44);
      });
      pStructSetup.property('invertedTranslation').asStruct(pTranslationStruct => {
        pTranslationStruct.property('rotation').asPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix44);
        pTranslationStruct.property('translation').asPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix44);
      });
    });
    pBindGroupSetup.binding(1, 'timestamp', compute_stage_enum_1.ComputeStage.Vertex | compute_stage_enum_1.ComputeStage.Fragment).withPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Single);
    pBindGroupSetup.binding(2, 'ambientLight', compute_stage_enum_1.ComputeStage.Fragment).withStruct(pStruct => {
      pStruct.property('color').asPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
    });
    pBindGroupSetup.binding(3, 'pointLights', compute_stage_enum_1.ComputeStage.Fragment | compute_stage_enum_1.ComputeStage.Vertex, storage_binding_type_enum_1.StorageBindingType.Read).withArray().withStruct(pStruct => {
      pStruct.property('position').asPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
      pStruct.property('color').asPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4);
      pStruct.property('range').asPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Single);
    });
    pBindGroupSetup.binding(4, 'debugValue', compute_stage_enum_1.ComputeStage.Fragment, storage_binding_type_enum_1.StorageBindingType.ReadWrite).withPrimitive(buffer_item_format_enum_1.BufferItemFormat.Float32, buffer_item_multiplier_enum_1.BufferItemMultiplier.Single);
  });
  /*
   * Camera and world group.
   */
  const lWorldGroup = lWorldGroupLayout.create();
  lWorldGroup.data('camera').createBuffer(buffer_item_format_enum_1.BufferItemFormat.Float32);
  // Create ambient light.
  const lAmbientLight = new ambient_light_1.AmbientLight();
  lAmbientLight.setColor(0.3, 0.3, 0.3);
  lWorldGroup.data('ambientLight').createBuffer(new Float32Array(lAmbientLight.data));
  // Create point lights.
  lWorldGroup.data('pointLights').createBuffer(new Float32Array([/* Position */1, 1, 1, 1, /* Color */1, 0, 0, 1, /* Range */200, 0, 0, 0, /* Position */10, 10, 10, 1, /* Color */0, 0, 1, 1, /* Range */200, 0, 0, 0, /* Position */-10, 10, 10, 1, /* Color */0, 1, 0, 1, /* Range */200, 0, 0, 0]));
  // Create timestamp.
  lWorldGroup.data('timestamp').createBuffer(new Float32Array(1));
  // Create debug value.
  lWorldGroup.data('debugValue').createBuffer(new Float32Array(1));
  const lDebugBuffer = lWorldGroup.data('debugValue').asBufferView(Float32Array);
  window.debugBuffer = () => {
    lDebugBuffer.read().then(pResulto => {
      // eslint-disable-next-line no-console
      console.log(pResulto);
    });
  };
  return lWorldGroup;
};
_asyncToGenerator(function* () {
  const lGpu = yield gpu_device_1.GpuDevice.request('high-performance');
  // Create canvas.
  const lCanvasTexture = lGpu.canvas(document.getElementById('canvas'));
  // Create and configure render targets.
  const lRenderTargets = lGpu.renderTargets(true).setup(pSetup => {
    // Add "color" target and init new texture.
    pSetup.addColor('color', 0, true, {
      r: 0,
      g: 1,
      b: 0,
      a: 0
    }).new(texture_format_enum_1.TextureFormat.Bgra8unorm, lCanvasTexture);
    // Add depth texture and init new texture.    
    pSetup.addDepthStencil(true, 1).new(texture_format_enum_1.TextureFormat.Depth24plus);
  });
  // Resize canvas.
  (() => {
    const lCanvasWrapper = document.querySelector('.canvas-wrapper');
    new ResizeObserver(() => {
      const lNewCanvasHeight = Math.max(0, lCanvasWrapper.clientHeight - 20);
      const lNewCanvasWidth = Math.max(lCanvasWrapper.clientWidth - 20, 0);
      // Resize displayed render targets.
      lRenderTargets.resize(lNewCanvasHeight, lNewCanvasWidth);
    }).observe(lCanvasWrapper);
  })();
  // Create camera perspective.
  const lPerspectiveProjection = new perspective_projection_1.PerspectiveProjection();
  lPerspectiveProjection.aspectRatio = lRenderTargets.width / lRenderTargets.height;
  lPerspectiveProjection.angleOfView = 72;
  lPerspectiveProjection.near = 0.1;
  lPerspectiveProjection.far = Number.MAX_SAFE_INTEGER;
  lRenderTargets.addInvalidationListener(() => {
    lPerspectiveProjection.aspectRatio = lRenderTargets.width / lRenderTargets.height;
  }, render_targets_1.RenderTargetsInvalidationType.Resize);
  // Create camera.
  const lCamera = new view_projection_1.ViewProjection(lPerspectiveProjection);
  lCamera.transformation.setTranslation(0, 0, -4);
  const lWorldGroup = gGenerateWorldBindGroup(lGpu);
  const lTimestampBuffer = lWorldGroup.data('timestamp').asBufferView(Float32Array);
  // Create instruction.
  const lSteps = [gGenerateSkyboxStep(lGpu, lRenderTargets, lWorldGroup), gGenerateCubeStep(lGpu, lRenderTargets, lWorldGroup), gGenerateLightBoxStep(lGpu, lRenderTargets, lWorldGroup), gGenerateVideoCanvasStep(lGpu, lRenderTargets, lWorldGroup)];
  const lRenderPass = lGpu.renderPass(lRenderTargets, pContext => {
    for (const lStep of lSteps) {
      pContext.drawDirect(lStep.pipeline, lStep.parameter, lStep.data, lStep.instanceCount);
    }
  });
  window.renderpassRuntime = () => {
    lRenderPass.probeTimestamp().then(([pStart, pEnd]) => {
      // eslint-disable-next-line no-console
      console.log('Runtime:', Number(pEnd - pStart) / 1000000, 'ms');
    });
  };
  /**
   * Controls
   */
  (0, util_1.InitCameraControls)(lCanvasTexture.canvas, lCamera, lWorldGroup.data('camera').asBufferView(Float32Array));
  /*
   * Execution
   */
  const lRenderExecutor = lGpu.executor(pExecutor => {
    lRenderPass.execute(pExecutor);
  });
  const lFpsLabel = document.getElementById('fpsCounter');
  // Actual execute.
  let lLastTime = 0;
  let lCurrentFps = 0;
  const lRender = pTime => {
    // Start new frame.
    lGpu.startNewFrame();
    // Update time stamp data.
    lTimestampBuffer.write([pTime / 1000]);
    // Generate encoder and add render commands.
    lRenderExecutor.execute();
    // Generate fps and smooth fps numbers.
    const lFps = 1000 / (pTime - lLastTime);
    lCurrentFps = (1 - 0.05) * lCurrentFps + 0.05 * lFps;
    lLastTime = pTime;
    // Update fps display.
    (0, util_1.UpdateFpsDisplay)(lFps, lRenderTargets.width);
    // Update FPS counter.
    lFpsLabel.textContent = lCurrentFps.toFixed(0);
    // Refresh canvas
    requestAnimationFrame(lRender);
  };
  requestAnimationFrame(lRender);
})();

/***/ }),

/***/ "./page/source/meshes/canvas-mesh.ts":
/*!*******************************************!*\
  !*** ./page/source/meshes/canvas-mesh.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CanvasVertexIndices = exports.CanvasVertexNormalData = exports.CanvasVertexUvData = exports.CanvasVertexPositionData = void 0;
// Create attributes data.
exports.CanvasVertexPositionData = [-1.0, 1.0, 0.0, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, -1.0, 0.0, 1.0, -1.0, -1.0, 0.0, 1.0];
exports.CanvasVertexUvData = [
//  0, 1, 3
0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
// 1, 2, 3
1.0, 0.0, 1.0, 1.0, 0.0, 1.0];
exports.CanvasVertexNormalData = [
// Back 1,0,3
0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0, 0, 0, -1, 0];
// Create mesh.
exports.CanvasVertexIndices = [0, 1, 3, 1, 2, 3];

/***/ }),

/***/ "./page/source/meshes/cube-mesh.ts":
/*!*****************************************!*\
  !*** ./page/source/meshes/cube-mesh.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


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

/***/ "./page/source/util.ts":
/*!*****************************!*\
  !*** ./page/source/util.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.UpdateFpsDisplay = exports.InitCameraControls = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const web_game_input_1 = __webpack_require__(/*! @kartoffelgames/web.game-input */ "../kartoffelgames.web.game_input/library/source/index.js");
const view_projection_1 = __webpack_require__(/*! ./camera/view_projection/view-projection */ "./page/source/camera/view_projection/view-projection.ts");
const InitCameraControls = (pCanvas, pCamera, pCameraBuffer) => {
  // Register keyboard mouse movements.
  const lDefaultConfiguaration = new web_game_input_1.DeviceConfiguration();
  lDefaultConfiguaration.addAction('Forward', [web_game_input_1.KeyboardButton.KeyW]);
  lDefaultConfiguaration.addAction('Back', [web_game_input_1.KeyboardButton.KeyS]);
  lDefaultConfiguaration.addAction('Left', [web_game_input_1.KeyboardButton.KeyA]);
  lDefaultConfiguaration.addAction('Right', [web_game_input_1.KeyboardButton.KeyD]);
  lDefaultConfiguaration.addAction('Up', [web_game_input_1.KeyboardButton.ShiftLeft]);
  lDefaultConfiguaration.addAction('Down', [web_game_input_1.KeyboardButton.ControlLeft]);
  lDefaultConfiguaration.addAction('RotateLeft', [web_game_input_1.KeyboardButton.KeyQ]);
  lDefaultConfiguaration.addAction('RotateRight', [web_game_input_1.KeyboardButton.KeyE]);
  lDefaultConfiguaration.addAction('Yaw', [web_game_input_1.MouseButton.Xaxis]);
  lDefaultConfiguaration.addAction('Pitch', [web_game_input_1.MouseButton.Yaxis]);
  lDefaultConfiguaration.triggerTolerance = 0.2;
  const lInputConfiguration = new web_game_input_1.InputConfiguration(lDefaultConfiguaration);
  const lInputDevices = new web_game_input_1.InputDevices(lInputConfiguration);
  lInputDevices.registerConnector(new web_game_input_1.MouseKeyboardConnector());
  const lCurrentActionValue = new core_1.Dictionary();
  const lKeyboard = lInputDevices.devices[0];
  lKeyboard.addEventListener('actionstatechange', pEvent => {
    lCurrentActionValue.set(pEvent.action, pEvent.state);
  });
  window.setInterval(() => {
    const lSpeed = 10;
    // Z Axis
    if (lCurrentActionValue.get('Forward') > 0) {
      pCamera.transformation.translateInDirection(lCurrentActionValue.get('Forward') / 50 * lSpeed, 0, 0);
    }
    if (lCurrentActionValue.get('Back') > 0) {
      pCamera.transformation.translateInDirection(-(lCurrentActionValue.get('Back') / 50) * lSpeed, 0, 0);
    }
    // X Axis
    if (lCurrentActionValue.get('Right') > 0) {
      pCamera.transformation.translateInDirection(0, lCurrentActionValue.get('Right') / 50 * lSpeed, 0);
    }
    if (lCurrentActionValue.get('Left') > 0) {
      pCamera.transformation.translateInDirection(0, -(lCurrentActionValue.get('Left') / 50) * lSpeed, 0);
    }
    // Y Axis
    if (lCurrentActionValue.get('Up') > 0) {
      pCamera.transformation.translateInDirection(0, 0, lCurrentActionValue.get('Up') / 50 * lSpeed);
    }
    if (lCurrentActionValue.get('Down') > 0) {
      pCamera.transformation.translateInDirection(0, 0, -(lCurrentActionValue.get('Down') / 50) * lSpeed);
    }
    // Rotation.
    if (lCurrentActionValue.get('Yaw') > 0 || lCurrentActionValue.get('Yaw') < 0) {
      pCamera.transformation.addEulerRotation(0, lCurrentActionValue.get('Yaw'), 0);
    }
    if (lCurrentActionValue.get('Pitch') > 0 || lCurrentActionValue.get('Pitch') < 0) {
      pCamera.transformation.addEulerRotation(lCurrentActionValue.get('Pitch'), 0, 0);
    }
    if (lCurrentActionValue.get('RotateLeft') > 0) {
      pCamera.transformation.addEulerRotation(0, 0, lCurrentActionValue.get('RotateLeft'));
    }
    if (lCurrentActionValue.get('RotateRight') > 0) {
      pCamera.transformation.addEulerRotation(0, 0, -lCurrentActionValue.get('RotateRight'));
    }
    // Update transformation buffer.
    pCameraBuffer.write(pCamera.getMatrix(view_projection_1.CameraMatrix.ViewProjection).dataArray, ['viewProjection']);
    pCameraBuffer.write(pCamera.getMatrix(view_projection_1.CameraMatrix.View).dataArray, ['view']);
    pCameraBuffer.write(pCamera.getMatrix(view_projection_1.CameraMatrix.Projection).dataArray, ['projection']);
    pCameraBuffer.write(pCamera.getMatrix(view_projection_1.CameraMatrix.Rotation).dataArray, ['translation', 'rotation']);
    pCameraBuffer.write(pCamera.getMatrix(view_projection_1.CameraMatrix.Translation).dataArray, ['translation', 'translation']);
    pCameraBuffer.write(pCamera.getMatrix(view_projection_1.CameraMatrix.Rotation).inverse().dataArray, ['invertedTranslation', 'rotation']);
    pCameraBuffer.write(pCamera.getMatrix(view_projection_1.CameraMatrix.Translation).inverse().dataArray, ['invertedTranslation', 'translation']);
  }, 8);
  pCanvas.addEventListener('click', () => {
    pCanvas.requestPointerLock();
  });
};
exports.InitCameraControls = InitCameraControls;
exports.UpdateFpsDisplay = (() => {
  let lMaxFps = 0;
  return (pFps, pWidth) => {
    const lCanvas = document.getElementById('fps-display');
    const lCanvasContext = lCanvas.getContext('2d', {
      willReadFrequently: true
    });
    // Update canvas width.
    if (pWidth !== lCanvas.width) {
      lCanvas.width = pWidth;
      lCanvas.height = 30;
    }
    if (lCanvas.width < 2) {
      return;
    }
    // Get current fps image data except the first pixel column.
    const lLastFpsData = lCanvasContext.getImageData(1, 0, lCanvas.width - 1, lCanvas.height);
    // Adjust to new fps scaling.
    let lScaling = 1;
    if (lMaxFps < pFps) {
      lScaling = lMaxFps / pFps;
      lMaxFps = pFps;
    }
    // now clear the right-most pixels:
    if (lScaling === 1) {
      lCanvasContext.clearRect(lCanvas.width - 1, 0, 1, lCanvas.height);
    } else {
      lCanvasContext.clearRect(0, 0, lCanvas.width, lCanvas.height);
    }
    // Put image data to left.
    const lScalingSize = Math.floor(lCanvas.height * lScaling);
    lCanvasContext.putImageData(lLastFpsData, 0, lCanvas.height - lScalingSize, 0, 0, lCanvas.width - 1, lScalingSize);
    // Calculate heigt of rect.
    const lRectHeight = pFps / lMaxFps * lCanvas.height;
    // Draw current fps.
    lCanvasContext.fillStyle = '#87beee';
    lCanvasContext.fillRect(lCanvas.width - 1, lCanvas.height - lRectHeight, 1, lRectHeight);
  };
})();

/***/ }),

/***/ "./source/binding/bind-group-data-setup.ts":
/*!*************************************************!*\
  !*** ./source/binding/bind-group-data-setup.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroupDataSetup = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gpu_buffer_1 = __webpack_require__(/*! ../buffer/gpu-buffer */ "./source/buffer/gpu-buffer.ts");
const gpu_object_child_setup_1 = __webpack_require__(/*! ../gpu/object/gpu-object-child-setup */ "./source/gpu/object/gpu-object-child-setup.ts");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ../memory_layout/buffer/base-buffer-memory-layout */ "./source/memory_layout/buffer/base-buffer-memory-layout.ts");
const sampler_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/sampler-memory-layout */ "./source/memory_layout/texture/sampler-memory-layout.ts");
const texture_view_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/texture-view-memory-layout */ "./source/memory_layout/texture/texture-view-memory-layout.ts");
const texture_sampler_1 = __webpack_require__(/*! ../texture/texture-sampler */ "./source/texture/texture-sampler.ts");
const gpu_texture_1 = __webpack_require__(/*! ../texture/gpu-texture */ "./source/texture/gpu-texture.ts");
const texture_view_dimension_enum_1 = __webpack_require__(/*! ../constant/texture-view-dimension.enum */ "./source/constant/texture-view-dimension.enum.ts");
const texture_dimension_enum_1 = __webpack_require__(/*! ../constant/texture-dimension.enum */ "./source/constant/texture-dimension.enum.ts");
const gpu_buffer_view_1 = __webpack_require__(/*! ../buffer/gpu-buffer-view */ "./source/buffer/gpu-buffer-view.ts");
class BindGroupDataSetup extends gpu_object_child_setup_1.GpuObjectChildSetup {
  /**
   * Constructor.
   *
   * @param pLayout - Target layout.
   * @param pCurrentData - Current set data.
   * @param pSetupReference - Setup data references.
   * @param pDataCallback - Bind data callback.
   */
  constructor(pLayout, pCurrentData, pSetupReference, pDataCallback) {
    super(pSetupReference, pDataCallback);
    // Set initial data.
    this.mCurrentData = pCurrentData;
    this.mBindLayout = pLayout;
  }
  /**
   * Create a view with the attached buffer and binding layout.
   *
   * @param pValueType - Number item type of view.
   *
   * @returns view of buffer from bind group layout.
   */
  asBufferView(pValueType) {
    const lData = this.getRaw();
    if (!(lData instanceof gpu_buffer_1.GpuBuffer)) {
      throw new core_1.Exception('Bind data can not be converted into a buffer view.', this);
    }
    // Read layout buffer.
    const lBufferLayout = this.mBindLayout.layout;
    // Create view.
    return new gpu_buffer_view_1.GpuBufferView(lData, lBufferLayout, pValueType);
  }
  createBuffer(pDataOrType, pVariableSizeCount = null) {
    // Layout must be a buffer memory layout.
    if (!(this.mBindLayout.layout instanceof base_buffer_memory_layout_1.BaseBufferMemoryLayout)) {
      throw new core_1.Exception(`Bind data layout is not suitable for buffers.`, this);
    }
    // TODO: Add dynamic offsets parameter to extend size by each item. Maybe limit dynamic offsets by static layouts or allow a variablesize parameter.
    // Calculate variable item count from initial buffer data.  
    const lVariableItemCount = pVariableSizeCount ?? (() => {
      // No need to calculate was it is allways zero.
      if (this.mBindLayout.layout.variableSize === 0) {
        return 0;
      }
      // A variable size count can only be calculated for data.
      if (typeof pDataOrType !== 'object') {
        throw new core_1.Exception(`For bind group data buffer "${this.mBindLayout.name}" a variable item count must be set.`, this);
      }
      // Get initial buffer data byte length.
      const lBufferByteLength = pDataOrType.length * pDataOrType.BYTES_PER_ELEMENT;
      // calculate item count and check if initial data meets requirments.
      const lItemCount = (lBufferByteLength - this.mBindLayout.layout.fixedSize) / this.mBindLayout.layout.variableSize;
      if (lItemCount % 1 > 0) {
        throw new core_1.Exception('Initial bind group data buffer data "${this.mBindLayout.name}" does not meet alignment or data size requirements.', this);
      }
      return lItemCount;
    })();
    // Calculate buffer size.
    const lByteSize = (lVariableItemCount ?? 0) * this.mBindLayout.layout.variableSize + this.mBindLayout.layout.fixedSize;
    // Create buffer.
    const lBuffer = new gpu_buffer_1.GpuBuffer(this.device, lByteSize);
    // Add initial data.
    if (typeof pDataOrType === 'object') {
      lBuffer.initialData(() => {
        return pDataOrType;
      });
    }
    // Send created data.
    this.sendData(lBuffer);
    return lBuffer;
  }
  /**
   * Create new sampler.
   *
   * @returns created texture sampler.
   */
  createSampler() {
    // Layout must be a sampler memory layout.
    if (!(this.mBindLayout.layout instanceof sampler_memory_layout_1.SamplerMemoryLayout)) {
      throw new core_1.Exception(`Bind data layout is not suitable for samplers.`, this);
    }
    // Create texture sampler.
    const lSampler = new texture_sampler_1.TextureSampler(this.device, this.mBindLayout.layout);
    // Send created data.
    this.sendData(lSampler);
    return lSampler;
  }
  /**
   * Create texture view.
   * Generates a new texture.
   *
    * @returns created texture view.
   */
  createTexture() {
    // Layout must be a texture viw memory layout.
    if (!(this.mBindLayout.layout instanceof texture_view_memory_layout_1.TextureViewMemoryLayout)) {
      throw new core_1.Exception(`Bind data layout is not suitable for image textures.`, this);
    }
    // Generate texture dimension from view dimensions.
    const lTextureDimension = (() => {
      switch (this.mBindLayout.layout.dimension) {
        case texture_view_dimension_enum_1.TextureViewDimension.OneDimension:
          {
            return texture_dimension_enum_1.TextureDimension.OneDimension;
          }
        case texture_view_dimension_enum_1.TextureViewDimension.TwoDimensionArray:
        case texture_view_dimension_enum_1.TextureViewDimension.Cube:
        case texture_view_dimension_enum_1.TextureViewDimension.CubeArray:
        case texture_view_dimension_enum_1.TextureViewDimension.TwoDimension:
          {
            return texture_dimension_enum_1.TextureDimension.TwoDimension;
          }
        case texture_view_dimension_enum_1.TextureViewDimension.ThreeDimension:
          {
            return texture_dimension_enum_1.TextureDimension.ThreeDimension;
          }
      }
    })();
    // Create texture.
    const lTexture = new gpu_texture_1.GpuTexture(this.device, {
      dimension: lTextureDimension,
      format: this.mBindLayout.layout.format,
      multisampled: this.mBindLayout.layout.multisampled
    });
    // Create view from texture.
    const lTextureView = lTexture.useAs(this.mBindLayout.layout.dimension);
    // Send created texture to parent bind group.
    this.sendData(lTextureView);
    return lTextureView;
  }
  /**
   * Get current binded data.
   *
   * @returns current set bind data.
   *
   * @throws {@link Exception}
   * When no data was set.
   */
  getRaw() {
    // Validate existence.
    if (!this.mCurrentData) {
      throw new core_1.Exception('No binding data was set.', this);
    }
    // Return current set data.
    return this.mCurrentData;
  }
  /**
   * Set already created bind data.
   *
   * @param pData - Created data.
   *
   * @returns set data.
   */
  set(pData) {
    this.sendData(pData);
    // Return same data.
    return pData;
  }
}
exports.BindGroupDataSetup = BindGroupDataSetup;

/***/ }),

/***/ "./source/binding/bind-group-layout.ts":
/*!*********************************************!*\
  !*** ./source/binding/bind-group-layout.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroupLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const storage_binding_type_enum_1 = __webpack_require__(/*! ../constant/storage-binding-type.enum */ "./source/constant/storage-binding-type.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ../memory_layout/buffer/base-buffer-memory-layout */ "./source/memory_layout/buffer/base-buffer-memory-layout.ts");
const sampler_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/sampler-memory-layout */ "./source/memory_layout/texture/sampler-memory-layout.ts");
const texture_view_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/texture-view-memory-layout */ "./source/memory_layout/texture/texture-view-memory-layout.ts");
const bind_group_1 = __webpack_require__(/*! ./bind-group */ "./source/binding/bind-group.ts");
const bind_group_layout_setup_1 = __webpack_require__(/*! ./setup/bind-group-layout-setup */ "./source/binding/setup/bind-group-layout-setup.ts");
const gpu_limit_enum_1 = __webpack_require__(/*! ../gpu/capabilities/gpu-limit.enum */ "./source/gpu/capabilities/gpu-limit.enum.ts");
/**
 * Bind group layout. Fixed at creation.
 */
class BindGroupLayout extends gpu_object_1.GpuObject {
  /**
   * Get binding names.
   */
  get bindingNames() {
    // Ensure setup.
    this.ensureSetup();
    return [...this.mBindings.keys()];
  }
  /**
   * Get bindings of group in binding order.
   */
  get bindings() {
    // Ensure setup.
    this.ensureSetup();
    const lBindingList = new Array();
    for (const lBinding of this.mBindings.values()) {
      lBindingList[lBinding.index] = lBinding;
    }
    return lBindingList;
  }
  /**
   * Bind group name.
   */
  get name() {
    return this.mName;
  }
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  /**
   * Constructor.
   *
   * @param pDevice - Gpu Device reference.
   * @param pName - Name of binding group.
   */
  constructor(pDevice, pName) {
    super(pDevice);
    // Set binding group name.
    this.mName = pName;
    // Init bindings.
    this.mBindings = new core_1.Dictionary();
  }
  /**
   * Create new bind group from layout.
   *
   * @returns new bind group.
   */
  create() {
    // Ensure setup.
    this.ensureSetup();
    return new bind_group_1.BindGroup(this.device, this);
  }
  /**
   * Get full bind information.
   * @param pName - Bind name.
   */
  getBind(pName) {
    // Ensure setup.
    this.ensureSetup();
    if (!this.mBindings.has(pName)) {
      throw new core_1.Exception(`Bind ${pName} does not exist.`, this);
    }
    return this.mBindings.get(pName);
  }
  /**
   * Call setup.
   *
   * @param pSetupCallback - Setup callback.
   *
   * @returns — this.
   */
  setup(pSetupCallback) {
    return super.setup(pSetupCallback);
  }
  /**
   * Generate native bind data group layout object.
   */
  generateNative() {
    const lEntryList = new Array();
    // Generate layout entry for each binding.
    for (const lEntry of this.bindings) {
      // Generate default properties.
      const lLayoutEntry = {
        visibility: lEntry.visibility,
        binding: lEntry.index
      };
      // Different binding for different
      switch (true) {
        // Buffer layouts.
        case lEntry.layout instanceof base_buffer_memory_layout_1.BaseBufferMemoryLayout:
          {
            // Convert bind type info bufer binding type.
            const lBufferBindingType = (() => {
              switch (lEntry.storageType) {
                case storage_binding_type_enum_1.StorageBindingType.None:
                  {
                    return 'uniform';
                  }
                case storage_binding_type_enum_1.StorageBindingType.Read:
                  {
                    return 'read-only-storage';
                  }
                default:
                  {
                    return 'storage';
                  }
              }
            })();
            // Create buffer layout with all optional values.
            lLayoutEntry.buffer = {
              type: lBufferBindingType,
              minBindingSize: 0,
              hasDynamicOffset: false // TODO: Dynamic offset
            };
            break;
          }
        // Sampler layouts.
        case lEntry.layout instanceof sampler_memory_layout_1.SamplerMemoryLayout:
          {
            // Create sampler layout with all optional values.
            lLayoutEntry.sampler = {
              type: lEntry.layout.samplerType
            };
            break;
          }
        // Texture layouts.
        case lEntry.layout instanceof texture_view_memory_layout_1.TextureViewMemoryLayout:
          {
            // Uniform bind when without storage binding.
            if (lEntry.storageType === storage_binding_type_enum_1.StorageBindingType.None) {
              // Read texture capabilities.
              const lTextureFormatCapabilities = this.device.formatValidator.capabilityOf(lEntry.layout.format);
              // Create image texture bind information.
              lLayoutEntry.texture = {
                sampleType: lTextureFormatCapabilities.sampleTypes.primary,
                multisampled: lEntry.layout.multisampled,
                viewDimension: lEntry.layout.dimension
              };
              break;
            }
            // Storage textures need to be write only.
            let lStorageAccess;
            switch (lEntry.storageType) {
              case storage_binding_type_enum_1.StorageBindingType.ReadWrite:
                {
                  lStorageAccess = 'read-write';
                  break;
                }
              case storage_binding_type_enum_1.StorageBindingType.Write:
                {
                  lStorageAccess = 'write-only';
                  break;
                }
              case storage_binding_type_enum_1.StorageBindingType.Read:
                {
                  lStorageAccess = 'read-only';
                  break;
                }
            }
            // Create storage texture bind information.
            lLayoutEntry.storageTexture = {
              access: lStorageAccess,
              format: lEntry.layout.format,
              viewDimension: lEntry.layout.dimension
            };
          }
      }
      // Add binding entry to bindings.
      lEntryList.push(lLayoutEntry);
    }
    // Create binding group layout.
    return this.device.gpu.createBindGroupLayout({
      label: `BindGroupLayout-${this.mName}`,
      entries: lEntryList
    });
  }
  /**
   * Setup bind group.
   *
   * @param pReferences - Setup data references.
   */
  onSetup(pReferences) {
    // Check capabilities.
    const lMaxBindGroupCount = this.device.capabilities.getLimit(gpu_limit_enum_1.GpuLimit.MaxBindingsPerBindGroup);
    if (pReferences.bindings.length > lMaxBindGroupCount - 1) {
      throw new core_1.Exception(`Bind group "${this.mName}" exceeds max binding count.`, this);
    }
    // Validation set.
    const lBindingIndices = new Set();
    const lBindingName = new Set();
    // Add each binding.
    for (const lBinding of pReferences.bindings) {
      // Validate layout.
      if (!lBinding.layout) {
        throw new core_1.Exception(`Bind group binding "${lBinding.name}" has no setup layout.`, this);
      }
      // Shallow copy binding.
      this.mBindings.set(lBinding.name, {
        name: lBinding.name,
        index: lBinding.index,
        layout: lBinding.layout,
        visibility: lBinding.visibility,
        storageType: lBinding.storageType
      });
      // Validate dublicate indices.
      if (lBindingIndices.has(lBinding.index) || lBindingName.has(lBinding.name)) {
        throw new core_1.Exception(`Binding "${lBinding.name}" with index "${lBinding.index}" added twice.`, this);
      }
      // Add binding index to already binded indices. 
      lBindingIndices.add(lBinding.index);
      lBindingName.add(lBinding.name);
    }
  }
  /**
   * Create setup object. Return null to skip any setups.
   *
   * @param pReferences - Setup references.
   *
   * @returns setup.
   */
  onSetupObjectCreate(pReferences) {
    return new bind_group_layout_setup_1.BindGroupLayoutSetup(pReferences);
  }
}
exports.BindGroupLayout = BindGroupLayout;

/***/ }),

/***/ "./source/binding/bind-group.ts":
/*!**************************************!*\
  !*** ./source/binding/bind-group.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroupInvalidationType = exports.BindGroup = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gpu_buffer_1 = __webpack_require__(/*! ../buffer/gpu-buffer */ "./source/buffer/gpu-buffer.ts");
const buffer_usage_enum_1 = __webpack_require__(/*! ../constant/buffer-usage.enum */ "./source/constant/buffer-usage.enum.ts");
const storage_binding_type_enum_1 = __webpack_require__(/*! ../constant/storage-binding-type.enum */ "./source/constant/storage-binding-type.enum.ts");
const texture_usage_enum_1 = __webpack_require__(/*! ../constant/texture-usage.enum */ "./source/constant/texture-usage.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
const gpu_resource_object_1 = __webpack_require__(/*! ../gpu/object/gpu-resource-object */ "./source/gpu/object/gpu-resource-object.ts");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ../memory_layout/buffer/base-buffer-memory-layout */ "./source/memory_layout/buffer/base-buffer-memory-layout.ts");
const sampler_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/sampler-memory-layout */ "./source/memory_layout/texture/sampler-memory-layout.ts");
const texture_view_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/texture-view-memory-layout */ "./source/memory_layout/texture/texture-view-memory-layout.ts");
const gpu_texture_view_1 = __webpack_require__(/*! ../texture/gpu-texture-view */ "./source/texture/gpu-texture-view.ts");
const texture_sampler_1 = __webpack_require__(/*! ../texture/texture-sampler */ "./source/texture/texture-sampler.ts");
const bind_group_data_setup_1 = __webpack_require__(/*! ./bind-group-data-setup */ "./source/binding/bind-group-data-setup.ts");
class BindGroup extends gpu_object_1.GpuObject {
  /**
   * Layout of bind group.
   */
  get layout() {
    return this.mLayout;
  }
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  /**
   * Constructor.
   * @param pDevice - Gpu Device reference.
   */
  constructor(pDevice, pBindGroupLayout) {
    super(pDevice);
    this.mLayout = pBindGroupLayout;
    this.mBindData = new core_1.Dictionary();
    this.mDataInvalidationListener = new WeakMap();
  }
  /**
   * Read binding data references.
   *
   * @param pBindName - Binding name.
   *
   * @returns Data setup object.
   */
  data(pBindName) {
    const lBindLayout = this.mLayout.getBind(pBindName);
    const lData = this.mBindData.get(pBindName) ?? null;
    // Construct setup data to data.
    const lDataSetupReferences = {
      device: this.device,
      inSetup: true,
      // No need to defuse setup.
      data: null
    };
    return new bind_group_data_setup_1.BindGroupDataSetup(lBindLayout, lData, lDataSetupReferences, pData => {
      // Validate if layout fits bind data and dynamicly extend usage type of bind data.
      switch (true) {
        // Textures must use a buffer memory layout.
        case pData instanceof gpu_buffer_1.GpuBuffer:
          {
            if (!(lBindLayout.layout instanceof base_buffer_memory_layout_1.BaseBufferMemoryLayout)) {
              throw new core_1.Exception(`Buffer added to bind data "${pBindName}" but binding does not expect a buffer.`, this);
            }
            // Extend buffer usage based on if it is a storage or not.
            if (lBindLayout.storageType !== storage_binding_type_enum_1.StorageBindingType.None) {
              pData.extendUsage(buffer_usage_enum_1.BufferUsage.Storage);
            } else {
              pData.extendUsage(buffer_usage_enum_1.BufferUsage.Uniform);
            }
            break;
          }
        // Samplers must use a texture sampler memory layout.
        case pData instanceof texture_sampler_1.TextureSampler:
          {
            if (!(lBindLayout.layout instanceof sampler_memory_layout_1.SamplerMemoryLayout)) {
              throw new core_1.Exception(`Texture sampler added to bind data "${pBindName}" but binding does not expect a texture sampler.`, this);
            }
            break;
          }
        // Textures must use a texture memory layout.
        case pData instanceof gpu_texture_view_1.GpuTextureView:
          {
            if (!(lBindLayout.layout instanceof texture_view_memory_layout_1.TextureViewMemoryLayout)) {
              throw new core_1.Exception(`Texture added to bind data "${pBindName}" but binding does not expect a texture.`, this);
            }
            // Extend buffer usage based on if it is a storage or not.
            if (lBindLayout.storageType !== storage_binding_type_enum_1.StorageBindingType.None) {
              pData.texture.extendUsage(texture_usage_enum_1.TextureUsage.Storage);
            } else {
              pData.texture.extendUsage(texture_usage_enum_1.TextureUsage.TextureBinding);
            }
            break;
          }
        default:
          {
            throw new core_1.Exception(`Unsupported resource added to bind data "${pBindName}".`, this);
          }
      }
      // Remove invalidationlistener from old data.
      const lOldData = this.mBindData.get(pBindName);
      if (lOldData) {
        const lBindDataInvalidationListener = this.mDataInvalidationListener.get(lOldData);
        if (lBindDataInvalidationListener) {
          lOldData.removeInvalidationListener(lBindDataInvalidationListener);
        }
      }
      // Set data.
      this.mBindData.set(pBindName, pData);
      // Trigger update data is invalid.
      pData.addInvalidationListener(() => {
        this.invalidate(BindGroupInvalidationType.NativeRebuild);
      }, gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
      // Trigger update on data change. 
      this.invalidate(BindGroupInvalidationType.NativeRebuild);
    });
  }
  /**
   * Generate native gpu bind data group.
   */
  generateNative() {
    // Invalidate group.
    this.invalidate(BindGroupInvalidationType.NativeRebuild);
    const lEntryList = new Array();
    for (const lBindname of this.layout.bindingNames) {
      // Read bind data.
      const lBindData = this.mBindData.get(lBindname);
      if (!lBindData) {
        throw new core_1.Exception(`Data for binding "${lBindname}" is not set.`, this);
      }
      // Read bind layout.
      const lBindLayout = this.layout.getBind(lBindname);
      // Set resource to group entry for each 
      const lGroupEntry = {
        binding: lBindLayout.index,
        resource: null
      };
      // Buffer bind.
      if (lBindData instanceof gpu_buffer_1.GpuBuffer) {
        lGroupEntry.resource = {
          buffer: lBindData.native
        };
        lEntryList.push(lGroupEntry);
        continue;
      }
      // Sampler bind
      if (lBindData instanceof texture_sampler_1.TextureSampler) {
        lGroupEntry.resource = lBindData.native;
        lEntryList.push(lGroupEntry);
        continue;
      }
      // Texture bind.
      if (lBindData instanceof gpu_texture_view_1.GpuTextureView) {
        lGroupEntry.resource = lBindData.native;
        lEntryList.push(lGroupEntry);
        continue;
      }
      throw new core_1.Exception(`Bind type for "${lBindData}" not supported`, this);
    }
    return this.device.gpu.createBindGroup({
      label: 'Bind-Group',
      layout: this.layout.native,
      entries: lEntryList
    });
  }
}
exports.BindGroup = BindGroup;
var BindGroupInvalidationType;
(function (BindGroupInvalidationType) {
  BindGroupInvalidationType["NativeRebuild"] = "NativeRebuild";
})(BindGroupInvalidationType || (exports.BindGroupInvalidationType = BindGroupInvalidationType = {}));

/***/ }),

/***/ "./source/binding/pipeline-data.ts":
/*!*****************************************!*\
  !*** ./source/binding/pipeline-data.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PipelineDataInvalidationType = exports.PipelineData = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const bind_group_1 = __webpack_require__(/*! ./bind-group */ "./source/binding/bind-group.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
class PipelineData extends gpu_object_1.GpuObject {
  /**
   * Orderes pipeline data.
   */
  get data() {
    return this.mBindData;
  }
  /**
   * Constructor.
   *
   * @param pPipelineLayout - Pipeline data.
   * @param pBindData - Every bind data of pipeline layout.
   */
  constructor(pDevice, pPipelineLayout, pBindData) {
    super(pDevice);
    // Invalidate pipeline data when any data has changed.
    this.mInvalidationListener = () => {
      this.invalidate(PipelineDataInvalidationType.Data);
    };
    // Validate and order bind data.
    const lBindData = new Array();
    for (const lBindGroup of pBindData) {
      const lBindGroupName = lBindGroup.layout.name;
      const lBindGroupIndex = pPipelineLayout.groupIndex(lBindGroupName);
      // Only distinct bind group names.
      if (lBindData[lBindGroupIndex]) {
        throw new core_1.Exception(`Bind group "${lBindGroupName}" was added multiple times to render pass step.`, this);
      }
      // Validate same layout bind layout.
      const lBindGroupLayout = pPipelineLayout.getGroupLayout(lBindGroupName);
      if (lBindGroup.layout !== lBindGroupLayout) {
        throw new core_1.Exception(`Source bind group layout for "${lBindGroupName}" does not match target layout.`, this);
      }
      // Set bind group.
      lBindData[lBindGroupIndex] = lBindGroup;
      // Invalidate native data when bind group has changed.
      lBindGroup.addInvalidationListener(this.mInvalidationListener, bind_group_1.BindGroupInvalidationType.NativeRebuild);
    }
    // All bind groups must be set.
    if (pPipelineLayout.groups.length !== lBindData.length) {
      // Generate a better error message.
      for (const lGroupName of pPipelineLayout.groups) {
        // Get and validate existence of set bind group.
        const lBindDataGroup = pBindData.find(pBindGroup => {
          return pBindGroup.layout.name === lGroupName;
        });
        if (!lBindDataGroup) {
          throw new core_1.Exception(`Required bind group "${lGroupName}" not set.`, this);
        }
      }
    }
    this.mBindData = lBindData;
  }
  /**
   * Deconstruct native object.
   */
  deconstruct() {
    super.deconstruct();
    // Remove all invalidation listener from bind groups.
    for (const lBindGroup of this.mBindData) {
      lBindGroup.removeInvalidationListener(this.mInvalidationListener);
    }
  }
}
exports.PipelineData = PipelineData;
var PipelineDataInvalidationType;
(function (PipelineDataInvalidationType) {
  PipelineDataInvalidationType["Data"] = "DataChange";
})(PipelineDataInvalidationType || (exports.PipelineDataInvalidationType = PipelineDataInvalidationType = {}));

/***/ }),

/***/ "./source/binding/pipeline-layout.ts":
/*!*******************************************!*\
  !*** ./source/binding/pipeline-layout.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PipelineLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
const gpu_limit_enum_1 = __webpack_require__(/*! ../gpu/capabilities/gpu-limit.enum */ "./source/gpu/capabilities/gpu-limit.enum.ts");
const pipeline_data_1 = __webpack_require__(/*! ./pipeline-data */ "./source/binding/pipeline-data.ts");
class PipelineLayout extends gpu_object_1.GpuObject {
  /**
   * Bind group names.
   */
  get groups() {
    return [...this.mBindGroupNames.keys()];
  }
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  /**
   * Constructor.
   *
   * @param pDevice - Gpu Device reference.
   * @param pInitialGroups - Initial groups.
   */
  constructor(pDevice, pInitialGroups) {
    super(pDevice);
    // Init storages.
    this.mBindGroupNames = new core_1.Dictionary();
    this.mBindGroups = new core_1.Dictionary();
    // TODO: Check gpu restriction.
    // maxSampledTexturesPerShaderStage;
    // maxSamplersPerShaderStage;
    // maxStorageBuffersPerShaderStage;
    // maxStorageTexturesPerShaderStage;
    // maxUniformBuffersPerShaderStage;
    // Set initial work groups.
    const lMaxBindGroupCount = this.device.capabilities.getLimit(gpu_limit_enum_1.GpuLimit.MaxBindGroups);
    for (const [lGroupIndex, lGroup] of pInitialGroups) {
      if (lGroupIndex > lMaxBindGroupCount - 1) {
        throw new core_1.Exception(`Bind group limit exceeded with index: ${lGroupIndex} and group "${lGroup.name}"`, this);
      }
      // Restrict dublicate names.
      if (this.mBindGroupNames.has(lGroup.name)) {
        throw new core_1.Exception(`Can add group name "${lGroup.name}" only once.`, this);
      }
      // Restrict dublicate locations.
      if (this.mBindGroups.has(lGroupIndex)) {
        throw new core_1.Exception(`Can add group location index "${lGroupIndex}" only once.`, this);
      }
      // Set name to index mapping.
      this.mBindGroupNames.set(lGroup.name, lGroupIndex);
      // Set bind groups to bind group.
      this.mBindGroups.set(lGroupIndex, lGroup);
    }
  }
  /**
   * Get bind group layout by name.
   *
   * @param pGroupName - Group name.
   */
  getGroupLayout(pGroupName) {
    const lGroupIndex = this.mBindGroupNames.get(pGroupName);
    // Throw on unaccessable group.
    if (typeof lGroupIndex === 'undefined') {
      throw new core_1.Exception(`Bind group layout (${pGroupName}) does not exists.`, this);
    }
    // Bind group should allways exist.
    return this.mBindGroups.get(lGroupIndex);
  }
  /**
   * Get group binding index by name.
   *
   * @param pGroupName - Group name.
   *
   * @returns group binding index.
   */
  groupIndex(pGroupName) {
    const lBindGroupIndex = this.mBindGroupNames.get(pGroupName);
    if (typeof lBindGroupIndex === 'undefined') {
      throw new core_1.Exception(`Pipeline does not contain a group with name "${pGroupName}".`, this);
    }
    return lBindGroupIndex;
  }
  /**
   * Create pipeline data.
   *
   * @param pBindData - Any bind group of pipeline layout.
   *
   * @returns validated pipeline data.
   */
  withData(pBindData) {
    return new pipeline_data_1.PipelineData(this.device, this, pBindData);
  }
  /**
   * Generate native gpu pipeline data layout.
   */
  generateNative() {
    // Generate pipeline layout from bind group layouts.
    const lPipelineLayoutDescriptor = {
      bindGroupLayouts: new Array()
    };
    for (const [lGroupIndex, lBindGroupLayout] of this.mBindGroups) {
      lPipelineLayoutDescriptor.bindGroupLayouts[lGroupIndex] = lBindGroupLayout.native;
    }
    // Validate continunity.
    if (this.mBindGroups.size !== lPipelineLayoutDescriptor.bindGroupLayouts.length) {
      throw new core_1.Exception(`Bind group gap detected. Group not set.`, this);
    }
    // Generate pipeline layout from descriptor.
    return this.device.gpu.createPipelineLayout(lPipelineLayoutDescriptor);
  }
}
exports.PipelineLayout = PipelineLayout;

/***/ }),

/***/ "./source/binding/setup/bind-group-layout-array-memory-layout-setup.ts":
/*!*****************************************************************************!*\
  !*** ./source/binding/setup/bind-group-layout-array-memory-layout-setup.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroupLayoutArrayMemoryLayoutSetup = void 0;
const gpu_object_child_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-child-setup */ "./source/gpu/object/gpu-object-child-setup.ts");
const array_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/array-buffer-memory-layout */ "./source/memory_layout/buffer/array-buffer-memory-layout.ts");
const primitive_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/primitive-buffer-memory-layout */ "./source/memory_layout/buffer/primitive-buffer-memory-layout.ts");
const struct_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/struct-buffer-memory-layout */ "./source/memory_layout/buffer/struct-buffer-memory-layout.ts");
class BindGroupLayoutArrayMemoryLayoutSetup extends gpu_object_child_setup_1.GpuObjectChildSetup {
  /**
   * Inner type as array.
   *
   * @param pSize - Optional. Set size fixed.
   *
   * @returns array setup.
   */
  withArray(pSize = -1) {
    return new BindGroupLayoutArrayMemoryLayoutSetup(this.setupReferences, pMemoryLayout => {
      const lLayout = new array_buffer_memory_layout_1.ArrayBufferMemoryLayout(this.device, {
        arraySize: pSize,
        innerType: pMemoryLayout
      });
      this.sendData(lLayout);
    });
  }
  /**
   * Inner type as primitive.
   *
   * @param pPrimitiveFormat - Primitive format.
   * @param pPrimitiveMultiplier - Value multiplier.
   */
  withPrimitive(pPrimitiveFormat, pPrimitiveMultiplier) {
    const lLayout = new primitive_buffer_memory_layout_1.PrimitiveBufferMemoryLayout(this.device, {
      primitiveFormat: pPrimitiveFormat,
      primitiveMultiplier: pPrimitiveMultiplier
    });
    // Send created data.
    this.sendData(lLayout);
  }
  /**
   * Inner type as struct
   *
   * @param pSetupCall - Struct setup call.
   */
  withStruct(pSetupCall) {
    // Create and setup struct buffer memory layout.
    const lLayout = new struct_buffer_memory_layout_1.StructBufferMemoryLayout(this.device);
    lLayout.setup(pSetupCall);
    // Send created data.
    this.sendData(lLayout);
  }
}
exports.BindGroupLayoutArrayMemoryLayoutSetup = BindGroupLayoutArrayMemoryLayoutSetup;

/***/ }),

/***/ "./source/binding/setup/bind-group-layout-memory-layout-setup.ts":
/*!***********************************************************************!*\
  !*** ./source/binding/setup/bind-group-layout-memory-layout-setup.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroupLayoutMemoryLayoutSetup = void 0;
const gpu_object_child_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-child-setup */ "./source/gpu/object/gpu-object-child-setup.ts");
const array_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/array-buffer-memory-layout */ "./source/memory_layout/buffer/array-buffer-memory-layout.ts");
const primitive_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/primitive-buffer-memory-layout */ "./source/memory_layout/buffer/primitive-buffer-memory-layout.ts");
const struct_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/struct-buffer-memory-layout */ "./source/memory_layout/buffer/struct-buffer-memory-layout.ts");
const sampler_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/texture/sampler-memory-layout */ "./source/memory_layout/texture/sampler-memory-layout.ts");
const texture_view_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/texture/texture-view-memory-layout */ "./source/memory_layout/texture/texture-view-memory-layout.ts");
const bind_group_layout_array_memory_layout_setup_1 = __webpack_require__(/*! ./bind-group-layout-array-memory-layout-setup */ "./source/binding/setup/bind-group-layout-array-memory-layout-setup.ts");
class BindGroupLayoutMemoryLayoutSetup extends gpu_object_child_setup_1.GpuObjectChildSetup {
  /**
   * Constructor.
   *
   * @param pUsage - Buffer usage.
   * @param pSetupReference - Setup references.
   * @param pDataCallback - Data callback.
   */
  constructor(pSetupReference, pDataCallback) {
    super(pSetupReference, pDataCallback);
  }
  /**
   * Buffer as array.
   *
   * @param pSize - Optional. Set size fixed.
   *
   * @returns array setup.
   */
  withArray(pSize = -1) {
    return new bind_group_layout_array_memory_layout_setup_1.BindGroupLayoutArrayMemoryLayoutSetup(this.setupReferences, pMemoryLayout => {
      const lLayout = new array_buffer_memory_layout_1.ArrayBufferMemoryLayout(this.device, {
        arraySize: pSize,
        innerType: pMemoryLayout
      });
      this.sendData(lLayout);
    });
  }
  /**
   * Memory layout as primitive.
   *
   * @param pPrimitiveFormat - Primitive format.
   * @param pPrimitiveMultiplier - Value multiplier.
   */
  withPrimitive(pPrimitiveFormat, pPrimitiveMultiplier) {
    const lLayout = new primitive_buffer_memory_layout_1.PrimitiveBufferMemoryLayout(this.device, {
      primitiveFormat: pPrimitiveFormat,
      primitiveMultiplier: pPrimitiveMultiplier
    });
    // Send created data.
    this.sendData(lLayout);
  }
  /**
   * Memory layout as sampler.
   *
   * @param pSamplerType - Sampler type.
   */
  withSampler(pSamplerType) {
    const lLayout = new sampler_memory_layout_1.SamplerMemoryLayout(this.device, pSamplerType);
    // Send created data.
    this.sendData(lLayout);
  }
  /**
   * Memory layout as struct
   *
   * @param pSetupCall - Struct setup call.
   */
  withStruct(pSetupCall) {
    // Create and setup struct buffer memory layout.
    const lLayout = new struct_buffer_memory_layout_1.StructBufferMemoryLayout(this.device);
    lLayout.setup(pSetupCall);
    // Send created data.
    this.sendData(lLayout);
  }
  /**
   * Memory layout as texture.
   *
   * @param pTextureDimension - Texture dimension.
   * @param pTextureFormat - Texture format.
   * @param pTextureBindType - Texture binding.
   */
  withTexture(pTextureDimension, pTextureFormat) {
    const lLayout = new texture_view_memory_layout_1.TextureViewMemoryLayout(this.device, {
      dimension: pTextureDimension,
      format: pTextureFormat,
      multisampled: false
    });
    // Send created data.
    this.sendData(lLayout);
  }
}
exports.BindGroupLayoutMemoryLayoutSetup = BindGroupLayoutMemoryLayoutSetup;

/***/ }),

/***/ "./source/binding/setup/bind-group-layout-setup.ts":
/*!*********************************************************!*\
  !*** ./source/binding/setup/bind-group-layout-setup.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroupLayoutSetup = void 0;
const storage_binding_type_enum_1 = __webpack_require__(/*! ../../constant/storage-binding-type.enum */ "./source/constant/storage-binding-type.enum.ts");
const gpu_object_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-setup */ "./source/gpu/object/gpu-object-setup.ts");
const bind_group_layout_memory_layout_setup_1 = __webpack_require__(/*! ./bind-group-layout-memory-layout-setup */ "./source/binding/setup/bind-group-layout-memory-layout-setup.ts");
class BindGroupLayoutSetup extends gpu_object_setup_1.GpuObjectSetup {
  /**
   * Add binding to group.
   *
   * @param pName - Binding name.
   * @param pIndex - - Binding index.
   * @param pUsage - Buffer usage.
   * @param pVisibility - Visibility.
   * @param pAccessMode - Access mode.
   */
  binding(pIndex, pName, pVisibility, pStorageBinding) {
    // Lock setup to a setup call.
    this.ensureThatInSetup();
    // Create empty bind layout.
    const lBind = {
      name: pName,
      index: pIndex,
      visibility: pVisibility,
      layout: null,
      storageType: pStorageBinding ?? storage_binding_type_enum_1.StorageBindingType.None
    };
    // Set layout.
    this.setupData.bindings.push(lBind);
    // Create layout memory layout.
    return new bind_group_layout_memory_layout_setup_1.BindGroupLayoutMemoryLayoutSetup(this.setupReferences, pMemoryLayout => {
      lBind.layout = pMemoryLayout;
    });
  }
  /**
   * Fill in default data before the setup starts.
   *
   * @param pDataReference - Setup data reference.
   */
  fillDefaultData(pDataReference) {
    pDataReference.bindings = new Array();
  }
}
exports.BindGroupLayoutSetup = BindGroupLayoutSetup;

/***/ }),

/***/ "./source/buffer/gpu-buffer-view.ts":
/*!******************************************!*\
  !*** ./source/buffer/gpu-buffer-view.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuBufferView = void 0;
/**
 * Create a view to look at a gpu buffer.
 */
class GpuBufferView {
  /**
   * Get underlying buffer of view.
   */
  get buffer() {
    return this.mBuffer;
  }
  /**
   * Buffer view format.
   */
  get format() {
    return this.mTypedArrayConstructor;
  }
  /**
   * Length of buffer view based on view type.
   */
  get length() {
    return this.mBuffer.size / this.mTypedArrayConstructor.BYTES_PER_ELEMENT;
  }
  /**
   * Constructor.
   *
   * @param pBuffer - Views buffer.
   * @param pLayout - Layout of view.
   */
  constructor(pBuffer, pLayout, pType) {
    this.mLayout = pLayout;
    this.mBuffer = pBuffer;
    this.mTypedArrayConstructor = pType;
  }
  /**
   * Read buffer on layout location.
   *
   * @param pLayoutPath - Layout path.
   */
  read(pLayoutPath = []) {
    var _this = this;
    return _asyncToGenerator(function* () {
      const lLocation = _this.mLayout.locationOf(pLayoutPath);
      return new _this.mTypedArrayConstructor(yield _this.mBuffer.read(lLocation.offset, lLocation.size));
    })();
  }
  /**
   * Write data on layout location.
   *
   * @param pData - Data.
   * @param pLayoutPath - Layout path.
   */
  write(pData, pLayoutPath = []) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      const lLocation = _this2.mLayout.locationOf(pLayoutPath);
      // Add data into a data buffer.
      const lDataBuffer = new _this2.mTypedArrayConstructor(pData);
      // Skip new promise creation by returning original promise.
      return _this2.mBuffer.write(lDataBuffer, lLocation.offset);
    })();
  }
}
exports.GpuBufferView = GpuBufferView;

/***/ }),

/***/ "./source/buffer/gpu-buffer.ts":
/*!*************************************!*\
  !*** ./source/buffer/gpu-buffer.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuBuffer = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const buffer_usage_enum_1 = __webpack_require__(/*! ../constant/buffer-usage.enum */ "./source/constant/buffer-usage.enum.ts");
const gpu_resource_object_1 = __webpack_require__(/*! ../gpu/object/gpu-resource-object */ "./source/gpu/object/gpu-resource-object.ts");
const gpu_buffer_view_1 = __webpack_require__(/*! ./gpu-buffer-view */ "./source/buffer/gpu-buffer-view.ts");
/**
 * GpuBuffer. Uses local and native gpu buffers.
 */
class GpuBuffer extends gpu_resource_object_1.GpuResourceObject {
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  /**
   * Buffer size in bytes aligned to 4 bytes.
   */
  get size() {
    // Align data size by 4 byte.
    return this.mByteSize;
  }
  /**
   * Write buffer limitation.
   * Limiting the amount of created staging buffer to perform reads.
   */
  get writeBufferLimitation() {
    return this.mWriteBuffer.limitation;
  }
  set writeBufferLimitation(pLimit) {
    this.mWriteBuffer.limitation = pLimit;
  }
  /**
   * Constructor.
   * @param pDevice - GPU.
   * @param pLayout - Buffer layout.
   * @param pInitialData  - Inital data. Can be empty. Or Buffer size.
   */
  constructor(pDevice, pByteCount) {
    super(pDevice);
    // Calculate size. // TODO: Allow buffer resize.
    this.mByteSize = pByteCount + 3 & ~3;
    // Read and write buffers.
    this.mWriteBuffer = {
      limitation: Number.MAX_SAFE_INTEGER,
      ready: new Array(),
      buffer: new Set()
    };
    this.mReadBuffer = null;
    // No intial data.
    this.mInitialDataCallback = null;
  }
  /**
   * Set new initial data before the buffer is created.
   *
   * @param pDataCallback - Data callback.
   */
  initialData(pDataCallback) {
    // Set new initial data, set on creation.
    this.mInitialDataCallback = pDataCallback;
    // Trigger update.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
    return this;
  }
  /**
   * Read data raw without layout.
   *
   * @param pOffset - Data read offset in byte.
   * @param pSize - Data read size in byte.
   */
  read(pOffset, pSize) {
    var _this = this;
    return _asyncToGenerator(function* () {
      // Set buffer as writeable.
      _this.extendUsage(buffer_usage_enum_1.BufferUsage.CopySource);
      const lOffset = pOffset ?? 0;
      const lSize = pSize ?? _this.size - lOffset;
      // Create a new buffer when it is not already created.
      if (_this.mReadBuffer === null) {
        _this.mReadBuffer = _this.device.gpu.createBuffer({
          label: `ReadWaveBuffer`,
          size: _this.size,
          usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          mappedAtCreation: false
        });
      }
      // Copy buffer data from native into staging.
      const lCommandDecoder = _this.device.gpu.createCommandEncoder();
      lCommandDecoder.copyBufferToBuffer(_this.native, lOffset, _this.mReadBuffer, lOffset, lSize);
      _this.device.gpu.queue.submit([lCommandDecoder.finish()]);
      // Get buffer and map data.
      yield _this.mReadBuffer.mapAsync(GPUMapMode.READ, lOffset, lSize);
      // Read result from mapped range and copy it with slice.
      const lBufferReadResult = _this.mReadBuffer.getMappedRange().slice(0);
      // Map read buffer again.
      _this.mReadBuffer.unmap();
      // Get mapped data and force it into typed array.
      return lBufferReadResult;
    })();
  }
  /**
   * Create view of buffer.
   *
   * @param pLayout - View layout.
   * @param pType - Type of view.
   *
   * @returns view of buffer.
   */
  view(pLayout, pType) {
    // TODO: Add some offset information. So it offsets the view by layouts size. 
    return new gpu_buffer_view_1.GpuBufferView(this, pLayout, pType);
  }
  /**
   * Write data raw without layout.
   *
   * @param pData - Data.
   * @param pOffset - Data offset.
   */
  write(pData, pOffset) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      // Set buffer as writeable.
      _this2.extendUsage(buffer_usage_enum_1.BufferUsage.CopyDestination);
      // Read native before reading staging buffers.
      // On Native read, staging buffers can be destroyed.
      const lNative = _this2.native;
      // Try to read a mapped buffer from waving list.
      let lStagingBuffer = null;
      if (_this2.mWriteBuffer.ready.length === 0) {
        // Create new buffer when limitation is not meet.
        if (_this2.mWriteBuffer.buffer.size < _this2.mWriteBuffer.limitation) {
          lStagingBuffer = _this2.device.gpu.createBuffer({
            label: `RingBuffer-WriteWaveBuffer-${_this2.mWriteBuffer.buffer.size}`,
            size: _this2.size,
            usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true
          });
          // Add new buffer to complete list.
          _this2.mWriteBuffer.buffer.add(lStagingBuffer);
        }
      } else {
        // Pop as long as staging buffer is not destroyed or could not be found.
        lStagingBuffer = _this2.mWriteBuffer.ready.pop();
      }
      // Get byte length and offset of data to write.
      const lDataByteLength = pData.byteLength;
      const lOffset = pOffset ?? 0;
      // When no staging buffer is available, use the slow native.
      if (!lStagingBuffer) {
        // Write data into mapped range.
        _this2.device.gpu.queue.writeBuffer(lNative, lOffset, pData, 0, lDataByteLength);
        return;
      }
      // Execute write operations on waving buffer.
      const lMappedBuffer = lStagingBuffer.getMappedRange(lOffset, lDataByteLength);
      // Set data to mapped buffer. Use the smallest available byte view (1 byte).
      new pData.constructor(lMappedBuffer).set(pData);
      // Unmap for copying data.
      lStagingBuffer.unmap();
      // Copy buffer data from staging into wavig buffer.
      const lCommandDecoder = _this2.device.gpu.createCommandEncoder();
      lCommandDecoder.copyBufferToBuffer(lStagingBuffer, lOffset, lNative, lOffset, lDataByteLength);
      _this2.device.gpu.queue.submit([lCommandDecoder.finish()]);
      // Shedule staging buffer remaping.
      lStagingBuffer.mapAsync(GPUMapMode.WRITE).then(() => {
        // Check for destroyed state, it is destroyed when not in write buffer list.
        if (_this2.mWriteBuffer.buffer.has(lStagingBuffer)) {
          _this2.mWriteBuffer.ready.push(lStagingBuffer);
        }
      }).catch(() => {
        // Remove buffer when it could not be mapped.
        _this2.mWriteBuffer.buffer.delete(lStagingBuffer);
        lStagingBuffer.destroy();
      });
    })();
  }
  /**
   * Destroy wave and ready buffer.
   */
  destroyNative(pNativeObject, pReason) {
    pNativeObject.destroy();
    // Only clear staging buffers when buffer should be deconstructed, on any other invalidation, the size does not change.
    if (pReason.deconstruct) {
      // Destroy all wave buffer and clear list.
      for (const lWriteBuffer of this.mWriteBuffer.buffer) {
        lWriteBuffer.destroy();
      }
      this.mWriteBuffer.buffer.clear();
      // Clear ready buffer list.
      while (this.mWriteBuffer.ready.length > 0) {
        // No need to destroy. All buffers have already destroyed.
        this.mWriteBuffer.ready.pop();
      }
    }
  }
  /**
   * Generate buffer. Write local gpu object data as initial native buffer data.
   */
  generateNative() {
    // Read optional initial data.
    const lInitalData = this.mInitialDataCallback?.();
    // Create gpu buffer mapped
    const lBuffer = this.device.gpu.createBuffer({
      label: 'Ring-Buffer-Static-Buffer',
      size: this.size,
      usage: this.usage,
      mappedAtCreation: !!lInitalData
    });
    // Write data. Is completly async.
    if (lInitalData) {
      // Write initial data.
      const lMappedBuffer = lBuffer.getMappedRange();
      // Validate buffer and initial data length.
      if (lMappedBuffer.byteLength !== lInitalData.byteLength) {
        throw new core_1.Exception(`Initial buffer data (byte-length: ${lInitalData.byteLength}) does not fit into buffer (length: ${lMappedBuffer.byteLength}). `, this);
      }
      // Set data to buffer. Use the smallest available byte view (1 byte).
      new lInitalData.constructor(lMappedBuffer).set(lInitalData);
      // Unmap buffer.
      lBuffer.unmap();
    }
    return lBuffer;
  }
}
exports.GpuBuffer = GpuBuffer;

/***/ }),

/***/ "./source/constant/buffer-item-format.enum.ts":
/*!****************************************************!*\
  !*** ./source/constant/buffer-item-format.enum.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BufferItemFormat = void 0;
var BufferItemFormat;
(function (BufferItemFormat) {
  BufferItemFormat["Float32"] = "float32";
  BufferItemFormat["Uint32"] = "uint32";
  BufferItemFormat["Sint32"] = "sint32";
})(BufferItemFormat || (exports.BufferItemFormat = BufferItemFormat = {}));

/***/ }),

/***/ "./source/constant/buffer-item-multiplier.enum.ts":
/*!********************************************************!*\
  !*** ./source/constant/buffer-item-multiplier.enum.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BufferItemMultiplier = void 0;
var BufferItemMultiplier;
(function (BufferItemMultiplier) {
  // Single
  BufferItemMultiplier["Single"] = "x1";
  // Vector
  BufferItemMultiplier["Vector2"] = "v2";
  BufferItemMultiplier["Vector3"] = "v3";
  BufferItemMultiplier["Vector4"] = "v4";
  // Matrix
  BufferItemMultiplier["Matrix22"] = "m22";
  BufferItemMultiplier["Matrix23"] = "m23";
  BufferItemMultiplier["Matrix24"] = "m24";
  BufferItemMultiplier["Matrix32"] = "m32";
  BufferItemMultiplier["Matrix33"] = "m33";
  BufferItemMultiplier["Matrix34"] = "m34";
  BufferItemMultiplier["Matrix42"] = "m42";
  BufferItemMultiplier["Matrix43"] = "m43";
  BufferItemMultiplier["Matrix44"] = "m44";
})(BufferItemMultiplier || (exports.BufferItemMultiplier = BufferItemMultiplier = {}));

/***/ }),

/***/ "./source/constant/buffer-usage.enum.ts":
/*!**********************************************!*\
  !*** ./source/constant/buffer-usage.enum.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BufferUsage = void 0;
var BufferUsage;
(function (BufferUsage) {
  BufferUsage[BufferUsage["None"] = 0] = "None";
  BufferUsage[BufferUsage["Index"] = GPUBufferUsage.INDEX] = "Index";
  BufferUsage[BufferUsage["Vertex"] = GPUBufferUsage.VERTEX] = "Vertex";
  BufferUsage[BufferUsage["Uniform"] = GPUBufferUsage.UNIFORM] = "Uniform";
  BufferUsage[BufferUsage["Storage"] = GPUBufferUsage.STORAGE] = "Storage";
  BufferUsage[BufferUsage["Indirect"] = GPUBufferUsage.INDIRECT] = "Indirect";
  BufferUsage[BufferUsage["CopySource"] = GPUBufferUsage.COPY_SRC] = "CopySource";
  BufferUsage[BufferUsage["CopyDestination"] = GPUBufferUsage.COPY_DST] = "CopyDestination";
  // No public available
  // MapWrite = GPUBufferUsage.MAP_WRITE,
  // MapRead = GPUBufferUsage.MAP_READ,
  // QueryResolve = GPUBufferUsage.QUERY_RESOLVE
})(BufferUsage || (exports.BufferUsage = BufferUsage = {}));

/***/ }),

/***/ "./source/constant/compare-function.enum.ts":
/*!**************************************************!*\
  !*** ./source/constant/compare-function.enum.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


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

/***/ "./source/constant/compute-stage.enum.ts":
/*!***********************************************!*\
  !*** ./source/constant/compute-stage.enum.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ComputeStage = void 0;
var ComputeStage;
(function (ComputeStage) {
  ComputeStage[ComputeStage["None"] = 0] = "None";
  ComputeStage[ComputeStage["Fragment"] = GPUShaderStage.FRAGMENT] = "Fragment";
  ComputeStage[ComputeStage["Vertex"] = GPUShaderStage.VERTEX] = "Vertex";
  ComputeStage[ComputeStage["Compute"] = GPUShaderStage.COMPUTE] = "Compute";
})(ComputeStage || (exports.ComputeStage = ComputeStage = {}));

/***/ }),

/***/ "./source/constant/filter-mode.enum.ts":
/*!*********************************************!*\
  !*** ./source/constant/filter-mode.enum.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


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

/***/ "./source/constant/primitive-cullmode.enum.ts":
/*!****************************************************!*\
  !*** ./source/constant/primitive-cullmode.enum.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


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

/***/ "./source/constant/primitive-front-face.enum.ts":
/*!******************************************************!*\
  !*** ./source/constant/primitive-front-face.enum.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PrimitiveFrontFace = void 0;
var PrimitiveFrontFace;
(function (PrimitiveFrontFace) {
  PrimitiveFrontFace["CounterClockWise"] = "cw";
  PrimitiveFrontFace["ClockWise"] = "ccw";
})(PrimitiveFrontFace || (exports.PrimitiveFrontFace = PrimitiveFrontFace = {}));

/***/ }),

/***/ "./source/constant/primitive-topology.enum.ts":
/*!****************************************************!*\
  !*** ./source/constant/primitive-topology.enum.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


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

/***/ "./source/constant/sampler-type.enum.ts":
/*!**********************************************!*\
  !*** ./source/constant/sampler-type.enum.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SamplerType = void 0;
var SamplerType;
(function (SamplerType) {
  SamplerType["Filter"] = "filtering";
  SamplerType["NoneFiltering"] = "non-filtering";
  SamplerType["Comparison"] = "comparison";
})(SamplerType || (exports.SamplerType = SamplerType = {}));

/***/ }),

/***/ "./source/constant/storage-binding-type.enum.ts":
/*!******************************************************!*\
  !*** ./source/constant/storage-binding-type.enum.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StorageBindingType = void 0;
var StorageBindingType;
(function (StorageBindingType) {
  StorageBindingType[StorageBindingType["None"] = 0] = "None";
  StorageBindingType[StorageBindingType["Read"] = 1] = "Read";
  StorageBindingType[StorageBindingType["Write"] = 2] = "Write";
  StorageBindingType[StorageBindingType["ReadWrite"] = 4] = "ReadWrite";
})(StorageBindingType || (exports.StorageBindingType = StorageBindingType = {}));

/***/ }),

/***/ "./source/constant/texture-aspect.enum.ts":
/*!************************************************!*\
  !*** ./source/constant/texture-aspect.enum.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureAspect = void 0;
var TextureAspect;
(function (TextureAspect) {
  TextureAspect["Red"] = "red";
  TextureAspect["Green"] = "green";
  TextureAspect["Blue"] = "blue";
  TextureAspect["Alpha"] = "alpha";
  TextureAspect["Stencil"] = "stencil";
  TextureAspect["Depth"] = "depth";
})(TextureAspect || (exports.TextureAspect = TextureAspect = {}));

/***/ }),

/***/ "./source/constant/texture-blend-factor.enum.ts":
/*!******************************************************!*\
  !*** ./source/constant/texture-blend-factor.enum.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureBlendFactor = void 0;
var TextureBlendFactor;
(function (TextureBlendFactor) {
  TextureBlendFactor["Zero"] = "zero";
  TextureBlendFactor["One"] = "one";
  TextureBlendFactor["Src"] = "src";
  TextureBlendFactor["OneMinusSrc"] = "one-minus-src";
  TextureBlendFactor["SrcAlpha"] = "src-alpha";
  TextureBlendFactor["OneMinusSrcAlpha"] = "one-minus-src-alpha";
  TextureBlendFactor["Dst"] = "dst";
  TextureBlendFactor["OneMinusDst"] = "one-minus-dst";
  TextureBlendFactor["DstAlpha"] = "dst-alpha";
  TextureBlendFactor["OneMinusDstAlpha"] = "one-minus-dst-alpha";
  TextureBlendFactor["SrcAlphaSaturated"] = "src-alpha-saturated";
  TextureBlendFactor["Constant"] = "constant";
  TextureBlendFactor["OneMinusConstant"] = "one-minus-constant";
  TextureBlendFactor["Src1"] = "src1";
  TextureBlendFactor["OneMinusSrc1"] = "one-minus-src1";
  TextureBlendFactor["Src1Alpha"] = "src1-alpha";
  TextureBlendFactor["OneMinusSrc1Alpha"] = "one-minus-src1-alpha";
})(TextureBlendFactor || (exports.TextureBlendFactor = TextureBlendFactor = {}));

/***/ }),

/***/ "./source/constant/texture-blend-operation.enum.ts":
/*!*********************************************************!*\
  !*** ./source/constant/texture-blend-operation.enum.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureBlendOperation = void 0;
var TextureBlendOperation;
(function (TextureBlendOperation) {
  TextureBlendOperation["Add"] = "add";
  TextureBlendOperation["Subtract"] = "subtract";
  TextureBlendOperation["ReverseSubtract"] = "reverse-subtract";
  TextureBlendOperation["Min"] = "min";
  TextureBlendOperation["Max"] = "max";
})(TextureBlendOperation || (exports.TextureBlendOperation = TextureBlendOperation = {}));

/***/ }),

/***/ "./source/constant/texture-dimension.enum.ts":
/*!***************************************************!*\
  !*** ./source/constant/texture-dimension.enum.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureDimension = void 0;
var TextureDimension;
(function (TextureDimension) {
  TextureDimension["OneDimension"] = "1d";
  TextureDimension["TwoDimension"] = "2d";
  TextureDimension["ThreeDimension"] = "3d";
})(TextureDimension || (exports.TextureDimension = TextureDimension = {}));

/***/ }),

/***/ "./source/constant/texture-format.enum.ts":
/*!************************************************!*\
  !*** ./source/constant/texture-format.enum.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureFormat = void 0;
var TextureFormat;
(function (TextureFormat) {
  // 8-bit formats
  TextureFormat["R8unorm"] = "r8unorm";
  TextureFormat["R8snorm"] = "r8snorm";
  TextureFormat["R8uint"] = "r8uint";
  TextureFormat["R8sint"] = "r8sint";
  // 16-bit formats
  TextureFormat["R16uint"] = "r16uint";
  TextureFormat["R16sint"] = "r16sint";
  TextureFormat["R16float"] = "r16float";
  TextureFormat["Rg8unorm"] = "rg8unorm";
  TextureFormat["Rg8snorm"] = "rg8snorm";
  TextureFormat["Rg8uint"] = "rg8uint";
  TextureFormat["Rg8sint"] = "rg8sint";
  // 32-bit formats
  TextureFormat["R32uint"] = "r32uint";
  TextureFormat["R32sint"] = "r32sint";
  TextureFormat["R32float"] = "r32float";
  TextureFormat["Rg16uint"] = "rg16uint";
  TextureFormat["Rg16sint"] = "rg16sint";
  TextureFormat["Rg16float"] = "rg16float";
  TextureFormat["Rgba8unorm"] = "rgba8unorm";
  TextureFormat["Rgba8unormSrgb"] = "rgba8unorm-srgb";
  TextureFormat["Rgba8snorm"] = "rgba8snorm";
  TextureFormat["Rgba8uint"] = "rgba8uint";
  TextureFormat["Rgba8sint"] = "rgba8sint";
  TextureFormat["Bgra8unorm"] = "bgra8unorm";
  TextureFormat["Bgra8unormSrgb"] = "bgra8unorm-srgb";
  // Packed 32-bit formats
  TextureFormat["Rgb9e5ufloat"] = "rgb9e5ufloat";
  TextureFormat["Rgb10a2uint"] = "rgb10a2uint";
  TextureFormat["Rgb10a2unorm"] = "rgb10a2unorm";
  TextureFormat["Rg11b10ufloat"] = "rg11b10ufloat";
  // 64-bit formats
  TextureFormat["Rg32uint"] = "rg32uint";
  TextureFormat["Rg32sint"] = "rg32sint";
  TextureFormat["Rg32float"] = "rg32float";
  TextureFormat["Rgba16uint"] = "rgba16uint";
  TextureFormat["Rgba16sint"] = "rgba16sint";
  TextureFormat["Rgba16float"] = "rgba16float";
  // 128-bit formats
  TextureFormat["Rgba32uint"] = "rgba32uint";
  TextureFormat["Rgba32sint"] = "rgba32sint";
  TextureFormat["Rgba32float"] = "rgba32float";
  // Depth/stencil formats
  TextureFormat["Stencil8"] = "stencil8";
  TextureFormat["Depth16unorm"] = "depth16unorm";
  TextureFormat["Depth24plus"] = "depth24plus";
  TextureFormat["Depth24plusStencil8"] = "depth24plusStencil8";
  TextureFormat["Depth32float"] = "depth32float";
  // "depth32float-stencil8" feature
  TextureFormat["Depth32floatStencil8"] = "depth32floatStencil8";
  // BC compressed formats usable if "texture-compression-bc" is both
  // supported by the device/user agent and enabled in requestDevice.
  TextureFormat["Bc1RgbaUnorm"] = "bc1-rgba-unorm";
  TextureFormat["Bc1RgbaUnormSrgb"] = "bc1-rgba-unorm-srgb";
  TextureFormat["Bc2RgbaUnorm"] = "bc2-rgba-unorm";
  TextureFormat["Bc2RgbaUnormSrgb"] = "bc2-rgba-unorm-srgb";
  TextureFormat["Bc3RgbaUnorm"] = "bc3-rgba-unorm";
  TextureFormat["Bc3RgbaUnormSrgb"] = "bc3-rgba-unorm-srgb";
  TextureFormat["Bc4Runorm"] = "bc4-r-unorm";
  TextureFormat["Bc4Rsnorm"] = "bc4-r-snorm";
  TextureFormat["Bc5RgUnorm"] = "bc5-rg-unorm";
  TextureFormat["Bc5RgSnorm"] = "bc5-rg-snorm";
  TextureFormat["Bc6hRgbUfloat"] = "bc6h-rgb-ufloat";
  TextureFormat["Bc6hRgbFloat"] = "bc6h-rgb-float";
  TextureFormat["Bc7RgbaUnorm"] = "bc7-rgba-unorm";
  TextureFormat["Bc7RgbaUnormSrgb"] = "bc7-rgba-unorm-srgb";
  // ETC2 compressed formats usable if "texture-compression-etc2" is both
  // supported by the device/user agent and enabled in requestDevice.
  TextureFormat["Etc2Rgb8unorm"] = "etc2-rgb8unorm";
  TextureFormat["Etc2Rgb8unormSrgb"] = "etc2-rgb8unorm-srgb";
  TextureFormat["Etc2Rgb8a1unorm"] = "etc2-rgb8a1unorm";
  TextureFormat["Etc2Rgb8a1unormSrgb"] = "etc2-rgb8a1unorm-srgb";
  TextureFormat["Etc2Rgba8unorm"] = "etc2-rgba8unorm";
  TextureFormat["Etc2Rgba8unormSrgb"] = "etc2-rgba8unorm-srgb";
  TextureFormat["EacR11unorm"] = "eac-r11unorm";
  TextureFormat["EacR11snorm"] = "eac-r11snorm";
  TextureFormat["EacRg11unorm"] = "eac-rg11unorm";
  TextureFormat["EacRg11snorm"] = "eac-rg11snorm";
  // ASTC compressed formats usable if "texture-compression-astc" is both
  // supported by the device/user agent and enabled in requestDevice.
  TextureFormat["Astc4x4unorm"] = "astc-4x4-unorm";
  TextureFormat["Astc4x4unormSrgb"] = "astc-4x4-unorm-srgb";
  TextureFormat["Astc5x4unorm"] = "astc-5x4-unorm";
  TextureFormat["Astc5x4unormSrgb"] = "astc-5x4-unorm-srgb";
  TextureFormat["Astc5x5unorm"] = "astc-5x5-unorm";
  TextureFormat["Astc5x5unormSrgb"] = "astc-5x5-unorm-srgb";
  TextureFormat["Astc6x5unorm"] = "astc-6x5-unorm";
  TextureFormat["Astc6x5unormSrgb"] = "astc-6x5-unorm-srgb";
  TextureFormat["Astc6x6unorm"] = "astc-6x6-unorm";
  TextureFormat["Astc6x6unormSrgb"] = "astc-6x6-unorm-srgb";
  TextureFormat["Astc8x5unorm"] = "astc-8x5-unorm";
  TextureFormat["Astc8x5unormSrgb"] = "astc-8x5-unorm-srgb";
  TextureFormat["Astc8x6unorm"] = "astc-8x6-unorm";
  TextureFormat["Astc8x6unormSrgb"] = "astc-8x6-unorm-srgb";
  TextureFormat["Astc8x8unorm"] = "astc-8x8-unorm";
  TextureFormat["Astc8x8unormSrgb"] = "astc-8x8-unorm-srgb";
  TextureFormat["Astc10x5unorm"] = "astc-10x5-unorm";
  TextureFormat["Astc10x5unormSrgb"] = "astc-10x5-unorm-srgb";
  TextureFormat["Astc10x6unorm"] = "astc-10x6-unorm";
  TextureFormat["Astc10x6unormSrgb"] = "astc-10x6-unorm-srgb";
  TextureFormat["Astc10x8unorm"] = "astc-10x8-unorm";
  TextureFormat["Astc10x8unormSrgb"] = "astc-10x8-unorm-srgb";
  TextureFormat["Astc10x10unorm"] = "astc-10x10-unorm";
  TextureFormat["Astc10x10unormSrgb"] = "astc-10x10-unorm-srgb";
  TextureFormat["Astc12x10unorm"] = "astc-12x10-unorm";
  TextureFormat["Astc12x10unormSrgb"] = "astc-12x10-unorm-srgb";
  TextureFormat["Astc12x12unorm"] = "astc-12x12-unorm";
  TextureFormat["Astc12x12unormSrgb"] = "astc-12x12-unorm-srgb";
})(TextureFormat || (exports.TextureFormat = TextureFormat = {}));

/***/ }),

/***/ "./source/constant/texture-operation.enum.ts":
/*!***************************************************!*\
  !*** ./source/constant/texture-operation.enum.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


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

/***/ "./source/constant/texture-sample-type.enum.ts":
/*!*****************************************************!*\
  !*** ./source/constant/texture-sample-type.enum.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureSampleType = void 0;
var TextureSampleType;
(function (TextureSampleType) {
  TextureSampleType["Float"] = "float";
  TextureSampleType["SignedInteger"] = "sint";
  TextureSampleType["UnsignedInteger"] = "uint";
  TextureSampleType["UnfilterableFloat"] = "unfilterable-float";
  TextureSampleType["Depth"] = "depth";
})(TextureSampleType || (exports.TextureSampleType = TextureSampleType = {}));

/***/ }),

/***/ "./source/constant/texture-usage.enum.ts":
/*!***********************************************!*\
  !*** ./source/constant/texture-usage.enum.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureUsage = void 0;
var TextureUsage;
(function (TextureUsage) {
  TextureUsage[TextureUsage["None"] = 0] = "None";
  TextureUsage[TextureUsage["CopySource"] = GPUTextureUsage.COPY_SRC] = "CopySource";
  TextureUsage[TextureUsage["CopyDestination"] = GPUTextureUsage.COPY_DST] = "CopyDestination";
  TextureUsage[TextureUsage["TextureBinding"] = GPUTextureUsage.TEXTURE_BINDING] = "TextureBinding";
  TextureUsage[TextureUsage["Storage"] = GPUTextureUsage.STORAGE_BINDING] = "Storage";
  TextureUsage[TextureUsage["RenderAttachment"] = GPUTextureUsage.RENDER_ATTACHMENT] = "RenderAttachment";
})(TextureUsage || (exports.TextureUsage = TextureUsage = {}));

/***/ }),

/***/ "./source/constant/texture-view-dimension.enum.ts":
/*!********************************************************!*\
  !*** ./source/constant/texture-view-dimension.enum.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureViewDimension = void 0;
var TextureViewDimension;
(function (TextureViewDimension) {
  TextureViewDimension["OneDimension"] = "1d";
  TextureViewDimension["TwoDimension"] = "2d";
  TextureViewDimension["TwoDimensionArray"] = "2d-array";
  TextureViewDimension["Cube"] = "cube";
  TextureViewDimension["CubeArray"] = "cube-array";
  TextureViewDimension["ThreeDimension"] = "3d";
})(TextureViewDimension || (exports.TextureViewDimension = TextureViewDimension = {}));

/***/ }),

/***/ "./source/constant/vertex-buffer-item-format.enum.ts":
/*!***********************************************************!*\
  !*** ./source/constant/vertex-buffer-item-format.enum.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexBufferItemFormat = void 0;
var VertexBufferItemFormat;
(function (VertexBufferItemFormat) {
  VertexBufferItemFormat["Float16"] = "float16";
  VertexBufferItemFormat["Float32"] = "float32";
  VertexBufferItemFormat["Uint32"] = "uint32";
  VertexBufferItemFormat["Sint32"] = "sint32";
  VertexBufferItemFormat["Uint8"] = "uint8";
  VertexBufferItemFormat["Sint8"] = "sint8";
  VertexBufferItemFormat["Uint16"] = "uint16";
  VertexBufferItemFormat["Sint16"] = "sint16";
  VertexBufferItemFormat["Unorm16"] = "unorm16";
  VertexBufferItemFormat["Snorm16"] = "snorm16";
  VertexBufferItemFormat["Unorm8"] = "unorm8";
  VertexBufferItemFormat["Snorm8"] = "snorm8";
})(VertexBufferItemFormat || (exports.VertexBufferItemFormat = VertexBufferItemFormat = {}));

/***/ }),

/***/ "./source/constant/vertex-parameter-step-mode.enum.ts":
/*!************************************************************!*\
  !*** ./source/constant/vertex-parameter-step-mode.enum.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexParameterStepMode = void 0;
var VertexParameterStepMode;
(function (VertexParameterStepMode) {
  VertexParameterStepMode["Vertex"] = "vertex-step";
  VertexParameterStepMode["Index"] = "index-step";
  VertexParameterStepMode["Instance"] = "instance-step";
})(VertexParameterStepMode || (exports.VertexParameterStepMode = VertexParameterStepMode = {}));

/***/ }),

/***/ "./source/constant/wrapping-mode.enum.ts":
/*!***********************************************!*\
  !*** ./source/constant/wrapping-mode.enum.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


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

/***/ "./source/execution/gpu-execution.ts":
/*!*******************************************!*\
  !*** ./source/execution/gpu-execution.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuExecution = void 0;
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
class GpuExecution extends gpu_object_1.GpuObject {
  /**
   * Constructor.
   *
   * @param pDevice - Device reference.
   * @param pExecution - Main execution function.
   */
  constructor(pDevice, pExecution) {
    super(pDevice);
    this.mExecutionFunction = pExecution;
  }
  /**
   * Execute with context.
   */
  execute() {
    // Create command encoder.
    const lCommandEncoder = this.device.gpu.createCommandEncoder({
      label: 'Execution'
    });
    // Call execution with encoder context.
    this.mExecutionFunction({
      commandEncoder: lCommandEncoder
    });
    // Submit commands to queue and clear command encoder.
    this.device.gpu.queue.submit([lCommandEncoder.finish()]);
  }
}
exports.GpuExecution = GpuExecution;

/***/ }),

/***/ "./source/execution/pass/compute-pass.ts":
/*!***********************************************!*\
  !*** ./source/execution/pass/compute-pass.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ComputePass = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gpu_buffer_1 = __webpack_require__(/*! ../../buffer/gpu-buffer */ "./source/buffer/gpu-buffer.ts");
const buffer_usage_enum_1 = __webpack_require__(/*! ../../constant/buffer-usage.enum */ "./source/constant/buffer-usage.enum.ts");
const gpu_feature_enum_1 = __webpack_require__(/*! ../../gpu/capabilities/gpu-feature.enum */ "./source/gpu/capabilities/gpu-feature.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
class ComputePass extends gpu_object_1.GpuObject {
  /**
   * Constructor.
   * @param pDevice - Device reference.
   */
  constructor(pDevice) {
    super(pDevice);
    this.mQueries = {};
    this.mInstructionList = new Array();
  }
  /**
   * Add instruction step.
   * @param pPipeline - Pipeline.
   * @param pBindData -  Pipeline bind data.
   */
  addStep(pPipeline, pWorkGroupSizes, pBindData) {
    const lStep = {
      id: Symbol('ComuteStep'),
      pipeline: pPipeline,
      bindData: new Array(),
      workGroupSizes: pWorkGroupSizes
    };
    // TODO: Enforce maxComputeInvocationsPerWorkgroup
    // Write bind groups into searchable structure.
    const lBindGroups = new core_1.Dictionary();
    for (const lBindGroup of pBindData) {
      // Only distinct bind group names.
      if (lBindGroups.has(lBindGroup.layout.name)) {
        throw new core_1.Exception(`Bind group "${lBindGroup.layout.name}" was added multiple times to render pass step.`, this);
      }
      // Add bind group by name.
      lBindGroups.set(lBindGroup.layout.name, lBindGroup);
    }
    // Fill in data groups.
    const lPipelineLayout = pPipeline.module.shader.layout;
    for (const lGroupName of lPipelineLayout.groups) {
      // Get and validate existence of set bind group.
      const lBindDataGroup = lBindGroups.get(lGroupName);
      if (!lBindDataGroup) {
        throw new core_1.Exception(`Required bind group "${lGroupName}" not set.`, this);
      }
      // Validate same layout bind layout.
      const lBindGroupLayout = lPipelineLayout.getGroupLayout(lGroupName);
      if (lBindDataGroup.layout !== lBindGroupLayout) {
        throw new core_1.Exception('Source bind group layout does not match target layout.', this);
      }
      lStep.bindData[lPipelineLayout.groupIndex(lGroupName)] = lBindDataGroup;
    }
    this.mInstructionList.push(lStep);
    return lStep.id;
  }
  /**
   * Execute steps in a row.
   * @param pExecutionContext - Executor context.
   */
  execute(pExecutionContext) {
    // Read render pass descriptor and inject timestamp query when it is setup.
    const lComputePassDescriptor = {};
    if (this.mQueries.timestamp) {
      lComputePassDescriptor.timestampWrites = this.mQueries.timestamp.query;
    }
    // Pass descriptor is set, when the pipeline ist set.
    const lComputePassEncoder = pExecutionContext.commandEncoder.beginComputePass(lComputePassDescriptor);
    // Instruction cache.
    let lPipeline = null;
    // Buffer for current set bind groups.
    const lBindGroupList = new Array();
    let lHighestBindGroupListIndex = -1;
    // Execute instructions.
    for (const lInstruction of this.mInstructionList) {
      // Skip pipelines that are currently loading.
      const lNativePipeline = lInstruction.pipeline.native;
      if (lNativePipeline === null) {
        continue;
      }
      // Cache for bind group length of this instruction.
      let lLocalHighestBindGroupListIndex = -1;
      // Add bind groups.
      const lPipelineLayout = lInstruction.pipeline.module.shader.layout;
      for (const lBindGroupName of lPipelineLayout.groups) {
        const lBindGroupIndex = lPipelineLayout.groupIndex(lBindGroupName);
        const lNewBindGroup = lInstruction.bindData[lBindGroupIndex];
        const lCurrentBindGroup = lBindGroupList[lBindGroupIndex];
        // Extend group list length.
        if (lBindGroupIndex > lLocalHighestBindGroupListIndex) {
          lLocalHighestBindGroupListIndex = lBindGroupIndex;
        }
        // Use cached bind group or use new.
        if (lNewBindGroup !== lCurrentBindGroup) {
          // Set bind group buffer to cache current set bind groups.
          lBindGroupList[lBindGroupIndex] = lNewBindGroup;
          // Set bind group to gpu.
          lComputePassEncoder.setBindGroup(lBindGroupIndex, lNewBindGroup.native);
        }
      }
      // Use cached pipeline or use new.
      if (lInstruction.pipeline !== lPipeline) {
        lPipeline = lInstruction.pipeline;
        // Generate and set new pipeline.
        lComputePassEncoder.setPipeline(lNativePipeline);
        // Only clear bind buffer when a new pipeline is set.
        // Same pipelines must have set the same bind group layouts.
        if (lHighestBindGroupListIndex > lLocalHighestBindGroupListIndex) {
          for (let lBindGroupIndex = lLocalHighestBindGroupListIndex + 1; lBindGroupIndex < lHighestBindGroupListIndex + 1; lBindGroupIndex++) {
            lComputePassEncoder.setBindGroup(lBindGroupIndex, null);
          }
        }
        // Update global bind group list length.
        lHighestBindGroupListIndex = lLocalHighestBindGroupListIndex;
      }
      // Start compute groups.
      lComputePassEncoder.dispatchWorkgroups(...lInstruction.workGroupSizes);
      // TODO: Indirect dispatch.
    }
    lComputePassEncoder.end();
    // Resolve query.
    if (this.mQueries.timestamp) {
      pExecutionContext.commandEncoder.resolveQuerySet(this.mQueries.timestamp.query.querySet, 0, 2, this.mQueries.timestamp.buffer.native, 0);
    }
  }
  /**
   * Probe timestamp data from render pass.
   * Resolves into two big ints with start and end time in nanoseconds.
   *
   * @returns Promise that resolves with the latest timestamp data.
   */
  probeTimestamp() {
    var _this = this;
    return _asyncToGenerator(function* () {
      // Skip when not enabled.
      if (!_this.device.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.TimestampQuery)) {
        return [0n, 0n];
      }
      // Init timestamp query when not already set.
      if (!_this.mQueries.timestamp) {
        // Create timestamp query.
        const lTimestampQuerySet = _this.device.gpu.createQuerySet({
          type: 'timestamp',
          count: 2
        });
        // Create timestamp buffer.
        const lTimestampBuffer = new gpu_buffer_1.GpuBuffer(_this.device, 16);
        lTimestampBuffer.extendUsage(GPUBufferUsage.QUERY_RESOLVE);
        lTimestampBuffer.extendUsage(buffer_usage_enum_1.BufferUsage.CopySource);
        // Create query.
        _this.mQueries.timestamp = {
          query: {
            querySet: lTimestampQuerySet,
            beginningOfPassWriteIndex: 0,
            endOfPassWriteIndex: 1
          },
          buffer: lTimestampBuffer,
          resolver: null
        };
      }
      // Use existing resolver.
      if (_this.mQueries.timestamp.resolver) {
        return _this.mQueries.timestamp.resolver;
      }
      _this.mQueries.timestamp.resolver = _this.mQueries.timestamp.buffer.read(0, 16).then(pData => {
        // Reset resolver.
        _this.mQueries.timestamp.resolver = null;
        // Read and resolve timestamp data.
        const lTimedata = new BigUint64Array(pData);
        return [lTimedata[0], lTimedata[1]];
      });
      return _this.mQueries.timestamp.resolver;
    })();
  }
  /**
   * Remove instruction from instruction list.
   *
   * @param pInstructionId - Instruction id.
   *
   * @returns true when instruction was removed, false when it was not found.
   */
  removeStep(pInstructionId) {
    // Find instruction index.
    const lInstructionIndex = this.mInstructionList.findIndex(pInstruction => {
      return pInstruction.id === pInstructionId;
    });
    // Remove instruction by index.
    if (lInstructionIndex !== -1) {
      this.mInstructionList.splice(lInstructionIndex, 1);
      return true;
    }
    return false;
  }
}
exports.ComputePass = ComputePass;

/***/ }),

/***/ "./source/execution/pass/render-pass-context.ts":
/*!******************************************************!*\
  !*** ./source/execution/pass/render-pass-context.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderPassContext = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const buffer_usage_enum_1 = __webpack_require__(/*! ../../constant/buffer-usage.enum */ "./source/constant/buffer-usage.enum.ts");
class RenderPassContext {
  /**
   * Used resource.
   * Only filled when recording is enabled.
   */
  get usedResources() {
    return this.mUsedResources;
  }
  /**
   * Constructor.
   *
   * @param pEncoder - Encoder.
   * @param pRenderTargets - Render targets.
   * @param pRecordResources - Records used resources on render.
   */
  constructor(pEncoder, pRenderTargets, pRecordResources) {
    this.mEncoder = pEncoder;
    this.mRenderTargets = pRenderTargets;
    this.mRecordResources = pRecordResources;
    this.mUsedResources = {
      parameter: new Set(),
      indirectBuffer: new Set(),
      pipelines: new Set(),
      pipelineData: new Set()
    };
    this.mRenderResourceBuffer = {
      pipeline: null,
      vertexBuffer: new core_1.Dictionary(),
      highestVertexParameterIndex: -1,
      bindGroupList: new Array(),
      highestBindGroupListIndex: -1
    };
  }
  /**
   * Draw direct with set parameter.
   *
   * @param pPipeline - Pipeline.
   * @param pParameter - Vertex parameter.
   * @param pPipelineData - Pipline bind data groups.
   * @param pInstanceCount - Instance count.
   * @param pInstanceOffset - Instance offset.
   */
  drawDirect(pPipeline, pParameter, pPipelineData, pInstanceCount = 1, pInstanceOffset = 0) {
    // Validate same render targets.
    if (this.mRenderTargets !== pPipeline.renderTargets) {
      throw new core_1.Exception('Pipelines render targets not valid for this render pass.', this);
    }
    // Validate parameter.
    if (pParameter.layout !== pPipeline.module.vertexParameter) {
      throw new core_1.Exception('Vertex parameter not valid for set pipeline.', this);
    }
    // Record resource when config is set.
    if (this.mRecordResources) {
      // Pipelines.
      if (!this.mUsedResources.pipelines.has(pPipeline)) {
        this.mUsedResources.pipelines.add(pPipeline);
      }
      // Parameter
      if (!this.mUsedResources.parameter.has(pParameter)) {
        this.mUsedResources.parameter.add(pParameter);
      }
      // Pipeline data.
      if (!this.mUsedResources.pipelineData.has(pPipelineData)) {
        this.mUsedResources.pipelineData.add(pPipelineData);
      }
    }
    // Execute draw.
    if (this.setupEncoderData(pPipeline, pParameter, pPipelineData)) {
      this.executeDirectDraw(pParameter, pInstanceCount, pInstanceOffset);
    }
  }
  /**
   * Draw indirect with parameters set in buffer.
   *
   * @param pPipeline - Pipeline.
   * @param pParameter - Vertex parameter.
   * @param pPipelineData - Pipline bind data groups.
   * @param pIndirectBuffer - Buffer with indirect parameter data.
   */
  drawIndirect(pPipeline, pParameter, pPipelineData, pIndirectBuffer) {
    // Extend usage.
    pIndirectBuffer.extendUsage(buffer_usage_enum_1.BufferUsage.Indirect);
    // Validate same render targets.
    if (this.mRenderTargets !== pPipeline.renderTargets) {
      throw new core_1.Exception('Pipelines render targets not valid for this render pass.', this);
    }
    // Validate parameter.
    if (pParameter.layout !== pPipeline.module.vertexParameter) {
      throw new core_1.Exception('Vertex parameter not valid for set pipeline.', this);
    }
    // Record resource when config is set.
    if (this.mRecordResources) {
      // Pipelines.
      if (!this.mUsedResources.pipelines.has(pPipeline)) {
        this.mUsedResources.pipelines.add(pPipeline);
      }
      // Parameter
      if (!this.mUsedResources.parameter.has(pParameter)) {
        this.mUsedResources.parameter.add(pParameter);
      }
      // Pipeline data.
      if (!this.mUsedResources.pipelineData.has(pPipelineData)) {
        this.mUsedResources.pipelineData.add(pPipelineData);
      }
    }
    // Execute draw.
    if (this.setupEncoderData(pPipeline, pParameter, pPipelineData)) {
      this.executeIndirectDraw(pParameter, pIndirectBuffer);
    }
  }
  /**
   * Set pipeline and any bind and vertex data.
   *
   * @param pPipeline - Pipeline.
   * @param pParameter  - Pipeline vertex parameter.
   * @param pPipelineData - Pipeline binding data.
   *
   * @returns true when everything has been successfully set.
   */
  setupEncoderData(pPipeline, pParameter, pPipelineData) {
    // Skip pipelines that are currently loading.
    const lNativePipeline = pPipeline.native;
    if (lNativePipeline === null) {
      return false;
    }
    // Cache for bind group length of this instruction.
    let lLocalHighestBindGroupListIndex = -1;
    // Add bind groups.
    const lBindGroupList = pPipelineData.data;
    for (let lBindGroupIndex = 0; lBindGroupIndex < lBindGroupList.length; lBindGroupIndex++) {
      const lNewBindGroup = lBindGroupList[lBindGroupIndex];
      const lCurrentBindGroup = this.mRenderResourceBuffer.bindGroupList[lBindGroupIndex];
      // Extend group list length.
      if (lBindGroupIndex > lLocalHighestBindGroupListIndex) {
        lLocalHighestBindGroupListIndex = lBindGroupIndex;
      }
      // Use cached bind group or use new.
      if (lNewBindGroup !== lCurrentBindGroup) {
        // Set bind group buffer to cache current set bind groups.
        this.mRenderResourceBuffer.bindGroupList[lBindGroupIndex] = lNewBindGroup;
        // Set bind group to gpu.
        this.mEncoder.setBindGroup(lBindGroupIndex, lNewBindGroup.native);
      }
    }
    // Cache for bind group length of this instruction.
    let lLocalHighestVertexParameterListIndex = -1;
    // Add vertex attribute buffer.
    const lBufferNames = pPipeline.module.vertexParameter.bufferNames;
    for (let lBufferIndex = 0; lBufferIndex < lBufferNames.length; lBufferIndex++) {
      // Read buffer information.
      const lAttributeBufferName = lBufferNames[lBufferIndex];
      const lNewAttributeBuffer = pParameter.get(lAttributeBufferName);
      // Extend group list length.
      if (lBufferIndex > lLocalHighestVertexParameterListIndex) {
        lLocalHighestVertexParameterListIndex = lBufferIndex;
      }
      // Use cached vertex buffer or use new.
      if (lNewAttributeBuffer !== this.mRenderResourceBuffer.vertexBuffer.get(lBufferIndex)) {
        this.mRenderResourceBuffer.vertexBuffer.set(lBufferIndex, lNewAttributeBuffer);
        this.mEncoder.setVertexBuffer(lBufferIndex, lNewAttributeBuffer.native);
      }
    }
    // Use cached pipeline or use new.
    if (pPipeline !== this.mRenderResourceBuffer.pipeline) {
      this.mRenderResourceBuffer.pipeline = pPipeline;
      // Generate and set new pipeline.
      this.mEncoder.setPipeline(lNativePipeline);
      // Only clear bind buffer when a new pipeline is set.
      // Same pipelines must have set the same bind group layouts.
      if (this.mRenderResourceBuffer.highestBindGroupListIndex > lLocalHighestBindGroupListIndex) {
        for (let lBindGroupIndex = lLocalHighestBindGroupListIndex + 1; lBindGroupIndex < this.mRenderResourceBuffer.highestBindGroupListIndex + 1; lBindGroupIndex++) {
          this.mEncoder.setBindGroup(lBindGroupIndex, null);
        }
      }
      // Update global bind group list length.
      this.mRenderResourceBuffer.highestBindGroupListIndex = lLocalHighestBindGroupListIndex;
      // Only clear vertex buffer when a new pipeline is set.
      // Same pipeline must have the same vertex parameter layout.
      if (this.mRenderResourceBuffer.highestVertexParameterIndex > lLocalHighestVertexParameterListIndex) {
        for (let lVertexParameterBufferIndex = lLocalHighestVertexParameterListIndex + 1; lVertexParameterBufferIndex < this.mRenderResourceBuffer.highestVertexParameterIndex + 1; lVertexParameterBufferIndex++) {
          this.mEncoder.setVertexBuffer(lVertexParameterBufferIndex, null);
        }
      }
      // Update global bind group list length.
      this.mRenderResourceBuffer.highestVertexParameterIndex = lLocalHighestVertexParameterListIndex;
    }
    return true;
  }
  /**
   * Execute direct draw call.
   *
   * @param pParameter - Vertex parameter.
   * @param pInstanceCount - Index count.
   * @param pInstanceOffset - Instance offset.
   */
  executeDirectDraw(pParameter, pInstanceCount, pInstanceOffset) {
    // Draw indexed when parameters are indexable.
    if (pParameter.layout.indexable) {
      // Set indexbuffer. Dynamicly switch between 32 and 16 bit based on length.
      if (pParameter.indexBuffer.format === Uint16Array) {
        this.mEncoder.setIndexBuffer(pParameter.indexBuffer.buffer.native, 'uint16');
      } else {
        this.mEncoder.setIndexBuffer(pParameter.indexBuffer.buffer.native, 'uint32');
      }
      // Create draw call.
      this.mEncoder.drawIndexed(pParameter.indexBuffer.length, pInstanceCount, 0, 0, pInstanceOffset);
    } else {
      // Create draw call.
      this.mEncoder.draw(pParameter.vertexCount, pInstanceCount, 0, pInstanceOffset);
    }
  }
  /**
   * Execute a indirect draw call.
   * If indexed or normal indirect calls are used is defined by the buffer length.
   *
   * @param pParameter - Vertex parameter.
   * @param pBuffer - Indirect buffer.
   */
  executeIndirectDraw(pParameter, pBuffer) {
    // 4 Byte * 5 => 20 Byte => Indexed draw 
    // 4 Byte * 4 => 16 Byte => Normal draw 
    if (pBuffer.size === 20) {
      // Buffer does not match when parameters are not indexable.
      if (!pParameter.layout.indexable) {
        throw new core_1.Exception('Indirect indexed draw call failed, because parameter are not indexable', this);
      }
      // Set indexbuffer. Dynamicly switch between 32 and 16 bit based on length.
      if (pParameter.indexBuffer.format === Uint16Array) {
        this.mEncoder.setIndexBuffer(pParameter.indexBuffer.buffer.native, 'uint16');
      } else {
        this.mEncoder.setIndexBuffer(pParameter.indexBuffer.buffer.native, 'uint32');
      }
      // Start indirect indexed call.
      this.mEncoder.drawIndexedIndirect(pBuffer.native, 0);
    } else if (pBuffer.size === 16) {
      // Start indirect call.
      this.mEncoder.drawIndirect(pBuffer.native, 0);
    } else {
      throw new core_1.Exception('Indirect draw calls can only be done with 20 or 16 byte long buffers', this);
    }
  }
}
exports.RenderPassContext = RenderPassContext;

/***/ }),

/***/ "./source/execution/pass/render-pass.ts":
/*!**********************************************!*\
  !*** ./source/execution/pass/render-pass.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderPass = void 0;
const pipeline_data_1 = __webpack_require__(/*! ../../binding/pipeline-data */ "./source/binding/pipeline-data.ts");
const gpu_buffer_1 = __webpack_require__(/*! ../../buffer/gpu-buffer */ "./source/buffer/gpu-buffer.ts");
const buffer_usage_enum_1 = __webpack_require__(/*! ../../constant/buffer-usage.enum */ "./source/constant/buffer-usage.enum.ts");
const gpu_feature_enum_1 = __webpack_require__(/*! ../../gpu/capabilities/gpu-feature.enum */ "./source/gpu/capabilities/gpu-feature.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
const gpu_resource_object_1 = __webpack_require__(/*! ../../gpu/object/gpu-resource-object */ "./source/gpu/object/gpu-resource-object.ts");
const vertex_parameter_1 = __webpack_require__(/*! ../../pipeline/parameter/vertex-parameter */ "./source/pipeline/parameter/vertex-parameter.ts");
const vertex_fragment_pipeline_1 = __webpack_require__(/*! ../../pipeline/vertex-fragment-pipeline */ "./source/pipeline/vertex-fragment-pipeline.ts");
const render_pass_context_1 = __webpack_require__(/*! ./render-pass-context */ "./source/execution/pass/render-pass-context.ts");
class RenderPass extends gpu_object_1.GpuObject {
  /**
   * Constructor.
   *
   * @param pDevice - Device reference.
   * @param pRenderTargets - Render targets.
   * @param pStaticBundle - Bundle is static and does not update very often.
   */
  constructor(pDevice, pRenderTargets, pStaticBundle, pExecution) {
    super(pDevice);
    // Set config.
    this.mExecutionFunction = pExecution;
    this.mQueries = {};
    this.mRenderTargets = pRenderTargets;
    this.mBundleConfig = {
      enabled: pStaticBundle,
      bundle: null,
      descriptor: null,
      usedResources: {
        parameter: new Set(),
        indirectBuffer: new Set(),
        pipelines: new Set(),
        pipelineData: new Set()
      },
      resourceInvalidator: () => {
        // Only invalidate bundle on resource changes.
        this.mBundleConfig.bundle = null;
      }
    };
    // RenderTargets cant change texture formats, so the bundle descriptor does not need to be rebuild.
    // When textures are resized, the new render descriptor with updated views gets applied automaticly on execute.
  }
  /**
   * Execute steps in a row.
   *
   * @param pExecutor - Executor context.
   */
  execute(pExecutionContext) {
    // Read render pass descriptor and inject timestamp query when it is setup.
    const lRenderPassDescriptor = this.mRenderTargets.native;
    if (this.mQueries.timestamp) {
      lRenderPassDescriptor.timestampWrites = this.mQueries.timestamp.query;
    }
    // Pass descriptor is set, when the pipeline is set.
    const lRenderPassEncoder = pExecutionContext.commandEncoder.beginRenderPass(lRenderPassDescriptor);
    // Execute cached or execute direct based on static or variable bundles.
    if (this.mBundleConfig.enabled) {
      this.cachedExecute(lRenderPassEncoder);
    } else {
      // Directly execute nothing gets cached.
      this.mExecutionFunction(new render_pass_context_1.RenderPassContext(lRenderPassEncoder, this.mRenderTargets, false));
    }
    // End render queue.
    lRenderPassEncoder.end();
    // Resolve query.
    if (this.mQueries.timestamp) {
      pExecutionContext.commandEncoder.resolveQuerySet(this.mQueries.timestamp.query.querySet, 0, 2, this.mQueries.timestamp.buffer.native, 0);
    }
    // Execute optional resolve targets.
    this.resolveCanvasTargets(pExecutionContext);
  }
  /**
   * Probe timestamp data from render pass.
   * Resolves into two big ints with start and end time in nanoseconds.
   *
   * @returns Promise that resolves with the latest timestamp data.
   */
  probeTimestamp() {
    var _this = this;
    return _asyncToGenerator(function* () {
      // Skip when not enabled.
      if (!_this.device.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.TimestampQuery)) {
        return [0n, 0n];
      }
      // Init timestamp query when not already set.
      if (!_this.mQueries.timestamp) {
        // Create timestamp query.
        const lTimestampQuerySet = _this.device.gpu.createQuerySet({
          type: 'timestamp',
          count: 2
        });
        // Create timestamp buffer.
        const lTimestampBuffer = new gpu_buffer_1.GpuBuffer(_this.device, 16);
        lTimestampBuffer.extendUsage(GPUBufferUsage.QUERY_RESOLVE);
        lTimestampBuffer.extendUsage(buffer_usage_enum_1.BufferUsage.CopySource);
        // Create query.
        _this.mQueries.timestamp = {
          query: {
            querySet: lTimestampQuerySet,
            beginningOfPassWriteIndex: 0,
            endOfPassWriteIndex: 1
          },
          buffer: lTimestampBuffer,
          resolver: null
        };
      }
      // Use existing resolver.
      if (_this.mQueries.timestamp.resolver) {
        return _this.mQueries.timestamp.resolver;
      }
      _this.mQueries.timestamp.resolver = _this.mQueries.timestamp.buffer.read(0, 16).then(pData => {
        // Reset resolver.
        _this.mQueries.timestamp.resolver = null;
        // Read and resolve timestamp data.
        const lTimedata = new BigUint64Array(pData);
        return [lTimedata[0], lTimedata[1]];
      });
      return _this.mQueries.timestamp.resolver;
    })();
  }
  /**
   * Execute render pass as cached bundle.
   *
   * @param pExecutor - Executor context.
   */
  cachedExecute(pRenderPassEncoder) {
    if (!this.mBundleConfig.descriptor) {
      // Generate GPURenderBundleEncoderDescriptor from GPURenderPassDescriptor.
      const lRenderBundleEncoderDescriptor = {
        colorFormats: this.mRenderTargets.colorTargetNames.map(pColorTargetName => {
          return this.mRenderTargets.colorTarget(pColorTargetName).layout.format;
        }),
        // Render target multisample level.
        sampleCount: this.mRenderTargets.multisampled ? 4 : 1,
        // Enable depth or stencil write.
        depthReadOnly: false,
        stencilReadOnly: false
      };
      // Optional depth stencil.
      if (this.mRenderTargets.hasDepth || this.mRenderTargets.hasStencil) {
        lRenderBundleEncoderDescriptor.depthStencilFormat = this.mRenderTargets.depthStencilTarget().layout.format;
      }
      // Save descriptor.
      this.mBundleConfig.descriptor = lRenderBundleEncoderDescriptor;
    }
    // Generate new bundle when not already cached or render target got changed.
    if (!this.mBundleConfig.bundle) {
      // Clear old invalidation listener on old bundles.
      for (const lParameter of this.mBundleConfig.usedResources.parameter) {
        lParameter.removeInvalidationListener(this.mBundleConfig.resourceInvalidator);
      }
      for (const lBuffer of this.mBundleConfig.usedResources.indirectBuffer) {
        lBuffer.removeInvalidationListener(this.mBundleConfig.resourceInvalidator);
      }
      for (const lBindgroup of this.mBundleConfig.usedResources.pipelineData) {
        lBindgroup.removeInvalidationListener(this.mBundleConfig.resourceInvalidator);
      }
      for (const lPipeline of this.mBundleConfig.usedResources.pipelines) {
        lPipeline.removeInvalidationListener(this.mBundleConfig.resourceInvalidator);
      }
      // Clear used resources.
      this.mBundleConfig.usedResources.indirectBuffer.clear();
      this.mBundleConfig.usedResources.pipelineData.clear();
      this.mBundleConfig.usedResources.pipelines.clear();
      // Create render bundle.
      const lRenderBundleEncoder = this.device.gpu.createRenderBundleEncoder(this.mBundleConfig.descriptor);
      // Create context.
      const lRenderPassContext = new render_pass_context_1.RenderPassContext(lRenderBundleEncoder, this.mRenderTargets, true);
      // Fill render queue.
      this.mExecutionFunction(lRenderPassContext);
      // Save render bundle.
      this.mBundleConfig.bundle = lRenderBundleEncoder.finish();
      // Save and track used resources.
      for (const lParameter of this.mBundleConfig.usedResources.parameter) {
        lParameter.addInvalidationListener(this.mBundleConfig.resourceInvalidator, vertex_parameter_1.VertexParameterInvalidationType.Data);
      }
      for (const lBuffer of lRenderPassContext.usedResources.indirectBuffer) {
        this.mBundleConfig.usedResources.indirectBuffer.add(lBuffer);
        lBuffer.addInvalidationListener(this.mBundleConfig.resourceInvalidator, gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
      }
      for (const lBindgroup of lRenderPassContext.usedResources.pipelineData) {
        this.mBundleConfig.usedResources.pipelineData.add(lBindgroup);
        lBindgroup.addInvalidationListener(this.mBundleConfig.resourceInvalidator, pipeline_data_1.PipelineDataInvalidationType.Data);
      }
      for (const lPipeline of lRenderPassContext.usedResources.pipelines) {
        this.mBundleConfig.usedResources.pipelines.add(lPipeline);
        lPipeline.addInvalidationListener(this.mBundleConfig.resourceInvalidator, vertex_fragment_pipeline_1.VertexFragmentPipelineInvalidationType.NativeRebuild);
      }
    }
    // Add cached render bundle.
    pRenderPassEncoder.executeBundles([this.mBundleConfig.bundle]);
  }
  /**
   * Resolve gpu textures into canvas textures.
   *
   * @param pExecutionContext - Executor context.
   */
  resolveCanvasTargets(pExecutionContext) {
    // Skip when nothing to be resolved.
    if (this.mRenderTargets.resolveCanvasList.length === 0) {
      return;
    }
    if (this.mRenderTargets.multisampled) {
      // Generate resolve target descriptor with operation that does nothing.
      const lColorTargetList = this.mRenderTargets.resolveCanvasList.map(pResolveTexture => {
        return {
          view: pResolveTexture.source.native,
          resolveTarget: pResolveTexture.canvas.native.createView(),
          loadOp: 'load',
          storeOp: 'store'
        };
      });
      // Begin and end render pass. Render pass does only resolve targets.
      pExecutionContext.commandEncoder.beginRenderPass({
        colorAttachments: lColorTargetList
      }).end();
    } else {
      // Copy targets into canvas.
      for (const lResolveTexture of this.mRenderTargets.resolveCanvasList) {
        // Create External source.
        const lSource = {
          texture: lResolveTexture.source.texture.native,
          aspect: 'all',
          mipLevel: lResolveTexture.source.mipLevelStart
        };
        // Generate native texture.
        const lDestination = {
          texture: lResolveTexture.canvas.native,
          aspect: 'all',
          mipLevel: 0
        };
        // Clamp copy sizes to lowest.
        const lCopySize = {
          width: this.mRenderTargets.width,
          height: this.mRenderTargets.height,
          depthOrArrayLayers: lResolveTexture.source.arrayLayerStart + 1
        };
        pExecutionContext.commandEncoder.copyTextureToTexture(lSource, lDestination, lCopySize);
      }
    }
  }
}
exports.RenderPass = RenderPass;

/***/ }),

/***/ "./source/gpu/capabilities/gpu-capabilities.ts":
/*!*****************************************************!*\
  !*** ./source/gpu/capabilities/gpu-capabilities.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuCapabilities = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gpu_feature_enum_1 = __webpack_require__(/*! ./gpu-feature.enum */ "./source/gpu/capabilities/gpu-feature.enum.ts");
const gpu_limit_enum_1 = __webpack_require__(/*! ./gpu-limit.enum */ "./source/gpu/capabilities/gpu-limit.enum.ts");
/**
 * Gpu limits and features.
 */
class GpuCapabilities {
  /**
   * Constructor.
   *
   * @param pDevice - Gpu adapter.
   */
  constructor(pDevice) {
    // Convert all gpu features.
    this.mFeatures = new Set();
    for (const lFeature of pDevice.features) {
      const lGpuFeature = core_1.EnumUtil.cast(gpu_feature_enum_1.GpuFeature, lFeature);
      if (lGpuFeature) {
        this.mFeatures.add(lGpuFeature);
      }
    }
    // Convert gpu limits.
    this.mLimits = new core_1.Dictionary();
    for (const lLimitName of core_1.EnumUtil.valuesOf(gpu_limit_enum_1.GpuLimit)) {
      this.mLimits.set(lLimitName, pDevice.limits[lLimitName] ?? null);
    }
  }
  /**
   * Get limit value.
   *
   * @param pLimit - Limit name.
   *
   * @returns limitation value.
   */
  getLimit(pLimit) {
    return this.mLimits.get(pLimit);
  }
  /**
   * Check if gpu has the specified feature.
   *
   * @param pFeature - Feature name.
   *
   * @returns true when gpu has the feature.
   */
  hasFeature(pFeature) {
    return this.mFeatures.has(pFeature);
  }
}
exports.GpuCapabilities = GpuCapabilities;

/***/ }),

/***/ "./source/gpu/capabilities/gpu-feature.enum.ts":
/*!*****************************************************!*\
  !*** ./source/gpu/capabilities/gpu-feature.enum.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuFeature = void 0;
/**
 * Gpu feature names.
 */
var GpuFeature;
(function (GpuFeature) {
  GpuFeature["DepthClipControl"] = "depth-clip-control";
  GpuFeature["Depth32floatStencil8"] = "depth32float-stencil8";
  GpuFeature["TextureCompressionBc"] = "texture-compression-bc";
  GpuFeature["TextureCompressionBcSliced3d"] = "texture-compression-bc-sliced-3d";
  GpuFeature["TextureCompressionEtc2"] = "texture-compression-etc2";
  GpuFeature["TextureCompressionAstc"] = "texture-compression-astc";
  GpuFeature["TimestampQuery"] = "timestamp-query";
  GpuFeature["IndirectFirstInstance"] = "indirect-first-instance";
  GpuFeature["ShaderF16"] = "shader-f16";
  GpuFeature["Rg11b10ufloatRenderable"] = "rg11b10ufloat-renderable";
  GpuFeature["Bgra8unormStorage"] = "bgra8unorm-storage";
  GpuFeature["Float32Filterable"] = "float32-filterable";
  GpuFeature["ClipDistances"] = "clip-distances";
  GpuFeature["DualSourceBlendin"] = "dual-source-blending";
})(GpuFeature || (exports.GpuFeature = GpuFeature = {}));

/***/ }),

/***/ "./source/gpu/capabilities/gpu-limit.enum.ts":
/*!***************************************************!*\
  !*** ./source/gpu/capabilities/gpu-limit.enum.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuLimit = void 0;
/**
 * Gpu limit names.
 */
var GpuLimit;
(function (GpuLimit) {
  GpuLimit["MaxTextureDimension1D"] = "maxTextureDimension1D";
  GpuLimit["MaxTextureDimension2D"] = "maxTextureDimension2D";
  GpuLimit["MaxTextureDimension3D"] = "maxTextureDimension3D";
  GpuLimit["MaxTextureArrayLayers"] = "maxTextureArrayLayers";
  GpuLimit["MaxBindGroups"] = "maxBindGroups";
  GpuLimit["MaxBindGroupsPlusVertexBuffers"] = "maxBindGroupsPlusVertexBuffers";
  GpuLimit["MaxBindingsPerBindGroup"] = "maxBindingsPerBindGroup";
  GpuLimit["MaxDynamicUniformBuffersPerPipelineLayout"] = "maxDynamicUniformBuffersPerPipelineLayout";
  GpuLimit["MaxDynamicStorageBuffersPerPipelineLayout"] = "maxDynamicStorageBuffersPerPipelineLayout";
  GpuLimit["MaxSampledTexturesPerShaderStage"] = "maxSampledTexturesPerShaderStage";
  GpuLimit["MaxSamplersPerShaderStage"] = "maxSamplersPerShaderStage";
  GpuLimit["MaxStorageBuffersPerShaderStage"] = "maxStorageBuffersPerShaderStage";
  GpuLimit["MaxStorageTexturesPerShaderStage"] = "maxStorageTexturesPerShaderStage";
  GpuLimit["MaxUniformBuffersPerShaderStage"] = "maxUniformBuffersPerShaderStage";
  GpuLimit["MaxUniformBufferBindingSize"] = "maxUniformBufferBindingSize";
  GpuLimit["MaxStorageBufferBindingSize"] = "maxStorageBufferBindingSize";
  GpuLimit["MinUniformBufferOffsetAlignment"] = "minUniformBufferOffsetAlignment";
  GpuLimit["MinStorageBufferOffsetAlignment"] = "minStorageBufferOffsetAlignment";
  GpuLimit["MaxVertexBuffers"] = "maxVertexBuffers";
  GpuLimit["MaxBufferSize"] = "maxBufferSize";
  GpuLimit["MaxVertexAttributes"] = "maxVertexAttributes";
  GpuLimit["MaxVertexBufferArrayStride"] = "maxVertexBufferArrayStride";
  GpuLimit["MaxInterStageShaderComponents"] = "maxInterStageShaderComponents";
  GpuLimit["MaxInterStageShaderVariables"] = "maxInterStageShaderVariables";
  GpuLimit["MaxColorAttachments"] = "maxColorAttachments";
  GpuLimit["MaxColorAttachmentBytesPerSample"] = "maxColorAttachmentBytesPerSample";
  GpuLimit["MaxComputeWorkgroupStorageSize"] = "maxComputeWorkgroupStorageSize";
  GpuLimit["MaxComputeInvocationsPerWorkgroup"] = "maxComputeInvocationsPerWorkgroup";
  GpuLimit["MaxComputeWorkgroupSizeX"] = "maxComputeWorkgroupSizeX";
  GpuLimit["MaxComputeWorkgroupSizeY"] = "maxComputeWorkgroupSizeY";
  GpuLimit["MaxComputeWorkgroupSizeZ"] = "maxComputeWorkgroupSizeZ";
  GpuLimit["MaxComputeWorkgroupsPerDimension"] = "maxComputeWorkgroupsPerDimension";
})(GpuLimit || (exports.GpuLimit = GpuLimit = {}));

/***/ }),

/***/ "./source/gpu/gpu-device.ts":
/*!**********************************!*\
  !*** ./source/gpu/gpu-device.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuDevice = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gpu_execution_1 = __webpack_require__(/*! ../execution/gpu-execution */ "./source/execution/gpu-execution.ts");
const compute_pass_1 = __webpack_require__(/*! ../execution/pass/compute-pass */ "./source/execution/pass/compute-pass.ts");
const render_pass_1 = __webpack_require__(/*! ../execution/pass/render-pass */ "./source/execution/pass/render-pass.ts");
const render_targets_1 = __webpack_require__(/*! ../pipeline/target/render-targets */ "./source/pipeline/target/render-targets.ts");
const shader_1 = __webpack_require__(/*! ../shader/shader */ "./source/shader/shader.ts");
const canvas_texture_1 = __webpack_require__(/*! ../texture/canvas-texture */ "./source/texture/canvas-texture.ts");
const texture_format_capabilities_1 = __webpack_require__(/*! ../texture/texture-format-capabilities */ "./source/texture/texture-format-capabilities.ts");
const gpu_capabilities_1 = __webpack_require__(/*! ./capabilities/gpu-capabilities */ "./source/gpu/capabilities/gpu-capabilities.ts");
class GpuDevice {
  static {
    this.mAdapters = new core_1.Dictionary();
  }
  static {
    this.mDevices = new core_1.Dictionary();
  }
  /**
   * Request new gpu device.
   * @param pGenerator - Native object generator.
   */
  static request(pPerformance) {
    return _asyncToGenerator(function* () {
      // TODO: Required and optional requirements. Load available features and limits from adapter and request in device.
      // Try to load cached adapter. When not cached, request new one.
      const lAdapter = GpuDevice.mAdapters.get(pPerformance) ?? (yield window.navigator.gpu.requestAdapter({
        powerPreference: pPerformance
      }));
      if (!lAdapter) {
        throw new core_1.Exception('Error requesting GPU adapter', GpuDevice);
      }
      GpuDevice.mAdapters.set(pPerformance, lAdapter);
      // Try to load cached device. When not cached, request new one. // TODO: Required features.
      const lDevice = GpuDevice.mDevices.get(lAdapter) ?? (yield lAdapter.requestDevice({
        requiredFeatures: ['timestamp-query']
      }));
      if (!lDevice) {
        throw new core_1.Exception('Error requesting GPU device', GpuDevice);
      }
      GpuDevice.mDevices.set(lAdapter, lDevice);
      return new GpuDevice(lDevice);
    })();
  }
  /**
   * Gpu capabilities.
   */
  get capabilities() {
    return this.mCapabilities;
  }
  /**
   * Texture format validator.
   */
  get formatValidator() {
    return this.mFormatValidator;
  }
  /**
   * Get frame count.
   */
  get frameCount() {
    return this.mFrameCounter;
  }
  /**
   * Gpu device.
   */
  get gpu() {
    return this.mGpuDevice;
  }
  /**
   * Constructor.
   * @param pGenerator - Native GPU-Object Generator.
   */
  constructor(pDevice) {
    this.mGpuDevice = pDevice;
    // Setup capabilities.
    this.mCapabilities = new gpu_capabilities_1.GpuCapabilities(pDevice);
    // Set default for frame counter.
    this.mFrameCounter = 0;
    // Init form validator.
    this.mFormatValidator = new texture_format_capabilities_1.TextureFormatCapabilities(this);
    // Frame change listener.
    this.mFrameChangeListener = new core_1.List();
  }
  /**
   * Add listener called on frame change.
   *
   * @param pListener - Listener.
   */
  addFrameChangeListener(pListener) {
    this.mFrameChangeListener.push(pListener);
  }
  /**
   * Create or use a html canvas to create a canvas texture.
   *
   * @param pCanvas - Created canvas element.
   *
   * @returns canvas texture.
   */
  canvas(pCanvas) {
    // Create or use canvas.
    const lCanvas = pCanvas ?? document.createElement('canvas');
    return new canvas_texture_1.CanvasTexture(this, lCanvas);
  }
  /**
   * Create new compute pass.
   *
   * @returns new compute pass.
   */
  computePass() {
    return new compute_pass_1.ComputePass(this);
  }
  /**
   * Create pass executor.
   *
   * @param pOnExecute - On executor execute.
   */
  executor(pOnExecute) {
    return new gpu_execution_1.GpuExecution(this, pOnExecute);
  }
  /**
   * Remove listener called on frame change.
   *
   * @param pListener - Listener.
   */
  removeFrameChangeListener(pListener) {
    this.mFrameChangeListener.remove(pListener);
  }
  /**
   * Create new render pass.
   *
   * @param pRenderTargets - Render targets of pass.
   * @param pStaticBundle - Bundle is static and does not update very often.
   *
   * @returns new render pass.
   */
  renderPass(pRenderTargets, pExecution, pStaticBundle = true) {
    return new render_pass_1.RenderPass(this, pRenderTargets, pStaticBundle, pExecution);
  }
  /**
   * Create render target object.
   *
   * @param pMultisampled - Render targets are multisampled.
   *
   * @returns render target object.
   */
  renderTargets(pMultisampled = false) {
    return new render_targets_1.RenderTargets(this, pMultisampled);
  }
  /**
   * Create shader.
   *
   * @param pSource - Shader source as wgsl.
   */
  shader(pSource) {
    return new shader_1.Shader(this, pSource);
  }
  /**
   * Start new frame.
   */
  startNewFrame() {
    this.mFrameCounter++;
    // Call all frame change listener.
    for (const lListener of this.mFrameChangeListener) {
      lListener();
    }
  }
}
exports.GpuDevice = GpuDevice;

/***/ }),

/***/ "./source/gpu/object/gpu-object-child-setup.ts":
/*!*****************************************************!*\
  !*** ./source/gpu/object/gpu-object-child-setup.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuObjectChildSetup = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
class GpuObjectChildSetup {
  /**
   * Gpu device reference.
   */
  get device() {
    return this.mSetupReference.device;
  }
  /**
   * Setup data.
   */
  get setupData() {
    // References should be setup at this point.
    return this.mSetupReference.data;
  }
  /**
   * Setup references.
   */
  get setupReferences() {
    return this.mSetupReference;
  }
  /**
   * Constructor.
   *
   * @param pSetupReference - Setup references.
   * @param pDataCallback - Setup data callback.
   */
  constructor(pSetupReference, pDataCallback) {
    this.mSetupReference = pSetupReference;
    this.mSetupCallback = pDataCallback;
  }
  /**
   * Ensure that current call is used inside a setup call.
   */
  ensureThatInSetup() {
    // Lock setup to a setup call.
    if (!this.mSetupReference.inSetup) {
      throw new core_1.Exception('Can only setup in a setup call.', this);
    }
  }
  /**
   * Send data back to parent setup.
   *
   * @param pData - Setup complete data.
   */
  sendData(...pData) {
    this.mSetupCallback(...pData);
  }
}
exports.GpuObjectChildSetup = GpuObjectChildSetup;

/***/ }),

/***/ "./source/gpu/object/gpu-object-invalidation-reasons.ts":
/*!**************************************************************!*\
  !*** ./source/gpu/object/gpu-object-invalidation-reasons.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuObjectInvalidationReasons = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
class GpuObjectInvalidationReasons {
  /**
   * Life time was reached.
   */
  get deconstruct() {
    return this.mDeconstruct;
  }
  set deconstruct(pDeconstruct) {
    if (!pDeconstruct) {
      throw new core_1.Exception(`Deconstruct reason can not be reverted. Sadly.`, this);
    }
    this.mDeconstruct = pDeconstruct;
  }
  /**
   * Constructor.
   */
  constructor() {
    this.mReasons = new Set();
    this.mDeconstruct = false;
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
    return this.mReasons.size > 0 || this.mDeconstruct;
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
exports.GpuObjectInvalidationReasons = GpuObjectInvalidationReasons;

/***/ }),

/***/ "./source/gpu/object/gpu-object-setup.ts":
/*!***********************************************!*\
  !*** ./source/gpu/object/gpu-object-setup.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuObjectSetup = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
class GpuObjectSetup {
  /**
   * Gpu device reference.
   */
  get device() {
    return this.mSetupReference.device;
  }
  /**
   * Setup data.
   */
  get setupData() {
    // References should be setup at this point.
    return this.mSetupReference.data;
  }
  /**
   * Setup references.
   */
  get setupReferences() {
    return this.mSetupReference;
  }
  /**
   * Constructor.
   *
   * @param pSetupReference - Setup references.
   */
  constructor(pSetupReference) {
    this.mSetupReference = pSetupReference;
    // Fill default data to setup references.
    this.fillDefaultData(pSetupReference.data);
  }
  /**
   * Ensure that current call is used inside a setup call.
   */
  ensureThatInSetup() {
    // Lock setup to a setup call.
    if (!this.mSetupReference.inSetup) {
      throw new core_1.Exception('Can only setup in a setup call.', this);
    }
  }
}
exports.GpuObjectSetup = GpuObjectSetup;

/***/ }),

/***/ "./source/gpu/object/gpu-object.ts":
/*!*****************************************!*\
  !*** ./source/gpu/object/gpu-object.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuObject = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gpu_object_invalidation_reasons_1 = __webpack_require__(/*! ./gpu-object-invalidation-reasons */ "./source/gpu/object/gpu-object-invalidation-reasons.ts");
/**
 * Gpu object with a native internal object.
 */
class GpuObject {
  /**
   * Gpu Device.
   */
  get device() {
    return this.mDevice;
  }
  /**
   * Object was setup.
   */
  get isSetup() {
    return this.mIsSetup;
  }
  /**
   * Native gpu object.
   */
  get native() {
    return this.readNative();
  }
  /**
   * Constructor.
   * @param pDevice - Gpu device.
   * @param pNativeLifeTime - Lifetime of native object.
   */
  constructor(pDevice) {
    // Save static settings.
    this.mDevice = pDevice;
    this.mIsSetup = false;
    // Init default settings and config.
    this.mDeconstructed = false;
    this.mNativeObject = null;
    // Init lists.
    this.mUpdateListener = new core_1.Dictionary();
    this.mUpdateListenerAffectedTyped = new WeakMap();
    this.mInvalidationReasons = new gpu_object_invalidation_reasons_1.GpuObjectInvalidationReasons();
  }
  /**
   * Add invalidation listener.
   *
   * @param pListener - Listener.
   * @param pAffected - Trigger listener only on those reasons.
   *
   * @returns this.
   */
  addInvalidationListener(pListener, pFirstAffected, ...pAffected) {
    if (this.mUpdateListenerAffectedTyped.has(pListener)) {
      throw new core_1.Exception(`Invalidation listener can't be applied twice.`, this);
    }
    // Concat first and optional types.
    const lAffectedList = [pFirstAffected, ...pAffected];
    // Listener to each affected
    for (const lAffectedType of lAffectedList) {
      // Init new affected bucket.
      if (!this.mUpdateListener.has(lAffectedType)) {
        this.mUpdateListener.set(lAffectedType, new core_1.List());
      }
      // Assign listener to affected type.
      this.mUpdateListener.get(lAffectedType).push(pListener);
    }
    // Map listener to affected types.
    this.mUpdateListenerAffectedTyped.set(pListener, lAffectedList);
    return this;
  }
  /**
   * Deconstruct native object.
   */
  deconstruct() {
    this.mInvalidationReasons.deconstruct = true;
    // Clear and destroy old native when any update reason exists.
    if (this.mNativeObject !== null) {
      this.destroyNative(this.mNativeObject, this.mInvalidationReasons);
      this.mNativeObject = null;
    }
    this.mDeconstructed = true;
  }
  /**
   * Invalidate native gpu object so it will be created again.
   */
  invalidate(...pReasons) {
    // Single reason execution function.
    const lExecuteReasonListener = pReason => {
      // Skip reasons that already occurred or no native was created.
      // This step ensures to execute invalidation listener for all gpu objects that doesn't create natives. 
      if (this.mNativeObject !== null && this.mInvalidationReasons.has(pReason)) {
        return;
      }
      // Add invalidation reason.
      this.mInvalidationReasons.add(pReason);
      // Read listener list.
      const lListenerList = this.mUpdateListener.get(pReason);
      if (!lListenerList || lListenerList.length === 0) {
        return;
      }
      // Single execution of listener when only one exists.
      if (lListenerList.length === 1) {
        lListenerList[0](pReason);
      } else {
        for (const lListener of lListenerList) {
          lListener(pReason);
        }
      }
    };
    // Invalidate for each reason. Single reason execution when only one exists.
    if (pReasons.length === 1) {
      lExecuteReasonListener(pReasons[0]);
    } else {
      for (const lReason of pReasons) {
        lExecuteReasonListener(lReason);
      }
    }
  }
  /**
   * Add invalidation listener.
   * @param pListener - Listener.
   */
  removeInvalidationListener(pListener) {
    // Get all affected types of listener.
    const lAffectedList = this.mUpdateListenerAffectedTyped.get(pListener);
    if (!lAffectedList) {
      return;
    }
    // Remove all listener from each affected type.
    for (const lAffectedType of lAffectedList) {
      this.mUpdateListener.get(lAffectedType).remove(pListener);
    }
    // Remove listener from affected mapping.
    this.mUpdateListenerAffectedTyped.delete(pListener);
  }
  /**
   * Destroy native object.
   *
   * @param _pNative - Native object.
   * @param _pReasons - Reason why it should be destroyed.
   */
  destroyNative(_pNative, _pReasons) {
    return;
  }
  /**
   * Throws when the gpu object not setup.
   */
  ensureSetup() {
    if (!this.mIsSetup) {
      throw new core_1.Exception('Gpu object must be setup to access properties.', this);
    }
  }
  /**
   * Generate new native object.
   * Return null when no native can be generated.
   *
   * @param _pCurrentNative - Current native element.
   * @param _pReasons - Reason why it should be newly generated.
   */
  generateNative(_pCurrentNative, _pReasons) {
    return null;
  }
  /**
   * Setup with setup object.
   *
   * @param _pReferences - Used references.
   */
  onSetup(_pReferences) {
    return;
  }
  /**
   * Create setup object.
   * Return null to skip any setups.
   *
   * @param _pReferences - Unfilled setup references.
   *
   * @returns Setup object.
   */
  onSetupObjectCreate(_pReferences) {
    return null;
  }
  /**
   * Call setup.
   *
   * @param pSetupCallback - Setup callback.
   *
   * @returns this.
   */
  setup(pSetupCallback) {
    // Dont call twice.
    if (this.mIsSetup) {
      throw new core_1.Exception(`Render targets setup can't be called twice.`, this);
    }
    // Create unfilled
    const lSetupReferences = {
      inSetup: true,
      device: this.mDevice,
      data: {}
    };
    // Creates setup object.
    const lSetupObject = this.onSetupObjectCreate(lSetupReferences);
    if (lSetupObject !== null) {
      // Call optional user setup.
      if (pSetupCallback) {
        pSetupCallback(lSetupObject);
      }
      // Call gpu object setup. At this point all references should be filled.
      this.onSetup(lSetupReferences.data);
    }
    // Defuse setup references.
    lSetupReferences.inSetup = false;
    // Set gpu object as setup.
    this.mIsSetup = true;
    return this;
  }
  /**
   * Update native object.
   *
   * @param _pNative - Native object.
   * @param _pReasons - Reason why it should be updated.
   *
   * @returns true when native element was updated, false when it should be created anew.
   */
  updateNative(_pNative, _pReasons) {
    return false;
  }
  /**
   * Read up to date native object.
   * Invalidates, destroys and generates the native object.
   *
   * @returns native object.
   */
  readNative() {
    // Restrict deconstructed access.
    if (this.mDeconstructed) {
      throw new core_1.Exception(`Native GPU object was deconstructed and can't be used again.`, this);
    }
    // Ensure the setup was called.
    if (!this.isSetup) {
      // Call empty update.
      this.setup();
    }
    // When native is generated and is invalid, try to update it.
    if (this.mNativeObject !== null && this.mInvalidationReasons.any()) {
      // Try to update native.
      const lUpdateSuccessfull = this.updateNative(this.mNativeObject, this.mInvalidationReasons);
      if (lUpdateSuccessfull) {
        this.mInvalidationReasons.clear();
      }
    }
    // When no native is generated or update was not successfull.
    if (this.mNativeObject === null || this.mInvalidationReasons.any()) {
      // Save current native.
      const lCurrentNative = this.mNativeObject;
      // Generate new native.
      this.mNativeObject = this.generateNative(lCurrentNative, this.mInvalidationReasons);
      // Destroy old native when existing.
      if (lCurrentNative !== null) {
        this.destroyNative(lCurrentNative, this.mInvalidationReasons);
      }
      // Reset all update reasons.
      this.mInvalidationReasons.clear();
    }
    return this.mNativeObject;
  }
}
exports.GpuObject = GpuObject;

/***/ }),

/***/ "./source/gpu/object/gpu-resource-object.ts":
/*!**************************************************!*\
  !*** ./source/gpu/object/gpu-resource-object.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuResourceObjectInvalidationType = exports.GpuResourceObject = void 0;
const gpu_object_1 = __webpack_require__(/*! ./gpu-object */ "./source/gpu/object/gpu-object.ts");
/**
 * Gpu resource object.
 * Takes actual memory space on gpu hardware.
 */
class GpuResourceObject extends gpu_object_1.GpuObject {
  /**
   * Texture usage.
   */
  get usage() {
    return this.mResourceUsage;
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   */
  constructor(pDevice) {
    super(pDevice);
    // Set static config.
    this.mResourceUsage = 0;
  }
  /**
   * Extend usage of resource.
   * Might trigger a resource rebuild.
   *
   * @param pUsage - Usage.
   */
  extendUsage(pUsage) {
    // Update onyl when not already set.
    if ((this.mResourceUsage & pUsage) === 0) {
      this.mResourceUsage = this.mResourceUsage | pUsage;
      this.invalidate(GpuResourceObjectInvalidationType.ResourceRebuild);
    }
    return this;
  }
}
exports.GpuResourceObject = GpuResourceObject;
var GpuResourceObjectInvalidationType;
(function (GpuResourceObjectInvalidationType) {
  GpuResourceObjectInvalidationType["ResourceRebuild"] = "ResourceRebuild";
})(GpuResourceObjectInvalidationType || (exports.GpuResourceObjectInvalidationType = GpuResourceObjectInvalidationType = {}));

/***/ }),

/***/ "./source/memory_layout/base-memory-layout.ts":
/*!****************************************************!*\
  !*** ./source/memory_layout/base-memory-layout.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseMemoryLayout = void 0;
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
/**
 * Base memory layout.
 * Represents a memory slot used by a shader.
 */
class BaseMemoryLayout extends gpu_object_1.GpuObject {
  /**
   * Constuctor.
   * @param pDevice - Device reference.
   */
  constructor(pDevice) {
    super(pDevice);
  }
}
exports.BaseMemoryLayout = BaseMemoryLayout;

/***/ }),

/***/ "./source/memory_layout/buffer/array-buffer-memory-layout.ts":
/*!*******************************************************************!*\
  !*** ./source/memory_layout/buffer/array-buffer-memory-layout.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ArrayBufferMemoryLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ./base-buffer-memory-layout */ "./source/memory_layout/buffer/base-buffer-memory-layout.ts");
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
   * Type size in byte.
   */
  get fixedSize() {
    if (this.arraySize < 1) {
      return 0;
    }
    return this.arraySize * (Math.ceil(this.innerType.fixedSize / this.innerType.alignment) * this.innerType.alignment);
  }
  /**
   * Array type.
   */
  get innerType() {
    return this.mInnerType;
  }
  /**
   * Size of the variable part of layout in bytes.
   */
  get variableSize() {
    if (this.arraySize > 0) {
      return 0;
    }
    return Math.ceil(this.innerType.fixedSize / this.innerType.alignment) * this.innerType.alignment;
  }
  /**
   * Constructor.
   *
   * @param pDevice - Device reference.
   * @param pParameter - Parameter.
   */
  constructor(pDevice, pParameter) {
    super(pDevice);
    // Static properties.
    this.mArraySize = pParameter.arraySize;
    this.mInnerType = pParameter.innerType;
    if (this.mInnerType.variableSize > 0) {
      throw new core_1.Exception(`Array memory layout must be of fixed size.`, this);
    }
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
      if (this.variableSize > 0) {
        throw new core_1.Exception('No size can be calculated for dynamic array buffer locations.', this);
      }
      return {
        size: this.fixedSize,
        offset: 0
      };
    }
    // Validate item index.
    if (isNaN(lItemIndexString)) {
      throw new core_1.Exception('Array index must be a number.', this);
    }
    // Calculate size of single item.
    const lArrayItemSize = Math.ceil(this.innerType.fixedSize / this.innerType.alignment) * this.innerType.alignment;
    const lArrayItemOffset = parseInt(lItemIndexString) * lArrayItemSize;
    // Single item.
    if (lPathName.length === 0) {
      return {
        size: lArrayItemSize,
        offset: lArrayItemOffset
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

/***/ "./source/memory_layout/buffer/base-buffer-memory-layout.ts":
/*!******************************************************************!*\
  !*** ./source/memory_layout/buffer/base-buffer-memory-layout.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseBufferMemoryLayout = void 0;
const base_memory_layout_1 = __webpack_require__(/*! ../base-memory-layout */ "./source/memory_layout/base-memory-layout.ts");
class BaseBufferMemoryLayout extends base_memory_layout_1.BaseMemoryLayout {
  /**
   * Constructor.
   *
   * @param pDevice - Device reference.
   */
  constructor(pDevice) {
    super(pDevice);
  }
}
exports.BaseBufferMemoryLayout = BaseBufferMemoryLayout;

/***/ }),

/***/ "./source/memory_layout/buffer/primitive-buffer-memory-layout.ts":
/*!***********************************************************************!*\
  !*** ./source/memory_layout/buffer/primitive-buffer-memory-layout.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PrimitiveBufferMemoryLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ./base-buffer-memory-layout */ "./source/memory_layout/buffer/base-buffer-memory-layout.ts");
const buffer_item_format_enum_1 = __webpack_require__(/*! ../../constant/buffer-item-format.enum */ "./source/constant/buffer-item-format.enum.ts");
const buffer_item_multiplier_enum_1 = __webpack_require__(/*! ../../constant/buffer-item-multiplier.enum */ "./source/constant/buffer-item-multiplier.enum.ts");
class PrimitiveBufferMemoryLayout extends base_buffer_memory_layout_1.BaseBufferMemoryLayout {
  /**
   * Type byte alignment.
   */
  get alignment() {
    return this.mAlignment;
  }
  /**
   * Fixed buffer size in bytes.
   */
  get fixedSize() {
    return this.mSize;
  }
  /**
   * Buffer size in bytes.
   */
  get variableSize() {
    return 0;
  }
  /**
   * Constructor.
   *
   * @param pDevice - Device reference.
   * @param pParameter - Parameter.
   */
  constructor(pDevice, pParameter) {
    super(pDevice);
    // Set default size by format.
    this.mSize = (() => {
      switch (pParameter.primitiveFormat) {
        case buffer_item_format_enum_1.BufferItemFormat.Float32:
          return 4;
        case buffer_item_format_enum_1.BufferItemFormat.Uint32:
          return 4;
        case buffer_item_format_enum_1.BufferItemFormat.Sint32:
          return 4;
      }
    })();
    // Calculate alignment and size.
    [this.mAlignment, this.mSize] = (() => {
      switch (pParameter.primitiveMultiplier) {
        case buffer_item_multiplier_enum_1.BufferItemMultiplier.Single:
          return [this.mSize, this.mSize];
        case buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector2:
          return [this.mSize * 2, this.mSize * 2];
        case buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector3:
          return [this.mSize * 4, this.mSize * 3];
        case buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4:
          return [this.mSize * 4, this.mSize * 4];
        case buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix22:
          return [this.mSize * 2, this.mSize * 2 * 2];
        case buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix23:
          return [this.mSize * 4, this.mSize * 2 * 3];
        case buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix24:
          return [this.mSize * 4, this.mSize * 2 * 4];
        case buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix32:
          return [this.mSize * 2, this.mSize * 3 * 2];
        case buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix33:
          return [this.mSize * 4, this.mSize * 3 * 3];
        case buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix34:
          return [this.mSize * 4, this.mSize * 3 * 4];
        case buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix42:
          return [this.mSize * 2, this.mSize * 4 * 2];
        case buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix43:
          return [this.mSize * 4, this.mSize * 4 * 3];
        case buffer_item_multiplier_enum_1.BufferItemMultiplier.Matrix44:
          return [this.mSize * 4, this.mSize * 4 * 4];
      }
    })();
    // Override size of primitive.
    if (pParameter.overrideSize) {
      if (this.mSize > pParameter.overrideSize) {
        throw new core_1.Exception('Overriden buffer byte size can not be lower than the actual byte size.', this);
      }
      this.mAlignment = pParameter.overrideSize;
    }
    // Override alignment of primitive.
    if (pParameter.overrideAlignment) {
      if (pParameter.overrideAlignment % this.mAlignment !== 0) {
        throw new core_1.Exception('Overriden alignment must be dividable by its actual alignment value.', this);
      }
      this.mAlignment = pParameter.overrideAlignment;
    }
  }
  /**
   * Get location of path.
   * @param pPathName - Path name. Divided by dots.
   */
  locationOf(pPathName) {
    // Only validate name.
    if (pPathName.length !== 0) {
      throw new core_1.Exception(`Simple buffer layout has no properties.`, this);
    }
    return {
      size: this.fixedSize,
      offset: 0
    };
  }
}
exports.PrimitiveBufferMemoryLayout = PrimitiveBufferMemoryLayout;

/***/ }),

/***/ "./source/memory_layout/buffer/struct-buffer-memory-layout-property-setup.ts":
/*!***********************************************************************************!*\
  !*** ./source/memory_layout/buffer/struct-buffer-memory-layout-property-setup.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StructBufferMemoryLayoutPropertySetup = void 0;
const gpu_object_child_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-child-setup */ "./source/gpu/object/gpu-object-child-setup.ts");
const array_buffer_memory_layout_1 = __webpack_require__(/*! ./array-buffer-memory-layout */ "./source/memory_layout/buffer/array-buffer-memory-layout.ts");
const primitive_buffer_memory_layout_1 = __webpack_require__(/*! ./primitive-buffer-memory-layout */ "./source/memory_layout/buffer/primitive-buffer-memory-layout.ts");
const struct_buffer_memory_layout_1 = __webpack_require__(/*! ./struct-buffer-memory-layout */ "./source/memory_layout/buffer/struct-buffer-memory-layout.ts");
class StructBufferMemoryLayoutPropertySetup extends gpu_object_child_setup_1.GpuObjectChildSetup {
  /**
   * Buffer as array.
   *
   * @param pSize - Optional. Set size fixed.
   *
   * @returns array setup.
   */
  asArray(pSize = -1) {
    return new StructBufferMemoryLayoutPropertySetup(this.setupReferences, pMemoryLayout => {
      const lLayout = new array_buffer_memory_layout_1.ArrayBufferMemoryLayout(this.device, {
        arraySize: pSize,
        innerType: pMemoryLayout
      });
      this.sendData(lLayout);
    });
  }
  /**
   * Memory layout as primitive.
   *
   * @param pPrimitiveFormat - Primitive format.
   * @param pPrimitiveMultiplier - Value multiplier.
   */
  asPrimitive(pPrimitiveFormat, pPrimitiveMultiplier) {
    const lLayout = new primitive_buffer_memory_layout_1.PrimitiveBufferMemoryLayout(this.device, {
      primitiveFormat: pPrimitiveFormat,
      primitiveMultiplier: pPrimitiveMultiplier
    });
    // Send created data.
    this.sendData(lLayout);
  }
  /**
   * Memory layout as struct
   *
   * @param pSetupCall - Struct setup call.
   */
  asStruct(pSetupCall) {
    // Create and setup struct buffer memory layout.
    const lLayout = new struct_buffer_memory_layout_1.StructBufferMemoryLayout(this.device);
    lLayout.setup(pSetupCall);
    // Send created data.
    this.sendData(lLayout);
  }
}
exports.StructBufferMemoryLayoutPropertySetup = StructBufferMemoryLayoutPropertySetup;

/***/ }),

/***/ "./source/memory_layout/buffer/struct-buffer-memory-layout-setup.ts":
/*!**************************************************************************!*\
  !*** ./source/memory_layout/buffer/struct-buffer-memory-layout-setup.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StructBufferMemoryLayoutSetup = void 0;
const gpu_object_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-setup */ "./source/gpu/object/gpu-object-setup.ts");
const struct_buffer_memory_layout_property_setup_1 = __webpack_require__(/*! ./struct-buffer-memory-layout-property-setup */ "./source/memory_layout/buffer/struct-buffer-memory-layout-property-setup.ts");
class StructBufferMemoryLayoutSetup extends gpu_object_setup_1.GpuObjectSetup {
  /**
   * Add propery.
   *
   * @param pName - Propery name.
   *
   * @returns property setup.
   */
  property(pName) {
    // Create empty property.
    const lProperty = {
      name: pName,
      orderIndex: this.setupData.properties.length,
      layout: null
    };
    // Add empty property.
    this.setupData.properties.push(lProperty);
    // Create and return property setup.
    return new struct_buffer_memory_layout_property_setup_1.StructBufferMemoryLayoutPropertySetup(this.setupReferences, pMemoryLayout => {
      lProperty.layout = pMemoryLayout;
    });
  }
  /**
   * Fill in default data before the setup starts.
   *
   * @param pDataReference - Setup data reference.
   */
  fillDefaultData(pDataReference) {
    pDataReference.properties = new Array();
  }
}
exports.StructBufferMemoryLayoutSetup = StructBufferMemoryLayoutSetup;

/***/ }),

/***/ "./source/memory_layout/buffer/struct-buffer-memory-layout.ts":
/*!********************************************************************!*\
  !*** ./source/memory_layout/buffer/struct-buffer-memory-layout.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StructBufferMemoryLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ./base-buffer-memory-layout */ "./source/memory_layout/buffer/base-buffer-memory-layout.ts");
const struct_buffer_memory_layout_setup_1 = __webpack_require__(/*! ./struct-buffer-memory-layout-setup */ "./source/memory_layout/buffer/struct-buffer-memory-layout-setup.ts");
class StructBufferMemoryLayout extends base_buffer_memory_layout_1.BaseBufferMemoryLayout {
  /**
   * Alignment of type.
   */
  get alignment() {
    // Ensure setup was called.
    this.ensureSetup();
    return this.mAlignment;
  }
  /**
   * Type size in byte.
   */
  get fixedSize() {
    // Ensure setup was called.
    this.ensureSetup();
    return this.mFixedSize;
  }
  /**
   * Ordered inner properties.
   */
  get properties() {
    // Ensure setup was called.
    this.ensureSetup();
    return this.mInnerProperties.map(pProperty => pProperty.layout);
  }
  /**
   * Size of variable part of struct.
   */
  get variableSize() {
    // Ensure setup was called.
    this.ensureSetup();
    return this.mVariableSize;
  }
  /**
   * Constructor.
   *
   * @param pDevice - Device reference.
   * @param pParameter - Parameter.
   */
  constructor(pDevice) {
    super(pDevice);
    // Calculated properties.
    this.mAlignment = 0;
    this.mFixedSize = 0;
    this.mVariableSize = 0;
    // Static properties.
    this.mInnerProperties = new Array();
  }
  /**
   * Get location of path.
   * @param pPathName - Path name. Divided by dots.
   */
  locationOf(pPathName) {
    // Ensure setup was called.
    this.ensureSetup();
    const lPathName = [...pPathName];
    // Complete array.
    const lPropertyName = lPathName.shift();
    if (!lPropertyName) {
      if (this.mVariableSize > 0) {
        throw new core_1.Exception(`Can't read location of a memory layout with a variable size.`, this);
      }
      return {
        size: this.fixedSize,
        offset: 0
      };
    }
    // Recalculate size.
    let lPropertyOffset = 0;
    let lFoundProperty = null;
    for (const lProperty of this.mInnerProperties) {
      // Increase offset to needed alignment.
      lPropertyOffset = Math.ceil(lPropertyOffset / lProperty.layout.alignment) * lProperty.layout.alignment;
      // Inner property is found. Skip searching.
      // Alignment just applied so it can be skipped later.
      if (lProperty.name === lPropertyName) {
        lFoundProperty = lProperty;
        break;
      }
      // Increase offset for complete property. 
      // Only last property can have a variable size, so we can only save the fixed size.
      lPropertyOffset += lProperty.layout.fixedSize;
    }
    // Validate property.
    if (!lFoundProperty) {
      throw new core_1.Exception(`Struct buffer layout property "${lPropertyName}" not found.`, this);
    }
    const lPropertyLocation = lFoundProperty.layout.locationOf(lPathName);
    return {
      size: lPropertyLocation.size,
      offset: lPropertyOffset + lPropertyLocation.offset
    };
  }
  /**
   * Call setup.
   *
   * @param pSetupCallback - Setup callback.
   *
   * @returns this.
   */
  setup(pSetupCallback) {
    super.setup(pSetupCallback);
    return this;
  }
  /**
   * Setup struct layout.
   *
   * @param pReferences - Setup data references.
   */
  onSetup(pReferences) {
    // Add each property
    for (const lProperty of pReferences.properties) {
      if (!lProperty.layout) {
        throw new core_1.Exception(`Struct propery layout was not set.`, this);
      }
      this.mInnerProperties.push({
        orderIndex: lProperty.orderIndex,
        name: lProperty.name,
        layout: lProperty.layout
      });
    }
    // Order properties.
    this.mInnerProperties = this.mInnerProperties.sort((pA, pB) => {
      return pA.orderIndex - pB.orderIndex;
    });
    // Calculate size.
    let lRawDataSize = 0;
    for (let lIndex = 0; lIndex < this.mInnerProperties.length; lIndex++) {
      const lPropertyLayout = this.mInnerProperties[lIndex].layout;
      if (lPropertyLayout.variableSize > 0 && lIndex !== this.mInnerProperties.length - 1) {
        throw new core_1.Exception(`Only the last property of a struct memory layout can have a variable size.`, this);
      }
      // Increase offset to needed alignment.
      lRawDataSize = Math.ceil(lRawDataSize / lPropertyLayout.alignment) * lPropertyLayout.alignment;
      // Increase offset for type.
      lRawDataSize += lPropertyLayout.fixedSize;
      // Alignment is the highest alignment of all properties.
      if (lPropertyLayout.alignment > this.mAlignment) {
        this.mAlignment = lPropertyLayout.alignment;
      }
      // Set variable size. Can only be the last property.
      if (lPropertyLayout.variableSize > 0) {
        this.mVariableSize = lPropertyLayout.variableSize;
      }
    }
    // Apply struct alignment to raw data size.
    this.mFixedSize = Math.ceil(lRawDataSize / this.mAlignment) * this.mAlignment;
  }
  /**
   * Create setup object.
   *
   * @param pReferences - Setup references.
   *
   * @returns setup object.
   */
  onSetupObjectCreate(pReferences) {
    return new struct_buffer_memory_layout_setup_1.StructBufferMemoryLayoutSetup(pReferences);
  }
}
exports.StructBufferMemoryLayout = StructBufferMemoryLayout;

/***/ }),

/***/ "./source/memory_layout/buffer/vertex-buffer-memory-layout.ts":
/*!********************************************************************!*\
  !*** ./source/memory_layout/buffer/vertex-buffer-memory-layout.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexBufferMemoryLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const buffer_item_multiplier_enum_1 = __webpack_require__(/*! ../../constant/buffer-item-multiplier.enum */ "./source/constant/buffer-item-multiplier.enum.ts");
const vertex_buffer_item_format_enum_1 = __webpack_require__(/*! ../../constant/vertex-buffer-item-format.enum */ "./source/constant/vertex-buffer-item-format.enum.ts");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ./base-buffer-memory-layout */ "./source/memory_layout/buffer/base-buffer-memory-layout.ts");
class VertexBufferMemoryLayout extends base_buffer_memory_layout_1.BaseBufferMemoryLayout {
  /**
   * Type byte alignment.
   */
  get alignment() {
    return this.mSize;
  }
  /**
   * Fixed buffer size in bytes.
   */
  get fixedSize() {
    return 0;
  }
  /**
   * Underlying format of all parameters.
   */
  get format() {
    return this.mFormat;
  }
  /**
   * Byte count of underlying format.
   */
  get formatByteCount() {
    return this.mFormatByteCount;
  }
  /**
   * Buffer size in bytes.
   */
  get variableSize() {
    return this.mSize;
  }
  /**
   * Constructor.
   *
   * @param pDevice - Device reference.
   * @param pParameter - Parameter.
   */
  constructor(pDevice, pParameter) {
    super(pDevice);
    // Set default size by format.
    const lPrimitiveByteCount = (() => {
      switch (pParameter.format) {
        case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Float16:
          return 2;
        case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Float32:
          return 4;
        case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Uint32:
          return 4;
        case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Sint32:
          return 4;
        case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Uint8:
          return 1;
        case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Sint8:
          return 1;
        case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Uint16:
          return 2;
        case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Sint16:
          return 2;
        case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Unorm16:
          return 2;
        case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Snorm16:
          return 2;
        case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Unorm8:
          return 1;
        case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Snorm8:
          return 1;
      }
    })();
    // Set default size and init format values.
    this.mSize = 0;
    this.mFormat = pParameter.format;
    this.mFormatByteCount = lPrimitiveByteCount;
    // Calculate size of all parameter.
    for (const lParameter of pParameter.parameter) {
      // Calculate alignment and size.
      const lParameterSize = (() => {
        switch (lParameter.primitiveMultiplier) {
          case buffer_item_multiplier_enum_1.BufferItemMultiplier.Single:
            return lPrimitiveByteCount;
          case buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector2:
            return lPrimitiveByteCount * 2;
          case buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector3:
            return lPrimitiveByteCount * 3;
          case buffer_item_multiplier_enum_1.BufferItemMultiplier.Vector4:
            return lPrimitiveByteCount * 4;
          default:
            {
              throw new core_1.Exception(`Item multipier "${lParameter.primitiveMultiplier}" not supported for vertex buffer.`, this);
            }
        }
      })();
      // Extend buffer size.
      this.mSize = lParameterSize + lParameter.offset;
    }
  }
  /**
   * Get location of path.
   * @param pPathName - Path name. Divided by dots.
   */
  locationOf(pPathName) {
    // Only validate name.
    if (pPathName.length !== 0) {
      throw new core_1.Exception(`Simple buffer layout has no properties.`, this);
    }
    return {
      size: this.fixedSize,
      offset: 0
    };
  }
}
exports.VertexBufferMemoryLayout = VertexBufferMemoryLayout;

/***/ }),

/***/ "./source/memory_layout/texture/sampler-memory-layout.ts":
/*!***************************************************************!*\
  !*** ./source/memory_layout/texture/sampler-memory-layout.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SamplerMemoryLayout = void 0;
const base_memory_layout_1 = __webpack_require__(/*! ../base-memory-layout */ "./source/memory_layout/base-memory-layout.ts");
/**
 * Memory layouts for texture samplers.
 */
class SamplerMemoryLayout extends base_memory_layout_1.BaseMemoryLayout {
  /**
   * Sampler type.
   */
  get samplerType() {
    return this.mSamplerType;
  }
  /**
   * Constructor.
   *
   * @param pDevice - Device reference.
   */
  constructor(pDevice, pType) {
    super(pDevice);
    this.mSamplerType = pType;
  }
}
exports.SamplerMemoryLayout = SamplerMemoryLayout;

/***/ }),

/***/ "./source/memory_layout/texture/texture-view-memory-layout.ts":
/*!********************************************************************!*\
  !*** ./source/memory_layout/texture/texture-view-memory-layout.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureViewMemoryLayout = void 0;
const base_memory_layout_1 = __webpack_require__(/*! ../base-memory-layout */ "./source/memory_layout/base-memory-layout.ts");
/**
 * Memory layout for textures.
 */
class TextureViewMemoryLayout extends base_memory_layout_1.BaseMemoryLayout {
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
   * Constructor.
   *
   * @param pDevice - Device reference.
   * @param pParameter - Parameter.
   */
  constructor(pDevice, pParameter) {
    super(pDevice);
    // Set defauls.
    this.mDimension = pParameter.dimension;
    this.mFormat = pParameter.format;
    this.mMultisampled = pParameter.multisampled;
  }
}
exports.TextureViewMemoryLayout = TextureViewMemoryLayout;

/***/ }),

/***/ "./source/pipeline/compute-pipeline.ts":
/*!*********************************************!*\
  !*** ./source/pipeline/compute-pipeline.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ComputePipelineInvalidationType = exports.ComputePipeline = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const compute_stage_enum_1 = __webpack_require__(/*! ../constant/compute-stage.enum */ "./source/constant/compute-stage.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
class ComputePipeline extends gpu_object_1.GpuObject {
  /**
   * Pipeline shader.
   */
  get module() {
    return this.mShaderModule;
  }
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  /**
   * Constructor.
   * Set default data.
   * @param pDevice - Device.
   * @param pShader - Pipeline shader.
   */
  constructor(pDevice, pShader) {
    super(pDevice);
    this.mShaderModule = pShader;
    // Loaded pipeline for async creation.
    this.mLoadedPipeline = null;
    // Pipeline constants.
    this.mParameter = new core_1.Dictionary();
  }
  /**
   * Set optional parameter of pipeline.
   *
   * @param pParameterName - name of parameter.
   * @param pValue - Value.
   *
   * @returns this.
   */
  setParameter(pParameterName, pValue) {
    const lParameterUsage = this.mShaderModule.shader.parameter(pParameterName);
    // Set parameter for each assigned compute stage.
    for (const lUsage of lParameterUsage) {
      // Init parameters for computestage when not set.
      if (!this.mParameter.has(lUsage)) {
        this.mParameter.set(lUsage, {});
      }
      // Set value for compute stage.
      this.mParameter.get(lUsage)[pParameterName] = pValue;
    }
    // Generate pipeline anew.
    this.invalidate(ComputePipelineInvalidationType.NativeRebuild);
    return this;
  }
  /**
   * Generate native gpu pipeline data layout.
   */
  generateNative() {
    // Construct basic GPURenderPipelineDescriptor.
    const lPipelineDescriptor = {
      layout: this.mShaderModule.shader.layout.native,
      compute: {
        module: this.mShaderModule.shader.native,
        entryPoint: this.mShaderModule.entryPoint,
        constants: this.mParameter.get(compute_stage_enum_1.ComputeStage.Compute) ?? {}
      }
    };
    // Load pipeline asyncron and update native after promise resolve.
    this.device.gpu.createComputePipelineAsync(lPipelineDescriptor).then(pPipeline => {
      this.mLoadedPipeline = pPipeline;
      this.invalidate(ComputePipelineInvalidationType.NativeLoaded);
    });
    // Null as long as pipeline is loading.
    return null;
  }
}
exports.ComputePipeline = ComputePipeline;
var ComputePipelineInvalidationType;
(function (ComputePipelineInvalidationType) {
  ComputePipelineInvalidationType["NativeRebuild"] = "NativeRebuild";
  ComputePipelineInvalidationType["NativeLoaded"] = "NativeLoaded";
})(ComputePipelineInvalidationType || (exports.ComputePipelineInvalidationType = ComputePipelineInvalidationType = {}));

/***/ }),

/***/ "./source/pipeline/parameter/vertex-parameter-buffer-layout-setup.ts":
/*!***************************************************************************!*\
  !*** ./source/pipeline/parameter/vertex-parameter-buffer-layout-setup.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexParameterBufferLayoutSetup = void 0;
const gpu_object_child_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-child-setup */ "./source/gpu/object/gpu-object-child-setup.ts");
class VertexParameterBufferLayoutSetup extends gpu_object_child_setup_1.GpuObjectChildSetup {
  /**
   * Add new parameter to vertex layout.
   *
   * @param pName - Parameter name.
   * @param pLocation - Parameter location.
   * @param pFormat - Parameter data format.
   * @param pMultiplier - Data multiplication.
   * @param pAdditionalOffset - Additional offset. Offset 0 aligns right after the last parameter.
   * @returns
   */
  withParameter(pName, pLocation, pMultiplier, pAdditionalOffset = 0) {
    // Send layout data.
    this.sendData({
      name: pName,
      location: pLocation,
      multiplier: pMultiplier,
      offset: pAdditionalOffset
    });
    return this;
  }
}
exports.VertexParameterBufferLayoutSetup = VertexParameterBufferLayoutSetup;

/***/ }),

/***/ "./source/pipeline/parameter/vertex-parameter-layout-setup.ts":
/*!********************************************************************!*\
  !*** ./source/pipeline/parameter/vertex-parameter-layout-setup.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexParameterLayoutSetup = void 0;
const gpu_object_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-setup */ "./source/gpu/object/gpu-object-setup.ts");
const vertex_parameter_buffer_layout_setup_1 = __webpack_require__(/*! ./vertex-parameter-buffer-layout-setup */ "./source/pipeline/parameter/vertex-parameter-buffer-layout-setup.ts");
class VertexParameterLayoutSetup extends gpu_object_setup_1.GpuObjectSetup {
  /**
   * Add a new buffer layout to vertex parameter layout.
   *
   * @param pStepMode - Buffer step mode.
   *
   * @returns vertex buffer layout setup
   */
  buffer(pBufferName, pFormat, pStepMode) {
    // Create buffer.
    const lBuffer = {
      name: pBufferName,
      stepMode: pStepMode,
      format: pFormat,
      parameter: new Array()
    };
    // Add buffer to result.
    this.setupData.buffer.push(lBuffer);
    // Create and return buffer setup.
    return new vertex_parameter_buffer_layout_setup_1.VertexParameterBufferLayoutSetup(this.setupReferences, pLayout => {
      lBuffer.parameter.push(pLayout);
    });
  }
  /**
   * Fill in default data before the setup starts.
   *
   * @param pDataReference - Setup data.
   */
  fillDefaultData(pDataReference) {
    pDataReference.buffer = new Array();
  }
}
exports.VertexParameterLayoutSetup = VertexParameterLayoutSetup;

/***/ }),

/***/ "./source/pipeline/parameter/vertex-parameter-layout.ts":
/*!**************************************************************!*\
  !*** ./source/pipeline/parameter/vertex-parameter-layout.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexParameterLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const buffer_item_multiplier_enum_1 = __webpack_require__(/*! ../../constant/buffer-item-multiplier.enum */ "./source/constant/buffer-item-multiplier.enum.ts");
const vertex_parameter_step_mode_enum_1 = __webpack_require__(/*! ../../constant/vertex-parameter-step-mode.enum */ "./source/constant/vertex-parameter-step-mode.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
const vertex_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/vertex-buffer-memory-layout */ "./source/memory_layout/buffer/vertex-buffer-memory-layout.ts");
const vertex_parameter_1 = __webpack_require__(/*! ./vertex-parameter */ "./source/pipeline/parameter/vertex-parameter.ts");
const vertex_parameter_layout_setup_1 = __webpack_require__(/*! ./vertex-parameter-layout-setup */ "./source/pipeline/parameter/vertex-parameter-layout-setup.ts");
/**
 * Vertex parameter layout.
 */
class VertexParameterLayout extends gpu_object_1.GpuObject {
  /**
   * Get all parameter buffer names.
   */
  get bufferNames() {
    // Setup must be called.
    this.ensureSetup();
    return [...this.mBuffer.keys()];
  }
  /**
   * If parameters are indexable.
   * Meanins every parameter is eighter stepmode index or instance.
   * When even one parameter has a stepmode of vertex, any index parameters must be converted.
   */
  get indexable() {
    // Setup must be called.
    this.ensureSetup();
    return this.mIndexable;
  }
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  /**
   * Get all parameter names.
   */
  get parameterNames() {
    // Setup must be called.
    this.ensureSetup();
    return [...this.mParameter.keys()];
  }
  /**
   * Construct.
   *
   * @param pDevice - Device reference.
   * @param pLayout - Simple layout of parameter.
   */
  constructor(pDevice) {
    super(pDevice);
    this.mIndexable = false;
    this.mBuffer = new core_1.Dictionary();
    this.mParameter = new core_1.Dictionary();
  }
  /**
   * Create vertex parameters from layout.
   * @param pIndexData - Index data.
   */
  create(pIndexData) {
    return new vertex_parameter_1.VertexParameter(this.device, this, pIndexData);
  }
  /**
   * Get vertex parameter layout definition by name.
   *
   * @param pName - Parameter name.
   */
  parameter(pName) {
    const lLayout = this.mParameter.get(pName);
    if (!lLayout) {
      throw new core_1.Exception(`Vertex parameter "${pName}" is not defined.`, this);
    }
    return lLayout;
  }
  /**
   * Get vertex parameter layout definition by name.
   *
   * @param pBufferName - Parameter name.
   */
  parameterBuffer(pBufferName) {
    const lLayout = this.mBuffer.get(pBufferName);
    if (!lLayout) {
      throw new core_1.Exception(`Vertex parameter buffer "${pBufferName}" is not defined.`, this);
    }
    return lLayout;
  }
  /**
   * Call setup.
   *
   * @param pSetupCallback - Setup callback.
   *
   * @returns — this.
   */
  setup(pSetupCallback) {
    return super.setup(pSetupCallback);
  }
  /**
   * Generate new native object.
   */
  generateNative() {
    // Create vertex buffer layout for each parameter.
    const lLayoutList = new Array();
    const lParameterIndicies = new Array();
    for (const lBuffer of this.mBuffer.values()) {
      // Create parameter layouts.
      const lVertexAttributes = new Array();
      let lCurrentByteLength = 0;
      for (const lParameter of lBuffer.parameter) {
        // No double locations.
        if (lParameterIndicies[lParameter.location]) {
          throw new core_1.Exception(`Vertex parameter location "${lParameter.location}" can't be defined twice.`, this);
        }
        // Convert multiplier to value.
        const lByteMultiplier = lParameter.multiplier.split('').reduce((pPreviousNumber, pCurrentValue) => {
          const lCurrentNumber = parseInt(pCurrentValue);
          if (isNaN(lCurrentNumber)) {
            return pPreviousNumber;
          }
          return pPreviousNumber * lCurrentNumber;
        }, 1);
        // Convert multiplier to float32 format.
        let lFormat = `${lBuffer.format}x${lByteMultiplier}`;
        if (lParameter.multiplier === buffer_item_multiplier_enum_1.BufferItemMultiplier.Single) {
          lFormat = lBuffer.format;
        }
        // Create buffer layout.
        lVertexAttributes.push({
          format: lFormat,
          offset: lCurrentByteLength + lParameter.offset,
          shaderLocation: lParameter.location
        });
        // Increment current byte length.
        lCurrentByteLength += 4 * lByteMultiplier + lParameter.offset; // 32Bit-Number * (single, vector or matrix number count) 
        // Save location index for checkind double
        lParameterIndicies[lParameter.location] = true;
      }
      // Convert stepmode.
      let lStepmode = 'vertex';
      if (lBuffer.stepMode === vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Instance) {
        lStepmode = 'instance';
      }
      lLayoutList.push({
        stepMode: lStepmode,
        arrayStride: lBuffer.layout.variableSize,
        attributes: lVertexAttributes
      });
    }
    // Validate continuity of parameter locations.
    if (lParameterIndicies.length !== this.mParameter.size) {
      throw new core_1.Exception(`Vertex parameter locations need to be in continious order.`, this);
    }
    return lLayoutList;
  }
  /**
   * Setup with setup object.
   *
   * @param pReferences - Used references.
   */
  onSetup(pReferences) {
    let lCanBeIndexed = true;
    // Create each buffer.
    for (const lBufferSetupData of pReferences.buffer) {
      // Add each parameter to parameter list.
      const lParameterList = new Array();
      const lParameterlayoutList = new Array();
      for (const lParameterSetupData of lBufferSetupData.parameter) {
        // Create parameter list for the vertex buffer memory layout.
        lParameterlayoutList.push({
          primitiveMultiplier: lParameterSetupData.multiplier,
          offset: lParameterSetupData.offset
        });
        // Create vertex parameter.
        const lParameterLayout = {
          name: lParameterSetupData.name,
          location: lParameterSetupData.location,
          multiplier: lParameterSetupData.multiplier,
          offset: lParameterSetupData.offset,
          bufferName: lBufferSetupData.name
        };
        // Add to parameter list and mapping.
        lParameterList.push(lParameterLayout);
        this.mParameter.set(lParameterLayout.name, lParameterLayout);
      }
      // Create empty buffer.
      const lBufferLayout = {
        name: lBufferSetupData.name,
        stepMode: lBufferSetupData.stepMode,
        format: lBufferSetupData.format,
        parameter: lParameterList,
        layout: new vertex_buffer_memory_layout_1.VertexBufferMemoryLayout(this.device, {
          format: lBufferSetupData.format,
          parameter: lParameterlayoutList
        })
      };
      this.mBuffer.set(lBufferLayout.name, lBufferLayout);
      // When one buffer is not indexable than no buffer is it.
      if (lBufferLayout.stepMode === vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Vertex) {
        lCanBeIndexed = false;
      }
    }
    this.mIndexable = lCanBeIndexed;
  }
  /**
   * Create setup object. Return null to skip any setups.
   *
   * @param pReferences - Setup references.
   *
   * @returns created setup.
   */
  onSetupObjectCreate(pReferences) {
    return new vertex_parameter_layout_setup_1.VertexParameterLayoutSetup(pReferences);
  }
}
exports.VertexParameterLayout = VertexParameterLayout;

/***/ }),

/***/ "./source/pipeline/parameter/vertex-parameter.ts":
/*!*******************************************************!*\
  !*** ./source/pipeline/parameter/vertex-parameter.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexParameterInvalidationType = exports.VertexParameter = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gpu_buffer_1 = __webpack_require__(/*! ../../buffer/gpu-buffer */ "./source/buffer/gpu-buffer.ts");
const buffer_item_format_enum_1 = __webpack_require__(/*! ../../constant/buffer-item-format.enum */ "./source/constant/buffer-item-format.enum.ts");
const buffer_item_multiplier_enum_1 = __webpack_require__(/*! ../../constant/buffer-item-multiplier.enum */ "./source/constant/buffer-item-multiplier.enum.ts");
const buffer_usage_enum_1 = __webpack_require__(/*! ../../constant/buffer-usage.enum */ "./source/constant/buffer-usage.enum.ts");
const vertex_buffer_item_format_enum_1 = __webpack_require__(/*! ../../constant/vertex-buffer-item-format.enum */ "./source/constant/vertex-buffer-item-format.enum.ts");
const vertex_parameter_step_mode_enum_1 = __webpack_require__(/*! ../../constant/vertex-parameter-step-mode.enum */ "./source/constant/vertex-parameter-step-mode.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
const array_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/array-buffer-memory-layout */ "./source/memory_layout/buffer/array-buffer-memory-layout.ts");
const primitive_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/primitive-buffer-memory-layout */ "./source/memory_layout/buffer/primitive-buffer-memory-layout.ts");
class VertexParameter extends gpu_object_1.GpuObject {
  /**
   * Get index buffer.
   */
  get indexBuffer() {
    return this.mIndexBufferView;
  }
  /**
   * Get parameter layout.
   */
  get layout() {
    return this.mLayout;
  }
  /**
   * Vertex count.
   */
  get vertexCount() {
    return this.mIndices.length;
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
    this.mData = new core_1.Dictionary();
    // Create index layout.
    const lIndexLayout = new primitive_buffer_memory_layout_1.PrimitiveBufferMemoryLayout(this.device, {
      primitiveFormat: buffer_item_format_enum_1.BufferItemFormat.Uint32,
      primitiveMultiplier: buffer_item_multiplier_enum_1.BufferItemMultiplier.Single
    });
    // Create index buffer layout.
    const lIndexBufferLayout = new array_buffer_memory_layout_1.ArrayBufferMemoryLayout(this.device, {
      arraySize: pIndices.length,
      innerType: lIndexLayout
    });
    // Save index information.
    this.mIndices = pIndices;
    // Create index buffer.
    this.mIndexBufferView = null;
    if (this.mLayout.indexable) {
      // Decide wich format to use.
      if (pIndices.length < Math.pow(2, 16)) {
        // Create index buffer.
        const lIndexBuffer = new gpu_buffer_1.GpuBuffer(pDevice, pIndices.length * 2);
        lIndexBuffer.extendUsage(buffer_usage_enum_1.BufferUsage.Index);
        lIndexBuffer.initialData(() => {
          return new Uint16Array(pIndices);
        });
        // Create view of buffer.
        this.mIndexBufferView = lIndexBuffer.view(lIndexBufferLayout, Uint16Array);
      } else {
        // Create index buffer.
        const lIndexBuffer = new gpu_buffer_1.GpuBuffer(pDevice, pIndices.length * 4);
        lIndexBuffer.extendUsage(buffer_usage_enum_1.BufferUsage.Index);
        lIndexBuffer.initialData(() => {
          return new Uint32Array(pIndices);
        });
        // Create view of buffer.
        this.mIndexBufferView = lIndexBuffer.view(lIndexBufferLayout, Uint32Array);
      }
    }
  }
  /**
   * Get parameter buffer.
   * @param pName - Parameter name.
   */
  get(pName) {
    // Validate.
    if (!this.mData.has(pName)) {
      throw new core_1.Exception(`Vertex parameter buffer for "${pName}" not set.`, this);
    }
    return this.mData.get(pName);
  }
  /**
   * Set parameter data.
   * @param pName - parameter buffer name.
   * @param pData - Parameter data.
   */
  set(pBufferName, pData) {
    const lParameterLayout = this.mLayout.parameterBuffer(pBufferName);
    // When parameter is indexed but vertex parameter are not indexed, extend data. Based on index data.
    let lData = pData;
    if (!this.mLayout.indexable && lParameterLayout.stepMode === vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Index) {
      // Calculate how many items represent one parameter.
      const lStepCount = lParameterLayout.layout.variableSize / lParameterLayout.layout.formatByteCount;
      // Dublicate dependent on index information.
      lData = new Array();
      for (const lIndex of this.mIndices) {
        const lDataStart = lIndex * lStepCount;
        const lDataEnd = lDataStart + lStepCount;
        // Copy vertex parameter data.
        lData.push(...pData.slice(lDataStart, lDataEnd));
      }
    }
    // Calculate vertex parameter count.
    const lVertexParameterItemCount = lData.length * lParameterLayout.layout.formatByteCount / lParameterLayout.layout.variableSize;
    // Load typed array from layout format.
    const lParameterBuffer = (() => {
      const lInitialData = (() => {
        switch (lParameterLayout.format) {
          case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Float32:
            return new Float32Array(lData);
          case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Uint32:
            return new Uint32Array(lData);
          case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Sint32:
            return new Int32Array(lData);
          case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Uint8:
            return new Uint8Array(lData);
          case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Sint8:
            return new Int8Array(lData);
          case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Uint16:
            return new Uint16Array(lData);
          case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Sint16:
            return new Int16Array(lData);
          // Unsupported
          case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Float16:
          case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Unorm16:
          case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Snorm16:
          case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Unorm8:
          case vertex_buffer_item_format_enum_1.VertexBufferItemFormat.Snorm8:
          default:
            {
              throw new core_1.Exception(`Currently "${lParameterLayout.format}" is not supported.`, this);
            }
        }
      })();
      return new gpu_buffer_1.GpuBuffer(this.device, lParameterLayout.layout.variableSize * lVertexParameterItemCount).initialData(() => {
        return lInitialData;
      });
    })();
    // Extend buffer to be a vertex buffer.
    lParameterBuffer.extendUsage(buffer_usage_enum_1.BufferUsage.Vertex);
    // Save gpu buffer in correct index.
    this.mData.set(pBufferName, lParameterBuffer);
    // Invalidate on data set.
    this.invalidate(VertexParameterInvalidationType.Data);
    return lParameterBuffer;
  }
}
exports.VertexParameter = VertexParameter;
var VertexParameterInvalidationType;
(function (VertexParameterInvalidationType) {
  VertexParameterInvalidationType["Data"] = "DataChange";
})(VertexParameterInvalidationType || (exports.VertexParameterInvalidationType = VertexParameterInvalidationType = {}));

/***/ }),

/***/ "./source/pipeline/target/render-targets-setup.ts":
/*!********************************************************!*\
  !*** ./source/pipeline/target/render-targets-setup.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderTargetsSetup = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const texture_operation_enum_1 = __webpack_require__(/*! ../../constant/texture-operation.enum */ "./source/constant/texture-operation.enum.ts");
const gpu_object_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-setup */ "./source/gpu/object/gpu-object-setup.ts");
const render_targets_texture_setup_1 = __webpack_require__(/*! ./render-targets-texture-setup */ "./source/pipeline/target/render-targets-texture-setup.ts");
class RenderTargetsSetup extends gpu_object_setup_1.GpuObjectSetup {
  /**
   * Constructor
   *
   * @param pSetupReference -Setup references.
   */
  constructor(pSetupReference, pMultisampled) {
    super(pSetupReference);
    // Set static multisampled state.
    this.mMultisampled = pMultisampled;
  }
  /**
   * Add color target.
   *
   * @param pName - Color target name.
   * @param pLocationIndex - Target location index.
   * @param pKeepOnEnd - Keep information after render pass end.
   * @param pClearValue - Clear value on render pass start. Omit to never clear.
   */
  addColor(pName, pLocationIndex, pKeepOnEnd = true, pClearValue) {
    // Lock setup to a setup call.
    this.ensureThatInSetup();
    // Convert render attachment to a location mapping. 
    const lTarget = {
      name: pName,
      index: pLocationIndex,
      clearValue: pClearValue ?? null,
      storeOperation: pKeepOnEnd ? texture_operation_enum_1.TextureOperation.Keep : texture_operation_enum_1.TextureOperation.Clear,
      textureView: null,
      resolveCanvas: null
    };
    // Add to color attachment list.
    this.setupData.colorTargets.push(lTarget);
    // Return texture setup. Set texture on texture resolve.
    return new render_targets_texture_setup_1.RenderTargetTextureSetup(this.setupReferences, this.mMultisampled, pTexture => {
      lTarget.textureView = pTexture.view;
      lTarget.resolveCanvas = pTexture.resolveCanvas;
    });
  }
  /**
   * Add depth and stencil target. Actual usage of depth and stencil is the used texture format.
   *
   * @param pDepthKeepOnEnd - Keep information after render pass end.
   * @param pDepthClearValue - Clear value on render pass start. Omit to never clear.
   * @param pStencilKeepOnEnd - Keep information after render pass end.
   * @param pStencilClearValue - Clear value on render pass start. Omit to never clear.
   */
  addDepthStencil(pDepthKeepOnEnd = null, pDepthClearValue = null, pStencilKeepOnEnd = null, pStencilClearValue = null) {
    // Lock setup to a setup call.
    this.ensureThatInSetup();
    this.setupData.depthStencil = {
      textureView: null
    };
    // Setup depth when values where set.
    if (pDepthKeepOnEnd !== null || pDepthClearValue !== null) {
      this.setupData.depthStencil.depth = {
        clearValue: pDepthClearValue ?? null,
        storeOperation: pDepthKeepOnEnd ? texture_operation_enum_1.TextureOperation.Keep : texture_operation_enum_1.TextureOperation.Clear
      };
    }
    // Setup stencil when values where set.
    if (pStencilKeepOnEnd !== null || pStencilClearValue !== null) {
      this.setupData.depthStencil.stencil = {
        clearValue: pStencilClearValue ?? null,
        storeOperation: pStencilKeepOnEnd ? texture_operation_enum_1.TextureOperation.Keep : texture_operation_enum_1.TextureOperation.Clear
      };
    }
    // Return texture setup. Set texture on texture resolve.
    return new render_targets_texture_setup_1.RenderTargetTextureSetup(this.setupReferences, this.mMultisampled, pTexture => {
      // Restrict used texture type to a frame buffer.
      if (pTexture.resolveCanvas) {
        throw new core_1.Exception(`Can't use a canvas texture as depth or stencil texture.`, this);
      }
      this.setupData.depthStencil.textureView = pTexture.view;
    });
  }
  /**
   * Fill in default data before the setup starts.
   *
   * @param pDataReference - Setup data reference.
   */
  fillDefaultData(pDataReference) {
    pDataReference.colorTargets = new Array();
  }
}
exports.RenderTargetsSetup = RenderTargetsSetup;

/***/ }),

/***/ "./source/pipeline/target/render-targets-texture-setup.ts":
/*!****************************************************************!*\
  !*** ./source/pipeline/target/render-targets-texture-setup.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderTargetTextureSetup = void 0;
const texture_dimension_enum_1 = __webpack_require__(/*! ../../constant/texture-dimension.enum */ "./source/constant/texture-dimension.enum.ts");
const texture_view_dimension_enum_1 = __webpack_require__(/*! ../../constant/texture-view-dimension.enum */ "./source/constant/texture-view-dimension.enum.ts");
const gpu_object_child_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-child-setup */ "./source/gpu/object/gpu-object-child-setup.ts");
const gpu_texture_1 = __webpack_require__(/*! ../../texture/gpu-texture */ "./source/texture/gpu-texture.ts");
class RenderTargetTextureSetup extends gpu_object_child_setup_1.GpuObjectChildSetup {
  /**
   * Constructor.
   *
   * @param pSetupReference - Setup references.
   * @param pMultisampled - Multisample state.
   * @param pDataCallback - Setup data callback.
   */
  constructor(pSetupReference, pMultisampled, pDataCallback) {
    super(pSetupReference, pDataCallback);
    // Set static multisampled state.
    this.mMultisampled = pMultisampled;
  }
  /**
   * Create new color render target.
   *
   * @param pFormat - Texture format.
   * @param pResolve - Optional resolve target.
   *
   * @returns created texture view.
   */
  new(pFormat, pResolve = null) {
    // Lock setup to a setup call.
    this.ensureThatInSetup();
    // Create new texture.
    const lTexture = new gpu_texture_1.GpuTexture(this.device, {
      format: pFormat,
      dimension: texture_dimension_enum_1.TextureDimension.TwoDimension,
      multisampled: this.mMultisampled
    });
    // Create view from texture.
    const lTextureView = lTexture.useAs(texture_view_dimension_enum_1.TextureViewDimension.TwoDimension);
    // Callback texture.
    this.sendData({
      view: lTextureView,
      resolveCanvas: pResolve
    });
    return lTextureView;
  }
  /**
   * Use a existing texture.
   *
   * @param pTexture - Existing texture.
   */
  use(pTextureView, pResolve = null) {
    // Lock setup to a setup call.
    this.ensureThatInSetup();
    // Callback texture.
    this.sendData({
      view: pTextureView,
      resolveCanvas: pResolve
    });
    // Return same data.
    return pTextureView;
  }
}
exports.RenderTargetTextureSetup = RenderTargetTextureSetup;

/***/ }),

/***/ "./source/pipeline/target/render-targets.ts":
/*!**************************************************!*\
  !*** ./source/pipeline/target/render-targets.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderTargetsInvalidationType = exports.RenderTargets = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const texture_aspect_enum_1 = __webpack_require__(/*! ../../constant/texture-aspect.enum */ "./source/constant/texture-aspect.enum.ts");
const texture_operation_enum_1 = __webpack_require__(/*! ../../constant/texture-operation.enum */ "./source/constant/texture-operation.enum.ts");
const texture_usage_enum_1 = __webpack_require__(/*! ../../constant/texture-usage.enum */ "./source/constant/texture-usage.enum.ts");
const texture_view_dimension_enum_1 = __webpack_require__(/*! ../../constant/texture-view-dimension.enum */ "./source/constant/texture-view-dimension.enum.ts");
const gpu_limit_enum_1 = __webpack_require__(/*! ../../gpu/capabilities/gpu-limit.enum */ "./source/gpu/capabilities/gpu-limit.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
const gpu_resource_object_1 = __webpack_require__(/*! ../../gpu/object/gpu-resource-object */ "./source/gpu/object/gpu-resource-object.ts");
const render_targets_setup_1 = __webpack_require__(/*! ./render-targets-setup */ "./source/pipeline/target/render-targets-setup.ts");
/**
 * Group of textures with the same size and multisample level.
 */
class RenderTargets extends gpu_object_1.GpuObject {
  /**
   * Color attachment names ordered by index.
   */
  get colorTargetNames() {
    // Ensure setup was called.
    this.ensureSetup();
    // Create color attachment list in order.
    const lColorAttachmentNameList = new Array();
    for (const lColorAttachment of this.mColorTargets.values()) {
      lColorAttachmentNameList[lColorAttachment.index] = lColorAttachment.name;
    }
    return lColorAttachmentNameList;
  }
  /**
   * Stencil attachment texture.
   */
  get hasDepth() {
    // Ensure setup was called.
    this.ensureSetup();
    return !!this.mDepthStencilTarget?.depth;
  }
  /**
   * Stencil attachment texture.
   */
  get hasStencil() {
    // Ensure setup was called.
    this.ensureSetup();
    return !!this.mDepthStencilTarget?.stencil;
  }
  /**
   * Render target height.
   */
  get height() {
    return this.mSize.height;
  }
  /**
   * Render target multisample level.
   */
  get multisampled() {
    return this.mMultisampled;
  }
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  /**
   * List of all resolve canvases.
   */
  get resolveCanvasList() {
    return this.mResolveCanvasList;
  }
  /**
   * Render target height.
   */
  get width() {
    return this.mSize.width;
  }
  /**
   * Constuctor.
   * @param pDevice - Gpu device reference.
   */
  constructor(pDevice, pMultisampled) {
    super(pDevice);
    // Set statics.
    this.mMultisampled = pMultisampled;
    // Set default size. 
    this.mSize = {
      width: 1,
      height: 1
    };
    // Setup initial data.
    this.mDepthStencilTarget = null;
    this.mColorTargets = new Array();
    this.mColorTargetNames = new core_1.Dictionary();
    this.mTargetViewUpdateQueue = new Set();
    this.mResolveCanvasList = new Array();
  }
  /**
   * Get color target by name.
   *
   * @param pTargetName - Target name.
   *
   * @returns target texture.
   */
  colorTarget(pTargetName) {
    // Read index of color target.
    const lColorTargetIndex = this.mColorTargetNames.get(pTargetName) ?? null;
    if (lColorTargetIndex === null) {
      throw new core_1.Exception(`Color target "${pTargetName}" does not exists.`, this);
    }
    return this.mColorTargets[lColorTargetIndex].texture.target;
  }
  /**
   * Get depth attachment texture.
   */
  depthStencilTarget() {
    // Ensure setup was called.
    this.ensureSetup();
    // No depth texture setup.
    if (!this.mDepthStencilTarget || !this.mDepthStencilTarget.depth) {
      throw new core_1.Exception(`Depth or stencil target does not exists.`, this);
    }
    return this.mDepthStencilTarget.target;
  }
  /**
   * Check for color target existence.
   *
   * @param pTargetName - Color target name.
   *
   * @returns true when color target exists.
   */
  hasColorTarget(pTargetName) {
    return this.mColorTargetNames.has(pTargetName);
  }
  /**
   * Resize all render targets.
   *
   * @param pWidth - New texture width.
   * @param pHeight - New texture height.
   * @param pMultisampleLevel - New texture multisample level.
   *
   * @returns this.
   */
  resize(pHeight, pWidth) {
    // Set 2D size dimensions
    this.mSize.width = pWidth;
    this.mSize.height = pHeight;
    // Apply resize for all textures.
    // This trigger RenderTargetsInvalidationType.NativeUpdate for textures set in setTextureInvalidationListener.
    this.applyResize();
    // Trigger resize invalidation. Does not automaticly trigger rebuild.
    this.invalidate(RenderTargetsInvalidationType.Resize);
    return this;
  }
  /**
   * Call setup.
   * Exposes internal setup.
   *
   * @param pSetupCallback - Setup callback.
   *
   * @returns this.
   */
  setup(pSetupCallback) {
    return super.setup(pSetupCallback);
  }
  /**
   * Generate native gpu bind data group.
   */
  generateNative() {
    // Create color attachments.
    const lColorAttachments = new Array();
    for (const lColorAttachment of this.mColorTargets) {
      // Convert Texture operation to load operations.
      const lStoreOperation = lColorAttachment.storeOperation === texture_operation_enum_1.TextureOperation.Keep ? 'store' : 'discard';
      // Create basic color attachment.
      const lPassColorAttachment = {
        view: lColorAttachment.texture.target.native,
        storeOp: lStoreOperation,
        loadOp: 'clear' // Placeholder
      };
      // Set clear value 
      if (lColorAttachment.clearValue !== null) {
        lPassColorAttachment.clearValue = lColorAttachment.clearValue;
        lPassColorAttachment.loadOp = 'clear';
      } else {
        lPassColorAttachment.loadOp = 'load';
      }
      lColorAttachments.push(lPassColorAttachment);
    }
    // Create descriptor with color attachments.
    const lDescriptor = {
      colorAttachments: lColorAttachments
    };
    // Set optional depth attachment.
    if (this.mDepthStencilTarget) {
      const lDepthStencilTexture = this.mDepthStencilTarget.target;
      // Add texture view for depth.
      lDescriptor.depthStencilAttachment = {
        view: lDepthStencilTexture.native
      };
      // Add depth values when depth formats are used.
      if (this.mDepthStencilTarget.depth) {
        // Set clear value of depth texture.
        if (this.mDepthStencilTarget.depth.clearValue !== null) {
          lDescriptor.depthStencilAttachment.depthClearValue = this.mDepthStencilTarget.depth.clearValue;
          lDescriptor.depthStencilAttachment.depthLoadOp = 'clear';
        } else {
          lDescriptor.depthStencilAttachment.depthLoadOp = 'load';
        }
        // Convert Texture operation to load operations.
        lDescriptor.depthStencilAttachment.depthStoreOp = this.mDepthStencilTarget.depth.storeOperation === texture_operation_enum_1.TextureOperation.Keep ? 'store' : 'discard';
      }
      // Add stencil values when stencil formats are used.
      if (this.mDepthStencilTarget.stencil) {
        // Set clear value of stencil texture.
        if (this.mDepthStencilTarget.stencil.clearValue !== null) {
          lDescriptor.depthStencilAttachment.stencilClearValue = this.mDepthStencilTarget.stencil.clearValue;
          lDescriptor.depthStencilAttachment.stencilLoadOp = 'clear';
        } else {
          lDescriptor.depthStencilAttachment.stencilLoadOp = 'load';
        }
        // Convert Texture operation to load operations.
        lDescriptor.depthStencilAttachment.stencilStoreOp = this.mDepthStencilTarget.stencil.storeOperation === texture_operation_enum_1.TextureOperation.Keep ? 'store' : 'discard';
      }
    }
    return lDescriptor;
  }
  /**
   * Setup object based on setup data.
   *
   * @param pReferenceData - Referenced setup data.
   */
  onSetup(pReferenceData) {
    // Enforce gpu color attachment limits.
    const lMaxRenderTargets = this.device.capabilities.getLimit(gpu_limit_enum_1.GpuLimit.MaxColorAttachments);
    if (pReferenceData.colorTargets.length > lMaxRenderTargets - 1) {
      throw new core_1.Exception(`Max color targets count exeeced.`, this);
    }
    // Setup depth stencil targets.
    if (pReferenceData.depthStencil) {
      // Validate existence of depth stencil texture.
      if (!pReferenceData.depthStencil.textureView) {
        throw new core_1.Exception(`Depth/ stencil attachment defined but no texture was assigned.`, this);
      }
      // Only two dimensional textures.
      if (pReferenceData.depthStencil.textureView.layout.dimension !== texture_view_dimension_enum_1.TextureViewDimension.TwoDimension) {
        throw new core_1.Exception(`Color attachment can only two dimensional.`, this);
      }
      // Save setup texture.
      this.mDepthStencilTarget = {
        target: pReferenceData.depthStencil.textureView
      };
      // Add render attachment texture usage to depth stencil texture.
      pReferenceData.depthStencil.textureView.texture.extendUsage(texture_usage_enum_1.TextureUsage.RenderAttachment);
      // Passthrough depth stencil texture changes.
      this.setTextureInvalidationListener(pReferenceData.depthStencil.textureView, -1);
      // Read capability of used depth stencil texture format.
      const lFormatCapability = this.device.formatValidator.capabilityOf(pReferenceData.depthStencil.textureView.layout.format);
      // Setup depth texture.
      if (pReferenceData.depthStencil.depth) {
        // Validate if depth texture
        if (!lFormatCapability.aspects.has(texture_aspect_enum_1.TextureAspect.Depth)) {
          throw new core_1.Exception('Used texture for the depth texture attachment must have a depth aspect. ', this);
        }
        this.mDepthStencilTarget.depth = {
          clearValue: pReferenceData.depthStencil.depth.clearValue,
          storeOperation: pReferenceData.depthStencil.depth.storeOperation
        };
      }
      // Setup stencil texture.
      if (pReferenceData.depthStencil.stencil) {
        // Validate if depth texture
        if (!lFormatCapability.aspects.has(texture_aspect_enum_1.TextureAspect.Stencil)) {
          throw new core_1.Exception('Used texture for the stencil texture attachment must have a depth aspect. ', this);
        }
        this.mDepthStencilTarget.stencil = {
          clearValue: pReferenceData.depthStencil.stencil.clearValue,
          storeOperation: pReferenceData.depthStencil.stencil.storeOperation
        };
      }
    }
    // Setup color targets.
    for (const lAttachment of pReferenceData.colorTargets.values()) {
      // Validate existence of color texture.
      if (!lAttachment.textureView) {
        throw new core_1.Exception(`Color attachment "${lAttachment.name}" defined but no texture was assigned.`, this);
      }
      // No double names.
      if (this.mColorTargetNames.has(lAttachment.name)) {
        throw new core_1.Exception(`Color attachment name "${lAttachment.name}" can only be defined once.`, this);
      }
      // No double location indices.
      if (this.mColorTargets[lAttachment.index]) {
        throw new core_1.Exception(`Color attachment location index "${lAttachment.index}" can only be defined once.`, this);
      }
      // When a resolve canvas is specified, the texture must have the same texture format.
      if (lAttachment.resolveCanvas && lAttachment.resolveCanvas.format !== lAttachment.textureView.layout.format) {
        throw new core_1.Exception(`Color attachment can only be resolved into a canvas with the same texture format.`, this);
      }
      // Only two dimensional textures.
      if (lAttachment.textureView.layout.dimension !== texture_view_dimension_enum_1.TextureViewDimension.TwoDimension) {
        throw new core_1.Exception(`Color attachment can only two dimensional.`, this);
      }
      // Only two dimensional textures.
      if (lAttachment.textureView.mipLevelStart !== 0) {
        throw new core_1.Exception(`Color attachment can only rendered into mip level 0.`, this);
      }
      // Passthrough color texture changes. Any change.
      this.setTextureInvalidationListener(lAttachment.textureView, lAttachment.index);
      // Add render attachment texture usage to color texture.
      lAttachment.textureView.texture.extendUsage(texture_usage_enum_1.TextureUsage.RenderAttachment);
      // Save color target name and index mapping.
      this.mColorTargetNames.set(lAttachment.name, lAttachment.index);
      // Set resolve canvas.
      if (lAttachment.resolveCanvas) {
        // Add copy source to texture usage to be copied into canvas.
        lAttachment.textureView.texture.extendUsage(texture_usage_enum_1.TextureUsage.CopySource);
        this.mResolveCanvasList.push({
          source: lAttachment.textureView,
          canvas: lAttachment.resolveCanvas
        });
      }
      // Convert setup into storage data.
      this.mColorTargets[lAttachment.index] = {
        name: lAttachment.name,
        index: lAttachment.index,
        clearValue: lAttachment.clearValue,
        storeOperation: lAttachment.storeOperation,
        texture: {
          target: lAttachment.textureView,
          resolveCanvas: lAttachment.resolveCanvas
        }
      };
    }
    // Validate attachment list.
    if (this.mColorTargetNames.size !== this.mColorTargets.length) {
      throw new core_1.Exception(`Color attachment locations must be in order.`, this);
    }
  }
  /**
   * On setup object creation. Create setup object.
   *
   * @param pReferences - Setup references.
   *
   * @returns build setup object.
   */
  onSetupObjectCreate(pReferences) {
    return new render_targets_setup_1.RenderTargetsSetup(pReferences, this.mMultisampled);
  }
  /**
   * Try to update views of pass descriptor.
   *
   * @param pNative - Native pass descriptor.
   * @param pReasons - Update reason.
   *
   * @returns true when native was updated.
   */
  updateNative(pNative) {
    // Update depth stencil view. -1 Marks depth stencil texture updates. 
    if (this.mTargetViewUpdateQueue.has(-1) && pNative.depthStencilAttachment) {
      pNative.depthStencilAttachment.view = this.mDepthStencilTarget.target.native;
      // Remove depth stencil from update queue.
      this.mTargetViewUpdateQueue.delete(-1);
    }
    // Update color attachments.
    for (const lTargetIndex of this.mTargetViewUpdateQueue) {
      // Read current attachment.
      const lCurrentAttachment = pNative.colorAttachments[lTargetIndex];
      // Read setup attachments.
      const lColorAttachment = this.mColorTargets[lTargetIndex];
      // Update view.
      lCurrentAttachment.view = lColorAttachment.texture.target.native;
    }
    // Reset updateable views.
    this.mTargetViewUpdateQueue.clear();
    return true;
  }
  /**
   * Resize all textures.
   */
  applyResize() {
    // Update buffer texture sizes.
    for (const lAttachment of this.mColorTargets) {
      lAttachment.texture.target.texture.height = this.mSize.height;
      lAttachment.texture.target.texture.width = this.mSize.width;
      if (lAttachment.texture.resolveCanvas) {
        lAttachment.texture.resolveCanvas.height = this.mSize.height;
        lAttachment.texture.resolveCanvas.width = this.mSize.width;
      }
    }
    // Update target texture sizes.
    if (this.mDepthStencilTarget) {
      this.mDepthStencilTarget.target.texture.height = this.mSize.height;
      this.mDepthStencilTarget.target.texture.width = this.mSize.width;
    }
  }
  /**
   * Add all needed texture invalidation listener for passthrow and descriptor invalidation.
   *
   * @param pTexture - Texture.
   */
  setTextureInvalidationListener(pTexture, pTextureIndex) {
    // Update descriptor only on view changes.
    pTexture.addInvalidationListener(() => {
      // Invalidate.
      this.invalidate(RenderTargetsInvalidationType.NativeUpdate);
      // Set texture as updateable.
      this.mTargetViewUpdateQueue.add(pTextureIndex);
    }, gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
}
exports.RenderTargets = RenderTargets;
var RenderTargetsInvalidationType;
(function (RenderTargetsInvalidationType) {
  RenderTargetsInvalidationType["NativeUpdate"] = "NativeUpdate";
  RenderTargetsInvalidationType["Resize"] = "Resize";
})(RenderTargetsInvalidationType || (exports.RenderTargetsInvalidationType = RenderTargetsInvalidationType = {}));

/***/ }),

/***/ "./source/pipeline/vertex-fragment-pipeline-target-config.ts":
/*!*******************************************************************!*\
  !*** ./source/pipeline/vertex-fragment-pipeline-target-config.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexFragmentPipelineTargetConfig = void 0;
class VertexFragmentPipelineTargetConfig {
  /**
   * Constructor.
   *
   * @param pCallback - Data callback.
   */
  constructor(pDataReference, pCallback) {
    this.mCallback = pCallback;
    this.mDataReference = pDataReference;
  }
  /**
   * Set alpha blends.
   *
   * @param pOperation - Blend operation.
   * @param pSourceFactor - Factor of source value.
   * @param pDestinationFactor - Factor of destination value.
   *
   * @returns this.
   */
  alphaBlend(pOperation, pSourceFactor, pDestinationFactor) {
    // Set data.
    this.mDataReference.alphaBlend = {
      operation: pOperation,
      sourceFactor: pSourceFactor,
      destinationFactor: pDestinationFactor
    };
    // Callback change.
    this.mCallback();
    return this;
  }
  /**
   * Set color blends.
   *
   * @param pOperation - Blend operation.
   * @param pSourceFactor - Factor of source value.
   * @param pDestinationFactor - Factor of destination value.
   *
   * @returns this.
   */
  colorBlend(pOperation, pSourceFactor, pDestinationFactor) {
    // Set data.
    this.mDataReference.colorBlend = {
      operation: pOperation,
      sourceFactor: pSourceFactor,
      destinationFactor: pDestinationFactor
    };
    // Callback change.
    this.mCallback();
    return this;
  }
  /**
   * Set texture aspect writemask.
   *
   * @param pAspects - Aspect to write into.
   *
   * @returns this.
   */
  writeMask(...pAspects) {
    // Set data.
    this.mDataReference.aspectWriteMask = new Set(pAspects);
    // Callback change.
    this.mCallback();
    return this;
  }
}
exports.VertexFragmentPipelineTargetConfig = VertexFragmentPipelineTargetConfig;

/***/ }),

/***/ "./source/pipeline/vertex-fragment-pipeline.ts":
/*!*****************************************************!*\
  !*** ./source/pipeline/vertex-fragment-pipeline.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexFragmentPipelineInvalidationType = exports.VertexFragmentPipeline = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const compare_function_enum_1 = __webpack_require__(/*! ../constant/compare-function.enum */ "./source/constant/compare-function.enum.ts");
const compute_stage_enum_1 = __webpack_require__(/*! ../constant/compute-stage.enum */ "./source/constant/compute-stage.enum.ts");
const primitive_cullmode_enum_1 = __webpack_require__(/*! ../constant/primitive-cullmode.enum */ "./source/constant/primitive-cullmode.enum.ts");
const primitive_front_face_enum_1 = __webpack_require__(/*! ../constant/primitive-front-face.enum */ "./source/constant/primitive-front-face.enum.ts");
const primitive_topology_enum_1 = __webpack_require__(/*! ../constant/primitive-topology.enum */ "./source/constant/primitive-topology.enum.ts");
const texture_aspect_enum_1 = __webpack_require__(/*! ../constant/texture-aspect.enum */ "./source/constant/texture-aspect.enum.ts");
const texture_blend_factor_enum_1 = __webpack_require__(/*! ../constant/texture-blend-factor.enum */ "./source/constant/texture-blend-factor.enum.ts");
const texture_blend_operation_enum_1 = __webpack_require__(/*! ../constant/texture-blend-operation.enum */ "./source/constant/texture-blend-operation.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
const vertex_fragment_pipeline_target_config_1 = __webpack_require__(/*! ./vertex-fragment-pipeline-target-config */ "./source/pipeline/vertex-fragment-pipeline-target-config.ts");
class VertexFragmentPipeline extends gpu_object_1.GpuObject {
  /**
   * Set depth compare function.
   */
  get depthCompare() {
    return this.mDepthCompare;
  }
  set depthCompare(pValue) {
    this.mDepthCompare = pValue;
    // Invalidate pipeline on setting change.
    this.invalidate(VertexFragmentPipelineInvalidationType.NativeRebuild);
  }
  /**
   * Pipeline layout.
   */
  get layout() {
    return this.mShaderModule.shader.layout;
  }
  /**
   * Pipeline shader.
   */
  get module() {
    return this.mShaderModule;
  }
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  /**
   * Defines which polygon orientation will be culled.
   */
  get primitiveCullMode() {
    return this.mPrimitiveCullMode;
  }
  set primitiveCullMode(pValue) {
    this.mPrimitiveCullMode = pValue;
    // Invalidate pipeline on setting change.
    this.invalidate(VertexFragmentPipelineInvalidationType.NativeRebuild);
  }
  /**
   * Defines which polygons are considered front-facing.
   */
  get primitiveFrontFace() {
    return this.mPrimitiveFrontFace;
  }
  set primitiveFrontFace(pValue) {
    this.mPrimitiveFrontFace = pValue;
    // Invalidate pipeline on setting change.
    this.invalidate(VertexFragmentPipelineInvalidationType.NativeRebuild);
  }
  /**
   * The type of primitive to be constructed from the vertex inputs.
   */
  get primitiveTopology() {
    return this.mPrimitiveTopology;
  }
  set primitiveTopology(pValue) {
    this.mPrimitiveTopology = pValue;
    // Invalidate pipeline on setting change.
    this.invalidate(VertexFragmentPipelineInvalidationType.NativeRebuild);
  }
  /**
   * Render targets.
   */
  get renderTargets() {
    return this.mRenderTargets;
  }
  /**
   * Set depth write enabled / disabled.
   */
  get writeDepth() {
    return this.mDepthWriteEnabled;
  }
  set writeDepth(pValue) {
    this.mDepthWriteEnabled = pValue;
    // Invalidate pipeline on setting change.
    this.invalidate(VertexFragmentPipelineInvalidationType.NativeRebuild);
  }
  /**
   * Constructor.
   * Set default data.
   *
   * @param pDevice - Device.
   * @param pShaderRenderModule - Pipeline shader.
   */
  constructor(pDevice, pShaderRenderModule, pRenderTargets) {
    super(pDevice);
    // Loaded pipeline for async creation.
    this.mLoadedPipeline = null;
    // Set config objects.
    this.mShaderModule = pShaderRenderModule;
    this.mRenderTargets = pRenderTargets;
    this.mRenderTargetConfig = new core_1.Dictionary();
    // Pipeline constants.
    this.mParameter = new core_1.Dictionary();
    // Depth default settings.
    this.mDepthCompare = compare_function_enum_1.CompareFunction.Less;
    this.mDepthWriteEnabled = this.mRenderTargets.hasDepth;
    // Primitive default settings.
    this.mPrimitiveTopology = primitive_topology_enum_1.PrimitiveTopology.TriangleList;
    this.mPrimitiveCullMode = primitive_cullmode_enum_1.PrimitiveCullMode.Back;
    this.mPrimitiveFrontFace = primitive_front_face_enum_1.PrimitiveFrontFace.ClockWise;
  }
  /**
   * Set optional parameter of pipeline.
   *
   * @param pParameterName - name of parameter.
   * @param pValue - Value.
   *
   * @returns this.
   */
  setParameter(pParameterName, pValue) {
    const lParameterUsage = this.mShaderModule.shader.parameter(pParameterName);
    // Set parameter for each assigned compute stage.
    for (const lUsage of lParameterUsage) {
      // Init parameters for computestage when not set.
      if (!this.mParameter.has(lUsage)) {
        this.mParameter.set(lUsage, {});
      }
      // Set value for compute stage.
      this.mParameter.get(lUsage)[pParameterName] = pValue;
    }
    // Generate pipeline anew.
    this.invalidate(VertexFragmentPipelineInvalidationType.NativeRebuild);
    return this;
  }
  /**
   * Create or update target config.
   *
   * @param pTargetName - Target name.
   *
   * @returns config object.
   */
  targetConfig(pTargetName) {
    if (!this.mRenderTargets.hasColorTarget(pTargetName)) {
      throw new core_1.Exception(`Color target "${pTargetName}" does not exists.`, this);
    }
    // Create default config when not already set.
    if (!this.mRenderTargetConfig.has(pTargetName)) {
      this.mRenderTargetConfig.set(pTargetName, {
        colorBlend: {
          operation: texture_blend_operation_enum_1.TextureBlendOperation.Add,
          sourceFactor: texture_blend_factor_enum_1.TextureBlendFactor.One,
          destinationFactor: texture_blend_factor_enum_1.TextureBlendFactor.Zero
        },
        alphaBlend: {
          operation: texture_blend_operation_enum_1.TextureBlendOperation.Add,
          sourceFactor: texture_blend_factor_enum_1.TextureBlendFactor.One,
          destinationFactor: texture_blend_factor_enum_1.TextureBlendFactor.Zero
        },
        aspectWriteMask: new Set([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha])
      });
    }
    return new vertex_fragment_pipeline_target_config_1.VertexFragmentPipelineTargetConfig(this.mRenderTargetConfig.get(pTargetName), () => {
      // Generate pipeline anew.
      this.invalidate(VertexFragmentPipelineInvalidationType.NativeRebuild);
    });
  }
  /**
   * Generate native gpu pipeline data layout.
   */
  generateNative(_pLastNative, pInvalidationReason) {
    // When a pipeline was loaded, return the loaded instead of creating a new pipeline.
    if (this.mLoadedPipeline !== null && !pInvalidationReason.has(VertexFragmentPipelineInvalidationType.NativeRebuild)) {
      const lLoadedPipeline = this.mLoadedPipeline;
      this.mLoadedPipeline = null;
      return lLoadedPipeline;
    }
    // Generate pipeline layout from bind group layouts.
    const lPipelineLayout = this.mShaderModule.shader.layout.native;
    // Construct basic GPURenderPipelineDescriptor.
    const lPipelineDescriptor = {
      layout: lPipelineLayout,
      vertex: {
        module: this.mShaderModule.shader.native,
        entryPoint: this.mShaderModule.vertexEntryPoint,
        buffers: this.mShaderModule.vertexParameter.native,
        constants: this.mParameter.get(compute_stage_enum_1.ComputeStage.Vertex) ?? {}
      },
      primitive: this.generatePrimitive()
    };
    // Optional fragment state.
    if (this.module.fragmentEntryPoint) {
      // Generate fragment targets only when fragment state is needed.
      const lFragmentTargetList = new Array();
      for (const lRenderTargetName of this.mRenderTargets.colorTargetNames) {
        const lRenderTarget = this.mRenderTargets.colorTarget(lRenderTargetName);
        lFragmentTargetList.push({
          format: lRenderTarget.layout.format,
          blend: this.generateRenderTargetBlendState(lRenderTargetName),
          writeMask: this.generateRenderTargetWriteMask(lRenderTargetName)
        });
      }
      lPipelineDescriptor.fragment = {
        module: this.mShaderModule.shader.native,
        entryPoint: this.module.fragmentEntryPoint,
        targets: lFragmentTargetList,
        constants: this.mParameter.get(compute_stage_enum_1.ComputeStage.Fragment) ?? {}
      };
    }
    // Setup optional depth attachment.
    if (this.mRenderTargets.hasDepth) {
      lPipelineDescriptor.depthStencil = {
        depthWriteEnabled: this.writeDepth,
        depthCompare: this.depthCompare,
        format: this.mRenderTargets.depthStencilTarget().layout.format
      };
    }
    // TODO: Stencil.
    // Set multisample count.
    if (this.mRenderTargets.multisampled) {
      lPipelineDescriptor.multisample = {
        count: 4
      };
    }
    // Load pipeline asyncron and update native after promise resolve.
    this.device.gpu.createRenderPipelineAsync(lPipelineDescriptor).then(pPipeline => {
      this.mLoadedPipeline = pPipeline;
      this.invalidate(VertexFragmentPipelineInvalidationType.NativeLoaded);
    });
    // Null as long as pipeline is loading.
    return null;
  }
  /**
   * Primitive settings.
   */
  generatePrimitive() {
    // Convert topology to native. Set strip format for strip topology.
    let lStripIndexFormat = undefined;
    switch (this.primitiveTopology) {
      case primitive_topology_enum_1.PrimitiveTopology.LineStrip:
      case primitive_topology_enum_1.PrimitiveTopology.TriangleStrip:
        {
          lStripIndexFormat = 'uint32';
          break;
        }
    }
    // Create primitive state.
    const lPrimitiveState = {
      topology: this.primitiveTopology,
      frontFace: this.primitiveFrontFace,
      cullMode: this.primitiveCullMode,
      unclippedDepth: false
    };
    // Set optional strip format.
    if (lStripIndexFormat) {
      lPrimitiveState.stripIndexFormat = lStripIndexFormat;
    }
    return lPrimitiveState;
  }
  /**
   * Generate blend state for render target.
   *
   * @param pTargetName - Render target name.
   *
   * @returns generated blend state.
   */
  generateRenderTargetBlendState(pTargetName) {
    const lConfig = this.mRenderTargetConfig.get(pTargetName);
    // Set defaults for blend state.
    const lBlendState = {
      color: {
        operation: 'add',
        srcFactor: 'one',
        dstFactor: 'zero'
      },
      alpha: {
        operation: 'add',
        srcFactor: 'one',
        dstFactor: 'zero'
      }
    };
    // Set alpha and alpha blend when set.
    if (lConfig) {
      lBlendState.alpha = {
        operation: lConfig.alphaBlend.operation,
        srcFactor: lConfig.alphaBlend.sourceFactor,
        dstFactor: lConfig.alphaBlend.destinationFactor
      };
      lBlendState.color = {
        operation: lConfig.colorBlend.operation,
        srcFactor: lConfig.colorBlend.sourceFactor,
        dstFactor: lConfig.colorBlend.destinationFactor
      };
    }
    return lBlendState;
  }
  /**
   * Generate gpu color write mask for the set render target.
   *
   * @param pTargetName - Target name.
   *
   * @returns color write flags.
   */
  generateRenderTargetWriteMask(pTargetName) {
    const lConfig = this.mRenderTargetConfig.get(pTargetName);
    // Convert color aspects config to write mask.
    let lWriteMask = 0xf;
    if (lConfig) {
      lWriteMask = 0x0;
      if (lConfig.aspectWriteMask.has(texture_aspect_enum_1.TextureAspect.Red)) {
        lWriteMask += 0x1;
      }
      if (lConfig.aspectWriteMask.has(texture_aspect_enum_1.TextureAspect.Green)) {
        lWriteMask += 0x2;
      }
      if (lConfig.aspectWriteMask.has(texture_aspect_enum_1.TextureAspect.Red)) {
        lWriteMask += 0x4;
      }
      if (lConfig.aspectWriteMask.has(texture_aspect_enum_1.TextureAspect.Alpha)) {
        lWriteMask += 0x8;
      }
    }
    return lWriteMask;
  }
}
exports.VertexFragmentPipeline = VertexFragmentPipeline;
var VertexFragmentPipelineInvalidationType;
(function (VertexFragmentPipelineInvalidationType) {
  VertexFragmentPipelineInvalidationType["NativeRebuild"] = "NativeRebuild";
  VertexFragmentPipelineInvalidationType["NativeLoaded"] = "NativeLoaded";
})(VertexFragmentPipelineInvalidationType || (exports.VertexFragmentPipelineInvalidationType = VertexFragmentPipelineInvalidationType = {}));

/***/ }),

/***/ "./source/shader/setup/shader-compute-entry-point-setup.ts":
/*!*****************************************************************!*\
  !*** ./source/shader/setup/shader-compute-entry-point-setup.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShaderComputeEntryPointSetup = void 0;
const gpu_object_child_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-child-setup */ "./source/gpu/object/gpu-object-child-setup.ts");
class ShaderComputeEntryPointSetup extends gpu_object_child_setup_1.GpuObjectChildSetup {
  /**
   * Setup compute entry with a static size.
   */
  size(pX, pY = 1, pZ = 1) {
    // Lock setup to a setup call.
    this.ensureThatInSetup();
    // Callback size.
    this.sendData(pX, pY, pZ);
  }
}
exports.ShaderComputeEntryPointSetup = ShaderComputeEntryPointSetup;

/***/ }),

/***/ "./source/shader/setup/shader-fragment-entry-point-setup.ts":
/*!******************************************************************!*\
  !*** ./source/shader/setup/shader-fragment-entry-point-setup.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShaderFragmentEntryPointSetup = void 0;
const gpu_object_child_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-child-setup */ "./source/gpu/object/gpu-object-child-setup.ts");
class ShaderFragmentEntryPointSetup extends gpu_object_child_setup_1.GpuObjectChildSetup {
  /**
   * Setup fragment render target.
   */
  addRenderTarget(pName, pLocationIndex, pDataFormat, pDataMultiplier) {
    // Lock setup to a setup call.
    this.ensureThatInSetup();
    const lRenderTarget = {
      name: pName,
      location: pLocationIndex,
      format: pDataFormat,
      multiplier: pDataMultiplier
    };
    // Callback size.
    this.sendData(lRenderTarget);
    return this;
  }
}
exports.ShaderFragmentEntryPointSetup = ShaderFragmentEntryPointSetup;

/***/ }),

/***/ "./source/shader/setup/shader-setup.ts":
/*!*********************************************!*\
  !*** ./source/shader/setup/shader-setup.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShaderSetup = void 0;
const bind_group_layout_1 = __webpack_require__(/*! ../../binding/bind-group-layout */ "./source/binding/bind-group-layout.ts");
const gpu_object_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-setup */ "./source/gpu/object/gpu-object-setup.ts");
const vertex_parameter_layout_1 = __webpack_require__(/*! ../../pipeline/parameter/vertex-parameter-layout */ "./source/pipeline/parameter/vertex-parameter-layout.ts");
const shader_compute_entry_point_setup_1 = __webpack_require__(/*! ./shader-compute-entry-point-setup */ "./source/shader/setup/shader-compute-entry-point-setup.ts");
const shader_fragment_entry_point_setup_1 = __webpack_require__(/*! ./shader-fragment-entry-point-setup */ "./source/shader/setup/shader-fragment-entry-point-setup.ts");
class ShaderSetup extends gpu_object_setup_1.GpuObjectSetup {
  /**
   * Setup compute entry point.
   * When size is not called, the compute entry point will be setup with a dynamic size.
   *
   * @param pName - Compute entry name.
   */
  computeEntryPoint(pName) {
    // Lock setup to a setup call.
    this.ensureThatInSetup();
    // Create dynamic compute entry point.
    const lEntryPoint = {
      name: pName,
      workgroupDimension: null
    };
    // Append compute entry.
    this.setupData.computeEntrypoints.push(lEntryPoint);
    // Return compute entry setup object.
    return new shader_compute_entry_point_setup_1.ShaderComputeEntryPointSetup(this.setupReferences, (pX, pY, pZ) => {
      lEntryPoint.workgroupDimension = {
        x: pX,
        y: pY,
        z: pZ
      };
    });
  }
  /**
   * Setup fragment entry point.
   *
   * @param pName - Fragment entry name.
   */
  fragmentEntryPoint(pName) {
    // Lock setup to a setup call.
    this.ensureThatInSetup();
    // Create empty fragment entry point.
    const lEntryPoint = {
      name: pName,
      renderTargets: new Array()
    };
    // Append compute entry.
    this.setupData.fragmentEntrypoints.push(lEntryPoint);
    // Return fragment entry setup object.
    return new shader_fragment_entry_point_setup_1.ShaderFragmentEntryPointSetup(this.setupReferences, pRenderTarget => {
      lEntryPoint.renderTargets.push(pRenderTarget);
    });
  }
  group(pIndex, pGroupOrName, pSetupCall) {
    // Use existing or create new bind group.
    let lBindGroupLayout;
    if (typeof pGroupOrName === 'string') {
      // Create new group
      lBindGroupLayout = new bind_group_layout_1.BindGroupLayout(this.device, pGroupOrName).setup(pSetupCall);
    } else {
      // Use existing group.
      lBindGroupLayout = pGroupOrName;
    }
    // Register group.
    this.setupData.bindingGroups.push({
      index: pIndex,
      group: lBindGroupLayout
    });
    return lBindGroupLayout;
  }
  /**
   * Add static pipeline parameters definitions.
   *
   * @param pName- Parameter name.
   * @param pFormat - Parameter format.
   *
   * @returns this.
   */
  parameter(pName, ...pStageUsage) {
    // Lock setup to a setup call.
    this.ensureThatInSetup();
    // Add parameter.
    this.setupData.parameter.push({
      name: pName,
      usage: pStageUsage
    });
    return this;
  }
  /**
   * Setup vertex entry point.
   *
   * @param pName - Vertex entry name.
   */
  vertexEntryPoint(pName, pSetupCallback) {
    // Lock setup to a setup call.
    this.ensureThatInSetup();
    // Create and setup vertex parameter.
    const lVertexParameterLayout = new vertex_parameter_layout_1.VertexParameterLayout(this.device).setup(pSetupCallback);
    // Create empty fragment entry point.
    const lEntryPoint = {
      name: pName,
      parameter: lVertexParameterLayout
    };
    // Append compute entry.
    this.setupData.vertexEntrypoints.push(lEntryPoint);
    return lVertexParameterLayout;
  }
  /**
   * Fill in default data before the setup starts.
   *
   * @param pDataReference - Setup data reference.
   */
  fillDefaultData(pDataReference) {
    // Entry points.
    pDataReference.computeEntrypoints = new Array();
    pDataReference.fragmentEntrypoints = new Array();
    pDataReference.vertexEntrypoints = new Array();
    // Parameter.
    pDataReference.parameter = new Array();
    // Bind groups.
    pDataReference.bindingGroups = new Array();
  }
}
exports.ShaderSetup = ShaderSetup;

/***/ }),

/***/ "./source/shader/shader-compute-module.ts":
/*!************************************************!*\
  !*** ./source/shader/shader-compute-module.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShaderComputeModule = void 0;
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
const compute_pipeline_1 = __webpack_require__(/*! ../pipeline/compute-pipeline */ "./source/pipeline/compute-pipeline.ts");
class ShaderComputeModule extends gpu_object_1.GpuObject {
  /**
   * Compute entry point.
   */
  get entryPoint() {
    return this.mEntryPoint;
  }
  /**
   * Shader pipeline layout.
   */
  get layout() {
    return this.mShader.layout;
  }
  /**
   * Module shader.
   */
  get shader() {
    return this.mShader;
  }
  /**
   * Workgroup size x.
   */
  get workGroupSizeX() {
    return this.mSize[0];
  }
  /**
   * Workgroup size y.
   */
  get workGroupSizeY() {
    return this.mSize[1];
  }
  /**
   * Workgroup size z.
   */
  get workGroupSizeZ() {
    return this.mSize[2];
  }
  /**
   * Constructor.
   *
   * @param pDevice - Device reference.
   * @param pShader - Shader.
   * @param pEntryPointName - Compute entry point.
   * @param pSize - Workgroup size.
   */
  constructor(pDevice, pShader, pEntryPointName, pSize) {
    super(pDevice);
    this.mEntryPoint = pEntryPointName;
    this.mShader = pShader;
    this.mSize = pSize ?? [-1, -1, -1];
  }
  /**
   * Create a new compute pipeline.
   *
   * @returns new compute pipeline.
   */
  create() {
    return new compute_pipeline_1.ComputePipeline(this.device, this);
  }
}
exports.ShaderComputeModule = ShaderComputeModule;

/***/ }),

/***/ "./source/shader/shader-render-module.ts":
/*!***********************************************!*\
  !*** ./source/shader/shader-render-module.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShaderRenderModule = void 0;
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
const vertex_fragment_pipeline_1 = __webpack_require__(/*! ../pipeline/vertex-fragment-pipeline */ "./source/pipeline/vertex-fragment-pipeline.ts");
class ShaderRenderModule extends gpu_object_1.GpuObject {
  /**
   * Fragment entry point.
   */
  get fragmentEntryPoint() {
    return this.mFragmentEntryPoint;
  }
  /**
   * Shader pipeline layout.
   */
  get layout() {
    return this.mShader.layout;
  }
  /**
   * Module shader.
   */
  get shader() {
    return this.mShader;
  }
  /**
   * Compute entry point.
   */
  get vertexEntryPoint() {
    return this.mVertexEntryPoint;
  }
  /**
   * Vertex parameter.
   */
  get vertexParameter() {
    return this.mVertexParameter;
  }
  /**
   * Constructor.
   *
   * @param pDevice - Device reference.
   * @param pShader - Shader.
   * @param pEntryPointName - Compute entry point.
   * @param pSize - Workgroup size.
   */
  constructor(pDevice, pShader, pVertexEntryPointName, pVertexParameter, pFragmentEntryPointName) {
    super(pDevice);
    this.mVertexEntryPoint = pVertexEntryPointName;
    this.mVertexParameter = pVertexParameter;
    this.mFragmentEntryPoint = pFragmentEntryPointName ?? null;
    this.mShader = pShader;
  }
  /**
   * Create a new render pipeline for set render targets.
   *
   * @param pRenderTargets - Render targets of pipeline.
   *
   * @returns new render pipeline.
   */
  create(pRenderTargets) {
    return new vertex_fragment_pipeline_1.VertexFragmentPipeline(this.device, this, pRenderTargets);
  }
}
exports.ShaderRenderModule = ShaderRenderModule;

/***/ }),

/***/ "./source/shader/shader.ts":
/*!*********************************!*\
  !*** ./source/shader/shader.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Shader = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const pipeline_layout_1 = __webpack_require__(/*! ../binding/pipeline-layout */ "./source/binding/pipeline-layout.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
const shader_setup_1 = __webpack_require__(/*! ./setup/shader-setup */ "./source/shader/setup/shader-setup.ts");
const shader_compute_module_1 = __webpack_require__(/*! ./shader-compute-module */ "./source/shader/shader-compute-module.ts");
const shader_render_module_1 = __webpack_require__(/*! ./shader-render-module */ "./source/shader/shader-render-module.ts");
class Shader extends gpu_object_1.GpuObject {
  /**
   * Shader pipeline layout.
   */
  get layout() {
    // Ensure setup is called.
    this.ensureSetup();
    return this.mPipelineLayout;
  }
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  /**
   * Constructor.
   * @param pDevice - Gpu Device reference.
   * @param pSource - Shader source as wgsl code.
   * @param pLayout - Shader layout information.
   */
  constructor(pDevice, pSource, pSourceMap = null) {
    super(pDevice);
    // Create shader information for source.
    this.mSource = pSource;
    this.mSourceMap = pSourceMap;
    // Init default unset values.
    this.mParameter = new core_1.Dictionary();
    this.mPipelineLayout = null;
    this.mEntryPoints = {
      compute: new core_1.Dictionary(),
      vertex: new core_1.Dictionary(),
      fragment: new core_1.Dictionary()
    };
  }
  /**
   * Create a compute module from shader entry point.
   *
   * @param pEntryName - Compute entry name.
   *
   * @returns shader compute module.
   */
  createComputeModule(pEntryName) {
    // Ensure setup is called.
    this.ensureSetup();
    const lEntryPoint = this.mEntryPoints.compute.get(pEntryName);
    if (!lEntryPoint) {
      throw new core_1.Exception(`Compute entry point "${pEntryName}" does not exists.`, this);
    }
    // Return shader module without defined workgroup sizes.
    if (!lEntryPoint.static) {
      return new shader_compute_module_1.ShaderComputeModule(this.device, this, pEntryName);
    }
    // Define workgroup sizes.
    return new shader_compute_module_1.ShaderComputeModule(this.device, this, pEntryName, [lEntryPoint.workgroupDimension.x ?? 1, lEntryPoint.workgroupDimension.y ?? 1, lEntryPoint.workgroupDimension.z ?? 1]);
  }
  /**
   * Create a render module from a vertex and fragment entry point.
   *
   * @param pVertexEntryName - Vertex entry point.
   * @param pFragmentEntryName - Optional fragment entry point.
   *
   * @returns shader render module.
   */
  createRenderModule(pVertexEntryName, pFragmentEntryName) {
    // Ensure setup is called.
    this.ensureSetup();
    const lVertexEntryPoint = this.mEntryPoints.vertex.get(pVertexEntryName);
    if (!lVertexEntryPoint) {
      throw new core_1.Exception(`Vertex entry point "${pVertexEntryName}" does not exists.`, this);
    }
    // Return shader module without fragment entry.
    if (!pFragmentEntryName) {
      return new shader_render_module_1.ShaderRenderModule(this.device, this, pVertexEntryName, lVertexEntryPoint.parameter);
    }
    // Validate fragment entry point.
    const lFragmentEntryPoint = this.mEntryPoints.fragment.get(pFragmentEntryName);
    if (!lFragmentEntryPoint) {
      throw new core_1.Exception(`Fragment entry point "${pFragmentEntryName}" does not exists.`, this);
    }
    return new shader_render_module_1.ShaderRenderModule(this.device, this, pVertexEntryName, lVertexEntryPoint.parameter, pFragmentEntryName);
  }
  /**
   * Get shader pipeline parameters.
   *
   * @param pParameterName - Parameter name.
   */
  parameter(pParameterName) {
    // Ensure setup is called.
    this.ensureSetup();
    // Try to read parameter type.
    const lParameterType = this.mParameter.get(pParameterName);
    if (!lParameterType) {
      throw new core_1.Exception(`Shader has parameter "${pParameterName}" not defined.`, this);
    }
    return new Set(lParameterType);
  }
  /**
   * Setup render targets.
   * Can only be called once and is the only way to create or add target textures.
   *
   * @param pSetup - Setup call.
   *
   * @returns this.
   */
  setup(pSetupCallback) {
    return super.setup(pSetupCallback);
  }
  /**
   * Generate shader module.
   */
  generateNative() {
    // Read pipeline for compilation hints.
    const lPipelineLayout = this.mPipelineLayout.native;
    // Create compilationHints for every entry point
    const lCompilationHints = new Array();
    for (const lEntryName of [...this.mEntryPoints.vertex.keys(), ...this.mEntryPoints.fragment.keys(), ...this.mEntryPoints.compute.keys()]) {
      lCompilationHints.push({
        entryPoint: lEntryName,
        layout: lPipelineLayout
      });
    }
    // Create shader module use hints to speed up compilation on safari.
    return this.device.gpu.createShaderModule({
      code: this.mSource,
      compilationHints: lCompilationHints,
      sourceMap: this.mSourceMap ?? {}
    });
  }
  /**
   * Setup with setup object.
   *
   * @param pReferences - Used references.
   */
  onSetup(pReferences) {
    // Setup parameter.
    for (const lParameter of pReferences.parameter) {
      // Dont override parameters.
      if (this.mParameter.has(lParameter.name)) {
        throw new core_1.Exception(`Can't add parameter "${lParameter.name}" more than once.`, this);
      }
      // Add parameter.
      this.mParameter.set(lParameter.name, new Set(lParameter.usage));
    }
    // Convert fragment entry point informations
    for (const lFragmentEntry of pReferences.fragmentEntrypoints) {
      // Restrict doublicate fragment entry names.
      if (this.mEntryPoints.fragment.has(lFragmentEntry.name)) {
        throw new core_1.Exception(`Fragment entry "${lFragmentEntry.name}" was setup more than once.`, this);
      }
      // Convert all render attachments to a location mapping.
      const lRenderTargetLocations = new Set();
      const lRenderTargets = new core_1.Dictionary();
      for (const lRenderTarget of lFragmentEntry.renderTargets) {
        // Restrict doublicate fragment entry render target names.
        if (lRenderTargets.has(lRenderTarget.name)) {
          throw new core_1.Exception(`Fragment entry "${lFragmentEntry.name}" was has doublicate render attachment name "${lRenderTarget.name}".`, this);
        }
        // Restrict doublicate fragment entry render target locations.
        if (lRenderTargetLocations.has(lRenderTarget.location)) {
          throw new core_1.Exception(`Fragment entry "${lFragmentEntry.name}" was has doublicate render attachment location index "${lRenderTarget.location}".`, this);
        }
        // Add location to location index buffer. Used for finding dublicates.
        lRenderTargetLocations.add(lRenderTarget.location);
        // Add target to list. 
        lRenderTargets.set(lRenderTarget.name, {
          name: lRenderTarget.name,
          location: lRenderTarget.location,
          format: lRenderTarget.format,
          multiplier: lRenderTarget.multiplier
        });
      }
      // Set fragment entry point definition. 
      this.mEntryPoints.fragment.set(lFragmentEntry.name, {
        renderTargets: lRenderTargets
      });
    }
    // Convert vertex entry point informations
    for (const lVertexEntry of pReferences.vertexEntrypoints) {
      // Restrict doublicate vertex entry names.
      if (this.mEntryPoints.vertex.has(lVertexEntry.name)) {
        throw new core_1.Exception(`Vertex entry "${lVertexEntry.name}" was setup more than once.`, this);
      }
      // Set vertex entry point definition. 
      this.mEntryPoints.vertex.set(lVertexEntry.name, {
        parameter: lVertexEntry.parameter
      });
    }
    // Convert compute entry point informations
    for (const lComputeEntry of pReferences.computeEntrypoints) {
      // Restrict doublicate compute entry names.
      if (this.mEntryPoints.compute.has(lComputeEntry.name)) {
        throw new core_1.Exception(`Vertex entry "${lComputeEntry.name}" was setup more than once.`, this);
      }
      // Set vertex entry point definition. 
      this.mEntryPoints.compute.set(lComputeEntry.name, {
        static: lComputeEntry.workgroupDimension !== null,
        workgroupDimension: {
          x: lComputeEntry.workgroupDimension?.x ?? null,
          y: lComputeEntry.workgroupDimension?.y ?? null,
          z: lComputeEntry.workgroupDimension?.z ?? null
        }
      });
    }
    // Generate initial pipeline layout.
    const lInitialPipelineLayout = new core_1.Dictionary();
    for (const lGroup of pReferences.bindingGroups) {
      // Set bind group layout with group index.
      lInitialPipelineLayout.set(lGroup.index, lGroup.group);
    }
    this.mPipelineLayout = new pipeline_layout_1.PipelineLayout(this.device, lInitialPipelineLayout);
  }
  /**
   * Create setup object. Return null to skip any setups.
   *
   *  @param pReferences - Unfilled setup references.
   *
   *  @returns Setup object.
   */
  onSetupObjectCreate(pReferences) {
    return new shader_setup_1.ShaderSetup(pReferences);
  }
}
exports.Shader = Shader;

/***/ }),

/***/ "./source/texture/canvas-texture.ts":
/*!******************************************!*\
  !*** ./source/texture/canvas-texture.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CanvasTextureInvalidationType = exports.CanvasTexture = void 0;
const texture_dimension_enum_1 = __webpack_require__(/*! ../constant/texture-dimension.enum */ "./source/constant/texture-dimension.enum.ts");
const texture_usage_enum_1 = __webpack_require__(/*! ../constant/texture-usage.enum */ "./source/constant/texture-usage.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/gpu/object/gpu-object.ts");
/**
 * Canvas texture. Can only be used as render attachment or to be copied into.
 * Allways 2D with preferred format.
 */
class CanvasTexture extends gpu_object_1.GpuObject {
  /**
   * HTML canvas element.
   */
  get canvas() {
    return this.mCanvas;
  }
  /**
   * Texture depth.
   */
  get depth() {
    return 1;
  }
  /**
   * Texture dimension.
   */
  get dimension() {
    return texture_dimension_enum_1.TextureDimension.ThreeDimension;
  }
  /**
   * Canvas format.
   */
  get format() {
    return this.device.formatValidator.preferredCanvasFormat;
  }
  /**
   * Texture height.
   */
  get height() {
    return this.mCanvas.height;
  }
  set height(pValue) {
    this.mCanvas.height = pValue;
  }
  /**
   * Texture mip level count.
   */
  get mipCount() {
    return 1;
  }
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  /**
   * Texture width.
   */
  get width() {
    return this.mCanvas.width;
  }
  set width(pValue) {
    this.mCanvas.width = pValue;
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   * @param pLayout - Texture layout.
   * @param pCanvas - Canvas of texture.
   */
  constructor(pDevice, pCanvas) {
    super(pDevice);
    // Set canvas reference.
    this.mCanvas = pCanvas;
    this.mContext = null;
    // Set defaults.
    this.height = 1;
    this.width = 1;
    // Rebuild view on every frame.
    this.mFrameListener = () => {
      this.invalidate(CanvasTextureInvalidationType.NativeRebuild);
    };
    this.device.addFrameChangeListener(this.mFrameListener);
  }
  /**
   * Destory texture object.
   * @param _pNativeObject - Native canvas texture.
   */
  destroyNative(_pNativeObject, pReasons) {
    // Only destroy context when child data/layout has changes.
    if (pReasons.deconstruct) {
      // Remove frame listener.
      this.device.removeFrameChangeListener(this.mFrameListener);
      // Destory context.
      this.mContext.unconfigure();
      this.mContext = null;
    }
  }
  /**
   * Generate native canvas texture view.
   */
  generateNative() {
    // Configure new context when not alread configured or destroyed.
    if (!this.mContext) {
      // Create and configure canvas context.
      this.mContext = this.canvas.getContext('webgpu');
      this.mContext.configure({
        device: this.device.gpu,
        format: this.device.formatValidator.preferredCanvasFormat,
        usage: texture_usage_enum_1.TextureUsage.CopyDestination | texture_usage_enum_1.TextureUsage.RenderAttachment,
        alphaMode: 'opaque'
      });
    }
    // Read current texture of canvas. Needs to be retrieved for each frame.
    const lTexture = this.mContext.getCurrentTexture();
    lTexture.label = 'Canvas-Texture';
    return lTexture;
  }
}
exports.CanvasTexture = CanvasTexture;
var CanvasTextureInvalidationType;
(function (CanvasTextureInvalidationType) {
  CanvasTextureInvalidationType["NativeRebuild"] = "NativeRebuild";
})(CanvasTextureInvalidationType || (exports.CanvasTextureInvalidationType = CanvasTextureInvalidationType = {}));

/***/ }),

/***/ "./source/texture/gpu-texture-view.ts":
/*!********************************************!*\
  !*** ./source/texture/gpu-texture-view.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuTextureView = void 0;
const texture_view_dimension_enum_1 = __webpack_require__(/*! ../constant/texture-view-dimension.enum */ "./source/constant/texture-view-dimension.enum.ts");
const gpu_resource_object_1 = __webpack_require__(/*! ../gpu/object/gpu-resource-object */ "./source/gpu/object/gpu-resource-object.ts");
class GpuTextureView extends gpu_resource_object_1.GpuResourceObject {
  /**
   * End index of depth or array level.
   */
  get arrayLayerEnd() {
    return this.mArrayLayerEnd;
  }
  set arrayLayerEnd(pArrayLayer) {
    this.mArrayLayerEnd = pArrayLayer;
    // Invalidate view.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
  /**
   * Staring index of depth or array level.
   */
  get arrayLayerStart() {
    return this.mArrayLayerStart;
  }
  set arrayLayerStart(pArrayLayerIndex) {
    this.mArrayLayerStart = pArrayLayerIndex;
    // Invalidate view.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
  /**
   * Texture layout.
   */
  get layout() {
    return this.mLayout;
  }
  /**
   * End index of mip level.
   */
  get mipLevelEnd() {
    return this.mMipLevelEnd;
  }
  set mipLevelEnd(pMipLevel) {
    this.mMipLevelEnd = pMipLevel;
    // Invalidate view.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
  /**
   * Staring index of mip level.
   */
  get mipLevelStart() {
    return this.mMipLevelStart;
  }
  set mipLevelStart(pMipLevel) {
    this.mMipLevelStart = pMipLevel;
    // Invalidate view.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  /**
   * Views texture.
   */
  get texture() {
    return this.mTexture;
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   * @param pTexture - Texture of view.
   */
  constructor(pDevice, pTexture, pLayout) {
    super(pDevice);
    // Set statics.
    this.mTexture = pTexture;
    this.mLayout = pLayout;
    // Set defaults.
    this.mMipLevelStart = 0;
    this.mMipLevelEnd = -1;
    this.mArrayLayerStart = 0;
    this.mArrayLayerEnd = -1;
    // Trigger View rebuild on texture rebuilds.
    pTexture.addInvalidationListener(() => {
      this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
    }, gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
  /**
   * Generate native canvas texture view.
   */
  generateNative() {
    // Read native texture.
    const lNativeTexture = this.mTexture.native;
    // When mip end level or array end layer is not set, use textures max. 
    const lMipLevelEnd = this.mMipLevelEnd < 0 ? lNativeTexture.mipLevelCount - 1 : this.mMipLevelEnd;
    const lArrayLayerEnd = this.mArrayLayerEnd < 0 ? lNativeTexture.depthOrArrayLayers - 1 : this.mArrayLayerEnd;
    // Validate dimension based on 
    const lDimensionViewDepthCount = (() => {
      switch (this.mLayout.dimension) {
        case texture_view_dimension_enum_1.TextureViewDimension.OneDimension:
        case texture_view_dimension_enum_1.TextureViewDimension.TwoDimension:
          {
            return 1;
          }
        case texture_view_dimension_enum_1.TextureViewDimension.Cube:
          {
            return 6;
          }
        case texture_view_dimension_enum_1.TextureViewDimension.CubeArray:
          {
            return Math.floor((lArrayLayerEnd - this.mArrayLayerStart + 1) / 6) * 6;
          }
        case texture_view_dimension_enum_1.TextureViewDimension.TwoDimensionArray:
        case texture_view_dimension_enum_1.TextureViewDimension.ThreeDimension:
          {
            return lArrayLayerEnd - this.mArrayLayerStart + 1;
          }
        default:
          {
            return 1;
          }
      }
    })();
    // Create and configure canvas context.
    return lNativeTexture.createView({
      aspect: 'all',
      format: this.mLayout.format,
      dimension: this.mLayout.dimension,
      // Mip start and end.
      baseMipLevel: this.mMipLevelStart,
      mipLevelCount: lMipLevelEnd - this.mMipLevelStart + 1,
      // Array layer start and end.
      baseArrayLayer: this.mArrayLayerStart,
      arrayLayerCount: lDimensionViewDepthCount
    });
  }
}
exports.GpuTextureView = GpuTextureView;

/***/ }),

/***/ "./source/texture/gpu-texture.ts":
/*!***************************************!*\
  !*** ./source/texture/gpu-texture.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuTexture = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const texture_dimension_enum_1 = __webpack_require__(/*! ../constant/texture-dimension.enum */ "./source/constant/texture-dimension.enum.ts");
const texture_usage_enum_1 = __webpack_require__(/*! ../constant/texture-usage.enum */ "./source/constant/texture-usage.enum.ts");
const texture_view_dimension_enum_1 = __webpack_require__(/*! ../constant/texture-view-dimension.enum */ "./source/constant/texture-view-dimension.enum.ts");
const gpu_limit_enum_1 = __webpack_require__(/*! ../gpu/capabilities/gpu-limit.enum */ "./source/gpu/capabilities/gpu-limit.enum.ts");
const gpu_resource_object_1 = __webpack_require__(/*! ../gpu/object/gpu-resource-object */ "./source/gpu/object/gpu-resource-object.ts");
const texture_view_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/texture-view-memory-layout */ "./source/memory_layout/texture/texture-view-memory-layout.ts");
const gpu_texture_view_1 = __webpack_require__(/*! ./gpu-texture-view */ "./source/texture/gpu-texture-view.ts");
class GpuTexture extends gpu_resource_object_1.GpuResourceObject {
  /**
   * Texture depth.
   */
  get depth() {
    return this.mDepth;
  }
  set depth(pDepth) {
    this.mDepth = pDepth;
    // Invalidate texture.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
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
   * Texture height.
   */
  get height() {
    return this.mHeight;
  }
  set height(pHeight) {
    this.mHeight = pHeight;
    // Invalidate texture.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
  /**
   * Texture mip level count.
   */
  get mipCount() {
    return this.mMipLevelCount;
  }
  set mipCount(pMipCount) {
    this.mMipLevelCount = pMipCount;
    // Invalidate texture.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
  /**
   * Texture multi sampled.
   */
  get multiSampled() {
    return this.mMultisampled;
  }
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  /**
   * Texture width.
   */
  get width() {
    return this.mWidth;
  }
  set width(pWidth) {
    this.mWidth = pWidth;
    // Invalidate texture.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   * @param pLayout - Texture layout.
   * @param pCanvas - Canvas of texture.
   */
  constructor(pDevice, pParameter) {
    super(pDevice);
    // Set static config.
    this.mDimension = pParameter.dimension;
    this.mFormat = pParameter.format;
    this.mMultisampled = pParameter.multisampled;
    // Set defaults.
    this.mMipLevelCount = 1;
    this.mDepth = 1;
    this.mHeight = 1;
    this.mWidth = 1;
  }
  copyFrom(...pTextures) {
    // Convert into none optional config.
    const lCopyConfig = new Array();
    for (let lTextureIndex = 0; lTextureIndex < pTextures.length; lTextureIndex++) {
      const lCopyTexture = pTextures[lTextureIndex];
      // Create new config from data.
      if (!('data' in lCopyTexture)) {
        // Wild instance checks.
        switch (true) {
          case lCopyTexture instanceof GpuTexture:
            {
              lCopyConfig.push({
                data: lCopyTexture,
                mipLevel: 0,
                external: false,
                dimension: {
                  width: lCopyTexture.width,
                  height: lCopyTexture.height,
                  depthOrArrayLayers: lCopyTexture.depth
                },
                sourceOrigin: {
                  x: 0,
                  y: 0,
                  z: 0
                },
                targetOrigin: {
                  x: 0,
                  y: 0,
                  z: lTextureIndex
                }
              });
              continue;
            }
          case lCopyTexture instanceof ImageBitmap:
            {
              lCopyConfig.push({
                data: lCopyTexture,
                mipLevel: 0,
                external: true,
                dimension: {
                  width: lCopyTexture.width,
                  height: lCopyTexture.height,
                  depthOrArrayLayers: 1
                },
                sourceOrigin: {
                  x: 0,
                  y: 0,
                  z: 0
                },
                targetOrigin: {
                  x: 0,
                  y: 0,
                  z: lTextureIndex
                }
              });
              continue;
            }
        }
        // Not hit. But better to read.
        continue;
      }
      // Get data type.
      const lExternal = !(lCopyTexture instanceof GpuTexture);
      // Fill in missing values with defaults.
      lCopyConfig.push({
        data: lCopyTexture.data,
        external: lExternal,
        mipLevel: lCopyTexture.mipLevel ?? 0,
        dimension: {
          width: lCopyTexture.dimension?.width ?? lCopyTexture.data.width,
          height: lCopyTexture.dimension?.height ?? lCopyTexture.data.height,
          depthOrArrayLayers: lCopyTexture.dimension?.depth ?? ('depth' in lCopyTexture.data ? lCopyTexture.data.depth : 1)
        },
        sourceOrigin: lCopyTexture.sourceOrigin ?? {
          x: 0,
          y: 0,
          z: 0
        },
        targetOrigin: lCopyTexture.targetOrigin ?? {
          x: 0,
          y: 0,
          z: 0
        }
      });
    }
    // Extend usage to be able to copy from external and gpu textures.
    this.extendUsage(texture_usage_enum_1.TextureUsage.CopyDestination);
    this.extendUsage(texture_usage_enum_1.TextureUsage.RenderAttachment);
    // Generate native texture.
    const lDestination = {
      texture: this.native,
      aspect: 'all'
    };
    // Create copy command encoder to store copy actions.
    const lCommandDecoder = this.device.gpu.createCommandEncoder();
    for (const lSourceTexture of lCopyConfig) {
      // Skip copy of textures outside of targets mip level.
      if (lDestination.texture.mipLevelCount < lSourceTexture.mipLevel) {
        continue;
      }
      // Apply destination config.
      lDestination.origin = lSourceTexture.targetOrigin;
      lDestination.mipLevel = lSourceTexture.mipLevel;
      // Calculate target max size for the specific mip map.
      const lDestinationMaxSize = {
        width: Math.floor(lDestination.texture.width / Math.pow(2, lDestination.mipLevel)),
        height: Math.floor(lDestination.texture.height / Math.pow(2, lDestination.mipLevel)),
        // On 3D textures the depth count to the mip.
        depthOrArrayLayers: lDestination.texture.dimension === '3d' ? Math.floor(lDestination.texture.depthOrArrayLayers / Math.pow(2, lDestination.mipLevel)) : lDestination.texture.depthOrArrayLayers
      };
      // Clamp copy sizes to lowest.
      const lClampedCopySize = {
        width: Math.min(lDestinationMaxSize.width - lSourceTexture.targetOrigin.x, lSourceTexture.dimension.width - lSourceTexture.sourceOrigin.x),
        height: Math.min(lDestinationMaxSize.height - lSourceTexture.targetOrigin.y, lSourceTexture.dimension.height - lSourceTexture.sourceOrigin.y),
        depthOrArrayLayers: Math.min(lDestinationMaxSize.depthOrArrayLayers - lSourceTexture.targetOrigin.z, lSourceTexture.dimension.depthOrArrayLayers - lSourceTexture.sourceOrigin.z)
      };
      // Omit copy when nothing should by copied.
      if (lClampedCopySize.width < 1 || lClampedCopySize.height < 1 || lClampedCopySize.depthOrArrayLayers < 1) {
        continue;
      }
      // Copy external.
      if (lSourceTexture.external) {
        // Create External source.
        const lSource = {
          source: lSourceTexture.data,
          origin: [lSourceTexture.sourceOrigin.x, lSourceTexture.sourceOrigin.y]
        };
        // Add external copy into queue.
        this.device.gpu.queue.copyExternalImageToTexture(lSource, lDestination, lClampedCopySize);
        continue;
      }
      // Create External source.
      const lSource = {
        texture: lSourceTexture.data.native,
        aspect: 'all',
        origin: lSourceTexture.targetOrigin,
        mipLevel: 0
      };
      // Add copy action to command queue.
      lCommandDecoder.copyTextureToTexture(lSource, lDestination, lClampedCopySize);
    }
    // Submit copy actions.
    this.device.gpu.queue.submit([lCommandDecoder.finish()]);
  }
  /**
   * Use texture as view.
   * @returns Texture view.
   */
  useAs(pDimension /* Others Optional, layer, mip ... */) {
    // Use dimension form parameter or convert texture dimension to view dimension.
    const lViewDimension = pDimension ?? (() => {
      switch (this.mDimension) {
        case texture_dimension_enum_1.TextureDimension.OneDimension:
          {
            return texture_view_dimension_enum_1.TextureViewDimension.OneDimension;
          }
        case texture_dimension_enum_1.TextureDimension.TwoDimension:
          {
            return texture_view_dimension_enum_1.TextureViewDimension.TwoDimension;
          }
        case texture_dimension_enum_1.TextureDimension.ThreeDimension:
          {
            return texture_view_dimension_enum_1.TextureViewDimension.ThreeDimension;
          }
      }
    })();
    const lLayout = new texture_view_memory_layout_1.TextureViewMemoryLayout(this.device, {
      format: this.mFormat,
      dimension: lViewDimension,
      multisampled: this.mMultisampled
    });
    return new gpu_texture_view_1.GpuTextureView(this.device, this, lLayout);
  }
  /**
   * Destory texture object.
   *
   * @param _pNativeObject - Native gpu texture.
   */
  destroyNative(pNativeObject) {
    pNativeObject.destroy();
  }
  /**
   * Generate native canvas texture view.
   */
  generateNative() {
    // Generate gpu dimension from memory layout dimension and enforce limits.
    const lTextureDimensions = (() => {
      switch (this.mDimension) {
        case texture_dimension_enum_1.TextureDimension.OneDimension:
          {
            // Enforce dimension limits.
            const lDimensionLimit = this.device.capabilities.getLimit(gpu_limit_enum_1.GpuLimit.MaxTextureDimension1D);
            if (this.mWidth > lDimensionLimit) {
              throw new core_1.Exception(`Texture dimension exeeced for 1D Texture(${this.mWidth}).`, this);
            }
            return {
              textureDimension: '1d',
              clampedDimensions: [this.mWidth, 1, 1]
            };
          }
        case texture_dimension_enum_1.TextureDimension.TwoDimension:
          {
            // Enforce dimension limits.
            const lDimensionLimit = this.device.capabilities.getLimit(gpu_limit_enum_1.GpuLimit.MaxTextureDimension1D);
            if (this.mWidth > lDimensionLimit || this.mHeight > lDimensionLimit) {
              throw new core_1.Exception(`Texture dimension exeeced for 2D Texture(${this.mWidth}, ${this.mHeight}).`, this);
            }
            // Enforce array layer limits.
            const lArrayLayerLimit = this.device.capabilities.getLimit(gpu_limit_enum_1.GpuLimit.MaxTextureArrayLayers);
            if (this.mDepth > lArrayLayerLimit) {
              throw new core_1.Exception(`Texture array layer exeeced for 2D Texture(${this.mDepth}).`, this);
            }
            return {
              textureDimension: '2d',
              clampedDimensions: [this.mWidth, this.mHeight, this.mDepth]
            };
          }
        case texture_dimension_enum_1.TextureDimension.ThreeDimension:
          {
            // Enforce dimension limits.
            const lDimensionLimit = this.device.capabilities.getLimit(gpu_limit_enum_1.GpuLimit.MaxTextureDimension3D);
            if (this.mWidth > lDimensionLimit || this.mHeight > lDimensionLimit || this.mDepth > lDimensionLimit) {
              throw new core_1.Exception(`Texture dimension exeeced for 3D Texture(${this.mWidth}, ${this.mHeight}, ${this.mDepth}).`, this);
            }
            return {
              textureDimension: '3d',
              clampedDimensions: [this.mWidth, this.mHeight, this.mDepth]
            };
          }
      }
    })();
    // Calculate max mip count.
    let lMaxMipCount;
    if (lTextureDimensions.textureDimension === '3d') {
      lMaxMipCount = 1 + Math.floor(Math.log2(Math.max(this.mWidth, this.mHeight, this.mDepth)));
    } else {
      lMaxMipCount = 1 + Math.floor(Math.log2(Math.max(this.mWidth, this.mHeight)));
    }
    // Create and configure canvas context.
    return this.device.gpu.createTexture({
      label: 'GPU-Texture',
      size: lTextureDimensions.clampedDimensions,
      format: this.mFormat,
      usage: this.usage,
      dimension: lTextureDimensions.textureDimension,
      sampleCount: this.mMultisampled ? 4 : 1,
      mipLevelCount: Math.min(this.mMipLevelCount, lMaxMipCount)
    });
  }
}
exports.GpuTexture = GpuTexture;

/***/ }),

/***/ "./source/texture/texture-format-capabilities.ts":
/*!*******************************************************!*\
  !*** ./source/texture/texture-format-capabilities.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureFormatCapabilities = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const texture_aspect_enum_1 = __webpack_require__(/*! ../constant/texture-aspect.enum */ "./source/constant/texture-aspect.enum.ts");
const texture_dimension_enum_1 = __webpack_require__(/*! ../constant/texture-dimension.enum */ "./source/constant/texture-dimension.enum.ts");
const texture_format_enum_1 = __webpack_require__(/*! ../constant/texture-format.enum */ "./source/constant/texture-format.enum.ts");
const texture_sample_type_enum_1 = __webpack_require__(/*! ../constant/texture-sample-type.enum */ "./source/constant/texture-sample-type.enum.ts");
const texture_usage_enum_1 = __webpack_require__(/*! ../constant/texture-usage.enum */ "./source/constant/texture-usage.enum.ts");
const gpu_feature_enum_1 = __webpack_require__(/*! ../gpu/capabilities/gpu-feature.enum */ "./source/gpu/capabilities/gpu-feature.enum.ts");
class TextureFormatCapabilities {
  /**
   * Get prefered canvas format.
   */
  get preferredCanvasFormat() {
    return window.navigator.gpu.getPreferredCanvasFormat();
  }
  /**
   * Constructor. Inits capabilities.
   *
   * @param pDevice - Device.
   */
  constructor(pDevice) {
    this.mDevice = pDevice;
    // Construct sample type for float32 texture types.
    const lFloat32Filterable = [texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat];
    if (this.mDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.Float32Filterable)) {
      lFloat32Filterable.push(texture_sample_type_enum_1.TextureSampleType.Float);
    }
    // Setup any format with its capabilities.
    this.mFormatCapabilitys = new core_1.Dictionary();
    // 8-bit formats
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R8unorm, {
      format: texture_format_enum_1.TextureFormat.R8unorm,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R8snorm, {
      format: texture_format_enum_1.TextureFormat.R8snorm,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: false,
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R8uint, {
      format: texture_format_enum_1.TextureFormat.R8uint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R8sint, {
      format: texture_format_enum_1.TextureFormat.R8sint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    // 16-bit formats
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R16uint, {
      format: texture_format_enum_1.TextureFormat.R16uint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R16sint, {
      format: texture_format_enum_1.TextureFormat.R16sint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R16float, {
      format: texture_format_enum_1.TextureFormat.R16float,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg8unorm, {
      format: texture_format_enum_1.TextureFormat.Rg8unorm,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg8snorm, {
      format: texture_format_enum_1.TextureFormat.Rg8snorm,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: false,
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg8uint, {
      format: texture_format_enum_1.TextureFormat.Rg8uint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg8sint, {
      format: texture_format_enum_1.TextureFormat.Rg8sint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    // 32-bit formats
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R32uint, {
      format: texture_format_enum_1.TextureFormat.R32uint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: true
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R32sint, {
      format: texture_format_enum_1.TextureFormat.R32sint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: true
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R32float, {
      format: texture_format_enum_1.TextureFormat.R32float,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: lFloat32Filterable,
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: true
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg16uint, {
      format: texture_format_enum_1.TextureFormat.Rg16uint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg16sint, {
      format: texture_format_enum_1.TextureFormat.Rg16sint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg16float, {
      format: texture_format_enum_1.TextureFormat.Rg16float,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba8unorm, {
      format: texture_format_enum_1.TextureFormat.Rgba8unorm,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba8unormSrgb, {
      format: texture_format_enum_1.TextureFormat.Rgba8unormSrgb,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba8snorm, {
      format: texture_format_enum_1.TextureFormat.Rgba8snorm,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: false,
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba8uint, {
      format: texture_format_enum_1.TextureFormat.Rgba8uint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba8sint, {
      format: texture_format_enum_1.TextureFormat.Rgba8sint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bgra8unorm, {
      format: texture_format_enum_1.TextureFormat.Bgra8unorm,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: pDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.Bgra8unormStorage),
          writeonly: false,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bgra8unormSrgb, {
      format: texture_format_enum_1.TextureFormat.Bgra8unormSrgb,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    // Packed 32-bit formats
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgb9e5ufloat, {
      format: texture_format_enum_1.TextureFormat.Rgb9e5ufloat,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: false,
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgb10a2uint, {
      format: texture_format_enum_1.TextureFormat.Rgb10a2uint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgb10a2unorm, {
      format: texture_format_enum_1.TextureFormat.Rgb10a2unorm,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg11b10ufloat, {
      format: texture_format_enum_1.TextureFormat.Rg11b10ufloat,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: pDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.Rg11b10ufloatRenderable) ? {
          resolveTarget: true,
          blendable: true,
          multisample: true
        } : false,
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    // 64-bit formats
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg32uint, {
      format: texture_format_enum_1.TextureFormat.Rg32uint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg32sint, {
      format: texture_format_enum_1.TextureFormat.Rg32sint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg32float, {
      format: texture_format_enum_1.TextureFormat.Rg32float,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: lFloat32Filterable,
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba16uint, {
      format: texture_format_enum_1.TextureFormat.Rgba16uint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba16sint, {
      format: texture_format_enum_1.TextureFormat.Rgba16sint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba16float, {
      format: texture_format_enum_1.TextureFormat.Rgba16float,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    // 128-bit formats
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba32uint, {
      format: texture_format_enum_1.TextureFormat.Rgba32uint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba32sint, {
      format: texture_format_enum_1.TextureFormat.Rgba32sint,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba32float, {
      format: texture_format_enum_1.TextureFormat.Rgba32float,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: lFloat32Filterable,
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    // Depth/stencil formats
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Stencil8, {
      format: texture_format_enum_1.TextureFormat.Stencil8,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Stencil],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Depth16unorm, {
      format: texture_format_enum_1.TextureFormat.Depth16unorm,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Depth],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Depth, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Depth24plus, {
      format: texture_format_enum_1.TextureFormat.Depth24plus,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Depth],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Depth, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: false,
          imageDestination: false
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Depth24plusStencil8, {
      format: texture_format_enum_1.TextureFormat.Depth24plusStencil8,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Depth, texture_aspect_enum_1.TextureAspect.Stencil],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Depth, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat, texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: false,
          // Stencil supports image copy but depth does not.
          imageDestination: false // Stencil supports image copy but depth does not.
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Depth32float, {
      format: texture_format_enum_1.TextureFormat.Depth32float,
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Depth],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Depth, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionBlock: {
        width: 1,
        height: 1
      },
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureDestination: true,
          imageSource: true,
          imageDestination: false
        },
        storage: false
      }
    });
    // "depth32float-stencil8" feature
    if (pDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.Depth32floatStencil8)) {
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Depth32floatStencil8, {
        format: texture_format_enum_1.TextureFormat.Depth32floatStencil8,
        aspect: {
          types: [texture_aspect_enum_1.TextureAspect.Depth, texture_aspect_enum_1.TextureAspect.Stencil],
          byteCost: 4
        },
        dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension],
        type: [texture_sample_type_enum_1.TextureSampleType.Depth, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat, texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
        compressionBlock: {
          width: 1,
          height: 1
        },
        usage: {
          textureBinding: true,
          renderAttachment: {
            resolveTarget: false,
            blendable: false,
            multisample: true
          },
          copy: {
            textureSource: true,
            textureDestination: true,
            imageSource: true,
            imageDestination: false
          },
          storage: false
        }
      });
    }
    // BC compressed formats
    if (pDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.TextureCompressionBc)) {
      const lBcTextureFormatCapability = (pFormat, pAspects, pByteOfAspect) => {
        const lFormat = {
          format: pFormat,
          aspect: {
            types: pAspects,
            byteCost: pByteOfAspect
          },
          dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension],
          type: [texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat, texture_sample_type_enum_1.TextureSampleType.Float],
          compressionBlock: {
            width: 4,
            height: 4
          },
          usage: {
            textureBinding: true,
            renderAttachment: false,
            copy: {
              textureSource: true,
              textureDestination: true,
              imageSource: true,
              imageDestination: true
            },
            storage: false
          }
        };
        if (pDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.TextureCompressionBcSliced3d)) {
          lFormat.dimensions.push(texture_dimension_enum_1.TextureDimension.ThreeDimension);
        }
        return lFormat;
      };
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc1RgbaUnorm, lBcTextureFormatCapability(texture_format_enum_1.TextureFormat.Bc1RgbaUnorm, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 2));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc1RgbaUnormSrgb, lBcTextureFormatCapability(texture_format_enum_1.TextureFormat.Bc1RgbaUnormSrgb, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 2));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc2RgbaUnorm, lBcTextureFormatCapability(texture_format_enum_1.TextureFormat.Bc2RgbaUnorm, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc2RgbaUnormSrgb, lBcTextureFormatCapability(texture_format_enum_1.TextureFormat.Bc2RgbaUnormSrgb, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc3RgbaUnorm, lBcTextureFormatCapability(texture_format_enum_1.TextureFormat.Bc3RgbaUnorm, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc3RgbaUnormSrgb, lBcTextureFormatCapability(texture_format_enum_1.TextureFormat.Bc3RgbaUnormSrgb, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc4Runorm, lBcTextureFormatCapability(texture_format_enum_1.TextureFormat.Bc4Runorm, [texture_aspect_enum_1.TextureAspect.Red], 8));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc4Rsnorm, lBcTextureFormatCapability(texture_format_enum_1.TextureFormat.Bc4Rsnorm, [texture_aspect_enum_1.TextureAspect.Red], 8));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc5RgUnorm, lBcTextureFormatCapability(texture_format_enum_1.TextureFormat.Bc5RgUnorm, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green], 8));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc5RgSnorm, lBcTextureFormatCapability(texture_format_enum_1.TextureFormat.Bc5RgSnorm, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green], 8));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc6hRgbUfloat, lBcTextureFormatCapability(texture_format_enum_1.TextureFormat.Bc6hRgbUfloat, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc6hRgbFloat, lBcTextureFormatCapability(texture_format_enum_1.TextureFormat.Bc6hRgbFloat, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc7RgbaUnorm, lBcTextureFormatCapability(texture_format_enum_1.TextureFormat.Bc7RgbaUnorm, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc7RgbaUnormSrgb, lBcTextureFormatCapability(texture_format_enum_1.TextureFormat.Bc7RgbaUnormSrgb, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
    }
    // ETC2 compressed formats
    if (pDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.TextureCompressionEtc2)) {
      const lEtc2TextureFormatCapability = (pFormat, pAspects, pByteOfAspect) => {
        const lFormat = {
          format: pFormat,
          aspect: {
            types: pAspects,
            byteCost: pByteOfAspect
          },
          dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension],
          type: [texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat, texture_sample_type_enum_1.TextureSampleType.Float],
          compressionBlock: {
            width: 4,
            height: 4
          },
          usage: {
            textureBinding: true,
            renderAttachment: false,
            copy: {
              textureSource: true,
              textureDestination: true,
              imageSource: true,
              imageDestination: true
            },
            storage: false
          }
        };
        return lFormat;
      };
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Etc2Rgb8unorm, lEtc2TextureFormatCapability(texture_format_enum_1.TextureFormat.Etc2Rgb8unorm, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue], 2));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Etc2Rgb8unormSrgb, lEtc2TextureFormatCapability(texture_format_enum_1.TextureFormat.Etc2Rgb8unormSrgb, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue], 2));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Etc2Rgb8a1unorm, lEtc2TextureFormatCapability(texture_format_enum_1.TextureFormat.Etc2Rgb8a1unorm, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 2));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Etc2Rgb8a1unormSrgb, lEtc2TextureFormatCapability(texture_format_enum_1.TextureFormat.Etc2Rgb8a1unormSrgb, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 2));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Etc2Rgba8unorm, lEtc2TextureFormatCapability(texture_format_enum_1.TextureFormat.Etc2Rgba8unorm, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Etc2Rgba8unormSrgb, lEtc2TextureFormatCapability(texture_format_enum_1.TextureFormat.Etc2Rgba8unormSrgb, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.EacR11unorm, lEtc2TextureFormatCapability(texture_format_enum_1.TextureFormat.EacR11unorm, [texture_aspect_enum_1.TextureAspect.Red], 8));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.EacR11snorm, lEtc2TextureFormatCapability(texture_format_enum_1.TextureFormat.EacR11snorm, [texture_aspect_enum_1.TextureAspect.Red], 8));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.EacRg11unorm, lEtc2TextureFormatCapability(texture_format_enum_1.TextureFormat.EacRg11unorm, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green], 8));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.EacRg11snorm, lEtc2TextureFormatCapability(texture_format_enum_1.TextureFormat.EacRg11snorm, [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green], 8));
    }
    // ASTC compressed formats
    if (pDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.TextureCompressionAstc)) {
      const lAstcTextureFormatCapability = (pFormat, pCompressionLevel) => {
        const lFormat = {
          format: pFormat,
          aspect: {
            types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
            byteCost: 4
          },
          dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension],
          type: [texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat, texture_sample_type_enum_1.TextureSampleType.Float],
          compressionBlock: {
            width: pCompressionLevel[0],
            height: pCompressionLevel[1]
          },
          usage: {
            textureBinding: true,
            renderAttachment: false,
            copy: {
              textureSource: true,
              textureDestination: true,
              imageSource: true,
              imageDestination: true
            },
            storage: false
          }
        };
        return lFormat;
      };
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc4x4unorm, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc4x4unorm, [4, 4]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc4x4unormSrgb, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc4x4unormSrgb, [4, 4]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc5x4unorm, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc5x4unorm, [5, 4]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc5x4unormSrgb, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc5x4unormSrgb, [5, 4]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc5x5unorm, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc5x5unorm, [5, 5]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc5x5unormSrgb, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc5x5unormSrgb, [5, 5]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc6x5unorm, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc6x5unorm, [6, 5]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc6x5unormSrgb, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc6x5unormSrgb, [6, 5]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc6x6unorm, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc6x6unorm, [6, 6]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc6x6unormSrgb, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc6x6unormSrgb, [6, 6]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc8x5unorm, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc8x5unorm, [8, 5]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc8x5unormSrgb, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc8x5unormSrgb, [8, 5]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc8x6unorm, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc8x6unorm, [8, 6]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc8x6unormSrgb, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc8x6unormSrgb, [8, 6]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc8x8unorm, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc8x8unorm, [8, 8]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc8x8unormSrgb, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc8x8unormSrgb, [8, 8]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x5unorm, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc10x5unorm, [10, 5]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x5unormSrgb, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc10x5unormSrgb, [10, 5]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x6unorm, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc10x6unorm, [10, 6]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x6unormSrgb, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc10x6unormSrgb, [10, 6]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x8unorm, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc10x8unorm, [10, 8]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x8unormSrgb, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc10x8unormSrgb, [10, 8]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x10unorm, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc10x10unorm, [10, 10]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x10unormSrgb, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc10x10unormSrgb, [10, 10]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc12x10unorm, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc12x10unorm, [12, 10]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc12x10unormSrgb, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc12x10unormSrgb, [12, 10]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc12x12unorm, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc12x12unorm, [12, 12]));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc12x12unormSrgb, lAstcTextureFormatCapability(texture_format_enum_1.TextureFormat.Astc12x12unormSrgb, [12, 12]));
    }
  }
  /**
   * Get all texture format capabilities of format.
   *
   * @param pFormat - Format.
   *
   * @returns capabilities of format.
   */
  capabilityOf(pFormat) {
    const lCapabilityDefinition = this.mFormatCapabilitys.get(pFormat);
    if (!lCapabilityDefinition) {
      throw new core_1.Exception(`Format "${pFormat}" has no capabilities.`, this);
    }
    // Gather all texture usages.
    const lTextureUsages = new Set();
    if (lCapabilityDefinition.usage.copy) {
      // Can be copied.
      if (lCapabilityDefinition.usage.copy.imageSource || lCapabilityDefinition.usage.copy.textureSource) {
        lTextureUsages.add(texture_usage_enum_1.TextureUsage.CopySource);
      }
      // Can be copied into.
      if (lCapabilityDefinition.usage.copy.imageDestination || lCapabilityDefinition.usage.copy.textureDestination) {
        lTextureUsages.add(texture_usage_enum_1.TextureUsage.CopyDestination);
      }
    }
    if (lCapabilityDefinition.usage.textureBinding) {
      lTextureUsages.add(texture_usage_enum_1.TextureUsage.TextureBinding);
    }
    if (lCapabilityDefinition.usage.storage) {
      lTextureUsages.add(texture_usage_enum_1.TextureUsage.Storage);
    }
    if (lCapabilityDefinition.usage.renderAttachment) {
      lTextureUsages.add(texture_usage_enum_1.TextureUsage.RenderAttachment);
    }
    // All sample types and primary filterable.
    const lSampleTypes = (() => {
      const lAllSampleTypes = new Set(lCapabilityDefinition.type);
      if (lAllSampleTypes.has(texture_sample_type_enum_1.TextureSampleType.Float)) {
        return [lAllSampleTypes, texture_sample_type_enum_1.TextureSampleType.Float];
      }
      if (lAllSampleTypes.has(texture_sample_type_enum_1.TextureSampleType.UnsignedInteger)) {
        return [lAllSampleTypes, texture_sample_type_enum_1.TextureSampleType.UnsignedInteger];
      }
      if (lAllSampleTypes.has(texture_sample_type_enum_1.TextureSampleType.SignedInteger)) {
        return [lAllSampleTypes, texture_sample_type_enum_1.TextureSampleType.SignedInteger];
      }
      if (lAllSampleTypes.has(texture_sample_type_enum_1.TextureSampleType.SignedInteger)) {
        return [lAllSampleTypes, texture_sample_type_enum_1.TextureSampleType.SignedInteger];
      }
      if (lAllSampleTypes.has(texture_sample_type_enum_1.TextureSampleType.Depth)) {
        return [lAllSampleTypes, texture_sample_type_enum_1.TextureSampleType.Depth];
      }
      // Default
      return [lAllSampleTypes, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat];
    })();
    return {
      format: lCapabilityDefinition.format,
      textureUsages: lTextureUsages,
      dimensions: new Set(lCapabilityDefinition.dimensions),
      aspects: new Set(lCapabilityDefinition.aspect.types),
      sampleTypes: {
        primary: lSampleTypes[1],
        all: lSampleTypes[0]
      },
      renderAttachment: {
        resolveTarget: lCapabilityDefinition.usage.renderAttachment ? lCapabilityDefinition.usage.renderAttachment.resolveTarget : false,
        multisample: lCapabilityDefinition.usage.renderAttachment ? lCapabilityDefinition.usage.renderAttachment.multisample : false,
        blendable: lCapabilityDefinition.usage.renderAttachment ? lCapabilityDefinition.usage.renderAttachment.blendable : false
      },
      storage: {
        readonly: lCapabilityDefinition.usage.storage ? lCapabilityDefinition.usage.storage.readonly : false,
        writeonly: lCapabilityDefinition.usage.storage ? lCapabilityDefinition.usage.storage.writeonly : false,
        readwrite: lCapabilityDefinition.usage.storage ? lCapabilityDefinition.usage.storage.readwrite : false
      },
      copy: {
        textureSource: lCapabilityDefinition.usage.copy ? lCapabilityDefinition.usage.copy.textureSource : false,
        textureTarget: lCapabilityDefinition.usage.copy ? lCapabilityDefinition.usage.copy.textureDestination : false,
        imageSource: lCapabilityDefinition.usage.copy ? lCapabilityDefinition.usage.copy.imageSource : false,
        imageTarget: lCapabilityDefinition.usage.copy ? lCapabilityDefinition.usage.copy.imageDestination : false
      }
    };
  }
  /**
   * Find right format for used capability.
   */
  formatSuggestion(_pCapability) {
    // TODO: Find right suggestion for parameters.
    return [];
  }
}
exports.TextureFormatCapabilities = TextureFormatCapabilities;

/***/ }),

/***/ "./source/texture/texture-sampler.ts":
/*!*******************************************!*\
  !*** ./source/texture/texture-sampler.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureSampler = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const filter_mode_enum_1 = __webpack_require__(/*! ../constant/filter-mode.enum */ "./source/constant/filter-mode.enum.ts");
const sampler_type_enum_1 = __webpack_require__(/*! ../constant/sampler-type.enum */ "./source/constant/sampler-type.enum.ts");
const wrapping_mode_enum_1 = __webpack_require__(/*! ../constant/wrapping-mode.enum */ "./source/constant/wrapping-mode.enum.ts");
const gpu_resource_object_1 = __webpack_require__(/*! ../gpu/object/gpu-resource-object */ "./source/gpu/object/gpu-resource-object.ts");
class TextureSampler extends gpu_resource_object_1.GpuResourceObject {
  /**
   * When provided the sampler will be a comparison sampler with the specified compare function.
   */
  get compare() {
    return this.mCompare;
  }
  set compare(pValue) {
    this.mCompare = pValue;
    // Invalidate native object.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
  /**
   * Specifies the maximum levels of detail, respectively, used internally when sampling a texture.
   */
  get lodMaxClamp() {
    return this.mLodMaxClamp;
  }
  set lodMaxClamp(pValue) {
    this.mLodMaxClamp = pValue;
    // Invalidate native object.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
  /**
   * Specifies the minimum levels of detail, respectively, used internally when sampling a texture.
   */
  get lodMinClamp() {
    return this.mLodMinClamp;
  }
  set lodMinClamp(pValue) {
    this.mLodMinClamp = pValue;
    // Invalidate native object.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
  /**
   * How the texture is sampled when a texel covers more than one pixel.
   */
  get magFilter() {
    return this.mMagFilter;
  }
  set magFilter(pValue) {
    this.mMagFilter = pValue;
    // Invalidate native object.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
  /**
   * Specifies the maximum anisotropy value clamp used by the sampler.
   */
  get maxAnisotropy() {
    return this.mMaxAnisotropy;
  }
  set maxAnisotropy(pValue) {
    this.mMaxAnisotropy = pValue;
    // Invalidate native object.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
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
    // Invalidate native object.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
  /**
   * Specifies behavior for sampling between mipmap levels.
   */
  get mipmapFilter() {
    return this.mMipmapFilter;
  }
  set mipmapFilter(pValue) {
    this.mMipmapFilter = pValue;
    // Invalidate native object.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
  }
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  /**
   * Texture sampler edge wrap mode.
   */
  get wrapMode() {
    return this.mWrapMode;
  }
  set wrapMode(pValue) {
    this.mWrapMode = pValue;
    // Invalidate native object.
    this.invalidate(gpu_resource_object_1.GpuResourceObjectInvalidationType.ResourceRebuild);
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
    this.mMagFilter = filter_mode_enum_1.FilterMode.Linear;
    this.mMinFilter = filter_mode_enum_1.FilterMode.Linear;
    this.mMipmapFilter = filter_mode_enum_1.FilterMode.Linear;
    this.mLodMinClamp = 0;
    this.mLodMaxClamp = 32;
    this.mMaxAnisotropy = 16;
  }
  /**
   * Generate native bind data group layout object.
   */
  generateNative() {
    // Create sampler descriptor.
    const lSamplerOptions = {
      label: 'Texture-Sampler',
      addressModeU: this.wrapMode,
      addressModeV: this.wrapMode,
      addressModeW: this.wrapMode,
      magFilter: this.magFilter,
      minFilter: this.minFilter,
      mipmapFilter: this.mipmapFilter,
      lodMaxClamp: this.lodMaxClamp,
      lodMinClamp: this.lodMinClamp,
      maxAnisotropy: this.maxAnisotropy
    };
    // Add compare function when sampler is a compare sampler.
    if (this.memoryLayout.samplerType === sampler_type_enum_1.SamplerType.Comparison) {
      if (!this.compare) {
        throw new core_1.Exception(`No compare function is set for a comparison sampler.`, this);
      }
      lSamplerOptions.compare = this.compare;
    }
    return this.device.gpu.createSampler(lSamplerOptions);
  }
}
exports.TextureSampler = TextureSampler;

/***/ }),

/***/ "../../node_modules/events/events.js":
/*!*******************************************!*\
  !*** ../../node_modules/events/events.js ***!
  \*******************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "../../node_modules/html-entities/lib/index.js":
/*!*****************************************************!*\
  !*** ../../node_modules/html-entities/lib/index.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __assign=this&&this.__assign||function(){__assign=Object.assign||function(t){for(var s,i=1,n=arguments.length;i<n;i++){s=arguments[i];for(var p in s)if(Object.prototype.hasOwnProperty.call(s,p))t[p]=s[p]}return t};return __assign.apply(this,arguments)};Object.defineProperty(exports, "__esModule", ({value:true}));var named_references_1=__webpack_require__(/*! ./named-references */ "../../node_modules/html-entities/lib/named-references.js");var numeric_unicode_map_1=__webpack_require__(/*! ./numeric-unicode-map */ "../../node_modules/html-entities/lib/numeric-unicode-map.js");var surrogate_pairs_1=__webpack_require__(/*! ./surrogate-pairs */ "../../node_modules/html-entities/lib/surrogate-pairs.js");var allNamedReferences=__assign(__assign({},named_references_1.namedReferences),{all:named_references_1.namedReferences.html5});function replaceUsingRegExp(macroText,macroRegExp,macroReplacer){macroRegExp.lastIndex=0;var replaceMatch=macroRegExp.exec(macroText);var replaceResult;if(replaceMatch){replaceResult="";var replaceLastIndex=0;do{if(replaceLastIndex!==replaceMatch.index){replaceResult+=macroText.substring(replaceLastIndex,replaceMatch.index)}var replaceInput=replaceMatch[0];replaceResult+=macroReplacer(replaceInput);replaceLastIndex=replaceMatch.index+replaceInput.length}while(replaceMatch=macroRegExp.exec(macroText));if(replaceLastIndex!==macroText.length){replaceResult+=macroText.substring(replaceLastIndex)}}else{replaceResult=macroText}return replaceResult}var encodeRegExps={specialChars:/[<>'"&]/g,nonAscii:/[<>'"&\u0080-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,nonAsciiPrintable:/[<>'"&\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,nonAsciiPrintableOnly:/[\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,extensive:/[\x01-\x0c\x0e-\x1f\x21-\x2c\x2e-\x2f\x3a-\x40\x5b-\x60\x7b-\x7d\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g};var defaultEncodeOptions={mode:"specialChars",level:"all",numeric:"decimal"};function encode(text,_a){var _b=_a===void 0?defaultEncodeOptions:_a,_c=_b.mode,mode=_c===void 0?"specialChars":_c,_d=_b.numeric,numeric=_d===void 0?"decimal":_d,_e=_b.level,level=_e===void 0?"all":_e;if(!text){return""}var encodeRegExp=encodeRegExps[mode];var references=allNamedReferences[level].characters;var isHex=numeric==="hexadecimal";return replaceUsingRegExp(text,encodeRegExp,(function(input){var result=references[input];if(!result){var code=input.length>1?surrogate_pairs_1.getCodePoint(input,0):input.charCodeAt(0);result=(isHex?"&#x"+code.toString(16):"&#"+code)+";"}return result}))}exports.encode=encode;var defaultDecodeOptions={scope:"body",level:"all"};var strict=/&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);/g;var attribute=/&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+)[;=]?/g;var baseDecodeRegExps={xml:{strict:strict,attribute:attribute,body:named_references_1.bodyRegExps.xml},html4:{strict:strict,attribute:attribute,body:named_references_1.bodyRegExps.html4},html5:{strict:strict,attribute:attribute,body:named_references_1.bodyRegExps.html5}};var decodeRegExps=__assign(__assign({},baseDecodeRegExps),{all:baseDecodeRegExps.html5});var fromCharCode=String.fromCharCode;var outOfBoundsChar=fromCharCode(65533);var defaultDecodeEntityOptions={level:"all"};function getDecodedEntity(entity,references,isAttribute,isStrict){var decodeResult=entity;var decodeEntityLastChar=entity[entity.length-1];if(isAttribute&&decodeEntityLastChar==="="){decodeResult=entity}else if(isStrict&&decodeEntityLastChar!==";"){decodeResult=entity}else{var decodeResultByReference=references[entity];if(decodeResultByReference){decodeResult=decodeResultByReference}else if(entity[0]==="&"&&entity[1]==="#"){var decodeSecondChar=entity[2];var decodeCode=decodeSecondChar=="x"||decodeSecondChar=="X"?parseInt(entity.substr(3),16):parseInt(entity.substr(2));decodeResult=decodeCode>=1114111?outOfBoundsChar:decodeCode>65535?surrogate_pairs_1.fromCodePoint(decodeCode):fromCharCode(numeric_unicode_map_1.numericUnicodeMap[decodeCode]||decodeCode)}}return decodeResult}function decodeEntity(entity,_a){var _b=(_a===void 0?defaultDecodeEntityOptions:_a).level,level=_b===void 0?"all":_b;if(!entity){return""}return getDecodedEntity(entity,allNamedReferences[level].entities,false,false)}exports.decodeEntity=decodeEntity;function decode(text,_a){var _b=_a===void 0?defaultDecodeOptions:_a,_c=_b.level,level=_c===void 0?"all":_c,_d=_b.scope,scope=_d===void 0?level==="xml"?"strict":"body":_d;if(!text){return""}var decodeRegExp=decodeRegExps[level][scope];var references=allNamedReferences[level].entities;var isAttribute=scope==="attribute";var isStrict=scope==="strict";return replaceUsingRegExp(text,decodeRegExp,(function(entity){return getDecodedEntity(entity,references,isAttribute,isStrict)}))}exports.decode=decode;
//# sourceMappingURL=./index.js.map

/***/ }),

/***/ "../../node_modules/html-entities/lib/named-references.js":
/*!****************************************************************!*\
  !*** ../../node_modules/html-entities/lib/named-references.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.bodyRegExps={xml:/&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,html4:/&notin;|&(?:nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|quot|amp|lt|gt|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,html5:/&centerdot;|&copysr;|&divideontimes;|&gtcc;|&gtcir;|&gtdot;|&gtlPar;|&gtquest;|&gtrapprox;|&gtrarr;|&gtrdot;|&gtreqless;|&gtreqqless;|&gtrless;|&gtrsim;|&ltcc;|&ltcir;|&ltdot;|&lthree;|&ltimes;|&ltlarr;|&ltquest;|&ltrPar;|&ltri;|&ltrie;|&ltrif;|&notin;|&notinE;|&notindot;|&notinva;|&notinvb;|&notinvc;|&notni;|&notniva;|&notnivb;|&notnivc;|&parallel;|&timesb;|&timesbar;|&timesd;|&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g};exports.namedReferences={xml:{entities:{"&lt;":"<","&gt;":">","&quot;":'"',"&apos;":"'","&amp;":"&"},characters:{"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;","&":"&amp;"}},html4:{entities:{"&apos;":"'","&nbsp":" ","&nbsp;":" ","&iexcl":"¡","&iexcl;":"¡","&cent":"¢","&cent;":"¢","&pound":"£","&pound;":"£","&curren":"¤","&curren;":"¤","&yen":"¥","&yen;":"¥","&brvbar":"¦","&brvbar;":"¦","&sect":"§","&sect;":"§","&uml":"¨","&uml;":"¨","&copy":"©","&copy;":"©","&ordf":"ª","&ordf;":"ª","&laquo":"«","&laquo;":"«","&not":"¬","&not;":"¬","&shy":"­","&shy;":"­","&reg":"®","&reg;":"®","&macr":"¯","&macr;":"¯","&deg":"°","&deg;":"°","&plusmn":"±","&plusmn;":"±","&sup2":"²","&sup2;":"²","&sup3":"³","&sup3;":"³","&acute":"´","&acute;":"´","&micro":"µ","&micro;":"µ","&para":"¶","&para;":"¶","&middot":"·","&middot;":"·","&cedil":"¸","&cedil;":"¸","&sup1":"¹","&sup1;":"¹","&ordm":"º","&ordm;":"º","&raquo":"»","&raquo;":"»","&frac14":"¼","&frac14;":"¼","&frac12":"½","&frac12;":"½","&frac34":"¾","&frac34;":"¾","&iquest":"¿","&iquest;":"¿","&Agrave":"À","&Agrave;":"À","&Aacute":"Á","&Aacute;":"Á","&Acirc":"Â","&Acirc;":"Â","&Atilde":"Ã","&Atilde;":"Ã","&Auml":"Ä","&Auml;":"Ä","&Aring":"Å","&Aring;":"Å","&AElig":"Æ","&AElig;":"Æ","&Ccedil":"Ç","&Ccedil;":"Ç","&Egrave":"È","&Egrave;":"È","&Eacute":"É","&Eacute;":"É","&Ecirc":"Ê","&Ecirc;":"Ê","&Euml":"Ë","&Euml;":"Ë","&Igrave":"Ì","&Igrave;":"Ì","&Iacute":"Í","&Iacute;":"Í","&Icirc":"Î","&Icirc;":"Î","&Iuml":"Ï","&Iuml;":"Ï","&ETH":"Ð","&ETH;":"Ð","&Ntilde":"Ñ","&Ntilde;":"Ñ","&Ograve":"Ò","&Ograve;":"Ò","&Oacute":"Ó","&Oacute;":"Ó","&Ocirc":"Ô","&Ocirc;":"Ô","&Otilde":"Õ","&Otilde;":"Õ","&Ouml":"Ö","&Ouml;":"Ö","&times":"×","&times;":"×","&Oslash":"Ø","&Oslash;":"Ø","&Ugrave":"Ù","&Ugrave;":"Ù","&Uacute":"Ú","&Uacute;":"Ú","&Ucirc":"Û","&Ucirc;":"Û","&Uuml":"Ü","&Uuml;":"Ü","&Yacute":"Ý","&Yacute;":"Ý","&THORN":"Þ","&THORN;":"Þ","&szlig":"ß","&szlig;":"ß","&agrave":"à","&agrave;":"à","&aacute":"á","&aacute;":"á","&acirc":"â","&acirc;":"â","&atilde":"ã","&atilde;":"ã","&auml":"ä","&auml;":"ä","&aring":"å","&aring;":"å","&aelig":"æ","&aelig;":"æ","&ccedil":"ç","&ccedil;":"ç","&egrave":"è","&egrave;":"è","&eacute":"é","&eacute;":"é","&ecirc":"ê","&ecirc;":"ê","&euml":"ë","&euml;":"ë","&igrave":"ì","&igrave;":"ì","&iacute":"í","&iacute;":"í","&icirc":"î","&icirc;":"î","&iuml":"ï","&iuml;":"ï","&eth":"ð","&eth;":"ð","&ntilde":"ñ","&ntilde;":"ñ","&ograve":"ò","&ograve;":"ò","&oacute":"ó","&oacute;":"ó","&ocirc":"ô","&ocirc;":"ô","&otilde":"õ","&otilde;":"õ","&ouml":"ö","&ouml;":"ö","&divide":"÷","&divide;":"÷","&oslash":"ø","&oslash;":"ø","&ugrave":"ù","&ugrave;":"ù","&uacute":"ú","&uacute;":"ú","&ucirc":"û","&ucirc;":"û","&uuml":"ü","&uuml;":"ü","&yacute":"ý","&yacute;":"ý","&thorn":"þ","&thorn;":"þ","&yuml":"ÿ","&yuml;":"ÿ","&quot":'"',"&quot;":'"',"&amp":"&","&amp;":"&","&lt":"<","&lt;":"<","&gt":">","&gt;":">","&OElig;":"Œ","&oelig;":"œ","&Scaron;":"Š","&scaron;":"š","&Yuml;":"Ÿ","&circ;":"ˆ","&tilde;":"˜","&ensp;":" ","&emsp;":" ","&thinsp;":" ","&zwnj;":"‌","&zwj;":"‍","&lrm;":"‎","&rlm;":"‏","&ndash;":"–","&mdash;":"—","&lsquo;":"‘","&rsquo;":"’","&sbquo;":"‚","&ldquo;":"“","&rdquo;":"”","&bdquo;":"„","&dagger;":"†","&Dagger;":"‡","&permil;":"‰","&lsaquo;":"‹","&rsaquo;":"›","&euro;":"€","&fnof;":"ƒ","&Alpha;":"Α","&Beta;":"Β","&Gamma;":"Γ","&Delta;":"Δ","&Epsilon;":"Ε","&Zeta;":"Ζ","&Eta;":"Η","&Theta;":"Θ","&Iota;":"Ι","&Kappa;":"Κ","&Lambda;":"Λ","&Mu;":"Μ","&Nu;":"Ν","&Xi;":"Ξ","&Omicron;":"Ο","&Pi;":"Π","&Rho;":"Ρ","&Sigma;":"Σ","&Tau;":"Τ","&Upsilon;":"Υ","&Phi;":"Φ","&Chi;":"Χ","&Psi;":"Ψ","&Omega;":"Ω","&alpha;":"α","&beta;":"β","&gamma;":"γ","&delta;":"δ","&epsilon;":"ε","&zeta;":"ζ","&eta;":"η","&theta;":"θ","&iota;":"ι","&kappa;":"κ","&lambda;":"λ","&mu;":"μ","&nu;":"ν","&xi;":"ξ","&omicron;":"ο","&pi;":"π","&rho;":"ρ","&sigmaf;":"ς","&sigma;":"σ","&tau;":"τ","&upsilon;":"υ","&phi;":"φ","&chi;":"χ","&psi;":"ψ","&omega;":"ω","&thetasym;":"ϑ","&upsih;":"ϒ","&piv;":"ϖ","&bull;":"•","&hellip;":"…","&prime;":"′","&Prime;":"″","&oline;":"‾","&frasl;":"⁄","&weierp;":"℘","&image;":"ℑ","&real;":"ℜ","&trade;":"™","&alefsym;":"ℵ","&larr;":"←","&uarr;":"↑","&rarr;":"→","&darr;":"↓","&harr;":"↔","&crarr;":"↵","&lArr;":"⇐","&uArr;":"⇑","&rArr;":"⇒","&dArr;":"⇓","&hArr;":"⇔","&forall;":"∀","&part;":"∂","&exist;":"∃","&empty;":"∅","&nabla;":"∇","&isin;":"∈","&notin;":"∉","&ni;":"∋","&prod;":"∏","&sum;":"∑","&minus;":"−","&lowast;":"∗","&radic;":"√","&prop;":"∝","&infin;":"∞","&ang;":"∠","&and;":"∧","&or;":"∨","&cap;":"∩","&cup;":"∪","&int;":"∫","&there4;":"∴","&sim;":"∼","&cong;":"≅","&asymp;":"≈","&ne;":"≠","&equiv;":"≡","&le;":"≤","&ge;":"≥","&sub;":"⊂","&sup;":"⊃","&nsub;":"⊄","&sube;":"⊆","&supe;":"⊇","&oplus;":"⊕","&otimes;":"⊗","&perp;":"⊥","&sdot;":"⋅","&lceil;":"⌈","&rceil;":"⌉","&lfloor;":"⌊","&rfloor;":"⌋","&lang;":"〈","&rang;":"〉","&loz;":"◊","&spades;":"♠","&clubs;":"♣","&hearts;":"♥","&diams;":"♦"},characters:{"'":"&apos;"," ":"&nbsp;","¡":"&iexcl;","¢":"&cent;","£":"&pound;","¤":"&curren;","¥":"&yen;","¦":"&brvbar;","§":"&sect;","¨":"&uml;","©":"&copy;","ª":"&ordf;","«":"&laquo;","¬":"&not;","­":"&shy;","®":"&reg;","¯":"&macr;","°":"&deg;","±":"&plusmn;","²":"&sup2;","³":"&sup3;","´":"&acute;","µ":"&micro;","¶":"&para;","·":"&middot;","¸":"&cedil;","¹":"&sup1;","º":"&ordm;","»":"&raquo;","¼":"&frac14;","½":"&frac12;","¾":"&frac34;","¿":"&iquest;","À":"&Agrave;","Á":"&Aacute;","Â":"&Acirc;","Ã":"&Atilde;","Ä":"&Auml;","Å":"&Aring;","Æ":"&AElig;","Ç":"&Ccedil;","È":"&Egrave;","É":"&Eacute;","Ê":"&Ecirc;","Ë":"&Euml;","Ì":"&Igrave;","Í":"&Iacute;","Î":"&Icirc;","Ï":"&Iuml;","Ð":"&ETH;","Ñ":"&Ntilde;","Ò":"&Ograve;","Ó":"&Oacute;","Ô":"&Ocirc;","Õ":"&Otilde;","Ö":"&Ouml;","×":"&times;","Ø":"&Oslash;","Ù":"&Ugrave;","Ú":"&Uacute;","Û":"&Ucirc;","Ü":"&Uuml;","Ý":"&Yacute;","Þ":"&THORN;","ß":"&szlig;","à":"&agrave;","á":"&aacute;","â":"&acirc;","ã":"&atilde;","ä":"&auml;","å":"&aring;","æ":"&aelig;","ç":"&ccedil;","è":"&egrave;","é":"&eacute;","ê":"&ecirc;","ë":"&euml;","ì":"&igrave;","í":"&iacute;","î":"&icirc;","ï":"&iuml;","ð":"&eth;","ñ":"&ntilde;","ò":"&ograve;","ó":"&oacute;","ô":"&ocirc;","õ":"&otilde;","ö":"&ouml;","÷":"&divide;","ø":"&oslash;","ù":"&ugrave;","ú":"&uacute;","û":"&ucirc;","ü":"&uuml;","ý":"&yacute;","þ":"&thorn;","ÿ":"&yuml;",'"':"&quot;","&":"&amp;","<":"&lt;",">":"&gt;","Œ":"&OElig;","œ":"&oelig;","Š":"&Scaron;","š":"&scaron;","Ÿ":"&Yuml;","ˆ":"&circ;","˜":"&tilde;"," ":"&ensp;"," ":"&emsp;"," ":"&thinsp;","‌":"&zwnj;","‍":"&zwj;","‎":"&lrm;","‏":"&rlm;","–":"&ndash;","—":"&mdash;","‘":"&lsquo;","’":"&rsquo;","‚":"&sbquo;","“":"&ldquo;","”":"&rdquo;","„":"&bdquo;","†":"&dagger;","‡":"&Dagger;","‰":"&permil;","‹":"&lsaquo;","›":"&rsaquo;","€":"&euro;","ƒ":"&fnof;","Α":"&Alpha;","Β":"&Beta;","Γ":"&Gamma;","Δ":"&Delta;","Ε":"&Epsilon;","Ζ":"&Zeta;","Η":"&Eta;","Θ":"&Theta;","Ι":"&Iota;","Κ":"&Kappa;","Λ":"&Lambda;","Μ":"&Mu;","Ν":"&Nu;","Ξ":"&Xi;","Ο":"&Omicron;","Π":"&Pi;","Ρ":"&Rho;","Σ":"&Sigma;","Τ":"&Tau;","Υ":"&Upsilon;","Φ":"&Phi;","Χ":"&Chi;","Ψ":"&Psi;","Ω":"&Omega;","α":"&alpha;","β":"&beta;","γ":"&gamma;","δ":"&delta;","ε":"&epsilon;","ζ":"&zeta;","η":"&eta;","θ":"&theta;","ι":"&iota;","κ":"&kappa;","λ":"&lambda;","μ":"&mu;","ν":"&nu;","ξ":"&xi;","ο":"&omicron;","π":"&pi;","ρ":"&rho;","ς":"&sigmaf;","σ":"&sigma;","τ":"&tau;","υ":"&upsilon;","φ":"&phi;","χ":"&chi;","ψ":"&psi;","ω":"&omega;","ϑ":"&thetasym;","ϒ":"&upsih;","ϖ":"&piv;","•":"&bull;","…":"&hellip;","′":"&prime;","″":"&Prime;","‾":"&oline;","⁄":"&frasl;","℘":"&weierp;","ℑ":"&image;","ℜ":"&real;","™":"&trade;","ℵ":"&alefsym;","←":"&larr;","↑":"&uarr;","→":"&rarr;","↓":"&darr;","↔":"&harr;","↵":"&crarr;","⇐":"&lArr;","⇑":"&uArr;","⇒":"&rArr;","⇓":"&dArr;","⇔":"&hArr;","∀":"&forall;","∂":"&part;","∃":"&exist;","∅":"&empty;","∇":"&nabla;","∈":"&isin;","∉":"&notin;","∋":"&ni;","∏":"&prod;","∑":"&sum;","−":"&minus;","∗":"&lowast;","√":"&radic;","∝":"&prop;","∞":"&infin;","∠":"&ang;","∧":"&and;","∨":"&or;","∩":"&cap;","∪":"&cup;","∫":"&int;","∴":"&there4;","∼":"&sim;","≅":"&cong;","≈":"&asymp;","≠":"&ne;","≡":"&equiv;","≤":"&le;","≥":"&ge;","⊂":"&sub;","⊃":"&sup;","⊄":"&nsub;","⊆":"&sube;","⊇":"&supe;","⊕":"&oplus;","⊗":"&otimes;","⊥":"&perp;","⋅":"&sdot;","⌈":"&lceil;","⌉":"&rceil;","⌊":"&lfloor;","⌋":"&rfloor;","〈":"&lang;","〉":"&rang;","◊":"&loz;","♠":"&spades;","♣":"&clubs;","♥":"&hearts;","♦":"&diams;"}},html5:{entities:{"&AElig":"Æ","&AElig;":"Æ","&AMP":"&","&AMP;":"&","&Aacute":"Á","&Aacute;":"Á","&Abreve;":"Ă","&Acirc":"Â","&Acirc;":"Â","&Acy;":"А","&Afr;":"𝔄","&Agrave":"À","&Agrave;":"À","&Alpha;":"Α","&Amacr;":"Ā","&And;":"⩓","&Aogon;":"Ą","&Aopf;":"𝔸","&ApplyFunction;":"⁡","&Aring":"Å","&Aring;":"Å","&Ascr;":"𝒜","&Assign;":"≔","&Atilde":"Ã","&Atilde;":"Ã","&Auml":"Ä","&Auml;":"Ä","&Backslash;":"∖","&Barv;":"⫧","&Barwed;":"⌆","&Bcy;":"Б","&Because;":"∵","&Bernoullis;":"ℬ","&Beta;":"Β","&Bfr;":"𝔅","&Bopf;":"𝔹","&Breve;":"˘","&Bscr;":"ℬ","&Bumpeq;":"≎","&CHcy;":"Ч","&COPY":"©","&COPY;":"©","&Cacute;":"Ć","&Cap;":"⋒","&CapitalDifferentialD;":"ⅅ","&Cayleys;":"ℭ","&Ccaron;":"Č","&Ccedil":"Ç","&Ccedil;":"Ç","&Ccirc;":"Ĉ","&Cconint;":"∰","&Cdot;":"Ċ","&Cedilla;":"¸","&CenterDot;":"·","&Cfr;":"ℭ","&Chi;":"Χ","&CircleDot;":"⊙","&CircleMinus;":"⊖","&CirclePlus;":"⊕","&CircleTimes;":"⊗","&ClockwiseContourIntegral;":"∲","&CloseCurlyDoubleQuote;":"”","&CloseCurlyQuote;":"’","&Colon;":"∷","&Colone;":"⩴","&Congruent;":"≡","&Conint;":"∯","&ContourIntegral;":"∮","&Copf;":"ℂ","&Coproduct;":"∐","&CounterClockwiseContourIntegral;":"∳","&Cross;":"⨯","&Cscr;":"𝒞","&Cup;":"⋓","&CupCap;":"≍","&DD;":"ⅅ","&DDotrahd;":"⤑","&DJcy;":"Ђ","&DScy;":"Ѕ","&DZcy;":"Џ","&Dagger;":"‡","&Darr;":"↡","&Dashv;":"⫤","&Dcaron;":"Ď","&Dcy;":"Д","&Del;":"∇","&Delta;":"Δ","&Dfr;":"𝔇","&DiacriticalAcute;":"´","&DiacriticalDot;":"˙","&DiacriticalDoubleAcute;":"˝","&DiacriticalGrave;":"`","&DiacriticalTilde;":"˜","&Diamond;":"⋄","&DifferentialD;":"ⅆ","&Dopf;":"𝔻","&Dot;":"¨","&DotDot;":"⃜","&DotEqual;":"≐","&DoubleContourIntegral;":"∯","&DoubleDot;":"¨","&DoubleDownArrow;":"⇓","&DoubleLeftArrow;":"⇐","&DoubleLeftRightArrow;":"⇔","&DoubleLeftTee;":"⫤","&DoubleLongLeftArrow;":"⟸","&DoubleLongLeftRightArrow;":"⟺","&DoubleLongRightArrow;":"⟹","&DoubleRightArrow;":"⇒","&DoubleRightTee;":"⊨","&DoubleUpArrow;":"⇑","&DoubleUpDownArrow;":"⇕","&DoubleVerticalBar;":"∥","&DownArrow;":"↓","&DownArrowBar;":"⤓","&DownArrowUpArrow;":"⇵","&DownBreve;":"̑","&DownLeftRightVector;":"⥐","&DownLeftTeeVector;":"⥞","&DownLeftVector;":"↽","&DownLeftVectorBar;":"⥖","&DownRightTeeVector;":"⥟","&DownRightVector;":"⇁","&DownRightVectorBar;":"⥗","&DownTee;":"⊤","&DownTeeArrow;":"↧","&Downarrow;":"⇓","&Dscr;":"𝒟","&Dstrok;":"Đ","&ENG;":"Ŋ","&ETH":"Ð","&ETH;":"Ð","&Eacute":"É","&Eacute;":"É","&Ecaron;":"Ě","&Ecirc":"Ê","&Ecirc;":"Ê","&Ecy;":"Э","&Edot;":"Ė","&Efr;":"𝔈","&Egrave":"È","&Egrave;":"È","&Element;":"∈","&Emacr;":"Ē","&EmptySmallSquare;":"◻","&EmptyVerySmallSquare;":"▫","&Eogon;":"Ę","&Eopf;":"𝔼","&Epsilon;":"Ε","&Equal;":"⩵","&EqualTilde;":"≂","&Equilibrium;":"⇌","&Escr;":"ℰ","&Esim;":"⩳","&Eta;":"Η","&Euml":"Ë","&Euml;":"Ë","&Exists;":"∃","&ExponentialE;":"ⅇ","&Fcy;":"Ф","&Ffr;":"𝔉","&FilledSmallSquare;":"◼","&FilledVerySmallSquare;":"▪","&Fopf;":"𝔽","&ForAll;":"∀","&Fouriertrf;":"ℱ","&Fscr;":"ℱ","&GJcy;":"Ѓ","&GT":">","&GT;":">","&Gamma;":"Γ","&Gammad;":"Ϝ","&Gbreve;":"Ğ","&Gcedil;":"Ģ","&Gcirc;":"Ĝ","&Gcy;":"Г","&Gdot;":"Ġ","&Gfr;":"𝔊","&Gg;":"⋙","&Gopf;":"𝔾","&GreaterEqual;":"≥","&GreaterEqualLess;":"⋛","&GreaterFullEqual;":"≧","&GreaterGreater;":"⪢","&GreaterLess;":"≷","&GreaterSlantEqual;":"⩾","&GreaterTilde;":"≳","&Gscr;":"𝒢","&Gt;":"≫","&HARDcy;":"Ъ","&Hacek;":"ˇ","&Hat;":"^","&Hcirc;":"Ĥ","&Hfr;":"ℌ","&HilbertSpace;":"ℋ","&Hopf;":"ℍ","&HorizontalLine;":"─","&Hscr;":"ℋ","&Hstrok;":"Ħ","&HumpDownHump;":"≎","&HumpEqual;":"≏","&IEcy;":"Е","&IJlig;":"Ĳ","&IOcy;":"Ё","&Iacute":"Í","&Iacute;":"Í","&Icirc":"Î","&Icirc;":"Î","&Icy;":"И","&Idot;":"İ","&Ifr;":"ℑ","&Igrave":"Ì","&Igrave;":"Ì","&Im;":"ℑ","&Imacr;":"Ī","&ImaginaryI;":"ⅈ","&Implies;":"⇒","&Int;":"∬","&Integral;":"∫","&Intersection;":"⋂","&InvisibleComma;":"⁣","&InvisibleTimes;":"⁢","&Iogon;":"Į","&Iopf;":"𝕀","&Iota;":"Ι","&Iscr;":"ℐ","&Itilde;":"Ĩ","&Iukcy;":"І","&Iuml":"Ï","&Iuml;":"Ï","&Jcirc;":"Ĵ","&Jcy;":"Й","&Jfr;":"𝔍","&Jopf;":"𝕁","&Jscr;":"𝒥","&Jsercy;":"Ј","&Jukcy;":"Є","&KHcy;":"Х","&KJcy;":"Ќ","&Kappa;":"Κ","&Kcedil;":"Ķ","&Kcy;":"К","&Kfr;":"𝔎","&Kopf;":"𝕂","&Kscr;":"𝒦","&LJcy;":"Љ","&LT":"<","&LT;":"<","&Lacute;":"Ĺ","&Lambda;":"Λ","&Lang;":"⟪","&Laplacetrf;":"ℒ","&Larr;":"↞","&Lcaron;":"Ľ","&Lcedil;":"Ļ","&Lcy;":"Л","&LeftAngleBracket;":"⟨","&LeftArrow;":"←","&LeftArrowBar;":"⇤","&LeftArrowRightArrow;":"⇆","&LeftCeiling;":"⌈","&LeftDoubleBracket;":"⟦","&LeftDownTeeVector;":"⥡","&LeftDownVector;":"⇃","&LeftDownVectorBar;":"⥙","&LeftFloor;":"⌊","&LeftRightArrow;":"↔","&LeftRightVector;":"⥎","&LeftTee;":"⊣","&LeftTeeArrow;":"↤","&LeftTeeVector;":"⥚","&LeftTriangle;":"⊲","&LeftTriangleBar;":"⧏","&LeftTriangleEqual;":"⊴","&LeftUpDownVector;":"⥑","&LeftUpTeeVector;":"⥠","&LeftUpVector;":"↿","&LeftUpVectorBar;":"⥘","&LeftVector;":"↼","&LeftVectorBar;":"⥒","&Leftarrow;":"⇐","&Leftrightarrow;":"⇔","&LessEqualGreater;":"⋚","&LessFullEqual;":"≦","&LessGreater;":"≶","&LessLess;":"⪡","&LessSlantEqual;":"⩽","&LessTilde;":"≲","&Lfr;":"𝔏","&Ll;":"⋘","&Lleftarrow;":"⇚","&Lmidot;":"Ŀ","&LongLeftArrow;":"⟵","&LongLeftRightArrow;":"⟷","&LongRightArrow;":"⟶","&Longleftarrow;":"⟸","&Longleftrightarrow;":"⟺","&Longrightarrow;":"⟹","&Lopf;":"𝕃","&LowerLeftArrow;":"↙","&LowerRightArrow;":"↘","&Lscr;":"ℒ","&Lsh;":"↰","&Lstrok;":"Ł","&Lt;":"≪","&Map;":"⤅","&Mcy;":"М","&MediumSpace;":" ","&Mellintrf;":"ℳ","&Mfr;":"𝔐","&MinusPlus;":"∓","&Mopf;":"𝕄","&Mscr;":"ℳ","&Mu;":"Μ","&NJcy;":"Њ","&Nacute;":"Ń","&Ncaron;":"Ň","&Ncedil;":"Ņ","&Ncy;":"Н","&NegativeMediumSpace;":"​","&NegativeThickSpace;":"​","&NegativeThinSpace;":"​","&NegativeVeryThinSpace;":"​","&NestedGreaterGreater;":"≫","&NestedLessLess;":"≪","&NewLine;":"\n","&Nfr;":"𝔑","&NoBreak;":"⁠","&NonBreakingSpace;":" ","&Nopf;":"ℕ","&Not;":"⫬","&NotCongruent;":"≢","&NotCupCap;":"≭","&NotDoubleVerticalBar;":"∦","&NotElement;":"∉","&NotEqual;":"≠","&NotEqualTilde;":"≂̸","&NotExists;":"∄","&NotGreater;":"≯","&NotGreaterEqual;":"≱","&NotGreaterFullEqual;":"≧̸","&NotGreaterGreater;":"≫̸","&NotGreaterLess;":"≹","&NotGreaterSlantEqual;":"⩾̸","&NotGreaterTilde;":"≵","&NotHumpDownHump;":"≎̸","&NotHumpEqual;":"≏̸","&NotLeftTriangle;":"⋪","&NotLeftTriangleBar;":"⧏̸","&NotLeftTriangleEqual;":"⋬","&NotLess;":"≮","&NotLessEqual;":"≰","&NotLessGreater;":"≸","&NotLessLess;":"≪̸","&NotLessSlantEqual;":"⩽̸","&NotLessTilde;":"≴","&NotNestedGreaterGreater;":"⪢̸","&NotNestedLessLess;":"⪡̸","&NotPrecedes;":"⊀","&NotPrecedesEqual;":"⪯̸","&NotPrecedesSlantEqual;":"⋠","&NotReverseElement;":"∌","&NotRightTriangle;":"⋫","&NotRightTriangleBar;":"⧐̸","&NotRightTriangleEqual;":"⋭","&NotSquareSubset;":"⊏̸","&NotSquareSubsetEqual;":"⋢","&NotSquareSuperset;":"⊐̸","&NotSquareSupersetEqual;":"⋣","&NotSubset;":"⊂⃒","&NotSubsetEqual;":"⊈","&NotSucceeds;":"⊁","&NotSucceedsEqual;":"⪰̸","&NotSucceedsSlantEqual;":"⋡","&NotSucceedsTilde;":"≿̸","&NotSuperset;":"⊃⃒","&NotSupersetEqual;":"⊉","&NotTilde;":"≁","&NotTildeEqual;":"≄","&NotTildeFullEqual;":"≇","&NotTildeTilde;":"≉","&NotVerticalBar;":"∤","&Nscr;":"𝒩","&Ntilde":"Ñ","&Ntilde;":"Ñ","&Nu;":"Ν","&OElig;":"Œ","&Oacute":"Ó","&Oacute;":"Ó","&Ocirc":"Ô","&Ocirc;":"Ô","&Ocy;":"О","&Odblac;":"Ő","&Ofr;":"𝔒","&Ograve":"Ò","&Ograve;":"Ò","&Omacr;":"Ō","&Omega;":"Ω","&Omicron;":"Ο","&Oopf;":"𝕆","&OpenCurlyDoubleQuote;":"“","&OpenCurlyQuote;":"‘","&Or;":"⩔","&Oscr;":"𝒪","&Oslash":"Ø","&Oslash;":"Ø","&Otilde":"Õ","&Otilde;":"Õ","&Otimes;":"⨷","&Ouml":"Ö","&Ouml;":"Ö","&OverBar;":"‾","&OverBrace;":"⏞","&OverBracket;":"⎴","&OverParenthesis;":"⏜","&PartialD;":"∂","&Pcy;":"П","&Pfr;":"𝔓","&Phi;":"Φ","&Pi;":"Π","&PlusMinus;":"±","&Poincareplane;":"ℌ","&Popf;":"ℙ","&Pr;":"⪻","&Precedes;":"≺","&PrecedesEqual;":"⪯","&PrecedesSlantEqual;":"≼","&PrecedesTilde;":"≾","&Prime;":"″","&Product;":"∏","&Proportion;":"∷","&Proportional;":"∝","&Pscr;":"𝒫","&Psi;":"Ψ","&QUOT":'"',"&QUOT;":'"',"&Qfr;":"𝔔","&Qopf;":"ℚ","&Qscr;":"𝒬","&RBarr;":"⤐","&REG":"®","&REG;":"®","&Racute;":"Ŕ","&Rang;":"⟫","&Rarr;":"↠","&Rarrtl;":"⤖","&Rcaron;":"Ř","&Rcedil;":"Ŗ","&Rcy;":"Р","&Re;":"ℜ","&ReverseElement;":"∋","&ReverseEquilibrium;":"⇋","&ReverseUpEquilibrium;":"⥯","&Rfr;":"ℜ","&Rho;":"Ρ","&RightAngleBracket;":"⟩","&RightArrow;":"→","&RightArrowBar;":"⇥","&RightArrowLeftArrow;":"⇄","&RightCeiling;":"⌉","&RightDoubleBracket;":"⟧","&RightDownTeeVector;":"⥝","&RightDownVector;":"⇂","&RightDownVectorBar;":"⥕","&RightFloor;":"⌋","&RightTee;":"⊢","&RightTeeArrow;":"↦","&RightTeeVector;":"⥛","&RightTriangle;":"⊳","&RightTriangleBar;":"⧐","&RightTriangleEqual;":"⊵","&RightUpDownVector;":"⥏","&RightUpTeeVector;":"⥜","&RightUpVector;":"↾","&RightUpVectorBar;":"⥔","&RightVector;":"⇀","&RightVectorBar;":"⥓","&Rightarrow;":"⇒","&Ropf;":"ℝ","&RoundImplies;":"⥰","&Rrightarrow;":"⇛","&Rscr;":"ℛ","&Rsh;":"↱","&RuleDelayed;":"⧴","&SHCHcy;":"Щ","&SHcy;":"Ш","&SOFTcy;":"Ь","&Sacute;":"Ś","&Sc;":"⪼","&Scaron;":"Š","&Scedil;":"Ş","&Scirc;":"Ŝ","&Scy;":"С","&Sfr;":"𝔖","&ShortDownArrow;":"↓","&ShortLeftArrow;":"←","&ShortRightArrow;":"→","&ShortUpArrow;":"↑","&Sigma;":"Σ","&SmallCircle;":"∘","&Sopf;":"𝕊","&Sqrt;":"√","&Square;":"□","&SquareIntersection;":"⊓","&SquareSubset;":"⊏","&SquareSubsetEqual;":"⊑","&SquareSuperset;":"⊐","&SquareSupersetEqual;":"⊒","&SquareUnion;":"⊔","&Sscr;":"𝒮","&Star;":"⋆","&Sub;":"⋐","&Subset;":"⋐","&SubsetEqual;":"⊆","&Succeeds;":"≻","&SucceedsEqual;":"⪰","&SucceedsSlantEqual;":"≽","&SucceedsTilde;":"≿","&SuchThat;":"∋","&Sum;":"∑","&Sup;":"⋑","&Superset;":"⊃","&SupersetEqual;":"⊇","&Supset;":"⋑","&THORN":"Þ","&THORN;":"Þ","&TRADE;":"™","&TSHcy;":"Ћ","&TScy;":"Ц","&Tab;":"\t","&Tau;":"Τ","&Tcaron;":"Ť","&Tcedil;":"Ţ","&Tcy;":"Т","&Tfr;":"𝔗","&Therefore;":"∴","&Theta;":"Θ","&ThickSpace;":"  ","&ThinSpace;":" ","&Tilde;":"∼","&TildeEqual;":"≃","&TildeFullEqual;":"≅","&TildeTilde;":"≈","&Topf;":"𝕋","&TripleDot;":"⃛","&Tscr;":"𝒯","&Tstrok;":"Ŧ","&Uacute":"Ú","&Uacute;":"Ú","&Uarr;":"↟","&Uarrocir;":"⥉","&Ubrcy;":"Ў","&Ubreve;":"Ŭ","&Ucirc":"Û","&Ucirc;":"Û","&Ucy;":"У","&Udblac;":"Ű","&Ufr;":"𝔘","&Ugrave":"Ù","&Ugrave;":"Ù","&Umacr;":"Ū","&UnderBar;":"_","&UnderBrace;":"⏟","&UnderBracket;":"⎵","&UnderParenthesis;":"⏝","&Union;":"⋃","&UnionPlus;":"⊎","&Uogon;":"Ų","&Uopf;":"𝕌","&UpArrow;":"↑","&UpArrowBar;":"⤒","&UpArrowDownArrow;":"⇅","&UpDownArrow;":"↕","&UpEquilibrium;":"⥮","&UpTee;":"⊥","&UpTeeArrow;":"↥","&Uparrow;":"⇑","&Updownarrow;":"⇕","&UpperLeftArrow;":"↖","&UpperRightArrow;":"↗","&Upsi;":"ϒ","&Upsilon;":"Υ","&Uring;":"Ů","&Uscr;":"𝒰","&Utilde;":"Ũ","&Uuml":"Ü","&Uuml;":"Ü","&VDash;":"⊫","&Vbar;":"⫫","&Vcy;":"В","&Vdash;":"⊩","&Vdashl;":"⫦","&Vee;":"⋁","&Verbar;":"‖","&Vert;":"‖","&VerticalBar;":"∣","&VerticalLine;":"|","&VerticalSeparator;":"❘","&VerticalTilde;":"≀","&VeryThinSpace;":" ","&Vfr;":"𝔙","&Vopf;":"𝕍","&Vscr;":"𝒱","&Vvdash;":"⊪","&Wcirc;":"Ŵ","&Wedge;":"⋀","&Wfr;":"𝔚","&Wopf;":"𝕎","&Wscr;":"𝒲","&Xfr;":"𝔛","&Xi;":"Ξ","&Xopf;":"𝕏","&Xscr;":"𝒳","&YAcy;":"Я","&YIcy;":"Ї","&YUcy;":"Ю","&Yacute":"Ý","&Yacute;":"Ý","&Ycirc;":"Ŷ","&Ycy;":"Ы","&Yfr;":"𝔜","&Yopf;":"𝕐","&Yscr;":"𝒴","&Yuml;":"Ÿ","&ZHcy;":"Ж","&Zacute;":"Ź","&Zcaron;":"Ž","&Zcy;":"З","&Zdot;":"Ż","&ZeroWidthSpace;":"​","&Zeta;":"Ζ","&Zfr;":"ℨ","&Zopf;":"ℤ","&Zscr;":"𝒵","&aacute":"á","&aacute;":"á","&abreve;":"ă","&ac;":"∾","&acE;":"∾̳","&acd;":"∿","&acirc":"â","&acirc;":"â","&acute":"´","&acute;":"´","&acy;":"а","&aelig":"æ","&aelig;":"æ","&af;":"⁡","&afr;":"𝔞","&agrave":"à","&agrave;":"à","&alefsym;":"ℵ","&aleph;":"ℵ","&alpha;":"α","&amacr;":"ā","&amalg;":"⨿","&amp":"&","&amp;":"&","&and;":"∧","&andand;":"⩕","&andd;":"⩜","&andslope;":"⩘","&andv;":"⩚","&ang;":"∠","&ange;":"⦤","&angle;":"∠","&angmsd;":"∡","&angmsdaa;":"⦨","&angmsdab;":"⦩","&angmsdac;":"⦪","&angmsdad;":"⦫","&angmsdae;":"⦬","&angmsdaf;":"⦭","&angmsdag;":"⦮","&angmsdah;":"⦯","&angrt;":"∟","&angrtvb;":"⊾","&angrtvbd;":"⦝","&angsph;":"∢","&angst;":"Å","&angzarr;":"⍼","&aogon;":"ą","&aopf;":"𝕒","&ap;":"≈","&apE;":"⩰","&apacir;":"⩯","&ape;":"≊","&apid;":"≋","&apos;":"'","&approx;":"≈","&approxeq;":"≊","&aring":"å","&aring;":"å","&ascr;":"𝒶","&ast;":"*","&asymp;":"≈","&asympeq;":"≍","&atilde":"ã","&atilde;":"ã","&auml":"ä","&auml;":"ä","&awconint;":"∳","&awint;":"⨑","&bNot;":"⫭","&backcong;":"≌","&backepsilon;":"϶","&backprime;":"‵","&backsim;":"∽","&backsimeq;":"⋍","&barvee;":"⊽","&barwed;":"⌅","&barwedge;":"⌅","&bbrk;":"⎵","&bbrktbrk;":"⎶","&bcong;":"≌","&bcy;":"б","&bdquo;":"„","&becaus;":"∵","&because;":"∵","&bemptyv;":"⦰","&bepsi;":"϶","&bernou;":"ℬ","&beta;":"β","&beth;":"ℶ","&between;":"≬","&bfr;":"𝔟","&bigcap;":"⋂","&bigcirc;":"◯","&bigcup;":"⋃","&bigodot;":"⨀","&bigoplus;":"⨁","&bigotimes;":"⨂","&bigsqcup;":"⨆","&bigstar;":"★","&bigtriangledown;":"▽","&bigtriangleup;":"△","&biguplus;":"⨄","&bigvee;":"⋁","&bigwedge;":"⋀","&bkarow;":"⤍","&blacklozenge;":"⧫","&blacksquare;":"▪","&blacktriangle;":"▴","&blacktriangledown;":"▾","&blacktriangleleft;":"◂","&blacktriangleright;":"▸","&blank;":"␣","&blk12;":"▒","&blk14;":"░","&blk34;":"▓","&block;":"█","&bne;":"=⃥","&bnequiv;":"≡⃥","&bnot;":"⌐","&bopf;":"𝕓","&bot;":"⊥","&bottom;":"⊥","&bowtie;":"⋈","&boxDL;":"╗","&boxDR;":"╔","&boxDl;":"╖","&boxDr;":"╓","&boxH;":"═","&boxHD;":"╦","&boxHU;":"╩","&boxHd;":"╤","&boxHu;":"╧","&boxUL;":"╝","&boxUR;":"╚","&boxUl;":"╜","&boxUr;":"╙","&boxV;":"║","&boxVH;":"╬","&boxVL;":"╣","&boxVR;":"╠","&boxVh;":"╫","&boxVl;":"╢","&boxVr;":"╟","&boxbox;":"⧉","&boxdL;":"╕","&boxdR;":"╒","&boxdl;":"┐","&boxdr;":"┌","&boxh;":"─","&boxhD;":"╥","&boxhU;":"╨","&boxhd;":"┬","&boxhu;":"┴","&boxminus;":"⊟","&boxplus;":"⊞","&boxtimes;":"⊠","&boxuL;":"╛","&boxuR;":"╘","&boxul;":"┘","&boxur;":"└","&boxv;":"│","&boxvH;":"╪","&boxvL;":"╡","&boxvR;":"╞","&boxvh;":"┼","&boxvl;":"┤","&boxvr;":"├","&bprime;":"‵","&breve;":"˘","&brvbar":"¦","&brvbar;":"¦","&bscr;":"𝒷","&bsemi;":"⁏","&bsim;":"∽","&bsime;":"⋍","&bsol;":"\\","&bsolb;":"⧅","&bsolhsub;":"⟈","&bull;":"•","&bullet;":"•","&bump;":"≎","&bumpE;":"⪮","&bumpe;":"≏","&bumpeq;":"≏","&cacute;":"ć","&cap;":"∩","&capand;":"⩄","&capbrcup;":"⩉","&capcap;":"⩋","&capcup;":"⩇","&capdot;":"⩀","&caps;":"∩︀","&caret;":"⁁","&caron;":"ˇ","&ccaps;":"⩍","&ccaron;":"č","&ccedil":"ç","&ccedil;":"ç","&ccirc;":"ĉ","&ccups;":"⩌","&ccupssm;":"⩐","&cdot;":"ċ","&cedil":"¸","&cedil;":"¸","&cemptyv;":"⦲","&cent":"¢","&cent;":"¢","&centerdot;":"·","&cfr;":"𝔠","&chcy;":"ч","&check;":"✓","&checkmark;":"✓","&chi;":"χ","&cir;":"○","&cirE;":"⧃","&circ;":"ˆ","&circeq;":"≗","&circlearrowleft;":"↺","&circlearrowright;":"↻","&circledR;":"®","&circledS;":"Ⓢ","&circledast;":"⊛","&circledcirc;":"⊚","&circleddash;":"⊝","&cire;":"≗","&cirfnint;":"⨐","&cirmid;":"⫯","&cirscir;":"⧂","&clubs;":"♣","&clubsuit;":"♣","&colon;":":","&colone;":"≔","&coloneq;":"≔","&comma;":",","&commat;":"@","&comp;":"∁","&compfn;":"∘","&complement;":"∁","&complexes;":"ℂ","&cong;":"≅","&congdot;":"⩭","&conint;":"∮","&copf;":"𝕔","&coprod;":"∐","&copy":"©","&copy;":"©","&copysr;":"℗","&crarr;":"↵","&cross;":"✗","&cscr;":"𝒸","&csub;":"⫏","&csube;":"⫑","&csup;":"⫐","&csupe;":"⫒","&ctdot;":"⋯","&cudarrl;":"⤸","&cudarrr;":"⤵","&cuepr;":"⋞","&cuesc;":"⋟","&cularr;":"↶","&cularrp;":"⤽","&cup;":"∪","&cupbrcap;":"⩈","&cupcap;":"⩆","&cupcup;":"⩊","&cupdot;":"⊍","&cupor;":"⩅","&cups;":"∪︀","&curarr;":"↷","&curarrm;":"⤼","&curlyeqprec;":"⋞","&curlyeqsucc;":"⋟","&curlyvee;":"⋎","&curlywedge;":"⋏","&curren":"¤","&curren;":"¤","&curvearrowleft;":"↶","&curvearrowright;":"↷","&cuvee;":"⋎","&cuwed;":"⋏","&cwconint;":"∲","&cwint;":"∱","&cylcty;":"⌭","&dArr;":"⇓","&dHar;":"⥥","&dagger;":"†","&daleth;":"ℸ","&darr;":"↓","&dash;":"‐","&dashv;":"⊣","&dbkarow;":"⤏","&dblac;":"˝","&dcaron;":"ď","&dcy;":"д","&dd;":"ⅆ","&ddagger;":"‡","&ddarr;":"⇊","&ddotseq;":"⩷","&deg":"°","&deg;":"°","&delta;":"δ","&demptyv;":"⦱","&dfisht;":"⥿","&dfr;":"𝔡","&dharl;":"⇃","&dharr;":"⇂","&diam;":"⋄","&diamond;":"⋄","&diamondsuit;":"♦","&diams;":"♦","&die;":"¨","&digamma;":"ϝ","&disin;":"⋲","&div;":"÷","&divide":"÷","&divide;":"÷","&divideontimes;":"⋇","&divonx;":"⋇","&djcy;":"ђ","&dlcorn;":"⌞","&dlcrop;":"⌍","&dollar;":"$","&dopf;":"𝕕","&dot;":"˙","&doteq;":"≐","&doteqdot;":"≑","&dotminus;":"∸","&dotplus;":"∔","&dotsquare;":"⊡","&doublebarwedge;":"⌆","&downarrow;":"↓","&downdownarrows;":"⇊","&downharpoonleft;":"⇃","&downharpoonright;":"⇂","&drbkarow;":"⤐","&drcorn;":"⌟","&drcrop;":"⌌","&dscr;":"𝒹","&dscy;":"ѕ","&dsol;":"⧶","&dstrok;":"đ","&dtdot;":"⋱","&dtri;":"▿","&dtrif;":"▾","&duarr;":"⇵","&duhar;":"⥯","&dwangle;":"⦦","&dzcy;":"џ","&dzigrarr;":"⟿","&eDDot;":"⩷","&eDot;":"≑","&eacute":"é","&eacute;":"é","&easter;":"⩮","&ecaron;":"ě","&ecir;":"≖","&ecirc":"ê","&ecirc;":"ê","&ecolon;":"≕","&ecy;":"э","&edot;":"ė","&ee;":"ⅇ","&efDot;":"≒","&efr;":"𝔢","&eg;":"⪚","&egrave":"è","&egrave;":"è","&egs;":"⪖","&egsdot;":"⪘","&el;":"⪙","&elinters;":"⏧","&ell;":"ℓ","&els;":"⪕","&elsdot;":"⪗","&emacr;":"ē","&empty;":"∅","&emptyset;":"∅","&emptyv;":"∅","&emsp13;":" ","&emsp14;":" ","&emsp;":" ","&eng;":"ŋ","&ensp;":" ","&eogon;":"ę","&eopf;":"𝕖","&epar;":"⋕","&eparsl;":"⧣","&eplus;":"⩱","&epsi;":"ε","&epsilon;":"ε","&epsiv;":"ϵ","&eqcirc;":"≖","&eqcolon;":"≕","&eqsim;":"≂","&eqslantgtr;":"⪖","&eqslantless;":"⪕","&equals;":"=","&equest;":"≟","&equiv;":"≡","&equivDD;":"⩸","&eqvparsl;":"⧥","&erDot;":"≓","&erarr;":"⥱","&escr;":"ℯ","&esdot;":"≐","&esim;":"≂","&eta;":"η","&eth":"ð","&eth;":"ð","&euml":"ë","&euml;":"ë","&euro;":"€","&excl;":"!","&exist;":"∃","&expectation;":"ℰ","&exponentiale;":"ⅇ","&fallingdotseq;":"≒","&fcy;":"ф","&female;":"♀","&ffilig;":"ﬃ","&fflig;":"ﬀ","&ffllig;":"ﬄ","&ffr;":"𝔣","&filig;":"ﬁ","&fjlig;":"fj","&flat;":"♭","&fllig;":"ﬂ","&fltns;":"▱","&fnof;":"ƒ","&fopf;":"𝕗","&forall;":"∀","&fork;":"⋔","&forkv;":"⫙","&fpartint;":"⨍","&frac12":"½","&frac12;":"½","&frac13;":"⅓","&frac14":"¼","&frac14;":"¼","&frac15;":"⅕","&frac16;":"⅙","&frac18;":"⅛","&frac23;":"⅔","&frac25;":"⅖","&frac34":"¾","&frac34;":"¾","&frac35;":"⅗","&frac38;":"⅜","&frac45;":"⅘","&frac56;":"⅚","&frac58;":"⅝","&frac78;":"⅞","&frasl;":"⁄","&frown;":"⌢","&fscr;":"𝒻","&gE;":"≧","&gEl;":"⪌","&gacute;":"ǵ","&gamma;":"γ","&gammad;":"ϝ","&gap;":"⪆","&gbreve;":"ğ","&gcirc;":"ĝ","&gcy;":"г","&gdot;":"ġ","&ge;":"≥","&gel;":"⋛","&geq;":"≥","&geqq;":"≧","&geqslant;":"⩾","&ges;":"⩾","&gescc;":"⪩","&gesdot;":"⪀","&gesdoto;":"⪂","&gesdotol;":"⪄","&gesl;":"⋛︀","&gesles;":"⪔","&gfr;":"𝔤","&gg;":"≫","&ggg;":"⋙","&gimel;":"ℷ","&gjcy;":"ѓ","&gl;":"≷","&glE;":"⪒","&gla;":"⪥","&glj;":"⪤","&gnE;":"≩","&gnap;":"⪊","&gnapprox;":"⪊","&gne;":"⪈","&gneq;":"⪈","&gneqq;":"≩","&gnsim;":"⋧","&gopf;":"𝕘","&grave;":"`","&gscr;":"ℊ","&gsim;":"≳","&gsime;":"⪎","&gsiml;":"⪐","&gt":">","&gt;":">","&gtcc;":"⪧","&gtcir;":"⩺","&gtdot;":"⋗","&gtlPar;":"⦕","&gtquest;":"⩼","&gtrapprox;":"⪆","&gtrarr;":"⥸","&gtrdot;":"⋗","&gtreqless;":"⋛","&gtreqqless;":"⪌","&gtrless;":"≷","&gtrsim;":"≳","&gvertneqq;":"≩︀","&gvnE;":"≩︀","&hArr;":"⇔","&hairsp;":" ","&half;":"½","&hamilt;":"ℋ","&hardcy;":"ъ","&harr;":"↔","&harrcir;":"⥈","&harrw;":"↭","&hbar;":"ℏ","&hcirc;":"ĥ","&hearts;":"♥","&heartsuit;":"♥","&hellip;":"…","&hercon;":"⊹","&hfr;":"𝔥","&hksearow;":"⤥","&hkswarow;":"⤦","&hoarr;":"⇿","&homtht;":"∻","&hookleftarrow;":"↩","&hookrightarrow;":"↪","&hopf;":"𝕙","&horbar;":"―","&hscr;":"𝒽","&hslash;":"ℏ","&hstrok;":"ħ","&hybull;":"⁃","&hyphen;":"‐","&iacute":"í","&iacute;":"í","&ic;":"⁣","&icirc":"î","&icirc;":"î","&icy;":"и","&iecy;":"е","&iexcl":"¡","&iexcl;":"¡","&iff;":"⇔","&ifr;":"𝔦","&igrave":"ì","&igrave;":"ì","&ii;":"ⅈ","&iiiint;":"⨌","&iiint;":"∭","&iinfin;":"⧜","&iiota;":"℩","&ijlig;":"ĳ","&imacr;":"ī","&image;":"ℑ","&imagline;":"ℐ","&imagpart;":"ℑ","&imath;":"ı","&imof;":"⊷","&imped;":"Ƶ","&in;":"∈","&incare;":"℅","&infin;":"∞","&infintie;":"⧝","&inodot;":"ı","&int;":"∫","&intcal;":"⊺","&integers;":"ℤ","&intercal;":"⊺","&intlarhk;":"⨗","&intprod;":"⨼","&iocy;":"ё","&iogon;":"į","&iopf;":"𝕚","&iota;":"ι","&iprod;":"⨼","&iquest":"¿","&iquest;":"¿","&iscr;":"𝒾","&isin;":"∈","&isinE;":"⋹","&isindot;":"⋵","&isins;":"⋴","&isinsv;":"⋳","&isinv;":"∈","&it;":"⁢","&itilde;":"ĩ","&iukcy;":"і","&iuml":"ï","&iuml;":"ï","&jcirc;":"ĵ","&jcy;":"й","&jfr;":"𝔧","&jmath;":"ȷ","&jopf;":"𝕛","&jscr;":"𝒿","&jsercy;":"ј","&jukcy;":"є","&kappa;":"κ","&kappav;":"ϰ","&kcedil;":"ķ","&kcy;":"к","&kfr;":"𝔨","&kgreen;":"ĸ","&khcy;":"х","&kjcy;":"ќ","&kopf;":"𝕜","&kscr;":"𝓀","&lAarr;":"⇚","&lArr;":"⇐","&lAtail;":"⤛","&lBarr;":"⤎","&lE;":"≦","&lEg;":"⪋","&lHar;":"⥢","&lacute;":"ĺ","&laemptyv;":"⦴","&lagran;":"ℒ","&lambda;":"λ","&lang;":"⟨","&langd;":"⦑","&langle;":"⟨","&lap;":"⪅","&laquo":"«","&laquo;":"«","&larr;":"←","&larrb;":"⇤","&larrbfs;":"⤟","&larrfs;":"⤝","&larrhk;":"↩","&larrlp;":"↫","&larrpl;":"⤹","&larrsim;":"⥳","&larrtl;":"↢","&lat;":"⪫","&latail;":"⤙","&late;":"⪭","&lates;":"⪭︀","&lbarr;":"⤌","&lbbrk;":"❲","&lbrace;":"{","&lbrack;":"[","&lbrke;":"⦋","&lbrksld;":"⦏","&lbrkslu;":"⦍","&lcaron;":"ľ","&lcedil;":"ļ","&lceil;":"⌈","&lcub;":"{","&lcy;":"л","&ldca;":"⤶","&ldquo;":"“","&ldquor;":"„","&ldrdhar;":"⥧","&ldrushar;":"⥋","&ldsh;":"↲","&le;":"≤","&leftarrow;":"←","&leftarrowtail;":"↢","&leftharpoondown;":"↽","&leftharpoonup;":"↼","&leftleftarrows;":"⇇","&leftrightarrow;":"↔","&leftrightarrows;":"⇆","&leftrightharpoons;":"⇋","&leftrightsquigarrow;":"↭","&leftthreetimes;":"⋋","&leg;":"⋚","&leq;":"≤","&leqq;":"≦","&leqslant;":"⩽","&les;":"⩽","&lescc;":"⪨","&lesdot;":"⩿","&lesdoto;":"⪁","&lesdotor;":"⪃","&lesg;":"⋚︀","&lesges;":"⪓","&lessapprox;":"⪅","&lessdot;":"⋖","&lesseqgtr;":"⋚","&lesseqqgtr;":"⪋","&lessgtr;":"≶","&lesssim;":"≲","&lfisht;":"⥼","&lfloor;":"⌊","&lfr;":"𝔩","&lg;":"≶","&lgE;":"⪑","&lhard;":"↽","&lharu;":"↼","&lharul;":"⥪","&lhblk;":"▄","&ljcy;":"љ","&ll;":"≪","&llarr;":"⇇","&llcorner;":"⌞","&llhard;":"⥫","&lltri;":"◺","&lmidot;":"ŀ","&lmoust;":"⎰","&lmoustache;":"⎰","&lnE;":"≨","&lnap;":"⪉","&lnapprox;":"⪉","&lne;":"⪇","&lneq;":"⪇","&lneqq;":"≨","&lnsim;":"⋦","&loang;":"⟬","&loarr;":"⇽","&lobrk;":"⟦","&longleftarrow;":"⟵","&longleftrightarrow;":"⟷","&longmapsto;":"⟼","&longrightarrow;":"⟶","&looparrowleft;":"↫","&looparrowright;":"↬","&lopar;":"⦅","&lopf;":"𝕝","&loplus;":"⨭","&lotimes;":"⨴","&lowast;":"∗","&lowbar;":"_","&loz;":"◊","&lozenge;":"◊","&lozf;":"⧫","&lpar;":"(","&lparlt;":"⦓","&lrarr;":"⇆","&lrcorner;":"⌟","&lrhar;":"⇋","&lrhard;":"⥭","&lrm;":"‎","&lrtri;":"⊿","&lsaquo;":"‹","&lscr;":"𝓁","&lsh;":"↰","&lsim;":"≲","&lsime;":"⪍","&lsimg;":"⪏","&lsqb;":"[","&lsquo;":"‘","&lsquor;":"‚","&lstrok;":"ł","&lt":"<","&lt;":"<","&ltcc;":"⪦","&ltcir;":"⩹","&ltdot;":"⋖","&lthree;":"⋋","&ltimes;":"⋉","&ltlarr;":"⥶","&ltquest;":"⩻","&ltrPar;":"⦖","&ltri;":"◃","&ltrie;":"⊴","&ltrif;":"◂","&lurdshar;":"⥊","&luruhar;":"⥦","&lvertneqq;":"≨︀","&lvnE;":"≨︀","&mDDot;":"∺","&macr":"¯","&macr;":"¯","&male;":"♂","&malt;":"✠","&maltese;":"✠","&map;":"↦","&mapsto;":"↦","&mapstodown;":"↧","&mapstoleft;":"↤","&mapstoup;":"↥","&marker;":"▮","&mcomma;":"⨩","&mcy;":"м","&mdash;":"—","&measuredangle;":"∡","&mfr;":"𝔪","&mho;":"℧","&micro":"µ","&micro;":"µ","&mid;":"∣","&midast;":"*","&midcir;":"⫰","&middot":"·","&middot;":"·","&minus;":"−","&minusb;":"⊟","&minusd;":"∸","&minusdu;":"⨪","&mlcp;":"⫛","&mldr;":"…","&mnplus;":"∓","&models;":"⊧","&mopf;":"𝕞","&mp;":"∓","&mscr;":"𝓂","&mstpos;":"∾","&mu;":"μ","&multimap;":"⊸","&mumap;":"⊸","&nGg;":"⋙̸","&nGt;":"≫⃒","&nGtv;":"≫̸","&nLeftarrow;":"⇍","&nLeftrightarrow;":"⇎","&nLl;":"⋘̸","&nLt;":"≪⃒","&nLtv;":"≪̸","&nRightarrow;":"⇏","&nVDash;":"⊯","&nVdash;":"⊮","&nabla;":"∇","&nacute;":"ń","&nang;":"∠⃒","&nap;":"≉","&napE;":"⩰̸","&napid;":"≋̸","&napos;":"ŉ","&napprox;":"≉","&natur;":"♮","&natural;":"♮","&naturals;":"ℕ","&nbsp":" ","&nbsp;":" ","&nbump;":"≎̸","&nbumpe;":"≏̸","&ncap;":"⩃","&ncaron;":"ň","&ncedil;":"ņ","&ncong;":"≇","&ncongdot;":"⩭̸","&ncup;":"⩂","&ncy;":"н","&ndash;":"–","&ne;":"≠","&neArr;":"⇗","&nearhk;":"⤤","&nearr;":"↗","&nearrow;":"↗","&nedot;":"≐̸","&nequiv;":"≢","&nesear;":"⤨","&nesim;":"≂̸","&nexist;":"∄","&nexists;":"∄","&nfr;":"𝔫","&ngE;":"≧̸","&nge;":"≱","&ngeq;":"≱","&ngeqq;":"≧̸","&ngeqslant;":"⩾̸","&nges;":"⩾̸","&ngsim;":"≵","&ngt;":"≯","&ngtr;":"≯","&nhArr;":"⇎","&nharr;":"↮","&nhpar;":"⫲","&ni;":"∋","&nis;":"⋼","&nisd;":"⋺","&niv;":"∋","&njcy;":"њ","&nlArr;":"⇍","&nlE;":"≦̸","&nlarr;":"↚","&nldr;":"‥","&nle;":"≰","&nleftarrow;":"↚","&nleftrightarrow;":"↮","&nleq;":"≰","&nleqq;":"≦̸","&nleqslant;":"⩽̸","&nles;":"⩽̸","&nless;":"≮","&nlsim;":"≴","&nlt;":"≮","&nltri;":"⋪","&nltrie;":"⋬","&nmid;":"∤","&nopf;":"𝕟","&not":"¬","&not;":"¬","&notin;":"∉","&notinE;":"⋹̸","&notindot;":"⋵̸","&notinva;":"∉","&notinvb;":"⋷","&notinvc;":"⋶","&notni;":"∌","&notniva;":"∌","&notnivb;":"⋾","&notnivc;":"⋽","&npar;":"∦","&nparallel;":"∦","&nparsl;":"⫽⃥","&npart;":"∂̸","&npolint;":"⨔","&npr;":"⊀","&nprcue;":"⋠","&npre;":"⪯̸","&nprec;":"⊀","&npreceq;":"⪯̸","&nrArr;":"⇏","&nrarr;":"↛","&nrarrc;":"⤳̸","&nrarrw;":"↝̸","&nrightarrow;":"↛","&nrtri;":"⋫","&nrtrie;":"⋭","&nsc;":"⊁","&nsccue;":"⋡","&nsce;":"⪰̸","&nscr;":"𝓃","&nshortmid;":"∤","&nshortparallel;":"∦","&nsim;":"≁","&nsime;":"≄","&nsimeq;":"≄","&nsmid;":"∤","&nspar;":"∦","&nsqsube;":"⋢","&nsqsupe;":"⋣","&nsub;":"⊄","&nsubE;":"⫅̸","&nsube;":"⊈","&nsubset;":"⊂⃒","&nsubseteq;":"⊈","&nsubseteqq;":"⫅̸","&nsucc;":"⊁","&nsucceq;":"⪰̸","&nsup;":"⊅","&nsupE;":"⫆̸","&nsupe;":"⊉","&nsupset;":"⊃⃒","&nsupseteq;":"⊉","&nsupseteqq;":"⫆̸","&ntgl;":"≹","&ntilde":"ñ","&ntilde;":"ñ","&ntlg;":"≸","&ntriangleleft;":"⋪","&ntrianglelefteq;":"⋬","&ntriangleright;":"⋫","&ntrianglerighteq;":"⋭","&nu;":"ν","&num;":"#","&numero;":"№","&numsp;":" ","&nvDash;":"⊭","&nvHarr;":"⤄","&nvap;":"≍⃒","&nvdash;":"⊬","&nvge;":"≥⃒","&nvgt;":">⃒","&nvinfin;":"⧞","&nvlArr;":"⤂","&nvle;":"≤⃒","&nvlt;":"<⃒","&nvltrie;":"⊴⃒","&nvrArr;":"⤃","&nvrtrie;":"⊵⃒","&nvsim;":"∼⃒","&nwArr;":"⇖","&nwarhk;":"⤣","&nwarr;":"↖","&nwarrow;":"↖","&nwnear;":"⤧","&oS;":"Ⓢ","&oacute":"ó","&oacute;":"ó","&oast;":"⊛","&ocir;":"⊚","&ocirc":"ô","&ocirc;":"ô","&ocy;":"о","&odash;":"⊝","&odblac;":"ő","&odiv;":"⨸","&odot;":"⊙","&odsold;":"⦼","&oelig;":"œ","&ofcir;":"⦿","&ofr;":"𝔬","&ogon;":"˛","&ograve":"ò","&ograve;":"ò","&ogt;":"⧁","&ohbar;":"⦵","&ohm;":"Ω","&oint;":"∮","&olarr;":"↺","&olcir;":"⦾","&olcross;":"⦻","&oline;":"‾","&olt;":"⧀","&omacr;":"ō","&omega;":"ω","&omicron;":"ο","&omid;":"⦶","&ominus;":"⊖","&oopf;":"𝕠","&opar;":"⦷","&operp;":"⦹","&oplus;":"⊕","&or;":"∨","&orarr;":"↻","&ord;":"⩝","&order;":"ℴ","&orderof;":"ℴ","&ordf":"ª","&ordf;":"ª","&ordm":"º","&ordm;":"º","&origof;":"⊶","&oror;":"⩖","&orslope;":"⩗","&orv;":"⩛","&oscr;":"ℴ","&oslash":"ø","&oslash;":"ø","&osol;":"⊘","&otilde":"õ","&otilde;":"õ","&otimes;":"⊗","&otimesas;":"⨶","&ouml":"ö","&ouml;":"ö","&ovbar;":"⌽","&par;":"∥","&para":"¶","&para;":"¶","&parallel;":"∥","&parsim;":"⫳","&parsl;":"⫽","&part;":"∂","&pcy;":"п","&percnt;":"%","&period;":".","&permil;":"‰","&perp;":"⊥","&pertenk;":"‱","&pfr;":"𝔭","&phi;":"φ","&phiv;":"ϕ","&phmmat;":"ℳ","&phone;":"☎","&pi;":"π","&pitchfork;":"⋔","&piv;":"ϖ","&planck;":"ℏ","&planckh;":"ℎ","&plankv;":"ℏ","&plus;":"+","&plusacir;":"⨣","&plusb;":"⊞","&pluscir;":"⨢","&plusdo;":"∔","&plusdu;":"⨥","&pluse;":"⩲","&plusmn":"±","&plusmn;":"±","&plussim;":"⨦","&plustwo;":"⨧","&pm;":"±","&pointint;":"⨕","&popf;":"𝕡","&pound":"£","&pound;":"£","&pr;":"≺","&prE;":"⪳","&prap;":"⪷","&prcue;":"≼","&pre;":"⪯","&prec;":"≺","&precapprox;":"⪷","&preccurlyeq;":"≼","&preceq;":"⪯","&precnapprox;":"⪹","&precneqq;":"⪵","&precnsim;":"⋨","&precsim;":"≾","&prime;":"′","&primes;":"ℙ","&prnE;":"⪵","&prnap;":"⪹","&prnsim;":"⋨","&prod;":"∏","&profalar;":"⌮","&profline;":"⌒","&profsurf;":"⌓","&prop;":"∝","&propto;":"∝","&prsim;":"≾","&prurel;":"⊰","&pscr;":"𝓅","&psi;":"ψ","&puncsp;":" ","&qfr;":"𝔮","&qint;":"⨌","&qopf;":"𝕢","&qprime;":"⁗","&qscr;":"𝓆","&quaternions;":"ℍ","&quatint;":"⨖","&quest;":"?","&questeq;":"≟","&quot":'"',"&quot;":'"',"&rAarr;":"⇛","&rArr;":"⇒","&rAtail;":"⤜","&rBarr;":"⤏","&rHar;":"⥤","&race;":"∽̱","&racute;":"ŕ","&radic;":"√","&raemptyv;":"⦳","&rang;":"⟩","&rangd;":"⦒","&range;":"⦥","&rangle;":"⟩","&raquo":"»","&raquo;":"»","&rarr;":"→","&rarrap;":"⥵","&rarrb;":"⇥","&rarrbfs;":"⤠","&rarrc;":"⤳","&rarrfs;":"⤞","&rarrhk;":"↪","&rarrlp;":"↬","&rarrpl;":"⥅","&rarrsim;":"⥴","&rarrtl;":"↣","&rarrw;":"↝","&ratail;":"⤚","&ratio;":"∶","&rationals;":"ℚ","&rbarr;":"⤍","&rbbrk;":"❳","&rbrace;":"}","&rbrack;":"]","&rbrke;":"⦌","&rbrksld;":"⦎","&rbrkslu;":"⦐","&rcaron;":"ř","&rcedil;":"ŗ","&rceil;":"⌉","&rcub;":"}","&rcy;":"р","&rdca;":"⤷","&rdldhar;":"⥩","&rdquo;":"”","&rdquor;":"”","&rdsh;":"↳","&real;":"ℜ","&realine;":"ℛ","&realpart;":"ℜ","&reals;":"ℝ","&rect;":"▭","&reg":"®","&reg;":"®","&rfisht;":"⥽","&rfloor;":"⌋","&rfr;":"𝔯","&rhard;":"⇁","&rharu;":"⇀","&rharul;":"⥬","&rho;":"ρ","&rhov;":"ϱ","&rightarrow;":"→","&rightarrowtail;":"↣","&rightharpoondown;":"⇁","&rightharpoonup;":"⇀","&rightleftarrows;":"⇄","&rightleftharpoons;":"⇌","&rightrightarrows;":"⇉","&rightsquigarrow;":"↝","&rightthreetimes;":"⋌","&ring;":"˚","&risingdotseq;":"≓","&rlarr;":"⇄","&rlhar;":"⇌","&rlm;":"‏","&rmoust;":"⎱","&rmoustache;":"⎱","&rnmid;":"⫮","&roang;":"⟭","&roarr;":"⇾","&robrk;":"⟧","&ropar;":"⦆","&ropf;":"𝕣","&roplus;":"⨮","&rotimes;":"⨵","&rpar;":")","&rpargt;":"⦔","&rppolint;":"⨒","&rrarr;":"⇉","&rsaquo;":"›","&rscr;":"𝓇","&rsh;":"↱","&rsqb;":"]","&rsquo;":"’","&rsquor;":"’","&rthree;":"⋌","&rtimes;":"⋊","&rtri;":"▹","&rtrie;":"⊵","&rtrif;":"▸","&rtriltri;":"⧎","&ruluhar;":"⥨","&rx;":"℞","&sacute;":"ś","&sbquo;":"‚","&sc;":"≻","&scE;":"⪴","&scap;":"⪸","&scaron;":"š","&sccue;":"≽","&sce;":"⪰","&scedil;":"ş","&scirc;":"ŝ","&scnE;":"⪶","&scnap;":"⪺","&scnsim;":"⋩","&scpolint;":"⨓","&scsim;":"≿","&scy;":"с","&sdot;":"⋅","&sdotb;":"⊡","&sdote;":"⩦","&seArr;":"⇘","&searhk;":"⤥","&searr;":"↘","&searrow;":"↘","&sect":"§","&sect;":"§","&semi;":";","&seswar;":"⤩","&setminus;":"∖","&setmn;":"∖","&sext;":"✶","&sfr;":"𝔰","&sfrown;":"⌢","&sharp;":"♯","&shchcy;":"щ","&shcy;":"ш","&shortmid;":"∣","&shortparallel;":"∥","&shy":"­","&shy;":"­","&sigma;":"σ","&sigmaf;":"ς","&sigmav;":"ς","&sim;":"∼","&simdot;":"⩪","&sime;":"≃","&simeq;":"≃","&simg;":"⪞","&simgE;":"⪠","&siml;":"⪝","&simlE;":"⪟","&simne;":"≆","&simplus;":"⨤","&simrarr;":"⥲","&slarr;":"←","&smallsetminus;":"∖","&smashp;":"⨳","&smeparsl;":"⧤","&smid;":"∣","&smile;":"⌣","&smt;":"⪪","&smte;":"⪬","&smtes;":"⪬︀","&softcy;":"ь","&sol;":"/","&solb;":"⧄","&solbar;":"⌿","&sopf;":"𝕤","&spades;":"♠","&spadesuit;":"♠","&spar;":"∥","&sqcap;":"⊓","&sqcaps;":"⊓︀","&sqcup;":"⊔","&sqcups;":"⊔︀","&sqsub;":"⊏","&sqsube;":"⊑","&sqsubset;":"⊏","&sqsubseteq;":"⊑","&sqsup;":"⊐","&sqsupe;":"⊒","&sqsupset;":"⊐","&sqsupseteq;":"⊒","&squ;":"□","&square;":"□","&squarf;":"▪","&squf;":"▪","&srarr;":"→","&sscr;":"𝓈","&ssetmn;":"∖","&ssmile;":"⌣","&sstarf;":"⋆","&star;":"☆","&starf;":"★","&straightepsilon;":"ϵ","&straightphi;":"ϕ","&strns;":"¯","&sub;":"⊂","&subE;":"⫅","&subdot;":"⪽","&sube;":"⊆","&subedot;":"⫃","&submult;":"⫁","&subnE;":"⫋","&subne;":"⊊","&subplus;":"⪿","&subrarr;":"⥹","&subset;":"⊂","&subseteq;":"⊆","&subseteqq;":"⫅","&subsetneq;":"⊊","&subsetneqq;":"⫋","&subsim;":"⫇","&subsub;":"⫕","&subsup;":"⫓","&succ;":"≻","&succapprox;":"⪸","&succcurlyeq;":"≽","&succeq;":"⪰","&succnapprox;":"⪺","&succneqq;":"⪶","&succnsim;":"⋩","&succsim;":"≿","&sum;":"∑","&sung;":"♪","&sup1":"¹","&sup1;":"¹","&sup2":"²","&sup2;":"²","&sup3":"³","&sup3;":"³","&sup;":"⊃","&supE;":"⫆","&supdot;":"⪾","&supdsub;":"⫘","&supe;":"⊇","&supedot;":"⫄","&suphsol;":"⟉","&suphsub;":"⫗","&suplarr;":"⥻","&supmult;":"⫂","&supnE;":"⫌","&supne;":"⊋","&supplus;":"⫀","&supset;":"⊃","&supseteq;":"⊇","&supseteqq;":"⫆","&supsetneq;":"⊋","&supsetneqq;":"⫌","&supsim;":"⫈","&supsub;":"⫔","&supsup;":"⫖","&swArr;":"⇙","&swarhk;":"⤦","&swarr;":"↙","&swarrow;":"↙","&swnwar;":"⤪","&szlig":"ß","&szlig;":"ß","&target;":"⌖","&tau;":"τ","&tbrk;":"⎴","&tcaron;":"ť","&tcedil;":"ţ","&tcy;":"т","&tdot;":"⃛","&telrec;":"⌕","&tfr;":"𝔱","&there4;":"∴","&therefore;":"∴","&theta;":"θ","&thetasym;":"ϑ","&thetav;":"ϑ","&thickapprox;":"≈","&thicksim;":"∼","&thinsp;":" ","&thkap;":"≈","&thksim;":"∼","&thorn":"þ","&thorn;":"þ","&tilde;":"˜","&times":"×","&times;":"×","&timesb;":"⊠","&timesbar;":"⨱","&timesd;":"⨰","&tint;":"∭","&toea;":"⤨","&top;":"⊤","&topbot;":"⌶","&topcir;":"⫱","&topf;":"𝕥","&topfork;":"⫚","&tosa;":"⤩","&tprime;":"‴","&trade;":"™","&triangle;":"▵","&triangledown;":"▿","&triangleleft;":"◃","&trianglelefteq;":"⊴","&triangleq;":"≜","&triangleright;":"▹","&trianglerighteq;":"⊵","&tridot;":"◬","&trie;":"≜","&triminus;":"⨺","&triplus;":"⨹","&trisb;":"⧍","&tritime;":"⨻","&trpezium;":"⏢","&tscr;":"𝓉","&tscy;":"ц","&tshcy;":"ћ","&tstrok;":"ŧ","&twixt;":"≬","&twoheadleftarrow;":"↞","&twoheadrightarrow;":"↠","&uArr;":"⇑","&uHar;":"⥣","&uacute":"ú","&uacute;":"ú","&uarr;":"↑","&ubrcy;":"ў","&ubreve;":"ŭ","&ucirc":"û","&ucirc;":"û","&ucy;":"у","&udarr;":"⇅","&udblac;":"ű","&udhar;":"⥮","&ufisht;":"⥾","&ufr;":"𝔲","&ugrave":"ù","&ugrave;":"ù","&uharl;":"↿","&uharr;":"↾","&uhblk;":"▀","&ulcorn;":"⌜","&ulcorner;":"⌜","&ulcrop;":"⌏","&ultri;":"◸","&umacr;":"ū","&uml":"¨","&uml;":"¨","&uogon;":"ų","&uopf;":"𝕦","&uparrow;":"↑","&updownarrow;":"↕","&upharpoonleft;":"↿","&upharpoonright;":"↾","&uplus;":"⊎","&upsi;":"υ","&upsih;":"ϒ","&upsilon;":"υ","&upuparrows;":"⇈","&urcorn;":"⌝","&urcorner;":"⌝","&urcrop;":"⌎","&uring;":"ů","&urtri;":"◹","&uscr;":"𝓊","&utdot;":"⋰","&utilde;":"ũ","&utri;":"▵","&utrif;":"▴","&uuarr;":"⇈","&uuml":"ü","&uuml;":"ü","&uwangle;":"⦧","&vArr;":"⇕","&vBar;":"⫨","&vBarv;":"⫩","&vDash;":"⊨","&vangrt;":"⦜","&varepsilon;":"ϵ","&varkappa;":"ϰ","&varnothing;":"∅","&varphi;":"ϕ","&varpi;":"ϖ","&varpropto;":"∝","&varr;":"↕","&varrho;":"ϱ","&varsigma;":"ς","&varsubsetneq;":"⊊︀","&varsubsetneqq;":"⫋︀","&varsupsetneq;":"⊋︀","&varsupsetneqq;":"⫌︀","&vartheta;":"ϑ","&vartriangleleft;":"⊲","&vartriangleright;":"⊳","&vcy;":"в","&vdash;":"⊢","&vee;":"∨","&veebar;":"⊻","&veeeq;":"≚","&vellip;":"⋮","&verbar;":"|","&vert;":"|","&vfr;":"𝔳","&vltri;":"⊲","&vnsub;":"⊂⃒","&vnsup;":"⊃⃒","&vopf;":"𝕧","&vprop;":"∝","&vrtri;":"⊳","&vscr;":"𝓋","&vsubnE;":"⫋︀","&vsubne;":"⊊︀","&vsupnE;":"⫌︀","&vsupne;":"⊋︀","&vzigzag;":"⦚","&wcirc;":"ŵ","&wedbar;":"⩟","&wedge;":"∧","&wedgeq;":"≙","&weierp;":"℘","&wfr;":"𝔴","&wopf;":"𝕨","&wp;":"℘","&wr;":"≀","&wreath;":"≀","&wscr;":"𝓌","&xcap;":"⋂","&xcirc;":"◯","&xcup;":"⋃","&xdtri;":"▽","&xfr;":"𝔵","&xhArr;":"⟺","&xharr;":"⟷","&xi;":"ξ","&xlArr;":"⟸","&xlarr;":"⟵","&xmap;":"⟼","&xnis;":"⋻","&xodot;":"⨀","&xopf;":"𝕩","&xoplus;":"⨁","&xotime;":"⨂","&xrArr;":"⟹","&xrarr;":"⟶","&xscr;":"𝓍","&xsqcup;":"⨆","&xuplus;":"⨄","&xutri;":"△","&xvee;":"⋁","&xwedge;":"⋀","&yacute":"ý","&yacute;":"ý","&yacy;":"я","&ycirc;":"ŷ","&ycy;":"ы","&yen":"¥","&yen;":"¥","&yfr;":"𝔶","&yicy;":"ї","&yopf;":"𝕪","&yscr;":"𝓎","&yucy;":"ю","&yuml":"ÿ","&yuml;":"ÿ","&zacute;":"ź","&zcaron;":"ž","&zcy;":"з","&zdot;":"ż","&zeetrf;":"ℨ","&zeta;":"ζ","&zfr;":"𝔷","&zhcy;":"ж","&zigrarr;":"⇝","&zopf;":"𝕫","&zscr;":"𝓏","&zwj;":"‍","&zwnj;":"‌"},characters:{"Æ":"&AElig;","&":"&amp;","Á":"&Aacute;","Ă":"&Abreve;","Â":"&Acirc;","А":"&Acy;","𝔄":"&Afr;","À":"&Agrave;","Α":"&Alpha;","Ā":"&Amacr;","⩓":"&And;","Ą":"&Aogon;","𝔸":"&Aopf;","⁡":"&af;","Å":"&angst;","𝒜":"&Ascr;","≔":"&coloneq;","Ã":"&Atilde;","Ä":"&Auml;","∖":"&ssetmn;","⫧":"&Barv;","⌆":"&doublebarwedge;","Б":"&Bcy;","∵":"&because;","ℬ":"&bernou;","Β":"&Beta;","𝔅":"&Bfr;","𝔹":"&Bopf;","˘":"&breve;","≎":"&bump;","Ч":"&CHcy;","©":"&copy;","Ć":"&Cacute;","⋒":"&Cap;","ⅅ":"&DD;","ℭ":"&Cfr;","Č":"&Ccaron;","Ç":"&Ccedil;","Ĉ":"&Ccirc;","∰":"&Cconint;","Ċ":"&Cdot;","¸":"&cedil;","·":"&middot;","Χ":"&Chi;","⊙":"&odot;","⊖":"&ominus;","⊕":"&oplus;","⊗":"&otimes;","∲":"&cwconint;","”":"&rdquor;","’":"&rsquor;","∷":"&Proportion;","⩴":"&Colone;","≡":"&equiv;","∯":"&DoubleContourIntegral;","∮":"&oint;","ℂ":"&complexes;","∐":"&coprod;","∳":"&awconint;","⨯":"&Cross;","𝒞":"&Cscr;","⋓":"&Cup;","≍":"&asympeq;","⤑":"&DDotrahd;","Ђ":"&DJcy;","Ѕ":"&DScy;","Џ":"&DZcy;","‡":"&ddagger;","↡":"&Darr;","⫤":"&DoubleLeftTee;","Ď":"&Dcaron;","Д":"&Dcy;","∇":"&nabla;","Δ":"&Delta;","𝔇":"&Dfr;","´":"&acute;","˙":"&dot;","˝":"&dblac;","`":"&grave;","˜":"&tilde;","⋄":"&diamond;","ⅆ":"&dd;","𝔻":"&Dopf;","¨":"&uml;","⃜":"&DotDot;","≐":"&esdot;","⇓":"&dArr;","⇐":"&lArr;","⇔":"&iff;","⟸":"&xlArr;","⟺":"&xhArr;","⟹":"&xrArr;","⇒":"&rArr;","⊨":"&vDash;","⇑":"&uArr;","⇕":"&vArr;","∥":"&spar;","↓":"&downarrow;","⤓":"&DownArrowBar;","⇵":"&duarr;","̑":"&DownBreve;","⥐":"&DownLeftRightVector;","⥞":"&DownLeftTeeVector;","↽":"&lhard;","⥖":"&DownLeftVectorBar;","⥟":"&DownRightTeeVector;","⇁":"&rightharpoondown;","⥗":"&DownRightVectorBar;","⊤":"&top;","↧":"&mapstodown;","𝒟":"&Dscr;","Đ":"&Dstrok;","Ŋ":"&ENG;","Ð":"&ETH;","É":"&Eacute;","Ě":"&Ecaron;","Ê":"&Ecirc;","Э":"&Ecy;","Ė":"&Edot;","𝔈":"&Efr;","È":"&Egrave;","∈":"&isinv;","Ē":"&Emacr;","◻":"&EmptySmallSquare;","▫":"&EmptyVerySmallSquare;","Ę":"&Eogon;","𝔼":"&Eopf;","Ε":"&Epsilon;","⩵":"&Equal;","≂":"&esim;","⇌":"&rlhar;","ℰ":"&expectation;","⩳":"&Esim;","Η":"&Eta;","Ë":"&Euml;","∃":"&exist;","ⅇ":"&exponentiale;","Ф":"&Fcy;","𝔉":"&Ffr;","◼":"&FilledSmallSquare;","▪":"&squf;","𝔽":"&Fopf;","∀":"&forall;","ℱ":"&Fscr;","Ѓ":"&GJcy;",">":"&gt;","Γ":"&Gamma;","Ϝ":"&Gammad;","Ğ":"&Gbreve;","Ģ":"&Gcedil;","Ĝ":"&Gcirc;","Г":"&Gcy;","Ġ":"&Gdot;","𝔊":"&Gfr;","⋙":"&ggg;","𝔾":"&Gopf;","≥":"&geq;","⋛":"&gtreqless;","≧":"&geqq;","⪢":"&GreaterGreater;","≷":"&gtrless;","⩾":"&ges;","≳":"&gtrsim;","𝒢":"&Gscr;","≫":"&gg;","Ъ":"&HARDcy;","ˇ":"&caron;","^":"&Hat;","Ĥ":"&Hcirc;","ℌ":"&Poincareplane;","ℋ":"&hamilt;","ℍ":"&quaternions;","─":"&boxh;","Ħ":"&Hstrok;","≏":"&bumpeq;","Е":"&IEcy;","Ĳ":"&IJlig;","Ё":"&IOcy;","Í":"&Iacute;","Î":"&Icirc;","И":"&Icy;","İ":"&Idot;","ℑ":"&imagpart;","Ì":"&Igrave;","Ī":"&Imacr;","ⅈ":"&ii;","∬":"&Int;","∫":"&int;","⋂":"&xcap;","⁣":"&ic;","⁢":"&it;","Į":"&Iogon;","𝕀":"&Iopf;","Ι":"&Iota;","ℐ":"&imagline;","Ĩ":"&Itilde;","І":"&Iukcy;","Ï":"&Iuml;","Ĵ":"&Jcirc;","Й":"&Jcy;","𝔍":"&Jfr;","𝕁":"&Jopf;","𝒥":"&Jscr;","Ј":"&Jsercy;","Є":"&Jukcy;","Х":"&KHcy;","Ќ":"&KJcy;","Κ":"&Kappa;","Ķ":"&Kcedil;","К":"&Kcy;","𝔎":"&Kfr;","𝕂":"&Kopf;","𝒦":"&Kscr;","Љ":"&LJcy;","<":"&lt;","Ĺ":"&Lacute;","Λ":"&Lambda;","⟪":"&Lang;","ℒ":"&lagran;","↞":"&twoheadleftarrow;","Ľ":"&Lcaron;","Ļ":"&Lcedil;","Л":"&Lcy;","⟨":"&langle;","←":"&slarr;","⇤":"&larrb;","⇆":"&lrarr;","⌈":"&lceil;","⟦":"&lobrk;","⥡":"&LeftDownTeeVector;","⇃":"&downharpoonleft;","⥙":"&LeftDownVectorBar;","⌊":"&lfloor;","↔":"&leftrightarrow;","⥎":"&LeftRightVector;","⊣":"&dashv;","↤":"&mapstoleft;","⥚":"&LeftTeeVector;","⊲":"&vltri;","⧏":"&LeftTriangleBar;","⊴":"&trianglelefteq;","⥑":"&LeftUpDownVector;","⥠":"&LeftUpTeeVector;","↿":"&upharpoonleft;","⥘":"&LeftUpVectorBar;","↼":"&lharu;","⥒":"&LeftVectorBar;","⋚":"&lesseqgtr;","≦":"&leqq;","≶":"&lg;","⪡":"&LessLess;","⩽":"&les;","≲":"&lsim;","𝔏":"&Lfr;","⋘":"&Ll;","⇚":"&lAarr;","Ŀ":"&Lmidot;","⟵":"&xlarr;","⟷":"&xharr;","⟶":"&xrarr;","𝕃":"&Lopf;","↙":"&swarrow;","↘":"&searrow;","↰":"&lsh;","Ł":"&Lstrok;","≪":"&ll;","⤅":"&Map;","М":"&Mcy;"," ":"&MediumSpace;","ℳ":"&phmmat;","𝔐":"&Mfr;","∓":"&mp;","𝕄":"&Mopf;","Μ":"&Mu;","Њ":"&NJcy;","Ń":"&Nacute;","Ň":"&Ncaron;","Ņ":"&Ncedil;","Н":"&Ncy;","​":"&ZeroWidthSpace;","\n":"&NewLine;","𝔑":"&Nfr;","⁠":"&NoBreak;"," ":"&nbsp;","ℕ":"&naturals;","⫬":"&Not;","≢":"&nequiv;","≭":"&NotCupCap;","∦":"&nspar;","∉":"&notinva;","≠":"&ne;","≂̸":"&nesim;","∄":"&nexists;","≯":"&ngtr;","≱":"&ngeq;","≧̸":"&ngeqq;","≫̸":"&nGtv;","≹":"&ntgl;","⩾̸":"&nges;","≵":"&ngsim;","≎̸":"&nbump;","≏̸":"&nbumpe;","⋪":"&ntriangleleft;","⧏̸":"&NotLeftTriangleBar;","⋬":"&ntrianglelefteq;","≮":"&nlt;","≰":"&nleq;","≸":"&ntlg;","≪̸":"&nLtv;","⩽̸":"&nles;","≴":"&nlsim;","⪢̸":"&NotNestedGreaterGreater;","⪡̸":"&NotNestedLessLess;","⊀":"&nprec;","⪯̸":"&npreceq;","⋠":"&nprcue;","∌":"&notniva;","⋫":"&ntriangleright;","⧐̸":"&NotRightTriangleBar;","⋭":"&ntrianglerighteq;","⊏̸":"&NotSquareSubset;","⋢":"&nsqsube;","⊐̸":"&NotSquareSuperset;","⋣":"&nsqsupe;","⊂⃒":"&vnsub;","⊈":"&nsubseteq;","⊁":"&nsucc;","⪰̸":"&nsucceq;","⋡":"&nsccue;","≿̸":"&NotSucceedsTilde;","⊃⃒":"&vnsup;","⊉":"&nsupseteq;","≁":"&nsim;","≄":"&nsimeq;","≇":"&ncong;","≉":"&napprox;","∤":"&nsmid;","𝒩":"&Nscr;","Ñ":"&Ntilde;","Ν":"&Nu;","Œ":"&OElig;","Ó":"&Oacute;","Ô":"&Ocirc;","О":"&Ocy;","Ő":"&Odblac;","𝔒":"&Ofr;","Ò":"&Ograve;","Ō":"&Omacr;","Ω":"&ohm;","Ο":"&Omicron;","𝕆":"&Oopf;","“":"&ldquo;","‘":"&lsquo;","⩔":"&Or;","𝒪":"&Oscr;","Ø":"&Oslash;","Õ":"&Otilde;","⨷":"&Otimes;","Ö":"&Ouml;","‾":"&oline;","⏞":"&OverBrace;","⎴":"&tbrk;","⏜":"&OverParenthesis;","∂":"&part;","П":"&Pcy;","𝔓":"&Pfr;","Φ":"&Phi;","Π":"&Pi;","±":"&pm;","ℙ":"&primes;","⪻":"&Pr;","≺":"&prec;","⪯":"&preceq;","≼":"&preccurlyeq;","≾":"&prsim;","″":"&Prime;","∏":"&prod;","∝":"&vprop;","𝒫":"&Pscr;","Ψ":"&Psi;",'"':"&quot;","𝔔":"&Qfr;","ℚ":"&rationals;","𝒬":"&Qscr;","⤐":"&drbkarow;","®":"&reg;","Ŕ":"&Racute;","⟫":"&Rang;","↠":"&twoheadrightarrow;","⤖":"&Rarrtl;","Ř":"&Rcaron;","Ŗ":"&Rcedil;","Р":"&Rcy;","ℜ":"&realpart;","∋":"&niv;","⇋":"&lrhar;","⥯":"&duhar;","Ρ":"&Rho;","⟩":"&rangle;","→":"&srarr;","⇥":"&rarrb;","⇄":"&rlarr;","⌉":"&rceil;","⟧":"&robrk;","⥝":"&RightDownTeeVector;","⇂":"&downharpoonright;","⥕":"&RightDownVectorBar;","⌋":"&rfloor;","⊢":"&vdash;","↦":"&mapsto;","⥛":"&RightTeeVector;","⊳":"&vrtri;","⧐":"&RightTriangleBar;","⊵":"&trianglerighteq;","⥏":"&RightUpDownVector;","⥜":"&RightUpTeeVector;","↾":"&upharpoonright;","⥔":"&RightUpVectorBar;","⇀":"&rightharpoonup;","⥓":"&RightVectorBar;","ℝ":"&reals;","⥰":"&RoundImplies;","⇛":"&rAarr;","ℛ":"&realine;","↱":"&rsh;","⧴":"&RuleDelayed;","Щ":"&SHCHcy;","Ш":"&SHcy;","Ь":"&SOFTcy;","Ś":"&Sacute;","⪼":"&Sc;","Š":"&Scaron;","Ş":"&Scedil;","Ŝ":"&Scirc;","С":"&Scy;","𝔖":"&Sfr;","↑":"&uparrow;","Σ":"&Sigma;","∘":"&compfn;","𝕊":"&Sopf;","√":"&radic;","□":"&square;","⊓":"&sqcap;","⊏":"&sqsubset;","⊑":"&sqsubseteq;","⊐":"&sqsupset;","⊒":"&sqsupseteq;","⊔":"&sqcup;","𝒮":"&Sscr;","⋆":"&sstarf;","⋐":"&Subset;","⊆":"&subseteq;","≻":"&succ;","⪰":"&succeq;","≽":"&succcurlyeq;","≿":"&succsim;","∑":"&sum;","⋑":"&Supset;","⊃":"&supset;","⊇":"&supseteq;","Þ":"&THORN;","™":"&trade;","Ћ":"&TSHcy;","Ц":"&TScy;","\t":"&Tab;","Τ":"&Tau;","Ť":"&Tcaron;","Ţ":"&Tcedil;","Т":"&Tcy;","𝔗":"&Tfr;","∴":"&therefore;","Θ":"&Theta;","  ":"&ThickSpace;"," ":"&thinsp;","∼":"&thksim;","≃":"&simeq;","≅":"&cong;","≈":"&thkap;","𝕋":"&Topf;","⃛":"&tdot;","𝒯":"&Tscr;","Ŧ":"&Tstrok;","Ú":"&Uacute;","↟":"&Uarr;","⥉":"&Uarrocir;","Ў":"&Ubrcy;","Ŭ":"&Ubreve;","Û":"&Ucirc;","У":"&Ucy;","Ű":"&Udblac;","𝔘":"&Ufr;","Ù":"&Ugrave;","Ū":"&Umacr;",_:"&lowbar;","⏟":"&UnderBrace;","⎵":"&bbrk;","⏝":"&UnderParenthesis;","⋃":"&xcup;","⊎":"&uplus;","Ų":"&Uogon;","𝕌":"&Uopf;","⤒":"&UpArrowBar;","⇅":"&udarr;","↕":"&varr;","⥮":"&udhar;","⊥":"&perp;","↥":"&mapstoup;","↖":"&nwarrow;","↗":"&nearrow;","ϒ":"&upsih;","Υ":"&Upsilon;","Ů":"&Uring;","𝒰":"&Uscr;","Ũ":"&Utilde;","Ü":"&Uuml;","⊫":"&VDash;","⫫":"&Vbar;","В":"&Vcy;","⊩":"&Vdash;","⫦":"&Vdashl;","⋁":"&xvee;","‖":"&Vert;","∣":"&smid;","|":"&vert;","❘":"&VerticalSeparator;","≀":"&wreath;"," ":"&hairsp;","𝔙":"&Vfr;","𝕍":"&Vopf;","𝒱":"&Vscr;","⊪":"&Vvdash;","Ŵ":"&Wcirc;","⋀":"&xwedge;","𝔚":"&Wfr;","𝕎":"&Wopf;","𝒲":"&Wscr;","𝔛":"&Xfr;","Ξ":"&Xi;","𝕏":"&Xopf;","𝒳":"&Xscr;","Я":"&YAcy;","Ї":"&YIcy;","Ю":"&YUcy;","Ý":"&Yacute;","Ŷ":"&Ycirc;","Ы":"&Ycy;","𝔜":"&Yfr;","𝕐":"&Yopf;","𝒴":"&Yscr;","Ÿ":"&Yuml;","Ж":"&ZHcy;","Ź":"&Zacute;","Ž":"&Zcaron;","З":"&Zcy;","Ż":"&Zdot;","Ζ":"&Zeta;","ℨ":"&zeetrf;","ℤ":"&integers;","𝒵":"&Zscr;","á":"&aacute;","ă":"&abreve;","∾":"&mstpos;","∾̳":"&acE;","∿":"&acd;","â":"&acirc;","а":"&acy;","æ":"&aelig;","𝔞":"&afr;","à":"&agrave;","ℵ":"&aleph;","α":"&alpha;","ā":"&amacr;","⨿":"&amalg;","∧":"&wedge;","⩕":"&andand;","⩜":"&andd;","⩘":"&andslope;","⩚":"&andv;","∠":"&angle;","⦤":"&ange;","∡":"&measuredangle;","⦨":"&angmsdaa;","⦩":"&angmsdab;","⦪":"&angmsdac;","⦫":"&angmsdad;","⦬":"&angmsdae;","⦭":"&angmsdaf;","⦮":"&angmsdag;","⦯":"&angmsdah;","∟":"&angrt;","⊾":"&angrtvb;","⦝":"&angrtvbd;","∢":"&angsph;","⍼":"&angzarr;","ą":"&aogon;","𝕒":"&aopf;","⩰":"&apE;","⩯":"&apacir;","≊":"&approxeq;","≋":"&apid;","'":"&apos;","å":"&aring;","𝒶":"&ascr;","*":"&midast;","ã":"&atilde;","ä":"&auml;","⨑":"&awint;","⫭":"&bNot;","≌":"&bcong;","϶":"&bepsi;","‵":"&bprime;","∽":"&bsim;","⋍":"&bsime;","⊽":"&barvee;","⌅":"&barwedge;","⎶":"&bbrktbrk;","б":"&bcy;","„":"&ldquor;","⦰":"&bemptyv;","β":"&beta;","ℶ":"&beth;","≬":"&twixt;","𝔟":"&bfr;","◯":"&xcirc;","⨀":"&xodot;","⨁":"&xoplus;","⨂":"&xotime;","⨆":"&xsqcup;","★":"&starf;","▽":"&xdtri;","△":"&xutri;","⨄":"&xuplus;","⤍":"&rbarr;","⧫":"&lozf;","▴":"&utrif;","▾":"&dtrif;","◂":"&ltrif;","▸":"&rtrif;","␣":"&blank;","▒":"&blk12;","░":"&blk14;","▓":"&blk34;","█":"&block;","=⃥":"&bne;","≡⃥":"&bnequiv;","⌐":"&bnot;","𝕓":"&bopf;","⋈":"&bowtie;","╗":"&boxDL;","╔":"&boxDR;","╖":"&boxDl;","╓":"&boxDr;","═":"&boxH;","╦":"&boxHD;","╩":"&boxHU;","╤":"&boxHd;","╧":"&boxHu;","╝":"&boxUL;","╚":"&boxUR;","╜":"&boxUl;","╙":"&boxUr;","║":"&boxV;","╬":"&boxVH;","╣":"&boxVL;","╠":"&boxVR;","╫":"&boxVh;","╢":"&boxVl;","╟":"&boxVr;","⧉":"&boxbox;","╕":"&boxdL;","╒":"&boxdR;","┐":"&boxdl;","┌":"&boxdr;","╥":"&boxhD;","╨":"&boxhU;","┬":"&boxhd;","┴":"&boxhu;","⊟":"&minusb;","⊞":"&plusb;","⊠":"&timesb;","╛":"&boxuL;","╘":"&boxuR;","┘":"&boxul;","└":"&boxur;","│":"&boxv;","╪":"&boxvH;","╡":"&boxvL;","╞":"&boxvR;","┼":"&boxvh;","┤":"&boxvl;","├":"&boxvr;","¦":"&brvbar;","𝒷":"&bscr;","⁏":"&bsemi;","\\":"&bsol;","⧅":"&bsolb;","⟈":"&bsolhsub;","•":"&bullet;","⪮":"&bumpE;","ć":"&cacute;","∩":"&cap;","⩄":"&capand;","⩉":"&capbrcup;","⩋":"&capcap;","⩇":"&capcup;","⩀":"&capdot;","∩︀":"&caps;","⁁":"&caret;","⩍":"&ccaps;","č":"&ccaron;","ç":"&ccedil;","ĉ":"&ccirc;","⩌":"&ccups;","⩐":"&ccupssm;","ċ":"&cdot;","⦲":"&cemptyv;","¢":"&cent;","𝔠":"&cfr;","ч":"&chcy;","✓":"&checkmark;","χ":"&chi;","○":"&cir;","⧃":"&cirE;","ˆ":"&circ;","≗":"&cire;","↺":"&olarr;","↻":"&orarr;","Ⓢ":"&oS;","⊛":"&oast;","⊚":"&ocir;","⊝":"&odash;","⨐":"&cirfnint;","⫯":"&cirmid;","⧂":"&cirscir;","♣":"&clubsuit;",":":"&colon;",",":"&comma;","@":"&commat;","∁":"&complement;","⩭":"&congdot;","𝕔":"&copf;","℗":"&copysr;","↵":"&crarr;","✗":"&cross;","𝒸":"&cscr;","⫏":"&csub;","⫑":"&csube;","⫐":"&csup;","⫒":"&csupe;","⋯":"&ctdot;","⤸":"&cudarrl;","⤵":"&cudarrr;","⋞":"&curlyeqprec;","⋟":"&curlyeqsucc;","↶":"&curvearrowleft;","⤽":"&cularrp;","∪":"&cup;","⩈":"&cupbrcap;","⩆":"&cupcap;","⩊":"&cupcup;","⊍":"&cupdot;","⩅":"&cupor;","∪︀":"&cups;","↷":"&curvearrowright;","⤼":"&curarrm;","⋎":"&cuvee;","⋏":"&cuwed;","¤":"&curren;","∱":"&cwint;","⌭":"&cylcty;","⥥":"&dHar;","†":"&dagger;","ℸ":"&daleth;","‐":"&hyphen;","⤏":"&rBarr;","ď":"&dcaron;","д":"&dcy;","⇊":"&downdownarrows;","⩷":"&eDDot;","°":"&deg;","δ":"&delta;","⦱":"&demptyv;","⥿":"&dfisht;","𝔡":"&dfr;","♦":"&diams;","ϝ":"&gammad;","⋲":"&disin;","÷":"&divide;","⋇":"&divonx;","ђ":"&djcy;","⌞":"&llcorner;","⌍":"&dlcrop;",$:"&dollar;","𝕕":"&dopf;","≑":"&eDot;","∸":"&minusd;","∔":"&plusdo;","⊡":"&sdotb;","⌟":"&lrcorner;","⌌":"&drcrop;","𝒹":"&dscr;","ѕ":"&dscy;","⧶":"&dsol;","đ":"&dstrok;","⋱":"&dtdot;","▿":"&triangledown;","⦦":"&dwangle;","џ":"&dzcy;","⟿":"&dzigrarr;","é":"&eacute;","⩮":"&easter;","ě":"&ecaron;","≖":"&eqcirc;","ê":"&ecirc;","≕":"&eqcolon;","э":"&ecy;","ė":"&edot;","≒":"&fallingdotseq;","𝔢":"&efr;","⪚":"&eg;","è":"&egrave;","⪖":"&eqslantgtr;","⪘":"&egsdot;","⪙":"&el;","⏧":"&elinters;","ℓ":"&ell;","⪕":"&eqslantless;","⪗":"&elsdot;","ē":"&emacr;","∅":"&varnothing;"," ":"&emsp13;"," ":"&emsp14;"," ":"&emsp;","ŋ":"&eng;"," ":"&ensp;","ę":"&eogon;","𝕖":"&eopf;","⋕":"&epar;","⧣":"&eparsl;","⩱":"&eplus;","ε":"&epsilon;","ϵ":"&varepsilon;","=":"&equals;","≟":"&questeq;","⩸":"&equivDD;","⧥":"&eqvparsl;","≓":"&risingdotseq;","⥱":"&erarr;","ℯ":"&escr;","η":"&eta;","ð":"&eth;","ë":"&euml;","€":"&euro;","!":"&excl;","ф":"&fcy;","♀":"&female;","ﬃ":"&ffilig;","ﬀ":"&fflig;","ﬄ":"&ffllig;","𝔣":"&ffr;","ﬁ":"&filig;",fj:"&fjlig;","♭":"&flat;","ﬂ":"&fllig;","▱":"&fltns;","ƒ":"&fnof;","𝕗":"&fopf;","⋔":"&pitchfork;","⫙":"&forkv;","⨍":"&fpartint;","½":"&half;","⅓":"&frac13;","¼":"&frac14;","⅕":"&frac15;","⅙":"&frac16;","⅛":"&frac18;","⅔":"&frac23;","⅖":"&frac25;","¾":"&frac34;","⅗":"&frac35;","⅜":"&frac38;","⅘":"&frac45;","⅚":"&frac56;","⅝":"&frac58;","⅞":"&frac78;","⁄":"&frasl;","⌢":"&sfrown;","𝒻":"&fscr;","⪌":"&gtreqqless;","ǵ":"&gacute;","γ":"&gamma;","⪆":"&gtrapprox;","ğ":"&gbreve;","ĝ":"&gcirc;","г":"&gcy;","ġ":"&gdot;","⪩":"&gescc;","⪀":"&gesdot;","⪂":"&gesdoto;","⪄":"&gesdotol;","⋛︀":"&gesl;","⪔":"&gesles;","𝔤":"&gfr;","ℷ":"&gimel;","ѓ":"&gjcy;","⪒":"&glE;","⪥":"&gla;","⪤":"&glj;","≩":"&gneqq;","⪊":"&gnapprox;","⪈":"&gneq;","⋧":"&gnsim;","𝕘":"&gopf;","ℊ":"&gscr;","⪎":"&gsime;","⪐":"&gsiml;","⪧":"&gtcc;","⩺":"&gtcir;","⋗":"&gtrdot;","⦕":"&gtlPar;","⩼":"&gtquest;","⥸":"&gtrarr;","≩︀":"&gvnE;","ъ":"&hardcy;","⥈":"&harrcir;","↭":"&leftrightsquigarrow;","ℏ":"&plankv;","ĥ":"&hcirc;","♥":"&heartsuit;","…":"&mldr;","⊹":"&hercon;","𝔥":"&hfr;","⤥":"&searhk;","⤦":"&swarhk;","⇿":"&hoarr;","∻":"&homtht;","↩":"&larrhk;","↪":"&rarrhk;","𝕙":"&hopf;","―":"&horbar;","𝒽":"&hscr;","ħ":"&hstrok;","⁃":"&hybull;","í":"&iacute;","î":"&icirc;","и":"&icy;","е":"&iecy;","¡":"&iexcl;","𝔦":"&ifr;","ì":"&igrave;","⨌":"&qint;","∭":"&tint;","⧜":"&iinfin;","℩":"&iiota;","ĳ":"&ijlig;","ī":"&imacr;","ı":"&inodot;","⊷":"&imof;","Ƶ":"&imped;","℅":"&incare;","∞":"&infin;","⧝":"&infintie;","⊺":"&intercal;","⨗":"&intlarhk;","⨼":"&iprod;","ё":"&iocy;","į":"&iogon;","𝕚":"&iopf;","ι":"&iota;","¿":"&iquest;","𝒾":"&iscr;","⋹":"&isinE;","⋵":"&isindot;","⋴":"&isins;","⋳":"&isinsv;","ĩ":"&itilde;","і":"&iukcy;","ï":"&iuml;","ĵ":"&jcirc;","й":"&jcy;","𝔧":"&jfr;","ȷ":"&jmath;","𝕛":"&jopf;","𝒿":"&jscr;","ј":"&jsercy;","є":"&jukcy;","κ":"&kappa;","ϰ":"&varkappa;","ķ":"&kcedil;","к":"&kcy;","𝔨":"&kfr;","ĸ":"&kgreen;","х":"&khcy;","ќ":"&kjcy;","𝕜":"&kopf;","𝓀":"&kscr;","⤛":"&lAtail;","⤎":"&lBarr;","⪋":"&lesseqqgtr;","⥢":"&lHar;","ĺ":"&lacute;","⦴":"&laemptyv;","λ":"&lambda;","⦑":"&langd;","⪅":"&lessapprox;","«":"&laquo;","⤟":"&larrbfs;","⤝":"&larrfs;","↫":"&looparrowleft;","⤹":"&larrpl;","⥳":"&larrsim;","↢":"&leftarrowtail;","⪫":"&lat;","⤙":"&latail;","⪭":"&late;","⪭︀":"&lates;","⤌":"&lbarr;","❲":"&lbbrk;","{":"&lcub;","[":"&lsqb;","⦋":"&lbrke;","⦏":"&lbrksld;","⦍":"&lbrkslu;","ľ":"&lcaron;","ļ":"&lcedil;","л":"&lcy;","⤶":"&ldca;","⥧":"&ldrdhar;","⥋":"&ldrushar;","↲":"&ldsh;","≤":"&leq;","⇇":"&llarr;","⋋":"&lthree;","⪨":"&lescc;","⩿":"&lesdot;","⪁":"&lesdoto;","⪃":"&lesdotor;","⋚︀":"&lesg;","⪓":"&lesges;","⋖":"&ltdot;","⥼":"&lfisht;","𝔩":"&lfr;","⪑":"&lgE;","⥪":"&lharul;","▄":"&lhblk;","љ":"&ljcy;","⥫":"&llhard;","◺":"&lltri;","ŀ":"&lmidot;","⎰":"&lmoustache;","≨":"&lneqq;","⪉":"&lnapprox;","⪇":"&lneq;","⋦":"&lnsim;","⟬":"&loang;","⇽":"&loarr;","⟼":"&xmap;","↬":"&rarrlp;","⦅":"&lopar;","𝕝":"&lopf;","⨭":"&loplus;","⨴":"&lotimes;","∗":"&lowast;","◊":"&lozenge;","(":"&lpar;","⦓":"&lparlt;","⥭":"&lrhard;","‎":"&lrm;","⊿":"&lrtri;","‹":"&lsaquo;","𝓁":"&lscr;","⪍":"&lsime;","⪏":"&lsimg;","‚":"&sbquo;","ł":"&lstrok;","⪦":"&ltcc;","⩹":"&ltcir;","⋉":"&ltimes;","⥶":"&ltlarr;","⩻":"&ltquest;","⦖":"&ltrPar;","◃":"&triangleleft;","⥊":"&lurdshar;","⥦":"&luruhar;","≨︀":"&lvnE;","∺":"&mDDot;","¯":"&strns;","♂":"&male;","✠":"&maltese;","▮":"&marker;","⨩":"&mcomma;","м":"&mcy;","—":"&mdash;","𝔪":"&mfr;","℧":"&mho;","µ":"&micro;","⫰":"&midcir;","−":"&minus;","⨪":"&minusdu;","⫛":"&mlcp;","⊧":"&models;","𝕞":"&mopf;","𝓂":"&mscr;","μ":"&mu;","⊸":"&mumap;","⋙̸":"&nGg;","≫⃒":"&nGt;","⇍":"&nlArr;","⇎":"&nhArr;","⋘̸":"&nLl;","≪⃒":"&nLt;","⇏":"&nrArr;","⊯":"&nVDash;","⊮":"&nVdash;","ń":"&nacute;","∠⃒":"&nang;","⩰̸":"&napE;","≋̸":"&napid;","ŉ":"&napos;","♮":"&natural;","⩃":"&ncap;","ň":"&ncaron;","ņ":"&ncedil;","⩭̸":"&ncongdot;","⩂":"&ncup;","н":"&ncy;","–":"&ndash;","⇗":"&neArr;","⤤":"&nearhk;","≐̸":"&nedot;","⤨":"&toea;","𝔫":"&nfr;","↮":"&nleftrightarrow;","⫲":"&nhpar;","⋼":"&nis;","⋺":"&nisd;","њ":"&njcy;","≦̸":"&nleqq;","↚":"&nleftarrow;","‥":"&nldr;","𝕟":"&nopf;","¬":"&not;","⋹̸":"&notinE;","⋵̸":"&notindot;","⋷":"&notinvb;","⋶":"&notinvc;","⋾":"&notnivb;","⋽":"&notnivc;","⫽⃥":"&nparsl;","∂̸":"&npart;","⨔":"&npolint;","↛":"&nrightarrow;","⤳̸":"&nrarrc;","↝̸":"&nrarrw;","𝓃":"&nscr;","⊄":"&nsub;","⫅̸":"&nsubseteqq;","⊅":"&nsup;","⫆̸":"&nsupseteqq;","ñ":"&ntilde;","ν":"&nu;","#":"&num;","№":"&numero;"," ":"&numsp;","⊭":"&nvDash;","⤄":"&nvHarr;","≍⃒":"&nvap;","⊬":"&nvdash;","≥⃒":"&nvge;",">⃒":"&nvgt;","⧞":"&nvinfin;","⤂":"&nvlArr;","≤⃒":"&nvle;","<⃒":"&nvlt;","⊴⃒":"&nvltrie;","⤃":"&nvrArr;","⊵⃒":"&nvrtrie;","∼⃒":"&nvsim;","⇖":"&nwArr;","⤣":"&nwarhk;","⤧":"&nwnear;","ó":"&oacute;","ô":"&ocirc;","о":"&ocy;","ő":"&odblac;","⨸":"&odiv;","⦼":"&odsold;","œ":"&oelig;","⦿":"&ofcir;","𝔬":"&ofr;","˛":"&ogon;","ò":"&ograve;","⧁":"&ogt;","⦵":"&ohbar;","⦾":"&olcir;","⦻":"&olcross;","⧀":"&olt;","ō":"&omacr;","ω":"&omega;","ο":"&omicron;","⦶":"&omid;","𝕠":"&oopf;","⦷":"&opar;","⦹":"&operp;","∨":"&vee;","⩝":"&ord;","ℴ":"&oscr;","ª":"&ordf;","º":"&ordm;","⊶":"&origof;","⩖":"&oror;","⩗":"&orslope;","⩛":"&orv;","ø":"&oslash;","⊘":"&osol;","õ":"&otilde;","⨶":"&otimesas;","ö":"&ouml;","⌽":"&ovbar;","¶":"&para;","⫳":"&parsim;","⫽":"&parsl;","п":"&pcy;","%":"&percnt;",".":"&period;","‰":"&permil;","‱":"&pertenk;","𝔭":"&pfr;","φ":"&phi;","ϕ":"&varphi;","☎":"&phone;","π":"&pi;","ϖ":"&varpi;","ℎ":"&planckh;","+":"&plus;","⨣":"&plusacir;","⨢":"&pluscir;","⨥":"&plusdu;","⩲":"&pluse;","⨦":"&plussim;","⨧":"&plustwo;","⨕":"&pointint;","𝕡":"&popf;","£":"&pound;","⪳":"&prE;","⪷":"&precapprox;","⪹":"&prnap;","⪵":"&prnE;","⋨":"&prnsim;","′":"&prime;","⌮":"&profalar;","⌒":"&profline;","⌓":"&profsurf;","⊰":"&prurel;","𝓅":"&pscr;","ψ":"&psi;"," ":"&puncsp;","𝔮":"&qfr;","𝕢":"&qopf;","⁗":"&qprime;","𝓆":"&qscr;","⨖":"&quatint;","?":"&quest;","⤜":"&rAtail;","⥤":"&rHar;","∽̱":"&race;","ŕ":"&racute;","⦳":"&raemptyv;","⦒":"&rangd;","⦥":"&range;","»":"&raquo;","⥵":"&rarrap;","⤠":"&rarrbfs;","⤳":"&rarrc;","⤞":"&rarrfs;","⥅":"&rarrpl;","⥴":"&rarrsim;","↣":"&rightarrowtail;","↝":"&rightsquigarrow;","⤚":"&ratail;","∶":"&ratio;","❳":"&rbbrk;","}":"&rcub;","]":"&rsqb;","⦌":"&rbrke;","⦎":"&rbrksld;","⦐":"&rbrkslu;","ř":"&rcaron;","ŗ":"&rcedil;","р":"&rcy;","⤷":"&rdca;","⥩":"&rdldhar;","↳":"&rdsh;","▭":"&rect;","⥽":"&rfisht;","𝔯":"&rfr;","⥬":"&rharul;","ρ":"&rho;","ϱ":"&varrho;","⇉":"&rrarr;","⋌":"&rthree;","˚":"&ring;","‏":"&rlm;","⎱":"&rmoustache;","⫮":"&rnmid;","⟭":"&roang;","⇾":"&roarr;","⦆":"&ropar;","𝕣":"&ropf;","⨮":"&roplus;","⨵":"&rotimes;",")":"&rpar;","⦔":"&rpargt;","⨒":"&rppolint;","›":"&rsaquo;","𝓇":"&rscr;","⋊":"&rtimes;","▹":"&triangleright;","⧎":"&rtriltri;","⥨":"&ruluhar;","℞":"&rx;","ś":"&sacute;","⪴":"&scE;","⪸":"&succapprox;","š":"&scaron;","ş":"&scedil;","ŝ":"&scirc;","⪶":"&succneqq;","⪺":"&succnapprox;","⋩":"&succnsim;","⨓":"&scpolint;","с":"&scy;","⋅":"&sdot;","⩦":"&sdote;","⇘":"&seArr;","§":"&sect;",";":"&semi;","⤩":"&tosa;","✶":"&sext;","𝔰":"&sfr;","♯":"&sharp;","щ":"&shchcy;","ш":"&shcy;","­":"&shy;","σ":"&sigma;","ς":"&varsigma;","⩪":"&simdot;","⪞":"&simg;","⪠":"&simgE;","⪝":"&siml;","⪟":"&simlE;","≆":"&simne;","⨤":"&simplus;","⥲":"&simrarr;","⨳":"&smashp;","⧤":"&smeparsl;","⌣":"&ssmile;","⪪":"&smt;","⪬":"&smte;","⪬︀":"&smtes;","ь":"&softcy;","/":"&sol;","⧄":"&solb;","⌿":"&solbar;","𝕤":"&sopf;","♠":"&spadesuit;","⊓︀":"&sqcaps;","⊔︀":"&sqcups;","𝓈":"&sscr;","☆":"&star;","⊂":"&subset;","⫅":"&subseteqq;","⪽":"&subdot;","⫃":"&subedot;","⫁":"&submult;","⫋":"&subsetneqq;","⊊":"&subsetneq;","⪿":"&subplus;","⥹":"&subrarr;","⫇":"&subsim;","⫕":"&subsub;","⫓":"&subsup;","♪":"&sung;","¹":"&sup1;","²":"&sup2;","³":"&sup3;","⫆":"&supseteqq;","⪾":"&supdot;","⫘":"&supdsub;","⫄":"&supedot;","⟉":"&suphsol;","⫗":"&suphsub;","⥻":"&suplarr;","⫂":"&supmult;","⫌":"&supsetneqq;","⊋":"&supsetneq;","⫀":"&supplus;","⫈":"&supsim;","⫔":"&supsub;","⫖":"&supsup;","⇙":"&swArr;","⤪":"&swnwar;","ß":"&szlig;","⌖":"&target;","τ":"&tau;","ť":"&tcaron;","ţ":"&tcedil;","т":"&tcy;","⌕":"&telrec;","𝔱":"&tfr;","θ":"&theta;","ϑ":"&vartheta;","þ":"&thorn;","×":"&times;","⨱":"&timesbar;","⨰":"&timesd;","⌶":"&topbot;","⫱":"&topcir;","𝕥":"&topf;","⫚":"&topfork;","‴":"&tprime;","▵":"&utri;","≜":"&trie;","◬":"&tridot;","⨺":"&triminus;","⨹":"&triplus;","⧍":"&trisb;","⨻":"&tritime;","⏢":"&trpezium;","𝓉":"&tscr;","ц":"&tscy;","ћ":"&tshcy;","ŧ":"&tstrok;","⥣":"&uHar;","ú":"&uacute;","ў":"&ubrcy;","ŭ":"&ubreve;","û":"&ucirc;","у":"&ucy;","ű":"&udblac;","⥾":"&ufisht;","𝔲":"&ufr;","ù":"&ugrave;","▀":"&uhblk;","⌜":"&ulcorner;","⌏":"&ulcrop;","◸":"&ultri;","ū":"&umacr;","ų":"&uogon;","𝕦":"&uopf;","υ":"&upsilon;","⇈":"&uuarr;","⌝":"&urcorner;","⌎":"&urcrop;","ů":"&uring;","◹":"&urtri;","𝓊":"&uscr;","⋰":"&utdot;","ũ":"&utilde;","ü":"&uuml;","⦧":"&uwangle;","⫨":"&vBar;","⫩":"&vBarv;","⦜":"&vangrt;","⊊︀":"&vsubne;","⫋︀":"&vsubnE;","⊋︀":"&vsupne;","⫌︀":"&vsupnE;","в":"&vcy;","⊻":"&veebar;","≚":"&veeeq;","⋮":"&vellip;","𝔳":"&vfr;","𝕧":"&vopf;","𝓋":"&vscr;","⦚":"&vzigzag;","ŵ":"&wcirc;","⩟":"&wedbar;","≙":"&wedgeq;","℘":"&wp;","𝔴":"&wfr;","𝕨":"&wopf;","𝓌":"&wscr;","𝔵":"&xfr;","ξ":"&xi;","⋻":"&xnis;","𝕩":"&xopf;","𝓍":"&xscr;","ý":"&yacute;","я":"&yacy;","ŷ":"&ycirc;","ы":"&ycy;","¥":"&yen;","𝔶":"&yfr;","ї":"&yicy;","𝕪":"&yopf;","𝓎":"&yscr;","ю":"&yucy;","ÿ":"&yuml;","ź":"&zacute;","ž":"&zcaron;","з":"&zcy;","ż":"&zdot;","ζ":"&zeta;","𝔷":"&zfr;","ж":"&zhcy;","⇝":"&zigrarr;","𝕫":"&zopf;","𝓏":"&zscr;","‍":"&zwj;","‌":"&zwnj;"}}};
//# sourceMappingURL=./named-references.js.map

/***/ }),

/***/ "../../node_modules/html-entities/lib/numeric-unicode-map.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/html-entities/lib/numeric-unicode-map.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.numericUnicodeMap={0:65533,128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};
//# sourceMappingURL=./numeric-unicode-map.js.map

/***/ }),

/***/ "../../node_modules/html-entities/lib/surrogate-pairs.js":
/*!***************************************************************!*\
  !*** ../../node_modules/html-entities/lib/surrogate-pairs.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.fromCodePoint=String.fromCodePoint||function(astralCodePoint){return String.fromCharCode(Math.floor((astralCodePoint-65536)/1024)+55296,(astralCodePoint-65536)%1024+56320)};exports.getCodePoint=String.prototype.codePointAt?function(input,position){return input.codePointAt(position)}:function(input,position){return(input.charCodeAt(position)-55296)*1024+input.charCodeAt(position+1)-56320+65536};exports.highSurrogateFrom=55296;exports.highSurrogateTo=56319;
//# sourceMappingURL=./surrogate-pairs.js.map

/***/ }),

/***/ "./page/source/game_objects/cube/cube-shader.wgsl":
/*!********************************************************!*\
  !*** ./page/source/game_objects/cube/cube-shader.wgsl ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// ------------------------- Object Values ---------------------- //\r\n@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;\r\n@group(0) @binding(1) var<storage, read> instancePositions: array<vec4<f32>>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// ------------------------- World Values ---------------------- //\r\nstruct Camera {\r\n    viewProjection: mat4x4<f32>,\r\n    view: mat4x4<f32>,\r\n    projection: mat4x4<f32>,\r\n    rotation: mat4x4<f32>,\r\n    translation: mat4x4<f32>\r\n}\r\n@group(1) @binding(0) var<uniform> camera: Camera;\r\n\r\n\r\n@group(1) @binding(1) var<uniform> timestamp: f32;\r\n\r\nstruct AmbientLight {\r\n    color: vec4<f32>\r\n}\r\n@group(1) @binding(2) var<uniform> ambientLight: AmbientLight;\r\n\r\nstruct PointLight {\r\n    position: vec4<f32>,\r\n    color: vec4<f32>,\r\n    range: f32\r\n}\r\n@group(1) @binding(3) var<storage, read> pointLights: array<PointLight>;\r\n\r\n@group(1) @binding(4) var<storage, read_write> debugValue: f32;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// ------------------------- User Inputs ------------------------ //\r\n@group(2) @binding(0) var cubeTextureSampler: sampler;\r\n@group(2) @binding(1) var cubeTexture: texture_2d_array<f32>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// --------------------- Light calculations --------------------- //\r\n\r\n/**\r\n * Calculate point light output.\r\n */\r\nfn calculatePointLights(fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r\n    // Count of point lights.\r\n    let pointLightCount: u32 = arrayLength(&pointLights);\r\n\r\n    var lightResult: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r\n\r\n    for (var index: u32 = 0; index < pointLightCount; index++) {\r\n        var pointLight: PointLight = pointLights[index];\r\n\r\n        // Calculate light strength based on angle of incidence.\r\n        let lightDirection: vec4<f32> = normalize(pointLight.position - fragmentPosition);\r\n        let diffuse: f32 = max(dot(normal, lightDirection), 0.0);\r\n\r\n        lightResult += pointLight.color * diffuse;\r\n    }\r\n\r\n    return lightResult;\r\n}\r\n\r\n/**\r\n * Apply lights to fragment color.\r\n */\r\nfn applyLight(colorIn: vec4<f32>, fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r\n    var lightColor: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r\n\r\n    lightColor += ambientLight.color;\r\n    lightColor += calculatePointLights(fragmentPosition, normal);\r\n\r\n    return lightColor * colorIn;\r\n}\r\n// -------------------------------------------------------------- //\r\n\r\nfn hash(x: u32) -> u32\r\n{\r\n    var result: u32 = x;\r\n    result ^= result >> 16;\r\n    result *= 0x7feb352du;\r\n    result ^= result >> 15;\r\n    result *= 0x846ca68bu;\r\n    result ^= result >> 16;\r\n    return result;\r\n}\r\n\r\nstruct VertexOut {\r\n    @builtin(position) position: vec4<f32>,\r\n    @location(0) uv: vec2<f32>,\r\n    @location(1) normal: vec4<f32>,\r\n    @location(2) fragmentPosition: vec4<f32>,\r\n    @interpolate(flat) @location(3) textureLayer: u32\r\n}\r\n\r\nstruct VertexIn {\r\n    @builtin(instance_index) instanceId : u32,\r\n    @location(0) position: vec4<f32>,\r\n    @location(1) uv: vec2<f32>,\r\n    @location(2) normal: vec4<f32>\r\n}\r\n\r\noverride animationSeconds: f32 = 3; \r\n\r\n@vertex\r\nfn vertex_main(vertex: VertexIn) -> VertexOut {\r\n    let textureLayers: f32 = f32(textureNumLayers(cubeTexture));\r\n\r\n    var instancePosition: vec4<f32> = instancePositions[vertex.instanceId] + vertex.position;\r\n\r\n    // Generate 4 random numbers.\r\n    var hash1: u32 = hash(vertex.instanceId + 1);\r\n    var hash2: u32 = hash(hash1);\r\n    var hash3: u32 = hash(hash2);\r\n    var hash4: u32 = hash(hash3);\r\n\r\n    // Convert into normals.\r\n    var hashStartDisplacement: f32 = (f32(hash1) - pow(2, 31)) * 2 / pow(2, 32);\r\n    var randomNormalPosition: vec3<f32> = vec3<f32>(\r\n        (f32(hash2) - pow(2, 31)) * 2 / pow(2, 32),\r\n        (f32(hash3) - pow(2, 31)) * 2 / pow(2, 32),\r\n        (f32(hash4) - pow(2, 31)) * 2 / pow(2, 32)\r\n    );\r\n\r\n    // Calculate random position and animate a 100m spread. \r\n    var randPosition: vec4<f32> = instancePosition; // Current start.\r\n    randPosition += vec4<f32>(randomNormalPosition, 1) * 1000; // Randomise start spreading 1000m in all directsions.\r\n    randPosition += vec4<f32>(randomNormalPosition, 1) * sin((timestamp / animationSeconds) + (hashStartDisplacement * 100)) * 100;\r\n    randPosition[3] = 1; // Reset w coord.\r\n\r\n    var transformedInstancePosition: vec4<f32> = transformationMatrix * randPosition;\r\n\r\n    var textureLayer: u32 = u32(floor(f32(vertex.instanceId) % textureLayers));\r\n\r\n    var out: VertexOut;\r\n    out.position = camera.viewProjection * transformedInstancePosition;\r\n    out.uv = vertex.uv;\r\n    out.normal = vertex.normal;\r\n    out.fragmentPosition = transformedInstancePosition;\r\n    out.textureLayer = textureLayer;\r\n\r\n    return out;\r\n}\r\n\r\nstruct FragmentIn {\r\n    @location(0) uv: vec2<f32>,\r\n    @location(1) normal: vec4<f32>,\r\n    @location(2) fragmentPosition: vec4<f32>,\r\n    @interpolate(flat) @location(3) textureLayer: u32\r\n}\r\n\r\n@fragment\r\nfn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {\r\n    return applyLight(textureSample(cubeTexture, cubeTextureSampler, fragment.uv, fragment.textureLayer), fragment.fragmentPosition, fragment.normal);\r\n}");

/***/ }),

/***/ "./page/source/game_objects/light/light-box-shader.wgsl":
/*!**************************************************************!*\
  !*** ./page/source/game_objects/light/light-box-shader.wgsl ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// ------------------------- Object Values ---------------------- //\r\n@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// ------------------------- World Values ---------------------- //\r\nstruct CameraTransformation {\r\n    rotation: mat4x4<f32>,\r\n    translation: mat4x4<f32>\r\n}\r\nstruct Camera {\r\n    viewProjection: mat4x4<f32>,\r\n    view: mat4x4<f32>,\r\n    projection: mat4x4<f32>,\r\n    translation: CameraTransformation,\r\n    invertedTranslation: CameraTransformation,\r\n}\r\n@group(1) @binding(0) var<uniform> camera: Camera;\r\n\r\n\r\n@group(1) @binding(1) var<uniform> timestamp: f32;\r\n\r\nstruct AmbientLight {\r\n    color: vec4<f32>\r\n}\r\n@group(1) @binding(2) var<uniform> ambientLight: AmbientLight;\r\n\r\nstruct PointLight {\r\n    position: vec4<f32>,\r\n    color: vec4<f32>,\r\n    range: f32\r\n}\r\n@group(1) @binding(3) var<storage, read> pointLights: array<PointLight>;\r\n\r\n@group(1) @binding(4) var<storage, read_write> debugValue: f32;\r\n// -------------------------------------------------------------- //\r\n\r\nstruct VertexOut {\r\n    @builtin(position) position: vec4<f32>,\r\n    @location(0) color: vec4<f32>,\r\n}\r\n\r\nstruct VertexIn {\r\n    @builtin(instance_index) instanceId : u32,\r\n    @location(0) position: vec4<f32>,\r\n    @location(1) uv: vec2<f32>,\r\n    @location(2) normal: vec4<f32>\r\n}\r\n\r\n@vertex\r\nfn vertex_main(vertex: VertexIn) -> VertexOut {\r\n    var instanceLight: PointLight = pointLights[vertex.instanceId];\r\n\r\n    var out: VertexOut;\r\n    out.position = camera.viewProjection * transformationMatrix * (instanceLight.position + vertex.position);\r\n    out.color = instanceLight.color;\r\n\r\n    return out;\r\n}\r\n\r\nstruct FragmentIn {\r\n    @location(0) color: vec4<f32>,\r\n}\r\n\r\n@fragment\r\nfn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {\r\n    return fragment.color;\r\n}");

/***/ }),

/***/ "./page/source/game_objects/skybox/sky-box-shader.wgsl":
/*!*************************************************************!*\
  !*** ./page/source/game_objects/skybox/sky-box-shader.wgsl ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// ------------------------- Object Values ---------------------- //\r\n@group(0) @binding(0) var cubeTextureSampler: sampler;\r\n@group(0) @binding(1) var cubeMap: texture_cube<f32>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// ------------------------- World Values ---------------------- //\r\nstruct CameraTransformation {\r\n    rotation: mat4x4<f32>,\r\n    translation: mat4x4<f32>\r\n}\r\nstruct Camera {\r\n    viewProjection: mat4x4<f32>,\r\n    view: mat4x4<f32>,\r\n    projection: mat4x4<f32>,\r\n    translation: CameraTransformation,\r\n    invertedTranslation: CameraTransformation,\r\n}\r\n@group(1) @binding(0) var<uniform> camera: Camera;\r\n\r\n\r\n@group(1) @binding(1) var<uniform> timestamp: f32;\r\n\r\nstruct AmbientLight {\r\n    color: vec4<f32>\r\n}\r\n@group(1) @binding(2) var<uniform> ambientLight: AmbientLight;\r\n\r\nstruct PointLight {\r\n    position: vec4<f32>,\r\n    color: vec4<f32>,\r\n    range: f32\r\n}\r\n@group(1) @binding(3) var<storage, read> pointLights: array<PointLight>;\r\n\r\n@group(1) @binding(4) var<storage, read_write> debugValue: f32;\r\n// -------------------------------------------------------------- //\r\n\r\nstruct VertexOut {\r\n    @builtin(position) position: vec4<f32>,\r\n    @location(1) fragmentPosition: vec4<f32>,\r\n}\r\n\r\nstruct VertexIn {\r\n    @location(0) position: vec4<f32>,\r\n}\r\n\r\n@vertex\r\nfn vertex_main(vertex: VertexIn) -> VertexOut {\r\n    var out: VertexOut;\r\n    out.position = camera.projection * camera.invertedTranslation.rotation  * vertex.position;\r\n    out.fragmentPosition = vertex.position;\r\n\r\n    return out;\r\n}\r\n\r\nstruct FragmentIn {\r\n    @location(1) fragmentPosition: vec4<f32>,\r\n}\r\n\r\n@fragment\r\nfn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {\r\n  return textureSample(cubeMap, cubeTextureSampler, fragment.fragmentPosition.xyz);\r\n}");

/***/ }),

/***/ "./page/source/game_objects/video_canvas/video-canvas-shader.wgsl":
/*!************************************************************************!*\
  !*** ./page/source/game_objects/video_canvas/video-canvas-shader.wgsl ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// ------------------------- Object Values ---------------------- //\r\n@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// ------------------------- World Values ---------------------- //\r\nstruct CameraTransformation {\r\n    rotation: mat4x4<f32>,\r\n    translation: mat4x4<f32>\r\n}\r\nstruct Camera {\r\n    viewProjection: mat4x4<f32>,\r\n    view: mat4x4<f32>,\r\n    projection: mat4x4<f32>,\r\n    translation: CameraTransformation,\r\n    invertedTranslation: CameraTransformation,\r\n}\r\n@group(1) @binding(0) var<uniform> camera: Camera;\r\n\r\n\r\n@group(1) @binding(1) var<uniform> timestamp: f32;\r\n\r\nstruct AmbientLight {\r\n    color: vec4<f32>\r\n}\r\n@group(1) @binding(2) var<uniform> ambientLight: AmbientLight;\r\n\r\nstruct PointLight {\r\n    position: vec4<f32>,\r\n    color: vec4<f32>,\r\n    range: f32\r\n}\r\n@group(1) @binding(3) var<storage, read> pointLights: array<PointLight>;\r\n\r\n@group(1) @binding(4) var<storage, read_write> debugValue: f32;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// ------------------------- User Inputs ------------------------ //\r\n@group(2) @binding(0) var videoTextureSampler: sampler;\r\n@group(2) @binding(1) var videoTexture: texture_2d<f32>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// --------------------- Light calculations --------------------- //\r\n\r\n/**\r\n * Calculate point light output.\r\n */\r\nfn calculatePointLights(fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r\n    // Count of point lights.\r\n    let pointLightCount: u32 = arrayLength(&pointLights);\r\n\r\n    var lightResult: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r\n\r\n    for (var index: u32 = 0; index < pointLightCount; index++) {\r\n        var pointLight: PointLight = pointLights[index];\r\n\r\n        // Calculate light strength based on angle of incidence.\r\n        let lightDirection: vec4<f32> = normalize(pointLight.position - fragmentPosition);\r\n        let diffuse: f32 = max(dot(normal, lightDirection), 0.0);\r\n\r\n        lightResult += pointLight.color * diffuse;\r\n    }\r\n\r\n    return lightResult;\r\n}\r\n\r\n/**\r\n * Apply lights to fragment color.\r\n */\r\nfn applyLight(colorIn: vec4<f32>, fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r\n    var lightColor: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r\n\r\n    lightColor += ambientLight.color;\r\n    lightColor += calculatePointLights(fragmentPosition, normal);\r\n\r\n    return lightColor * colorIn;\r\n}\r\n// -------------------------------------------------------------- //\r\nstruct VertexOut {\r\n    @builtin(position) position: vec4<f32>,\r\n    @location(0) uv: vec2<f32>,\r\n    @location(1) normal: vec4<f32>,\r\n    @location(2) fragmentPosition: vec4<f32>,\r\n}\r\n\r\nstruct VertexIn {\r\n    @builtin(instance_index) instanceId : u32,\r\n    @location(0) position: vec4<f32>,\r\n    @location(1) uv: vec2<f32>,\r\n    @location(2) normal: vec4<f32>\r\n}\r\n\r\n@vertex\r\nfn vertex_main(vertex: VertexIn) -> VertexOut {\r\n    let translation: mat4x4<f32> = mat4x4(\r\n        vec4<f32>(1, 0, 0, 0),\r\n        vec4<f32>(0, 1, 0, 0),\r\n        vec4<f32>(0, 0, 1, 0),\r\n        transformationMatrix[3]\r\n    );\r\n\r\n    let scaling: mat4x4<f32> = mat4x4(\r\n        vec4<f32>(length(transformationMatrix[0].xyz), 0, 0, 0),\r\n        vec4<f32>(0, length(transformationMatrix[1].xyz), 0, 0),\r\n        vec4<f32>(0, 0, length(transformationMatrix[2].xyz), 0),\r\n        vec4<f32>(0, 0, 0, 1),\r\n    );\r\n\r\n    var transformedPosition: vec4<f32> = translation * camera.translation.rotation * scaling  * vertex.position;\r\n\r\n    var out: VertexOut;\r\n    out.position = camera.viewProjection * transformedPosition;\r\n    out.uv = vertex.uv;\r\n    out.normal = camera.translation.rotation * vertex.normal;\r\n    out.fragmentPosition = transformedPosition;\r\n\r\n    return out;\r\n}\r\n\r\nstruct FragmentIn {\r\n    @location(0) uv: vec2<f32>,\r\n    @location(1) normal: vec4<f32>,\r\n    @location(2) fragmentPosition: vec4<f32>,\r\n}\r\n\r\n@fragment\r\nfn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {\r\n    let videoColor: vec4<f32> = textureSample(videoTexture, videoTextureSampler, fragment.uv);\r\n\r\n    const red: f32 = 53;\r\n    const green: f32 = 214;\r\n    const blue: f32 = 19;\r\n\r\n    const redGreenRatio: f32 = red / green;\r\n    const blueGreenRatio: f32 = blue / green;\r\n\r\n    const ratioTolerance: f32 = 0.5;\r\n\r\n    let curredRedGreenRatio: f32 = videoColor.r / videoColor.g;\r\n    let curredBlueGreenRatio: f32 = videoColor.b / videoColor.g;\r\n\r\n    let compareRed: f32 = abs(curredRedGreenRatio - redGreenRatio);\r\n    let compareBlue: f32 = abs(curredBlueGreenRatio - blueGreenRatio);\r\n    \r\n\r\n    if(compareRed < ratioTolerance && compareBlue < ratioTolerance) {\r\n        return vec4<f32>(videoColor.rgb, 0.0);\r\n    }\r\n\r\n    return vec4<f32>(applyLight(videoColor, fragment.fragmentPosition, fragment.normal).rgb, (sin(fragment.uv.y * 750 + timestamp * 20) * 0.5 + 1) * 0.7);\r\n}");

/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/clients/WebSocketClient.js":
/*!*******************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/clients/WebSocketClient.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WebSocketClient)
/* harmony export */ });
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/log.js */ "../../node_modules/webpack-dev-server/client/utils/log.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var WebSocketClient = /*#__PURE__*/function () {
  /**
   * @param {string} url
   */
  function WebSocketClient(url) {
    _classCallCheck(this, WebSocketClient);
    this.client = new WebSocket(url);
    this.client.onerror = function (error) {
      _utils_log_js__WEBPACK_IMPORTED_MODULE_0__.log.error(error);
    };
  }

  /**
   * @param {(...args: any[]) => void} f
   */
  _createClass(WebSocketClient, [{
    key: "onOpen",
    value: function onOpen(f) {
      this.client.onopen = f;
    }

    /**
     * @param {(...args: any[]) => void} f
     */
  }, {
    key: "onClose",
    value: function onClose(f) {
      this.client.onclose = f;
    }

    // call f with the message string as the first argument
    /**
     * @param {(...args: any[]) => void} f
     */
  }, {
    key: "onMessage",
    value: function onMessage(f) {
      this.client.onmessage = function (e) {
        f(e.data);
      };
    }
  }]);
  return WebSocketClient;
}();


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=0.0.0.0&port=5500&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true":
/*!***************************************************************************************************************************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=0.0.0.0&port=5500&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true ***!
  \***************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
var __resourceQuery = "?protocol=ws%3A&hostname=0.0.0.0&port=5500&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webpack/hot/log.js */ "../../node_modules/webpack/hot/log.js");
/* harmony import */ var webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_stripAnsi_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/stripAnsi.js */ "../../node_modules/webpack-dev-server/client/utils/stripAnsi.js");
/* harmony import */ var _utils_parseURL_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/parseURL.js */ "../../node_modules/webpack-dev-server/client/utils/parseURL.js");
/* harmony import */ var _socket_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./socket.js */ "../../node_modules/webpack-dev-server/client/socket.js");
/* harmony import */ var _overlay_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./overlay.js */ "../../node_modules/webpack-dev-server/client/overlay.js");
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/log.js */ "../../node_modules/webpack-dev-server/client/utils/log.js");
/* harmony import */ var _utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/sendMessage.js */ "../../node_modules/webpack-dev-server/client/utils/sendMessage.js");
/* harmony import */ var _utils_reloadApp_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/reloadApp.js */ "../../node_modules/webpack-dev-server/client/utils/reloadApp.js");
/* harmony import */ var _utils_createSocketURL_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/createSocketURL.js */ "../../node_modules/webpack-dev-server/client/utils/createSocketURL.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* global __resourceQuery, __webpack_hash__ */
/// <reference types="webpack/module" />










/**
 * @typedef {Object} OverlayOptions
 * @property {boolean | (error: Error) => boolean} [warnings]
 * @property {boolean | (error: Error) => boolean} [errors]
 * @property {boolean | (error: Error) => boolean} [runtimeErrors]
 * @property {string} [trustedTypesPolicyName]
 */

/**
 * @typedef {Object} Options
 * @property {boolean} hot
 * @property {boolean} liveReload
 * @property {boolean} progress
 * @property {boolean | OverlayOptions} overlay
 * @property {string} [logging]
 * @property {number} [reconnect]
 */

/**
 * @typedef {Object} Status
 * @property {boolean} isUnloading
 * @property {string} currentHash
 * @property {string} [previousHash]
 */

/**
 * @param {boolean | { warnings?: boolean | string; errors?: boolean | string; runtimeErrors?: boolean | string; }} overlayOptions
 */
var decodeOverlayOptions = function decodeOverlayOptions(overlayOptions) {
  if (typeof overlayOptions === "object") {
    ["warnings", "errors", "runtimeErrors"].forEach(function (property) {
      if (typeof overlayOptions[property] === "string") {
        var overlayFilterFunctionString = decodeURIComponent(overlayOptions[property]);

        // eslint-disable-next-line no-new-func
        var overlayFilterFunction = new Function("message", "var callback = ".concat(overlayFilterFunctionString, "\n        return callback(message)"));
        overlayOptions[property] = overlayFilterFunction;
      }
    });
  }
};

/**
 * @type {Status}
 */
var status = {
  isUnloading: false,
  // TODO Workaround for webpack v4, `__webpack_hash__` is not replaced without HotModuleReplacement
  // eslint-disable-next-line camelcase
  currentHash:  true ? __webpack_require__.h() : 0
};

/** @type {Options} */
var options = {
  hot: false,
  liveReload: false,
  progress: false,
  overlay: false
};
var parsedResourceQuery = (0,_utils_parseURL_js__WEBPACK_IMPORTED_MODULE_2__["default"])(__resourceQuery);
var enabledFeatures = {
  "Hot Module Replacement": false,
  "Live Reloading": false,
  Progress: false,
  Overlay: false
};
if (parsedResourceQuery.hot === "true") {
  options.hot = true;
  enabledFeatures["Hot Module Replacement"] = true;
}
if (parsedResourceQuery["live-reload"] === "true") {
  options.liveReload = true;
  enabledFeatures["Live Reloading"] = true;
}
if (parsedResourceQuery.progress === "true") {
  options.progress = true;
  enabledFeatures.Progress = true;
}
if (parsedResourceQuery.overlay) {
  try {
    options.overlay = JSON.parse(parsedResourceQuery.overlay);
  } catch (e) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.error("Error parsing overlay options from resource query:", e);
  }

  // Fill in default "true" params for partially-specified objects.
  if (typeof options.overlay === "object") {
    options.overlay = _objectSpread({
      errors: true,
      warnings: true,
      runtimeErrors: true
    }, options.overlay);
    decodeOverlayOptions(options.overlay);
  }
  enabledFeatures.Overlay = true;
}
if (parsedResourceQuery.logging) {
  options.logging = parsedResourceQuery.logging;
}
if (typeof parsedResourceQuery.reconnect !== "undefined") {
  options.reconnect = Number(parsedResourceQuery.reconnect);
}

/**
 * @param {string} level
 */
function setAllLogLevel(level) {
  // This is needed because the HMR logger operate separately from dev server logger
  webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0___default().setLogLevel(level === "verbose" || level === "log" ? "info" : level);
  (0,_utils_log_js__WEBPACK_IMPORTED_MODULE_5__.setLogLevel)(level);
}
if (options.logging) {
  setAllLogLevel(options.logging);
}
(0,_utils_log_js__WEBPACK_IMPORTED_MODULE_5__.logEnabledFeatures)(enabledFeatures);
self.addEventListener("beforeunload", function () {
  status.isUnloading = true;
});
var overlay = typeof window !== "undefined" ? (0,_overlay_js__WEBPACK_IMPORTED_MODULE_4__.createOverlay)(typeof options.overlay === "object" ? {
  trustedTypesPolicyName: options.overlay.trustedTypesPolicyName,
  catchRuntimeError: options.overlay.runtimeErrors
} : {
  trustedTypesPolicyName: false,
  catchRuntimeError: options.overlay
}) : {
  send: function send() {}
};
var onSocketMessage = {
  hot: function hot() {
    if (parsedResourceQuery.hot === "false") {
      return;
    }
    options.hot = true;
  },
  liveReload: function liveReload() {
    if (parsedResourceQuery["live-reload"] === "false") {
      return;
    }
    options.liveReload = true;
  },
  invalid: function invalid() {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("App updated. Recompiling...");

    // Fixes #1042. overlay doesn't clear if errors are fixed but warnings remain.
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Invalid");
  },
  /**
   * @param {string} hash
   */
  hash: function hash(_hash) {
    status.previousHash = status.currentHash;
    status.currentHash = _hash;
  },
  logging: setAllLogLevel,
  /**
   * @param {boolean} value
   */
  overlay: function overlay(value) {
    if (typeof document === "undefined") {
      return;
    }
    options.overlay = value;
    decodeOverlayOptions(options.overlay);
  },
  /**
   * @param {number} value
   */
  reconnect: function reconnect(value) {
    if (parsedResourceQuery.reconnect === "false") {
      return;
    }
    options.reconnect = value;
  },
  /**
   * @param {boolean} value
   */
  progress: function progress(value) {
    options.progress = value;
  },
  /**
   * @param {{ pluginName?: string, percent: number, msg: string }} data
   */
  "progress-update": function progressUpdate(data) {
    if (options.progress) {
      _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("".concat(data.pluginName ? "[".concat(data.pluginName, "] ") : "").concat(data.percent, "% - ").concat(data.msg, "."));
    }
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Progress", data);
  },
  "still-ok": function stillOk() {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("Nothing changed.");
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("StillOk");
  },
  ok: function ok() {
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Ok");
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    (0,_utils_reloadApp_js__WEBPACK_IMPORTED_MODULE_7__["default"])(options, status);
  },
  // TODO: remove in v5 in favor of 'static-changed'
  /**
   * @param {string} file
   */
  "content-changed": function contentChanged(file) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("".concat(file ? "\"".concat(file, "\"") : "Content", " from static directory was changed. Reloading..."));
    self.location.reload();
  },
  /**
   * @param {string} file
   */
  "static-changed": function staticChanged(file) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("".concat(file ? "\"".concat(file, "\"") : "Content", " from static directory was changed. Reloading..."));
    self.location.reload();
  },
  /**
   * @param {Error[]} warnings
   * @param {any} params
   */
  warnings: function warnings(_warnings, params) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.warn("Warnings while compiling.");
    var printableWarnings = _warnings.map(function (error) {
      var _formatProblem = (0,_overlay_js__WEBPACK_IMPORTED_MODULE_4__.formatProblem)("warning", error),
        header = _formatProblem.header,
        body = _formatProblem.body;
      return "".concat(header, "\n").concat((0,_utils_stripAnsi_js__WEBPACK_IMPORTED_MODULE_1__["default"])(body));
    });
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Warnings", printableWarnings);
    for (var i = 0; i < printableWarnings.length; i++) {
      _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.warn(printableWarnings[i]);
    }
    var overlayWarningsSetting = typeof options.overlay === "boolean" ? options.overlay : options.overlay && options.overlay.warnings;
    if (overlayWarningsSetting) {
      var warningsToDisplay = typeof overlayWarningsSetting === "function" ? _warnings.filter(overlayWarningsSetting) : _warnings;
      if (warningsToDisplay.length) {
        overlay.send({
          type: "BUILD_ERROR",
          level: "warning",
          messages: _warnings
        });
      }
    }
    if (params && params.preventReloading) {
      return;
    }
    (0,_utils_reloadApp_js__WEBPACK_IMPORTED_MODULE_7__["default"])(options, status);
  },
  /**
   * @param {Error[]} errors
   */
  errors: function errors(_errors) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.error("Errors while compiling. Reload prevented.");
    var printableErrors = _errors.map(function (error) {
      var _formatProblem2 = (0,_overlay_js__WEBPACK_IMPORTED_MODULE_4__.formatProblem)("error", error),
        header = _formatProblem2.header,
        body = _formatProblem2.body;
      return "".concat(header, "\n").concat((0,_utils_stripAnsi_js__WEBPACK_IMPORTED_MODULE_1__["default"])(body));
    });
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Errors", printableErrors);
    for (var i = 0; i < printableErrors.length; i++) {
      _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.error(printableErrors[i]);
    }
    var overlayErrorsSettings = typeof options.overlay === "boolean" ? options.overlay : options.overlay && options.overlay.errors;
    if (overlayErrorsSettings) {
      var errorsToDisplay = typeof overlayErrorsSettings === "function" ? _errors.filter(overlayErrorsSettings) : _errors;
      if (errorsToDisplay.length) {
        overlay.send({
          type: "BUILD_ERROR",
          level: "error",
          messages: _errors
        });
      }
    }
  },
  /**
   * @param {Error} error
   */
  error: function error(_error) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.error(_error);
  },
  close: function close() {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("Disconnected!");
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Close");
  }
};
var socketURL = (0,_utils_createSocketURL_js__WEBPACK_IMPORTED_MODULE_8__["default"])(parsedResourceQuery);
(0,_socket_js__WEBPACK_IMPORTED_MODULE_3__["default"])(socketURL, onSocketMessage, options.reconnect);

/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/modules/logger/index.js":
/*!****************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/modules/logger/index.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client-src/modules/logger/SyncBailHookFake.js":
/*!*******************************************************!*\
  !*** ./client-src/modules/logger/SyncBailHookFake.js ***!
  \*******************************************************/
/***/ (function(module) {



/**
 * Client stub for tapable SyncBailHook
 */
module.exports = function clientTapableSyncBailHook() {
  return {
    call: function call() {}
  };
};

/***/ }),

/***/ "./node_modules/webpack/lib/logging/Logger.js":
/*!****************************************************!*\
  !*** ./node_modules/webpack/lib/logging/Logger.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
  if (typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) !== "undefined" && iter[(typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[(typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
var LogType = Object.freeze({
  error: /** @type {"error"} */"error",
  // message, c style arguments
  warn: /** @type {"warn"} */"warn",
  // message, c style arguments
  info: /** @type {"info"} */"info",
  // message, c style arguments
  log: /** @type {"log"} */"log",
  // message, c style arguments
  debug: /** @type {"debug"} */"debug",
  // message, c style arguments

  trace: /** @type {"trace"} */"trace",
  // no arguments

  group: /** @type {"group"} */"group",
  // [label]
  groupCollapsed: /** @type {"groupCollapsed"} */"groupCollapsed",
  // [label]
  groupEnd: /** @type {"groupEnd"} */"groupEnd",
  // [label]

  profile: /** @type {"profile"} */"profile",
  // [profileName]
  profileEnd: /** @type {"profileEnd"} */"profileEnd",
  // [profileName]

  time: /** @type {"time"} */"time",
  // name, time as [seconds, nanoseconds]

  clear: /** @type {"clear"} */"clear",
  // no arguments
  status: /** @type {"status"} */"status" // message, arguments
});

exports.LogType = LogType;

/** @typedef {typeof LogType[keyof typeof LogType]} LogTypeEnum */

var LOG_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; })("webpack logger raw log method");
var TIMERS_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; })("webpack logger times");
var TIMERS_AGGREGATES_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; })("webpack logger aggregated times");
var WebpackLogger = /*#__PURE__*/function () {
  /**
   * @param {function(LogTypeEnum, any[]=): void} log log function
   * @param {function(string | function(): string): WebpackLogger} getChildLogger function to create child logger
   */
  function WebpackLogger(log, getChildLogger) {
    _classCallCheck(this, WebpackLogger);
    this[LOG_SYMBOL] = log;
    this.getChildLogger = getChildLogger;
  }
  _createClass(WebpackLogger, [{
    key: "error",
    value: function error() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      this[LOG_SYMBOL](LogType.error, args);
    }
  }, {
    key: "warn",
    value: function warn() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      this[LOG_SYMBOL](LogType.warn, args);
    }
  }, {
    key: "info",
    value: function info() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      this[LOG_SYMBOL](LogType.info, args);
    }
  }, {
    key: "log",
    value: function log() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      this[LOG_SYMBOL](LogType.log, args);
    }
  }, {
    key: "debug",
    value: function debug() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      this[LOG_SYMBOL](LogType.debug, args);
    }
  }, {
    key: "assert",
    value: function assert(assertion) {
      if (!assertion) {
        for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          args[_key6 - 1] = arguments[_key6];
        }
        this[LOG_SYMBOL](LogType.error, args);
      }
    }
  }, {
    key: "trace",
    value: function trace() {
      this[LOG_SYMBOL](LogType.trace, ["Trace"]);
    }
  }, {
    key: "clear",
    value: function clear() {
      this[LOG_SYMBOL](LogType.clear);
    }
  }, {
    key: "status",
    value: function status() {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }
      this[LOG_SYMBOL](LogType.status, args);
    }
  }, {
    key: "group",
    value: function group() {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }
      this[LOG_SYMBOL](LogType.group, args);
    }
  }, {
    key: "groupCollapsed",
    value: function groupCollapsed() {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }
      this[LOG_SYMBOL](LogType.groupCollapsed, args);
    }
  }, {
    key: "groupEnd",
    value: function groupEnd() {
      for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }
      this[LOG_SYMBOL](LogType.groupEnd, args);
    }
  }, {
    key: "profile",
    value: function profile(label) {
      this[LOG_SYMBOL](LogType.profile, [label]);
    }
  }, {
    key: "profileEnd",
    value: function profileEnd(label) {
      this[LOG_SYMBOL](LogType.profileEnd, [label]);
    }
  }, {
    key: "time",
    value: function time(label) {
      this[TIMERS_SYMBOL] = this[TIMERS_SYMBOL] || new Map();
      this[TIMERS_SYMBOL].set(label, process.hrtime());
    }
  }, {
    key: "timeLog",
    value: function timeLog(label) {
      var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
      if (!prev) {
        throw new Error("No such label '".concat(label, "' for WebpackLogger.timeLog()"));
      }
      var time = process.hrtime(prev);
      this[LOG_SYMBOL](LogType.time, [label].concat(_toConsumableArray(time)));
    }
  }, {
    key: "timeEnd",
    value: function timeEnd(label) {
      var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
      if (!prev) {
        throw new Error("No such label '".concat(label, "' for WebpackLogger.timeEnd()"));
      }
      var time = process.hrtime(prev);
      this[TIMERS_SYMBOL].delete(label);
      this[LOG_SYMBOL](LogType.time, [label].concat(_toConsumableArray(time)));
    }
  }, {
    key: "timeAggregate",
    value: function timeAggregate(label) {
      var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
      if (!prev) {
        throw new Error("No such label '".concat(label, "' for WebpackLogger.timeAggregate()"));
      }
      var time = process.hrtime(prev);
      this[TIMERS_SYMBOL].delete(label);
      this[TIMERS_AGGREGATES_SYMBOL] = this[TIMERS_AGGREGATES_SYMBOL] || new Map();
      var current = this[TIMERS_AGGREGATES_SYMBOL].get(label);
      if (current !== undefined) {
        if (time[1] + current[1] > 1e9) {
          time[0] += current[0] + 1;
          time[1] = time[1] - 1e9 + current[1];
        } else {
          time[0] += current[0];
          time[1] += current[1];
        }
      }
      this[TIMERS_AGGREGATES_SYMBOL].set(label, time);
    }
  }, {
    key: "timeAggregateEnd",
    value: function timeAggregateEnd(label) {
      if (this[TIMERS_AGGREGATES_SYMBOL] === undefined) return;
      var time = this[TIMERS_AGGREGATES_SYMBOL].get(label);
      if (time === undefined) return;
      this[TIMERS_AGGREGATES_SYMBOL].delete(label);
      this[LOG_SYMBOL](LogType.time, [label].concat(_toConsumableArray(time)));
    }
  }]);
  return WebpackLogger;
}();
exports.Logger = WebpackLogger;

/***/ }),

/***/ "./node_modules/webpack/lib/logging/createConsoleLogger.js":
/*!*****************************************************************!*\
  !*** ./node_modules/webpack/lib/logging/createConsoleLogger.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __nested_webpack_require_11285__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
  if (typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) !== "undefined" && iter[(typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
var _require = __nested_webpack_require_11285__(/*! ./Logger */ "./node_modules/webpack/lib/logging/Logger.js"),
  LogType = _require.LogType;

/** @typedef {import("../../declarations/WebpackOptions").FilterItemTypes} FilterItemTypes */
/** @typedef {import("../../declarations/WebpackOptions").FilterTypes} FilterTypes */
/** @typedef {import("./Logger").LogTypeEnum} LogTypeEnum */

/** @typedef {function(string): boolean} FilterFunction */

/**
 * @typedef {Object} LoggerConsole
 * @property {function(): void} clear
 * @property {function(): void} trace
 * @property {(...args: any[]) => void} info
 * @property {(...args: any[]) => void} log
 * @property {(...args: any[]) => void} warn
 * @property {(...args: any[]) => void} error
 * @property {(...args: any[]) => void=} debug
 * @property {(...args: any[]) => void=} group
 * @property {(...args: any[]) => void=} groupCollapsed
 * @property {(...args: any[]) => void=} groupEnd
 * @property {(...args: any[]) => void=} status
 * @property {(...args: any[]) => void=} profile
 * @property {(...args: any[]) => void=} profileEnd
 * @property {(...args: any[]) => void=} logTime
 */

/**
 * @typedef {Object} LoggerOptions
 * @property {false|true|"none"|"error"|"warn"|"info"|"log"|"verbose"} level loglevel
 * @property {FilterTypes|boolean} debug filter for debug logging
 * @property {LoggerConsole} console the console to log to
 */

/**
 * @param {FilterItemTypes} item an input item
 * @returns {FilterFunction} filter function
 */
var filterToFunction = function filterToFunction(item) {
  if (typeof item === "string") {
    var regExp = new RegExp("[\\\\/]".concat(item.replace(
    // eslint-disable-next-line no-useless-escape
    /[-[\]{}()*+?.\\^$|]/g, "\\$&"), "([\\\\/]|$|!|\\?)"));
    return function (ident) {
      return regExp.test(ident);
    };
  }
  if (item && typeof item === "object" && typeof item.test === "function") {
    return function (ident) {
      return item.test(ident);
    };
  }
  if (typeof item === "function") {
    return item;
  }
  if (typeof item === "boolean") {
    return function () {
      return item;
    };
  }
};

/**
 * @enum {number}
 */
var LogLevel = {
  none: 6,
  false: 6,
  error: 5,
  warn: 4,
  info: 3,
  log: 2,
  true: 2,
  verbose: 1
};

/**
 * @param {LoggerOptions} options options object
 * @returns {function(string, LogTypeEnum, any[]): void} logging function
 */
module.exports = function (_ref) {
  var _ref$level = _ref.level,
    level = _ref$level === void 0 ? "info" : _ref$level,
    _ref$debug = _ref.debug,
    debug = _ref$debug === void 0 ? false : _ref$debug,
    console = _ref.console;
  var debugFilters = typeof debug === "boolean" ? [function () {
    return debug;
  }] : /** @type {FilterItemTypes[]} */[].concat(debug).map(filterToFunction);
  /** @type {number} */
  var loglevel = LogLevel["".concat(level)] || 0;

  /**
   * @param {string} name name of the logger
   * @param {LogTypeEnum} type type of the log entry
   * @param {any[]} args arguments of the log entry
   * @returns {void}
   */
  var logger = function logger(name, type, args) {
    var labeledArgs = function labeledArgs() {
      if (Array.isArray(args)) {
        if (args.length > 0 && typeof args[0] === "string") {
          return ["[".concat(name, "] ").concat(args[0])].concat(_toConsumableArray(args.slice(1)));
        } else {
          return ["[".concat(name, "]")].concat(_toConsumableArray(args));
        }
      } else {
        return [];
      }
    };
    var debug = debugFilters.some(function (f) {
      return f(name);
    });
    switch (type) {
      case LogType.debug:
        if (!debug) return;
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        if (typeof console.debug === "function") {
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          console.debug.apply(console, _toConsumableArray(labeledArgs()));
        } else {
          console.log.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.log:
        if (!debug && loglevel > LogLevel.log) return;
        console.log.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.info:
        if (!debug && loglevel > LogLevel.info) return;
        console.info.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.warn:
        if (!debug && loglevel > LogLevel.warn) return;
        console.warn.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.error:
        if (!debug && loglevel > LogLevel.error) return;
        console.error.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.trace:
        if (!debug) return;
        console.trace();
        break;
      case LogType.groupCollapsed:
        if (!debug && loglevel > LogLevel.log) return;
        if (!debug && loglevel > LogLevel.verbose) {
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          if (typeof console.groupCollapsed === "function") {
            // eslint-disable-next-line node/no-unsupported-features/node-builtins
            console.groupCollapsed.apply(console, _toConsumableArray(labeledArgs()));
          } else {
            console.log.apply(console, _toConsumableArray(labeledArgs()));
          }
          break;
        }
      // falls through
      case LogType.group:
        if (!debug && loglevel > LogLevel.log) return;
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        if (typeof console.group === "function") {
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          console.group.apply(console, _toConsumableArray(labeledArgs()));
        } else {
          console.log.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.groupEnd:
        if (!debug && loglevel > LogLevel.log) return;
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        if (typeof console.groupEnd === "function") {
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          console.groupEnd();
        }
        break;
      case LogType.time:
        {
          if (!debug && loglevel > LogLevel.log) return;
          var ms = args[1] * 1000 + args[2] / 1000000;
          var msg = "[".concat(name, "] ").concat(args[0], ": ").concat(ms, " ms");
          if (typeof console.logTime === "function") {
            console.logTime(msg);
          } else {
            console.log(msg);
          }
          break;
        }
      case LogType.profile:
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        if (typeof console.profile === "function") {
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          console.profile.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.profileEnd:
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        if (typeof console.profileEnd === "function") {
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          console.profileEnd.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.clear:
        if (!debug && loglevel > LogLevel.log) return;
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        if (typeof console.clear === "function") {
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          console.clear();
        }
        break;
      case LogType.status:
        if (!debug && loglevel > LogLevel.info) return;
        if (typeof console.status === "function") {
          if (args.length === 0) {
            console.status();
          } else {
            console.status.apply(console, _toConsumableArray(labeledArgs()));
          }
        } else {
          if (args.length !== 0) {
            console.info.apply(console, _toConsumableArray(labeledArgs()));
          }
        }
        break;
      default:
        throw new Error("Unexpected LogType ".concat(type));
    }
  };
  return logger;
};

/***/ }),

/***/ "./node_modules/webpack/lib/logging/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/webpack/lib/logging/runtime.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __nested_webpack_require_21334__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
var SyncBailHook = __nested_webpack_require_21334__(/*! tapable/lib/SyncBailHook */ "./client-src/modules/logger/SyncBailHookFake.js");
var _require = __nested_webpack_require_21334__(/*! ./Logger */ "./node_modules/webpack/lib/logging/Logger.js"),
  Logger = _require.Logger;
var createConsoleLogger = __nested_webpack_require_21334__(/*! ./createConsoleLogger */ "./node_modules/webpack/lib/logging/createConsoleLogger.js");

/** @type {createConsoleLogger.LoggerOptions} */
var currentDefaultLoggerOptions = {
  level: "info",
  debug: false,
  console: console
};
var currentDefaultLogger = createConsoleLogger(currentDefaultLoggerOptions);

/**
 * @param {string} name name of the logger
 * @returns {Logger} a logger
 */
exports.getLogger = function (name) {
  return new Logger(function (type, args) {
    if (exports.hooks.log.call(name, type, args) === undefined) {
      currentDefaultLogger(name, type, args);
    }
  }, function (childName) {
    return exports.getLogger("".concat(name, "/").concat(childName));
  });
};

/**
 * @param {createConsoleLogger.LoggerOptions} options new options, merge with old options
 * @returns {void}
 */
exports.configureDefaultLogger = function (options) {
  _extends(currentDefaultLoggerOptions, options);
  currentDefaultLogger = createConsoleLogger(currentDefaultLoggerOptions);
};
exports.hooks = {
  log: new SyncBailHook(["origin", "type", "args"])
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_23461__(moduleId) {
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_23461__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_23461__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_23461__.o(definition, key) && !__nested_webpack_require_23461__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__nested_webpack_require_23461__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_23461__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __nested_webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!********************************************!*\
  !*** ./client-src/modules/logger/index.js ***!
  \********************************************/
__nested_webpack_require_23461__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_23461__.d(__nested_webpack_exports__, {
/* harmony export */   "default": function() { return /* reexport default export from named module */ webpack_lib_logging_runtime_js__WEBPACK_IMPORTED_MODULE_0__; }
/* harmony export */ });
/* harmony import */ var webpack_lib_logging_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_23461__(/*! webpack/lib/logging/runtime.js */ "./node_modules/webpack/lib/logging/runtime.js");

}();
var __webpack_export_target__ = exports;
for(var i in __nested_webpack_exports__) __webpack_export_target__[i] = __nested_webpack_exports__[i];
if(__nested_webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;

/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/overlay.js":
/*!***************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/overlay.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createOverlay: () => (/* binding */ createOverlay),
/* harmony export */   formatProblem: () => (/* binding */ formatProblem)
/* harmony export */ });
/* harmony import */ var ansi_html_community__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ansi-html-community */ "../../node_modules/ansi-html-community/index.js");
/* harmony import */ var ansi_html_community__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ansi_html_community__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var html_entities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! html-entities */ "../../node_modules/html-entities/lib/index.js");
/* harmony import */ var html_entities__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(html_entities__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _overlay_runtime_error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./overlay/runtime-error.js */ "../../node_modules/webpack-dev-server/client/overlay/runtime-error.js");
/* harmony import */ var _overlay_state_machine_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./overlay/state-machine.js */ "../../node_modules/webpack-dev-server/client/overlay/state-machine.js");
/* harmony import */ var _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./overlay/styles.js */ "../../node_modules/webpack-dev-server/client/overlay/styles.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
// The error overlay is inspired (and mostly copied) from Create React App (https://github.com/facebookincubator/create-react-app)
// They, in turn, got inspired by webpack-hot-middleware (https://github.com/glenjamin/webpack-hot-middleware).






var colors = {
  reset: ["transparent", "transparent"],
  black: "181818",
  red: "E36049",
  green: "B3CB74",
  yellow: "FFD080",
  blue: "7CAFC2",
  magenta: "7FACCA",
  cyan: "C3C2EF",
  lightgrey: "EBE7E3",
  darkgrey: "6D7891"
};
ansi_html_community__WEBPACK_IMPORTED_MODULE_0___default().setColors(colors);

/**
 * @param {string} type
 * @param {string  | { file?: string, moduleName?: string, loc?: string, message?: string; stack?: string[] }} item
 * @returns {{ header: string, body: string }}
 */
function formatProblem(type, item) {
  var header = type === "warning" ? "WARNING" : "ERROR";
  var body = "";
  if (typeof item === "string") {
    body += item;
  } else {
    var file = item.file || "";
    // eslint-disable-next-line no-nested-ternary
    var moduleName = item.moduleName ? item.moduleName.indexOf("!") !== -1 ? "".concat(item.moduleName.replace(/^(\s|\S)*!/, ""), " (").concat(item.moduleName, ")") : "".concat(item.moduleName) : "";
    var loc = item.loc;
    header += "".concat(moduleName || file ? " in ".concat(moduleName ? "".concat(moduleName).concat(file ? " (".concat(file, ")") : "") : file).concat(loc ? " ".concat(loc) : "") : "");
    body += item.message || "";
  }
  if (Array.isArray(item.stack)) {
    item.stack.forEach(function (stack) {
      if (typeof stack === "string") {
        body += "\r\n".concat(stack);
      }
    });
  }
  return {
    header: header,
    body: body
  };
}

/**
 * @typedef {Object} CreateOverlayOptions
 * @property {string | null} trustedTypesPolicyName
 * @property {boolean | (error: Error) => void} [catchRuntimeError]
 */

/**
 *
 * @param {CreateOverlayOptions} options
 */
var createOverlay = function createOverlay(options) {
  /** @type {HTMLIFrameElement | null | undefined} */
  var iframeContainerElement;
  /** @type {HTMLDivElement | null | undefined} */
  var containerElement;
  /** @type {HTMLDivElement | null | undefined} */
  var headerElement;
  /** @type {Array<(element: HTMLDivElement) => void>} */
  var onLoadQueue = [];
  /** @type {TrustedTypePolicy | undefined} */
  var overlayTrustedTypesPolicy;

  /**
   *
   * @param {HTMLElement} element
   * @param {CSSStyleDeclaration} style
   */
  function applyStyle(element, style) {
    Object.keys(style).forEach(function (prop) {
      element.style[prop] = style[prop];
    });
  }

  /**
   * @param {string | null} trustedTypesPolicyName
   */
  function createContainer(trustedTypesPolicyName) {
    // Enable Trusted Types if they are available in the current browser.
    if (window.trustedTypes) {
      overlayTrustedTypesPolicy = window.trustedTypes.createPolicy(trustedTypesPolicyName || "webpack-dev-server#overlay", {
        createHTML: function createHTML(value) {
          return value;
        }
      });
    }
    iframeContainerElement = document.createElement("iframe");
    iframeContainerElement.id = "webpack-dev-server-client-overlay";
    iframeContainerElement.src = "about:blank";
    applyStyle(iframeContainerElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.iframeStyle);
    iframeContainerElement.onload = function () {
      var contentElement = /** @type {Document} */
      /** @type {HTMLIFrameElement} */
      iframeContainerElement.contentDocument.createElement("div");
      containerElement = /** @type {Document} */
      /** @type {HTMLIFrameElement} */
      iframeContainerElement.contentDocument.createElement("div");
      contentElement.id = "webpack-dev-server-client-overlay-div";
      applyStyle(contentElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.containerStyle);
      headerElement = document.createElement("div");
      headerElement.innerText = "Compiled with problems:";
      applyStyle(headerElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.headerStyle);
      var closeButtonElement = document.createElement("button");
      applyStyle(closeButtonElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.dismissButtonStyle);
      closeButtonElement.innerText = "×";
      closeButtonElement.ariaLabel = "Dismiss";
      closeButtonElement.addEventListener("click", function () {
        // eslint-disable-next-line no-use-before-define
        overlayService.send({
          type: "DISMISS"
        });
      });
      contentElement.appendChild(headerElement);
      contentElement.appendChild(closeButtonElement);
      contentElement.appendChild(containerElement);

      /** @type {Document} */
      /** @type {HTMLIFrameElement} */
      iframeContainerElement.contentDocument.body.appendChild(contentElement);
      onLoadQueue.forEach(function (onLoad) {
        onLoad( /** @type {HTMLDivElement} */contentElement);
      });
      onLoadQueue = [];

      /** @type {HTMLIFrameElement} */
      iframeContainerElement.onload = null;
    };
    document.body.appendChild(iframeContainerElement);
  }

  /**
   * @param {(element: HTMLDivElement) => void} callback
   * @param {string | null} trustedTypesPolicyName
   */
  function ensureOverlayExists(callback, trustedTypesPolicyName) {
    if (containerElement) {
      containerElement.innerHTML = "";
      // Everything is ready, call the callback right away.
      callback(containerElement);
      return;
    }
    onLoadQueue.push(callback);
    if (iframeContainerElement) {
      return;
    }
    createContainer(trustedTypesPolicyName);
  }

  // Successful compilation.
  function hide() {
    if (!iframeContainerElement) {
      return;
    }

    // Clean up and reset internal state.
    document.body.removeChild(iframeContainerElement);
    iframeContainerElement = null;
    containerElement = null;
  }

  // Compilation with errors (e.g. syntax error or missing modules).
  /**
   * @param {string} type
   * @param {Array<string  | { moduleIdentifier?: string, moduleName?: string, loc?: string, message?: string }>} messages
   * @param {string | null} trustedTypesPolicyName
   * @param {'build' | 'runtime'} messageSource
   */
  function show(type, messages, trustedTypesPolicyName, messageSource) {
    ensureOverlayExists(function () {
      headerElement.innerText = messageSource === "runtime" ? "Uncaught runtime errors:" : "Compiled with problems:";
      messages.forEach(function (message) {
        var entryElement = document.createElement("div");
        var msgStyle = type === "warning" ? _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.msgStyles.warning : _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.msgStyles.error;
        applyStyle(entryElement, _objectSpread(_objectSpread({}, msgStyle), {}, {
          padding: "1rem 1rem 1.5rem 1rem"
        }));
        var typeElement = document.createElement("div");
        var _formatProblem = formatProblem(type, message),
          header = _formatProblem.header,
          body = _formatProblem.body;
        typeElement.innerText = header;
        applyStyle(typeElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.msgTypeStyle);
        if (message.moduleIdentifier) {
          applyStyle(typeElement, {
            cursor: "pointer"
          });
          // element.dataset not supported in IE
          typeElement.setAttribute("data-can-open", true);
          typeElement.addEventListener("click", function () {
            fetch("/webpack-dev-server/open-editor?fileName=".concat(message.moduleIdentifier));
          });
        }

        // Make it look similar to our terminal.
        var text = ansi_html_community__WEBPACK_IMPORTED_MODULE_0___default()((0,html_entities__WEBPACK_IMPORTED_MODULE_4__.encode)(body));
        var messageTextNode = document.createElement("div");
        applyStyle(messageTextNode, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.msgTextStyle);
        messageTextNode.innerHTML = overlayTrustedTypesPolicy ? overlayTrustedTypesPolicy.createHTML(text) : text;
        entryElement.appendChild(typeElement);
        entryElement.appendChild(messageTextNode);

        /** @type {HTMLDivElement} */
        containerElement.appendChild(entryElement);
      });
    }, trustedTypesPolicyName);
  }
  var overlayService = (0,_overlay_state_machine_js__WEBPACK_IMPORTED_MODULE_2__["default"])({
    showOverlay: function showOverlay(_ref) {
      var _ref$level = _ref.level,
        level = _ref$level === void 0 ? "error" : _ref$level,
        messages = _ref.messages,
        messageSource = _ref.messageSource;
      return show(level, messages, options.trustedTypesPolicyName, messageSource);
    },
    hideOverlay: hide
  });
  if (options.catchRuntimeError) {
    /**
     * @param {Error | undefined} error
     * @param {string} fallbackMessage
     */
    var handleError = function handleError(error, fallbackMessage) {
      var errorObject = error instanceof Error ? error : new Error(error || fallbackMessage);
      var shouldDisplay = typeof options.catchRuntimeError === "function" ? options.catchRuntimeError(errorObject) : true;
      if (shouldDisplay) {
        overlayService.send({
          type: "RUNTIME_ERROR",
          messages: [{
            message: errorObject.message,
            stack: (0,_overlay_runtime_error_js__WEBPACK_IMPORTED_MODULE_1__.parseErrorToStacks)(errorObject)
          }]
        });
      }
    };
    (0,_overlay_runtime_error_js__WEBPACK_IMPORTED_MODULE_1__.listenToRuntimeError)(function (errorEvent) {
      // error property may be empty in older browser like IE
      var error = errorEvent.error,
        message = errorEvent.message;
      if (!error && !message) {
        return;
      }
      handleError(error, message);
    });
    (0,_overlay_runtime_error_js__WEBPACK_IMPORTED_MODULE_1__.listenToUnhandledRejection)(function (promiseRejectionEvent) {
      var reason = promiseRejectionEvent.reason;
      handleError(reason, "Unknown promise rejection reason");
    });
  }
  return overlayService;
};


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/overlay/fsm.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/overlay/fsm.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * @typedef {Object} StateDefinitions
 * @property {{[event: string]: { target: string; actions?: Array<string> }}} [on]
 */

/**
 * @typedef {Object} Options
 * @property {{[state: string]: StateDefinitions}} states
 * @property {object} context;
 * @property {string} initial
 */

/**
 * @typedef {Object} Implementation
 * @property {{[actionName: string]: (ctx: object, event: any) => object}} actions
 */

/**
 * A simplified `createMachine` from `@xstate/fsm` with the following differences:
 *
 *  - the returned machine is technically a "service". No `interpret(machine).start()` is needed.
 *  - the state definition only support `on` and target must be declared with { target: 'nextState', actions: [] } explicitly.
 *  - event passed to `send` must be an object with `type` property.
 *  - actions implementation will be [assign action](https://xstate.js.org/docs/guides/context.html#assign-action) if you return any value.
 *  Do not return anything if you just want to invoke side effect.
 *
 * The goal of this custom function is to avoid installing the entire `'xstate/fsm'` package, while enabling modeling using
 * state machine. You can copy the first parameter into the editor at https://stately.ai/viz to visualize the state machine.
 *
 * @param {Options} options
 * @param {Implementation} implementation
 */
function createMachine(_ref, _ref2) {
  var states = _ref.states,
    context = _ref.context,
    initial = _ref.initial;
  var actions = _ref2.actions;
  var currentState = initial;
  var currentContext = context;
  return {
    send: function send(event) {
      var currentStateOn = states[currentState].on;
      var transitionConfig = currentStateOn && currentStateOn[event.type];
      if (transitionConfig) {
        currentState = transitionConfig.target;
        if (transitionConfig.actions) {
          transitionConfig.actions.forEach(function (actName) {
            var actionImpl = actions[actName];
            var nextContextValue = actionImpl && actionImpl(currentContext, event);
            if (nextContextValue) {
              currentContext = _objectSpread(_objectSpread({}, currentContext), nextContextValue);
            }
          });
        }
      }
    }
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createMachine);

/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/overlay/runtime-error.js":
/*!*****************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/overlay/runtime-error.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   listenToRuntimeError: () => (/* binding */ listenToRuntimeError),
/* harmony export */   listenToUnhandledRejection: () => (/* binding */ listenToUnhandledRejection),
/* harmony export */   parseErrorToStacks: () => (/* binding */ parseErrorToStacks)
/* harmony export */ });
/**
 *
 * @param {Error} error
 */
function parseErrorToStacks(error) {
  if (!error || !(error instanceof Error)) {
    throw new Error("parseErrorToStacks expects Error object");
  }
  if (typeof error.stack === "string") {
    return error.stack.split("\n").filter(function (stack) {
      return stack !== "Error: ".concat(error.message);
    });
  }
}

/**
 * @callback ErrorCallback
 * @param {ErrorEvent} error
 * @returns {void}
 */

/**
 * @param {ErrorCallback} callback
 */
function listenToRuntimeError(callback) {
  window.addEventListener("error", callback);
  return function cleanup() {
    window.removeEventListener("error", callback);
  };
}

/**
 * @callback UnhandledRejectionCallback
 * @param {PromiseRejectionEvent} rejectionEvent
 * @returns {void}
 */

/**
 * @param {UnhandledRejectionCallback} callback
 */
function listenToUnhandledRejection(callback) {
  window.addEventListener("unhandledrejection", callback);
  return function cleanup() {
    window.removeEventListener("unhandledrejection", callback);
  };
}


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/overlay/state-machine.js":
/*!*****************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/overlay/state-machine.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _fsm_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fsm.js */ "../../node_modules/webpack-dev-server/client/overlay/fsm.js");


/**
 * @typedef {Object} ShowOverlayData
 * @property {'warning' | 'error'} level
 * @property {Array<string  | { moduleIdentifier?: string, moduleName?: string, loc?: string, message?: string }>} messages
 * @property {'build' | 'runtime'} messageSource
 */

/**
 * @typedef {Object} CreateOverlayMachineOptions
 * @property {(data: ShowOverlayData) => void} showOverlay
 * @property {() => void} hideOverlay
 */

/**
 * @param {CreateOverlayMachineOptions} options
 */
var createOverlayMachine = function createOverlayMachine(options) {
  var hideOverlay = options.hideOverlay,
    showOverlay = options.showOverlay;
  var overlayMachine = (0,_fsm_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    initial: "hidden",
    context: {
      level: "error",
      messages: [],
      messageSource: "build"
    },
    states: {
      hidden: {
        on: {
          BUILD_ERROR: {
            target: "displayBuildError",
            actions: ["setMessages", "showOverlay"]
          },
          RUNTIME_ERROR: {
            target: "displayRuntimeError",
            actions: ["setMessages", "showOverlay"]
          }
        }
      },
      displayBuildError: {
        on: {
          DISMISS: {
            target: "hidden",
            actions: ["dismissMessages", "hideOverlay"]
          },
          BUILD_ERROR: {
            target: "displayBuildError",
            actions: ["appendMessages", "showOverlay"]
          }
        }
      },
      displayRuntimeError: {
        on: {
          DISMISS: {
            target: "hidden",
            actions: ["dismissMessages", "hideOverlay"]
          },
          RUNTIME_ERROR: {
            target: "displayRuntimeError",
            actions: ["appendMessages", "showOverlay"]
          },
          BUILD_ERROR: {
            target: "displayBuildError",
            actions: ["setMessages", "showOverlay"]
          }
        }
      }
    }
  }, {
    actions: {
      dismissMessages: function dismissMessages() {
        return {
          messages: [],
          level: "error",
          messageSource: "build"
        };
      },
      appendMessages: function appendMessages(context, event) {
        return {
          messages: context.messages.concat(event.messages),
          level: event.level || context.level,
          messageSource: event.type === "RUNTIME_ERROR" ? "runtime" : "build"
        };
      },
      setMessages: function setMessages(context, event) {
        return {
          messages: event.messages,
          level: event.level || context.level,
          messageSource: event.type === "RUNTIME_ERROR" ? "runtime" : "build"
        };
      },
      hideOverlay: hideOverlay,
      showOverlay: showOverlay
    }
  });
  return overlayMachine;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createOverlayMachine);

/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/overlay/styles.js":
/*!**********************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/overlay/styles.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   containerStyle: () => (/* binding */ containerStyle),
/* harmony export */   dismissButtonStyle: () => (/* binding */ dismissButtonStyle),
/* harmony export */   headerStyle: () => (/* binding */ headerStyle),
/* harmony export */   iframeStyle: () => (/* binding */ iframeStyle),
/* harmony export */   msgStyles: () => (/* binding */ msgStyles),
/* harmony export */   msgTextStyle: () => (/* binding */ msgTextStyle),
/* harmony export */   msgTypeStyle: () => (/* binding */ msgTypeStyle)
/* harmony export */ });
// styles are inspired by `react-error-overlay`

var msgStyles = {
  error: {
    backgroundColor: "rgba(206, 17, 38, 0.1)",
    color: "#fccfcf"
  },
  warning: {
    backgroundColor: "rgba(251, 245, 180, 0.1)",
    color: "#fbf5b4"
  }
};
var iframeStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100vw",
  height: "100vh",
  border: "none",
  "z-index": 9999999999
};
var containerStyle = {
  position: "fixed",
  boxSizing: "border-box",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  width: "100vw",
  height: "100vh",
  fontSize: "large",
  padding: "2rem 2rem 4rem 2rem",
  lineHeight: "1.2",
  whiteSpace: "pre-wrap",
  overflow: "auto",
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  color: "white"
};
var headerStyle = {
  color: "#e83b46",
  fontSize: "2em",
  whiteSpace: "pre-wrap",
  fontFamily: "sans-serif",
  margin: "0 2rem 2rem 0",
  flex: "0 0 auto",
  maxHeight: "50%",
  overflow: "auto"
};
var dismissButtonStyle = {
  color: "#ffffff",
  lineHeight: "1rem",
  fontSize: "1.5rem",
  padding: "1rem",
  cursor: "pointer",
  position: "absolute",
  right: 0,
  top: 0,
  backgroundColor: "transparent",
  border: "none"
};
var msgTypeStyle = {
  color: "#e83b46",
  fontSize: "1.2em",
  marginBottom: "1rem",
  fontFamily: "sans-serif"
};
var msgTextStyle = {
  lineHeight: "1.5",
  fontSize: "1rem",
  fontFamily: "Menlo, Consolas, monospace"
};


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/socket.js":
/*!**************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/socket.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   client: () => (/* binding */ client),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _clients_WebSocketClient_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./clients/WebSocketClient.js */ "../../node_modules/webpack-dev-server/client/clients/WebSocketClient.js");
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/log.js */ "../../node_modules/webpack-dev-server/client/utils/log.js");
/* provided dependency */ var __webpack_dev_server_client__ = __webpack_require__(/*! ../../node_modules/webpack-dev-server/client/clients/WebSocketClient.js */ "../../node_modules/webpack-dev-server/client/clients/WebSocketClient.js");
/* global __webpack_dev_server_client__ */




// this WebsocketClient is here as a default fallback, in case the client is not injected
/* eslint-disable camelcase */
var Client =
// eslint-disable-next-line no-nested-ternary
typeof __webpack_dev_server_client__ !== "undefined" ? typeof __webpack_dev_server_client__.default !== "undefined" ? __webpack_dev_server_client__.default : __webpack_dev_server_client__ : _clients_WebSocketClient_js__WEBPACK_IMPORTED_MODULE_0__["default"];
/* eslint-enable camelcase */

var retries = 0;
var maxRetries = 10;

// Initialized client is exported so external consumers can utilize the same instance
// It is mutable to enforce singleton
// eslint-disable-next-line import/no-mutable-exports
var client = null;

/**
 * @param {string} url
 * @param {{ [handler: string]: (data?: any, params?: any) => any }} handlers
 * @param {number} [reconnect]
 */
var socket = function initSocket(url, handlers, reconnect) {
  client = new Client(url);
  client.onOpen(function () {
    retries = 0;
    if (typeof reconnect !== "undefined") {
      maxRetries = reconnect;
    }
  });
  client.onClose(function () {
    if (retries === 0) {
      handlers.close();
    }

    // Try to reconnect.
    client = null;

    // After 10 retries stop trying, to prevent logspam.
    if (retries < maxRetries) {
      // Exponentially increase timeout to reconnect.
      // Respectfully copied from the package `got`.
      // eslint-disable-next-line no-restricted-properties
      var retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;
      retries += 1;
      _utils_log_js__WEBPACK_IMPORTED_MODULE_1__.log.info("Trying to reconnect...");
      setTimeout(function () {
        socket(url, handlers, reconnect);
      }, retryInMs);
    }
  });
  client.onMessage(
  /**
   * @param {any} data
   */
  function (data) {
    var message = JSON.parse(data);
    if (handlers[message.type]) {
      handlers[message.type](message.data, message.params);
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (socket);

/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/utils/createSocketURL.js":
/*!*****************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/utils/createSocketURL.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @param {{ protocol?: string, auth?: string, hostname?: string, port?: string, pathname?: string, search?: string, hash?: string, slashes?: boolean }} objURL
 * @returns {string}
 */
function format(objURL) {
  var protocol = objURL.protocol || "";
  if (protocol && protocol.substr(-1) !== ":") {
    protocol += ":";
  }
  var auth = objURL.auth || "";
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ":");
    auth += "@";
  }
  var host = "";
  if (objURL.hostname) {
    host = auth + (objURL.hostname.indexOf(":") === -1 ? objURL.hostname : "[".concat(objURL.hostname, "]"));
    if (objURL.port) {
      host += ":".concat(objURL.port);
    }
  }
  var pathname = objURL.pathname || "";
  if (objURL.slashes) {
    host = "//".concat(host || "");
    if (pathname && pathname.charAt(0) !== "/") {
      pathname = "/".concat(pathname);
    }
  } else if (!host) {
    host = "";
  }
  var search = objURL.search || "";
  if (search && search.charAt(0) !== "?") {
    search = "?".concat(search);
  }
  var hash = objURL.hash || "";
  if (hash && hash.charAt(0) !== "#") {
    hash = "#".concat(hash);
  }
  pathname = pathname.replace(/[?#]/g,
  /**
   * @param {string} match
   * @returns {string}
   */
  function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace("#", "%23");
  return "".concat(protocol).concat(host).concat(pathname).concat(search).concat(hash);
}

/**
 * @param {URL & { fromCurrentScript?: boolean }} parsedURL
 * @returns {string}
 */
function createSocketURL(parsedURL) {
  var hostname = parsedURL.hostname;

  // Node.js module parses it as `::`
  // `new URL(urlString, [baseURLString])` parses it as '[::]'
  var isInAddrAny = hostname === "0.0.0.0" || hostname === "::" || hostname === "[::]";

  // why do we need this check?
  // hostname n/a for file protocol (example, when using electron, ionic)
  // see: https://github.com/webpack/webpack-dev-server/pull/384
  if (isInAddrAny && self.location.hostname && self.location.protocol.indexOf("http") === 0) {
    hostname = self.location.hostname;
  }
  var socketURLProtocol = parsedURL.protocol || self.location.protocol;

  // When https is used in the app, secure web sockets are always necessary because the browser doesn't accept non-secure web sockets.
  if (socketURLProtocol === "auto:" || hostname && isInAddrAny && self.location.protocol === "https:") {
    socketURLProtocol = self.location.protocol;
  }
  socketURLProtocol = socketURLProtocol.replace(/^(?:http|.+-extension|file)/i, "ws");
  var socketURLAuth = "";

  // `new URL(urlString, [baseURLstring])` doesn't have `auth` property
  // Parse authentication credentials in case we need them
  if (parsedURL.username) {
    socketURLAuth = parsedURL.username;

    // Since HTTP basic authentication does not allow empty username,
    // we only include password if the username is not empty.
    if (parsedURL.password) {
      // Result: <username>:<password>
      socketURLAuth = socketURLAuth.concat(":", parsedURL.password);
    }
  }

  // In case the host is a raw IPv6 address, it can be enclosed in
  // the brackets as the brackets are needed in the final URL string.
  // Need to remove those as url.format blindly adds its own set of brackets
  // if the host string contains colons. That would lead to non-working
  // double brackets (e.g. [[::]]) host
  //
  // All of these web socket url params are optionally passed in through resourceQuery,
  // so we need to fall back to the default if they are not provided
  var socketURLHostname = (hostname || self.location.hostname || "localhost").replace(/^\[(.*)\]$/, "$1");
  var socketURLPort = parsedURL.port;
  if (!socketURLPort || socketURLPort === "0") {
    socketURLPort = self.location.port;
  }

  // If path is provided it'll be passed in via the resourceQuery as a
  // query param so it has to be parsed out of the querystring in order for the
  // client to open the socket to the correct location.
  var socketURLPathname = "/ws";
  if (parsedURL.pathname && !parsedURL.fromCurrentScript) {
    socketURLPathname = parsedURL.pathname;
  }
  return format({
    protocol: socketURLProtocol,
    auth: socketURLAuth,
    hostname: socketURLHostname,
    port: socketURLPort,
    pathname: socketURLPathname,
    slashes: true
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createSocketURL);

/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/utils/getCurrentScriptSource.js":
/*!************************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/utils/getCurrentScriptSource.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @returns {string}
 */
function getCurrentScriptSource() {
  // `document.currentScript` is the most accurate way to find the current script,
  // but is not supported in all browsers.
  if (document.currentScript) {
    return document.currentScript.getAttribute("src");
  }

  // Fallback to getting all scripts running in the document.
  var scriptElements = document.scripts || [];
  var scriptElementsWithSrc = Array.prototype.filter.call(scriptElements, function (element) {
    return element.getAttribute("src");
  });
  if (scriptElementsWithSrc.length > 0) {
    var currentScript = scriptElementsWithSrc[scriptElementsWithSrc.length - 1];
    return currentScript.getAttribute("src");
  }

  // Fail as there was no script to use.
  throw new Error("[webpack-dev-server] Failed to get current script source.");
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getCurrentScriptSource);

/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/utils/log.js":
/*!*****************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/utils/log.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   logEnabledFeatures: () => (/* binding */ logEnabledFeatures),
/* harmony export */   setLogLevel: () => (/* binding */ setLogLevel)
/* harmony export */ });
/* harmony import */ var _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/logger/index.js */ "../../node_modules/webpack-dev-server/client/modules/logger/index.js");
/* harmony import */ var _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0__);

var name = "webpack-dev-server";
// default level is set on the client side, so it does not need
// to be set by the CLI or API
var defaultLevel = "info";

// options new options, merge with old options
/**
 * @param {false | true | "none" | "error" | "warn" | "info" | "log" | "verbose"} level
 * @returns {void}
 */
function setLogLevel(level) {
  _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default().configureDefaultLogger({
    level: level
  });
}
setLogLevel(defaultLevel);
var log = _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default().getLogger(name);
var logEnabledFeatures = function logEnabledFeatures(features) {
  var enabledFeatures = Object.keys(features);
  if (!features || enabledFeatures.length === 0) {
    return;
  }
  var logString = "Server started:";

  // Server started: Hot Module Replacement enabled, Live Reloading enabled, Overlay disabled.
  for (var i = 0; i < enabledFeatures.length; i++) {
    var key = enabledFeatures[i];
    logString += " ".concat(key, " ").concat(features[key] ? "enabled" : "disabled", ",");
  }
  // replace last comma with a period
  logString = logString.slice(0, -1).concat(".");
  log.info(logString);
};


/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/utils/parseURL.js":
/*!**********************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/utils/parseURL.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getCurrentScriptSource_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getCurrentScriptSource.js */ "../../node_modules/webpack-dev-server/client/utils/getCurrentScriptSource.js");


/**
 * @param {string} resourceQuery
 * @returns {{ [key: string]: string | boolean }}
 */
function parseURL(resourceQuery) {
  /** @type {{ [key: string]: string }} */
  var options = {};
  if (typeof resourceQuery === "string" && resourceQuery !== "") {
    var searchParams = resourceQuery.slice(1).split("&");
    for (var i = 0; i < searchParams.length; i++) {
      var pair = searchParams[i].split("=");
      options[pair[0]] = decodeURIComponent(pair[1]);
    }
  } else {
    // Else, get the url from the <script> this file was called with.
    var scriptSource = (0,_getCurrentScriptSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
    var scriptSourceURL;
    try {
      // The placeholder `baseURL` with `window.location.href`,
      // is to allow parsing of path-relative or protocol-relative URLs,
      // and will have no effect if `scriptSource` is a fully valid URL.
      scriptSourceURL = new URL(scriptSource, self.location.href);
    } catch (error) {
      // URL parsing failed, do nothing.
      // We will still proceed to see if we can recover using `resourceQuery`
    }
    if (scriptSourceURL) {
      options = scriptSourceURL;
      options.fromCurrentScript = true;
    }
  }
  return options;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parseURL);

/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/utils/reloadApp.js":
/*!***********************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/utils/reloadApp.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webpack/hot/emitter.js */ "../../node_modules/webpack/hot/emitter.js");
/* harmony import */ var webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./log.js */ "../../node_modules/webpack-dev-server/client/utils/log.js");



/** @typedef {import("../index").Options} Options
/** @typedef {import("../index").Status} Status

/**
 * @param {Options} options
 * @param {Status} status
 */
function reloadApp(_ref, status) {
  var hot = _ref.hot,
    liveReload = _ref.liveReload;
  if (status.isUnloading) {
    return;
  }
  var currentHash = status.currentHash,
    previousHash = status.previousHash;
  var isInitial = currentHash.indexOf( /** @type {string} */previousHash) >= 0;
  if (isInitial) {
    return;
  }

  /**
   * @param {Window} rootWindow
   * @param {number} intervalId
   */
  function applyReload(rootWindow, intervalId) {
    clearInterval(intervalId);
    _log_js__WEBPACK_IMPORTED_MODULE_1__.log.info("App updated. Reloading...");
    rootWindow.location.reload();
  }
  var search = self.location.search.toLowerCase();
  var allowToHot = search.indexOf("webpack-dev-server-hot=false") === -1;
  var allowToLiveReload = search.indexOf("webpack-dev-server-live-reload=false") === -1;
  if (hot && allowToHot) {
    _log_js__WEBPACK_IMPORTED_MODULE_1__.log.info("App hot update...");
    webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_0___default().emit("webpackHotUpdate", status.currentHash);
    if (typeof self !== "undefined" && self.window) {
      // broadcast update to window
      self.postMessage("webpackHotUpdate".concat(status.currentHash), "*");
    }
  }
  // allow refreshing the page only if liveReload isn't disabled
  else if (liveReload && allowToLiveReload) {
    var rootWindow = self;

    // use parent window for reload (in case we're in an iframe with no valid src)
    var intervalId = self.setInterval(function () {
      if (rootWindow.location.protocol !== "about:") {
        // reload immediately if protocol is valid
        applyReload(rootWindow, intervalId);
      } else {
        rootWindow = rootWindow.parent;
        if (rootWindow.parent === rootWindow) {
          // if parent equals current window we've reached the root which would continue forever, so trigger a reload anyways
          applyReload(rootWindow, intervalId);
        }
      }
    });
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reloadApp);

/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/utils/sendMessage.js":
/*!*************************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/utils/sendMessage.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* global __resourceQuery WorkerGlobalScope */

// Send messages to the outside, so plugins can consume it.
/**
 * @param {string} type
 * @param {any} [data]
 */
function sendMsg(type, data) {
  if (typeof self !== "undefined" && (typeof WorkerGlobalScope === "undefined" || !(self instanceof WorkerGlobalScope))) {
    self.postMessage({
      type: "webpack".concat(type),
      data: data
    }, "*");
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sendMsg);

/***/ }),

/***/ "../../node_modules/webpack-dev-server/client/utils/stripAnsi.js":
/*!***********************************************************************!*\
  !*** ../../node_modules/webpack-dev-server/client/utils/stripAnsi.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var ansiRegex = new RegExp(["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|"), "g");

/**
 *
 * Strip [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code) from a string.
 * Adapted from code originally released by Sindre Sorhus
 * Licensed the MIT License
 *
 * @param {string} string
 * @return {string}
 */
function stripAnsi(string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a `string`, got `".concat(typeof string, "`"));
  }
  return string.replace(ansiRegex, "");
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stripAnsi);

/***/ }),

/***/ "../../node_modules/webpack/hot/dev-server.js":
/*!****************************************************!*\
  !*** ../../node_modules/webpack/hot/dev-server.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/* globals __webpack_hash__ */
if (true) {
	/** @type {undefined|string} */
	var lastHash;
	var upToDate = function upToDate() {
		return /** @type {string} */ (lastHash).indexOf(__webpack_require__.h()) >= 0;
	};
	var log = __webpack_require__(/*! ./log */ "../../node_modules/webpack/hot/log.js");
	var check = function check() {
		module.hot
			.check(true)
			.then(function (updatedModules) {
				if (!updatedModules) {
					log(
						"warning",
						"[HMR] Cannot find update. " +
							(typeof window !== "undefined"
								? "Need to do a full reload!"
								: "Please reload manually!")
					);
					log(
						"warning",
						"[HMR] (Probably because of restarting the webpack-dev-server)"
					);
					if (typeof window !== "undefined") {
						window.location.reload();
					}
					return;
				}

				if (!upToDate()) {
					check();
				}

				__webpack_require__(/*! ./log-apply-result */ "../../node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);

				if (upToDate()) {
					log("info", "[HMR] App is up to date.");
				}
			})
			.catch(function (err) {
				var status = module.hot.status();
				if (["abort", "fail"].indexOf(status) >= 0) {
					log(
						"warning",
						"[HMR] Cannot apply update. " +
							(typeof window !== "undefined"
								? "Need to do a full reload!"
								: "Please reload manually!")
					);
					log("warning", "[HMR] " + log.formatError(err));
					if (typeof window !== "undefined") {
						window.location.reload();
					}
				} else {
					log("warning", "[HMR] Update failed: " + log.formatError(err));
				}
			});
	};
	var hotEmitter = __webpack_require__(/*! ./emitter */ "../../node_modules/webpack/hot/emitter.js");
	hotEmitter.on("webpackHotUpdate", function (currentHash) {
		lastHash = currentHash;
		if (!upToDate() && module.hot.status() === "idle") {
			log("info", "[HMR] Checking for updates on the server...");
			check();
		}
	});
	log("info", "[HMR] Waiting for update signal from WDS...");
} else {}


/***/ }),

/***/ "../../node_modules/webpack/hot/emitter.js":
/*!*************************************************!*\
  !*** ../../node_modules/webpack/hot/emitter.js ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var EventEmitter = __webpack_require__(/*! events */ "../../node_modules/events/events.js");
module.exports = new EventEmitter();


/***/ }),

/***/ "../../node_modules/webpack/hot/log-apply-result.js":
/*!**********************************************************!*\
  !*** ../../node_modules/webpack/hot/log-apply-result.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

/**
 * @param {(string | number)[]} updatedModules updated modules
 * @param {(string | number)[] | null} renewedModules renewed modules
 */
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "../../node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),

/***/ "../../node_modules/webpack/hot/log.js":
/*!*********************************************!*\
  !*** ../../node_modules/webpack/hot/log.js ***!
  \*********************************************/
/***/ ((module) => {

/** @typedef {"info" | "warning" | "error"} LogLevel */

/** @type {LogLevel} */
var logLevel = "info";

function dummy() {}

/**
 * @param {LogLevel} level log level
 * @returns {boolean} true, if should log
 */
function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

/**
 * @param {(msg?: string) => void} logFn log function
 * @returns {(level: LogLevel, msg?: string) => void} function that logs when log level is sufficient
 */
function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

/**
 * @param {LogLevel} level log level
 * @param {string|Error} msg message
 */
module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

/**
 * @param {LogLevel} level log level
 */
module.exports.setLogLevel = function (level) {
	logLevel = level;
};

/**
 * @param {Error} err error
 * @returns {string} formatted error
 */
module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),

/***/ "../kartoffelgames.core/library/source/algorithm/myers-diff.js":
/*!*********************************************************************!*\
  !*** ../kartoffelgames.core/library/source/algorithm/myers-diff.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangeState = exports.MyersDiff = void 0;
class MyersDiff {
    /**
     * Constructor.
     * @param pCompareFunction - Compare function to compare two items.
     */
    constructor(pCompareFunction) {
        this.mCompareFunction = pCompareFunction;
    }
    /**
     * Get differences of the two item lists.
     * @param pItemListA - Item list A.
     * @param pItemListB - Item list B.
     */
    differencesOf(pItemListA, pItemListB) {
        // Save farthest-right points with it histories.
        const lFrontierList = { 1: { x: 0, history: [] } };
        // "Convert" Zero index to One index.
        const lOneIndex = (pId) => pId - 1;
        const lLengthA = pItemListA.length;
        const lLengthB = pItemListB.length;
        let lHistoryList;
        let lX;
        for (let lD = 0; lD < lLengthA + lLengthB + 1; lD++) {
            for (let lK = -lD; lK < lD + 1; lK += 2) {
                // Check if next move goes down or right.
                const lGoesDown = (lK === -lD || (lK !== lD && lFrontierList[lK - 1].x < lFrontierList[lK + 1].x));
                // Get starting diagonal point.
                if (lGoesDown) {
                    const lNextFrontier = lFrontierList[lK + 1];
                    lX = lNextFrontier.x;
                    lHistoryList = lNextFrontier.history;
                }
                else {
                    const lNextFrontier = lFrontierList[lK - 1];
                    lX = lNextFrontier.x + 1;
                    lHistoryList = lNextFrontier.history;
                }
                // Copy history list.
                lHistoryList = lHistoryList.slice();
                let lY = lX - lK;
                // Only start tracking history on valid track. Staring point (0,0) should not be tracked.
                if (1 <= lY && lY <= lLengthB && lGoesDown) {
                    lHistoryList.push({ changeState: ChangeState.Insert, item: pItemListB[lOneIndex(lY)] });
                }
                else if (1 <= lX && lX <= lLengthA) {
                    lHistoryList.push({ changeState: ChangeState.Remove, item: pItemListA[lOneIndex(lX)] });
                }
                // Move diagonal as long as possible.
                while (lX < lLengthA && lY < lLengthB && this.mCompareFunction(pItemListA[lOneIndex(lX + 1)], pItemListB[lOneIndex(lY + 1)])) {
                    lX += 1;
                    lY += 1;
                    lHistoryList.push({ changeState: ChangeState.Keep, item: pItemListA[lOneIndex(lX)] });
                }
                // Check if in the bottom right. If not save frontier.
                if (lX >= lLengthA && lY >= lLengthB) {
                    // Return found history.
                    return lHistoryList;
                }
                else {
                    lFrontierList[lK] = { x: lX, history: lHistoryList };
                }
            }
        }
        // Empty array for typescript. This area is never reached.
        /* istanbul ignore next */
        return new Array();
    }
}
exports.MyersDiff = MyersDiff;
var ChangeState;
(function (ChangeState) {
    ChangeState[ChangeState["Remove"] = 1] = "Remove";
    ChangeState[ChangeState["Insert"] = 2] = "Insert";
    ChangeState[ChangeState["Keep"] = 3] = "Keep";
})(ChangeState || (exports.ChangeState = ChangeState = {}));
//# sourceMappingURL=myers-diff.js.map

/***/ }),

/***/ "../kartoffelgames.core/library/source/data_container/dictionary.js":
/*!**************************************************************************!*\
  !*** ../kartoffelgames.core/library/source/data_container/dictionary.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Dictionary = void 0;
const list_1 = __webpack_require__(/*! ./list */ "../kartoffelgames.core/library/source/data_container/list.js");
const exception_1 = __webpack_require__(/*! ../exception/exception */ "../kartoffelgames.core/library/source/exception/exception.js");
/**
 * Wrapper for {@link Map}.
 * Extended by {@link Dictionary.add}, {@link Dictionary.getAllKeysOfValue}, {@link Dictionary.getOrDefault} and {@link Dictionary.map}.
 *
 * @typeParam TKey - Type of objects defined for keys.
 * @typeParam TValue - Type of objects defined for values.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map}
 *
 * @public
 */
class Dictionary extends Map {
    /**
     * Add value and key to dictionary.
     * Throws {@link Exception}  for any added dublicate key.
     *
     * @param pKey - Key of item.
     * @param pValue - value of item.
     *
     * @throws
     * On any dublicate key set,
     *
     * @example Adding a new and existing key.
     * ```TypeScript
     * const dictionary = new Dictionary<string, number>();
     * dictionary.add('a', 4); // => OK
     * dictionary.add('a', 4); // => Fail: Dublicate key.
     * ```
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
     * Create new dicionary and add same keys and values.
     * @see {@link ICloneable.clone}
     *
     * @returns cloned dictionary with shallow copied key and value refernces.
     *
     * @example Clone and compare dictionary and dictionary items.
     * ```TypeScript
     * const dictionary = new Dictionary<string, object>();
     * dictionary.set('a', new Object());
     *
     * const clone = dictionary.clone();
     *
     * const areSame = dictionary === clone; // => False
     * const itemSame = dictionary.get('a') === clone.get('a'); // => True
     * ```
     */
    clone() {
        return new Dictionary(this);
    }
    /**
     * Get all keys that have the set value.
     *
     * @param pValue - Value.
     *
     * @returns all keys that hold the specified value.
     *
     * @example Get keys of a value.
     * ```TypeScript
     * const dictionary = new Dictionary<string, number>();
     * dictionary.set('a', 1);
     * dictionary.set('b', 2);
     * dictionary.set('c', 1);
     *
     * const keys = dictionary.getAllKeysOfValue(1); // => ['a', 'c']
     * ```
     */
    getAllKeysOfValue(pValue) {
        // Add entries iterator to list and filter for pValue = Value
        const lKeyValuesWithValue = [...this.entries()].filter((pItem) => {
            return pItem[1] === pValue;
        });
        // Get only keys of key values.
        const lKeysOfKeyValue = lKeyValuesWithValue.map((pItem) => {
            return pItem[0];
        });
        return lKeysOfKeyValue;
    }
    /**
     * Get item. If the key does not exists the default value gets returned.
     * @param pKey - Key of item.
     * @param pDefault - Default value if key was not found.
     *
     * @returns value of the key. If the key does not exists the default value gets returned.
     *
     * @example Get value or default from a existing and none existing key.
     * ```TypeScript
     * const dictionary = new Dictionary<string, number>();
     * dictionary.set('a', 1);
     *
     * const keyA = dictionary.getOrDefault('a', 22); // => 1
     * const keyZ = dictionary.getOrDefault('z', 22); // => 22
     * ```
     */
    getOrDefault(pKey, pDefault) {
        const lValue = this.get(pKey);
        if (typeof lValue !== 'undefined') {
            return lValue;
        }
        return pDefault;
    }
    /**
     * Maps information into new list.
     * @param pFunction - Mapping funktion.
     *
     * @typeParam T - Result type of mapping resolver function.
     *
     * @returns mapped data for each item.
     *
     * @example Remap all dictionary values by adding a number to all values.
     * ```TypeScript
     * const dictionary = new Dictionary<string, number>();
     * dictionary.set('a', 1);
     * dictionary.set('b', 2);
     *
     * const list = dictionary.map((key, value) => value + 1); //  => [2, 3]
     * ```
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

/***/ "../kartoffelgames.core/library/source/data_container/list.js":
/*!********************************************************************!*\
  !*** ../kartoffelgames.core/library/source/data_container/list.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.List = void 0;
/**
 * Wrapper for {@link Array}.
 *
 * @typeParam T - Type of items of list.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array}
 *
 * @public
 */
class List extends Array {
    /**
     * Create list and add items.
     * Prevents spread operator with number arrays to initialize array with length instead of item.
     *
     * @param pItemList - Items.
     *
     * @example Create new list with `newListWith` and failing creation with the native `Array` constructor.
     * ```TypeScript
     * const newList = List.newListWith<number>(...[3]); // => [3]
     * const newListWrong = new List<number>(...[3]);    // => [undefined, undefined, undefined]
     * ```
     */
    static newListWith(...pItemList) {
        const lNewList = new List();
        lNewList.push(...pItemList);
        return lNewList;
    }
    /**
     * Remove every item.
     *
     * @example Clear a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 2, 3);
     * list.clear();
     *
     * console.log(list.length); // => 0
     * ```
     */
    clear() {
        this.splice(0, this.length);
    }
    /**
     * Create new list and add same items.
     * @see {@link ICloneable.clone}
     *
     * @returns cloned list with shallow copied item refernces.
     *
     * @example Clone and compare list and list items.
     * ```TypeScript
     * const list = List.newListWith<object>(new Object());
     *
     * const clone = list.clone();
     *
     * const areSame = list === clone; // => False
     * const itemSame = list[0] === list[0]; // => True
     * ```
     */
    clone() {
        return List.newListWith(...this);
    }
    /**
     * Copy distinct values into new list.
     *
     * @returns new list instance with only distinct values.
     *
     * @example Create a new list with dublicates and create a new distinct list out of it.
     * ```TypeScript
     * const listWithDublicates = List.newListWith<number>(1, 1, 2, 3, 3);
     * const distinctList = listWithDublicates.distinct(); // => [1, 2, 3]
     * ```
     */
    distinct() {
        return List.newListWith(...new Set(this));
    }
    /**
     * Compares this array with the specified one.
     * Compares length and every item by reference and order.
     * Does only shallow compare item references.
     *
     * @param pArray - Array to compare.
     *
     * @returns true for equality.
     *
     * @example Compare two arrays with a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 3, 2);
     *
     * const isEqual = list.equals([1, 3, 2]) // => True
     * const isUnequal = list.equals([1, 2, 3]) // => False
     * ```
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
     * Removes the first appearence of a value.
     *
     * @param pValue - Target value to remove.
     *
     * @returns removed element. When no element was removed, undefined is returned instead.
     *
     * @example Remove a existing and a none existing item of a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 3, 2);
     *
     * const removedElement = list.remove(1); // => 1
     * const noneExistingElement = list.remove(4); // => undefined
     * ```
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
     *
     * @param pOldValue - Target value to replace.
     * @param pNewValue - Replacement value.
     *
     * @returns replaced element. When no element was replaced, undefined is returned instead.
     *
     * @example Replace a existing and a none existing item of a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 5, 3);
     *
     * const removedElement = list.replace(5, 2); // => 5
     * const noneExistingElement = list.replace(4, 3); // => undefined
     *
     * console.log(list); // => [1, 2, 3]
     * ```
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
     * Returns a string representation of this list.
     * @override base objects {@link Array.toString}
     *
     * @returns string representation for this list.
     *
     * @example Output a string representation of a list.
     * ```TypeScript
     * const list = List.newListWith<number>(1, 2, 3);
     * console.log(list.toString()); // => [1, 2, 3]
     * ```
     */
    toString() {
        return `[${super.join(', ')}]`;
    }
}
exports.List = List;
//# sourceMappingURL=list.js.map

/***/ }),

/***/ "../kartoffelgames.core/library/source/data_container/stack.js":
/*!*********************************************************************!*\
  !*** ../kartoffelgames.core/library/source/data_container/stack.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Stack = void 0;
/**
 * Simple and fast stack implementation based on references.
 *
 * @public
 */
class Stack {
    /**
     * Get current stack size.
     */
    get size() {
        return this.mSize;
    }
    /**
     * Current top item of stack.
     * Returns undefined when no item is stacked.
     */
    get top() {
        // Undefined when no item is stacked.
        if (!this.mTopItem) {
            return undefined;
        }
        return this.mTopItem.value;
    }
    /**
     * Constructor.
     */
    constructor() {
        this.mTopItem = null;
        this.mSize = 0;
    }
    /**
     * Clones the references of all stack items into a new one.
     * Does only shallow copy.
     *
     * @returns The cloned stack.
     */
    clone() {
        const lClonedStack = new Stack();
        // Only thing that needs to be cloned is the current reference.
        lClonedStack.mTopItem = this.mTopItem;
        lClonedStack.mSize = this.mSize;
        return lClonedStack;
    }
    /**
     * Iterates over each stack entry in reversed (newest...oldest) order.
     *
     * @returns Generator.
     */
    *entries() {
        let lCurrentItem = this.mTopItem;
        while (lCurrentItem !== null) {
            yield lCurrentItem.value;
            lCurrentItem = lCurrentItem.previous;
        }
    }
    /**
     * Clear stack and get all stacked items in stack order.
     *
     * @returns All stacked values in top to down order.
     *
     * @example Flush Stack
     * ``` Typescript
     * const stack = new Stack<number>();
     * stack.push(1);
     * stack.push(2);
     * stack.push(3);
     *
     * // Flush all items. Clears stack.
     * const stackValues = stack.flush(); // => [3, 2, 1];
     * console.log(stack.top); // => undefined
     * ```
     */
    flush() {
        const lValueList = new Array();
        // Pop items as long as there are stack items.
        // Don't check poped value as next indicator as it can contain undefined.
        while (this.mTopItem) {
            lValueList.push(this.pop());
        }
        return lValueList;
    }
    /**
     * Removes the current top item of stack.
     * When no item is stacked nothing happends and undefined is returned.
     *
     * @returns Current top item. When no item was stacked, undefined is returned instead.
     *
     * @example Pop current top item.
     * ``` Typescript
     * const stack = new Stack<number>();
     * stack.push(1);
     * stack.push(2);
     * stack.push(3);
     *
     * // Check current stacked top item before and after poping.
     * console.log(stack.top); // => 3
     * const stackValues = stack.pop(); // => 3;
     * console.log(stack.top); // => 2
     * ```
     */
    pop() {
        // Undefined when no item is stacked.
        if (!this.mTopItem) {
            return undefined;
        }
        // Buffer current top value.
        const lCurrentTopValue = this.mTopItem.value;
        // Replace current top item with previous stacked.
        this.mTopItem = this.mTopItem.previous;
        this.mSize--;
        return lCurrentTopValue;
    }
    /**
     * Push new value as top item of stack. Replaces the current top item.
     * @param pValue - Next value placed on top.
     *
     * @example Push next top item.
     * ``` Typescript
     * const stack = new Stack<number>();
     * stack.push(1);

     *
     * // Check current stacked top item before and after pushing.
     * console.log(stack.top); // => 1
     * stack.push(2);
     * console.log(stack.top); // => 2
     * ```
     */
    push(pValue) {
        // Create new stack item with the current top item as reference. 
        const lNextItem = {
            previous: this.mTopItem,
            value: pValue
        };
        // Replace current top item with next.
        this.mTopItem = lNextItem;
        this.mSize++;
    }
    /**
     * Converts this stack into an array.
     * The first item in the array is the last item pushed into the stack.
     *
     * @returns The current stack as array.
     *
     * @example Stack into array.
     * ``` Typescript
     * const stack = new Stack<number>();
     * stack.push(1);
     * stack.push(2);
     * stack.push(3);
     *
     * // Stack to array.
     * console.log(stack.toArray()); // => [3, 2, 1]
     * ```
     */
    toArray() {
        // Convert genertor into array.
        return [...this.entries()];
    }
}
exports.Stack = Stack;
//# sourceMappingURL=stack.js.map

/***/ }),

/***/ "../kartoffelgames.core/library/source/exception/exception.js":
/*!********************************************************************!*\
  !*** ../kartoffelgames.core/library/source/exception/exception.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Exception = void 0;
/**
 * Extends {@link Error} by a {@link Exception.target} reference.
 *
 * @typeParam T - Exception target type.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error}
 *
 * @public
 */
class Exception extends Error {
    /**
     * Target of exception.
     *
     * @readonly
     */
    get target() {
        return this.mTarget;
    }
    /**
     * Constructor.
     * @param pMessage - Messsage of exception.
     * @param pTarget - Target of exception.
     * @param pErrorOptions - Optional error options.
     */
    constructor(pMessage, pTarget, pErrorOptions) {
        super(pMessage, pErrorOptions);
        this.mTarget = pTarget;
    }
}
exports.Exception = Exception;
//# sourceMappingURL=exception.js.map

/***/ }),

/***/ "../kartoffelgames.core/library/source/index.js":
/*!******************************************************!*\
  !*** ../kartoffelgames.core/library/source/index.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/* istanbul ignore file */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MyersDiff = exports.ChangeState = exports.TypeUtil = exports.EnumUtil = exports.Stack = exports.Exception = exports.List = exports.Dictionary = void 0;
/**
 * Library for data container and easier data access.
 *
 * @remarks
 * This package consists mostly of helper classes and storage types, aimed at reducing code redundance and improving clarity.
 *
 * @packageDocumentation
 */
// Container.
var dictionary_1 = __webpack_require__(/*! ./data_container/dictionary */ "../kartoffelgames.core/library/source/data_container/dictionary.js");
Object.defineProperty(exports, "Dictionary", ({ enumerable: true, get: function () { return dictionary_1.Dictionary; } }));
var list_1 = __webpack_require__(/*! ./data_container/list */ "../kartoffelgames.core/library/source/data_container/list.js");
Object.defineProperty(exports, "List", ({ enumerable: true, get: function () { return list_1.List; } }));
var exception_1 = __webpack_require__(/*! ./exception/exception */ "../kartoffelgames.core/library/source/exception/exception.js");
Object.defineProperty(exports, "Exception", ({ enumerable: true, get: function () { return exception_1.Exception; } }));
var stack_1 = __webpack_require__(/*! ./data_container/stack */ "../kartoffelgames.core/library/source/data_container/stack.js");
Object.defineProperty(exports, "Stack", ({ enumerable: true, get: function () { return stack_1.Stack; } }));
// Handler.
var enum_util_1 = __webpack_require__(/*! ./util/enum-util */ "../kartoffelgames.core/library/source/util/enum-util.js");
Object.defineProperty(exports, "EnumUtil", ({ enumerable: true, get: function () { return enum_util_1.EnumUtil; } }));
var type_util_1 = __webpack_require__(/*! ./util/type-util */ "../kartoffelgames.core/library/source/util/type-util.js");
Object.defineProperty(exports, "TypeUtil", ({ enumerable: true, get: function () { return type_util_1.TypeUtil; } }));
// Algorythms
var myers_diff_1 = __webpack_require__(/*! ./algorithm/myers-diff */ "../kartoffelgames.core/library/source/algorithm/myers-diff.js");
Object.defineProperty(exports, "ChangeState", ({ enumerable: true, get: function () { return myers_diff_1.ChangeState; } }));
Object.defineProperty(exports, "MyersDiff", ({ enumerable: true, get: function () { return myers_diff_1.MyersDiff; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../kartoffelgames.core/library/source/util/enum-util.js":
/*!***************************************************************!*\
  !*** ../kartoffelgames.core/library/source/util/enum-util.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EnumUtil = void 0;
/**
 * Static helper type to read data from enum objects.
 *
 * @public
 */
class EnumUtil {
    /**
     * Infers value into enum type.
     * When the values can not be infered into the specified enum, undefined is returned.
     *
     * @param pEnum - typeof Enum object.
     * @param pValue - Value of enum.
     *
     * @typeParam T - Enum type the value should be infered into.
     *
     * @returns Infered `pValue` parameter or undefined when the value does not exists as the enums value.
     *
     * @example Try to cast two possible enum values.
     * ``` Typescript
     * enum MyEnum {
     *     Entry1 = 1,
     *     Entry2 = 2
     * }
     *
     * const existingValue = EnumUtil.cast<MyEnum>(MyEnum, 1); // => MyEnum.Entry1
     * const noneExistingValue = EnumUtil.cast<MyEnum>(MyEnum, 5); // => undefined
     * ```
     */
    static cast(pEnum, pValue) {
        // Thats it... :)
        if (EnumUtil.exists(pEnum, pValue)) {
            return pValue;
        }
        else {
            return undefined;
        }
    }
    /**
     * Check value existence on a enum object.
     * Infers `pValue` parameter as enum type.
     * @param pEnum - typeof Enum object.
     * @param pValue - Value of enum.
     *
     * @typeParam T - Enum type the value should be infered into.
     *
     * @returns True when the value can be casted into enum.
     *
     * @example Check existence of one two possible enum values.
     * ``` Typescript
     * enum MyEnum {
     *     Entry1 = 1,
     *     Entry2 = 2
     * }
     *
     * const existingValue = EnumUtil.exists(MyEnum, 1); // => True
     * const noneExistingValue = EnumUtil.exists(MyEnum, 5); // => False
     * ```
     */
    static exists(pEnum, pValue) {
        return EnumUtil.valuesOf(pEnum).includes(pValue);
    }
    /**
     * Return all keys of an enum as array.
     *
     * @param pEnum - typeof Enum object.
     *
     * @returns All enum key as array in defined order.
     *
     * @remarks
     * Does only work for number enums and should fail for mixed or string enums.
     *
     * @example Read enum names from custom enum object.
     * ``` Typescript
     * enum MyEnum {
     *     Entry1 = 1,
     *     Entry2 = 2
     * }
     *
     * const enumNames = EnumUtil.namesOf(MyEnum); // => ['Entry1', 'Entry2']
     * ```
     */
    static namesOf(pEnum) {
        // Convert enum to key array.
        return Object.keys(pEnum).filter((pKey) => isNaN(Number(pKey)));
    }
    /**
     * Return all values of an enum as array.
     *
     * @param pEnum - typeof Enum object.
     *
     * @typeParam T - Enum value type.
     *
     * @returns All enum values as array in defined order.
     *
     * @example Read enum values from custom enum object.
     * ``` Typescript
     * enum MyEnum {
     *     Entry1 = 1,
     *     Entry2 = 2
     * }
     *
     * const enumValues = EnumUtil.valuesOf(MyEnum); // => [1, 2]
     * ```
     */
    static valuesOf(pEnum) {
        const lEnumValues = new Array();
        // Convert enum to vaue array by iterating over all keys.
        for (const lKey of EnumUtil.namesOf(pEnum)) {
            lEnumValues.push(pEnum[lKey]);
        }
        return lEnumValues;
    }
}
exports.EnumUtil = EnumUtil;
//# sourceMappingURL=enum-util.js.map

/***/ }),

/***/ "../kartoffelgames.core/library/source/util/type-util.js":
/*!***************************************************************!*\
  !*** ../kartoffelgames.core/library/source/util/type-util.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TypeUtil = void 0;
/**
 * Static helper type to read data from objects.
 *
 * @public
 */
class TypeUtil {
    /**
     * Get name of objects property.
     * @param pName - Property name.
     *
     * @typeParam T - Object with any string key property.
     *
     * @returns the name of property.
     *
     * @remarks
     * Acts more as a type safe way of accessing property names of a type.
     *
     * @example Read enum names from custom enum object.
     * ``` Typescript
     * class MyClass {
     *    public myProperty: number = 1;
     * }
     *
     * const propertyName = TypeUtil.nameOf<MyClass>('myProperty'); // => 'myProperty'
     * ```
     *
     * @experimental @alpha
     */
    static nameOf(pName) {
        return pName;
    }
}
exports.TypeUtil = TypeUtil;
//# sourceMappingURL=type-util.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/configuration/device-configuration.js":
/*!*********************************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/configuration/device-configuration.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeviceConfiguration = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
class DeviceConfiguration {
    /**
     * Get all key actions.
     */
    get keyActions() {
        return this.mButtonActions.map((pKey, pValue) => {
            return { name: pKey, buttons: [...pValue] };
        });
    }
    /**
     * Tolerance on wich buttons and axis are marked as pressed.
     */
    get triggerTolerance() {
        return this.mTriggerTolerance;
    }
    set triggerTolerance(pTolerance) {
        this.mTriggerTolerance = pTolerance;
    }
    /**
     * Constructor.
     */
    constructor() {
        this.mTriggerTolerance = 0;
        this.mButtonActions = new core_1.Dictionary();
        this.mActionsButtons = new core_1.Dictionary();
    }
    /**
     * Add key actions.
     * @param pName - Action name.
     * @param pButtons - Buttons binded to action.
     */
    addAction(pName, pButtons) {
        this.mButtonActions.set(pName, new Set(pButtons));
        // Map keys to actions. 
        for (const lKey of pButtons) {
            // Init action list.
            if (!this.mActionsButtons.has(lKey)) {
                this.mActionsButtons.set(lKey, new Set());
            }
            this.mActionsButtons.get(lKey).add(pName);
        }
    }
    /**
     * Clone device configuration.
     */
    clone() {
        const lClone = new DeviceConfiguration();
        // Trigger tolerance.
        lClone.triggerTolerance = this.triggerTolerance;
        // Copy actions.
        for (const lAction of this.mButtonActions) {
            lClone.addAction(lAction[0], [...lAction[1]]);
        }
        return lClone;
    }
    /**
     * Get keys of actions.
     * @param pActionName - Action name.
     */
    getActionButtons(pActionName) {
        return [...(this.mButtonActions.get(pActionName) ?? [])];
    }
    /**
     * Get all actions asigned to button.
     * @param pButton - Button.
     */
    getActionOfButton(pButton) {
        // Copy Set to array.
        return [...(this.mActionsButtons.get(pButton) ?? [])];
    }
}
exports.DeviceConfiguration = DeviceConfiguration;
//# sourceMappingURL=device-configuration.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/configuration/gamepad-button-mapping.js":
/*!***********************************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/configuration/gamepad-button-mapping.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamepadButtonMapping = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const button_value_type_enum_1 = __webpack_require__(/*! ../enum/button-value-type.enum */ "../kartoffelgames.web.game_input/library/source/enum/button-value-type.enum.js");
/**
 * Gamepad mapping.
 */
class GamepadButtonMapping {
    /**
     * Constructor.
     */
    constructor(pMapping) {
        this.mMapping = new core_1.Dictionary();
        // Apply optional mapping.
        if (pMapping) {
            for (const lButton of Object.keys(pMapping)) {
                const lButtonMapping = pMapping[lButton];
                this.addMapping(lButton, lButtonMapping.type, lButtonMapping.index);
            }
        }
    }
    /**
     * Add button mapping.
     * @param pButton - Button.
     * @param pButtonType - Type of button.
     * @param pButtonIndex - Mapped index.
     */
    addMapping(pButton, pButtonType, pButtonIndex) {
        this.mMapping.set(pButton, { type: pButtonType, index: pButtonIndex });
    }
    /**
     * Get button value of mapped button.
     * Unmapped buttons return allways zero.
     * @param pButton - Button.
     * @param pGamepad - Gamepad data.
     */
    executeMapping(pButton, pGamepad) {
        const lButtonMapping = this.mMapping.get(pButton);
        // Return unpressed value on all unmapped buttons. 
        if (!lButtonMapping) {
            return 0;
        }
        // Access correct button array for axis or button  buttons.
        if (lButtonMapping.type === button_value_type_enum_1.ButtonValueType.Button) {
            return pGamepad.buttons[lButtonMapping.index]?.value ?? 0;
        }
        else { // Axis.   
            return pGamepad.axes[lButtonMapping.index] ?? 0;
        }
    }
}
exports.GamepadButtonMapping = GamepadButtonMapping;
//# sourceMappingURL=gamepad-button-mapping.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/configuration/input-configuration.js":
/*!********************************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/configuration/input-configuration.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InputConfiguration = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const button_value_type_enum_1 = __webpack_require__(/*! ../enum/button-value-type.enum */ "../kartoffelgames.web.game_input/library/source/enum/button-value-type.enum.js");
const gamepad_button_mapping_1 = __webpack_require__(/*! ./gamepad-button-mapping */ "../kartoffelgames.web.game_input/library/source/configuration/gamepad-button-mapping.js");
class InputConfiguration {
    /**
     * Constructor.
     */
    constructor(pDefault) {
        this.mGampadMappingList = new Array();
        this.mDeviceSettings = new core_1.Dictionary();
        this.mDefaultDevice = pDefault;
        // Gamepad mapping.
        this.mGampadMappingList = new Array();
        this.mStandardGamepadMapping = new gamepad_button_mapping_1.GamepadButtonMapping({
            clusterButtonBottom: { type: button_value_type_enum_1.ButtonValueType.Button, index: 0 },
            clusterButtonRight: { type: button_value_type_enum_1.ButtonValueType.Button, index: 1 },
            clusterButtonLeft: { type: button_value_type_enum_1.ButtonValueType.Button, index: 2 },
            clusterButtonTop: { type: button_value_type_enum_1.ButtonValueType.Button, index: 3 },
            buttonLeft: { type: button_value_type_enum_1.ButtonValueType.Button, index: 4 },
            buttonRight: { type: button_value_type_enum_1.ButtonValueType.Button, index: 5 },
            triggerLeft: { type: button_value_type_enum_1.ButtonValueType.Button, index: 6 },
            triggerRight: { type: button_value_type_enum_1.ButtonValueType.Button, index: 7 },
            selectButton: { type: button_value_type_enum_1.ButtonValueType.Button, index: 8 },
            startButton: { type: button_value_type_enum_1.ButtonValueType.Button, index: 9 },
            homeButton: { type: button_value_type_enum_1.ButtonValueType.Button, index: 16 },
            directionalPadTop: { type: button_value_type_enum_1.ButtonValueType.Button, index: 12 },
            directionalPadBottom: { type: button_value_type_enum_1.ButtonValueType.Button, index: 13 },
            directionalPadRight: { type: button_value_type_enum_1.ButtonValueType.Button, index: 15 },
            directionalPadLeft: { type: button_value_type_enum_1.ButtonValueType.Button, index: 14 },
            leftThumbStickButton: { type: button_value_type_enum_1.ButtonValueType.Button, index: 10 },
            leftThumbStickXaxis: { type: button_value_type_enum_1.ButtonValueType.Axis, index: 0 },
            leftThumbStickYaxis: { type: button_value_type_enum_1.ButtonValueType.Axis, index: 1 },
            rightThumbStickButton: { type: button_value_type_enum_1.ButtonValueType.Button, index: 11 },
            rightThumbStickXaxis: { type: button_value_type_enum_1.ButtonValueType.Axis, index: 2 },
            rightThumbStickYaxis: { type: button_value_type_enum_1.ButtonValueType.Axis, index: 3 },
        });
    }
    /**
     * Add gamepad mapping by id matching.
     * @param pIdAssignment - Regex for assigning to matching gamepad ids.
     * @param pMapping - Gamepad mapping.
     */
    addGamepadMapping(pIdAssignment, pMapping) {
        this.mGampadMappingList.push({ mapping: pMapping, idMatch: pIdAssignment });
    }
    /**
     * Get device settings.
     * @param pDeviceId - Device id.
     */
    deviceConfiguration(pDeviceId) {
        // Init device with cloned default configuration.
        if (!this.mDeviceSettings.has(pDeviceId)) {
            const lDefaultClone = this.mDefaultDevice.clone();
            this.mDeviceSettings.set(pDeviceId, lDefaultClone);
        }
        return this.mDeviceSettings.get(pDeviceId);
    }
    /**
     * Get mapping of gamepad.
     * @param pGamepadId - Manufacturer id of gamepad.
     */
    getGampadMapping(pGamepadId, pGamepadMappingType) {
        for (const lMappingAssignment of this.mGampadMappingList) {
            if (lMappingAssignment.idMatch.test(pGamepadId)) {
                return lMappingAssignment.mapping;
            }
        }
        // Map with gamepad mapping type.
        if (pGamepadMappingType === 'standard') {
            return this.mStandardGamepadMapping;
        }
        return this.mStandardGamepadMapping;
    }
}
exports.InputConfiguration = InputConfiguration;
//# sourceMappingURL=input-configuration.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/connector/gamepad-connector.js":
/*!**************************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/connector/gamepad-connector.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamepadConnector = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gamepad_input_device_1 = __webpack_require__(/*! ../device/gamepad-input-device */ "../kartoffelgames.web.game_input/library/source/device/gamepad-input-device.js");
/**
 * Handles connect and disconnection of gamepads.
 */
class GamepadConnector {
    static { this.mGamepads = new core_1.Dictionary(); }
    /**
     * Constructor.
     * Initialize connecting and disconnecting gamepads.
     */
    init(pDevices) {
        // Init connected gamepads.
        window.addEventListener('gamepadconnected', (pEvent) => {
            this.connectGamepad(pEvent.gamepad, pDevices);
        });
        // Deconstruct disconnected gamepads.
        window.addEventListener('gamepaddisconnected', (pEvent) => {
            this.disconnectGamepad(pEvent.gamepad, pDevices);
        });
        // Init gamepads that are connected before constructor call.
        for (const lGamepad of globalThis.navigator.getGamepads()) {
            if (lGamepad !== null) {
                this.connectGamepad(lGamepad, pDevices);
            }
        }
    }
    /**
     * Init gamepad.
     * Applies gamepad button mapping.
     * @param pGamepad - Gamepad
     */
    connectGamepad(pGamepad, pDevices) {
        // Enable gamepad when already created.
        if (GamepadConnector.mGamepads.has(pGamepad.index)) {
            pDevices.registerDevice(GamepadConnector.mGamepads.get(pGamepad.index));
            return;
        }
        // Try to find mappig by id assignment.
        const lFoundMapping = pDevices.configuration.getGampadMapping(pGamepad.id, pGamepad.mapping);
        // Build general gamepad information.
        const lGamepadInformation = {
            index: pGamepad.index,
            id: pGamepad.id,
            mapping: lFoundMapping
        };
        const lGamepadInput = new gamepad_input_device_1.GamepadInputDevice(lGamepadInformation, pDevices.configuration);
        // Add GamepadGameInput to local store.
        GamepadConnector.mGamepads.add(pGamepad.index, lGamepadInput);
        // Add gamepad to global input devices.
        pDevices.registerDevice(lGamepadInput);
    }
    /**
     * Desconstruct gamepad.
     * @param pGamepad - Gamepad.
     */
    disconnectGamepad(pGamepad, pDevices) {
        // Only disconnect GamepadInput
        if (GamepadConnector.mGamepads.has(pGamepad.index)) {
            pDevices.unregisterDevice(GamepadConnector.mGamepads.get(pGamepad.index));
        }
    }
}
exports.GamepadConnector = GamepadConnector;
//# sourceMappingURL=gamepad-connector.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/connector/mouse-keyboard-connector.js":
/*!*********************************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/connector/mouse-keyboard-connector.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MouseKeyboardConnector = void 0;
const mouse_keyboard_input_device_1 = __webpack_require__(/*! ../device/mouse-keyboard-input-device */ "../kartoffelgames.web.game_input/library/source/device/mouse-keyboard-input-device.js");
class MouseKeyboardConnector {
    /**
     * Init keyboard and mouse input devices.
     */
    init(pDevices) {
        pDevices.registerDevice(new mouse_keyboard_input_device_1.MouseKeyboardInputDevice(pDevices.configuration));
    }
}
exports.MouseKeyboardConnector = MouseKeyboardConnector;
//# sourceMappingURL=mouse-keyboard-connector.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/device/base-input-device.js":
/*!***********************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/device/base-input-device.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseInputDevice = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const input_action_event_1 = __webpack_require__(/*! ../event/input-action-event */ "../kartoffelgames.web.game_input/library/source/event/input-action-event.js");
const input_button_event_1 = __webpack_require__(/*! ../event/input-button-event */ "../kartoffelgames.web.game_input/library/source/event/input-button-event.js");
class BaseInputDevice extends EventTarget {
    /**
     * Get connection state.
     */
    get connected() {
        return this.mConnected;
    }
    set connected(pConnected) {
        this.mConnected = pConnected;
        // Call state change method.
        this.onConnectionStateChange();
    }
    /**
     * Device configuration.
     */
    get deviceConfiguration() {
        return this.mDeviceConfiguration;
    }
    /**
     * Device type.
     */
    get deviceType() {
        return this.mDeviceType;
    }
    /**
     * Unique game input id.
     * Consistent on reconnect.
     */
    get id() {
        return this.mId;
    }
    /**
     * Constructor.s
     * @param pId - Game input id.
     */
    constructor(pId, pDeviceType, pDeviceConfiguration) {
        super();
        this.mId = pId;
        this.mConnected = false;
        this.mDeviceType = pDeviceType;
        this.mButtonState = new core_1.Dictionary();
        this.mActionStates = new core_1.Dictionary();
        this.mDeviceConfiguration = pDeviceConfiguration;
    }
    addEventListener(pType, pCallback, pOptions) {
        super.addEventListener(pType, pCallback, pOptions);
    }
    /**
     * Get float value of button state. Range between 0..1.
     * @param pButton - Button
     */
    getButtonState(pButton) {
        return this.mButtonState.get(pButton) ?? 0;
    }
    /**
     * Check for button pressed.
     * @param pButton - Button.
     */
    isPressed(pButton) {
        return this.getButtonState(pButton) !== 0;
    }
    /**
     * Set button state.
     * Updates states of alias buttons.
     * @param pButton - Target button.
     * @param pValue - New state value of button.
     */
    setButtonState(pButton, pValue) {
        // Exit when input is not connected.
        if (!this.connected) {
            return;
        }
        // Save current state.
        const lLastButtonState = this.mButtonState.get(pButton) ?? 0;
        // Apply tolerance. Absolute values for negative axis.
        let lButtonState = pValue;
        if (Math.abs(lButtonState) < this.mDeviceConfiguration.triggerTolerance) {
            lButtonState = 0;
        }
        // Exit when values has not changed.
        if (lLastButtonState === lButtonState) {
            return;
        }
        // Set next target button state and trigger button change.
        this.mButtonState.set(pButton, lButtonState);
        this.dispatchButtonChangeEvent(pButton, lButtonState, lLastButtonState);
        // Check all actions of this buttons.
        for (const lAction of this.deviceConfiguration.getActionOfButton(pButton)) {
            const lActionButtonList = this.deviceConfiguration.getActionButtons(lAction);
            // Get lowest state of all alias buttons.
            const lActionState = lActionButtonList.reduce((pCurrentValue, pNextValue) => {
                const lNextValue = this.mButtonState.get(pNextValue) ?? 0;
                // Save changes closer to zero.
                if (Math.abs(lNextValue) < Math.abs(pCurrentValue)) {
                    return lNextValue;
                }
                else {
                    return pCurrentValue;
                }
            }, 999);
            // Set highest state to alias target state.
            const lActionLastState = this.mActionStates.get(lAction) ?? 0;
            // Exit when values has not changed.
            if (lActionLastState === lActionState) {
                return;
            }
            // Update action state.
            this.mActionStates.set(lAction, lActionState);
            // Trigger events.
            this.dispatchActionChangeEvent(lAction, lActionState, lActionLastState, lActionButtonList);
        }
    }
    /**
     * Dispatch action events based on changed state.
     * @param pAction - Target action.
     * @param pCurrentState - Current set state.
     * @param pLastState - Last state.
     */
    dispatchActionChangeEvent(pAction, pCurrentState, pLastState, pAffectedButtons) {
        // Trigger pressed event when last state was zero.
        if (pLastState === 0) {
            this.dispatchEvent(new input_action_event_1.InputActionEvent('actiondown', pAction, pCurrentState, pAffectedButtons));
        }
        else if (Math.abs(pLastState) > 0 && pCurrentState === 0) {
            this.dispatchEvent(new input_action_event_1.InputActionEvent('actionup', pAction, pCurrentState, pAffectedButtons));
        }
        // Trigger value change event.
        this.dispatchEvent(new input_action_event_1.InputActionEvent('actionstatechange', pAction, pCurrentState, pAffectedButtons));
        return true;
    }
    /**
     * Dispatch button events based on changed state.
     * @param pButton - Target button.
     * @param pCurrentState - Current set state.
     * @param pLastState - Last state.
     */
    dispatchButtonChangeEvent(pButton, pCurrentState, pLastState) {
        // Trigger pressed event when last state was zero.
        if (pLastState === 0) {
            this.dispatchEvent(new input_button_event_1.InputButtonEvent('buttondown', pButton, pCurrentState));
        }
        else if (Math.abs(pLastState) > 0 && pCurrentState === 0) {
            this.dispatchEvent(new input_button_event_1.InputButtonEvent('buttonup', pButton, pCurrentState));
        }
        // Trigger value change event.
        this.dispatchEvent(new input_button_event_1.InputButtonEvent('buttonstatechange', pButton, pCurrentState));
        return true;
    }
}
exports.BaseInputDevice = BaseInputDevice;
//# sourceMappingURL=base-input-device.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/device/gamepad-input-device.js":
/*!**************************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/device/gamepad-input-device.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamepadInputDevice = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gamepad_button_enum_1 = __webpack_require__(/*! ../enum/gamepad-button.enum */ "../kartoffelgames.web.game_input/library/source/enum/gamepad-button.enum.js");
const input_device_enum_1 = __webpack_require__(/*! ../enum/input-device.enum */ "../kartoffelgames.web.game_input/library/source/enum/input-device.enum.js");
const base_input_device_1 = __webpack_require__(/*! ./base-input-device */ "../kartoffelgames.web.game_input/library/source/device/base-input-device.js");
class GamepadInputDevice extends base_input_device_1.BaseInputDevice {
    /**
     * Constructor.
     * @param pGamepad - Gamepad object.
     */
    constructor(pGamepad, pConfiguration) {
        const lDeviceId = `gamepad_${pGamepad.index}`;
        const lDeviceConfiguration = pConfiguration.deviceConfiguration(lDeviceId);
        super(lDeviceId, input_device_enum_1.InputDevice.Gamepad, lDeviceConfiguration);
        this.mGamepadInformation = pGamepad;
        this.mLoopRunning = false;
    }
    /**
     * On connection state change.
     */
    onConnectionStateChange() {
        if (this.connected && !this.mLoopRunning) {
            this.startScanLoop();
        }
    }
    /**
     * Start scanning for pressed buttons.
     */
    startScanLoop() {
        // Get all gamepad buttons.
        const lGamepadButtonList = core_1.EnumUtil.valuesOf(gamepad_button_enum_1.GamepadButton);
        const lLoop = () => {
            // Only scan on connected gamepads.
            if (this.connected) {
                // Find connected gamepad. Gamepad does allways exists. Even after disconnect.
                const lGamepad = globalThis.navigator.getGamepads().find((pGamepad) => {
                    return pGamepad.index === this.mGamepadInformation.index;
                });
                // Scan each gamepad button.
                for (const lButton of lGamepadButtonList) {
                    // Read button value.
                    const lButtonValue = this.mGamepadInformation.mapping.executeMapping(lButton, lGamepad);
                    // Set button value.
                    this.setButtonState(lButton, lButtonValue);
                }
            }
            // Stop loop on disconnect.
            if (this.connected) {
                globalThis.requestAnimationFrame(lLoop);
            }
            else {
                this.mLoopRunning = false;
            }
        };
        // Request starting animation frame.
        globalThis.requestAnimationFrame(lLoop);
        this.mLoopRunning = true;
    }
}
exports.GamepadInputDevice = GamepadInputDevice;
//# sourceMappingURL=gamepad-input-device.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/device/mouse-keyboard-input-device.js":
/*!*********************************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/device/mouse-keyboard-input-device.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MouseKeyboardInputDevice = void 0;
const input_device_enum_1 = __webpack_require__(/*! ../enum/input-device.enum */ "../kartoffelgames.web.game_input/library/source/enum/input-device.enum.js");
const mouse_button_enum_1 = __webpack_require__(/*! ../enum/mouse-button.enum */ "../kartoffelgames.web.game_input/library/source/enum/mouse-button.enum.js");
const base_input_device_1 = __webpack_require__(/*! ./base-input-device */ "../kartoffelgames.web.game_input/library/source/device/base-input-device.js");
class MouseKeyboardInputDevice extends base_input_device_1.BaseInputDevice {
    /**
     * Constructor.
     * @param pConfiguration - Iput configuration.
     */
    constructor(pConfiguration) {
        const lDeviceId = 'KEYBOARD_MOUSE_1';
        const lDeviceConfiguration = pConfiguration.deviceConfiguration(lDeviceId);
        super(lDeviceId, input_device_enum_1.InputDevice.MouseKeyboard, lDeviceConfiguration);
        this.mMovementX = 0;
        this.mMovementY = 0;
        this.mLoopRunning = false;
        this.setupCaptureListener();
    }
    /**
     * On connection state change.
     */
    onConnectionStateChange() {
        if (this.connected && !this.mLoopRunning) {
            this.startMouseMoveScanLoop();
        }
    }
    /**
     * Set value of mouse button.
     * @param pButtonNumber - Button number of MouseEvent.button.
     * @param pValue - Button values.
     */
    setMouseButtonValue(pButtonNumber, pValue) {
        switch (pButtonNumber) {
            case 0: {
                this.setButtonState(mouse_button_enum_1.MouseButton.MainLeft, pValue);
                break;
            }
            case 1: {
                this.setButtonState(mouse_button_enum_1.MouseButton.MainMiddle, pValue);
                break;
            }
            case 2: {
                this.setButtonState(mouse_button_enum_1.MouseButton.MainRight, pValue);
                break;
            }
            case 3: {
                this.setButtonState(mouse_button_enum_1.MouseButton.SecondaryBack, pValue);
                break;
            }
            case 4: {
                this.setButtonState(mouse_button_enum_1.MouseButton.SecondaryForward, pValue);
                break;
            }
        }
    }
    /**
     * Setup event listener for keyboard and mouse events.
     */
    setupCaptureListener() {
        // Capture mouse movement for next frame.
        document.addEventListener('mousemove', (pMouseEvent) => {
            this.mMovementX += pMouseEvent.movementX;
            this.mMovementY += pMouseEvent.movementY;
        });
        // Mouse button events.
        document.addEventListener('mouseup', (pMouseEvent) => {
            this.setMouseButtonValue(pMouseEvent.button, 0);
        });
        document.addEventListener('mousedown', (pMouseEvent) => {
            this.setMouseButtonValue(pMouseEvent.button, 1);
        });
        // Keyboard event.
        document.addEventListener('keydown', (pKeyboardEvent) => {
            const lInputKey = pKeyboardEvent.code;
            this.setButtonState(lInputKey, 1);
        });
        document.addEventListener('keyup', (pKeyboardEvent) => {
            const lInputKey = pKeyboardEvent.code;
            this.setButtonState(lInputKey, 0);
        });
    }
    /**
     * Start scanning mouse movements.
     */
    startMouseMoveScanLoop() {
        // Reset mouse movement.
        this.mMovementX = 0;
        this.mMovementY = 0;
        const lMouseMoveReport = () => {
            // Calculate to axis value by set base value to 10 pixels.
            this.setButtonState(mouse_button_enum_1.MouseButton.Xaxis, this.mMovementX / 10);
            this.setButtonState(mouse_button_enum_1.MouseButton.Yaxis, this.mMovementY / 10);
            // Reset mouse movement.
            this.mMovementX = 0;
            this.mMovementY = 0;
            if (this.connected) {
                globalThis.requestAnimationFrame(lMouseMoveReport);
            }
            else {
                this.mLoopRunning = false;
            }
        };
        globalThis.requestAnimationFrame(lMouseMoveReport);
        this.mLoopRunning = true;
    }
}
exports.MouseKeyboardInputDevice = MouseKeyboardInputDevice;
//# sourceMappingURL=mouse-keyboard-input-device.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/enum/button-value-type.enum.js":
/*!**************************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/enum/button-value-type.enum.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ButtonValueType = void 0;
var ButtonValueType;
(function (ButtonValueType) {
    ButtonValueType[ButtonValueType["Button"] = 1] = "Button";
    ButtonValueType[ButtonValueType["Axis"] = 2] = "Axis";
})(ButtonValueType || (exports.ButtonValueType = ButtonValueType = {}));
//# sourceMappingURL=button-value-type.enum.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/enum/gamepad-button.enum.js":
/*!***********************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/enum/gamepad-button.enum.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamepadButton = void 0;
var GamepadButton;
(function (GamepadButton) {
    GamepadButton["ClusterButtonBottom"] = "clusterButtonBottom";
    GamepadButton["ClusterButtonRight"] = "clusterButtonRight";
    GamepadButton["ClusterButtonLeft"] = "clusterButtonLeft";
    GamepadButton["ClusterButtonTop"] = "clusterButtonTop";
    GamepadButton["ButtonLeft"] = "buttonLeft";
    GamepadButton["ButtonRight"] = "buttonRight";
    GamepadButton["TriggerLeft"] = "triggerLeft";
    GamepadButton["TriggerRight"] = "triggerRight";
    GamepadButton["SelectButton"] = "selectButton";
    GamepadButton["StartButton"] = "startButton";
    GamepadButton["HomeButton"] = "homeButton";
    GamepadButton["DirectionalPadTop"] = "directionalPadTop";
    GamepadButton["DirectionalPadBottom"] = "directionalPadBottom";
    GamepadButton["DirectionalPadRight"] = "directionalPadRight";
    GamepadButton["DirectionalPadLeft"] = "directionalPadLeft";
    GamepadButton["LeftThumbStickButton"] = "leftThumbStickButton";
    GamepadButton["LeftThumbStickXaxis"] = "leftThumbStickXaxis";
    GamepadButton["LeftThumbStickYaxis"] = "leftThumbStickYaxis";
    GamepadButton["RightThumbStickButton"] = "rightThumbStickButton";
    GamepadButton["RightThumbStickXaxis"] = "rightThumbStickXaxis";
    GamepadButton["RightThumbStickYaxis"] = "rightThumbStickYaxis";
})(GamepadButton || (exports.GamepadButton = GamepadButton = {}));
//# sourceMappingURL=gamepad-button.enum.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/enum/input-device.enum.js":
/*!*********************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/enum/input-device.enum.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InputDevice = void 0;
var InputDevice;
(function (InputDevice) {
    InputDevice[InputDevice["MouseKeyboard"] = 1] = "MouseKeyboard";
    InputDevice[InputDevice["Gamepad"] = 2] = "Gamepad";
})(InputDevice || (exports.InputDevice = InputDevice = {}));
//# sourceMappingURL=input-device.enum.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/enum/keyboard-button.enum.js":
/*!************************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/enum/keyboard-button.enum.js ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.KeyboardButton = void 0;
var KeyboardButton;
(function (KeyboardButton) {
    // Letter keys.
    KeyboardButton["KeyA"] = "KeyA";
    KeyboardButton["KeyB"] = "KeyB";
    KeyboardButton["KeyC"] = "KeyC";
    KeyboardButton["KeyD"] = "KeyD";
    KeyboardButton["KeyE"] = "KeyE";
    KeyboardButton["KeyF"] = "KeyF";
    KeyboardButton["KeyG"] = "KeyG";
    KeyboardButton["KeyH"] = "KeyH";
    KeyboardButton["KeyI"] = "KeyI";
    KeyboardButton["KeyJ"] = "KeyJ";
    KeyboardButton["KeyK"] = "KeyK";
    KeyboardButton["KeyL"] = "KeyL";
    KeyboardButton["KeyM"] = "KeyM";
    KeyboardButton["KeyN"] = "KeyN";
    KeyboardButton["KeyO"] = "KeyO";
    KeyboardButton["KeyP"] = "KeyP";
    KeyboardButton["KeyQ"] = "KeyQ";
    KeyboardButton["KeyR"] = "KeyR";
    KeyboardButton["KeyS"] = "KeyS";
    KeyboardButton["KeyT"] = "KeyT";
    KeyboardButton["KeyU"] = "KeyU";
    KeyboardButton["KeyV"] = "KeyV";
    KeyboardButton["KeyW"] = "KeyW";
    KeyboardButton["KeyX"] = "KeyX";
    KeyboardButton["KeyY"] = "KeyY";
    KeyboardButton["KeyZ"] = "KeyZ";
    // Digit keys.
    KeyboardButton["Digit0"] = "Digit0";
    KeyboardButton["Digit1"] = "Digit1";
    KeyboardButton["Digit2"] = "Digit2";
    KeyboardButton["Digit3"] = "Digit3";
    KeyboardButton["Digit4"] = "Digit4";
    KeyboardButton["Digit5"] = "Digit5";
    KeyboardButton["Digit6"] = "Digit6";
    KeyboardButton["Digit7"] = "Digit7";
    KeyboardButton["Digit8"] = "Digit8";
    KeyboardButton["Digit9"] = "Digit9";
    // Numberpad key.
    KeyboardButton["NumLock"] = "NumLock";
    KeyboardButton["Numpad0"] = "Numpad0";
    KeyboardButton["Numpad1"] = "Numpad1";
    KeyboardButton["Numpad2"] = "Numpad2";
    KeyboardButton["Numpad3"] = "Numpad3";
    KeyboardButton["Numpad4"] = "Numpad4";
    KeyboardButton["Numpad5"] = "Numpad5";
    KeyboardButton["Numpad6"] = "Numpad6";
    KeyboardButton["Numpad7"] = "Numpad7";
    KeyboardButton["Numpad8"] = "Numpad8";
    KeyboardButton["Numpad9"] = "Numpad9";
    KeyboardButton["NumpadAdd"] = "NumpadAdd";
    KeyboardButton["NumpadComma"] = "NumpadComma";
    KeyboardButton["NumpadDecimal"] = "NumpadDecimal";
    KeyboardButton["NumpadDivide"] = "NumpadDivide";
    KeyboardButton["NumpadEnter"] = "NumpadEnter";
    KeyboardButton["NumpadMultiply"] = "NumpadMultiply";
    KeyboardButton["NumpadSubtract"] = "NumpadSubtract";
    // Function keys.
    KeyboardButton["F1"] = "F1";
    KeyboardButton["F2"] = "F2";
    KeyboardButton["F3"] = "F3";
    KeyboardButton["F4"] = "F4";
    KeyboardButton["F5"] = "F5";
    KeyboardButton["F6"] = "F6";
    KeyboardButton["F7"] = "F7";
    KeyboardButton["F8"] = "F8";
    KeyboardButton["F9"] = "F9";
    KeyboardButton["F10"] = "F10";
    KeyboardButton["F11"] = "F11";
    KeyboardButton["F12"] = "F12";
    KeyboardButton["F13"] = "F13";
    KeyboardButton["F14"] = "F14";
    KeyboardButton["F15"] = "F15";
    KeyboardButton["F16"] = "F16";
    KeyboardButton["F17"] = "F17";
    KeyboardButton["F18"] = "F18";
    KeyboardButton["F19"] = "F19";
    KeyboardButton["F20"] = "F20";
    KeyboardButton["F21"] = "F21";
    KeyboardButton["F22"] = "F22";
    KeyboardButton["F23"] = "F23";
    KeyboardButton["F24"] = "F24";
    // Arrow keys.
    KeyboardButton["ArrowDown"] = "ArrowDown";
    KeyboardButton["ArrowLeft"] = "ArrowLeft";
    KeyboardButton["ArrowRight"] = "ArrowRight";
    KeyboardButton["ArrowUp"] = "ArrowUp";
    // Main metas
    KeyboardButton["Escape"] = "Escape";
    KeyboardButton["AltLeft"] = "AltLeft";
    KeyboardButton["AltRight"] = "AltRight";
    KeyboardButton["CapsLock"] = "CapsLock";
    KeyboardButton["MetaLeft"] = "MetaLeft";
    KeyboardButton["MetaRight"] = "MetaRight";
    KeyboardButton["OsLeft"] = "OSLeft";
    KeyboardButton["OsRight"] = "OSRight";
    KeyboardButton["ShiftLeft"] = "ShiftLeft";
    KeyboardButton["ShiftRight"] = "ShiftRight";
    KeyboardButton["ControlLeft"] = "ControlLeft";
    KeyboardButton["ControlRight"] = "ControlRight";
    // White space key.s
    KeyboardButton["Enter"] = "Enter";
    KeyboardButton["Space"] = "Space";
    KeyboardButton["Tab"] = "Tab";
    // Center meta
    KeyboardButton["Delete"] = "Delete";
    KeyboardButton["End"] = "End";
    KeyboardButton["PageDown"] = "PageDown";
    KeyboardButton["PageUp"] = "PageUp";
    KeyboardButton["Insert"] = "Insert";
    KeyboardButton["ScrollLock"] = "ScrollLock";
    // Media keys.
    KeyboardButton["AudioVolumeUp"] = "AudioVolumeUp";
    KeyboardButton["Home"] = "Home";
    KeyboardButton["ContextMenu"] = "ContextMenu";
    // Brackes, slash and dot keys.
    KeyboardButton["Backquote"] = "Backquote";
    KeyboardButton["Backslash"] = "Backslash";
    KeyboardButton["Backspace"] = "Backspace";
    KeyboardButton["BracketLeft"] = "BracketLeft";
    KeyboardButton["BracketRight"] = "BracketRight";
    KeyboardButton["Comma"] = "Comma";
    KeyboardButton["IntlBackslash"] = "IntlBackslash";
    KeyboardButton["Period"] = "Period";
    KeyboardButton["Quote"] = "Quote";
    KeyboardButton["Semicolon"] = "Semicolon";
    KeyboardButton["Slash"] = "Slash";
    KeyboardButton["Minus"] = "Minus";
    KeyboardButton["Equal"] = "Equal";
})(KeyboardButton || (exports.KeyboardButton = KeyboardButton = {}));
//# sourceMappingURL=keyboard-button.enum.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/enum/mouse-button.enum.js":
/*!*********************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/enum/mouse-button.enum.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MouseButton = void 0;
var MouseButton;
(function (MouseButton) {
    // Main trigger.
    MouseButton["MainLeft"] = "mainLeft";
    MouseButton["MainRight"] = "mainRight";
    MouseButton["MainMiddle"] = "mainMiddle";
    MouseButton["SecondaryBack"] = "secondaryBack";
    MouseButton["SecondaryForward"] = "secondaryForward";
    // Axis.
    MouseButton["Xaxis"] = "xAxis";
    MouseButton["Yaxis"] = "yAxis";
})(MouseButton || (exports.MouseButton = MouseButton = {}));
//# sourceMappingURL=mouse-button.enum.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/event/input-action-event.js":
/*!***********************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/event/input-action-event.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InputActionEvent = void 0;
class InputActionEvent extends Event {
    /**
     * Triggered action.
     */
    get action() {
        return this.mAction;
    }
    /**
     * Action Buttons.
     */
    get buttons() {
        return this.mButtons;
    }
    /**
     * Button pressed state.
     */
    get isPressed() {
        return this.mState > 0;
    }
    /**
     * Button state.
     */
    get state() {
        return this.mState;
    }
    /**
     * Constructor.
     * @param pType - Event type.
     * @param pState - Button state.
     */
    constructor(pType, pAction, pState, pButtons) {
        super(pType);
        this.mAction = pAction;
        this.mState = pState;
        this.mButtons = pButtons;
    }
}
exports.InputActionEvent = InputActionEvent;
//# sourceMappingURL=input-action-event.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/event/input-button-event.js":
/*!***********************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/event/input-button-event.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InputButtonEvent = void 0;
class InputButtonEvent extends Event {
    /**
     * Button.
     */
    get button() {
        return this.mButton;
    }
    /**
     * Button pressed state.
     */
    get isPressed() {
        return this.mState > 0;
    }
    /**
     * Button state.
     */
    get state() {
        return this.mState;
    }
    /**
     * Constructor.
     * @param pType - Event type.
     * @param pState - Button state.
     */
    constructor(pType, pButton, pState) {
        super(pType);
        this.mState = pState;
        this.mButton = pButton;
    }
}
exports.InputButtonEvent = InputButtonEvent;
//# sourceMappingURL=input-button-event.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/index.js":
/*!****************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/index.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

/* istanbul ignore file */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GamepadButton = exports.MouseButton = exports.KeyboardButton = exports.InputButtonEvent = exports.InputActionEvent = exports.BaseInputDevice = exports.InputConfiguration = exports.InputDevices = exports.GamepadConnector = exports.MouseKeyboardConnector = exports.DeviceConfiguration = void 0;
var device_configuration_1 = __webpack_require__(/*! ./configuration/device-configuration */ "../kartoffelgames.web.game_input/library/source/configuration/device-configuration.js");
Object.defineProperty(exports, "DeviceConfiguration", ({ enumerable: true, get: function () { return device_configuration_1.DeviceConfiguration; } }));
var mouse_keyboard_connector_1 = __webpack_require__(/*! ./connector/mouse-keyboard-connector */ "../kartoffelgames.web.game_input/library/source/connector/mouse-keyboard-connector.js");
Object.defineProperty(exports, "MouseKeyboardConnector", ({ enumerable: true, get: function () { return mouse_keyboard_connector_1.MouseKeyboardConnector; } }));
var gamepad_connector_1 = __webpack_require__(/*! ./connector/gamepad-connector */ "../kartoffelgames.web.game_input/library/source/connector/gamepad-connector.js");
Object.defineProperty(exports, "GamepadConnector", ({ enumerable: true, get: function () { return gamepad_connector_1.GamepadConnector; } }));
var input_devices_1 = __webpack_require__(/*! ./input-devices */ "../kartoffelgames.web.game_input/library/source/input-devices.js");
Object.defineProperty(exports, "InputDevices", ({ enumerable: true, get: function () { return input_devices_1.InputDevices; } }));
var input_configuration_1 = __webpack_require__(/*! ./configuration/input-configuration */ "../kartoffelgames.web.game_input/library/source/configuration/input-configuration.js");
Object.defineProperty(exports, "InputConfiguration", ({ enumerable: true, get: function () { return input_configuration_1.InputConfiguration; } }));
var base_input_device_1 = __webpack_require__(/*! ./device/base-input-device */ "../kartoffelgames.web.game_input/library/source/device/base-input-device.js");
Object.defineProperty(exports, "BaseInputDevice", ({ enumerable: true, get: function () { return base_input_device_1.BaseInputDevice; } }));
var input_action_event_1 = __webpack_require__(/*! ./event/input-action-event */ "../kartoffelgames.web.game_input/library/source/event/input-action-event.js");
Object.defineProperty(exports, "InputActionEvent", ({ enumerable: true, get: function () { return input_action_event_1.InputActionEvent; } }));
var input_button_event_1 = __webpack_require__(/*! ./event/input-button-event */ "../kartoffelgames.web.game_input/library/source/event/input-button-event.js");
Object.defineProperty(exports, "InputButtonEvent", ({ enumerable: true, get: function () { return input_button_event_1.InputButtonEvent; } }));
var keyboard_button_enum_1 = __webpack_require__(/*! ./enum/keyboard-button.enum */ "../kartoffelgames.web.game_input/library/source/enum/keyboard-button.enum.js");
Object.defineProperty(exports, "KeyboardButton", ({ enumerable: true, get: function () { return keyboard_button_enum_1.KeyboardButton; } }));
var mouse_button_enum_1 = __webpack_require__(/*! ./enum/mouse-button.enum */ "../kartoffelgames.web.game_input/library/source/enum/mouse-button.enum.js");
Object.defineProperty(exports, "MouseButton", ({ enumerable: true, get: function () { return mouse_button_enum_1.MouseButton; } }));
var gamepad_button_enum_1 = __webpack_require__(/*! ./enum/gamepad-button.enum */ "../kartoffelgames.web.game_input/library/source/enum/gamepad-button.enum.js");
Object.defineProperty(exports, "GamepadButton", ({ enumerable: true, get: function () { return gamepad_button_enum_1.GamepadButton; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/input-devices.js":
/*!************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/input-devices.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InputDevices = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
class InputDevices {
    /**
     * Get input device configuration.
     */
    get configuration() {
        return this.mConfiguration;
    }
    /**
     * Get all input devices.
     */
    get devices() {
        return [...this.mInputDevices.values()];
    }
    /**
     * Constructor.
     * @param pConfiguration - input configuration.
     */
    constructor(pConfiguration) {
        this.mConnectionChangeListenerList = new Array();
        this.mInputDevices = new core_1.Dictionary();
        this.mConfiguration = pConfiguration;
    }
    /**
     * On connection change.
     * @param pListener - Connection change listener.
     */
    onConnectionChange(pListener) {
        this.mConnectionChangeListenerList.push(pListener);
    }
    /**
     * Register input connector.
     * @param pConnector - Input connector.
     */
    registerConnector(pConnector) {
        pConnector.init(this);
    }
    /**
     * Register new device.
     * @param pDevice - Device.
     */
    registerDevice(pDevice) {
        let lDevice;
        // Init new device or reconnect old.
        if (this.mInputDevices.has(pDevice.id)) {
            lDevice = this.mInputDevices.get(pDevice.id);
        }
        else {
            this.mInputDevices.set(pDevice.id, pDevice);
            lDevice = pDevice;
        }
        lDevice.connected = true;
        this.dispatchConnectionChangeEvent(lDevice);
    }
    /**
     * Unregister device.
     * @param pDevice - Device.
     */
    unregisterDevice(pDevice) {
        if (this.mInputDevices.has(pDevice.id)) {
            const lDevice = this.mInputDevices.get(pDevice.id);
            lDevice.connected = false;
            this.dispatchConnectionChangeEvent(lDevice);
        }
    }
    /**
     * Call all connection change listener.
     * @param pDevice - Changed device.
     */
    dispatchConnectionChangeEvent(pDevice) {
        for (const lCallback of this.mConnectionChangeListenerList) {
            lCallback.apply(this, [pDevice]);
        }
    }
}
exports.InputDevices = InputDevices;
//# sourceMappingURL=input-devices.js.map

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
/******/ 		var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 		__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 		module = execOptions.module;
/******/ 		execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("41407c5608fd88c10f4a")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "Page:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key, chunkId) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 		
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => (fn(event)));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
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
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId, fetchPriority) {
/******/ 				return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results).then(function () {});
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							}, [])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src;
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) {
/******/ 					var i = scripts.length - 1;
/******/ 					while (i > -1 && (!scriptUrl || !/^http(s?):/.test(scriptUrl))) scriptUrl = scripts[i--].src;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl + "../../dist/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = __webpack_require__.hmrS_jsonp = __webpack_require__.hmrS_jsonp || {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		var currentUpdatedModulesList;
/******/ 		var waitingUpdateResolves = {};
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			currentUpdatedModulesList = updatedModulesList;
/******/ 			return new Promise((resolve, reject) => {
/******/ 				waitingUpdateResolves[chunkId] = resolve;
/******/ 				// start update chunk loading
/******/ 				var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				var loadingEnded = (event) => {
/******/ 					if(waitingUpdateResolves[chunkId]) {
/******/ 						waitingUpdateResolves[chunkId] = undefined
/******/ 						var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 						var realSrc = event && event.target && event.target.src;
/******/ 						error.message = 'Loading hot update chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 						error.name = 'ChunkLoadError';
/******/ 						error.type = errorType;
/******/ 						error.request = realSrc;
/******/ 						reject(error);
/******/ 					}
/******/ 				};
/******/ 				__webpack_require__.l(url, loadingEnded);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		self["webpackHotUpdatePage"] = (chunkId, moreModules, runtime) => {
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = moreModules[moduleId];
/******/ 					if(currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 			if(waitingUpdateResolves[chunkId]) {
/******/ 				waitingUpdateResolves[chunkId]();
/******/ 				waitingUpdateResolves[chunkId] = undefined;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.jsonpHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.jsonp = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.jsonp = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.jsonpHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = () => {
/******/ 			if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");
/******/ 			return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
/******/ 				if(response.status === 404) return; // no update available
/******/ 				if(!response.ok) throw new Error("Failed to fetch update manifest " + response.statusText);
/******/ 				return response.json();
/******/ 			});
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__("../../node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=0.0.0.0&port=5500&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true");
/******/ 	__webpack_require__("../../node_modules/webpack/hot/dev-server.js");
/******/ 	var __webpack_exports__ = __webpack_require__("./page/source/index.ts");
/******/ 	Page = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=page.js.map