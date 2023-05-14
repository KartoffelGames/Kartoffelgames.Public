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

/***/ "./page/source/index.ts":
/*!******************************!*\
  !*** ./page/source/index.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
var view_projection_1 = __webpack_require__(/*! ../../source/base/view_projection/view-projection */ "./source/base/view_projection/view-projection.ts");
var orthographic__projection_1 = __webpack_require__(/*! ../../source/base/view_projection/projection/orthographic -projection */ "./source/base/view_projection/projection/orthographic -projection.ts");
var perspective_projection_1 = __webpack_require__(/*! ../../source/base/view_projection/projection/perspective-projection */ "./source/base/view_projection/projection/perspective-projection.ts");
var transform_1 = __webpack_require__(/*! ../../source/base/transform */ "./source/base/transform.ts");
var attachment_type_enum_1 = __webpack_require__(/*! ../../source/core/pass_descriptor/attachment-type.enum */ "./source/core/pass_descriptor/attachment-type.enum.ts");
var attachments_1 = __webpack_require__(/*! ../../source/core/pass_descriptor/attachments */ "./source/core/pass_descriptor/attachments.ts");
var render_parameter_1 = __webpack_require__(/*! ../../source/core/execution/parameter/render-parameter */ "./source/core/execution/parameter/render-parameter.ts");
var instruction_executer_1 = __webpack_require__(/*! ../../source/core/execution/instruction-executer */ "./source/core/execution/instruction-executer.ts");
var render_instruction_1 = __webpack_require__(/*! ../../source/core/execution/instruction/render-instruction */ "./source/core/execution/instruction/render-instruction.ts");
var gpu_1 = __webpack_require__(/*! ../../source/core/gpu */ "./source/core/gpu.ts");
var render_pipeline_1 = __webpack_require__(/*! ../../source/core/pipeline/render-pipeline */ "./source/core/pipeline/render-pipeline.ts");
var simple_buffer_1 = __webpack_require__(/*! ../../source/core/resource/buffer/simple-buffer */ "./source/core/resource/buffer/simple-buffer.ts");
var shader_1 = __webpack_require__(/*! ../../source/core/shader/shader */ "./source/core/shader/shader.ts");
var shader_wgsl_1 = __webpack_require__(/*! ./shader.wgsl */ "./page/source/shader.wgsl");
var render_pass_descriptor_1 = __webpack_require__(/*! ../../source/core/pass_descriptor/render-pass-descriptor */ "./source/core/pass_descriptor/render-pass-descriptor.ts");
var render_instruction_set_1 = __webpack_require__(/*! ../../source/core/execution/instruction_set/render-instruction-set */ "./source/core/execution/instruction_set/render-instruction-set.ts");
var ring_buffer_1 = __webpack_require__(/*! ../../source/core/resource/buffer/ring-buffer */ "./source/core/resource/buffer/ring-buffer.ts");
var texture_1 = __webpack_require__(/*! ../../source/core/resource/texture/texture */ "./source/core/resource/texture/texture.ts");
var texture_usage_enum_1 = __webpack_require__(/*! ../../source/core/resource/texture/texture-usage.enum */ "./source/core/resource/texture/texture-usage.enum.ts");
var texture_sampler_1 = __webpack_require__(/*! ../../source/core/resource/texture-sampler */ "./source/core/resource/texture-sampler.ts");
var web_game_input_1 = __webpack_require__(/*! @kartoffelgames/web.game-input */ "../kartoffelgames.web.game_input/library/source/index.js");
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var ambient_light_1 = __webpack_require__(/*! ../../source/base/light/ambient-light */ "./source/base/light/ambient-light.ts");
var gHeight = 10;
var gWidth = 10;
var gDepth = 10;
_asyncToGenerator(function* () {
  var lColorPicker = document.querySelector('#color');
  var lFpsCounter = document.querySelector('#fpsCounter');
  // Create gpu.
  var lGpu = yield gpu_1.Gpu.create('high-performance');
  // Init canvas.
  var lCanvas = document.getElementById('canvas');
  // Init shader.
  var lShader = new shader_1.Shader(lGpu, shader_wgsl_1.default);
  // Create depth and color attachments.
  var lAttachments = new attachments_1.Attachments(lGpu, 4);
  lAttachments.resize(1200, 640);
  lAttachments.addAttachment({
    type: attachment_type_enum_1.AttachmentType.Color,
    name: 'MultisampleTarget',
    format: lGpu.preferredFormat
  });
  lAttachments.addAttachment({
    canvas: lCanvas,
    type: attachment_type_enum_1.AttachmentType.Color,
    name: 'Canvas'
  });
  lAttachments.addAttachment({
    type: attachment_type_enum_1.AttachmentType.Depth,
    name: 'Depth',
    format: 'depth24plus'
  });
  // Setup render pass.
  var lRenderPassDescription = new render_pass_descriptor_1.RenderPassDescriptor(lGpu, lAttachments);
  lRenderPassDescription.setDepthAttachment('Depth', 1);
  lRenderPassDescription.setColorAttachment(0, 'MultisampleTarget', {
    r: 0.5,
    g: 0.5,
    b: 0.5,
    a: 1
  }, 'clear', 'store', 'Canvas');
  // Init pipeline.
  var lPipeline = new render_pipeline_1.RenderPipeline(lGpu, lShader, lRenderPassDescription);
  lPipeline.primitiveCullMode = 'back';
  // Ambient light buffer.
  var lAmbientLight = new ambient_light_1.AmbientLight();
  lAmbientLight.setColor(0.1, 0.1, 0.1);
  var lAmbientLightBuffer = new simple_buffer_1.SimpleBuffer(lGpu, GPUBufferUsage.UNIFORM, new Float32Array(lAmbientLight.data));
  lColorPicker.addEventListener('input', pEvent => {
    var lBigint = parseInt(pEvent.target.value.replace('#', ''), 16);
    var lRed = (lBigint >> 16 & 255) / 255;
    var lGreen = (lBigint >> 8 & 255) / 255;
    var lBlue = (lBigint & 255) / 255;
    // Set color to ambient light and update buffer.
    lAmbientLight.setColor(lRed, lGreen, lBlue);
    lAmbientLightBuffer.write( /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(function* (pBuffer) {
        pBuffer.set(lAmbientLight.data);
      });
      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());
  });
  var lPointLightBuffer = new simple_buffer_1.SimpleBuffer(lGpu, GPUBufferUsage.STORAGE, new Float32Array([/* Position */1, 1, 1, 1, /* Color */1, 0, 0, 1, /* Range */200, 0, 0, 0, /* Position */10, 10, 10, 1, /* Color */0, 0, 1, 1, /* Range */200, 0, 0, 0]));
  // Transformation.
  var lCubeTransform = new transform_1.Transform();
  lCubeTransform.setScale(0.1, 0.1, 0.1);
  var lCubeTransformationBuffer = new ring_buffer_1.RingBuffer(lGpu, GPUBufferUsage.UNIFORM, new Float32Array(lCubeTransform.getMatrix(transform_1.TransformMatrix.Transformation).dataArray));
  // Create instanced transformation buffer.
  var lCubeInstanceTransformationData = new Array();
  for (var lWidthIndex = 0; lWidthIndex < gWidth; lWidthIndex++) {
    for (var lHeightIndex = 0; lHeightIndex < gHeight; lHeightIndex++) {
      for (var lDepthIndex = 0; lDepthIndex < gDepth; lDepthIndex++) {
        lCubeInstanceTransformationData.push(lWidthIndex, lHeightIndex, lDepthIndex, 1);
      }
    }
  }
  var lCubeInstanceTransformationBuffer = new simple_buffer_1.SimpleBuffer(lGpu, GPUBufferUsage.STORAGE, new Float32Array(lCubeInstanceTransformationData));
  // Transformation buffer.
  var lUpdaterFunctions = new Array();
  var lRegisterObjectHandler = (pId, pSet, pGet) => {
    var lSlider = document.getElementById(pId);
    var lInput = document.getElementById(pId + 'Display');
    var lUpdater = () => {
      lInput.value = pGet(lCubeTransform);
    };
    lUpdaterFunctions.push(lUpdater);
    lUpdater();
    var lCurrentData = 0;
    var lSetData = pStringData => {
      var lNumberData = parseFloat(pStringData) || 1;
      lCurrentData += lNumberData;
      pSet(lCubeTransform, lCurrentData);
      // Reset slider.
      lSlider.value = 0;
      // Set real data.
      for (var _lUpdater of lUpdaterFunctions) {
        _lUpdater();
      }
      // Update transformation buffer.
      lCubeTransformationBuffer.write( /*#__PURE__*/function () {
        var _ref3 = _asyncToGenerator(function* (pBuffer) {
          pBuffer.set(lCubeTransform.getMatrix(transform_1.TransformMatrix.Transformation).dataArray);
        });
        return function (_x2) {
          return _ref3.apply(this, arguments);
        };
      }());
    };
    lSlider.addEventListener('input', pEvent => {
      lSetData(pEvent.target.value);
    });
    lInput.addEventListener('input', pEvent => {
      lSetData(pEvent.target.value);
    });
  };
  // Scale handler.
  lRegisterObjectHandler('scaleWidth', (pTransform, pData) => {
    pTransform.setScale(pData, null, null);
  }, pTransform => {
    return pTransform.scaleWidth;
  });
  lRegisterObjectHandler('scaleHeight', (pTransform, pData) => {
    pTransform.setScale(null, pData, null);
  }, pTransform => {
    return pTransform.scaleHeight;
  });
  lRegisterObjectHandler('scaleDepth', (pTransform, pData) => {
    pTransform.setScale(null, null, pData);
  }, pTransform => {
    return pTransform.scaleDepth;
  });
  // Translate.
  lRegisterObjectHandler('translateX', (pTransform, pData) => {
    pTransform.setTranslation(pData, null, null);
  }, pTransform => {
    return pTransform.translationX;
  });
  lRegisterObjectHandler('translateY', (pTransform, pData) => {
    pTransform.setTranslation(null, pData, null);
  }, pTransform => {
    return pTransform.translationY;
  });
  lRegisterObjectHandler('translateZ', (pTransform, pData) => {
    pTransform.setTranslation(null, null, pData);
  }, pTransform => {
    return pTransform.translationZ;
  });
  // Rotate.
  lRegisterObjectHandler('rotatePitch', (pTransform, pData) => {
    pTransform.setRotation(pData, null, null);
  }, pTransform => {
    return pTransform.rotationPitch;
  });
  lRegisterObjectHandler('rotateYaw', (pTransform, pData) => {
    pTransform.setRotation(null, pData, null);
  }, pTransform => {
    return pTransform.rotationYaw;
  });
  lRegisterObjectHandler('rotateRoll', (pTransform, pData) => {
    pTransform.setRotation(null, null, pData);
  }, pTransform => {
    return pTransform.rotationRoll;
  });
  // Translate.
  lRegisterObjectHandler('pivotX', (pTransform, pData) => {
    pTransform.pivotX = pData;
  }, pTransform => {
    return pTransform.pivotX;
  });
  lRegisterObjectHandler('pivotY', (pTransform, pData) => {
    pTransform.pivotY = pData;
  }, pTransform => {
    return pTransform.pivotY;
  });
  lRegisterObjectHandler('pivotZ', (pTransform, pData) => {
    pTransform.pivotZ = pData;
  }, pTransform => {
    return pTransform.pivotZ;
  });
  // Transformation.
  var lPerspectiveProjection = new perspective_projection_1.PerspectiveProjection();
  lPerspectiveProjection.aspectRatio = lAttachments.width / lAttachments.height;
  lPerspectiveProjection.angleOfView = 72;
  lPerspectiveProjection.near = 0.1;
  lPerspectiveProjection.far = 9999999;
  var lOrtoProjection = new orthographic__projection_1.OrthographicProjection();
  lOrtoProjection.aspectRatio = lAttachments.width / lAttachments.height;
  lOrtoProjection.width = 2;
  lOrtoProjection.near = 0;
  lOrtoProjection.far = 999999;
  var lCamera = new view_projection_1.ViewProjection(lPerspectiveProjection);
  lCamera.transformation.setTranslation(0, 0, -4);
  // Transformation buffer.
  var lCameraBuffer = new simple_buffer_1.SimpleBuffer(lGpu, GPUBufferUsage.UNIFORM, new Float32Array(lCamera.getMatrix(view_projection_1.CameraMatrix.ViewProjection).dataArray));
  var lRegisterCameraHandler = (pId, pSet, pGet) => {
    var lSlider = document.getElementById(pId);
    var lInput = document.getElementById(pId + 'Display');
    var lUpdater = () => {
      lInput.value = pGet();
    };
    lUpdaterFunctions.push(lUpdater);
    lUpdater();
    var lSetData = pData => {
      pSet(parseFloat(pData) || 1);
      // Reset slider.
      lSlider.value = 0;
      // Set real data.
      for (var _lUpdater2 of lUpdaterFunctions) {
        _lUpdater2();
      }
      // Update transformation buffer.
      lCameraBuffer.write( /*#__PURE__*/function () {
        var _ref4 = _asyncToGenerator(function* (pBuffer) {
          pBuffer.set(lCamera.getMatrix(view_projection_1.CameraMatrix.ViewProjection).dataArray);
        });
        return function (_x3) {
          return _ref4.apply(this, arguments);
        };
      }());
    };
    lSlider.addEventListener('input', pEvent => {
      lSetData(pEvent.target.value);
    });
    lInput.addEventListener('input', pEvent => {
      lSetData(pEvent.target.value);
    });
  };
  // Translate.
  lRegisterCameraHandler('cameraPivotX', pData => {
    lCamera.transformation.pivotX = pData;
  }, () => {
    return lCamera.transformation.pivotX;
  });
  lRegisterCameraHandler('cameraPivotY', pData => {
    lCamera.transformation.pivotY = pData;
  }, () => {
    return lCamera.transformation.pivotY;
  });
  lRegisterCameraHandler('cameraPivotZ', pData => {
    lCamera.transformation.pivotZ = pData;
  }, () => {
    return lCamera.transformation.pivotZ;
  });
  // Camera.
  lRegisterCameraHandler('cameraNear', pData => {
    lPerspectiveProjection.near = pData;
  }, () => {
    return lPerspectiveProjection.near;
  });
  lRegisterCameraHandler('cameraFar', pData => {
    lPerspectiveProjection.far = pData;
  }, () => {
    return lPerspectiveProjection.far;
  });
  lRegisterCameraHandler('cameraAngleOfView', pData => {
    lPerspectiveProjection.angleOfView = pData;
  }, () => {
    return lPerspectiveProjection.angleOfView;
  });
  // Register keyboard mouse movements.
  var lDefaultConfiguaration = new web_game_input_1.DeviceConfiguration();
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
  var lInputConfiguration = new web_game_input_1.InputConfiguration(lDefaultConfiguaration);
  var lInputDevices = new web_game_input_1.InputDevices(lInputConfiguration);
  lInputDevices.registerConnector(new web_game_input_1.MouseKeyboardConnector());
  var lCurrentActionValue = new core_data_1.Dictionary();
  var lKeyboard = lInputDevices.devices[0];
  lKeyboard.addEventListener('actionstatechange', pEvent => {
    lCurrentActionValue.set(pEvent.action, pEvent.state);
  });
  window.setInterval(() => {
    var lSpeed = 1;
    // Z Axis
    if (lCurrentActionValue.get('Forward') > 0) {
      lCamera.transformation.translateInDirection(lCurrentActionValue.get('Forward') / 50 * lSpeed, 0, 0);
    }
    if (lCurrentActionValue.get('Back') > 0) {
      lCamera.transformation.translateInDirection(-(lCurrentActionValue.get('Back') / 50) * lSpeed, 0, 0);
    }
    // X Axis
    if (lCurrentActionValue.get('Right') > 0) {
      lCamera.transformation.translateInDirection(0, lCurrentActionValue.get('Right') / 50 * lSpeed, 0);
    }
    if (lCurrentActionValue.get('Left') > 0) {
      lCamera.transformation.translateInDirection(0, -(lCurrentActionValue.get('Left') / 50) * lSpeed, 0);
    }
    // Y Axis
    if (lCurrentActionValue.get('Up') > 0) {
      lCamera.transformation.translateInDirection(0, 0, lCurrentActionValue.get('Up') / 50 * lSpeed);
    }
    if (lCurrentActionValue.get('Down') > 0) {
      lCamera.transformation.translateInDirection(0, 0, -(lCurrentActionValue.get('Down') / 50) * lSpeed);
    }
    // Rotation.
    if (lCurrentActionValue.get('Yaw') > 0 || lCurrentActionValue.get('Yaw') < 0) {
      lCamera.transformation.addEulerRotation(0, lCurrentActionValue.get('Yaw') * lSpeed, 0);
    }
    if (lCurrentActionValue.get('Pitch') > 0 || lCurrentActionValue.get('Pitch') < 0) {
      lCamera.transformation.addEulerRotation(lCurrentActionValue.get('Pitch') * lSpeed, 0, 0);
    }
    if (lCurrentActionValue.get('RotateLeft') > 0) {
      lCamera.transformation.addEulerRotation(0, 0, lCurrentActionValue.get('RotateLeft') * lSpeed);
    }
    if (lCurrentActionValue.get('RotateRight') > 0) {
      lCamera.transformation.addEulerRotation(0, 0, -lCurrentActionValue.get('RotateRight') * lSpeed);
    }
    // Update transformation buffer.
    lCameraBuffer.write( /*#__PURE__*/function () {
      var _ref5 = _asyncToGenerator(function* (pBuffer) {
        pBuffer.set(lCamera.getMatrix(view_projection_1.CameraMatrix.ViewProjection).dataArray);
      });
      return function (_x4) {
        return _ref5.apply(this, arguments);
      };
    }());
  }, 8);
  lCanvas.addEventListener('click', () => {
    lCanvas.requestPointerLock();
  });
  // Setup Texture.
  var lCubeTexture = new texture_1.Texture(lGpu, lGpu.preferredFormat, texture_usage_enum_1.TextureUsage.TextureBinding | texture_usage_enum_1.TextureUsage.RenderAttachment | texture_usage_enum_1.TextureUsage.CopyDestination);
  lCubeTexture.label = 'Cube Texture';
  yield lCubeTexture.load(['/source/cube_texture/cube-texture.png']);
  // Setup Sampler.
  var lCubeSampler = new texture_sampler_1.TextureSampler(lGpu);
  // Create attributes data.
  var lVertexPositionData = [
  // Back
  -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0,
  // Front
  -1.0, 1.0, -1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0, -1.0, 1.0];
  var lVertexUvData = [
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
  var lVertexNormalData = [
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
  var lMesh = new render_parameter_1.RenderParameter(lGpu, [
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
  7, 6, 2, 7, 2, 3]);
  lMesh.setVertexData('vertexposition', lVertexPositionData, 4);
  lMesh.setIndexData('vertexuv', lVertexUvData, 2);
  lMesh.setIndexData('vertexnormal', lVertexNormalData, 4);
  // Setup renderer.
  var lInstructionExecutioner = new instruction_executer_1.InstructionExecuter(lGpu);
  // Setup instruction set.
  var lInstructionSet = new render_instruction_set_1.RenderInstructionSet(lRenderPassDescription);
  lInstructionExecutioner.addInstructionSet(lInstructionSet);
  // Create camera bind group.
  var lWorldValueBindGroup = lShader.bindGroups.getGroup(1).createBindGroup();
  lWorldValueBindGroup.setData('viewProjectionMatrix', lCameraBuffer);
  lWorldValueBindGroup.setData('ambientLight', lAmbientLightBuffer);
  lWorldValueBindGroup.setData('pointLights', lPointLightBuffer);
  var lUserInputBindGroup = lShader.bindGroups.getGroup(2).createBindGroup();
  lUserInputBindGroup.setData('cubetextureSampler', lCubeSampler);
  lUserInputBindGroup.setData('cubeTexture', lCubeTexture.view());
  var lObjectBindGroup = lShader.bindGroups.getGroup(0).createBindGroup();
  lObjectBindGroup.setData('transformationMatrix', lCubeTransformationBuffer);
  lObjectBindGroup.setData('instancePositions', lCubeInstanceTransformationBuffer);
  var lObjectRenderInstruction = new render_instruction_1.RenderInstruction(lPipeline, lMesh, gWidth * gHeight * gDepth);
  lObjectRenderInstruction.setBindGroup(0, lObjectBindGroup);
  lObjectRenderInstruction.setBindGroup(1, lWorldValueBindGroup);
  lObjectRenderInstruction.setBindGroup(2, lUserInputBindGroup);
  lInstructionSet.addInstruction(lObjectRenderInstruction);
  var lLastTime = 0;
  var lRender = pTime => {
    // Generate encoder and add render commands.
    lInstructionExecutioner.execute();
    var lFps = 1000 / (pTime - lLastTime);
    lFpsCounter.textContent = lFps.toString();
    lLastTime = pTime;
    // Refresh canvas
    requestAnimationFrame(lRender);
  };
  requestAnimationFrame(lRender);
})();

/***/ }),

/***/ "./source/base/light/ambient-light.ts":
/*!********************************************!*\
  !*** ./source/base/light/ambient-light.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AmbientLight = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var vector_1 = __webpack_require__(/*! ../../math/vector */ "./source/math/vector.ts");
class AmbientLight {
  /**
   * Constructor.
   */
  constructor() {
    this.mColor = new vector_1.Vector([1, 1, 1, 1]);
  }
  /**
   * Ambient light Vector4 data.
   */
  get data() {
    return this.mColor.data;
  }
  /**
   * Set ambient light color.
   * @param pRed - Red.
   * @param pGreen - Green.
   * @param pBlue - Blue.
   */
  setColor(pRed, pGreen, pBlue) {
    if (pRed > 1 || pRed < 0 || pGreen > 1 || pGreen < 0 || pBlue > 1 || pBlue < 0) {
      throw new core_data_1.Exception("Color values need to be in 0 to 1 range. (R:".concat(pRed, ", G:").concat(pGreen, ", B:").concat(pBlue, ")"), this);
    }
    this.mColor.data[0] = pRed;
    this.mColor.data[1] = pGreen;
    this.mColor.data[2] = pBlue;
  }
}
exports.AmbientLight = AmbientLight;

/***/ }),

/***/ "./source/base/transform.ts":
/*!**********************************!*\
  !*** ./source/base/transform.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TransformMatrix = exports.Transform = void 0;
var matrix_1 = __webpack_require__(/*! ../math/matrix */ "./source/math/matrix.ts");
var quaternion_1 = __webpack_require__(/*! ../math/quaternion */ "./source/math/quaternion.ts");
var vector_1 = __webpack_require__(/*! ../math/vector */ "./source/math/vector.ts");
class Transform {
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
          var lRotationMatrix = this.getMatrix(TransformMatrix.Rotation);
          // Check if pivit point is used.
          var lPivotRotation;
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
          var lScale = this.getMatrix(TransformMatrix.Scale);
          var lTranslation = this.getMatrix(TransformMatrix.Translation);
          var lRotation = this.getMatrix(TransformMatrix.PivotRotation);
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
    var lPitch = pPitch !== null && pPitch !== void 0 ? pPitch : this.rotationPitch;
    var lYaw = pYaw !== null && pYaw !== void 0 ? pYaw : this.rotationYaw;
    var lRoll = pRoll !== null && pRoll !== void 0 ? pRoll : this.rotationRoll;
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
    this.mScale.data[0][0] = pWidth !== null && pWidth !== void 0 ? pWidth : this.scaleWidth;
    this.mScale.data[1][1] = pHeight !== null && pHeight !== void 0 ? pHeight : this.scaleHeight;
    this.mScale.data[2][2] = pDepth !== null && pDepth !== void 0 ? pDepth : this.scaleDepth;
  }
  /**
   * Set translation.
   * @param pX - Movement on worlds X axis.
   * @param pY - Movement on worlds Y axis.
   * @param pZ - Movement on worlds Z axis.
   */
  setTranslation(pX, pY, pZ) {
    this.mTranslation.data[0][3] = pX !== null && pX !== void 0 ? pX : this.translationX;
    this.mTranslation.data[1][3] = pY !== null && pY !== void 0 ? pY : this.translationY;
    this.mTranslation.data[2][3] = pZ !== null && pZ !== void 0 ? pZ : this.translationZ;
  }
  /**
   * Translate into rotation direction.
   * @param pForward - Forward movement.
   * @param pRight - Right movement.
   * @param pUp - Up movement.
   */
  translateInDirection(pForward, pRight, pUp) {
    var lTranslationVector = new vector_1.Vector([pRight, pUp, pForward, 1]);
    var lDirectionVector = this.getMatrix(TransformMatrix.Rotation).vectorMult(lTranslationVector);
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
})(TransformMatrix = exports.TransformMatrix || (exports.TransformMatrix = {}));

/***/ }),

/***/ "./source/base/view_projection/projection/orthographic -projection.ts":
/*!****************************************************************************!*\
  !*** ./source/base/view_projection/projection/orthographic -projection.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.OrthographicProjection = void 0;
var matrix_1 = __webpack_require__(/*! ../../../math/matrix */ "./source/math/matrix.ts");
class OrthographicProjection {
  /**
   * Constructor.
   */
  constructor() {
    this.mAspectRatio = 0;
    this.mFar = 0;
    this.mNear = 0;
    this.mWidth = 0;
    // Cache.
    this.mCacheProjection = null;
  }
  /**
   * Aspect ratio plane.
   */
  get aspectRatio() {
    return this.mAspectRatio;
  }
  set aspectRatio(pValue) {
    this.mAspectRatio = pValue;
    // Reset cache.
    this.mCacheProjection = null;
  }
  /**
   * Far plane.
   */
  get far() {
    return this.mFar;
  }
  set far(pValue) {
    this.mFar = pValue;
    // Reset cache.
    this.mCacheProjection = null;
  }
  /**
   * Near plane.
   */
  get near() {
    return this.mNear;
  }
  set near(pValue) {
    this.mNear = pValue;
    // Reset cache.
    this.mCacheProjection = null;
  }
  /**
   * Get projection matrix.
   */
  get projectionMatrix() {
    // Check cache or create new matrix.
    if (this.mCacheProjection === null) {
      this.mCacheProjection = this.createMatrix();
    }
    return this.mCacheProjection;
  }
  /**
   * Width of horizontal plane.
   */
  get width() {
    return this.mWidth;
  }
  set width(pValue) {
    this.mWidth = pValue;
    // Reset cache.
    this.mCacheProjection = null;
  }
  /**
   * Create projection matrix.
   */
  createMatrix() {
    // Calculate planes with centered camera on z-plane.
    var lFar = this.mFar;
    var lNear = this.mNear;
    // Left right half of width.
    var lRight = this.mWidth / 2;
    var lLeft = -lRight;
    // Top bottom calculated by width/height-aspect ratio.
    var lTop = lRight / this.mAspectRatio;
    var lBottom = -lTop;
    // Scale volume to match NDC X[-1. 1] , y[-1. 1], Z[0. 1]. Dividend is plane size.
    // SX => 2 / (Right - Left)
    // SY => 2 / (Top - Bottom)
    // SZ => 1 / (Far - Near)
    var lScaleX = 2 / (lRight - lLeft);
    var lScaleY = 2 / (lTop - lBottom);
    var lScaleZ = 1 / (lFar - lNear);
    // Center planes to webgl clip NDC with translation with near plane on Z=>0.
    // TX => -(Left + Right) / 2
    // TY => -(Top + Bottom) / 2
    // TZ => -Near
    // Multiplicate the transform and scale matrix.
    // ┌ SX  0   0  0 ┐   ┌ 1  0  0  TX ┐   ┌ SX 0  0  (SX * TX) ┐
    // | 0   SY  0  0 |   | 0  1  0  TY |   | 0  SY 0  (SY * TY) |
    // | 0   0   SZ 0 | x | 0  0  1  TZ | = | 0  0  SZ (SZ * TZ) |
    // └ 0   0   0  1 ┘   └ 0  0  0  1  ┘   └ 0  0  0      1     ┘
    // Shorten multiplications.
    // (SX * TX) => (2 / (Right - Left)) * (-(Left + Right) / 2) => -(Left + Right) / (Right - Left)
    // (SY * TY) => (2 / (Top - Bottom)) * (-(Top + Bottom) / 2) => -(Top + Bottom) / (Top - Bottom)
    // (SZ * TZ) => (1 / (Far - Near))   * -Near                 => -Near / (Far - Near)
    var lScaleTransformX = -(lLeft + lRight) / (lRight - lLeft);
    var lScaleTransformY = -(lTop + lBottom) / (lTop - lBottom);
    var lScaleTransformZ = -lNear / (lFar - lNear);
    // ┌ SX 0  0  -(Left + Right) / (Right - Left) ┐
    // | 0  SY 0  -(Top + Bottom) / (Top - Bottom) |
    // | 0  0  SZ           -Near / (Far - Near)   |
    // └ 0  0  0                  1                ┘
    // Build projection matrix.
    var lMatrix = matrix_1.Matrix.identity(4);
    // Fill Scale.
    lMatrix.data[0][0] = lScaleX;
    lMatrix.data[1][1] = lScaleY;
    lMatrix.data[2][2] = lScaleZ;
    // Fill transform.
    lMatrix.data[3][0] = lScaleTransformX;
    lMatrix.data[3][1] = lScaleTransformY;
    lMatrix.data[3][2] = lScaleTransformZ;
    return lMatrix;
  }
}
exports.OrthographicProjection = OrthographicProjection;

/***/ }),

/***/ "./source/base/view_projection/projection/perspective-projection.ts":
/*!**************************************************************************!*\
  !*** ./source/base/view_projection/projection/perspective-projection.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PerspectiveProjection = void 0;
var matrix_1 = __webpack_require__(/*! ../../../math/matrix */ "./source/math/matrix.ts");
class PerspectiveProjection {
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
   * Create projection matrix.
   */
  createMatrix() {
    var lMatrix = matrix_1.Matrix.identity(4);
    // Reset identity.
    lMatrix.data[0][0] = 0;
    lMatrix.data[1][1] = 0;
    lMatrix.data[2][2] = 0;
    lMatrix.data[3][3] = 0;
    // Calculate planes with centered camera on z-plane.
    var lFar = this.mFar;
    var lNear = this.mNear;
    // Top bottom calculated by get height from vertical angle of view.
    // Half angle is from y=>0 to top plane, as the angle descripes the distance between top and bottom plane.
    // Tan(angleOfView / 2) = Top / Near => Near * Tan(angleOfView / 2) = Top
    var lTop = this.mNear * Math.tan(this.angleOfView * Math.PI / 180 / 2);
    var lBottom = -lTop;
    // Left right calculated from aspect ratio.
    var lRight = lTop * this.aspectRatio;
    var lLeft = -lRight;
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

/***/ "./source/base/view_projection/view-projection.ts":
/*!********************************************************!*\
  !*** ./source/base/view_projection/view-projection.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CameraMatrix = exports.ViewProjection = void 0;
var transform_1 = __webpack_require__(/*! ../transform */ "./source/base/transform.ts");
class ViewProjection {
  /**
   * Constructor.
   */
  constructor(pProjection) {
    this.mProjection = pProjection;
    this.mTransformation = new transform_1.Transform();
  }
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
          var lTranslation = this.getMatrix(CameraMatrix.Translation);
          var lRotation = this.getMatrix(CameraMatrix.Rotation);
          return lTranslation.mult(lRotation).inverse();
        }
      case CameraMatrix.ViewProjection:
        {
          var lView = this.getMatrix(CameraMatrix.View);
          var lProjection = this.getMatrix(CameraMatrix.Projection);
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
})(CameraMatrix = exports.CameraMatrix || (exports.CameraMatrix = {}));

/***/ }),

/***/ "./source/core/bind_group/bind-group-layout.ts":
/*!*****************************************************!*\
  !*** ./source/core/bind_group/bind-group-layout.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroupLayout = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var bind_type_enum_1 = __webpack_require__(/*! ../enum/bind-type.enum */ "./source/core/enum/bind-type.enum.ts");
var gpu_native_object_1 = __webpack_require__(/*! ../gpu-native-object */ "./source/core/gpu-native-object.ts");
var bind_group_1 = __webpack_require__(/*! ./bind-group */ "./source/core/bind_group/bind-group.ts");
class BindGroupLayout extends gpu_native_object_1.GpuNativeObject {
  /**
   * Constructor.
   * @param pGpu - GPU.
   */
  constructor(pGpu) {
    super(pGpu, 'BIND_GROUP_LAYOUT');
    this.mGroupBinds = new core_data_1.Dictionary();
  }
  /**
   * Get basic information of group binds.
   */
  get binds() {
    var lResult = new Array();
    // Fetch general and basic information from group bind.
    for (var lBind of this.mGroupBinds.values()) {
      lResult.push({
        name: lBind.name,
        type: lBind.bindType,
        index: lBind.index
      });
    }
    return lResult;
  }
  /**
   * Add buffer bind.
   * @param pName - Bind name.
   * @param pIndex - Bind index.
   * @param pVisibility - Visibility.
   * @param pBindingType - Bind type.
   * @param pHasDynamicOffset - Has dynamic offset.
   * @param pMinBindingSize - min binding size.
   */
  addBuffer(pName, pIndex, pVisibility) {
    var pBindingType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'uniform';
    var pHasDynamicOffset = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    var pMinBindingSize = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
    this.mGroupBinds.set(pName, {
      index: pIndex,
      bindType: bind_type_enum_1.BindType.Buffer,
      name: pName,
      visibility: pVisibility,
      type: pBindingType,
      hasDynamicOffset: pHasDynamicOffset,
      minBindingSize: pMinBindingSize
    });
    // Request native object update.
    this.triggerChange();
  }
  /**
   * Add external texture bind.
   * @param pName - Bind name.
   * @param pIndex - Bind index.
   * @param pVisibility - Visibility.
   */
  addExternalTexture(pName, pIndex, pVisibility) {
    this.mGroupBinds.set(pName, {
      index: pIndex,
      bindType: bind_type_enum_1.BindType.ExternalTexture,
      name: pName,
      visibility: pVisibility
    });
    // Request native object update.
    this.triggerChange();
  }
  /**
   * Add sampler bind.
   * @param pName - Bind name.
   * @param pIndex - Bind index.
   * @param pVisibility - Visibility.
   * @param pSampleType - Sample type.
   */
  addSampler(pName, pIndex, pVisibility) {
    var pSampleType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'filtering';
    this.mGroupBinds.set(pName, {
      index: pIndex,
      bindType: bind_type_enum_1.BindType.Sampler,
      name: pName,
      visibility: pVisibility,
      type: pSampleType
    });
    // Request native object update.
    this.triggerChange();
  }
  /**
   * Add storage texture bind.
   * @param pName - Bind name.
   * @param pIndex - Bind index.
   * @param pVisibility - Visibility.
   * @param pFormat - Color format.
   * @param storageAccess - Storage access.
   * @param pDimension - Texture dimension.
   */
  addStorageTexture(pName, pIndex, pVisibility, pFormat) {
    var pStorageAccess = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'write-only';
    var pDimension = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '2d';
    this.mGroupBinds.set(pName, {
      name: pName,
      index: pIndex,
      bindType: bind_type_enum_1.BindType.StorageTexture,
      visibility: pVisibility,
      access: pStorageAccess,
      format: pFormat,
      viewDimension: pDimension
    });
    // Request native object update.
    this.triggerChange();
  }
  /**
   * Add texture bind.
   * @param pName - Bind name.
   * @param pIndex - Bind index.
   * @param pVisibility - Visibility.
   * @param pSampleType - Sample type.
   * @param pViewDimension - View dimension.
   * @param pMultisampled - Is multisampled.
   */
  addTexture(pName, pIndex, pVisibility) {
    var pSampleType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'float';
    var pViewDimension = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '2d';
    var pMultisampled = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : false;
    this.mGroupBinds.set(pName, {
      name: pName,
      index: pIndex,
      bindType: bind_type_enum_1.BindType.Texture,
      visibility: pVisibility,
      sampleType: pSampleType,
      viewDimension: pViewDimension,
      multisampled: pMultisampled
    });
    // Request native object update.
    this.triggerChange();
  }
  /**
   * Create bind group based on this layout.
   */
  createBindGroup() {
    var lBindGroup = new bind_group_1.BindGroup(this.gpu, this);
    lBindGroup.label = this.label;
    return lBindGroup;
  }
  /**
   * Get full bind information.
   * @param pName - Bind name.
   */
  getBind(pName) {
    if (!this.mGroupBinds.has(pName)) {
      throw new core_data_1.Exception("Bind ".concat(pName, " does not exist."), this);
    }
    return this.mGroupBinds.get(pName);
  }
  /**
   * Remove bind.
   */
  removeBind(pName) {
    if (this.mGroupBinds.delete(pName)) {
      // Request native object update.
      this.triggerChange();
    }
  }
  /**
   * Compare inner binds configurations.
   * @param pObject - Target object.
   */
  compare(pObject) {
    // Compare bind group size.
    if (this.mGroupBinds.size !== pObject.mGroupBinds.size) {
      return false;
    }
    for (var lBindName of this.mGroupBinds.keys()) {
      var lTarget = pObject.mGroupBinds.get(lBindName);
      var lSource = this.mGroupBinds.get(lBindName);
      // Validate bind layout existance.
      if (!lTarget || !lSource) {
        return false;
      }
      // Validate bind layout properties.
      if (lTarget.bindType !== lSource.bindType || lTarget.index !== lSource.index || lTarget.name !== lSource.name || lTarget.visibility !== lSource.visibility) {
        return false;
      }
    }
    return true;
  }
  /**
   * Generate layout.
   */
  generate() {
    var lEntryList = new Array();
    // Generate layout entry for each binding.
    for (var lEntry of this.mGroupBinds.values()) {
      // Generate default properties.
      var lLayoutEntry = {
        visibility: lEntry.visibility,
        binding: lEntry.index
      };
      switch (lEntry.bindType) {
        case bind_type_enum_1.BindType.Buffer:
          {
            var lBufferLayout = {
              type: lEntry.type,
              minBindingSize: lEntry.minBindingSize,
              hasDynamicOffset: lEntry.hasDynamicOffset
            };
            lLayoutEntry.buffer = lBufferLayout;
            break;
          }
        case bind_type_enum_1.BindType.Texture:
          {
            var lTextureLayout = {
              sampleType: lEntry.sampleType,
              multisampled: lEntry.multisampled,
              viewDimension: lEntry.viewDimension
            };
            lLayoutEntry.texture = lTextureLayout;
            break;
          }
        case bind_type_enum_1.BindType.ExternalTexture:
          {
            var lExternalTextureLayout = {};
            lLayoutEntry.externalTexture = lExternalTextureLayout;
            break;
          }
        case bind_type_enum_1.BindType.StorageTexture:
          {
            var lStorageTextureLayout = {
              access: lEntry.access,
              format: lEntry.format,
              viewDimension: lEntry.viewDimension
            };
            lLayoutEntry.storageTexture = lStorageTextureLayout;
            break;
          }
        case bind_type_enum_1.BindType.Sampler:
          {
            var lSamplerLayout = {
              type: lEntry.type
            };
            lLayoutEntry.sampler = lSamplerLayout;
            break;
          }
      }
      lEntryList.push(lLayoutEntry);
    }
    // Create binding group layout.
    return this.gpu.device.createBindGroupLayout({
      label: this.label,
      entries: lEntryList
    });
  }
}
exports.BindGroupLayout = BindGroupLayout;

/***/ }),

/***/ "./source/core/bind_group/bind-group.ts":
/*!**********************************************!*\
  !*** ./source/core/bind_group/bind-group.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroup = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var bind_type_enum_1 = __webpack_require__(/*! ../enum/bind-type.enum */ "./source/core/enum/bind-type.enum.ts");
var gpu_native_object_1 = __webpack_require__(/*! ../gpu-native-object */ "./source/core/gpu-native-object.ts");
var base_buffer_1 = __webpack_require__(/*! ../resource/buffer/base-buffer */ "./source/core/resource/buffer/base-buffer.ts");
var external_texture_1 = __webpack_require__(/*! ../resource/external-texture */ "./source/core/resource/external-texture.ts");
var texture_sampler_1 = __webpack_require__(/*! ../resource/texture-sampler */ "./source/core/resource/texture-sampler.ts");
var texture_view_1 = __webpack_require__(/*! ../resource/texture/texture-view */ "./source/core/resource/texture/texture-view.ts");
class BindGroup extends gpu_native_object_1.GpuNativeObject {
  /**
   * Constructor.
   * @param pGpu - GPU.
   * @param pLayout - Bind group layout.
   */
  constructor(pGpu, pLayout) {
    super(pGpu, 'BIND_GROUP');
    this.mLayout = pLayout;
    this.mBindData = new core_data_1.Dictionary();
    this.mNativeData = new WeakMap();
    // Register layout as internal.
    this.registerInternalNative(pLayout);
  }
  /**
   * Layout of bind group.
   */
  get layout() {
    return this.mLayout;
  }
  /**
   * Set data to layout binding.
   * @param pBindName - Bind layout entry name.
   * @param pData - Bind data.
   * @param pForcedType - Forced type. Can be used to differ for Texture and StorageTexture.
   */
  setData(pBindName, pData, pForcedType) {
    var lLayout = this.mLayout.getBind(pBindName);
    var lDataBindType = pForcedType !== null && pForcedType !== void 0 ? pForcedType : this.bindTypeOfData(pData);
    // Validate bind type with data type.
    if (lLayout.bindType !== lDataBindType) {
      throw new core_data_1.Exception("Bind data \"".concat(pBindName, "\" has wrong type"), this);
    }
    // Unregister possible old data and register new.
    if (this.mBindData.has(pBindName)) {
      this.unregisterInternalNative(this.mBindData.get(pBindName).data);
    }
    this.registerInternalNative(pData);
    // Set bind type to Teture for TS type check shutup.
    this.mBindData.set(pBindName, {
      type: lDataBindType,
      name: pBindName,
      data: pData
    });
  }
  /**
   * Generate native bind group.
   */
  generate() {
    var lEntryList = new Array();
    for (var lBindLayout of this.mLayout.binds) {
      var lBindData = this.mBindData.get(lBindLayout.name);
      // Check for 
      if (!lBindData) {
        throw new core_data_1.Exception("Bind data \"".concat(lBindLayout.name, "\" not set."), this);
      }
      // Check for type change.
      if (lBindData.type !== lBindLayout.type) {
        throw new core_data_1.Exception("Bind data \"".concat(lBindLayout.name, "\" has wrong type. The Layout might has been changed."), this);
      }
      // Set resource to group entry for each 
      var lGroupEntry = {
        binding: lBindLayout.index,
        resource: null
      };
      switch (lBindData.type) {
        case bind_type_enum_1.BindType.Buffer:
          {
            lGroupEntry.resource = {
              buffer: lBindData.data.native()
            };
            break;
          }
        case bind_type_enum_1.BindType.ExternalTexture:
          {
            lGroupEntry.resource = lBindData.data.native();
            break;
          }
        case bind_type_enum_1.BindType.Sampler:
          {
            lGroupEntry.resource = lBindData.data.native();
            break;
          }
        case bind_type_enum_1.BindType.StorageTexture:
          {
            lGroupEntry.resource = lBindData.data.native();
            break;
          }
        case bind_type_enum_1.BindType.Texture:
          {
            lGroupEntry.resource = lBindData.data.native();
            break;
          }
        default:
          {
            throw new core_data_1.Exception("Type \"".concat(lBindData.type, "\" not supported on bind group"), this);
          }
      }
      // Save generated native for validation state.
      this.mNativeData.set(lBindData.data.native(), lBindLayout.name);
      lEntryList.push(lGroupEntry);
    }
    return this.gpu.device.createBindGroup({
      label: this.label,
      layout: this.mLayout.native(),
      entries: lEntryList
    });
  }
  /**
   * Get type of bind data.
   * @param pData - Data object.
   */
  bindTypeOfData(pData) {
    if (pData instanceof texture_view_1.TextureView) {
      return bind_type_enum_1.BindType.Texture;
    } else if (pData instanceof base_buffer_1.BaseBuffer) {
      return bind_type_enum_1.BindType.Buffer;
    } else if (pData instanceof external_texture_1.ExternalTexture) {
      return bind_type_enum_1.BindType.ExternalTexture;
    }
    if (pData instanceof texture_sampler_1.TextureSampler) {
      return bind_type_enum_1.BindType.Sampler;
    }
    throw new core_data_1.Exception("Bind data \"".concat(pData.name, "\" not supported"), this);
  }
}
exports.BindGroup = BindGroup;

/***/ }),

/***/ "./source/core/bind_group/bind-groups.ts":
/*!***********************************************!*\
  !*** ./source/core/bind_group/bind-groups.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroups = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var gpu_native_object_1 = __webpack_require__(/*! ../gpu-native-object */ "./source/core/gpu-native-object.ts");
var bind_group_layout_1 = __webpack_require__(/*! ./bind-group-layout */ "./source/core/bind_group/bind-group-layout.ts");
class BindGroups extends gpu_native_object_1.GpuNativeObject {
  /**
   * Constructor.
   * @param pGpu  - Gpu.
   */
  constructor(pGpu) {
    super(pGpu, 'PIPELINE_LAYOUT_DESCRIPTOR');
    this.mBindGroups = new core_data_1.Dictionary();
  }
  /**
   * Bind group count.
   */
  get groups() {
    return [...this.mBindGroups.keys()];
  }
  /**
   * Create bind group.
   * @param pIndex - Group index.
   * @param pLayout - [Optional] Bind group Layout.
   */
  addGroup(pIndex, pLayout) {
    // Create and add bind group layout.
    var lBindLayout;
    if (pLayout) {
      lBindLayout = pLayout;
    } else {
      lBindLayout = new bind_group_layout_1.BindGroupLayout(this.gpu);
    }
    this.mBindGroups.add(pIndex, lBindLayout);
    // Register native object.
    this.registerInternalNative(lBindLayout);
    return lBindLayout;
  }
  /**
   * Get created bind group layout.
   * @param pIndex - Group index.
   */
  getGroup(pIndex) {
    // Throw on unaccessable group.
    if (!this.mBindGroups.has(pIndex)) {
      throw new core_data_1.Exception("Bind group layout (".concat(pIndex, ") does not exists."), this);
    }
    // Bind group should allways exist.
    return this.mBindGroups.get(pIndex);
  }
  /**
   * Generate native object.
   */
  generate() {
    // Generate pipeline layout from bind group layouts.
    var lPipelineLayout = {
      bindGroupLayouts: new Array()
    };
    for (var [lIndex, lBindGroupLayout] of this.mBindGroups) {
      lPipelineLayout.bindGroupLayouts[lIndex] = lBindGroupLayout.native();
    }
    // Validate continunity.
    if (this.mBindGroups.size !== lPipelineLayout.bindGroupLayouts.length) {
      throw new core_data_1.Exception("Bind group gap detected. Group not set.", this);
    }
    return lPipelineLayout;
  }
}
exports.BindGroups = BindGroups;

/***/ }),

/***/ "./source/core/buffer_type/array-buffer-type.ts":
/*!******************************************************!*\
  !*** ./source/core/buffer_type/array-buffer-type.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ArrayBufferType = void 0;
var wgsl_type_enum_1 = __webpack_require__(/*! ../shader/enum/wgsl-type.enum */ "./source/core/shader/enum/wgsl-type.enum.ts");
var buffer_type_1 = __webpack_require__(/*! ./buffer-type */ "./source/core/buffer_type/buffer-type.ts");
class ArrayBufferType extends buffer_type_1.BufferType {
  /**
   * Constructor.
   * @param pInnerType - Type of array.
   * @param pSize - Optional array size.
   */
  constructor(pName, pInnerType, pSize, pAccessMode, pBindType) {
    var pLocation = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    super(pName, pAccessMode, pBindType, pLocation);
    this.mInnerType = pInnerType;
    this.mArraySize = pSize !== null && pSize !== void 0 ? pSize : -1;
  }
  /**
   * Alignment of type.
   */
  get alignment() {
    return this.mInnerType.alignment;
  }
  /**
   * Array size.
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
    if (this.mArraySize === -1) {
      return this.mArraySize;
    }
    return this.mInnerType.size * this.mArraySize;
  }
  /**
   * Wgsl type.
   */
  get type() {
    return wgsl_type_enum_1.WgslType.Array;
  }
}
exports.ArrayBufferType = ArrayBufferType;

/***/ }),

/***/ "./source/core/buffer_type/buffer-type.ts":
/*!************************************************!*\
  !*** ./source/core/buffer_type/buffer-type.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BufferType = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
class BufferType {
  /**
   * Constructor.
   */
  constructor(pName, pAccessMode, pBindType) {
    var pLocation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    this.mAttributes = new core_data_1.Dictionary();
    // Static properties.
    this.mName = pName;
    this.mLocation = pLocation;
    this.mAccessMode = pAccessMode !== null && pAccessMode !== void 0 ? pAccessMode : null;
    this.mBindingType = pBindType !== null && pBindType !== void 0 ? pBindType : null;
  }
  /**
   * Buffer type access mode.
   */
  get accessMode() {
    return this.mAccessMode;
  }
  /**
   * Buffer bind type.
   */
  get bindingType() {
    return this.mBindingType;
  }
  /**
   * Get buffer location index as parameter.
   */
  get location() {
    return this.mLocation;
  }
  /**
   * Variable name of buffer.
   */
  get name() {
    return this.mName;
  }
  /**
   * Get attribute by name.
   * @param pName - Attribute name.
   */
  getAttribute(pName) {
    var _this$mAttributes$get;
    return (_this$mAttributes$get = this.mAttributes.get(pName)) !== null && _this$mAttributes$get !== void 0 ? _this$mAttributes$get : null;
  }
  /**
   * Set attribute
   * @param pAttribute - Attribute.
   */
  setAttribute(pAttribute) {
    this.mAttributes.set(pAttribute.name, pAttribute);
  }
}
exports.BufferType = BufferType;

/***/ }),

/***/ "./source/core/buffer_type/simple-buffer-type.ts":
/*!*******************************************************!*\
  !*** ./source/core/buffer_type/simple-buffer-type.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SimpleBufferType = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var wgsl_type_enum_1 = __webpack_require__(/*! ../shader/enum/wgsl-type.enum */ "./source/core/shader/enum/wgsl-type.enum.ts");
var buffer_type_1 = __webpack_require__(/*! ./buffer-type */ "./source/core/buffer_type/buffer-type.ts");
class SimpleBufferType extends buffer_type_1.BufferType {
  /**
   * Constructor.
   * @param pType - Simple type. Scalar, Atomic, Vector and Matrix types.
   * @param pGenerics - Generics of type.
   */
  constructor(pName, pType, pGenerics, pAccessMode, pBindType) {
    var pLocation = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : null;
    super(pName, pAccessMode, pBindType, pLocation);
    // Static properties.
    this.mType = pType;
    this.mGenericRawList = pGenerics !== null && pGenerics !== void 0 ? pGenerics : [];
    // Filter enum of generic list.
    this.mGenericList = this.mGenericRawList.map(pGeneric => {
      if (!core_data_1.EnumUtil.enumKeyByValue(wgsl_type_enum_1.WgslType, pGeneric)) {
        return wgsl_type_enum_1.WgslType.Enum;
      }
      return pGeneric;
    });
    // Get type restrictions.
    var lRestrictionList = SimpleBufferType.mTypeRestrictions[pType];
    if (!lRestrictionList) {
      throw new core_data_1.Exception("Type ".concat(pType, " not supported."), this);
    }
    // Find corresponding restrictions. // TODO: Check for enum or struct or any types.
    var lRestriction = lRestrictionList.find(pRestriction => {
      var _pRestriction$generic;
      return ((_pRestriction$generic = pRestriction.generic) === null || _pRestriction$generic === void 0 ? void 0 : _pRestriction$generic.toString()) === (pGenerics === null || pGenerics === void 0 ? void 0 : pGenerics.toString());
    });
    if (!lRestriction) {
      throw new core_data_1.Exception("No type (".concat(pType, ") restriction for generics [").concat(pGenerics, "] found."), this);
    }
    this.mAlignment = lRestriction.align;
    this.mSize = lRestriction.size;
  }
  /**
   * Alignment of type.
   */
  get alignment() {
    return this.mAlignment;
  }
  /**
   * Type generics.
   */
  get generics() {
    return this.mGenericList;
  }
  /**
   * Type generics.
   */
  get genericsRaw() {
    return this.mGenericRawList;
  }
  /**
   * Type size in byte.
   */
  get size() {
    return this.mSize;
  }
  /**
   * Wgsl type.
   */
  get type() {
    return this.mType;
  }
}
exports.SimpleBufferType = SimpleBufferType;
SimpleBufferType.mTypeRestrictions = (() => {
  var lTypes = {};
  // Scalar types.
  lTypes[wgsl_type_enum_1.WgslType.Boolean] = [{
    size: 1,
    align: 1
  }];
  lTypes[wgsl_type_enum_1.WgslType.Integer32] = [{
    size: 4,
    align: 4
  }];
  lTypes[wgsl_type_enum_1.WgslType.UnsignedInteger32] = [{
    size: 4,
    align: 4
  }];
  lTypes[wgsl_type_enum_1.WgslType.Float32] = [{
    size: 4,
    align: 4
  }];
  lTypes[wgsl_type_enum_1.WgslType.Float16] = [{
    size: 2,
    align: 2
  }];
  // Vector types.
  lTypes[wgsl_type_enum_1.WgslType.Vector2] = [{
    size: 8,
    align: 8,
    generic: [wgsl_type_enum_1.WgslType.Integer32]
  }, {
    size: 8,
    align: 8,
    generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
  }, {
    size: 8,
    align: 8,
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }, {
    size: 4,
    align: 4,
    generic: [wgsl_type_enum_1.WgslType.Float16]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Vector3] = [{
    size: 12,
    align: 16,
    generic: [wgsl_type_enum_1.WgslType.Integer32]
  }, {
    size: 12,
    align: 16,
    generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
  }, {
    size: 12,
    align: 16,
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }, {
    size: 6,
    align: 8,
    generic: [wgsl_type_enum_1.WgslType.Float16]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Vector4] = [{
    size: 16,
    align: 16,
    generic: [wgsl_type_enum_1.WgslType.Integer32]
  }, {
    size: 16,
    align: 16,
    generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
  }, {
    size: 16,
    align: 16,
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }, {
    size: 8,
    align: 8,
    generic: [wgsl_type_enum_1.WgslType.Float16]
  }];
  // Matrix types.
  lTypes[wgsl_type_enum_1.WgslType.Matrix22] = [{
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
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }, {
    size: 8,
    align: 4,
    generic: [wgsl_type_enum_1.WgslType.Float16]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Matrix23] = [{
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
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }, {
    size: 16,
    align: 8,
    generic: [wgsl_type_enum_1.WgslType.Float16]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Matrix24] = [{
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
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }, {
    size: 16,
    align: 8,
    generic: [wgsl_type_enum_1.WgslType.Float16]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Matrix32] = [{
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
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }, {
    size: 12,
    align: 4,
    generic: [wgsl_type_enum_1.WgslType.Float16]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Matrix33] = [{
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
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }, {
    size: 24,
    align: 8,
    generic: [wgsl_type_enum_1.WgslType.Float16]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Matrix34] = [{
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
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }, {
    size: 24,
    align: 8,
    generic: [wgsl_type_enum_1.WgslType.Float16]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Matrix42] = [{
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
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }, {
    size: 16,
    align: 4,
    generic: [wgsl_type_enum_1.WgslType.Float16]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Matrix43] = [{
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
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }, {
    size: 32,
    align: 8,
    generic: [wgsl_type_enum_1.WgslType.Float16]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Matrix44] = [{
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
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }, {
    size: 32,
    align: 8,
    generic: [wgsl_type_enum_1.WgslType.Float16]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Array] = [{
    size: -1,
    align: -1,
    generic: [wgsl_type_enum_1.WgslType.Any]
  }, {
    size: -1,
    align: -1,
    generic: [wgsl_type_enum_1.WgslType.Any, wgsl_type_enum_1.WgslType.UnsignedInteger32]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Struct] = [{
    size: -1,
    align: -1
  }];
  lTypes[wgsl_type_enum_1.WgslType.Atomic] = [{
    size: 4,
    align: 4,
    generic: [wgsl_type_enum_1.WgslType.Integer32]
  }, {
    size: 4,
    align: 4,
    generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
  }];
  // Type alias.
  // TODO:
  // None buffer types.
  //-------------------
  //Special.
  lTypes[wgsl_type_enum_1.WgslType.Pointer] = [{
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Enum, wgsl_type_enum_1.WgslType.Any, wgsl_type_enum_1.WgslType.Enum]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Reference] = [{
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Enum, wgsl_type_enum_1.WgslType.Any, wgsl_type_enum_1.WgslType.Enum]
  }];
  // Textures.
  lTypes[wgsl_type_enum_1.WgslType.Texture1d] = [{
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Integer32]
  }, {
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
  }, {
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Texture2d] = [{
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Integer32]
  }, {
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
  }, {
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Texture2dArray] = [{
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Integer32]
  }, {
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
  }, {
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }];
  lTypes[wgsl_type_enum_1.WgslType.Texture3d] = [{
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Integer32]
  }, {
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
  }, {
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }];
  lTypes[wgsl_type_enum_1.WgslType.TextureCube] = [{
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Integer32]
  }, {
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
  }, {
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }];
  lTypes[wgsl_type_enum_1.WgslType.TextureCubeArray] = [{
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Integer32]
  }, {
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
  }, {
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }];
  lTypes[wgsl_type_enum_1.WgslType.TextureMultisampled2d] = [{
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Integer32]
  }, {
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.UnsignedInteger32]
  }, {
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Float32]
  }];
  lTypes[wgsl_type_enum_1.WgslType.TextureExternal] = [{
    size: -1,
    align: 0
  }];
  // Depth texture.
  lTypes[wgsl_type_enum_1.WgslType.TextureDepth2d] = [{
    size: -1,
    align: 0
  }];
  lTypes[wgsl_type_enum_1.WgslType.TextureDepth2dArray] = [{
    size: -1,
    align: 0
  }];
  lTypes[wgsl_type_enum_1.WgslType.TextureDepthCube] = [{
    size: -1,
    align: 0
  }];
  lTypes[wgsl_type_enum_1.WgslType.TextureDepthCubeArray] = [{
    size: -1,
    align: 0
  }];
  lTypes[wgsl_type_enum_1.WgslType.TextureDepthMultisampled2d] = [{
    size: -1,
    align: 0
  }];
  // Storage textures.
  lTypes[wgsl_type_enum_1.WgslType.TextureStorage1d] = [{
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Enum, wgsl_type_enum_1.WgslType.Enum]
  }];
  lTypes[wgsl_type_enum_1.WgslType.TextureStorage2d] = [{
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Enum, wgsl_type_enum_1.WgslType.Enum]
  }];
  lTypes[wgsl_type_enum_1.WgslType.TextureStorage2dArray] = [{
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Enum, wgsl_type_enum_1.WgslType.Enum]
  }];
  lTypes[wgsl_type_enum_1.WgslType.TextureStorage3d] = [{
    size: -1,
    align: 0,
    generic: [wgsl_type_enum_1.WgslType.Enum, wgsl_type_enum_1.WgslType.Enum]
  }];
  // Sampler.
  lTypes[wgsl_type_enum_1.WgslType.Sampler] = [{
    size: -1,
    align: 0
  }];
  lTypes[wgsl_type_enum_1.WgslType.SamplerComparison] = [{
    size: -1,
    align: 0
  }];
  return lTypes;
})();

/***/ }),

/***/ "./source/core/buffer_type/struct-buffer-type.ts":
/*!*******************************************************!*\
  !*** ./source/core/buffer_type/struct-buffer-type.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StructBufferType = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var buffer_type_1 = __webpack_require__(/*! ./buffer-type */ "./source/core/buffer_type/buffer-type.ts");
var wgsl_type_enum_1 = __webpack_require__(/*! ../shader/enum/wgsl-type.enum */ "./source/core/shader/enum/wgsl-type.enum.ts");
class StructBufferType extends buffer_type_1.BufferType {
  /**
   * Constructor.
   */
  constructor(pName, pAccessMode, pBindType) {
    var pLocation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    super(pName, pAccessMode, pBindType, pLocation);
    this.mAlignment = 0;
    this.mSize = 0;
    this.mInnerTypes = new core_data_1.Dictionary();
  }
  /**
   * Alignment of type.
   */
  get alignment() {
    return this.mAlignment;
  }
  /**
   * Type size in byte.
   */
  get size() {
    return this.mSize;
  }
  /**
   * Wgsl type.
   */
  get type() {
    return wgsl_type_enum_1.WgslType.Struct;
  }
  /**
   * Add property to struct.
   * @param pName - Property name.
   * @param pIndex - Index of property.
   * @param pType - Property type.
   */
  addProperty(pName, pIndex, pType) {
    this.mInnerTypes.add(pName, [pIndex, pType]);
    // Recalculate alignment.
    if (pType.alignment > this.mAlignment) {
      this.mAlignment = pType.alignment;
    }
    // Get ordered types.
    var lOrderedTypeList = [...this.mInnerTypes.values()].sort((_ref, _ref2) => {
      var [pIndexA] = _ref;
      var [pIndexB] = _ref2;
      return pIndexA - pIndexB;
    }).map(_ref3 => {
      var [, pType] = _ref3;
      return pType;
    });
    // Recalculate size.
    var lCurrentOffset = 0;
    for (var lType of lOrderedTypeList) {
      // Increase offset when alignment does not match.
      // When alignment matches the modulo calculation is zero.
      lCurrentOffset += lCurrentOffset % lType.alignment;
      // Increase offset for type.
      lCurrentOffset += lType.size;
    }
    this.mSize = lCurrentOffset;
  }
  /**
   * Get types of properties with set location.
   */
  innerLocations() {
    var lLocationTypes = new Array();
    for (var [, lPropertyType] of this.mInnerTypes.values()) {
      // Set property as location when set.
      if (lPropertyType.location) {
        lLocationTypes.push(lPropertyType);
      }
      // Get all inner locations when property is a struct type.
      if (lPropertyType instanceof StructBufferType) {
        lLocationTypes.push(...lPropertyType.innerLocations());
      }
    }
    return lLocationTypes;
  }
}
exports.StructBufferType = StructBufferType;

/***/ }),

/***/ "./source/core/enum/bind-type.enum.ts":
/*!********************************************!*\
  !*** ./source/core/enum/bind-type.enum.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindType = void 0;
var BindType;
(function (BindType) {
  BindType["Texture"] = "Texture";
  BindType["Buffer"] = "Buffer";
  BindType["Sampler"] = "Sampler";
  BindType["StorageTexture"] = "StorageTexture";
  BindType["ExternalTexture"] = "ExternalTexture";
})(BindType = exports.BindType || (exports.BindType = {}));

/***/ }),

/***/ "./source/core/execution/instruction-executer.ts":
/*!*******************************************************!*\
  !*** ./source/core/execution/instruction-executer.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.InstructionExecuter = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
class InstructionExecuter {
  /**
   * Constructor.
   * @param pGpu - Gpu.
   */
  constructor(pGpu) {
    this.mGpu = pGpu;
    // Instruction sets.
    this.mInstructionSetList = new core_data_1.List();
  }
  /**
   * Add instruction set.
   * @param pSet - New instruction net.
   */
  addInstructionSet(pSet) {
    this.mInstructionSetList.push(pSet);
  }
  /**
   * Remove all instruction sets.
   */
  clearInstructions() {
    this.mInstructionSetList.clear();
  }
  execute() {
    // Generate encoder and add render commands.
    var lEncoder = this.mGpu.device.createCommandEncoder();
    // Execute instruction sets.
    for (var lInstructionSet of this.mInstructionSetList) {
      lInstructionSet.execute(lEncoder);
    }
    this.mGpu.device.queue.submit([lEncoder.finish()]);
  }
}
exports.InstructionExecuter = InstructionExecuter;

/***/ }),

/***/ "./source/core/execution/instruction/render-instruction.ts":
/*!*****************************************************************!*\
  !*** ./source/core/execution/instruction/render-instruction.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderInstruction = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
class RenderInstruction {
  /**
   * Constructor.
   */
  constructor(pPipeline, pRenderParameter) {
    var _this$mPipeline$shade;
    var pInstanceCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
    this.mBindGroups = new core_data_1.Dictionary();
    this.mRenderParameter = pRenderParameter;
    this.mPipeline = pPipeline;
    this.mInstanceCount = pInstanceCount;
    // Validate mesh and pipeline attributes length.
    if (pRenderParameter.attributesCount !== ((_this$mPipeline$shade = this.mPipeline.shader.vertexEntryPoint) === null || _this$mPipeline$shade === void 0 ? void 0 : _this$mPipeline$shade.attributes.length)) {
      var _this$mPipeline$shade2;
      throw new core_data_1.Exception("Mesh attributes (length:".concat(pRenderParameter.attributesCount, ") does not match pipeline attributes (length").concat((_this$mPipeline$shade2 = this.mPipeline.shader.vertexEntryPoint) === null || _this$mPipeline$shade2 === void 0 ? void 0 : _this$mPipeline$shade2.attributes.length, ")"), this);
    }
    // Validate mesh and pipeline attributes content.
    for (var lAttribute of this.mPipeline.shader.vertexEntryPoint.attributes) {
      var lMeshAttributeBuffer = pRenderParameter.getBuffer(lAttribute.name);
      if (lMeshAttributeBuffer.type !== lAttribute.bufferDataType) {
        throw new core_data_1.Exception("Mesh attributes does not match pipeline attributes", this);
      }
    }
  }
  /**
   * Get bind groups.
   */
  get bindGroups() {
    var lBindGroupList = new Array();
    for (var [lIndex, lBindGroup] of this.mBindGroups) {
      lBindGroupList[lIndex] = lBindGroup;
    }
    return lBindGroupList;
  }
  /**
   * Instance count.
   */
  get instanceCount() {
    return this.mInstanceCount;
  }
  /**
   * Instruction parameter.
   */
  get parameter() {
    return this.mRenderParameter;
  }
  /**
   * Instructions render pipeline.
   */
  get pipeline() {
    return this.mPipeline;
  }
  /**
   * Set bind group of pipeline.
   * @param pBindGroup - Bind group.
   */
  setBindGroup(pIndex, pBindGroup) {
    // Validate bind group layout.
    if (!this.mPipeline.shader.bindGroups.getGroup(pIndex).equal(pBindGroup.layout)) {
      throw new core_data_1.Exception("Bind data layout not matched with pipeline bind group layout.", this);
    }
    this.mBindGroups.set(pIndex, pBindGroup);
  }
}
exports.RenderInstruction = RenderInstruction;

/***/ }),

/***/ "./source/core/execution/instruction_set/render-instruction-set.ts":
/*!*************************************************************************!*\
  !*** ./source/core/execution/instruction_set/render-instruction-set.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderInstructionSet = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
class RenderInstructionSet {
  // TODO: Set  GPURenderPassEncoder.setScissorRect
  /**
   * Constructor.
   * @param pRenderPass - Render pass.
   */
  constructor(pRenderPass) {
    this.mRenderPass = pRenderPass;
    this.mInstructionList = new Array();
  }
  /**
   * Add render instruction.
   * @param pInstruction - Render instruction.
   */
  addInstruction(pInstruction) {
    // Validate instruction.
    if (pInstruction.pipeline.renderPass !== this.mRenderPass) {
      throw new core_data_1.Exception('Instruction render pass not valid for instruction set.', this);
    }
    // Add instruction.
    this.mInstructionList.push(pInstruction);
  }
  /**
   * Execute instruction set.
   * @param pCommandEncoder - Command encoder.
   */
  execute(pCommandEncoder) {
    // Generate pass descriptor once per set pipeline.
    var lPassDescriptor = this.mRenderPass.native();
    // Pass descriptor is set, when the pipeline ist set.
    var lRenderPassEncoder = pCommandEncoder.beginRenderPass(lPassDescriptor);
    // Instruction cache.
    var lPipeline = null;
    var lBindGroupList = new Array();
    var lVertexBufferList = new core_data_1.Dictionary();
    // Execute instructions.
    for (var lInstruction of this.mInstructionList) {
      // Use cached pipeline or use new.
      if (lInstruction.pipeline !== lPipeline) {
        lPipeline = lInstruction.pipeline;
        lRenderPassEncoder.setPipeline(lInstruction.pipeline.native());
      }
      // Add bind groups.
      for (var lIndex of lPipeline.shader.bindGroups.groups) {
        var lNewBindGroup = lInstruction.bindGroups[lIndex];
        var lCurrentBindGroup = lBindGroupList[lIndex];
        // Use cached bind group or use new.
        if (lNewBindGroup !== lCurrentBindGroup) {
          lBindGroupList[lIndex] = lNewBindGroup;
          if (lNewBindGroup) {
            lRenderPassEncoder.setBindGroup(lIndex, lNewBindGroup.native());
          }
        }
      }
      // Add vertex attribute buffer.
      for (var lAttribute of lInstruction.pipeline.shader.vertexEntryPoint.attributes) {
        var lNewAttributeBuffer = lInstruction.parameter.getBuffer(lAttribute.name);
        var lCurrentAttributeBuffer = lVertexBufferList.get(lAttribute.location);
        // Use cached vertex buffer or use new.
        if (lNewAttributeBuffer !== lCurrentAttributeBuffer) {
          lVertexBufferList.set(lAttribute.location, lNewAttributeBuffer);
          lRenderPassEncoder.setVertexBuffer(lAttribute.location, lNewAttributeBuffer.native());
        }
      }
      lRenderPassEncoder.draw(lInstruction.parameter.indexCount, lInstruction.instanceCount);
    }
    lRenderPassEncoder.end();
  }
}
exports.RenderInstructionSet = RenderInstructionSet;

/***/ }),

/***/ "./source/core/execution/parameter/render-parameter.ts":
/*!*************************************************************!*\
  !*** ./source/core/execution/parameter/render-parameter.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderParameter = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var simple_buffer_1 = __webpack_require__(/*! ../../resource/buffer/simple-buffer */ "./source/core/resource/buffer/simple-buffer.ts");
class RenderParameter {
  /**
   * Constructor.
   * @param pGpu - GPU.
   * @param pVertexIndices - Vertex indices.
   */
  constructor(pGpu, pVertexIndices) {
    this.mGpu = pGpu;
    this.mVertexBuffer = new core_data_1.Dictionary();
    this.mIndexData = pVertexIndices;
    this.mMaxIndex = Math.max(...pVertexIndices);
  }
  /**
   * Vertex attributes count.
   */
  get attributesCount() {
    return this.mVertexBuffer.size;
  }
  /**
   * Get index count.
   * Size of vertex data.
   */
  get indexCount() {
    return this.mIndexData.length;
  }
  /**
   * Get index count.
   * Size of vertex data.
   */
  get maxIndex() {
    return this.mMaxIndex;
  }
  /**
   * Get buffer by attribute name
   * @param pName - Vertex attribute name.
   */
  getBuffer(pName) {
    var lBuffer = this.mVertexBuffer.get(pName);
    if (!lBuffer) {
      throw new core_data_1.Exception("Vertex buffer for attribute \"".concat(pName, "\" not set"), this);
    }
    return lBuffer;
  }
  /**
   * Add data for each index.
   * @param pName - Attribute name.
   * @param pData - Data array.
   * @param pStrideLength - Data stride length for one value.
   */
  setIndexData(pName, pData, pStrideLength) {
    // Validate.
    if (pData.length % pStrideLength !== 0) {
      throw new core_data_1.Exception('Vertex data length offset.', this);
    }
    this.mVertexBuffer.set(pName, new simple_buffer_1.SimpleBuffer(this.mGpu, GPUBufferUsage.VERTEX, new Float32Array(pData)));
  }
  /**
   * Adds data for each vertex.
   * Converts vertex data into index data by dublicating vertex data for each index.
   * @param pName - Attribute name.
   * @param pData - Data array.
   * @param pStrideLength - Data stride length for one value.
   */
  setVertexData(pName, pData, pStrideLength) {
    // Validate data strides.
    if (pData.length % pStrideLength !== 0) {
      throw new core_data_1.Exception("Vertex data length offset: ".concat(pName, "(length: ").concat(pData.length, ", offset: ").concat(pData.length % pStrideLength, ")"), this);
    }
    if ((this.mMaxIndex + 1) * pStrideLength !== pData.length) {
      throw new core_data_1.Exception("Index data ".concat(pName, "(").concat(pData.length, ") does not meet needed data length of (max index: ").concat(this.mMaxIndex, ", needed length: ").concat((this.mMaxIndex + 1) * pStrideLength, ")"), this);
    }
    // Dublicate index data into vertex data.
    var lIndexData = new Array();
    for (var lIndex of this.mIndexData) {
      // Copy data stride for index.
      lIndexData.push(...pData.slice(lIndex * pStrideLength, (lIndex + 1) * pStrideLength));
    }
    this.mVertexBuffer.set(pName, new simple_buffer_1.SimpleBuffer(this.mGpu, GPUBufferUsage.VERTEX, new Float32Array(lIndexData)));
  }
}
exports.RenderParameter = RenderParameter;

/***/ }),

/***/ "./source/core/gpu-native-object.ts":
/*!******************************************!*\
  !*** ./source/core/gpu-native-object.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuNativeObject = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
/**
 * Gpu native object.
 */
class GpuNativeObject {
  /**
   * Constructor.
   * @param pGpu - Gpu object.
   * @param pNativeName - Name of native label.
   */
  constructor(pGpu, pNativeName) {
    this.mGpu = pGpu;
    this.mNativeObject = null;
    this.mLabel = '';
    this.mNativeName = pNativeName;
    // Trigger refresh on creation.
    this.mObjectInvalid = true;
    // Init internal native change detection.
    this.mChangeListener = new core_data_1.Dictionary();
    this.mInternalList = new Set();
  }
  /**
   * Debug label.
   */
  get label() {
    var lLabel = this.mNativeName;
    if (this.mLabel) {
      lLabel += '->' + this.mLabel;
    }
    return lLabel;
  }
  set label(pLabel) {
    this.mLabel = pLabel;
  }
  /**
   * Get global gpu.
   */
  get gpu() {
    return this.mGpu;
  }
  /**
   * Destroy generated native object.
   */
  destroy() {
    // Destroy old native object.
    if (this.mNativeObject) {
      this.destroyNative(this.mNativeObject);
      // Remove destroyed native.
      this.mNativeObject = null;
    }
  }
  /**
   * Compare two native objects.
   * @param pObject - Target object.
   */
  equal(pObject) {
    return this.compare(pObject);
  }
  /**
   * Get native object.
   */
  native() {
    // Invalidate oject when needed.
    this.invalidate();
    // Generate new native object when not already created.
    if (this.mObjectInvalid) {
      // Destroy native.
      this.destroy();
      // Reset object invalidation.
      this.mObjectInvalid = false;
      // Generate new native object.
      this.mNativeObject = this.generate();
    }
    return this.mNativeObject;
  }
  /**
   * Compare objects.
   * @param pObject - Target compare object.
   */
  compare(pObject) {
    return this === pObject;
  }
  /**
   * Destroy object.
   */
  destroyNative(_pNativeObject) {
    // Nothing to destroy. :)
  }
  /**
   * Register internal native object.
   * Invalidated native when internal changes.
   * @param pInternalNative - Internal used native.
   */
  registerInternalNative(pInternalNative) {
    // Save internal native.
    pInternalNative.addChangeListener(() => {
      this.triggerChange();
    }, this);
    this.mInternalList.add(pInternalNative);
    this.triggerChange();
  }
  /**
   * Trigger native change.
   */
  triggerChange() {
    // Trigger change.
    if (!this.mObjectInvalid) {
      this.mObjectInvalid = true;
      // Execute change listener.
      for (var lListener of this.mChangeListener.values()) {
        lListener();
      }
    }
  }
  /**
   * Unregister internal native object.
   * @param pInternalNative - Internal used native.
   */
  unregisterInternalNative(pInternalNative) {
    // Delete saved native.
    pInternalNative.removeChangeListener(this);
    this.mInternalList.delete(pInternalNative);
    this.triggerChange();
  }
  /**
   * Validate native object.
   */
  validate(_pNativeObject) {
    return true;
  }
  /**
   * Add change listener.
   * @param pListener - Change listener.
   * @param pReferrer - Referrer object.
   */
  addChangeListener(pListener, pReferrer) {
    this.mChangeListener.set(pReferrer, pListener);
  }
  /**
   * Invalidate native object.
   */
  invalidate() {
    // Invalidate internals.
    for (var lInternal of this.mInternalList) {
      lInternal.invalidate();
    }
    // Validate only when there is somthing to validate.
    if (!this.mObjectInvalid && this.mNativeObject) {
      if (!this.validate(this.mNativeObject)) {
        this.triggerChange();
      }
    }
  }
  /**
   * Remove change listener.
   * @param pReferrer - Referrer object.
   */
  removeChangeListener(pReferrer) {
    this.mChangeListener.delete(pReferrer);
  }
}
exports.GpuNativeObject = GpuNativeObject;

/***/ }),

/***/ "./source/core/gpu.ts":
/*!****************************!*\
  !*** ./source/core/gpu.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Gpu = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
class Gpu {
  /**
   * Constructor.
   * @param pGpuAdapter - Gpu adapter.
   * @param pGpuDevice - Gpu device.
   */
  constructor(pGpuAdapter, pGpuDevice) {
    this.mGpuAdapter = pGpuAdapter;
    this.mGpuDevice = pGpuDevice;
  }
  /**
   * Create GPU device.
   * @param pMode - Prefered device mode.
   */
  static create(pMode) {
    return _asyncToGenerator(function* () {
      var _Gpu$mAdapters$get, _Gpu$mDevices$get;
      // Try to load cached adapter. When not cached, request new one.
      var lAdapter = (_Gpu$mAdapters$get = Gpu.mAdapters.get(pMode)) !== null && _Gpu$mAdapters$get !== void 0 ? _Gpu$mAdapters$get : yield window.navigator.gpu.requestAdapter({
        powerPreference: pMode
      });
      if (lAdapter) {
        Gpu.mAdapters.set(pMode, lAdapter);
      } else {
        throw new core_data_1.Exception('Error requesting GPU adapter', Gpu);
      }
      // Try to load cached device. When not cached, request new one.
      var lDevice = (_Gpu$mDevices$get = Gpu.mDevices.get(lAdapter)) !== null && _Gpu$mDevices$get !== void 0 ? _Gpu$mDevices$get : yield lAdapter.requestDevice();
      if (lAdapter) {
        Gpu.mDevices.set(lAdapter, lDevice);
      } else {
        throw new core_data_1.Exception('Error requesting GPU device', Gpu);
      }
      return new Gpu(lAdapter, lDevice);
    })();
  }
  /**
   * GPU adapter.
   */
  get adapter() {
    return this.mGpuAdapter;
  }
  /**
   * GPU device.
   */
  get device() {
    return this.mGpuDevice;
  }
  /**
   * Preferred texture format.
   */
  get preferredFormat() {
    return window.navigator.gpu.getPreferredCanvasFormat();
  }
}
exports.Gpu = Gpu;
Gpu.mAdapters = new core_data_1.Dictionary();
Gpu.mDevices = new core_data_1.Dictionary();

/***/ }),

/***/ "./source/core/pass_descriptor/attachment-type.enum.ts":
/*!*************************************************************!*\
  !*** ./source/core/pass_descriptor/attachment-type.enum.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AttachmentType = void 0;
var AttachmentType;
(function (AttachmentType) {
  AttachmentType[AttachmentType["Canvas"] = 1] = "Canvas";
  AttachmentType[AttachmentType["Color"] = 2] = "Color";
  AttachmentType[AttachmentType["Depth"] = 4] = "Depth";
  AttachmentType[AttachmentType["Stencil"] = 8] = "Stencil";
})(AttachmentType = exports.AttachmentType || (exports.AttachmentType = {}));

/***/ }),

/***/ "./source/core/pass_descriptor/attachments.ts":
/*!****************************************************!*\
  !*** ./source/core/pass_descriptor/attachments.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Attachments = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var canvas_texture_1 = __webpack_require__(/*! ../resource/texture/canvas-texture */ "./source/core/resource/texture/canvas-texture.ts");
var texture_1 = __webpack_require__(/*! ../resource/texture/texture */ "./source/core/resource/texture/texture.ts");
var texture_usage_enum_1 = __webpack_require__(/*! ../resource/texture/texture-usage.enum */ "./source/core/resource/texture/texture-usage.enum.ts");
var attachment_type_enum_1 = __webpack_require__(/*! ./attachment-type.enum */ "./source/core/pass_descriptor/attachment-type.enum.ts");
var attachment_1 = __webpack_require__(/*! ./type/attachment */ "./source/core/pass_descriptor/type/attachment.ts");
class Attachments {
  /**
   * Constructor.
   * @param pGpu - GPU.
   */
  constructor(pGpu) {
    var pMultiSampleLevel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    this.mAttachments = new core_data_1.Dictionary();
    this.mAttachmentGroup = new core_data_1.Dictionary();
    this.mTextureGroup = new core_data_1.Dictionary();
    this.mGpu = pGpu;
    this.mRebuildRequested = false;
    this.mSize = {
      width: 1,
      height: 1
    };
    this.mMultiSampleLevel = pMultiSampleLevel;
  }
  /**
   * Attachment height.
   */
  get height() {
    return this.mSize.height;
  }
  /**
   * Attachment width.
   */
  get width() {
    return this.mSize.width;
  }
  /**
   * Add attachment. Forces rebuild of some groups.
   * @param pAttachment - Attachment.
   */
  addAttachment(pAttachment) {
    var _pAttachment$format, _pAttachment$layers;
    // Filter dublicates.
    if (this.mAttachments.has(pAttachment.name)) {
      throw new core_data_1.Exception("Attachment \"".concat(pAttachment.name, "\" already exists."), this);
    }
    // Auto detect format.
    var lFormat = (_pAttachment$format = pAttachment.format) !== null && _pAttachment$format !== void 0 ? _pAttachment$format : window.navigator.gpu.getPreferredCanvasFormat();
    // Special canvas treatment for fixed properties.
    var lType = pAttachment.type;
    var lCanvas = null;
    if ('canvas' in pAttachment) {
      lType |= attachment_type_enum_1.AttachmentType.Canvas; // Inject canvas type.
      lCanvas = pAttachment.canvas;
    }
    // Apply default value for layer count.
    var lLayerCount = (_pAttachment$layers = pAttachment.layers) !== null && _pAttachment$layers !== void 0 ? _pAttachment$layers : 1;
    // Force default for attachment
    var lAttachment = {
      type: lType,
      name: pAttachment.name,
      format: lFormat,
      layers: lLayerCount,
      canvas: lCanvas,
      attachment: new attachment_1.Attachment(this.mGpu, lFormat, lLayerCount)
    };
    // Set attachment.
    this.mAttachments.set(pAttachment.name, lAttachment);
    // Set refresh flag to refresh all textures on next load.
    this.mRebuildRequested = true;
  }
  /**
   * Get attachment by name.
   * @param pName - Attachment name.
   */
  getAttachment(pName) {
    // Rebuild textures.
    if (this.mRebuildRequested) {
      this.rebuildTetures();
    }
    // Try to get attachment
    var lAttachment = this.mAttachments.get(pName);
    if (!lAttachment) {
      throw new core_data_1.Exception("No attachment \"".concat(pName, "\" found."), this);
    }
    // Read cached attachments.
    return lAttachment.attachment;
  }
  /**
   * Check attachment by name.
   * @param pName - Attachment name.
   */
  hasAttachment(pName) {
    return this.mAttachments.has(pName);
  }
  /**
   * Resize all attachments.
   * @param pWidth - New width.
   * @param pHeight - New height.
   */
  resize(pWidth, pHeight) {
    // Only resize on actual size change.
    if (this.mSize.width === pWidth && this.mSize.height === pHeight) {
      return;
    }
    // Set size.
    this.mSize.width = pWidth;
    this.mSize.height = pHeight;
    // Apply with to all created textures.
    for (var lTexture of this.mTextureGroup.values()) {
      lTexture.width = this.mSize.width;
      lTexture.height = this.mSize.height;
    }
  }
  /**
   * Group attachments by texture format.
   * @param pAttachmentList - Attachments.
   */
  groupAttachments(pAttachmentList) {
    var lGroups = new core_data_1.Dictionary();
    for (var lAttachment of pAttachmentList) {
      // Get group name by format and multisamples.         
      var lGroupName = "Format: ".concat(lAttachment.format);
      // Exclude canvas by setting unique group names as they should never be grouped.
      var lCanvas = null;
      if ((lAttachment.type & attachment_type_enum_1.AttachmentType.Canvas) > 0) {
        lGroupName = "CANVAS--".concat(lAttachment.name, "--").concat(lGroupName);
        lCanvas = lAttachment.canvas;
      }
      // Create new group when not already created.
      if (!lGroups.has(lGroupName)) {
        lGroups.set(lGroupName, {
          name: lGroupName,
          format: lAttachment.format,
          attachments: new Array(),
          updatedNeeded: false,
          canvas: lCanvas
        });
      }
      // Get group and add attachment.
      lGroups.get(lGroupName).attachments.push(lAttachment);
    }
    // Groups cant be empty, as there is no detele attachment.
    // Check attachment count difference since last grouping.
    for (var lGroup of lGroups.values()) {
      if (lGroup.attachments.length !== this.mAttachmentGroup.get(lGroup.name)) {
        lGroup.updatedNeeded = true;
        // Update group value.
        this.mAttachmentGroup.set(lGroup.name, lGroup.attachments.length);
      }
    }
    return [...lGroups.values()];
  }
  /**
   * Rebuild textures that are outdated.
   */
  rebuildTetures() {
    // Group textures.
    for (var lGroup of this.groupAttachments([...this.mAttachments.values()])) {
      var _this$mTextureGroup$g;
      // Continue when group has not been updated.
      if (!lGroup.updatedNeeded) {
        continue;
      }
      // Destory old texture.
      (_this$mTextureGroup$g = this.mTextureGroup.get(lGroup.name)) === null || _this$mTextureGroup$g === void 0 ? void 0 : _this$mTextureGroup$g.destroy();
      // Build new texture or clear old one.
      if (lGroup.attachments.length > 0) {
        // Count layers of group.
        var lTextureLayerCount = lGroup.attachments.reduce((pCurrent, pNext) => {
          return pCurrent + pNext.layers;
        }, 0);
        // Create texture and set size and concat debug label.
        var lTexture = void 0;
        if (lGroup.canvas !== null) {
          var lCanvasTexture = new canvas_texture_1.CanvasTexture(this.mGpu, lGroup.canvas, lGroup.format, texture_usage_enum_1.TextureUsage.RenderAttachment | texture_usage_enum_1.TextureUsage.TextureBinding);
          lCanvasTexture.label = lGroup.name;
          lCanvasTexture.width = this.mSize.width;
          lCanvasTexture.height = this.mSize.height;
          lTexture = lCanvasTexture;
        } else {
          // Create fixed texture.
          var lFixedTexture = new texture_1.Texture(this.mGpu, lGroup.format, texture_usage_enum_1.TextureUsage.RenderAttachment | texture_usage_enum_1.TextureUsage.TextureBinding, '2d', this.mMultiSampleLevel, lTextureLayerCount);
          lFixedTexture.label = lGroup.name;
          lFixedTexture.width = this.mSize.width;
          lFixedTexture.height = this.mSize.height;
          lTexture = lFixedTexture;
        }
        // Create views from same texture.
        var lCurrentLayer = 0;
        for (var lAttachment of lGroup.attachments) {
          // Update attachment texture.
          lAttachment.attachment.updateTexture(lTexture, lCurrentLayer);
          // Increment layer.
          lCurrentLayer += lAttachment.layers;
        }
        // Update group texture.
        this.mTextureGroup.set(lGroup.name, lTexture);
      } else {
        // Remove group texture.
        this.mTextureGroup.delete(lGroup.name);
      }
    }
    this.mRebuildRequested = false;
  }
}
exports.Attachments = Attachments;

/***/ }),

/***/ "./source/core/pass_descriptor/render-pass-descriptor.ts":
/*!***************************************************************!*\
  !*** ./source/core/pass_descriptor/render-pass-descriptor.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderPassDescriptor = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var gpu_native_object_1 = __webpack_require__(/*! ../gpu-native-object */ "./source/core/gpu-native-object.ts");
class RenderPassDescriptor extends gpu_native_object_1.GpuNativeObject {
  /**
   * Constructor.
   * @param pGpu - Gpu.
   * @param pAttachments - Attachments.
   */
  constructor(pGpu, pAttachments) {
    super(pGpu, 'RENDER_PASS_DESCRIPTOR');
    // Set statics.
    this.mAttachments = pAttachments;
    // Init lists and defaults.
    this.mColorAttachments = new Array();
    this.mDepthStencilAttachment = null;
  }
  /**
   * Get render targets.
   */
  get colorAttachments() {
    var lTargets = new Array();
    for (var lColorAttachment of this.mColorAttachments) {
      lTargets.push(lColorAttachment.attachment);
    }
    return lTargets;
  }
  /**
   * Get depth attachment of render pass.
   */
  get depthAttachment() {
    if (!this.mDepthStencilAttachment) {
      return undefined;
    }
    return this.mDepthStencilAttachment.attachment;
  }
  /**
   * Set color attachment.
   * @param pAttachmentName - Attachment name.
   * @param pClearValue - Clear value.
   * @param pLoadOp - Load operation.
   * @param pStoreOp - Store operation.
   */
  setColorAttachment(pLocation, pAttachmentName, pClearValue, pLoadOp, pStoreOp, pResolveAttachmentName) {
    // Validate attachment existence.
    if (!this.mAttachments.hasAttachment(pAttachmentName)) {
      throw new core_data_1.Exception("Attachment \"".concat(pAttachmentName, "\" does not exist."), this);
    }
    if (pResolveAttachmentName && !this.mAttachments.hasAttachment(pResolveAttachmentName)) {
      throw new core_data_1.Exception("Resolve attachment \"".concat(pResolveAttachmentName, "\" does not exist."), this);
    }
    // Update internal attachment object.
    var lAttachment = this.mAttachments.getAttachment(pAttachmentName);
    if (this.mColorAttachments[pLocation]) {
      this.unregisterInternalNative(this.mColorAttachments[pLocation].attachment);
    }
    this.registerInternalNative(lAttachment);
    // Update internal resolve attachment object.
    var lResolveAttachment = null;
    if (pResolveAttachmentName) {
      lResolveAttachment = this.mAttachments.getAttachment(pResolveAttachmentName);
      if (this.mColorAttachments[pLocation] && this.mColorAttachments[pLocation].resolveTarget) {
        this.unregisterInternalNative(this.mColorAttachments[pLocation].resolveTarget);
      }
    }
    if (lResolveAttachment) {
      this.registerInternalNative(lResolveAttachment);
    }
    // Setup depth attachment.
    this.mColorAttachments[pLocation] = {
      attachment: lAttachment,
      clearValue: pClearValue,
      loadOp: pLoadOp !== null && pLoadOp !== void 0 ? pLoadOp : 'clear',
      storeOp: pStoreOp !== null && pStoreOp !== void 0 ? pStoreOp : 'store',
      resolveTarget: lResolveAttachment
    };
  }
  /**
   * Set depth attachment.
   * @param pAttachmentName - Attachment name.
   * @param pClearValue - Clear value.
   * @param pLoadOp - Load operation.
   * @param pStoreOp - Store operation.
   */
  setDepthAttachment(pAttachmentName, pClearValue, pLoadOp, pStoreOp) {
    // Validate attachment existence.
    if (!this.mAttachments.hasAttachment(pAttachmentName)) {
      throw new core_data_1.Exception("Attachment \"".concat(pAttachmentName, "\" does not exist."), this);
    }
    var lAttachment = this.mAttachments.getAttachment(pAttachmentName);
    // Update internal object.
    if (this.mDepthStencilAttachment) {
      this.unregisterInternalNative(this.mDepthStencilAttachment.attachment);
    }
    this.registerInternalNative(lAttachment);
    // Setup depth attachment.
    this.mDepthStencilAttachment = {
      attachment: lAttachment,
      clearValue: pClearValue,
      loadOp: pLoadOp !== null && pLoadOp !== void 0 ? pLoadOp : 'clear',
      storeOp: pStoreOp !== null && pStoreOp !== void 0 ? pStoreOp : 'store' // Apply default value.
    };
  }
  /**
   * Generate render pass descriptor.
   */
  generate() {
    // Create color attachments.
    var lColorAttachments = new Array();
    for (var lColorAttachment of this.mColorAttachments) {
      var lPassColorAttachment = {
        view: lColorAttachment.attachment.native(),
        clearValue: lColorAttachment.clearValue,
        loadOp: lColorAttachment.loadOp,
        storeOp: lColorAttachment.storeOp
      };
      // Resolve optional resolve attachment.
      if (lColorAttachment.resolveTarget) {
        lPassColorAttachment.resolveTarget = lColorAttachment.resolveTarget.native();
      }
      lColorAttachments.push(lPassColorAttachment);
    }
    // Create descriptor with color attachments.
    var lDescriptor = {
      colorAttachments: lColorAttachments
    };
    // Set optional depth attachment.
    if (this.mDepthStencilAttachment) {
      lDescriptor.depthStencilAttachment = {
        view: this.mDepthStencilAttachment.attachment.native(),
        depthClearValue: this.mDepthStencilAttachment.clearValue,
        depthLoadOp: this.mDepthStencilAttachment.loadOp,
        depthStoreOp: this.mDepthStencilAttachment.storeOp
      };
    }
    return lDescriptor;
  }
}
exports.RenderPassDescriptor = RenderPassDescriptor;

/***/ }),

/***/ "./source/core/pass_descriptor/type/attachment.ts":
/*!********************************************************!*\
  !*** ./source/core/pass_descriptor/type/attachment.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Attachment = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var gpu_native_object_1 = __webpack_require__(/*! ../../gpu-native-object */ "./source/core/gpu-native-object.ts");
class Attachment extends gpu_native_object_1.GpuNativeObject {
  /**
   * constructor.
   * @param pAttachment - Attachment.
   */
  constructor(pGpu, pFormat, pLayers) {
    super(pGpu, 'ATTACHMENT');
    this.mFormat = pFormat;
    this.mLayers = pLayers;
    // Set default.
    this.mTexture = null;
    this.mBaseArrayLayer = 0;
  }
  /**
   * Get texture format.
   */
  get format() {
    return this.mFormat;
  }
  /**
   * Multisample level of attachment.
   */
  get multiSampleLevel() {
    var _this$mTexture$multiS, _this$mTexture;
    return (_this$mTexture$multiS = (_this$mTexture = this.mTexture) === null || _this$mTexture === void 0 ? void 0 : _this$mTexture.multiSampleLevel) !== null && _this$mTexture$multiS !== void 0 ? _this$mTexture$multiS : 1;
  }
  /**
   * Update attachment texture.
   * @param pTexture - Attachment texture.
   * @param pBaseArrayLayer - Starting index of first texture layer.
   */
  updateTexture(pTexture, pBaseArrayLayer) {
    // Remove old and add new texture as internal native.
    if (this.mTexture) {
      this.unregisterInternalNative(this.mTexture);
    }
    this.registerInternalNative(pTexture);
    // Set new texture informations.
    this.mBaseArrayLayer = pBaseArrayLayer;
    this.mTexture = pTexture;
  }
  /**
   * Generate color attachment.
   */
  generate() {
    // Validate texture.
    if (!this.mTexture) {
      throw new core_data_1.Exception("Attachment \"".concat(this.label, "\" has no texture."), this);
    }
    var lTexture = this.mTexture.native();
    // Generate view.
    var lView = lTexture.createView({
      label: 'Texture-View' + this.mTexture.label,
      dimension: '2d',
      baseArrayLayer: this.mBaseArrayLayer,
      arrayLayerCount: this.mLayers
    });
    return lView;
  }
}
exports.Attachment = Attachment;

/***/ }),

/***/ "./source/core/pipeline/data/vertex-attribute.ts":
/*!*******************************************************!*\
  !*** ./source/core/pipeline/data/vertex-attribute.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexAttribute = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var gpu_native_object_1 = __webpack_require__(/*! ../../gpu-native-object */ "./source/core/gpu-native-object.ts");
var wgsl_type_enum_1 = __webpack_require__(/*! ../../shader/enum/wgsl-type.enum */ "./source/core/shader/enum/wgsl-type.enum.ts");
class VertexAttribute extends gpu_native_object_1.GpuNativeObject {
  /**
   * Constructor.
   * @param pBuffer - Buffer.
   */
  constructor(pGpu, pType) {
    var _gTypeToBufferType$pT;
    super(pGpu, 'VERTEX_ATTRIBUTE');
    // Format by type.
    var lGeneric = pType.generics.at(0);
    var lFormatStride = (_gTypeToBufferType$pT = gTypeToBufferType[pType.type]) === null || _gTypeToBufferType$pT === void 0 ? void 0 : _gTypeToBufferType$pT[lGeneric];
    // Throw on invalid parameter.
    if (!lFormatStride) {
      throw new core_data_1.Exception("Invalid attribute type for \"".concat(pType, "<").concat(lGeneric, ">\""), this);
    }
    this.mName = pType.name;
    this.mAttribute = {
      type: pType,
      dataType: lFormatStride.type,
      format: lFormatStride.format
    };
  }
  /**
   * Get underlying type of buffer.
   */
  get bufferDataType() {
    return this.mAttribute.dataType;
  }
  /**
   * Get attribute location.
   */
  get location() {
    return this.mAttribute.type.location;
  }
  /**
   * Attribute name.
   */
  get name() {
    return this.mName;
  }
  /**
   * Generate native object.
   */
  generate() {
    // Generate attributes.
    var lAttributes = new Array();
    lAttributes.push({
      format: this.mAttribute.format,
      offset: 0,
      shaderLocation: this.mAttribute.type.location
    });
    return {
      arrayStride: this.mAttribute.type.size,
      stepMode: 'vertex',
      attributes: lAttributes
    };
  }
}
exports.VertexAttribute = VertexAttribute;
var gTypeToBufferType = {
  // Single types.
  [wgsl_type_enum_1.WgslType.Float32]: {
    [wgsl_type_enum_1.WgslType.Any]: {
      format: 'float32',
      type: Float32Array
    }
  },
  [wgsl_type_enum_1.WgslType.Integer32]: {
    [wgsl_type_enum_1.WgslType.Any]: {
      format: 'sint32',
      type: Int32Array
    }
  },
  [wgsl_type_enum_1.WgslType.UnsignedInteger32]: {
    [wgsl_type_enum_1.WgslType.Any]: {
      format: 'uint32',
      type: Uint32Array
    }
  },
  // Vector types.
  [wgsl_type_enum_1.WgslType.Vector2]: {
    [wgsl_type_enum_1.WgslType.Float16]: {
      format: 'float16x2',
      type: Float32Array
    },
    [wgsl_type_enum_1.WgslType.Float32]: {
      format: 'float32x2',
      type: Float32Array
    },
    [wgsl_type_enum_1.WgslType.Integer32]: {
      format: 'sint32x2',
      type: Int32Array
    },
    [wgsl_type_enum_1.WgslType.UnsignedInteger32]: {
      format: 'uint32x2',
      type: Uint32Array
    }
  },
  [wgsl_type_enum_1.WgslType.Vector3]: {
    // [WgslType.Float16]: { format: 'float16x3', stride: 3 },
    [wgsl_type_enum_1.WgslType.Float32]: {
      format: 'float32x3',
      type: Float32Array
    },
    [wgsl_type_enum_1.WgslType.Integer32]: {
      format: 'sint32x3',
      type: Int32Array
    },
    [wgsl_type_enum_1.WgslType.UnsignedInteger32]: {
      format: 'uint32x3',
      type: Uint32Array
    }
  },
  [wgsl_type_enum_1.WgslType.Vector4]: {
    [wgsl_type_enum_1.WgslType.Float16]: {
      format: 'float16x4',
      type: Float32Array
    },
    [wgsl_type_enum_1.WgslType.Float32]: {
      format: 'float32x4',
      type: Float32Array
    },
    [wgsl_type_enum_1.WgslType.Integer32]: {
      format: 'sint32x4',
      type: Int32Array
    },
    [wgsl_type_enum_1.WgslType.UnsignedInteger32]: {
      format: 'uint32x3',
      type: Uint32Array
    }
  }
};

/***/ }),

/***/ "./source/core/pipeline/render-pipeline.ts":
/*!*************************************************!*\
  !*** ./source/core/pipeline/render-pipeline.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderPipeline = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var gpu_native_object_1 = __webpack_require__(/*! ../gpu-native-object */ "./source/core/gpu-native-object.ts");
class RenderPipeline extends gpu_native_object_1.GpuNativeObject {
  /**
   * Constructor.
   * @param pGpu - GPU.
   */
  constructor(pGpu, pShader, pRenderPass) {
    super(pGpu, 'RENDER_PIPELINE');
    // Set statics.
    this.mRenderPass = pRenderPass;
    // Set and register shader.
    this.mShader = pShader;
    this.registerInternalNative(pShader);
    // Validate vertex shader.
    if (!pShader.vertexEntryPoint) {
      throw new core_data_1.Exception('Vertex shader has no entry point.', this);
    }
    // Validate render pass to has same render target count as fragment.
    if (pShader.fragmentEntryPoint) {
      if (pRenderPass.colorAttachments.length !== pShader.fragmentEntryPoint.renderTargetCount) {
        throw new core_data_1.Exception("Render pass(".concat(pRenderPass.colorAttachments.length, ") and shader(").concat(pShader.fragmentEntryPoint.renderTargetCount, ") are having unmatching render targets"), this);
      }
    }
    // Set default values.
    this.mPrimitive = {
      frontFace: 'cw',
      cullMode: 'back',
      topology: 'triangle-list',
      unclippedDepth: false
    };
    this.mDepthWriteEnabled = true;
    this.mDepthCompare = 'less';
  }
  /**
   * Set depth compare function.
   */
  get depthCompare() {
    return this.mDepthCompare;
  }
  set depthCompare(pValue) {
    this.mDepthCompare = pValue;
    // Set data changed flag.
    this.triggerChange();
  }
  /**
   * Defines which polygon orientation will be culled.
   */
  get primitiveCullMode() {
    return this.mPrimitive.cullMode;
  }
  set primitiveCullMode(pValue) {
    this.mPrimitive.cullMode = pValue;
    // Set data changed flag.
    this.triggerChange();
  }
  /**
   * Defines which polygons are considered front-facing.
   */
  get primitiveFrontFace() {
    return this.mPrimitive.frontFace;
  }
  set primitiveFrontFace(pValue) {
    this.mPrimitive.frontFace = pValue;
    // Set data changed flag.
    this.triggerChange();
  }
  /**
   * The type of primitive to be constructed from the vertex inputs.
   */
  get primitiveTopology() {
    return this.mPrimitive.topology;
  }
  set primitiveTopology(pValue) {
    this.mPrimitive.topology = pValue;
    // Set data changed flag.
    this.triggerChange();
  }
  /**
   * Render pass of pipeline.
   */
  get renderPass() {
    return this.mRenderPass;
  }
  /**
   * Shader.
   */
  get shader() {
    return this.mShader;
  }
  /**
   * Set depth to never clip.
   */
  get unclipedDepth() {
    var _this$mPrimitive$uncl;
    return (_this$mPrimitive$uncl = this.mPrimitive.unclippedDepth) !== null && _this$mPrimitive$uncl !== void 0 ? _this$mPrimitive$uncl : false;
  }
  set unclipedDepth(pValue) {
    this.mPrimitive.unclippedDepth = pValue;
    // Set data changed flag.
    this.triggerChange();
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
    this.triggerChange();
  }
  /**
   * Generate native render pipeline.
   */
  generate() {
    // Generate pipeline layout from bind group layouts.
    var lPipelineLayout = this.mShader.bindGroups.native();
    // Generate vertex buffer layouts.
    var lVertexBufferLayoutList = new Array();
    for (var lAttribute of this.mShader.vertexEntryPoint.attributes) {
      // Set location offset based on previous  vertex attributes.
      lVertexBufferLayoutList.push(lAttribute.native());
    }
    // Construct basic GPURenderPipelineDescriptor.
    var lPipelineDescriptor = {
      label: this.label,
      layout: this.gpu.device.createPipelineLayout(lPipelineLayout),
      vertex: {
        module: this.mShader.native(),
        entryPoint: this.mShader.vertexEntryPoint.name,
        buffers: lVertexBufferLayoutList
        // No constants. Yes.
      },

      primitive: this.mPrimitive
    };
    // Buffer render pass formats.
    var lRenderPassBuffer = {
      color: new Array()
    };
    // Save highest multisample count.
    var lMultisampleCount = 1;
    // Optional fragment state.
    if (this.mShader.fragmentEntryPoint) {
      // Generate fragment targets only when fragment state is needed.
      var lFragmentTargetList = new Array();
      for (var lRenderTarget of this.mRenderPass.colorAttachments) {
        lFragmentTargetList.push({
          format: lRenderTarget.format
          // blend?: GPUBlendState;   // TODO: GPUBlendState
          // writeMask?: GPUColorWriteFlags; // TODO: GPUColorWriteFlags
        });
        // Save highest multisample count.
        if (lMultisampleCount < lRenderTarget.multiSampleLevel) {
          lMultisampleCount = lRenderTarget.multiSampleLevel;
        }
        // Save last render pass targets.
        lRenderPassBuffer.color.push(lRenderTarget.format);
      }
      lPipelineDescriptor.fragment = {
        module: this.mShader.native(),
        entryPoint: this.mShader.fragmentEntryPoint.name,
        targets: lFragmentTargetList
      };
    }
    // Setup optional depth attachment.
    var lDepthAttachment = this.mRenderPass.depthAttachment;
    if (lDepthAttachment) {
      lPipelineDescriptor.depthStencil = {
        depthWriteEnabled: this.mDepthWriteEnabled,
        depthCompare: this.mDepthCompare,
        format: lDepthAttachment.format
        // TODO: Stencil settings. 
      };
      // Save last render pass depth.
      lRenderPassBuffer.depth = lDepthAttachment.format;
    }
    // Set multisample count.
    if (lMultisampleCount > 1) {
      lPipelineDescriptor.multisample = {
        count: lMultisampleCount
      };
    }
    // Async is none GPU stalling.
    return this.gpu.device.createRenderPipeline(lPipelineDescriptor); // TODO: Async somehow.
  }
}

exports.RenderPipeline = RenderPipeline;

/***/ }),

/***/ "./source/core/resource/buffer/base-buffer.ts":
/*!****************************************************!*\
  !*** ./source/core/resource/buffer/base-buffer.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseBuffer = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var gpu_native_object_1 = __webpack_require__(/*! ../../gpu-native-object */ "./source/core/gpu-native-object.ts");
class BaseBuffer extends gpu_native_object_1.GpuNativeObject {
  /**
   * Constructor.
   * @param pGpu - GPU.
   * @param pUsage - Buffer usage beside COPY_DST.
   * @param pData  - Inital data. Can be empty.
   */
  constructor(pGpu, pUsage, pData) {
    super(pGpu, 'BUFFER');
    this.mBufferUsage = pUsage;
    this.mInitData = pData;
    this.mBufferLength = pData.length;
    this.mDataType = pData.constructor;
  }
  /**
   * Buffer size in items.
   */
  get length() {
    return this.mBufferLength;
  }
  /**
   * Buffer size in bytes aligned to 4 bytes.
   */
  get size() {
    return this.mBufferLength * this.type.BYTES_PER_ELEMENT + 3 & ~3;
  }
  /**
   * Underlying data type.
   */
  get type() {
    return this.mDataType;
  }
  /**
   * Destroy native object.
   * @param pNativeObject - Native object.
   */
  destroyNative(pNativeObject) {
    pNativeObject.destroy();
  }
  /**
   * Generate native object.
   */
  generate() {
    // Generate new empty init data.
    if (!this.mInitData) {
      this.mInitData = new this.mDataType(this.mBufferLength);
    }
    // Create gpu buffer mapped
    var lBuffer = this.gpu.device.createBuffer({
      label: this.label,
      size: this.size,
      usage: this.mBufferUsage,
      mappedAtCreation: this.mInitData.length > 0 // Map data when buffer would receive initial data.
    });
    // Copy only when data is available.
    if (this.mInitData.length > 0) {
      if (this.mInitData.length > this.size) {
        throw new core_data_1.Exception('Buffer data exeedes buffer size.', this);
      }
      var lData = new this.mDataType(lBuffer.getMappedRange());
      lData.set(this.mInitData, 0);
      // unmap buffer.
      lBuffer.unmap();
    }
    // Clear init data.
    this.mInitData = null;
    return lBuffer;
  }
}
exports.BaseBuffer = BaseBuffer;

/***/ }),

/***/ "./source/core/resource/buffer/ring-buffer.ts":
/*!****************************************************!*\
  !*** ./source/core/resource/buffer/ring-buffer.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RingBuffer = void 0;
var base_buffer_1 = __webpack_require__(/*! ./base-buffer */ "./source/core/resource/buffer/base-buffer.ts");
class RingBuffer extends base_buffer_1.BaseBuffer {
  /**
   * Constructor.
   * @param pGpu - GPU.
   * @param pUsage - Buffer usage beside COPY_DST.
   * @param pInitialData  - Inital data. Can be empty.
   */
  constructor(pGpu, pUsage, pInitialData) {
    super(pGpu, pUsage | GPUBufferUsage.COPY_DST, pInitialData);
    // Waving buffer list.
    this.mReadyBufferList = new Array();
    this.mWavingBufferList = new Array();
  }
  /**
   * Request buffer write.
   * @param pBufferCallback - Callback called on buffer access.
   */
  write(pBufferCallback) {
    // Create new buffer when no mapped buffer is available. 
    var lStagingBuffer;
    if (this.mReadyBufferList.length === 0) {
      lStagingBuffer = this.gpu.device.createBuffer({
        label: 'RingBuffer-WaveBuffer-' + this.label,
        size: this.size,
        usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
        mappedAtCreation: true
      });
      // Add new buffer to complete list.
      this.mWavingBufferList.push(lStagingBuffer);
    } else {
      lStagingBuffer = this.mReadyBufferList.pop();
    }
    // Execute write operations.
    var lBufferArray = new this.type(lStagingBuffer.getMappedRange());
    pBufferCallback(lBufferArray);
    // Unmap for copying data.
    lStagingBuffer.unmap();
    // Copy buffer data from staging into wavig buffer.
    var lCommandDecoder = this.gpu.device.createCommandEncoder();
    lCommandDecoder.copyBufferToBuffer(lStagingBuffer, 0, this.native(), 0, this.size);
    this.gpu.device.queue.submit([lCommandDecoder.finish()]);
    // Shedule staging buffer remaping.
    lStagingBuffer.mapAsync(GPUMapMode.WRITE).then(() => {
      this.mReadyBufferList.push(lStagingBuffer);
    });
  }
  /**
   * Destory all buffers.
   * @param pNativeObject - Native buffer object.
   */
  destroyNative(pNativeObject) {
    super.destroyNative(pNativeObject);
    // Destroy all wave buffer and clear list.
    for (var lCount = 0; this.mWavingBufferList.length < lCount; lCount++) {
      var _this$mWavingBufferLi;
      (_this$mWavingBufferLi = this.mWavingBufferList.pop()) === null || _this$mWavingBufferLi === void 0 ? void 0 : _this$mWavingBufferLi.destroy();
    }
    // Clear ready buffer list.
    for (var _lCount = 0; this.mReadyBufferList.length < _lCount; _lCount++) {
      this.mReadyBufferList.pop();
    }
  }
}
exports.RingBuffer = RingBuffer;

/***/ }),

/***/ "./source/core/resource/buffer/simple-buffer.ts":
/*!******************************************************!*\
  !*** ./source/core/resource/buffer/simple-buffer.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SimpleBuffer = void 0;
var base_buffer_1 = __webpack_require__(/*! ./base-buffer */ "./source/core/resource/buffer/base-buffer.ts");
class SimpleBuffer extends base_buffer_1.BaseBuffer {
  /**
   * Constructor.
   * @param pGpu - GPU.
   * @param pUsage - Buffer usage beside COPY_DST.
   * @param pInitialData  - Inital data. Can be empty.
   */
  constructor(pGpu, pUsage, pInitialData) {
    super(pGpu, pUsage | GPUBufferUsage.COPY_DST, pInitialData);
  }
  /**
   * Request buffer write.
   * @param pBufferCallback - Callback called on buffer access.
   */
  write(pBufferCallback) {
    var lBuffer = this.native();
    // Create new typed array and add new data to this new array.
    var lSourceBuffer = new this.type(this.length);
    pBufferCallback(lSourceBuffer);
    // Write copied buffer.
    this.gpu.device.queue.writeBuffer(lBuffer, 0, lSourceBuffer, 0, lSourceBuffer.length);
  }
}
exports.SimpleBuffer = SimpleBuffer;

/***/ }),

/***/ "./source/core/resource/external-texture.ts":
/*!**************************************************!*\
  !*** ./source/core/resource/external-texture.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ExternalTexture = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var gpu_native_object_1 = __webpack_require__(/*! ../gpu-native-object */ "./source/core/gpu-native-object.ts");
class ExternalTexture extends gpu_native_object_1.GpuNativeObject {
  /**
   * Constructor.
   * @param pGpu - GPU.
   */
  constructor(pGpu) {
    super(pGpu, 'EXTERNAL_TEXTURE');
    this.mVideoElement = null;
  }
  /**
   * Loaded video element.
   */
  get video() {
    if (!this.mVideoElement) {
      throw new core_data_1.Exception('No video element is loaded or old video is expired.', this);
    }
    return this.mVideoElement;
  }
  /**
   *
   * @param pSource - Video source.
   * @param pLoop - Loop video.
   * @param pMuted - Mute video.
   */
  load(pSource) {
    var _this = this;
    var pLoop = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var pMuted = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
    return _asyncToGenerator(function* () {
      var lVideo = new HTMLVideoElement();
      lVideo.loop = pLoop;
      lVideo.muted = pMuted;
      lVideo.src = pSource;
      // Wait for resource load and pause right after.
      yield lVideo.play();
      lVideo.pause();
      _this.mVideoElement = lVideo;
    })();
  }
  /**
   * Generate new external texture.
   */
  generate() {
    if (!this.mVideoElement) {
      throw new core_data_1.Exception('No video element is loaded or old video is expired.', this);
    }
    return this.gpu.device.importExternalTexture({
      label: this.label,
      source: this.mVideoElement,
      colorSpace: 'srgb'
    });
  }
}
exports.ExternalTexture = ExternalTexture;

/***/ }),

/***/ "./source/core/resource/texture-sampler.ts":
/*!*************************************************!*\
  !*** ./source/core/resource/texture-sampler.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureSampler = void 0;
var gpu_native_object_1 = __webpack_require__(/*! ../gpu-native-object */ "./source/core/gpu-native-object.ts");
class TextureSampler extends gpu_native_object_1.GpuNativeObject {
  /**
   * Constructor.
   * @param pGpu - GPU.
   */
  constructor(pGpu) {
    super(pGpu, 'TEXTURE_SAMPLER');
    // Set defaults.
    this.mCompare = null;
    this.mFitMode = 'clamp-to-edge';
    this.mMagFilter = 'nearest';
    this.mMinFilter = 'nearest';
    this.mMipmapFilter = 'nearest';
    this.mLodMinClamp = 0;
    this.mLodMaxClamp = 32;
    this.mMaxAnisotropy = 1;
  }
  /**
   * When provided the sampler will be a comparison sampler with the specified compare function.
   */
  get compareFunction() {
    return this.mCompare;
  }
  set compareFunction(pValue) {
    // Do nothing on assigning old an value.
    if (this.mCompare === pValue) {
      return;
    }
    this.mCompare = pValue;
    // Request native rebuild.
    this.triggerChange();
  }
  /**
   * Texture sampler edge fit mode.
   */
  get fitMode() {
    return this.mFitMode;
  }
  set fitMode(pValue) {
    // Do nothing on assigning old an value.
    if (this.mFitMode === pValue) {
      return;
    }
    this.mFitMode = pValue;
    // Request native rebuild.
    this.triggerChange();
  }
  /**
   * Specifies the maximum levels of detail, respectively, used internally when sampling a texture.
   */
  get lodMaxClamp() {
    return this.mLodMaxClamp;
  }
  set lodMaxClamp(pValue) {
    // Do nothing on assigning old an value.
    if (this.mLodMaxClamp === pValue) {
      return;
    }
    this.mLodMaxClamp = pValue;
    // Request native rebuild.
    this.triggerChange();
  }
  /**
   * Specifies the minimum levels of detail, respectively, used internally when sampling a texture.
   */
  get lodMinClamp() {
    return this.mLodMinClamp;
  }
  set lodMinClamp(pValue) {
    // Do nothing on assigning old an value.
    if (this.mLodMinClamp === pValue) {
      return;
    }
    this.mLodMinClamp = pValue;
    // Request native rebuild.
    this.triggerChange();
  }
  /**
   * How the texture is sampled when a texel covers more than one pixel.
   */
  get magFilter() {
    return this.mMagFilter;
  }
  set magFilter(pValue) {
    // Do nothing on assigning old an value.
    if (this.mMagFilter === pValue) {
      return;
    }
    this.mMagFilter = pValue;
    // Request native rebuild.
    this.triggerChange();
  }
  /**
   * Specifies the maximum anisotropy value clamp used by the sampler.
   */
  get maxAnisotropy() {
    return this.mMaxAnisotropy;
  }
  set maxAnisotropy(pValue) {
    // Do nothing on assigning old an value.
    if (this.mMaxAnisotropy === pValue) {
      return;
    }
    this.mMaxAnisotropy = pValue;
    // Request native rebuild.
    this.triggerChange();
  }
  /**
   * How the texture is sampled when a texel covers less than one pixel.
   */
  get minFilter() {
    return this.mMinFilter;
  }
  set minFilter(pValue) {
    // Do nothing on assigning old an value.
    if (this.mMinFilter === pValue) {
      return;
    }
    this.mMinFilter = pValue;
    // Request native rebuild.
    this.triggerChange();
  }
  /**
   * Specifies behavior for sampling between mipmap levels.
   */
  get mipmapFilter() {
    return this.mMipmapFilter;
  }
  set mipmapFilter(pValue) {
    // Do nothing on assigning old an value.
    if (this.mMipmapFilter === pValue) {
      return;
    }
    this.mMipmapFilter = pValue;
    // Request native rebuild.
    this.triggerChange();
  }
  /**
   * Generate txture sampler.
   */
  generate() {
    var lSamplerOptions = {
      label: this.label,
      addressModeU: this.mFitMode,
      addressModeV: this.mFitMode,
      addressModeW: this.mFitMode,
      magFilter: this.magFilter,
      minFilter: this.minFilter,
      mipmapFilter: this.mipmapFilter,
      lodMaxClamp: this.lodMaxClamp,
      lodMinClamp: this.lodMinClamp,
      maxAnisotropy: this.mMaxAnisotropy
    };
    if (this.compareFunction) {
      lSamplerOptions.compare = this.compareFunction;
    }
    return this.gpu.device.createSampler(lSamplerOptions);
  }
}
exports.TextureSampler = TextureSampler;

/***/ }),

/***/ "./source/core/resource/texture/canvas-texture.ts":
/*!********************************************************!*\
  !*** ./source/core/resource/texture/canvas-texture.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CanvasTexture = void 0;
var gpu_native_object_1 = __webpack_require__(/*! ../../gpu-native-object */ "./source/core/gpu-native-object.ts");
var texture_view_1 = __webpack_require__(/*! ./texture-view */ "./source/core/resource/texture/texture-view.ts");
class CanvasTexture extends gpu_native_object_1.GpuNativeObject {
  /**
   * Constructor.
   * @param pGpu - GPU.
   * @param pCanvas - HTML Canvas.
   * @param pFormat - Texture color format.
   * @param pUsage - Texture usage.
   */
  constructor(pGpu, pCanvas, pFormat, pUsage) {
    super(pGpu, 'CANVAS_TEXTURE');
    this.mCanvas = pCanvas;
    this.mFormat = pFormat;
    this.mUsage = pUsage;
    // Get and configure context.
    this.mContext = pCanvas.getContext('webgpu');
    this.mContext.configure({
      device: this.gpu.device,
      format: pFormat,
      usage: pUsage,
      alphaMode: 'opaque'
    });
    window.aaa = this.mContext;
  }
  /**
   * Texture dimension.
   * Fixed to 2D.
   */
  get dimension() {
    return '2d';
  }
  /**
   * Texture format.
   */
  get format() {
    return this.mFormat;
  }
  /**
   * Texture and canvas height.
   */
  get height() {
    return this.mCanvas.height;
  }
  set height(pHeight) {
    this.mCanvas.height = pHeight;
  }
  /**
   * Texture layers.
   * Fixed to one.
   */
  get layer() {
    return 1;
  }
  /**
   * Texture multi sample level.
   * Fixed to one.
   */
  get multiSampleLevel() {
    return 1;
  }
  /**
   * Texture usage.
   */
  get usage() {
    return this.mUsage;
  }
  /**
   * Texture and canvas height.
   */
  get width() {
    return this.mCanvas.width;
  }
  set width(pWidth) {
    this.mCanvas.width = pWidth;
  }
  /**
   * Create view of this texture.
   */
  view(pBaseLayer, pLayerCount) {
    var lView = new texture_view_1.TextureView(this.gpu, this, pBaseLayer, pLayerCount);
    lView.label = this.label;
    return lView;
  }
  /**
   * Get current canvas texture.
   */
  generate() {
    var lTexture = this.mContext.getCurrentTexture();
    lTexture.label = this.label;
    return lTexture;
  }
  /**
   * Allways invalidate current texture to generate latest texture.
   */
  validate(pNativeObject) {
    return this.mContext.getCurrentTexture() === pNativeObject;
  }
}
exports.CanvasTexture = CanvasTexture;

/***/ }),

/***/ "./source/core/resource/texture/texture-usage.enum.ts":
/*!************************************************************!*\
  !*** ./source/core/resource/texture/texture-usage.enum.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureUsage = void 0;
var TextureUsage;
(function (TextureUsage) {
  TextureUsage[TextureUsage["CopySource"] = GPUTextureUsage.COPY_SRC] = "CopySource";
  TextureUsage[TextureUsage["CopyDestination"] = GPUTextureUsage.COPY_DST] = "CopyDestination";
  TextureUsage[TextureUsage["TextureBinding"] = GPUTextureUsage.TEXTURE_BINDING] = "TextureBinding";
  TextureUsage[TextureUsage["StorageBinding"] = GPUTextureUsage.STORAGE_BINDING] = "StorageBinding";
  TextureUsage[TextureUsage["RenderAttachment"] = GPUTextureUsage.RENDER_ATTACHMENT] = "RenderAttachment";
})(TextureUsage = exports.TextureUsage || (exports.TextureUsage = {}));

/***/ }),

/***/ "./source/core/resource/texture/texture-view.ts":
/*!******************************************************!*\
  !*** ./source/core/resource/texture/texture-view.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureView = void 0;
var gpu_native_object_1 = __webpack_require__(/*! ../../gpu-native-object */ "./source/core/gpu-native-object.ts");
class TextureView extends gpu_native_object_1.GpuNativeObject {
  /**
   * Constructor.
   * @param pGpu - GPU.
   * @param pTexture - Texture of view.
   * @param pBaseLayer - Base layer of view.
   * @param pLayerCount - Depth of view.
   */
  constructor(pGpu, pTexture, pBaseLayer, pLayerCount) {
    super(pGpu, 'TEXTURE_VIEW');
    this.mTexture = pTexture;
    this.mBaseLayer = pBaseLayer !== null && pBaseLayer !== void 0 ? pBaseLayer : 0;
    this.mLayerCount = pLayerCount !== null && pLayerCount !== void 0 ? pLayerCount : this.mTexture.layer;
    // Set default values.
    this.mDimension = '2d';
    this.mAspect = 'all';
    this.mBaseMipLevel = 0;
    this.mMipLevelCount = 1;
    // Register texture as internal.
    this.registerInternalNative(pTexture);
  }
  /**
   * Which aspecs of the texture are accessible to the texture view.
   */
  get aspect() {
    return this.mAspect;
  }
  set aspect(pAspect) {
    // Do nothing on assigning old an value.
    if (this.mAspect === pAspect) {
      return;
    }
    this.mAspect = pAspect;
    // Trigger update.
    this.triggerChange();
  }
  /**
   * The index of the first array layer accessible to the texture view.
   */
  get baseLayer() {
    return this.mBaseLayer;
  }
  /**
   * The first (most detailed) mipmap level accessible to the texture view.
   */
  get baseMipLevel() {
    return this.mBaseMipLevel;
  }
  set baseMipLevel(pLevel) {
    // Do nothing on assigning old an value.
    if (this.mBaseMipLevel === pLevel) {
      return;
    }
    this.mBaseMipLevel = pLevel;
    // Trigger update.
    this.triggerChange();
  }
  /**
   * The dimension to view the texture as.
   */
  get dimension() {
    return this.mDimension;
  }
  set dimension(pDimension) {
    // Do nothing on assigning old an value.
    if (this.mDimension === pDimension) {
      return;
    }
    this.mDimension = pDimension;
    // Trigger update.
    this.triggerChange();
  }
  /**
   * How many array layers, starting with {@link TextureView#baseLayer}, are accessible
   * to the texture view.
   */
  get layerCount() {
    return this.mBaseLayer;
  }
  /**
   * How many mipmap levels, starting with {@link TextureView#baseMipLevel}, are accessible to
   * the texture view.
   */
  get mipLevelCount() {
    return this.mMipLevelCount;
  }
  set mipLevelCount(pLevel) {
    // Do nothing on assigning old an value.
    if (this.mMipLevelCount === pLevel) {
      return;
    }
    this.mMipLevelCount = pLevel;
    // Trigger update.
    this.triggerChange();
  }
  /**
   * Generate new texture view.
   */
  generate() {
    var lTexture = this.mTexture.native();
    return lTexture.createView({
      label: this.label,
      format: this.mTexture.format,
      dimension: this.mDimension,
      aspect: this.mAspect,
      baseMipLevel: this.mBaseMipLevel,
      mipLevelCount: this.mMipLevelCount,
      baseArrayLayer: this.mBaseLayer,
      arrayLayerCount: this.mLayerCount
    });
  }
}
exports.TextureView = TextureView;

/***/ }),

/***/ "./source/core/resource/texture/texture.ts":
/*!*************************************************!*\
  !*** ./source/core/resource/texture/texture.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Texture = void 0;
var texture_usage_enum_1 = __webpack_require__(/*! ./texture-usage.enum */ "./source/core/resource/texture/texture-usage.enum.ts");
var gpu_native_object_1 = __webpack_require__(/*! ../../gpu-native-object */ "./source/core/gpu-native-object.ts");
var texture_view_1 = __webpack_require__(/*! ./texture-view */ "./source/core/resource/texture/texture-view.ts");
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
class Texture extends gpu_native_object_1.GpuNativeObject {
  /**
   * Constructor.
   * @param pGpu - Gpu.
   * @param pFormat - Texture format.
   * @param pDimension - Texture dimension.
   */
  constructor(pGpu, pFormat, pUsage) {
    var pDimension = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '2d';
    var pMultiSampleLevel = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;
    var pLayerCount = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1;
    super(pGpu, 'TEXTURE');
    this.mFormat = pFormat;
    this.mUsage = pUsage;
    this.mImageBitmapList = new Array();
    this.mDimension = pDimension;
    this.mLayerCount = pLayerCount;
    // Set and validate multisample level.
    this.mMultiSampleLevel = pMultiSampleLevel;
    if (pMultiSampleLevel < 1) {
      throw new core_data_1.Exception('Multi sample level must be greater than zero.', this);
    }
    // Set defaults.
    this.mHeight = 1;
    this.mWidth = 1;
    this.mLayerCount = 1;
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
    // Trigger change.
    this.triggerChange();
  }
  /**
   * Texture depth.
   */
  get layer() {
    return this.mLayerCount;
  }
  /**
   * Texture multi sample level.
   */
  get multiSampleLevel() {
    return this.mMultiSampleLevel;
  }
  /**
   * Texture usage.
   */
  get usage() {
    return this.mUsage;
  }
  /**
   * Texture width.
   */
  get width() {
    return this.mWidth;
  }
  set width(pWidth) {
    this.mWidth = pWidth;
    // Trigger change.
    this.triggerChange();
  }
  /**
   * Load images into texture.
   * Each image get loaded into seperate depth layer.
   * @param pSourceList - Image source list.
   */
  load(pSourceList) {
    var _this = this;
    return _asyncToGenerator(function* () {
      var lHeight = 0;
      var lWidth = 0;
      // Parallel load images.
      var lBitmapResolvePromiseList = pSourceList.map( /*#__PURE__*/function () {
        var _ref = _asyncToGenerator(function* (pSource) {
          // Load image with html image element.
          var lImage = new Image();
          lImage.src = pSource;
          yield lImage.decode();
          // Init size.
          if (lHeight === 0 || lWidth === 0) {
            lWidth = lImage.naturalWidth;
            lHeight = lImage.naturalHeight;
          }
          // Validate same image size for all layers.
          if (lHeight !== lImage.naturalHeight || lWidth !== lImage.naturalWidth) {
            throw new core_data_1.Exception("Texture image layers are not the same size. (".concat(lImage.naturalWidth, ", ").concat(lImage.naturalHeight, ") needs (").concat(lWidth, ", ").concat(lHeight, ")."), _this);
          }
          // Resolve image into bitmap.
          return createImageBitmap(lImage);
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }());
      // Resolve all bitmaps.
      _this.mImageBitmapList = yield Promise.all(lBitmapResolvePromiseList);
      // Set new size.
      _this.width = lWidth;
      _this.height = lHeight;
      // Trigger change.
      _this.triggerChange();
    })();
  }
  /**
   * Create view of this texture.
   */
  view(pBaseLayer, pLayerCount) {
    var lView = new texture_view_1.TextureView(this.gpu, this, pBaseLayer, pLayerCount);
    lView.label = this.label;
    return lView;
  }
  /**
   * Destroy native object.
   * @param pNativeObject - Native object.
   */
  destroyNative(pNativeObject) {
    pNativeObject.destroy();
  }
  /**
   * Generate texture based on parameters.
   */
  generate() {
    // Extend usage by CopyDestination when a bitmap should be copied into the texture.
    var lUsage = this.mUsage;
    if (this.mImageBitmapList.length > 0) {
      lUsage |= texture_usage_enum_1.TextureUsage.CopyDestination;
    }
    // Create texture with set size, format and usage.
    var lTexture = this.gpu.device.createTexture({
      label: this.label,
      size: [this.mWidth, this.mHeight, this.mLayerCount],
      format: this.mFormat,
      usage: lUsage,
      dimension: this.mDimension,
      sampleCount: this.mMultiSampleLevel
    });
    // Copy bitmap into texture.
    if (this.mImageBitmapList.length > 0) {
      // Loop image bitmaps for each layer.
      for (var lBitmapIndex = 0; lBitmapIndex < this.mImageBitmapList.length; lBitmapIndex++) {
        var lBitmap = this.mImageBitmapList[lBitmapIndex];
        // Copy image into depth layer.
        this.gpu.device.queue.copyExternalImageToTexture({
          source: lBitmap
        }, {
          texture: lTexture,
          origin: [0, 0, lBitmapIndex]
        }, [lBitmap.width, lBitmap.height]);
        // Release image data.
        lBitmap.close();
      }
    }
    // Clear closed bitmap list.
    this.mImageBitmapList = new Array();
    return lTexture;
  }
}
exports.Texture = Texture;

/***/ }),

/***/ "./source/core/shader/enum/wgsl-access-mode.enum.ts":
/*!**********************************************************!*\
  !*** ./source/core/shader/enum/wgsl-access-mode.enum.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WgslAccessMode = void 0;
var WgslAccessMode;
(function (WgslAccessMode) {
  WgslAccessMode["None"] = "_None";
  WgslAccessMode["AccessModeRead"] = "read";
  WgslAccessMode["AccessModeWrite"] = "write";
  WgslAccessMode["AccessModeReadWrite"] = "read_write";
})(WgslAccessMode = exports.WgslAccessMode || (exports.WgslAccessMode = {}));

/***/ }),

/***/ "./source/core/shader/enum/wgsl-binding-type.enum.ts":
/*!***********************************************************!*\
  !*** ./source/core/shader/enum/wgsl-binding-type.enum.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WgslBindingType = void 0;
var WgslBindingType;
(function (WgslBindingType) {
  WgslBindingType["None"] = "_None";
  WgslBindingType["Uniform"] = "uniform";
  WgslBindingType["Storage"] = "storage";
  WgslBindingType["ReadonlyStorage"] = "read-only-storage";
})(WgslBindingType = exports.WgslBindingType || (exports.WgslBindingType = {}));

/***/ }),

/***/ "./source/core/shader/enum/wgsl-shader-stage.enum.ts":
/*!***********************************************************!*\
  !*** ./source/core/shader/enum/wgsl-shader-stage.enum.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WgslShaderStage = void 0;
var WgslShaderStage;
(function (WgslShaderStage) {
  WgslShaderStage[WgslShaderStage["Fragment"] = GPUShaderStage.FRAGMENT] = "Fragment";
  WgslShaderStage[WgslShaderStage["Vertex"] = GPUShaderStage.VERTEX] = "Vertex";
  WgslShaderStage[WgslShaderStage["Compute"] = GPUShaderStage.COMPUTE] = "Compute";
})(WgslShaderStage = exports.WgslShaderStage || (exports.WgslShaderStage = {}));

/***/ }),

/***/ "./source/core/shader/enum/wgsl-type.enum.ts":
/*!***************************************************!*\
  !*** ./source/core/shader/enum/wgsl-type.enum.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.WgslType = void 0;
var WgslType;
(function (WgslType) {
  WgslType["Any"] = "_Any";
  WgslType["Enum"] = "_Enum";
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
  WgslType["Struct"] = "struct";
  WgslType["Atomic"] = "atomic";
  //Special.
  WgslType["Array"] = "array";
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
})(WgslType = exports.WgslType || (exports.WgslType = {}));

/***/ }),

/***/ "./source/core/shader/shader-analyzer.ts":
/*!***********************************************!*\
  !*** ./source/core/shader/shader-analyzer.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _wrapRegExp() { _wrapRegExp = function _wrapRegExp(re, groups) { return new BabelRegExp(re, void 0, groups); }; var _super = RegExp.prototype, _groups = new WeakMap(); function BabelRegExp(re, flags, groups) { var _this = new RegExp(re, flags); return _groups.set(_this, groups || _groups.get(re)), _setPrototypeOf(_this, BabelRegExp.prototype); } function buildGroups(result, re) { var g = _groups.get(re); return Object.keys(g).reduce(function (groups, name) { var i = g[name]; if ("number" == typeof i) groups[name] = result[i];else { for (var k = 0; void 0 === result[i[k]] && k + 1 < i.length;) k++; groups[name] = result[i[k]]; } return groups; }, Object.create(null)); } return _inherits(BabelRegExp, RegExp), BabelRegExp.prototype.exec = function (str) { var result = _super.exec.call(this, str); if (result) { result.groups = buildGroups(result, this); var indices = result.indices; indices && (indices.groups = buildGroups(indices, this)); } return result; }, BabelRegExp.prototype[Symbol.replace] = function (str, substitution) { if ("string" == typeof substitution) { var groups = _groups.get(this); return _super[Symbol.replace].call(this, str, substitution.replace(/\$<([^>]+)>/g, function (_, name) { var group = groups[name]; return "$" + (Array.isArray(group) ? group.join("$") : group); })); } if ("function" == typeof substitution) { var _this = this; return _super[Symbol.replace].call(this, str, function () { var args = arguments; return "object" != typeof args[args.length - 1] && (args = [].slice.call(args)).push(buildGroups(args, _this)), substitution.apply(this, args); }); } return _super[Symbol.replace].call(this, str, substitution); }, _wrapRegExp.apply(this, arguments); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShaderInformation = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var array_buffer_type_1 = __webpack_require__(/*! ../buffer_type/array-buffer-type */ "./source/core/buffer_type/array-buffer-type.ts");
var simple_buffer_type_1 = __webpack_require__(/*! ../buffer_type/simple-buffer-type */ "./source/core/buffer_type/simple-buffer-type.ts");
var struct_buffer_type_1 = __webpack_require__(/*! ../buffer_type/struct-buffer-type */ "./source/core/buffer_type/struct-buffer-type.ts");
var wgsl_access_mode_enum_1 = __webpack_require__(/*! ./enum/wgsl-access-mode.enum */ "./source/core/shader/enum/wgsl-access-mode.enum.ts");
var wgsl_binding_type_enum_1 = __webpack_require__(/*! ./enum/wgsl-binding-type.enum */ "./source/core/shader/enum/wgsl-binding-type.enum.ts");
var wgsl_shader_stage_enum_1 = __webpack_require__(/*! ./enum/wgsl-shader-stage.enum */ "./source/core/shader/enum/wgsl-shader-stage.enum.ts");
var wgsl_type_enum_1 = __webpack_require__(/*! ./enum/wgsl-type.enum */ "./source/core/shader/enum/wgsl-type.enum.ts");
class ShaderInformation {
  /**
   * Constructor.
   * @param pSource - WGSL Source code.
   */
  constructor(pSource) {
    this.mSource = pSource;
    this.mEntryPoints = this.fetchEntryPoints();
    this.mBindings = this.fetchBindGroups();
  }
  /**
   * Binding information.
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
   * Create buffer type from variable definition.
   * @param pVariable - Variable definition.
   */
  createBufferType(pVariable) {
    var _pVariable$attributes, _pVariable$attributes2;
    // String to type. Undefined must be an struct type.
    var lType = this.wgslTypeByName(pVariable.type);
    if (lType === wgsl_type_enum_1.WgslType.Enum) {
      throw new core_data_1.Exception('Enum cant be fetched as variable type.', this);
    }
    // Try to parse access and bind setings. Set with defaults.
    var lBindingType = wgsl_binding_type_enum_1.WgslBindingType.None;
    var lAccessMode = wgsl_access_mode_enum_1.WgslAccessMode.None;
    if (pVariable.access) {
      lBindingType = core_data_1.EnumUtil.enumKeyByValue(wgsl_binding_type_enum_1.WgslBindingType, pVariable.access.bindingType);
      if (!lBindingType) {
        throw new core_data_1.Exception("Bind type \"".concat(pVariable.access.bindingType, "\" does not exist."), this);
      }
      lAccessMode = core_data_1.EnumUtil.enumKeyByValue(wgsl_access_mode_enum_1.WgslAccessMode, pVariable.access.accessMode);
      if (!lAccessMode) {
        throw new core_data_1.Exception("Access mode \"".concat(pVariable.access.accessMode, "\" does not exist."), this);
      }
    }
    // Try to get location from attributes.
    var lLocationIndex = null;
    var lLocationValue = (_pVariable$attributes = (_pVariable$attributes2 = pVariable.attributes.find(pAttribute => pAttribute.startsWith('@location'))) === null || _pVariable$attributes2 === void 0 ? void 0 : _pVariable$attributes2.replace(/[^\\d]+/g, '')) !== null && _pVariable$attributes !== void 0 ? _pVariable$attributes : '';
    if (isNaN(lLocationValue)) {
      lLocationIndex = parseInt(lLocationValue);
    }
    switch (lType) {
      case wgsl_type_enum_1.WgslType.Struct:
        {
          var lStructType = new struct_buffer_type_1.StructBufferType(pVariable.name, lAccessMode, lBindingType, lLocationIndex);
          // Get struct body and fetch types.
          var lStructBody = this.getStructBody(pVariable.type);
          this.fetchVariableDefinitions(lStructBody).forEach((pPropertyVariable, pIndex) => {
            var lProperyBufferType = this.createBufferType(pPropertyVariable);
            // Add property to struct buffer type.
            lStructType.addProperty(pPropertyVariable.name, pIndex, lProperyBufferType);
          });
          return lStructType;
        }
      case wgsl_type_enum_1.WgslType.Array:
        {
          // Validate generic range.
          if (pVariable.generics.length !== 1 && pVariable.generics.length !== 2) {
            throw new core_data_1.Exception('Array type must have one or two generic types.', this);
          }
          // Fetch first generic by extending generic type to a variable definition and parse recursive.
          var lTypeGeneric = this.fetchVariableDefinitions("PLACEHOLDER: ".concat(pVariable.generics.at(0), ";")).at(0);
          var lTypeGenericBufferType = this.createBufferType(lTypeGeneric);
          // Fetch optional size gerneric.
          var lSizeGeneric = -1;
          if (pVariable.generics.at(1)) {
            if (!isNaN(pVariable.generics.at(1))) {
              throw new core_data_1.Exception('Array size parameter needs to be a number.', this);
            }
            lSizeGeneric = parseInt(pVariable.generics.at(1));
          }
          // Create array buffer type.
          return new array_buffer_type_1.ArrayBufferType(pVariable.name, lTypeGenericBufferType, lSizeGeneric, lAccessMode, lBindingType, lLocationIndex);
        }
      default:
        {
          // Map generics to struct like body. Fetch variable definitions and save only type.
          var lPseudoStructBody = pVariable.generics.reduce((pCurrent, pGeneric) => {
            return pCurrent + "PLACEHOLDER: ".concat(pGeneric, ";");
          }, '');
          var lPseudoVariableList = this.fetchVariableDefinitions(lPseudoStructBody);
          var lGenericList = lPseudoVariableList.map(pVariable => {
            return this.wgslTypeByName(pVariable.type);
          });
          return new simple_buffer_type_1.SimpleBufferType(pVariable.name, lType, lGenericList, lAccessMode, lBindingType, lLocationIndex);
        }
    }
  }
  /**
   * Fetch all bind groups of source.
   */
  fetchBindGroups() {
    // Get only lines with group attributes.
    var lAllGroupLines = [...this.mSource.matchAll(/^.*@group.*$/gm)].reduce((pCurrent, pLine) => {
      return pCurrent + pLine;
    }, '');
    // Available shader states based on entry points.
    // Not the best, but better than nothing.
    var lShaderStage = 0;
    if (/(@compute(.|\r?\n)*?fn )(\w*)/gm.test(this.mSource)) {
      lShaderStage |= wgsl_shader_stage_enum_1.WgslShaderStage.Compute;
    }
    if (/(@fragment(.|\r?\n)*?fn )(\w*)/gm.test(this.mSource)) {
      lShaderStage |= wgsl_shader_stage_enum_1.WgslShaderStage.Fragment;
    }
    if (/(@vertex(.|\r?\n)*?fn )(\w*)/gm.test(this.mSource)) {
      lShaderStage |= wgsl_shader_stage_enum_1.WgslShaderStage.Vertex;
    }
    // Fetch all group variables.
    var lBindGroups = new core_data_1.Dictionary();
    for (var lVariable of this.fetchVariableDefinitions(lAllGroupLines)) {
      var lGroupAttribute = lVariable.attributes.find(pAttribute => pAttribute.startsWith('@group'));
      var lBindAttribute = lVariable.attributes.find(pAttribute => pAttribute.startsWith('@binding'));
      if (!lGroupAttribute || !lBindAttribute) {
        throw new core_data_1.Exception('Bindind variable needs an binding and group attribute.', this);
      }
      var lGroupIndex = parseInt(lGroupAttribute.replace(/[^\\d]+/g, ''));
      var lBindIndex = parseInt(lBindAttribute.replace(/[^\\d]+/g, ''));
      // Init group.
      if (!lBindGroups.has(lGroupIndex)) {
        lBindGroups.set(lGroupIndex, new Array());
      }
      // Append bind.
      lBindGroups.get(lGroupIndex).push({
        visibility: lShaderStage,
        variable: this.createBufferType(lVariable),
        index: lBindIndex
      });
    }
    // Add BindGroupInformation to bind group.
    var lBindGroupList = new Array();
    for (var [_lGroupIndex, lBindList] of lBindGroups) {
      lBindGroupList.push({
        group: _lGroupIndex,
        binds: lBindList
      });
    }
    return lBindGroupList;
  }
  /**
   * Fetch entry points.
   */
  fetchEntryPoints() {
    // Get all functions.
    var lFunctionList = this.fetchFunctions(this.mSource);
    var lEntryPoints = new core_data_1.Dictionary();
    for (var lFunction of lFunctionList) {
      // Assemble shaderstage.
      if (lFunction.attributes.find(pAttribute => pAttribute.startsWith('@compute'))) {
        lEntryPoints.set(wgsl_shader_stage_enum_1.WgslShaderStage.Compute, lFunction);
      }
      if (lFunction.attributes.find(pAttribute => pAttribute.startsWith('@fragment'))) {
        lEntryPoints.set(wgsl_shader_stage_enum_1.WgslShaderStage.Fragment, lFunction);
      }
      if (lFunction.attributes.find(pAttribute => pAttribute.startsWith('@vertex'))) {
        lEntryPoints.set(wgsl_shader_stage_enum_1.WgslShaderStage.Vertex, lFunction);
      }
    }
    return lEntryPoints;
  }
  /**
   * Fetch all function declarations of source snipped.
   * @param pSourceSnipped - Source snipped with function declarations.
   */
  fetchFunctions(pSourceSnipped) {
    var lFunctionRegex = /*#__PURE__*/_wrapRegExp(/((?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:\s)*?fn\s+(\w*)\s*\(((?:.|\r?\n)*?)\)(?:\s*\x2D>\s*([^{]+))?\s*\{/gm, {
      attributes: 1,
      name: 2,
      parameter: 3,
      result: 4
    });
    var lFunctionList = new Array();
    for (var lFunctionMatch of pSourceSnipped.matchAll(lFunctionRegex)) {
      // Fetch attributes.
      var lAttributeList = new Array();
      if (lFunctionMatch.groups['attributes']) {
        // Split string of multiple attributes.
        for (var lAttributeMatch of lFunctionMatch.groups['attributes'].matchAll(/@[\w]+\([^)]*\)/g)) {
          lAttributeList.push(lAttributeMatch[0]);
        }
      }
      // Fetch Parameter.
      var lParameterVariableList = this.fetchVariableDefinitions(lFunctionMatch.groups['parameter']);
      var lParameterList = lParameterVariableList.map(pVariable => {
        return this.createBufferType(pVariable);
      });
      // Fetch result type.
      var lResult = null;
      if (lFunctionMatch.groups['result']) {
        var lResultVariable = this.fetchVariableDefinitions(lFunctionMatch.groups['result']).at(0);
        lResult = this.createBufferType(lResultVariable);
      }
      lFunctionList.push({
        name: lFunctionMatch.groups['name'],
        return: lResult,
        parameter: lParameterList,
        attributes: lAttributeList
      });
    }
    return lFunctionList;
  }
  /**
   * Find all variable definitions and fetch data.
   * @param pSourceSnipped - Source snipped with variables.
   */
  fetchVariableDefinitions(pSourceSnipped) {
    var lDefinitionRegex = /*#__PURE__*/_wrapRegExp(/((?:@[\w]+(?:\([^)]*\))?\s+)+)?(?:var(?:<([\w\s,]+)?>)?\s+)?(?:(\w+)\s*:\s*)?((\w+)(?:<([<>\w\s,]+)>)?)/gm, {
      attributes: 1,
      access: 2,
      variable: 3,
      type: 4,
      typename: 5,
      generics: 6
    });
    var lVariableList = new Array();
    for (var lDefinitionMatch of pSourceSnipped.matchAll(lDefinitionRegex)) {
      var _lDefinitionMatch$gro;
      // Fetch attributes.
      var lAttributes = new Array();
      if (lDefinitionMatch.groups['attributes']) {
        // Split string of multiple attributes.
        for (var lAttributeMatch of lDefinitionMatch.groups['attributes'].matchAll(/@[\w]+\([^)]*\)/g)) {
          lAttributes.push(lAttributeMatch[0]);
        }
      }
      // Parse optional acccess modifier.
      var lAccess = null;
      if (lDefinitionMatch.groups['access']) {
        var _lAccessList$;
        // var<addressSpace [,accessMode]>
        var lAccessList = lDefinitionMatch.groups['access'].split(',').map(pValue => pValue.trim()).filter(pValue => pValue.length);
        lAccess = {
          bindingType: lAccessList[0],
          accessMode: (_lAccessList$ = lAccessList[1]) !== null && _lAccessList$ !== void 0 ? _lAccessList$ : ''
        };
      }
      // Split generic types.
      var lGenericList = new Array();
      if (lDefinitionMatch.groups['generics']) {
        for (var lGenericMatch of lDefinitionMatch.groups['generics'].matchAll( /*#__PURE__*/_wrapRegExp(/((?:\w+(?:<.+>)?))[,\s]*/g, {
          generictype: 1
        }))) {
          lGenericList.push(lGenericMatch.groups['generictype']);
        }
      }
      lVariableList.push({
        name: (_lDefinitionMatch$gro = lDefinitionMatch.groups['variable']) !== null && _lDefinitionMatch$gro !== void 0 ? _lDefinitionMatch$gro : '',
        type: lDefinitionMatch.groups['typename'],
        generics: lGenericList,
        attributes: lAttributes,
        access: lAccess
      });
    }
    return lVariableList;
  }
  /**
   * Get struct information of struct name.
   * @param pSource - Source.
   * @param pStructName - Struct name.
   */
  getStructBody(pStructName) {
    var lStuctRegex = /*#__PURE__*/_wrapRegExp(/^\s*struct\s+(\w+)\s*\{([^}]*)\}$/mg, {
      name: 1,
      typeinfo: 2
    });
    var lStructBody = null;
    // Find struct name and body.
    for (var lStructMatch of this.mSource.matchAll(lStuctRegex)) {
      if (lStructMatch.groups['name'] === pStructName) {
        lStructBody = lStructMatch.groups['typeinfo'];
        break;
      }
    }
    // Validate found struct body.
    if (!lStructBody) {
      throw new core_data_1.Exception("Struct \"".concat(pStructName, "\" not found."), this);
    }
    return lStructBody;
  }
  /**
   * Get wgsl type by name without generics.
   * @param pName - Type name.
   */
  wgslTypeByName(pName) {
    var lType = core_data_1.EnumUtil.enumKeyByValue(wgsl_type_enum_1.WgslType, pName);
    if (!lType) {
      try {
        // Try to find struct. Throws error on missing struct declaration.
        this.getStructBody(pName);
        lType = wgsl_type_enum_1.WgslType.Struct;
      } catch (_ex) {
        // On error (when struct not found). It can only be an enum.
        lType = wgsl_type_enum_1.WgslType.Enum;
      }
    }
    return lType;
  }
}
exports.ShaderInformation = ShaderInformation;

/***/ }),

/***/ "./source/core/shader/shader.ts":
/*!**************************************!*\
  !*** ./source/core/shader/shader.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Shader = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var bind_groups_1 = __webpack_require__(/*! ../bind_group/bind-groups */ "./source/core/bind_group/bind-groups.ts");
var simple_buffer_type_1 = __webpack_require__(/*! ../buffer_type/simple-buffer-type */ "./source/core/buffer_type/simple-buffer-type.ts");
var struct_buffer_type_1 = __webpack_require__(/*! ../buffer_type/struct-buffer-type */ "./source/core/buffer_type/struct-buffer-type.ts");
var bind_type_enum_1 = __webpack_require__(/*! ../enum/bind-type.enum */ "./source/core/enum/bind-type.enum.ts");
var gpu_native_object_1 = __webpack_require__(/*! ../gpu-native-object */ "./source/core/gpu-native-object.ts");
var vertex_attribute_1 = __webpack_require__(/*! ../pipeline/data/vertex-attribute */ "./source/core/pipeline/data/vertex-attribute.ts");
var wgsl_shader_stage_enum_1 = __webpack_require__(/*! ./enum/wgsl-shader-stage.enum */ "./source/core/shader/enum/wgsl-shader-stage.enum.ts");
var wgsl_type_enum_1 = __webpack_require__(/*! ./enum/wgsl-type.enum */ "./source/core/shader/enum/wgsl-type.enum.ts");
var shader_analyzer_1 = __webpack_require__(/*! ./shader-analyzer */ "./source/core/shader/shader-analyzer.ts");
class Shader extends gpu_native_object_1.GpuNativeObject {
  /**
   * Constructor.
   * @param pGpu - GPU.
   * @param pSource - Shader module source code.
   */
  constructor(pGpu, pSource) {
    super(pGpu, 'SHADER');
    this.mSource = pSource;
    this.mShaderInformation = new shader_analyzer_1.ShaderInformation(pSource);
    // Generate from ShaderInformation. 
    this.mBindGroups = this.generateBindGroups(this.mShaderInformation);
    this.mEntryPoints = {
      vertex: this.generateVertexEntryPoint(this.mShaderInformation),
      fragment: this.generateFragmentEntryPoint(this.mShaderInformation),
      compute: this.generateComputeEntryPoint(this.mShaderInformation)
    };
  }
  /**
   * Get bind groups of shader.
   */
  get bindGroups() {
    return this.mBindGroups;
  }
  /**
   * Compute entry point name.
   */
  get computeEntryPoint() {
    return this.mEntryPoints.compute;
  }
  /**
   * Fragment entry point name.
   */
  get fragmentEntryPoint() {
    return this.mEntryPoints.fragment;
  }
  /**
   * Vertex entry point name.
   */
  get vertexEntryPoint() {
    return this.mEntryPoints.vertex;
  }
  /***
   * Generate shader module.
   */
  generate() {
    return this.gpu.device.createShaderModule({
      code: this.mSource
    });
  }
  /**
   * Generate bind groups based on shader information.
   * @param pShaderInformation - Shader information.
   */
  generateBindGroups(pShaderInformation) {
    var lBindGroups = new bind_groups_1.BindGroups(this.gpu);
    // Create new bing groups.
    for (var lBindGroupInformation of pShaderInformation.bindings) {
      var lBindGroup = lBindGroups.addGroup(lBindGroupInformation.group);
      // Create each binding of group.
      for (var lWgslBind of lBindGroupInformation.binds) {
        var lShaderBind = this.getBindBasedOnType(lWgslBind);
        switch (lShaderBind.bindType) {
          case bind_type_enum_1.BindType.Texture:
            {
              lBindGroup.addTexture(lShaderBind.name, lShaderBind.index, lShaderBind.visibility, lShaderBind.sampleType, lShaderBind.viewDimension, lShaderBind.multisampled);
              break;
            }
          case bind_type_enum_1.BindType.Buffer:
            {
              lBindGroup.addBuffer(lShaderBind.name, lShaderBind.index, lShaderBind.visibility, lShaderBind.type, lShaderBind.hasDynamicOffset, lShaderBind.minBindingSize);
              break;
            }
          case bind_type_enum_1.BindType.Sampler:
            {
              lBindGroup.addSampler(lShaderBind.name, lShaderBind.index, lShaderBind.visibility, lShaderBind.type);
              break;
            }
          case bind_type_enum_1.BindType.StorageTexture:
            {
              lBindGroup.addStorageTexture(lShaderBind.name, lShaderBind.index, lShaderBind.visibility, lShaderBind.format, lShaderBind.access, lShaderBind.viewDimension);
              break;
            }
          case bind_type_enum_1.BindType.ExternalTexture:
            {
              lBindGroup.addExternalTexture(lShaderBind.name, lShaderBind.index, lShaderBind.visibility);
              break;
            }
        }
      }
    }
    return lBindGroups;
  }
  /**
   * Generate compute entry point.
   * @param pShaderInformation - Shader information.
   */
  generateComputeEntryPoint(pShaderInformation) {
    // Find entry point information.
    var lShaderEntryPointFunction = pShaderInformation.entryPoints.get(wgsl_shader_stage_enum_1.WgslShaderStage.Compute);
    if (!lShaderEntryPointFunction) {
      return undefined;
    }
    var lShaderEntryPoint = {
      name: lShaderEntryPointFunction.name
    };
    return lShaderEntryPoint;
  }
  /**
   * Generate compute entry point.
   * @param pShaderInformation - Shader information.
   */
  generateFragmentEntryPoint(pShaderInformation) {
    // Find entry point information.
    var lShaderEntryPointFunction = pShaderInformation.entryPoints.get(wgsl_shader_stage_enum_1.WgslShaderStage.Fragment);
    if (!lShaderEntryPointFunction) {
      return undefined;
    }
    // Get count of all result types with location attribute.
    var lResultLength = 1;
    if (lShaderEntryPointFunction.return instanceof struct_buffer_type_1.StructBufferType) {
      lResultLength = lShaderEntryPointFunction.return.innerLocations().length;
    }
    var lShaderEntryPoint = {
      name: lShaderEntryPointFunction.name,
      renderTargetCount: lResultLength
    };
    return lShaderEntryPoint;
  }
  /**
   * Generate vertex entry point.
   * @param pShaderInformation - Shader information.
   */
  generateVertexEntryPoint(pShaderInformation) {
    // Find entry point information.
    var lShaderEntryPointFunction = pShaderInformation.entryPoints.get(wgsl_shader_stage_enum_1.WgslShaderStage.Fragment);
    if (!lShaderEntryPointFunction) {
      return undefined;
    }
    var lShaderEntryPoint = {
      name: lShaderEntryPointFunction.name,
      attributes: new Array()
    };
    // Get all parameter locations of entry point.
    var lParameterLocationTypes = new Array();
    for (var lParameter of lShaderEntryPointFunction.parameter) {
      if (lParameter instanceof struct_buffer_type_1.StructBufferType) {
        for (var lType of lParameter.innerLocations()) {
          lParameterLocationTypes.push(lType);
        }
      } else if (lParameter !== null && lParameter !== void 0 && lParameter.location) {
        lParameterLocationTypes.push(lParameter);
      }
    }
    // Generate new vertex attribute for each location.
    for (var _lParameter of lParameterLocationTypes) {
      if (!(_lParameter instanceof simple_buffer_type_1.SimpleBufferType)) {
        throw new core_data_1.Exception('Vertex attributes can only be of a simple type.', this);
      }
      // Add generated attribute to shader entry point.
      lShaderEntryPoint.attributes.push(new vertex_attribute_1.VertexAttribute(this.gpu, _lParameter));
    }
    return lShaderEntryPoint;
  }
  /**
   * Get bind based on binding information.
   * @param pBindGroup - Bind group.
   * @param pBindInformation - Bind information.
   */
  getBindBasedOnType(pBind) {
    var lNumberTypeList = [wgsl_type_enum_1.WgslType.Boolean, wgsl_type_enum_1.WgslType.Integer32, wgsl_type_enum_1.WgslType.UnsignedInteger32, wgsl_type_enum_1.WgslType.Float32, wgsl_type_enum_1.WgslType.Float16];
    var lVectorTypeList = [wgsl_type_enum_1.WgslType.Vector2, wgsl_type_enum_1.WgslType.Vector3, wgsl_type_enum_1.WgslType.Vector4];
    var lMatrixTypeList = [wgsl_type_enum_1.WgslType.Matrix22, wgsl_type_enum_1.WgslType.Matrix23, wgsl_type_enum_1.WgslType.Matrix24, wgsl_type_enum_1.WgslType.Matrix32, wgsl_type_enum_1.WgslType.Matrix33, wgsl_type_enum_1.WgslType.Matrix34, wgsl_type_enum_1.WgslType.Matrix42, wgsl_type_enum_1.WgslType.Matrix43, wgsl_type_enum_1.WgslType.Matrix44];
    var lTextureStorageTypeList = [wgsl_type_enum_1.WgslType.TextureStorage1d, wgsl_type_enum_1.WgslType.TextureStorage2d, wgsl_type_enum_1.WgslType.TextureStorage2dArray, wgsl_type_enum_1.WgslType.TextureStorage3d];
    var lTextureTypeList = [wgsl_type_enum_1.WgslType.Texture1d, wgsl_type_enum_1.WgslType.Texture2d, wgsl_type_enum_1.WgslType.Texture2dArray, wgsl_type_enum_1.WgslType.Texture3d, wgsl_type_enum_1.WgslType.TextureCube, wgsl_type_enum_1.WgslType.TextureCubeArray, wgsl_type_enum_1.WgslType.TextureMultisampled2d, wgsl_type_enum_1.WgslType.TextureExternal];
    var lDepthTextureTypeList = [wgsl_type_enum_1.WgslType.TextureDepth2d, wgsl_type_enum_1.WgslType.TextureDepth2dArray, wgsl_type_enum_1.WgslType.TextureDepthCube, wgsl_type_enum_1.WgslType.TextureDepthCubeArray, wgsl_type_enum_1.WgslType.TextureDepthMultisampled2d];
    // Buffer types.
    // Number, matrix, vector and array types.
    if ([...lNumberTypeList, ...lVectorTypeList, ...lMatrixTypeList, wgsl_type_enum_1.WgslType.Array, wgsl_type_enum_1.WgslType.Struct].includes(pBind.variable.type)) {
      // Validate address space.
      if (!pBind.variable.bindingType) {
        throw new core_data_1.Exception("Buffer bind type needs to be set for buffer bindings (".concat(pBind.variable.name, ")."), this);
      }
      // Bind 
      return {
        bindType: bind_type_enum_1.BindType.Buffer,
        index: pBind.index,
        name: pBind.variable.name,
        visibility: pBind.visibility,
        type: pBind.variable.bindingType,
        hasDynamicOffset: false,
        minBindingSize: 0
      };
    }
    // Bind only external textures.
    if (pBind.variable.type === wgsl_type_enum_1.WgslType.TextureExternal) {
      return {
        bindType: bind_type_enum_1.BindType.ExternalTexture,
        index: pBind.index,
        name: pBind.variable.name,
        visibility: pBind.visibility
      };
    }
    // Sampler types.
    else if ([wgsl_type_enum_1.WgslType.Sampler, wgsl_type_enum_1.WgslType.SamplerComparison].includes(pBind.variable.type)) {
      // Sampler bind type by sampler or comparison type.
      var lFilterType = pBind.variable.type === wgsl_type_enum_1.WgslType.Sampler ? 'filtering' : 'comparison';
      // Exit.
      return {
        bindType: bind_type_enum_1.BindType.Sampler,
        index: pBind.index,
        name: pBind.variable.name,
        visibility: pBind.visibility,
        type: lFilterType
      };
    }
    // First generic texture is a wgsl type on color textures or nothing on depth textures.
    if (!(pBind.variable instanceof simple_buffer_type_1.SimpleBufferType)) {
      throw new core_data_1.Exception('Texture buffers can only be of simple buffer type', this);
    }
    // Storage texture.
    if (lTextureStorageTypeList.includes(pBind.variable.type)) {
      if (pBind.variable.generics.at(0) !== wgsl_type_enum_1.WgslType.Enum) {
        throw new core_data_1.Exception('Storage texture needs texel enum as first generic.', this);
      }
      // Storage texture first generics is allways the texel format.
      var lTexelFormat = pBind.variable.genericsRaw.at(0);
      var lTextureAccess = 'write-only';
      var lTextureDimension = this.texureDimensionFromType(pBind.variable.type);
      // Bind.
      return {
        bindType: bind_type_enum_1.BindType.StorageTexture,
        index: pBind.index,
        name: pBind.variable.name,
        visibility: pBind.visibility,
        access: lTextureAccess,
        format: lTexelFormat,
        viewDimension: lTextureDimension
      };
    }
    // Depth or color texture.
    if ([...lTextureTypeList, ...lDepthTextureTypeList].includes(pBind.variable.type)) {
      var _lTextureDimension = this.texureDimensionFromType(pBind.variable.type);
      var lMultisampled = [wgsl_type_enum_1.WgslType.TextureMultisampled2d, wgsl_type_enum_1.WgslType.TextureDepthMultisampled2d].includes(pBind.variable.type);
      var lTextureWgslType = pBind.variable.generics.at(0);
      var lTextureSampleType;
      // Color textures. Based on generic type.
      if (lTextureTypeList.includes(pBind.variable.type)) {
        switch (lTextureWgslType) {
          case wgsl_type_enum_1.WgslType.Float32:
            {
              lTextureSampleType = 'float';
              break;
            }
          case wgsl_type_enum_1.WgslType.Integer32:
            {
              lTextureSampleType = 'sint';
              break;
            }
          case wgsl_type_enum_1.WgslType.UnsignedInteger32:
            {
              lTextureSampleType = 'uint';
              break;
            }
          default:
            {
              // Ignored "unfiltered float"
              lTextureSampleType = 'unfilterable-float';
              break;
            }
        }
      } else {
        // Musst be and depth type.
        lTextureSampleType = 'depth';
      }
      // Exit.
      return {
        bindType: bind_type_enum_1.BindType.Texture,
        index: pBind.index,
        name: pBind.variable.name,
        visibility: pBind.visibility,
        sampleType: lTextureSampleType,
        viewDimension: _lTextureDimension,
        multisampled: lMultisampled
      };
    }
    throw new core_data_1.Exception("Not implemented. Upps \"".concat(pBind.variable.type, "\""), this);
  }
  /**
   * Get view dimension based on WGSL texture type.
   * @param pTextureType - Texture type.
   */
  texureDimensionFromType(pTextureType) {
    // Map every texture type for view dimension.
    switch (pTextureType) {
      case wgsl_type_enum_1.WgslType.Texture1d:
      case wgsl_type_enum_1.WgslType.TextureStorage1d:
        {
          return '1d';
        }
      case wgsl_type_enum_1.WgslType.TextureDepth2d:
      case wgsl_type_enum_1.WgslType.Texture2d:
      case wgsl_type_enum_1.WgslType.TextureStorage2d:
      case wgsl_type_enum_1.WgslType.TextureDepthMultisampled2d:
      case wgsl_type_enum_1.WgslType.TextureMultisampled2d:
        {
          return '2d';
        }
      case wgsl_type_enum_1.WgslType.TextureDepth2dArray:
      case wgsl_type_enum_1.WgslType.Texture2dArray:
      case wgsl_type_enum_1.WgslType.TextureStorage2dArray:
        {
          return '2d-array';
        }
      case wgsl_type_enum_1.WgslType.Texture3d:
      case wgsl_type_enum_1.WgslType.TextureStorage3d:
        {
          return '3d';
        }
      case wgsl_type_enum_1.WgslType.TextureCube:
      case wgsl_type_enum_1.WgslType.TextureDepthCube:
        {
          return 'cube';
        }
      case wgsl_type_enum_1.WgslType.TextureCubeArray:
        {
          return 'cube-array';
        }
      default:
        {
          throw new core_data_1.Exception("Texture type \"".concat(pTextureType, "\" not supported for any dimension."), this);
        }
    }
  }
}
exports.Shader = Shader;

/***/ }),

/***/ "./source/math/euler.ts":
/*!******************************!*\
  !*** ./source/math/euler.ts ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Euler = void 0;
class Euler {
  /**
   * Constructor.
   */
  constructor() {
    this.mX = 0;
    this.mY = 0;
    this.mZ = 0;
  }
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
}
exports.Euler = Euler;

/***/ }),

/***/ "./source/math/matrix.ts":
/*!*******************************!*\
  !*** ./source/math/matrix.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Matrix = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
var vector_1 = __webpack_require__(/*! ./vector */ "./source/math/vector.ts");
class Matrix {
  /**
   * Constructor.
   * @param pData - Matrix data.
   */
  constructor(pData) {
    this.mData = pData;
  }
  /**
   * Create matrix from data array.
   * Direction from reading columns than rows.
   * @param pArray - Array data.
   * @param pHeight
   * @param pWidth
   * @returns
   */
  static fromArray(pArray, pHeight, pWidth) {
    var lData = new Array();
    for (var lRowIndex = 0; lRowIndex < pHeight; lRowIndex++) {
      var lRowData = new Array(pWidth);
      for (var lColumnIndex = 0; lColumnIndex < pWidth; lColumnIndex++) {
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
    var lData = new Array();
    for (var lRowIndex = 0; lRowIndex < pSize; lRowIndex++) {
      // Create Array filled with zeros.
      var lRowData = new Array(pSize).fill(0);
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
    var lData = new Array();
    // Read from columns to rows.
    for (var lColumnIndex = 0; lColumnIndex < this.width; lColumnIndex++) {
      for (var lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
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
    var _this$mData$0$length, _this$mData$;
    return (_this$mData$0$length = (_this$mData$ = this.mData[0]) === null || _this$mData$ === void 0 ? void 0 : _this$mData$.length) !== null && _this$mData$0$length !== void 0 ? _this$mData$0$length : 0;
  }
  /**
   * Add value to matrix.
   * @param pAddData - Matrix or scalar value.
   */
  add(pAddData) {
    var lData = new Array();
    if (pAddData instanceof Matrix) {
      // Restrict on same length.
      if (this.height !== pAddData.height && this.width !== pAddData.width) {
        throw new core_data_1.Exception('Matrices need to be the same size for calculation.', this);
      }
      // Iterate rows and extend data dynamicly by pushing new data rows.
      for (var lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
        // Add each column of row.
        var lRowData = new Array(this.width);
        for (var lColumnIndex = 0; lColumnIndex < lRowData.length; lColumnIndex++) {
          lRowData[lColumnIndex] = this.mData[lRowIndex][lColumnIndex] + pAddData.data[lRowIndex][lColumnIndex];
        }
        lData.push(lRowData);
      }
    } else {
      // Add scalar to each matrix component.
      for (var _lRowIndex = 0; _lRowIndex < this.height; _lRowIndex++) {
        var _lRowData = new Array(this.width);
        for (var _lColumnIndex = 0; _lColumnIndex < _lRowData.length; _lColumnIndex++) {
          _lRowData[_lColumnIndex] = this.mData[_lRowIndex][_lColumnIndex] + pAddData;
        }
        lData.push(_lRowData);
      }
    }
    return new Matrix(lData);
  }
  /**
   * Adjoint matrix.
   */
  adjoint() {
    var lMatrixData = new Array();
    // Allways use first row and iterate over columns.
    for (var lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
      var lMatrixRow = new Array();
      for (var lColumIndex = 0; lColumIndex < this.width; lColumIndex++) {
        // Calculate determant of matrix with omitted column and row.
        // Toggle sign on each new row or column.
        var lDeterminant = this.omit(lRowIndex, lColumIndex).determinant();
        lDeterminant *= Math.pow(-1, lRowIndex + 1 + (lColumIndex + 1));
        lMatrixRow.push(lDeterminant);
      }
      // Add row to matrix data.
      lMatrixData.push(lMatrixRow);
    }
    // Calculate transpose from cofactor matrix to get adjoint. 
    var lCofactorMatrix = new Matrix(lMatrixData);
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
    var lDeterminant = 0;
    for (var lIterationIndex = 0; lIterationIndex < this.width; lIterationIndex++) {
      // Get number of row iteration to detect if any calculation musst be done.
      var lSignedNumber = this.data[0][lIterationIndex];
      lSignedNumber *= lIterationIndex % 2 ? -1 : 1; // Toggle sign between iteration. Begin with plus.
      // Check if any calculation needs to be done. Zero multiplicated is allways zero.
      if (lSignedNumber !== 0) {
        // Calculate determinant of new matrix. Allways use first row.
        var lDeterminantMatrix = this.omit(0, lIterationIndex);
        lDeterminant += lSignedNumber * lDeterminantMatrix.determinant();
      }
    }
    return lDeterminant;
  }
  /**
   * Inverse matrix.
   */
  inverse() {
    var lAdjoint = this.adjoint();
    var lDeterminant = this.determinant();
    // Devide each adjoint matrix component by determinant.
    for (var lColumIndex = 0; lColumIndex < this.width; lColumIndex++) {
      for (var lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
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
    var lData = new Array();
    if (pMultData instanceof Matrix) {
      // Restrict on same length.
      if (this.width !== pMultData.height) {
        throw new core_data_1.Exception('Matrices A width and B height must match for multiplication.', this);
      }
      // Iterate rows and extend data dynamicly by pushing new data rows.
      for (var lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
        // Add each column of row.
        var lRowData = new Array(pMultData.width);
        for (var lColumnIndex = 0; lColumnIndex < lRowData.length; lColumnIndex++) {
          // Multiplicate target row with source column components.
          // Iteration length is eighter target.height or source.width.
          var lProduct = 0;
          for (var lComponentIndex = 0; lComponentIndex < this.height; lComponentIndex++) {
            lProduct += this.mData[lRowIndex][lComponentIndex] * pMultData.data[lComponentIndex][lColumnIndex];
          }
          lRowData[lColumnIndex] = lProduct;
        }
        lData.push(lRowData);
      }
    } else {
      // Multiplicate scalar to each matrix component.
      for (var _lRowIndex2 = 0; _lRowIndex2 < this.height; _lRowIndex2++) {
        var _lRowData2 = new Array(this.width);
        for (var _lColumnIndex2 = 0; _lColumnIndex2 < this.width; _lColumnIndex2++) {
          _lRowData2[_lColumnIndex2] = this.mData[_lRowIndex2][_lColumnIndex2] * pMultData;
        }
        lData.push(_lRowData2);
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
    var lMatrixData = new Array();
    // Allways use first row and iterate over columns.
    for (var lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
      if (lRowIndex !== pOmitRow) {
        var lMatrixRow = new Array();
        for (var lColumIndex = 0; lColumIndex < this.width; lColumIndex++) {
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
    var lData = new Array();
    if (pAddData instanceof Matrix) {
      // Restrict on same length.
      if (this.height !== pAddData.height && this.width !== pAddData.width) {
        throw new core_data_1.Exception('Matrices need to be the same size for calculation.', this);
      }
      // Iterate rows and extend data dynamicly by pushing new data rows.
      for (var lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
        // Add each column of row.
        var lRowData = new Array(this.width);
        for (var lColumnIndex = 0; lColumnIndex < lRowData.length; lColumnIndex++) {
          lRowData[lColumnIndex] = this.mData[lRowIndex][lColumnIndex] - pAddData.data[lRowIndex][lColumnIndex];
        }
        lData.push(lRowData);
      }
    } else {
      // Add scalar to each matrix component.
      for (var _lRowIndex3 = 0; _lRowIndex3 < this.height; _lRowIndex3++) {
        var _lRowData3 = new Array(this.width);
        for (var _lColumnIndex3 = 0; _lColumnIndex3 < _lRowData3.length; _lColumnIndex3++) {
          _lRowData3[_lColumnIndex3] = this.mData[_lRowIndex3][_lColumnIndex3] - pAddData;
        }
        lData.push(_lRowData3);
      }
    }
    return new Matrix(lData);
  }
  /**
   * Transpose matrix.
   */
  transpose() {
    var lMatrixData = new Array();
    // Transpose by copying column into row.
    for (var lColumIndex = 0; lColumIndex < this.width; lColumIndex++) {
      var lMatrixRow = new Array();
      for (var lRowIndex = 0; lRowIndex < this.height; lRowIndex++) {
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
    var lMatrixData = new Array();
    for (var lVectorComponent of pMultData.data) {
      lMatrixData.push([lVectorComponent]);
    }
    // Multiplicate
    var lMutiplicatedMatrix = this.mult(new Matrix(lMatrixData));
    var lVectorData = new Array();
    for (var lRowIndex = 0; lRowIndex < lMutiplicatedMatrix.height; lRowIndex++) {
      lVectorData.push(lMutiplicatedMatrix.data[lRowIndex][0]);
    }
    return new vector_1.Vector(lVectorData);
  }
}
exports.Matrix = Matrix;

/***/ }),

/***/ "./source/math/quaternion.ts":
/*!***********************************!*\
  !*** ./source/math/quaternion.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Quaternion = void 0;
var euler_1 = __webpack_require__(/*! ./euler */ "./source/math/euler.ts");
var matrix_1 = __webpack_require__(/*! ./matrix */ "./source/math/matrix.ts");
var vector_1 = __webpack_require__(/*! ./vector */ "./source/math/vector.ts");
class Quaternion {
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
   * Create new quaternion from degree rotation.
   * Rotate order XYZ (Pitch, Yaw, Roll)
   * @param pPitch - Pitch degree.
   * @param pYaw - Yaw degree.
   * @param pRoll - Roll degree.
   */
  static fromRotation(pPitch, pYaw, pRoll) {
    // Conversion to radian.
    var lPitchRadian = pPitch % 360 * Math.PI / 180;
    var lYawRadian = pYaw % 360 * Math.PI / 180;
    var lRollRadian = pRoll % 360 * Math.PI / 180;
    // Pre calculate.
    var lCosPitch = Math.cos(lPitchRadian * 0.5);
    var lSinPitch = Math.sin(lPitchRadian * 0.5);
    var lCosYaw = Math.cos(lYawRadian * 0.5);
    var lSinYaw = Math.sin(lYawRadian * 0.5);
    var lCosRoll = Math.cos(lRollRadian * 0.5);
    var lSinRoll = Math.sin(lRollRadian * 0.5);
    // Create quaternion.
    var lQuaternion = Quaternion.identity();
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
    var lSquareX = 2 * Math.pow(this.mX, 2);
    var lSquareY = 2 * Math.pow(this.mY, 2);
    var lProductXz = 2 * this.mX * this.mZ;
    var lProductYw = 2 * this.mY * this.mW;
    var lProductYz = 2 * this.mY * this.mZ;
    var lProductXw = 2 * this.mX * this.mW;
    var lX = lProductXz + lProductYw;
    var lY = lProductYz - lProductXw;
    var lZ = 1 - lSquareX - lSquareY;
    return new vector_1.Vector([lX, lY, lZ]);
  }
  /**
   * Rotation vector right.
   */
  get vectorRight() {
    // Products.
    var lSquareY = 2 * Math.pow(this.mY, 2);
    var lSquareZ = 2 * Math.pow(this.mZ, 2);
    var lProductXy = 2 * this.mX * this.mY;
    var lProductZw = 2 * this.mZ * this.mW;
    var lProductYz = 2 * this.mY * this.mZ;
    var lProductXw = 2 * this.mX * this.mW;
    var lX = 1 - lSquareY - lSquareZ;
    var lY = lProductXy + lProductZw;
    var lZ = lProductYz + lProductXw;
    return new vector_1.Vector([lX, lY, lZ]);
  }
  /**
   * Rotation up vector.
   */
  get vectorUp() {
    // Products.
    var lSquareX = 2 * Math.pow(this.mX, 2);
    var lSquareZ = 2 * Math.pow(this.mZ, 2);
    var lProductXy = 2 * this.mX * this.mY;
    var lProductZw = 2 * this.mZ * this.mW;
    var lProductYz = 2 * this.mY * this.mZ;
    var lProductXw = 2 * this.mX * this.mW;
    var lX = lProductXy - lProductZw;
    var lY = 1 - lSquareX - lSquareZ;
    var lZ = lProductYz + lProductXw;
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
    var lEuler = new euler_1.Euler();
    // Pitch (x-axis rotation)
    var lSinPitchCosYaw = 2 * (this.mW * this.mX + this.mY * this.mZ);
    var lCosPitchCosYaw = 1 - 2 * (this.mX * this.mX + this.mY * this.mY);
    var lPitchRadian = Math.atan2(lSinPitchCosYaw, lCosPitchCosYaw);
    var lPitchDegree = lPitchRadian * 180 / Math.PI % 360;
    lEuler.x = lPitchDegree < 0 ? lPitchDegree + 360 : lPitchDegree;
    // Yaw (y-axis rotation)
    var lSinYaw = Math.sqrt(1 + 2 * (this.mW * this.mY - this.mX * this.mZ));
    var lCosYaw = Math.sqrt(1 - 2 * (this.mW * this.mY - this.mX * this.mZ));
    var lYawRadian = 2 * Math.atan2(lSinYaw, lCosYaw) - Math.PI / 2;
    var lYawDegree = lYawRadian * 180 / Math.PI % 360;
    lEuler.y = lYawDegree < 0 ? lYawDegree + 360 : lYawDegree;
    // Roll (z-axis rotation)
    var lSinRollCosYaw = 2 * (this.mW * this.mZ + this.mX * this.mY);
    var lCosRollCosYaw = 1 - 2 * (this.mY * this.mY + this.mZ * this.mZ);
    var lRollRadian = Math.atan2(lSinRollCosYaw, lCosRollCosYaw);
    var lRollDegree = lRollRadian * 180 / Math.PI % 360;
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
    var lSquareX = 2 * Math.pow(this.mX, 2);
    var lSquareY = 2 * Math.pow(this.mY, 2);
    var lSquareZ = 2 * Math.pow(this.mZ, 2);
    // Products.
    var lProductXy = 2 * this.mX * this.mY;
    var lProductZw = 2 * this.mZ * this.mW;
    var lProductXz = 2 * this.mX * this.mZ;
    var lProductYw = 2 * this.mY * this.mW;
    var lProductYz = 2 * this.mY * this.mZ;
    var lProductXw = 2 * this.mX * this.mW;
    // Fill matrix
    var lMatrix = matrix_1.Matrix.identity(4);
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
    var lW = this.mW * pQuaternion.w - this.mX * pQuaternion.x - this.mY * pQuaternion.y - this.mZ * pQuaternion.z;
    var lX = this.mW * pQuaternion.x + this.mX * pQuaternion.w + this.mY * pQuaternion.z - this.mZ * pQuaternion.y;
    var lY = this.mW * pQuaternion.y - this.mX * pQuaternion.z + this.mY * pQuaternion.w + this.mZ * pQuaternion.x;
    var lZ = this.mW * pQuaternion.z + this.mX * pQuaternion.y - this.mY * pQuaternion.x + this.mZ * pQuaternion.w;
    return new Quaternion(lW, lX, lY, lZ);
  }
  /**
   * Normalize quaternion.
   */
  normalize() {
    // Calculate length.
    var lLength = Math.hypot(Math.pow(this.mW, 2), Math.pow(this.mX, 2), Math.pow(this.mY, 2), Math.pow(this.mZ, 2));
    // Create new quaternion by dividing each dimension by length.
    return new Quaternion(this.mW / lLength, this.mX / lLength, this.mY / lLength, this.mZ / lLength);
  }
}
exports.Quaternion = Quaternion;

/***/ }),

/***/ "./source/math/vector.ts":
/*!*******************************!*\
  !*** ./source/math/vector.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Vector = void 0;
var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
class Vector {
  /**
   * Constructor.
   * @param pData - Vector data.
   */
  constructor(pData) {
    this.mData = [...pData];
  }
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
   * Add two vectors.
   * @param pAddData - Vector or scalar.
   */
  add(pAddData) {
    var lData = new Array();
    if (pAddData instanceof Vector) {
      // Restrict on same length.
      if (this.mData.length !== pAddData.data.length) {
        throw new core_data_1.Exception('Vectors need to be the same length for calculation.', this);
      }
      // Add values.
      for (var lIndex = 0; lIndex < this.mData.length; lIndex++) {
        lData.push(this.mData[lIndex] + pAddData.data[lIndex]);
      }
    } else {
      // Add scalar to each vector component.
      for (var lItem of this.mData) {
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
    var lProduct = 0;
    for (var lIndex = 0; lIndex < this.mData.length; lIndex++) {
      lProduct += this.mData[lIndex] * pVector.data[lIndex];
    }
    return lProduct;
  }
  /**
   * Normalize vector.
   */
  normalize() {
    var lLength = this.length();
    // Devide each vector component with it vector length.
    var lData = new Array();
    for (var lItem of this.mData) {
      lData.push(lItem / lLength);
    }
    return new Vector(lData);
  }
  /**
   * Substract two vectors.
   * @param pSubData - Vector or scalar
   */
  sub(pSubData) {
    var lData = new Array();
    if (pSubData instanceof Vector) {
      // Restrict on same length.
      if (this.mData.length !== pSubData.data.length) {
        throw new core_data_1.Exception('Vectors need to be the same length for calculation.', this);
      }
      // Add values.
      for (var lIndex = 0; lIndex < this.mData.length; lIndex++) {
        lData.push(this.mData[lIndex] - pSubData.data[lIndex]);
      }
    } else {
      // Substract scalar to each vector component.
      for (var lItem of this.mData) {
        lData.push(lItem - pSubData);
      }
    }
    return new Vector(lData);
  }
}
exports.Vector = Vector;

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

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var named_references_1 = __webpack_require__(/*! ./named-references */ "../../node_modules/html-entities/lib/named-references.js");
var numeric_unicode_map_1 = __webpack_require__(/*! ./numeric-unicode-map */ "../../node_modules/html-entities/lib/numeric-unicode-map.js");
var surrogate_pairs_1 = __webpack_require__(/*! ./surrogate-pairs */ "../../node_modules/html-entities/lib/surrogate-pairs.js");
var allNamedReferences = __assign(__assign({}, named_references_1.namedReferences), { all: named_references_1.namedReferences.html5 });
var encodeRegExps = {
    specialChars: /[<>'"&]/g,
    nonAscii: /(?:[<>'"&\u0080-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g,
    nonAsciiPrintable: /(?:[<>'"&\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g,
    extensive: /(?:[\x01-\x0c\x0e-\x1f\x21-\x2c\x2e-\x2f\x3a-\x40\x5b-\x60\x7b-\x7d\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g
};
var defaultEncodeOptions = {
    mode: 'specialChars',
    level: 'all',
    numeric: 'decimal'
};
/** Encodes all the necessary (specified by `level`) characters in the text */
function encode(text, _a) {
    var _b = _a === void 0 ? defaultEncodeOptions : _a, _c = _b.mode, mode = _c === void 0 ? 'specialChars' : _c, _d = _b.numeric, numeric = _d === void 0 ? 'decimal' : _d, _e = _b.level, level = _e === void 0 ? 'all' : _e;
    if (!text) {
        return '';
    }
    var encodeRegExp = encodeRegExps[mode];
    var references = allNamedReferences[level].characters;
    var isHex = numeric === 'hexadecimal';
    encodeRegExp.lastIndex = 0;
    var _b = encodeRegExp.exec(text);
    var _c;
    if (_b) {
        _c = '';
        var _d = 0;
        do {
            if (_d !== _b.index) {
                _c += text.substring(_d, _b.index);
            }
            var _e = _b[0];
            var result_1 = references[_e];
            if (!result_1) {
                var code_1 = _e.length > 1 ? surrogate_pairs_1.getCodePoint(_e, 0) : _e.charCodeAt(0);
                result_1 = (isHex ? '&#x' + code_1.toString(16) : '&#' + code_1) + ';';
            }
            _c += result_1;
            _d = _b.index + _e.length;
        } while ((_b = encodeRegExp.exec(text)));
        if (_d !== text.length) {
            _c += text.substring(_d);
        }
    }
    else {
        _c =
            text;
    }
    return _c;
}
exports.encode = encode;
var defaultDecodeOptions = {
    scope: 'body',
    level: 'all'
};
var strict = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);/g;
var attribute = /&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+)[;=]?/g;
var baseDecodeRegExps = {
    xml: {
        strict: strict,
        attribute: attribute,
        body: named_references_1.bodyRegExps.xml
    },
    html4: {
        strict: strict,
        attribute: attribute,
        body: named_references_1.bodyRegExps.html4
    },
    html5: {
        strict: strict,
        attribute: attribute,
        body: named_references_1.bodyRegExps.html5
    }
};
var decodeRegExps = __assign(__assign({}, baseDecodeRegExps), { all: baseDecodeRegExps.html5 });
var fromCharCode = String.fromCharCode;
var outOfBoundsChar = fromCharCode(65533);
var defaultDecodeEntityOptions = {
    level: 'all'
};
/** Decodes a single entity */
function decodeEntity(entity, _a) {
    var _b = (_a === void 0 ? defaultDecodeEntityOptions : _a).level, level = _b === void 0 ? 'all' : _b;
    if (!entity) {
        return '';
    }
    var _b = entity;
    var decodeEntityLastChar_1 = entity[entity.length - 1];
    if (false) {}
    else if (false) {}
    else {
        var decodeResultByReference_1 = allNamedReferences[level].entities[entity];
        if (decodeResultByReference_1) {
            _b = decodeResultByReference_1;
        }
        else if (entity[0] === '&' && entity[1] === '#') {
            var decodeSecondChar_1 = entity[2];
            var decodeCode_1 = decodeSecondChar_1 == 'x' || decodeSecondChar_1 == 'X'
                ? parseInt(entity.substr(3), 16)
                : parseInt(entity.substr(2));
            _b =
                decodeCode_1 >= 0x10ffff
                    ? outOfBoundsChar
                    : decodeCode_1 > 65535
                        ? surrogate_pairs_1.fromCodePoint(decodeCode_1)
                        : fromCharCode(numeric_unicode_map_1.numericUnicodeMap[decodeCode_1] || decodeCode_1);
        }
    }
    return _b;
}
exports.decodeEntity = decodeEntity;
/** Decodes all entities in the text */
function decode(text, _a) {
    var decodeSecondChar_1 = _a === void 0 ? defaultDecodeOptions : _a, decodeCode_1 = decodeSecondChar_1.level, level = decodeCode_1 === void 0 ? 'all' : decodeCode_1, _b = decodeSecondChar_1.scope, scope = _b === void 0 ? level === 'xml' ? 'strict' : 'body' : _b;
    if (!text) {
        return '';
    }
    var decodeRegExp = decodeRegExps[level][scope];
    var references = allNamedReferences[level].entities;
    var isAttribute = scope === 'attribute';
    var isStrict = scope === 'strict';
    decodeRegExp.lastIndex = 0;
    var replaceMatch_1 = decodeRegExp.exec(text);
    var replaceResult_1;
    if (replaceMatch_1) {
        replaceResult_1 = '';
        var replaceLastIndex_1 = 0;
        do {
            if (replaceLastIndex_1 !== replaceMatch_1.index) {
                replaceResult_1 += text.substring(replaceLastIndex_1, replaceMatch_1.index);
            }
            var replaceInput_1 = replaceMatch_1[0];
            var decodeResult_1 = replaceInput_1;
            var decodeEntityLastChar_2 = replaceInput_1[replaceInput_1.length - 1];
            if (isAttribute
                && decodeEntityLastChar_2 === '=') {
                decodeResult_1 = replaceInput_1;
            }
            else if (isStrict
                && decodeEntityLastChar_2 !== ';') {
                decodeResult_1 = replaceInput_1;
            }
            else {
                var decodeResultByReference_2 = references[replaceInput_1];
                if (decodeResultByReference_2) {
                    decodeResult_1 = decodeResultByReference_2;
                }
                else if (replaceInput_1[0] === '&' && replaceInput_1[1] === '#') {
                    var decodeSecondChar_2 = replaceInput_1[2];
                    var decodeCode_2 = decodeSecondChar_2 == 'x' || decodeSecondChar_2 == 'X'
                        ? parseInt(replaceInput_1.substr(3), 16)
                        : parseInt(replaceInput_1.substr(2));
                    decodeResult_1 =
                        decodeCode_2 >= 0x10ffff
                            ? outOfBoundsChar
                            : decodeCode_2 > 65535
                                ? surrogate_pairs_1.fromCodePoint(decodeCode_2)
                                : fromCharCode(numeric_unicode_map_1.numericUnicodeMap[decodeCode_2] || decodeCode_2);
                }
            }
            replaceResult_1 += decodeResult_1;
            replaceLastIndex_1 = replaceMatch_1.index + replaceInput_1.length;
        } while ((replaceMatch_1 = decodeRegExp.exec(text)));
        if (replaceLastIndex_1 !== text.length) {
            replaceResult_1 += text.substring(replaceLastIndex_1);
        }
    }
    else {
        replaceResult_1 =
            text;
    }
    return replaceResult_1;
}
exports.decode = decode;


/***/ }),

/***/ "../../node_modules/html-entities/lib/named-references.js":
/*!****************************************************************!*\
  !*** ../../node_modules/html-entities/lib/named-references.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.bodyRegExps={xml:/&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,html4:/&(?:nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|quot|amp|lt|gt|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,html5:/&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g};exports.namedReferences={xml:{entities:{"&lt;":"<","&gt;":">","&quot;":'"',"&apos;":"'","&amp;":"&"},characters:{"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;","&":"&amp;"}},html4:{entities:{"&apos;":"'","&nbsp":" ","&nbsp;":" ","&iexcl":"¡","&iexcl;":"¡","&cent":"¢","&cent;":"¢","&pound":"£","&pound;":"£","&curren":"¤","&curren;":"¤","&yen":"¥","&yen;":"¥","&brvbar":"¦","&brvbar;":"¦","&sect":"§","&sect;":"§","&uml":"¨","&uml;":"¨","&copy":"©","&copy;":"©","&ordf":"ª","&ordf;":"ª","&laquo":"«","&laquo;":"«","&not":"¬","&not;":"¬","&shy":"­","&shy;":"­","&reg":"®","&reg;":"®","&macr":"¯","&macr;":"¯","&deg":"°","&deg;":"°","&plusmn":"±","&plusmn;":"±","&sup2":"²","&sup2;":"²","&sup3":"³","&sup3;":"³","&acute":"´","&acute;":"´","&micro":"µ","&micro;":"µ","&para":"¶","&para;":"¶","&middot":"·","&middot;":"·","&cedil":"¸","&cedil;":"¸","&sup1":"¹","&sup1;":"¹","&ordm":"º","&ordm;":"º","&raquo":"»","&raquo;":"»","&frac14":"¼","&frac14;":"¼","&frac12":"½","&frac12;":"½","&frac34":"¾","&frac34;":"¾","&iquest":"¿","&iquest;":"¿","&Agrave":"À","&Agrave;":"À","&Aacute":"Á","&Aacute;":"Á","&Acirc":"Â","&Acirc;":"Â","&Atilde":"Ã","&Atilde;":"Ã","&Auml":"Ä","&Auml;":"Ä","&Aring":"Å","&Aring;":"Å","&AElig":"Æ","&AElig;":"Æ","&Ccedil":"Ç","&Ccedil;":"Ç","&Egrave":"È","&Egrave;":"È","&Eacute":"É","&Eacute;":"É","&Ecirc":"Ê","&Ecirc;":"Ê","&Euml":"Ë","&Euml;":"Ë","&Igrave":"Ì","&Igrave;":"Ì","&Iacute":"Í","&Iacute;":"Í","&Icirc":"Î","&Icirc;":"Î","&Iuml":"Ï","&Iuml;":"Ï","&ETH":"Ð","&ETH;":"Ð","&Ntilde":"Ñ","&Ntilde;":"Ñ","&Ograve":"Ò","&Ograve;":"Ò","&Oacute":"Ó","&Oacute;":"Ó","&Ocirc":"Ô","&Ocirc;":"Ô","&Otilde":"Õ","&Otilde;":"Õ","&Ouml":"Ö","&Ouml;":"Ö","&times":"×","&times;":"×","&Oslash":"Ø","&Oslash;":"Ø","&Ugrave":"Ù","&Ugrave;":"Ù","&Uacute":"Ú","&Uacute;":"Ú","&Ucirc":"Û","&Ucirc;":"Û","&Uuml":"Ü","&Uuml;":"Ü","&Yacute":"Ý","&Yacute;":"Ý","&THORN":"Þ","&THORN;":"Þ","&szlig":"ß","&szlig;":"ß","&agrave":"à","&agrave;":"à","&aacute":"á","&aacute;":"á","&acirc":"â","&acirc;":"â","&atilde":"ã","&atilde;":"ã","&auml":"ä","&auml;":"ä","&aring":"å","&aring;":"å","&aelig":"æ","&aelig;":"æ","&ccedil":"ç","&ccedil;":"ç","&egrave":"è","&egrave;":"è","&eacute":"é","&eacute;":"é","&ecirc":"ê","&ecirc;":"ê","&euml":"ë","&euml;":"ë","&igrave":"ì","&igrave;":"ì","&iacute":"í","&iacute;":"í","&icirc":"î","&icirc;":"î","&iuml":"ï","&iuml;":"ï","&eth":"ð","&eth;":"ð","&ntilde":"ñ","&ntilde;":"ñ","&ograve":"ò","&ograve;":"ò","&oacute":"ó","&oacute;":"ó","&ocirc":"ô","&ocirc;":"ô","&otilde":"õ","&otilde;":"õ","&ouml":"ö","&ouml;":"ö","&divide":"÷","&divide;":"÷","&oslash":"ø","&oslash;":"ø","&ugrave":"ù","&ugrave;":"ù","&uacute":"ú","&uacute;":"ú","&ucirc":"û","&ucirc;":"û","&uuml":"ü","&uuml;":"ü","&yacute":"ý","&yacute;":"ý","&thorn":"þ","&thorn;":"þ","&yuml":"ÿ","&yuml;":"ÿ","&quot":'"',"&quot;":'"',"&amp":"&","&amp;":"&","&lt":"<","&lt;":"<","&gt":">","&gt;":">","&OElig;":"Œ","&oelig;":"œ","&Scaron;":"Š","&scaron;":"š","&Yuml;":"Ÿ","&circ;":"ˆ","&tilde;":"˜","&ensp;":" ","&emsp;":" ","&thinsp;":" ","&zwnj;":"‌","&zwj;":"‍","&lrm;":"‎","&rlm;":"‏","&ndash;":"–","&mdash;":"—","&lsquo;":"‘","&rsquo;":"’","&sbquo;":"‚","&ldquo;":"“","&rdquo;":"”","&bdquo;":"„","&dagger;":"†","&Dagger;":"‡","&permil;":"‰","&lsaquo;":"‹","&rsaquo;":"›","&euro;":"€","&fnof;":"ƒ","&Alpha;":"Α","&Beta;":"Β","&Gamma;":"Γ","&Delta;":"Δ","&Epsilon;":"Ε","&Zeta;":"Ζ","&Eta;":"Η","&Theta;":"Θ","&Iota;":"Ι","&Kappa;":"Κ","&Lambda;":"Λ","&Mu;":"Μ","&Nu;":"Ν","&Xi;":"Ξ","&Omicron;":"Ο","&Pi;":"Π","&Rho;":"Ρ","&Sigma;":"Σ","&Tau;":"Τ","&Upsilon;":"Υ","&Phi;":"Φ","&Chi;":"Χ","&Psi;":"Ψ","&Omega;":"Ω","&alpha;":"α","&beta;":"β","&gamma;":"γ","&delta;":"δ","&epsilon;":"ε","&zeta;":"ζ","&eta;":"η","&theta;":"θ","&iota;":"ι","&kappa;":"κ","&lambda;":"λ","&mu;":"μ","&nu;":"ν","&xi;":"ξ","&omicron;":"ο","&pi;":"π","&rho;":"ρ","&sigmaf;":"ς","&sigma;":"σ","&tau;":"τ","&upsilon;":"υ","&phi;":"φ","&chi;":"χ","&psi;":"ψ","&omega;":"ω","&thetasym;":"ϑ","&upsih;":"ϒ","&piv;":"ϖ","&bull;":"•","&hellip;":"…","&prime;":"′","&Prime;":"″","&oline;":"‾","&frasl;":"⁄","&weierp;":"℘","&image;":"ℑ","&real;":"ℜ","&trade;":"™","&alefsym;":"ℵ","&larr;":"←","&uarr;":"↑","&rarr;":"→","&darr;":"↓","&harr;":"↔","&crarr;":"↵","&lArr;":"⇐","&uArr;":"⇑","&rArr;":"⇒","&dArr;":"⇓","&hArr;":"⇔","&forall;":"∀","&part;":"∂","&exist;":"∃","&empty;":"∅","&nabla;":"∇","&isin;":"∈","&notin;":"∉","&ni;":"∋","&prod;":"∏","&sum;":"∑","&minus;":"−","&lowast;":"∗","&radic;":"√","&prop;":"∝","&infin;":"∞","&ang;":"∠","&and;":"∧","&or;":"∨","&cap;":"∩","&cup;":"∪","&int;":"∫","&there4;":"∴","&sim;":"∼","&cong;":"≅","&asymp;":"≈","&ne;":"≠","&equiv;":"≡","&le;":"≤","&ge;":"≥","&sub;":"⊂","&sup;":"⊃","&nsub;":"⊄","&sube;":"⊆","&supe;":"⊇","&oplus;":"⊕","&otimes;":"⊗","&perp;":"⊥","&sdot;":"⋅","&lceil;":"⌈","&rceil;":"⌉","&lfloor;":"⌊","&rfloor;":"⌋","&lang;":"〈","&rang;":"〉","&loz;":"◊","&spades;":"♠","&clubs;":"♣","&hearts;":"♥","&diams;":"♦"},characters:{"'":"&apos;"," ":"&nbsp;","¡":"&iexcl;","¢":"&cent;","£":"&pound;","¤":"&curren;","¥":"&yen;","¦":"&brvbar;","§":"&sect;","¨":"&uml;","©":"&copy;","ª":"&ordf;","«":"&laquo;","¬":"&not;","­":"&shy;","®":"&reg;","¯":"&macr;","°":"&deg;","±":"&plusmn;","²":"&sup2;","³":"&sup3;","´":"&acute;","µ":"&micro;","¶":"&para;","·":"&middot;","¸":"&cedil;","¹":"&sup1;","º":"&ordm;","»":"&raquo;","¼":"&frac14;","½":"&frac12;","¾":"&frac34;","¿":"&iquest;","À":"&Agrave;","Á":"&Aacute;","Â":"&Acirc;","Ã":"&Atilde;","Ä":"&Auml;","Å":"&Aring;","Æ":"&AElig;","Ç":"&Ccedil;","È":"&Egrave;","É":"&Eacute;","Ê":"&Ecirc;","Ë":"&Euml;","Ì":"&Igrave;","Í":"&Iacute;","Î":"&Icirc;","Ï":"&Iuml;","Ð":"&ETH;","Ñ":"&Ntilde;","Ò":"&Ograve;","Ó":"&Oacute;","Ô":"&Ocirc;","Õ":"&Otilde;","Ö":"&Ouml;","×":"&times;","Ø":"&Oslash;","Ù":"&Ugrave;","Ú":"&Uacute;","Û":"&Ucirc;","Ü":"&Uuml;","Ý":"&Yacute;","Þ":"&THORN;","ß":"&szlig;","à":"&agrave;","á":"&aacute;","â":"&acirc;","ã":"&atilde;","ä":"&auml;","å":"&aring;","æ":"&aelig;","ç":"&ccedil;","è":"&egrave;","é":"&eacute;","ê":"&ecirc;","ë":"&euml;","ì":"&igrave;","í":"&iacute;","î":"&icirc;","ï":"&iuml;","ð":"&eth;","ñ":"&ntilde;","ò":"&ograve;","ó":"&oacute;","ô":"&ocirc;","õ":"&otilde;","ö":"&ouml;","÷":"&divide;","ø":"&oslash;","ù":"&ugrave;","ú":"&uacute;","û":"&ucirc;","ü":"&uuml;","ý":"&yacute;","þ":"&thorn;","ÿ":"&yuml;",'"':"&quot;","&":"&amp;","<":"&lt;",">":"&gt;","Œ":"&OElig;","œ":"&oelig;","Š":"&Scaron;","š":"&scaron;","Ÿ":"&Yuml;","ˆ":"&circ;","˜":"&tilde;"," ":"&ensp;"," ":"&emsp;"," ":"&thinsp;","‌":"&zwnj;","‍":"&zwj;","‎":"&lrm;","‏":"&rlm;","–":"&ndash;","—":"&mdash;","‘":"&lsquo;","’":"&rsquo;","‚":"&sbquo;","“":"&ldquo;","”":"&rdquo;","„":"&bdquo;","†":"&dagger;","‡":"&Dagger;","‰":"&permil;","‹":"&lsaquo;","›":"&rsaquo;","€":"&euro;","ƒ":"&fnof;","Α":"&Alpha;","Β":"&Beta;","Γ":"&Gamma;","Δ":"&Delta;","Ε":"&Epsilon;","Ζ":"&Zeta;","Η":"&Eta;","Θ":"&Theta;","Ι":"&Iota;","Κ":"&Kappa;","Λ":"&Lambda;","Μ":"&Mu;","Ν":"&Nu;","Ξ":"&Xi;","Ο":"&Omicron;","Π":"&Pi;","Ρ":"&Rho;","Σ":"&Sigma;","Τ":"&Tau;","Υ":"&Upsilon;","Φ":"&Phi;","Χ":"&Chi;","Ψ":"&Psi;","Ω":"&Omega;","α":"&alpha;","β":"&beta;","γ":"&gamma;","δ":"&delta;","ε":"&epsilon;","ζ":"&zeta;","η":"&eta;","θ":"&theta;","ι":"&iota;","κ":"&kappa;","λ":"&lambda;","μ":"&mu;","ν":"&nu;","ξ":"&xi;","ο":"&omicron;","π":"&pi;","ρ":"&rho;","ς":"&sigmaf;","σ":"&sigma;","τ":"&tau;","υ":"&upsilon;","φ":"&phi;","χ":"&chi;","ψ":"&psi;","ω":"&omega;","ϑ":"&thetasym;","ϒ":"&upsih;","ϖ":"&piv;","•":"&bull;","…":"&hellip;","′":"&prime;","″":"&Prime;","‾":"&oline;","⁄":"&frasl;","℘":"&weierp;","ℑ":"&image;","ℜ":"&real;","™":"&trade;","ℵ":"&alefsym;","←":"&larr;","↑":"&uarr;","→":"&rarr;","↓":"&darr;","↔":"&harr;","↵":"&crarr;","⇐":"&lArr;","⇑":"&uArr;","⇒":"&rArr;","⇓":"&dArr;","⇔":"&hArr;","∀":"&forall;","∂":"&part;","∃":"&exist;","∅":"&empty;","∇":"&nabla;","∈":"&isin;","∉":"&notin;","∋":"&ni;","∏":"&prod;","∑":"&sum;","−":"&minus;","∗":"&lowast;","√":"&radic;","∝":"&prop;","∞":"&infin;","∠":"&ang;","∧":"&and;","∨":"&or;","∩":"&cap;","∪":"&cup;","∫":"&int;","∴":"&there4;","∼":"&sim;","≅":"&cong;","≈":"&asymp;","≠":"&ne;","≡":"&equiv;","≤":"&le;","≥":"&ge;","⊂":"&sub;","⊃":"&sup;","⊄":"&nsub;","⊆":"&sube;","⊇":"&supe;","⊕":"&oplus;","⊗":"&otimes;","⊥":"&perp;","⋅":"&sdot;","⌈":"&lceil;","⌉":"&rceil;","⌊":"&lfloor;","⌋":"&rfloor;","〈":"&lang;","〉":"&rang;","◊":"&loz;","♠":"&spades;","♣":"&clubs;","♥":"&hearts;","♦":"&diams;"}},html5:{entities:{"&AElig":"Æ","&AElig;":"Æ","&AMP":"&","&AMP;":"&","&Aacute":"Á","&Aacute;":"Á","&Abreve;":"Ă","&Acirc":"Â","&Acirc;":"Â","&Acy;":"А","&Afr;":"𝔄","&Agrave":"À","&Agrave;":"À","&Alpha;":"Α","&Amacr;":"Ā","&And;":"⩓","&Aogon;":"Ą","&Aopf;":"𝔸","&ApplyFunction;":"⁡","&Aring":"Å","&Aring;":"Å","&Ascr;":"𝒜","&Assign;":"≔","&Atilde":"Ã","&Atilde;":"Ã","&Auml":"Ä","&Auml;":"Ä","&Backslash;":"∖","&Barv;":"⫧","&Barwed;":"⌆","&Bcy;":"Б","&Because;":"∵","&Bernoullis;":"ℬ","&Beta;":"Β","&Bfr;":"𝔅","&Bopf;":"𝔹","&Breve;":"˘","&Bscr;":"ℬ","&Bumpeq;":"≎","&CHcy;":"Ч","&COPY":"©","&COPY;":"©","&Cacute;":"Ć","&Cap;":"⋒","&CapitalDifferentialD;":"ⅅ","&Cayleys;":"ℭ","&Ccaron;":"Č","&Ccedil":"Ç","&Ccedil;":"Ç","&Ccirc;":"Ĉ","&Cconint;":"∰","&Cdot;":"Ċ","&Cedilla;":"¸","&CenterDot;":"·","&Cfr;":"ℭ","&Chi;":"Χ","&CircleDot;":"⊙","&CircleMinus;":"⊖","&CirclePlus;":"⊕","&CircleTimes;":"⊗","&ClockwiseContourIntegral;":"∲","&CloseCurlyDoubleQuote;":"”","&CloseCurlyQuote;":"’","&Colon;":"∷","&Colone;":"⩴","&Congruent;":"≡","&Conint;":"∯","&ContourIntegral;":"∮","&Copf;":"ℂ","&Coproduct;":"∐","&CounterClockwiseContourIntegral;":"∳","&Cross;":"⨯","&Cscr;":"𝒞","&Cup;":"⋓","&CupCap;":"≍","&DD;":"ⅅ","&DDotrahd;":"⤑","&DJcy;":"Ђ","&DScy;":"Ѕ","&DZcy;":"Џ","&Dagger;":"‡","&Darr;":"↡","&Dashv;":"⫤","&Dcaron;":"Ď","&Dcy;":"Д","&Del;":"∇","&Delta;":"Δ","&Dfr;":"𝔇","&DiacriticalAcute;":"´","&DiacriticalDot;":"˙","&DiacriticalDoubleAcute;":"˝","&DiacriticalGrave;":"`","&DiacriticalTilde;":"˜","&Diamond;":"⋄","&DifferentialD;":"ⅆ","&Dopf;":"𝔻","&Dot;":"¨","&DotDot;":"⃜","&DotEqual;":"≐","&DoubleContourIntegral;":"∯","&DoubleDot;":"¨","&DoubleDownArrow;":"⇓","&DoubleLeftArrow;":"⇐","&DoubleLeftRightArrow;":"⇔","&DoubleLeftTee;":"⫤","&DoubleLongLeftArrow;":"⟸","&DoubleLongLeftRightArrow;":"⟺","&DoubleLongRightArrow;":"⟹","&DoubleRightArrow;":"⇒","&DoubleRightTee;":"⊨","&DoubleUpArrow;":"⇑","&DoubleUpDownArrow;":"⇕","&DoubleVerticalBar;":"∥","&DownArrow;":"↓","&DownArrowBar;":"⤓","&DownArrowUpArrow;":"⇵","&DownBreve;":"̑","&DownLeftRightVector;":"⥐","&DownLeftTeeVector;":"⥞","&DownLeftVector;":"↽","&DownLeftVectorBar;":"⥖","&DownRightTeeVector;":"⥟","&DownRightVector;":"⇁","&DownRightVectorBar;":"⥗","&DownTee;":"⊤","&DownTeeArrow;":"↧","&Downarrow;":"⇓","&Dscr;":"𝒟","&Dstrok;":"Đ","&ENG;":"Ŋ","&ETH":"Ð","&ETH;":"Ð","&Eacute":"É","&Eacute;":"É","&Ecaron;":"Ě","&Ecirc":"Ê","&Ecirc;":"Ê","&Ecy;":"Э","&Edot;":"Ė","&Efr;":"𝔈","&Egrave":"È","&Egrave;":"È","&Element;":"∈","&Emacr;":"Ē","&EmptySmallSquare;":"◻","&EmptyVerySmallSquare;":"▫","&Eogon;":"Ę","&Eopf;":"𝔼","&Epsilon;":"Ε","&Equal;":"⩵","&EqualTilde;":"≂","&Equilibrium;":"⇌","&Escr;":"ℰ","&Esim;":"⩳","&Eta;":"Η","&Euml":"Ë","&Euml;":"Ë","&Exists;":"∃","&ExponentialE;":"ⅇ","&Fcy;":"Ф","&Ffr;":"𝔉","&FilledSmallSquare;":"◼","&FilledVerySmallSquare;":"▪","&Fopf;":"𝔽","&ForAll;":"∀","&Fouriertrf;":"ℱ","&Fscr;":"ℱ","&GJcy;":"Ѓ","&GT":">","&GT;":">","&Gamma;":"Γ","&Gammad;":"Ϝ","&Gbreve;":"Ğ","&Gcedil;":"Ģ","&Gcirc;":"Ĝ","&Gcy;":"Г","&Gdot;":"Ġ","&Gfr;":"𝔊","&Gg;":"⋙","&Gopf;":"𝔾","&GreaterEqual;":"≥","&GreaterEqualLess;":"⋛","&GreaterFullEqual;":"≧","&GreaterGreater;":"⪢","&GreaterLess;":"≷","&GreaterSlantEqual;":"⩾","&GreaterTilde;":"≳","&Gscr;":"𝒢","&Gt;":"≫","&HARDcy;":"Ъ","&Hacek;":"ˇ","&Hat;":"^","&Hcirc;":"Ĥ","&Hfr;":"ℌ","&HilbertSpace;":"ℋ","&Hopf;":"ℍ","&HorizontalLine;":"─","&Hscr;":"ℋ","&Hstrok;":"Ħ","&HumpDownHump;":"≎","&HumpEqual;":"≏","&IEcy;":"Е","&IJlig;":"Ĳ","&IOcy;":"Ё","&Iacute":"Í","&Iacute;":"Í","&Icirc":"Î","&Icirc;":"Î","&Icy;":"И","&Idot;":"İ","&Ifr;":"ℑ","&Igrave":"Ì","&Igrave;":"Ì","&Im;":"ℑ","&Imacr;":"Ī","&ImaginaryI;":"ⅈ","&Implies;":"⇒","&Int;":"∬","&Integral;":"∫","&Intersection;":"⋂","&InvisibleComma;":"⁣","&InvisibleTimes;":"⁢","&Iogon;":"Į","&Iopf;":"𝕀","&Iota;":"Ι","&Iscr;":"ℐ","&Itilde;":"Ĩ","&Iukcy;":"І","&Iuml":"Ï","&Iuml;":"Ï","&Jcirc;":"Ĵ","&Jcy;":"Й","&Jfr;":"𝔍","&Jopf;":"𝕁","&Jscr;":"𝒥","&Jsercy;":"Ј","&Jukcy;":"Є","&KHcy;":"Х","&KJcy;":"Ќ","&Kappa;":"Κ","&Kcedil;":"Ķ","&Kcy;":"К","&Kfr;":"𝔎","&Kopf;":"𝕂","&Kscr;":"𝒦","&LJcy;":"Љ","&LT":"<","&LT;":"<","&Lacute;":"Ĺ","&Lambda;":"Λ","&Lang;":"⟪","&Laplacetrf;":"ℒ","&Larr;":"↞","&Lcaron;":"Ľ","&Lcedil;":"Ļ","&Lcy;":"Л","&LeftAngleBracket;":"⟨","&LeftArrow;":"←","&LeftArrowBar;":"⇤","&LeftArrowRightArrow;":"⇆","&LeftCeiling;":"⌈","&LeftDoubleBracket;":"⟦","&LeftDownTeeVector;":"⥡","&LeftDownVector;":"⇃","&LeftDownVectorBar;":"⥙","&LeftFloor;":"⌊","&LeftRightArrow;":"↔","&LeftRightVector;":"⥎","&LeftTee;":"⊣","&LeftTeeArrow;":"↤","&LeftTeeVector;":"⥚","&LeftTriangle;":"⊲","&LeftTriangleBar;":"⧏","&LeftTriangleEqual;":"⊴","&LeftUpDownVector;":"⥑","&LeftUpTeeVector;":"⥠","&LeftUpVector;":"↿","&LeftUpVectorBar;":"⥘","&LeftVector;":"↼","&LeftVectorBar;":"⥒","&Leftarrow;":"⇐","&Leftrightarrow;":"⇔","&LessEqualGreater;":"⋚","&LessFullEqual;":"≦","&LessGreater;":"≶","&LessLess;":"⪡","&LessSlantEqual;":"⩽","&LessTilde;":"≲","&Lfr;":"𝔏","&Ll;":"⋘","&Lleftarrow;":"⇚","&Lmidot;":"Ŀ","&LongLeftArrow;":"⟵","&LongLeftRightArrow;":"⟷","&LongRightArrow;":"⟶","&Longleftarrow;":"⟸","&Longleftrightarrow;":"⟺","&Longrightarrow;":"⟹","&Lopf;":"𝕃","&LowerLeftArrow;":"↙","&LowerRightArrow;":"↘","&Lscr;":"ℒ","&Lsh;":"↰","&Lstrok;":"Ł","&Lt;":"≪","&Map;":"⤅","&Mcy;":"М","&MediumSpace;":" ","&Mellintrf;":"ℳ","&Mfr;":"𝔐","&MinusPlus;":"∓","&Mopf;":"𝕄","&Mscr;":"ℳ","&Mu;":"Μ","&NJcy;":"Њ","&Nacute;":"Ń","&Ncaron;":"Ň","&Ncedil;":"Ņ","&Ncy;":"Н","&NegativeMediumSpace;":"​","&NegativeThickSpace;":"​","&NegativeThinSpace;":"​","&NegativeVeryThinSpace;":"​","&NestedGreaterGreater;":"≫","&NestedLessLess;":"≪","&NewLine;":"\n","&Nfr;":"𝔑","&NoBreak;":"⁠","&NonBreakingSpace;":" ","&Nopf;":"ℕ","&Not;":"⫬","&NotCongruent;":"≢","&NotCupCap;":"≭","&NotDoubleVerticalBar;":"∦","&NotElement;":"∉","&NotEqual;":"≠","&NotEqualTilde;":"≂̸","&NotExists;":"∄","&NotGreater;":"≯","&NotGreaterEqual;":"≱","&NotGreaterFullEqual;":"≧̸","&NotGreaterGreater;":"≫̸","&NotGreaterLess;":"≹","&NotGreaterSlantEqual;":"⩾̸","&NotGreaterTilde;":"≵","&NotHumpDownHump;":"≎̸","&NotHumpEqual;":"≏̸","&NotLeftTriangle;":"⋪","&NotLeftTriangleBar;":"⧏̸","&NotLeftTriangleEqual;":"⋬","&NotLess;":"≮","&NotLessEqual;":"≰","&NotLessGreater;":"≸","&NotLessLess;":"≪̸","&NotLessSlantEqual;":"⩽̸","&NotLessTilde;":"≴","&NotNestedGreaterGreater;":"⪢̸","&NotNestedLessLess;":"⪡̸","&NotPrecedes;":"⊀","&NotPrecedesEqual;":"⪯̸","&NotPrecedesSlantEqual;":"⋠","&NotReverseElement;":"∌","&NotRightTriangle;":"⋫","&NotRightTriangleBar;":"⧐̸","&NotRightTriangleEqual;":"⋭","&NotSquareSubset;":"⊏̸","&NotSquareSubsetEqual;":"⋢","&NotSquareSuperset;":"⊐̸","&NotSquareSupersetEqual;":"⋣","&NotSubset;":"⊂⃒","&NotSubsetEqual;":"⊈","&NotSucceeds;":"⊁","&NotSucceedsEqual;":"⪰̸","&NotSucceedsSlantEqual;":"⋡","&NotSucceedsTilde;":"≿̸","&NotSuperset;":"⊃⃒","&NotSupersetEqual;":"⊉","&NotTilde;":"≁","&NotTildeEqual;":"≄","&NotTildeFullEqual;":"≇","&NotTildeTilde;":"≉","&NotVerticalBar;":"∤","&Nscr;":"𝒩","&Ntilde":"Ñ","&Ntilde;":"Ñ","&Nu;":"Ν","&OElig;":"Œ","&Oacute":"Ó","&Oacute;":"Ó","&Ocirc":"Ô","&Ocirc;":"Ô","&Ocy;":"О","&Odblac;":"Ő","&Ofr;":"𝔒","&Ograve":"Ò","&Ograve;":"Ò","&Omacr;":"Ō","&Omega;":"Ω","&Omicron;":"Ο","&Oopf;":"𝕆","&OpenCurlyDoubleQuote;":"“","&OpenCurlyQuote;":"‘","&Or;":"⩔","&Oscr;":"𝒪","&Oslash":"Ø","&Oslash;":"Ø","&Otilde":"Õ","&Otilde;":"Õ","&Otimes;":"⨷","&Ouml":"Ö","&Ouml;":"Ö","&OverBar;":"‾","&OverBrace;":"⏞","&OverBracket;":"⎴","&OverParenthesis;":"⏜","&PartialD;":"∂","&Pcy;":"П","&Pfr;":"𝔓","&Phi;":"Φ","&Pi;":"Π","&PlusMinus;":"±","&Poincareplane;":"ℌ","&Popf;":"ℙ","&Pr;":"⪻","&Precedes;":"≺","&PrecedesEqual;":"⪯","&PrecedesSlantEqual;":"≼","&PrecedesTilde;":"≾","&Prime;":"″","&Product;":"∏","&Proportion;":"∷","&Proportional;":"∝","&Pscr;":"𝒫","&Psi;":"Ψ","&QUOT":'"',"&QUOT;":'"',"&Qfr;":"𝔔","&Qopf;":"ℚ","&Qscr;":"𝒬","&RBarr;":"⤐","&REG":"®","&REG;":"®","&Racute;":"Ŕ","&Rang;":"⟫","&Rarr;":"↠","&Rarrtl;":"⤖","&Rcaron;":"Ř","&Rcedil;":"Ŗ","&Rcy;":"Р","&Re;":"ℜ","&ReverseElement;":"∋","&ReverseEquilibrium;":"⇋","&ReverseUpEquilibrium;":"⥯","&Rfr;":"ℜ","&Rho;":"Ρ","&RightAngleBracket;":"⟩","&RightArrow;":"→","&RightArrowBar;":"⇥","&RightArrowLeftArrow;":"⇄","&RightCeiling;":"⌉","&RightDoubleBracket;":"⟧","&RightDownTeeVector;":"⥝","&RightDownVector;":"⇂","&RightDownVectorBar;":"⥕","&RightFloor;":"⌋","&RightTee;":"⊢","&RightTeeArrow;":"↦","&RightTeeVector;":"⥛","&RightTriangle;":"⊳","&RightTriangleBar;":"⧐","&RightTriangleEqual;":"⊵","&RightUpDownVector;":"⥏","&RightUpTeeVector;":"⥜","&RightUpVector;":"↾","&RightUpVectorBar;":"⥔","&RightVector;":"⇀","&RightVectorBar;":"⥓","&Rightarrow;":"⇒","&Ropf;":"ℝ","&RoundImplies;":"⥰","&Rrightarrow;":"⇛","&Rscr;":"ℛ","&Rsh;":"↱","&RuleDelayed;":"⧴","&SHCHcy;":"Щ","&SHcy;":"Ш","&SOFTcy;":"Ь","&Sacute;":"Ś","&Sc;":"⪼","&Scaron;":"Š","&Scedil;":"Ş","&Scirc;":"Ŝ","&Scy;":"С","&Sfr;":"𝔖","&ShortDownArrow;":"↓","&ShortLeftArrow;":"←","&ShortRightArrow;":"→","&ShortUpArrow;":"↑","&Sigma;":"Σ","&SmallCircle;":"∘","&Sopf;":"𝕊","&Sqrt;":"√","&Square;":"□","&SquareIntersection;":"⊓","&SquareSubset;":"⊏","&SquareSubsetEqual;":"⊑","&SquareSuperset;":"⊐","&SquareSupersetEqual;":"⊒","&SquareUnion;":"⊔","&Sscr;":"𝒮","&Star;":"⋆","&Sub;":"⋐","&Subset;":"⋐","&SubsetEqual;":"⊆","&Succeeds;":"≻","&SucceedsEqual;":"⪰","&SucceedsSlantEqual;":"≽","&SucceedsTilde;":"≿","&SuchThat;":"∋","&Sum;":"∑","&Sup;":"⋑","&Superset;":"⊃","&SupersetEqual;":"⊇","&Supset;":"⋑","&THORN":"Þ","&THORN;":"Þ","&TRADE;":"™","&TSHcy;":"Ћ","&TScy;":"Ц","&Tab;":"\t","&Tau;":"Τ","&Tcaron;":"Ť","&Tcedil;":"Ţ","&Tcy;":"Т","&Tfr;":"𝔗","&Therefore;":"∴","&Theta;":"Θ","&ThickSpace;":"  ","&ThinSpace;":" ","&Tilde;":"∼","&TildeEqual;":"≃","&TildeFullEqual;":"≅","&TildeTilde;":"≈","&Topf;":"𝕋","&TripleDot;":"⃛","&Tscr;":"𝒯","&Tstrok;":"Ŧ","&Uacute":"Ú","&Uacute;":"Ú","&Uarr;":"↟","&Uarrocir;":"⥉","&Ubrcy;":"Ў","&Ubreve;":"Ŭ","&Ucirc":"Û","&Ucirc;":"Û","&Ucy;":"У","&Udblac;":"Ű","&Ufr;":"𝔘","&Ugrave":"Ù","&Ugrave;":"Ù","&Umacr;":"Ū","&UnderBar;":"_","&UnderBrace;":"⏟","&UnderBracket;":"⎵","&UnderParenthesis;":"⏝","&Union;":"⋃","&UnionPlus;":"⊎","&Uogon;":"Ų","&Uopf;":"𝕌","&UpArrow;":"↑","&UpArrowBar;":"⤒","&UpArrowDownArrow;":"⇅","&UpDownArrow;":"↕","&UpEquilibrium;":"⥮","&UpTee;":"⊥","&UpTeeArrow;":"↥","&Uparrow;":"⇑","&Updownarrow;":"⇕","&UpperLeftArrow;":"↖","&UpperRightArrow;":"↗","&Upsi;":"ϒ","&Upsilon;":"Υ","&Uring;":"Ů","&Uscr;":"𝒰","&Utilde;":"Ũ","&Uuml":"Ü","&Uuml;":"Ü","&VDash;":"⊫","&Vbar;":"⫫","&Vcy;":"В","&Vdash;":"⊩","&Vdashl;":"⫦","&Vee;":"⋁","&Verbar;":"‖","&Vert;":"‖","&VerticalBar;":"∣","&VerticalLine;":"|","&VerticalSeparator;":"❘","&VerticalTilde;":"≀","&VeryThinSpace;":" ","&Vfr;":"𝔙","&Vopf;":"𝕍","&Vscr;":"𝒱","&Vvdash;":"⊪","&Wcirc;":"Ŵ","&Wedge;":"⋀","&Wfr;":"𝔚","&Wopf;":"𝕎","&Wscr;":"𝒲","&Xfr;":"𝔛","&Xi;":"Ξ","&Xopf;":"𝕏","&Xscr;":"𝒳","&YAcy;":"Я","&YIcy;":"Ї","&YUcy;":"Ю","&Yacute":"Ý","&Yacute;":"Ý","&Ycirc;":"Ŷ","&Ycy;":"Ы","&Yfr;":"𝔜","&Yopf;":"𝕐","&Yscr;":"𝒴","&Yuml;":"Ÿ","&ZHcy;":"Ж","&Zacute;":"Ź","&Zcaron;":"Ž","&Zcy;":"З","&Zdot;":"Ż","&ZeroWidthSpace;":"​","&Zeta;":"Ζ","&Zfr;":"ℨ","&Zopf;":"ℤ","&Zscr;":"𝒵","&aacute":"á","&aacute;":"á","&abreve;":"ă","&ac;":"∾","&acE;":"∾̳","&acd;":"∿","&acirc":"â","&acirc;":"â","&acute":"´","&acute;":"´","&acy;":"а","&aelig":"æ","&aelig;":"æ","&af;":"⁡","&afr;":"𝔞","&agrave":"à","&agrave;":"à","&alefsym;":"ℵ","&aleph;":"ℵ","&alpha;":"α","&amacr;":"ā","&amalg;":"⨿","&amp":"&","&amp;":"&","&and;":"∧","&andand;":"⩕","&andd;":"⩜","&andslope;":"⩘","&andv;":"⩚","&ang;":"∠","&ange;":"⦤","&angle;":"∠","&angmsd;":"∡","&angmsdaa;":"⦨","&angmsdab;":"⦩","&angmsdac;":"⦪","&angmsdad;":"⦫","&angmsdae;":"⦬","&angmsdaf;":"⦭","&angmsdag;":"⦮","&angmsdah;":"⦯","&angrt;":"∟","&angrtvb;":"⊾","&angrtvbd;":"⦝","&angsph;":"∢","&angst;":"Å","&angzarr;":"⍼","&aogon;":"ą","&aopf;":"𝕒","&ap;":"≈","&apE;":"⩰","&apacir;":"⩯","&ape;":"≊","&apid;":"≋","&apos;":"'","&approx;":"≈","&approxeq;":"≊","&aring":"å","&aring;":"å","&ascr;":"𝒶","&ast;":"*","&asymp;":"≈","&asympeq;":"≍","&atilde":"ã","&atilde;":"ã","&auml":"ä","&auml;":"ä","&awconint;":"∳","&awint;":"⨑","&bNot;":"⫭","&backcong;":"≌","&backepsilon;":"϶","&backprime;":"‵","&backsim;":"∽","&backsimeq;":"⋍","&barvee;":"⊽","&barwed;":"⌅","&barwedge;":"⌅","&bbrk;":"⎵","&bbrktbrk;":"⎶","&bcong;":"≌","&bcy;":"б","&bdquo;":"„","&becaus;":"∵","&because;":"∵","&bemptyv;":"⦰","&bepsi;":"϶","&bernou;":"ℬ","&beta;":"β","&beth;":"ℶ","&between;":"≬","&bfr;":"𝔟","&bigcap;":"⋂","&bigcirc;":"◯","&bigcup;":"⋃","&bigodot;":"⨀","&bigoplus;":"⨁","&bigotimes;":"⨂","&bigsqcup;":"⨆","&bigstar;":"★","&bigtriangledown;":"▽","&bigtriangleup;":"△","&biguplus;":"⨄","&bigvee;":"⋁","&bigwedge;":"⋀","&bkarow;":"⤍","&blacklozenge;":"⧫","&blacksquare;":"▪","&blacktriangle;":"▴","&blacktriangledown;":"▾","&blacktriangleleft;":"◂","&blacktriangleright;":"▸","&blank;":"␣","&blk12;":"▒","&blk14;":"░","&blk34;":"▓","&block;":"█","&bne;":"=⃥","&bnequiv;":"≡⃥","&bnot;":"⌐","&bopf;":"𝕓","&bot;":"⊥","&bottom;":"⊥","&bowtie;":"⋈","&boxDL;":"╗","&boxDR;":"╔","&boxDl;":"╖","&boxDr;":"╓","&boxH;":"═","&boxHD;":"╦","&boxHU;":"╩","&boxHd;":"╤","&boxHu;":"╧","&boxUL;":"╝","&boxUR;":"╚","&boxUl;":"╜","&boxUr;":"╙","&boxV;":"║","&boxVH;":"╬","&boxVL;":"╣","&boxVR;":"╠","&boxVh;":"╫","&boxVl;":"╢","&boxVr;":"╟","&boxbox;":"⧉","&boxdL;":"╕","&boxdR;":"╒","&boxdl;":"┐","&boxdr;":"┌","&boxh;":"─","&boxhD;":"╥","&boxhU;":"╨","&boxhd;":"┬","&boxhu;":"┴","&boxminus;":"⊟","&boxplus;":"⊞","&boxtimes;":"⊠","&boxuL;":"╛","&boxuR;":"╘","&boxul;":"┘","&boxur;":"└","&boxv;":"│","&boxvH;":"╪","&boxvL;":"╡","&boxvR;":"╞","&boxvh;":"┼","&boxvl;":"┤","&boxvr;":"├","&bprime;":"‵","&breve;":"˘","&brvbar":"¦","&brvbar;":"¦","&bscr;":"𝒷","&bsemi;":"⁏","&bsim;":"∽","&bsime;":"⋍","&bsol;":"\\","&bsolb;":"⧅","&bsolhsub;":"⟈","&bull;":"•","&bullet;":"•","&bump;":"≎","&bumpE;":"⪮","&bumpe;":"≏","&bumpeq;":"≏","&cacute;":"ć","&cap;":"∩","&capand;":"⩄","&capbrcup;":"⩉","&capcap;":"⩋","&capcup;":"⩇","&capdot;":"⩀","&caps;":"∩︀","&caret;":"⁁","&caron;":"ˇ","&ccaps;":"⩍","&ccaron;":"č","&ccedil":"ç","&ccedil;":"ç","&ccirc;":"ĉ","&ccups;":"⩌","&ccupssm;":"⩐","&cdot;":"ċ","&cedil":"¸","&cedil;":"¸","&cemptyv;":"⦲","&cent":"¢","&cent;":"¢","&centerdot;":"·","&cfr;":"𝔠","&chcy;":"ч","&check;":"✓","&checkmark;":"✓","&chi;":"χ","&cir;":"○","&cirE;":"⧃","&circ;":"ˆ","&circeq;":"≗","&circlearrowleft;":"↺","&circlearrowright;":"↻","&circledR;":"®","&circledS;":"Ⓢ","&circledast;":"⊛","&circledcirc;":"⊚","&circleddash;":"⊝","&cire;":"≗","&cirfnint;":"⨐","&cirmid;":"⫯","&cirscir;":"⧂","&clubs;":"♣","&clubsuit;":"♣","&colon;":":","&colone;":"≔","&coloneq;":"≔","&comma;":",","&commat;":"@","&comp;":"∁","&compfn;":"∘","&complement;":"∁","&complexes;":"ℂ","&cong;":"≅","&congdot;":"⩭","&conint;":"∮","&copf;":"𝕔","&coprod;":"∐","&copy":"©","&copy;":"©","&copysr;":"℗","&crarr;":"↵","&cross;":"✗","&cscr;":"𝒸","&csub;":"⫏","&csube;":"⫑","&csup;":"⫐","&csupe;":"⫒","&ctdot;":"⋯","&cudarrl;":"⤸","&cudarrr;":"⤵","&cuepr;":"⋞","&cuesc;":"⋟","&cularr;":"↶","&cularrp;":"⤽","&cup;":"∪","&cupbrcap;":"⩈","&cupcap;":"⩆","&cupcup;":"⩊","&cupdot;":"⊍","&cupor;":"⩅","&cups;":"∪︀","&curarr;":"↷","&curarrm;":"⤼","&curlyeqprec;":"⋞","&curlyeqsucc;":"⋟","&curlyvee;":"⋎","&curlywedge;":"⋏","&curren":"¤","&curren;":"¤","&curvearrowleft;":"↶","&curvearrowright;":"↷","&cuvee;":"⋎","&cuwed;":"⋏","&cwconint;":"∲","&cwint;":"∱","&cylcty;":"⌭","&dArr;":"⇓","&dHar;":"⥥","&dagger;":"†","&daleth;":"ℸ","&darr;":"↓","&dash;":"‐","&dashv;":"⊣","&dbkarow;":"⤏","&dblac;":"˝","&dcaron;":"ď","&dcy;":"д","&dd;":"ⅆ","&ddagger;":"‡","&ddarr;":"⇊","&ddotseq;":"⩷","&deg":"°","&deg;":"°","&delta;":"δ","&demptyv;":"⦱","&dfisht;":"⥿","&dfr;":"𝔡","&dharl;":"⇃","&dharr;":"⇂","&diam;":"⋄","&diamond;":"⋄","&diamondsuit;":"♦","&diams;":"♦","&die;":"¨","&digamma;":"ϝ","&disin;":"⋲","&div;":"÷","&divide":"÷","&divide;":"÷","&divideontimes;":"⋇","&divonx;":"⋇","&djcy;":"ђ","&dlcorn;":"⌞","&dlcrop;":"⌍","&dollar;":"$","&dopf;":"𝕕","&dot;":"˙","&doteq;":"≐","&doteqdot;":"≑","&dotminus;":"∸","&dotplus;":"∔","&dotsquare;":"⊡","&doublebarwedge;":"⌆","&downarrow;":"↓","&downdownarrows;":"⇊","&downharpoonleft;":"⇃","&downharpoonright;":"⇂","&drbkarow;":"⤐","&drcorn;":"⌟","&drcrop;":"⌌","&dscr;":"𝒹","&dscy;":"ѕ","&dsol;":"⧶","&dstrok;":"đ","&dtdot;":"⋱","&dtri;":"▿","&dtrif;":"▾","&duarr;":"⇵","&duhar;":"⥯","&dwangle;":"⦦","&dzcy;":"џ","&dzigrarr;":"⟿","&eDDot;":"⩷","&eDot;":"≑","&eacute":"é","&eacute;":"é","&easter;":"⩮","&ecaron;":"ě","&ecir;":"≖","&ecirc":"ê","&ecirc;":"ê","&ecolon;":"≕","&ecy;":"э","&edot;":"ė","&ee;":"ⅇ","&efDot;":"≒","&efr;":"𝔢","&eg;":"⪚","&egrave":"è","&egrave;":"è","&egs;":"⪖","&egsdot;":"⪘","&el;":"⪙","&elinters;":"⏧","&ell;":"ℓ","&els;":"⪕","&elsdot;":"⪗","&emacr;":"ē","&empty;":"∅","&emptyset;":"∅","&emptyv;":"∅","&emsp13;":" ","&emsp14;":" ","&emsp;":" ","&eng;":"ŋ","&ensp;":" ","&eogon;":"ę","&eopf;":"𝕖","&epar;":"⋕","&eparsl;":"⧣","&eplus;":"⩱","&epsi;":"ε","&epsilon;":"ε","&epsiv;":"ϵ","&eqcirc;":"≖","&eqcolon;":"≕","&eqsim;":"≂","&eqslantgtr;":"⪖","&eqslantless;":"⪕","&equals;":"=","&equest;":"≟","&equiv;":"≡","&equivDD;":"⩸","&eqvparsl;":"⧥","&erDot;":"≓","&erarr;":"⥱","&escr;":"ℯ","&esdot;":"≐","&esim;":"≂","&eta;":"η","&eth":"ð","&eth;":"ð","&euml":"ë","&euml;":"ë","&euro;":"€","&excl;":"!","&exist;":"∃","&expectation;":"ℰ","&exponentiale;":"ⅇ","&fallingdotseq;":"≒","&fcy;":"ф","&female;":"♀","&ffilig;":"ﬃ","&fflig;":"ﬀ","&ffllig;":"ﬄ","&ffr;":"𝔣","&filig;":"ﬁ","&fjlig;":"fj","&flat;":"♭","&fllig;":"ﬂ","&fltns;":"▱","&fnof;":"ƒ","&fopf;":"𝕗","&forall;":"∀","&fork;":"⋔","&forkv;":"⫙","&fpartint;":"⨍","&frac12":"½","&frac12;":"½","&frac13;":"⅓","&frac14":"¼","&frac14;":"¼","&frac15;":"⅕","&frac16;":"⅙","&frac18;":"⅛","&frac23;":"⅔","&frac25;":"⅖","&frac34":"¾","&frac34;":"¾","&frac35;":"⅗","&frac38;":"⅜","&frac45;":"⅘","&frac56;":"⅚","&frac58;":"⅝","&frac78;":"⅞","&frasl;":"⁄","&frown;":"⌢","&fscr;":"𝒻","&gE;":"≧","&gEl;":"⪌","&gacute;":"ǵ","&gamma;":"γ","&gammad;":"ϝ","&gap;":"⪆","&gbreve;":"ğ","&gcirc;":"ĝ","&gcy;":"г","&gdot;":"ġ","&ge;":"≥","&gel;":"⋛","&geq;":"≥","&geqq;":"≧","&geqslant;":"⩾","&ges;":"⩾","&gescc;":"⪩","&gesdot;":"⪀","&gesdoto;":"⪂","&gesdotol;":"⪄","&gesl;":"⋛︀","&gesles;":"⪔","&gfr;":"𝔤","&gg;":"≫","&ggg;":"⋙","&gimel;":"ℷ","&gjcy;":"ѓ","&gl;":"≷","&glE;":"⪒","&gla;":"⪥","&glj;":"⪤","&gnE;":"≩","&gnap;":"⪊","&gnapprox;":"⪊","&gne;":"⪈","&gneq;":"⪈","&gneqq;":"≩","&gnsim;":"⋧","&gopf;":"𝕘","&grave;":"`","&gscr;":"ℊ","&gsim;":"≳","&gsime;":"⪎","&gsiml;":"⪐","&gt":">","&gt;":">","&gtcc;":"⪧","&gtcir;":"⩺","&gtdot;":"⋗","&gtlPar;":"⦕","&gtquest;":"⩼","&gtrapprox;":"⪆","&gtrarr;":"⥸","&gtrdot;":"⋗","&gtreqless;":"⋛","&gtreqqless;":"⪌","&gtrless;":"≷","&gtrsim;":"≳","&gvertneqq;":"≩︀","&gvnE;":"≩︀","&hArr;":"⇔","&hairsp;":" ","&half;":"½","&hamilt;":"ℋ","&hardcy;":"ъ","&harr;":"↔","&harrcir;":"⥈","&harrw;":"↭","&hbar;":"ℏ","&hcirc;":"ĥ","&hearts;":"♥","&heartsuit;":"♥","&hellip;":"…","&hercon;":"⊹","&hfr;":"𝔥","&hksearow;":"⤥","&hkswarow;":"⤦","&hoarr;":"⇿","&homtht;":"∻","&hookleftarrow;":"↩","&hookrightarrow;":"↪","&hopf;":"𝕙","&horbar;":"―","&hscr;":"𝒽","&hslash;":"ℏ","&hstrok;":"ħ","&hybull;":"⁃","&hyphen;":"‐","&iacute":"í","&iacute;":"í","&ic;":"⁣","&icirc":"î","&icirc;":"î","&icy;":"и","&iecy;":"е","&iexcl":"¡","&iexcl;":"¡","&iff;":"⇔","&ifr;":"𝔦","&igrave":"ì","&igrave;":"ì","&ii;":"ⅈ","&iiiint;":"⨌","&iiint;":"∭","&iinfin;":"⧜","&iiota;":"℩","&ijlig;":"ĳ","&imacr;":"ī","&image;":"ℑ","&imagline;":"ℐ","&imagpart;":"ℑ","&imath;":"ı","&imof;":"⊷","&imped;":"Ƶ","&in;":"∈","&incare;":"℅","&infin;":"∞","&infintie;":"⧝","&inodot;":"ı","&int;":"∫","&intcal;":"⊺","&integers;":"ℤ","&intercal;":"⊺","&intlarhk;":"⨗","&intprod;":"⨼","&iocy;":"ё","&iogon;":"į","&iopf;":"𝕚","&iota;":"ι","&iprod;":"⨼","&iquest":"¿","&iquest;":"¿","&iscr;":"𝒾","&isin;":"∈","&isinE;":"⋹","&isindot;":"⋵","&isins;":"⋴","&isinsv;":"⋳","&isinv;":"∈","&it;":"⁢","&itilde;":"ĩ","&iukcy;":"і","&iuml":"ï","&iuml;":"ï","&jcirc;":"ĵ","&jcy;":"й","&jfr;":"𝔧","&jmath;":"ȷ","&jopf;":"𝕛","&jscr;":"𝒿","&jsercy;":"ј","&jukcy;":"є","&kappa;":"κ","&kappav;":"ϰ","&kcedil;":"ķ","&kcy;":"к","&kfr;":"𝔨","&kgreen;":"ĸ","&khcy;":"х","&kjcy;":"ќ","&kopf;":"𝕜","&kscr;":"𝓀","&lAarr;":"⇚","&lArr;":"⇐","&lAtail;":"⤛","&lBarr;":"⤎","&lE;":"≦","&lEg;":"⪋","&lHar;":"⥢","&lacute;":"ĺ","&laemptyv;":"⦴","&lagran;":"ℒ","&lambda;":"λ","&lang;":"⟨","&langd;":"⦑","&langle;":"⟨","&lap;":"⪅","&laquo":"«","&laquo;":"«","&larr;":"←","&larrb;":"⇤","&larrbfs;":"⤟","&larrfs;":"⤝","&larrhk;":"↩","&larrlp;":"↫","&larrpl;":"⤹","&larrsim;":"⥳","&larrtl;":"↢","&lat;":"⪫","&latail;":"⤙","&late;":"⪭","&lates;":"⪭︀","&lbarr;":"⤌","&lbbrk;":"❲","&lbrace;":"{","&lbrack;":"[","&lbrke;":"⦋","&lbrksld;":"⦏","&lbrkslu;":"⦍","&lcaron;":"ľ","&lcedil;":"ļ","&lceil;":"⌈","&lcub;":"{","&lcy;":"л","&ldca;":"⤶","&ldquo;":"“","&ldquor;":"„","&ldrdhar;":"⥧","&ldrushar;":"⥋","&ldsh;":"↲","&le;":"≤","&leftarrow;":"←","&leftarrowtail;":"↢","&leftharpoondown;":"↽","&leftharpoonup;":"↼","&leftleftarrows;":"⇇","&leftrightarrow;":"↔","&leftrightarrows;":"⇆","&leftrightharpoons;":"⇋","&leftrightsquigarrow;":"↭","&leftthreetimes;":"⋋","&leg;":"⋚","&leq;":"≤","&leqq;":"≦","&leqslant;":"⩽","&les;":"⩽","&lescc;":"⪨","&lesdot;":"⩿","&lesdoto;":"⪁","&lesdotor;":"⪃","&lesg;":"⋚︀","&lesges;":"⪓","&lessapprox;":"⪅","&lessdot;":"⋖","&lesseqgtr;":"⋚","&lesseqqgtr;":"⪋","&lessgtr;":"≶","&lesssim;":"≲","&lfisht;":"⥼","&lfloor;":"⌊","&lfr;":"𝔩","&lg;":"≶","&lgE;":"⪑","&lhard;":"↽","&lharu;":"↼","&lharul;":"⥪","&lhblk;":"▄","&ljcy;":"љ","&ll;":"≪","&llarr;":"⇇","&llcorner;":"⌞","&llhard;":"⥫","&lltri;":"◺","&lmidot;":"ŀ","&lmoust;":"⎰","&lmoustache;":"⎰","&lnE;":"≨","&lnap;":"⪉","&lnapprox;":"⪉","&lne;":"⪇","&lneq;":"⪇","&lneqq;":"≨","&lnsim;":"⋦","&loang;":"⟬","&loarr;":"⇽","&lobrk;":"⟦","&longleftarrow;":"⟵","&longleftrightarrow;":"⟷","&longmapsto;":"⟼","&longrightarrow;":"⟶","&looparrowleft;":"↫","&looparrowright;":"↬","&lopar;":"⦅","&lopf;":"𝕝","&loplus;":"⨭","&lotimes;":"⨴","&lowast;":"∗","&lowbar;":"_","&loz;":"◊","&lozenge;":"◊","&lozf;":"⧫","&lpar;":"(","&lparlt;":"⦓","&lrarr;":"⇆","&lrcorner;":"⌟","&lrhar;":"⇋","&lrhard;":"⥭","&lrm;":"‎","&lrtri;":"⊿","&lsaquo;":"‹","&lscr;":"𝓁","&lsh;":"↰","&lsim;":"≲","&lsime;":"⪍","&lsimg;":"⪏","&lsqb;":"[","&lsquo;":"‘","&lsquor;":"‚","&lstrok;":"ł","&lt":"<","&lt;":"<","&ltcc;":"⪦","&ltcir;":"⩹","&ltdot;":"⋖","&lthree;":"⋋","&ltimes;":"⋉","&ltlarr;":"⥶","&ltquest;":"⩻","&ltrPar;":"⦖","&ltri;":"◃","&ltrie;":"⊴","&ltrif;":"◂","&lurdshar;":"⥊","&luruhar;":"⥦","&lvertneqq;":"≨︀","&lvnE;":"≨︀","&mDDot;":"∺","&macr":"¯","&macr;":"¯","&male;":"♂","&malt;":"✠","&maltese;":"✠","&map;":"↦","&mapsto;":"↦","&mapstodown;":"↧","&mapstoleft;":"↤","&mapstoup;":"↥","&marker;":"▮","&mcomma;":"⨩","&mcy;":"м","&mdash;":"—","&measuredangle;":"∡","&mfr;":"𝔪","&mho;":"℧","&micro":"µ","&micro;":"µ","&mid;":"∣","&midast;":"*","&midcir;":"⫰","&middot":"·","&middot;":"·","&minus;":"−","&minusb;":"⊟","&minusd;":"∸","&minusdu;":"⨪","&mlcp;":"⫛","&mldr;":"…","&mnplus;":"∓","&models;":"⊧","&mopf;":"𝕞","&mp;":"∓","&mscr;":"𝓂","&mstpos;":"∾","&mu;":"μ","&multimap;":"⊸","&mumap;":"⊸","&nGg;":"⋙̸","&nGt;":"≫⃒","&nGtv;":"≫̸","&nLeftarrow;":"⇍","&nLeftrightarrow;":"⇎","&nLl;":"⋘̸","&nLt;":"≪⃒","&nLtv;":"≪̸","&nRightarrow;":"⇏","&nVDash;":"⊯","&nVdash;":"⊮","&nabla;":"∇","&nacute;":"ń","&nang;":"∠⃒","&nap;":"≉","&napE;":"⩰̸","&napid;":"≋̸","&napos;":"ŉ","&napprox;":"≉","&natur;":"♮","&natural;":"♮","&naturals;":"ℕ","&nbsp":" ","&nbsp;":" ","&nbump;":"≎̸","&nbumpe;":"≏̸","&ncap;":"⩃","&ncaron;":"ň","&ncedil;":"ņ","&ncong;":"≇","&ncongdot;":"⩭̸","&ncup;":"⩂","&ncy;":"н","&ndash;":"–","&ne;":"≠","&neArr;":"⇗","&nearhk;":"⤤","&nearr;":"↗","&nearrow;":"↗","&nedot;":"≐̸","&nequiv;":"≢","&nesear;":"⤨","&nesim;":"≂̸","&nexist;":"∄","&nexists;":"∄","&nfr;":"𝔫","&ngE;":"≧̸","&nge;":"≱","&ngeq;":"≱","&ngeqq;":"≧̸","&ngeqslant;":"⩾̸","&nges;":"⩾̸","&ngsim;":"≵","&ngt;":"≯","&ngtr;":"≯","&nhArr;":"⇎","&nharr;":"↮","&nhpar;":"⫲","&ni;":"∋","&nis;":"⋼","&nisd;":"⋺","&niv;":"∋","&njcy;":"њ","&nlArr;":"⇍","&nlE;":"≦̸","&nlarr;":"↚","&nldr;":"‥","&nle;":"≰","&nleftarrow;":"↚","&nleftrightarrow;":"↮","&nleq;":"≰","&nleqq;":"≦̸","&nleqslant;":"⩽̸","&nles;":"⩽̸","&nless;":"≮","&nlsim;":"≴","&nlt;":"≮","&nltri;":"⋪","&nltrie;":"⋬","&nmid;":"∤","&nopf;":"𝕟","&not":"¬","&not;":"¬","&notin;":"∉","&notinE;":"⋹̸","&notindot;":"⋵̸","&notinva;":"∉","&notinvb;":"⋷","&notinvc;":"⋶","&notni;":"∌","&notniva;":"∌","&notnivb;":"⋾","&notnivc;":"⋽","&npar;":"∦","&nparallel;":"∦","&nparsl;":"⫽⃥","&npart;":"∂̸","&npolint;":"⨔","&npr;":"⊀","&nprcue;":"⋠","&npre;":"⪯̸","&nprec;":"⊀","&npreceq;":"⪯̸","&nrArr;":"⇏","&nrarr;":"↛","&nrarrc;":"⤳̸","&nrarrw;":"↝̸","&nrightarrow;":"↛","&nrtri;":"⋫","&nrtrie;":"⋭","&nsc;":"⊁","&nsccue;":"⋡","&nsce;":"⪰̸","&nscr;":"𝓃","&nshortmid;":"∤","&nshortparallel;":"∦","&nsim;":"≁","&nsime;":"≄","&nsimeq;":"≄","&nsmid;":"∤","&nspar;":"∦","&nsqsube;":"⋢","&nsqsupe;":"⋣","&nsub;":"⊄","&nsubE;":"⫅̸","&nsube;":"⊈","&nsubset;":"⊂⃒","&nsubseteq;":"⊈","&nsubseteqq;":"⫅̸","&nsucc;":"⊁","&nsucceq;":"⪰̸","&nsup;":"⊅","&nsupE;":"⫆̸","&nsupe;":"⊉","&nsupset;":"⊃⃒","&nsupseteq;":"⊉","&nsupseteqq;":"⫆̸","&ntgl;":"≹","&ntilde":"ñ","&ntilde;":"ñ","&ntlg;":"≸","&ntriangleleft;":"⋪","&ntrianglelefteq;":"⋬","&ntriangleright;":"⋫","&ntrianglerighteq;":"⋭","&nu;":"ν","&num;":"#","&numero;":"№","&numsp;":" ","&nvDash;":"⊭","&nvHarr;":"⤄","&nvap;":"≍⃒","&nvdash;":"⊬","&nvge;":"≥⃒","&nvgt;":">⃒","&nvinfin;":"⧞","&nvlArr;":"⤂","&nvle;":"≤⃒","&nvlt;":"<⃒","&nvltrie;":"⊴⃒","&nvrArr;":"⤃","&nvrtrie;":"⊵⃒","&nvsim;":"∼⃒","&nwArr;":"⇖","&nwarhk;":"⤣","&nwarr;":"↖","&nwarrow;":"↖","&nwnear;":"⤧","&oS;":"Ⓢ","&oacute":"ó","&oacute;":"ó","&oast;":"⊛","&ocir;":"⊚","&ocirc":"ô","&ocirc;":"ô","&ocy;":"о","&odash;":"⊝","&odblac;":"ő","&odiv;":"⨸","&odot;":"⊙","&odsold;":"⦼","&oelig;":"œ","&ofcir;":"⦿","&ofr;":"𝔬","&ogon;":"˛","&ograve":"ò","&ograve;":"ò","&ogt;":"⧁","&ohbar;":"⦵","&ohm;":"Ω","&oint;":"∮","&olarr;":"↺","&olcir;":"⦾","&olcross;":"⦻","&oline;":"‾","&olt;":"⧀","&omacr;":"ō","&omega;":"ω","&omicron;":"ο","&omid;":"⦶","&ominus;":"⊖","&oopf;":"𝕠","&opar;":"⦷","&operp;":"⦹","&oplus;":"⊕","&or;":"∨","&orarr;":"↻","&ord;":"⩝","&order;":"ℴ","&orderof;":"ℴ","&ordf":"ª","&ordf;":"ª","&ordm":"º","&ordm;":"º","&origof;":"⊶","&oror;":"⩖","&orslope;":"⩗","&orv;":"⩛","&oscr;":"ℴ","&oslash":"ø","&oslash;":"ø","&osol;":"⊘","&otilde":"õ","&otilde;":"õ","&otimes;":"⊗","&otimesas;":"⨶","&ouml":"ö","&ouml;":"ö","&ovbar;":"⌽","&par;":"∥","&para":"¶","&para;":"¶","&parallel;":"∥","&parsim;":"⫳","&parsl;":"⫽","&part;":"∂","&pcy;":"п","&percnt;":"%","&period;":".","&permil;":"‰","&perp;":"⊥","&pertenk;":"‱","&pfr;":"𝔭","&phi;":"φ","&phiv;":"ϕ","&phmmat;":"ℳ","&phone;":"☎","&pi;":"π","&pitchfork;":"⋔","&piv;":"ϖ","&planck;":"ℏ","&planckh;":"ℎ","&plankv;":"ℏ","&plus;":"+","&plusacir;":"⨣","&plusb;":"⊞","&pluscir;":"⨢","&plusdo;":"∔","&plusdu;":"⨥","&pluse;":"⩲","&plusmn":"±","&plusmn;":"±","&plussim;":"⨦","&plustwo;":"⨧","&pm;":"±","&pointint;":"⨕","&popf;":"𝕡","&pound":"£","&pound;":"£","&pr;":"≺","&prE;":"⪳","&prap;":"⪷","&prcue;":"≼","&pre;":"⪯","&prec;":"≺","&precapprox;":"⪷","&preccurlyeq;":"≼","&preceq;":"⪯","&precnapprox;":"⪹","&precneqq;":"⪵","&precnsim;":"⋨","&precsim;":"≾","&prime;":"′","&primes;":"ℙ","&prnE;":"⪵","&prnap;":"⪹","&prnsim;":"⋨","&prod;":"∏","&profalar;":"⌮","&profline;":"⌒","&profsurf;":"⌓","&prop;":"∝","&propto;":"∝","&prsim;":"≾","&prurel;":"⊰","&pscr;":"𝓅","&psi;":"ψ","&puncsp;":" ","&qfr;":"𝔮","&qint;":"⨌","&qopf;":"𝕢","&qprime;":"⁗","&qscr;":"𝓆","&quaternions;":"ℍ","&quatint;":"⨖","&quest;":"?","&questeq;":"≟","&quot":'"',"&quot;":'"',"&rAarr;":"⇛","&rArr;":"⇒","&rAtail;":"⤜","&rBarr;":"⤏","&rHar;":"⥤","&race;":"∽̱","&racute;":"ŕ","&radic;":"√","&raemptyv;":"⦳","&rang;":"⟩","&rangd;":"⦒","&range;":"⦥","&rangle;":"⟩","&raquo":"»","&raquo;":"»","&rarr;":"→","&rarrap;":"⥵","&rarrb;":"⇥","&rarrbfs;":"⤠","&rarrc;":"⤳","&rarrfs;":"⤞","&rarrhk;":"↪","&rarrlp;":"↬","&rarrpl;":"⥅","&rarrsim;":"⥴","&rarrtl;":"↣","&rarrw;":"↝","&ratail;":"⤚","&ratio;":"∶","&rationals;":"ℚ","&rbarr;":"⤍","&rbbrk;":"❳","&rbrace;":"}","&rbrack;":"]","&rbrke;":"⦌","&rbrksld;":"⦎","&rbrkslu;":"⦐","&rcaron;":"ř","&rcedil;":"ŗ","&rceil;":"⌉","&rcub;":"}","&rcy;":"р","&rdca;":"⤷","&rdldhar;":"⥩","&rdquo;":"”","&rdquor;":"”","&rdsh;":"↳","&real;":"ℜ","&realine;":"ℛ","&realpart;":"ℜ","&reals;":"ℝ","&rect;":"▭","&reg":"®","&reg;":"®","&rfisht;":"⥽","&rfloor;":"⌋","&rfr;":"𝔯","&rhard;":"⇁","&rharu;":"⇀","&rharul;":"⥬","&rho;":"ρ","&rhov;":"ϱ","&rightarrow;":"→","&rightarrowtail;":"↣","&rightharpoondown;":"⇁","&rightharpoonup;":"⇀","&rightleftarrows;":"⇄","&rightleftharpoons;":"⇌","&rightrightarrows;":"⇉","&rightsquigarrow;":"↝","&rightthreetimes;":"⋌","&ring;":"˚","&risingdotseq;":"≓","&rlarr;":"⇄","&rlhar;":"⇌","&rlm;":"‏","&rmoust;":"⎱","&rmoustache;":"⎱","&rnmid;":"⫮","&roang;":"⟭","&roarr;":"⇾","&robrk;":"⟧","&ropar;":"⦆","&ropf;":"𝕣","&roplus;":"⨮","&rotimes;":"⨵","&rpar;":")","&rpargt;":"⦔","&rppolint;":"⨒","&rrarr;":"⇉","&rsaquo;":"›","&rscr;":"𝓇","&rsh;":"↱","&rsqb;":"]","&rsquo;":"’","&rsquor;":"’","&rthree;":"⋌","&rtimes;":"⋊","&rtri;":"▹","&rtrie;":"⊵","&rtrif;":"▸","&rtriltri;":"⧎","&ruluhar;":"⥨","&rx;":"℞","&sacute;":"ś","&sbquo;":"‚","&sc;":"≻","&scE;":"⪴","&scap;":"⪸","&scaron;":"š","&sccue;":"≽","&sce;":"⪰","&scedil;":"ş","&scirc;":"ŝ","&scnE;":"⪶","&scnap;":"⪺","&scnsim;":"⋩","&scpolint;":"⨓","&scsim;":"≿","&scy;":"с","&sdot;":"⋅","&sdotb;":"⊡","&sdote;":"⩦","&seArr;":"⇘","&searhk;":"⤥","&searr;":"↘","&searrow;":"↘","&sect":"§","&sect;":"§","&semi;":";","&seswar;":"⤩","&setminus;":"∖","&setmn;":"∖","&sext;":"✶","&sfr;":"𝔰","&sfrown;":"⌢","&sharp;":"♯","&shchcy;":"щ","&shcy;":"ш","&shortmid;":"∣","&shortparallel;":"∥","&shy":"­","&shy;":"­","&sigma;":"σ","&sigmaf;":"ς","&sigmav;":"ς","&sim;":"∼","&simdot;":"⩪","&sime;":"≃","&simeq;":"≃","&simg;":"⪞","&simgE;":"⪠","&siml;":"⪝","&simlE;":"⪟","&simne;":"≆","&simplus;":"⨤","&simrarr;":"⥲","&slarr;":"←","&smallsetminus;":"∖","&smashp;":"⨳","&smeparsl;":"⧤","&smid;":"∣","&smile;":"⌣","&smt;":"⪪","&smte;":"⪬","&smtes;":"⪬︀","&softcy;":"ь","&sol;":"/","&solb;":"⧄","&solbar;":"⌿","&sopf;":"𝕤","&spades;":"♠","&spadesuit;":"♠","&spar;":"∥","&sqcap;":"⊓","&sqcaps;":"⊓︀","&sqcup;":"⊔","&sqcups;":"⊔︀","&sqsub;":"⊏","&sqsube;":"⊑","&sqsubset;":"⊏","&sqsubseteq;":"⊑","&sqsup;":"⊐","&sqsupe;":"⊒","&sqsupset;":"⊐","&sqsupseteq;":"⊒","&squ;":"□","&square;":"□","&squarf;":"▪","&squf;":"▪","&srarr;":"→","&sscr;":"𝓈","&ssetmn;":"∖","&ssmile;":"⌣","&sstarf;":"⋆","&star;":"☆","&starf;":"★","&straightepsilon;":"ϵ","&straightphi;":"ϕ","&strns;":"¯","&sub;":"⊂","&subE;":"⫅","&subdot;":"⪽","&sube;":"⊆","&subedot;":"⫃","&submult;":"⫁","&subnE;":"⫋","&subne;":"⊊","&subplus;":"⪿","&subrarr;":"⥹","&subset;":"⊂","&subseteq;":"⊆","&subseteqq;":"⫅","&subsetneq;":"⊊","&subsetneqq;":"⫋","&subsim;":"⫇","&subsub;":"⫕","&subsup;":"⫓","&succ;":"≻","&succapprox;":"⪸","&succcurlyeq;":"≽","&succeq;":"⪰","&succnapprox;":"⪺","&succneqq;":"⪶","&succnsim;":"⋩","&succsim;":"≿","&sum;":"∑","&sung;":"♪","&sup1":"¹","&sup1;":"¹","&sup2":"²","&sup2;":"²","&sup3":"³","&sup3;":"³","&sup;":"⊃","&supE;":"⫆","&supdot;":"⪾","&supdsub;":"⫘","&supe;":"⊇","&supedot;":"⫄","&suphsol;":"⟉","&suphsub;":"⫗","&suplarr;":"⥻","&supmult;":"⫂","&supnE;":"⫌","&supne;":"⊋","&supplus;":"⫀","&supset;":"⊃","&supseteq;":"⊇","&supseteqq;":"⫆","&supsetneq;":"⊋","&supsetneqq;":"⫌","&supsim;":"⫈","&supsub;":"⫔","&supsup;":"⫖","&swArr;":"⇙","&swarhk;":"⤦","&swarr;":"↙","&swarrow;":"↙","&swnwar;":"⤪","&szlig":"ß","&szlig;":"ß","&target;":"⌖","&tau;":"τ","&tbrk;":"⎴","&tcaron;":"ť","&tcedil;":"ţ","&tcy;":"т","&tdot;":"⃛","&telrec;":"⌕","&tfr;":"𝔱","&there4;":"∴","&therefore;":"∴","&theta;":"θ","&thetasym;":"ϑ","&thetav;":"ϑ","&thickapprox;":"≈","&thicksim;":"∼","&thinsp;":" ","&thkap;":"≈","&thksim;":"∼","&thorn":"þ","&thorn;":"þ","&tilde;":"˜","&times":"×","&times;":"×","&timesb;":"⊠","&timesbar;":"⨱","&timesd;":"⨰","&tint;":"∭","&toea;":"⤨","&top;":"⊤","&topbot;":"⌶","&topcir;":"⫱","&topf;":"𝕥","&topfork;":"⫚","&tosa;":"⤩","&tprime;":"‴","&trade;":"™","&triangle;":"▵","&triangledown;":"▿","&triangleleft;":"◃","&trianglelefteq;":"⊴","&triangleq;":"≜","&triangleright;":"▹","&trianglerighteq;":"⊵","&tridot;":"◬","&trie;":"≜","&triminus;":"⨺","&triplus;":"⨹","&trisb;":"⧍","&tritime;":"⨻","&trpezium;":"⏢","&tscr;":"𝓉","&tscy;":"ц","&tshcy;":"ћ","&tstrok;":"ŧ","&twixt;":"≬","&twoheadleftarrow;":"↞","&twoheadrightarrow;":"↠","&uArr;":"⇑","&uHar;":"⥣","&uacute":"ú","&uacute;":"ú","&uarr;":"↑","&ubrcy;":"ў","&ubreve;":"ŭ","&ucirc":"û","&ucirc;":"û","&ucy;":"у","&udarr;":"⇅","&udblac;":"ű","&udhar;":"⥮","&ufisht;":"⥾","&ufr;":"𝔲","&ugrave":"ù","&ugrave;":"ù","&uharl;":"↿","&uharr;":"↾","&uhblk;":"▀","&ulcorn;":"⌜","&ulcorner;":"⌜","&ulcrop;":"⌏","&ultri;":"◸","&umacr;":"ū","&uml":"¨","&uml;":"¨","&uogon;":"ų","&uopf;":"𝕦","&uparrow;":"↑","&updownarrow;":"↕","&upharpoonleft;":"↿","&upharpoonright;":"↾","&uplus;":"⊎","&upsi;":"υ","&upsih;":"ϒ","&upsilon;":"υ","&upuparrows;":"⇈","&urcorn;":"⌝","&urcorner;":"⌝","&urcrop;":"⌎","&uring;":"ů","&urtri;":"◹","&uscr;":"𝓊","&utdot;":"⋰","&utilde;":"ũ","&utri;":"▵","&utrif;":"▴","&uuarr;":"⇈","&uuml":"ü","&uuml;":"ü","&uwangle;":"⦧","&vArr;":"⇕","&vBar;":"⫨","&vBarv;":"⫩","&vDash;":"⊨","&vangrt;":"⦜","&varepsilon;":"ϵ","&varkappa;":"ϰ","&varnothing;":"∅","&varphi;":"ϕ","&varpi;":"ϖ","&varpropto;":"∝","&varr;":"↕","&varrho;":"ϱ","&varsigma;":"ς","&varsubsetneq;":"⊊︀","&varsubsetneqq;":"⫋︀","&varsupsetneq;":"⊋︀","&varsupsetneqq;":"⫌︀","&vartheta;":"ϑ","&vartriangleleft;":"⊲","&vartriangleright;":"⊳","&vcy;":"в","&vdash;":"⊢","&vee;":"∨","&veebar;":"⊻","&veeeq;":"≚","&vellip;":"⋮","&verbar;":"|","&vert;":"|","&vfr;":"𝔳","&vltri;":"⊲","&vnsub;":"⊂⃒","&vnsup;":"⊃⃒","&vopf;":"𝕧","&vprop;":"∝","&vrtri;":"⊳","&vscr;":"𝓋","&vsubnE;":"⫋︀","&vsubne;":"⊊︀","&vsupnE;":"⫌︀","&vsupne;":"⊋︀","&vzigzag;":"⦚","&wcirc;":"ŵ","&wedbar;":"⩟","&wedge;":"∧","&wedgeq;":"≙","&weierp;":"℘","&wfr;":"𝔴","&wopf;":"𝕨","&wp;":"℘","&wr;":"≀","&wreath;":"≀","&wscr;":"𝓌","&xcap;":"⋂","&xcirc;":"◯","&xcup;":"⋃","&xdtri;":"▽","&xfr;":"𝔵","&xhArr;":"⟺","&xharr;":"⟷","&xi;":"ξ","&xlArr;":"⟸","&xlarr;":"⟵","&xmap;":"⟼","&xnis;":"⋻","&xodot;":"⨀","&xopf;":"𝕩","&xoplus;":"⨁","&xotime;":"⨂","&xrArr;":"⟹","&xrarr;":"⟶","&xscr;":"𝓍","&xsqcup;":"⨆","&xuplus;":"⨄","&xutri;":"△","&xvee;":"⋁","&xwedge;":"⋀","&yacute":"ý","&yacute;":"ý","&yacy;":"я","&ycirc;":"ŷ","&ycy;":"ы","&yen":"¥","&yen;":"¥","&yfr;":"𝔶","&yicy;":"ї","&yopf;":"𝕪","&yscr;":"𝓎","&yucy;":"ю","&yuml":"ÿ","&yuml;":"ÿ","&zacute;":"ź","&zcaron;":"ž","&zcy;":"з","&zdot;":"ż","&zeetrf;":"ℨ","&zeta;":"ζ","&zfr;":"𝔷","&zhcy;":"ж","&zigrarr;":"⇝","&zopf;":"𝕫","&zscr;":"𝓏","&zwj;":"‍","&zwnj;":"‌"},characters:{"Æ":"&AElig;","&":"&amp;","Á":"&Aacute;","Ă":"&Abreve;","Â":"&Acirc;","А":"&Acy;","𝔄":"&Afr;","À":"&Agrave;","Α":"&Alpha;","Ā":"&Amacr;","⩓":"&And;","Ą":"&Aogon;","𝔸":"&Aopf;","⁡":"&af;","Å":"&angst;","𝒜":"&Ascr;","≔":"&coloneq;","Ã":"&Atilde;","Ä":"&Auml;","∖":"&ssetmn;","⫧":"&Barv;","⌆":"&doublebarwedge;","Б":"&Bcy;","∵":"&because;","ℬ":"&bernou;","Β":"&Beta;","𝔅":"&Bfr;","𝔹":"&Bopf;","˘":"&breve;","≎":"&bump;","Ч":"&CHcy;","©":"&copy;","Ć":"&Cacute;","⋒":"&Cap;","ⅅ":"&DD;","ℭ":"&Cfr;","Č":"&Ccaron;","Ç":"&Ccedil;","Ĉ":"&Ccirc;","∰":"&Cconint;","Ċ":"&Cdot;","¸":"&cedil;","·":"&middot;","Χ":"&Chi;","⊙":"&odot;","⊖":"&ominus;","⊕":"&oplus;","⊗":"&otimes;","∲":"&cwconint;","”":"&rdquor;","’":"&rsquor;","∷":"&Proportion;","⩴":"&Colone;","≡":"&equiv;","∯":"&DoubleContourIntegral;","∮":"&oint;","ℂ":"&complexes;","∐":"&coprod;","∳":"&awconint;","⨯":"&Cross;","𝒞":"&Cscr;","⋓":"&Cup;","≍":"&asympeq;","⤑":"&DDotrahd;","Ђ":"&DJcy;","Ѕ":"&DScy;","Џ":"&DZcy;","‡":"&ddagger;","↡":"&Darr;","⫤":"&DoubleLeftTee;","Ď":"&Dcaron;","Д":"&Dcy;","∇":"&nabla;","Δ":"&Delta;","𝔇":"&Dfr;","´":"&acute;","˙":"&dot;","˝":"&dblac;","`":"&grave;","˜":"&tilde;","⋄":"&diamond;","ⅆ":"&dd;","𝔻":"&Dopf;","¨":"&uml;","⃜":"&DotDot;","≐":"&esdot;","⇓":"&dArr;","⇐":"&lArr;","⇔":"&iff;","⟸":"&xlArr;","⟺":"&xhArr;","⟹":"&xrArr;","⇒":"&rArr;","⊨":"&vDash;","⇑":"&uArr;","⇕":"&vArr;","∥":"&spar;","↓":"&downarrow;","⤓":"&DownArrowBar;","⇵":"&duarr;","̑":"&DownBreve;","⥐":"&DownLeftRightVector;","⥞":"&DownLeftTeeVector;","↽":"&lhard;","⥖":"&DownLeftVectorBar;","⥟":"&DownRightTeeVector;","⇁":"&rightharpoondown;","⥗":"&DownRightVectorBar;","⊤":"&top;","↧":"&mapstodown;","𝒟":"&Dscr;","Đ":"&Dstrok;","Ŋ":"&ENG;","Ð":"&ETH;","É":"&Eacute;","Ě":"&Ecaron;","Ê":"&Ecirc;","Э":"&Ecy;","Ė":"&Edot;","𝔈":"&Efr;","È":"&Egrave;","∈":"&isinv;","Ē":"&Emacr;","◻":"&EmptySmallSquare;","▫":"&EmptyVerySmallSquare;","Ę":"&Eogon;","𝔼":"&Eopf;","Ε":"&Epsilon;","⩵":"&Equal;","≂":"&esim;","⇌":"&rlhar;","ℰ":"&expectation;","⩳":"&Esim;","Η":"&Eta;","Ë":"&Euml;","∃":"&exist;","ⅇ":"&exponentiale;","Ф":"&Fcy;","𝔉":"&Ffr;","◼":"&FilledSmallSquare;","▪":"&squf;","𝔽":"&Fopf;","∀":"&forall;","ℱ":"&Fscr;","Ѓ":"&GJcy;",">":"&gt;","Γ":"&Gamma;","Ϝ":"&Gammad;","Ğ":"&Gbreve;","Ģ":"&Gcedil;","Ĝ":"&Gcirc;","Г":"&Gcy;","Ġ":"&Gdot;","𝔊":"&Gfr;","⋙":"&ggg;","𝔾":"&Gopf;","≥":"&geq;","⋛":"&gtreqless;","≧":"&geqq;","⪢":"&GreaterGreater;","≷":"&gtrless;","⩾":"&ges;","≳":"&gtrsim;","𝒢":"&Gscr;","≫":"&gg;","Ъ":"&HARDcy;","ˇ":"&caron;","^":"&Hat;","Ĥ":"&Hcirc;","ℌ":"&Poincareplane;","ℋ":"&hamilt;","ℍ":"&quaternions;","─":"&boxh;","Ħ":"&Hstrok;","≏":"&bumpeq;","Е":"&IEcy;","Ĳ":"&IJlig;","Ё":"&IOcy;","Í":"&Iacute;","Î":"&Icirc;","И":"&Icy;","İ":"&Idot;","ℑ":"&imagpart;","Ì":"&Igrave;","Ī":"&Imacr;","ⅈ":"&ii;","∬":"&Int;","∫":"&int;","⋂":"&xcap;","⁣":"&ic;","⁢":"&it;","Į":"&Iogon;","𝕀":"&Iopf;","Ι":"&Iota;","ℐ":"&imagline;","Ĩ":"&Itilde;","І":"&Iukcy;","Ï":"&Iuml;","Ĵ":"&Jcirc;","Й":"&Jcy;","𝔍":"&Jfr;","𝕁":"&Jopf;","𝒥":"&Jscr;","Ј":"&Jsercy;","Є":"&Jukcy;","Х":"&KHcy;","Ќ":"&KJcy;","Κ":"&Kappa;","Ķ":"&Kcedil;","К":"&Kcy;","𝔎":"&Kfr;","𝕂":"&Kopf;","𝒦":"&Kscr;","Љ":"&LJcy;","<":"&lt;","Ĺ":"&Lacute;","Λ":"&Lambda;","⟪":"&Lang;","ℒ":"&lagran;","↞":"&twoheadleftarrow;","Ľ":"&Lcaron;","Ļ":"&Lcedil;","Л":"&Lcy;","⟨":"&langle;","←":"&slarr;","⇤":"&larrb;","⇆":"&lrarr;","⌈":"&lceil;","⟦":"&lobrk;","⥡":"&LeftDownTeeVector;","⇃":"&downharpoonleft;","⥙":"&LeftDownVectorBar;","⌊":"&lfloor;","↔":"&leftrightarrow;","⥎":"&LeftRightVector;","⊣":"&dashv;","↤":"&mapstoleft;","⥚":"&LeftTeeVector;","⊲":"&vltri;","⧏":"&LeftTriangleBar;","⊴":"&trianglelefteq;","⥑":"&LeftUpDownVector;","⥠":"&LeftUpTeeVector;","↿":"&upharpoonleft;","⥘":"&LeftUpVectorBar;","↼":"&lharu;","⥒":"&LeftVectorBar;","⋚":"&lesseqgtr;","≦":"&leqq;","≶":"&lg;","⪡":"&LessLess;","⩽":"&les;","≲":"&lsim;","𝔏":"&Lfr;","⋘":"&Ll;","⇚":"&lAarr;","Ŀ":"&Lmidot;","⟵":"&xlarr;","⟷":"&xharr;","⟶":"&xrarr;","𝕃":"&Lopf;","↙":"&swarrow;","↘":"&searrow;","↰":"&lsh;","Ł":"&Lstrok;","≪":"&ll;","⤅":"&Map;","М":"&Mcy;"," ":"&MediumSpace;","ℳ":"&phmmat;","𝔐":"&Mfr;","∓":"&mp;","𝕄":"&Mopf;","Μ":"&Mu;","Њ":"&NJcy;","Ń":"&Nacute;","Ň":"&Ncaron;","Ņ":"&Ncedil;","Н":"&Ncy;","​":"&ZeroWidthSpace;","\n":"&NewLine;","𝔑":"&Nfr;","⁠":"&NoBreak;"," ":"&nbsp;","ℕ":"&naturals;","⫬":"&Not;","≢":"&nequiv;","≭":"&NotCupCap;","∦":"&nspar;","∉":"&notinva;","≠":"&ne;","≂̸":"&nesim;","∄":"&nexists;","≯":"&ngtr;","≱":"&ngeq;","≧̸":"&ngeqq;","≫̸":"&nGtv;","≹":"&ntgl;","⩾̸":"&nges;","≵":"&ngsim;","≎̸":"&nbump;","≏̸":"&nbumpe;","⋪":"&ntriangleleft;","⧏̸":"&NotLeftTriangleBar;","⋬":"&ntrianglelefteq;","≮":"&nlt;","≰":"&nleq;","≸":"&ntlg;","≪̸":"&nLtv;","⩽̸":"&nles;","≴":"&nlsim;","⪢̸":"&NotNestedGreaterGreater;","⪡̸":"&NotNestedLessLess;","⊀":"&nprec;","⪯̸":"&npreceq;","⋠":"&nprcue;","∌":"&notniva;","⋫":"&ntriangleright;","⧐̸":"&NotRightTriangleBar;","⋭":"&ntrianglerighteq;","⊏̸":"&NotSquareSubset;","⋢":"&nsqsube;","⊐̸":"&NotSquareSuperset;","⋣":"&nsqsupe;","⊂⃒":"&vnsub;","⊈":"&nsubseteq;","⊁":"&nsucc;","⪰̸":"&nsucceq;","⋡":"&nsccue;","≿̸":"&NotSucceedsTilde;","⊃⃒":"&vnsup;","⊉":"&nsupseteq;","≁":"&nsim;","≄":"&nsimeq;","≇":"&ncong;","≉":"&napprox;","∤":"&nsmid;","𝒩":"&Nscr;","Ñ":"&Ntilde;","Ν":"&Nu;","Œ":"&OElig;","Ó":"&Oacute;","Ô":"&Ocirc;","О":"&Ocy;","Ő":"&Odblac;","𝔒":"&Ofr;","Ò":"&Ograve;","Ō":"&Omacr;","Ω":"&ohm;","Ο":"&Omicron;","𝕆":"&Oopf;","“":"&ldquo;","‘":"&lsquo;","⩔":"&Or;","𝒪":"&Oscr;","Ø":"&Oslash;","Õ":"&Otilde;","⨷":"&Otimes;","Ö":"&Ouml;","‾":"&oline;","⏞":"&OverBrace;","⎴":"&tbrk;","⏜":"&OverParenthesis;","∂":"&part;","П":"&Pcy;","𝔓":"&Pfr;","Φ":"&Phi;","Π":"&Pi;","±":"&pm;","ℙ":"&primes;","⪻":"&Pr;","≺":"&prec;","⪯":"&preceq;","≼":"&preccurlyeq;","≾":"&prsim;","″":"&Prime;","∏":"&prod;","∝":"&vprop;","𝒫":"&Pscr;","Ψ":"&Psi;",'"':"&quot;","𝔔":"&Qfr;","ℚ":"&rationals;","𝒬":"&Qscr;","⤐":"&drbkarow;","®":"&reg;","Ŕ":"&Racute;","⟫":"&Rang;","↠":"&twoheadrightarrow;","⤖":"&Rarrtl;","Ř":"&Rcaron;","Ŗ":"&Rcedil;","Р":"&Rcy;","ℜ":"&realpart;","∋":"&niv;","⇋":"&lrhar;","⥯":"&duhar;","Ρ":"&Rho;","⟩":"&rangle;","→":"&srarr;","⇥":"&rarrb;","⇄":"&rlarr;","⌉":"&rceil;","⟧":"&robrk;","⥝":"&RightDownTeeVector;","⇂":"&downharpoonright;","⥕":"&RightDownVectorBar;","⌋":"&rfloor;","⊢":"&vdash;","↦":"&mapsto;","⥛":"&RightTeeVector;","⊳":"&vrtri;","⧐":"&RightTriangleBar;","⊵":"&trianglerighteq;","⥏":"&RightUpDownVector;","⥜":"&RightUpTeeVector;","↾":"&upharpoonright;","⥔":"&RightUpVectorBar;","⇀":"&rightharpoonup;","⥓":"&RightVectorBar;","ℝ":"&reals;","⥰":"&RoundImplies;","⇛":"&rAarr;","ℛ":"&realine;","↱":"&rsh;","⧴":"&RuleDelayed;","Щ":"&SHCHcy;","Ш":"&SHcy;","Ь":"&SOFTcy;","Ś":"&Sacute;","⪼":"&Sc;","Š":"&Scaron;","Ş":"&Scedil;","Ŝ":"&Scirc;","С":"&Scy;","𝔖":"&Sfr;","↑":"&uparrow;","Σ":"&Sigma;","∘":"&compfn;","𝕊":"&Sopf;","√":"&radic;","□":"&square;","⊓":"&sqcap;","⊏":"&sqsubset;","⊑":"&sqsubseteq;","⊐":"&sqsupset;","⊒":"&sqsupseteq;","⊔":"&sqcup;","𝒮":"&Sscr;","⋆":"&sstarf;","⋐":"&Subset;","⊆":"&subseteq;","≻":"&succ;","⪰":"&succeq;","≽":"&succcurlyeq;","≿":"&succsim;","∑":"&sum;","⋑":"&Supset;","⊃":"&supset;","⊇":"&supseteq;","Þ":"&THORN;","™":"&trade;","Ћ":"&TSHcy;","Ц":"&TScy;","\t":"&Tab;","Τ":"&Tau;","Ť":"&Tcaron;","Ţ":"&Tcedil;","Т":"&Tcy;","𝔗":"&Tfr;","∴":"&therefore;","Θ":"&Theta;","  ":"&ThickSpace;"," ":"&thinsp;","∼":"&thksim;","≃":"&simeq;","≅":"&cong;","≈":"&thkap;","𝕋":"&Topf;","⃛":"&tdot;","𝒯":"&Tscr;","Ŧ":"&Tstrok;","Ú":"&Uacute;","↟":"&Uarr;","⥉":"&Uarrocir;","Ў":"&Ubrcy;","Ŭ":"&Ubreve;","Û":"&Ucirc;","У":"&Ucy;","Ű":"&Udblac;","𝔘":"&Ufr;","Ù":"&Ugrave;","Ū":"&Umacr;",_:"&lowbar;","⏟":"&UnderBrace;","⎵":"&bbrk;","⏝":"&UnderParenthesis;","⋃":"&xcup;","⊎":"&uplus;","Ų":"&Uogon;","𝕌":"&Uopf;","⤒":"&UpArrowBar;","⇅":"&udarr;","↕":"&varr;","⥮":"&udhar;","⊥":"&perp;","↥":"&mapstoup;","↖":"&nwarrow;","↗":"&nearrow;","ϒ":"&upsih;","Υ":"&Upsilon;","Ů":"&Uring;","𝒰":"&Uscr;","Ũ":"&Utilde;","Ü":"&Uuml;","⊫":"&VDash;","⫫":"&Vbar;","В":"&Vcy;","⊩":"&Vdash;","⫦":"&Vdashl;","⋁":"&xvee;","‖":"&Vert;","∣":"&smid;","|":"&vert;","❘":"&VerticalSeparator;","≀":"&wreath;"," ":"&hairsp;","𝔙":"&Vfr;","𝕍":"&Vopf;","𝒱":"&Vscr;","⊪":"&Vvdash;","Ŵ":"&Wcirc;","⋀":"&xwedge;","𝔚":"&Wfr;","𝕎":"&Wopf;","𝒲":"&Wscr;","𝔛":"&Xfr;","Ξ":"&Xi;","𝕏":"&Xopf;","𝒳":"&Xscr;","Я":"&YAcy;","Ї":"&YIcy;","Ю":"&YUcy;","Ý":"&Yacute;","Ŷ":"&Ycirc;","Ы":"&Ycy;","𝔜":"&Yfr;","𝕐":"&Yopf;","𝒴":"&Yscr;","Ÿ":"&Yuml;","Ж":"&ZHcy;","Ź":"&Zacute;","Ž":"&Zcaron;","З":"&Zcy;","Ż":"&Zdot;","Ζ":"&Zeta;","ℨ":"&zeetrf;","ℤ":"&integers;","𝒵":"&Zscr;","á":"&aacute;","ă":"&abreve;","∾":"&mstpos;","∾̳":"&acE;","∿":"&acd;","â":"&acirc;","а":"&acy;","æ":"&aelig;","𝔞":"&afr;","à":"&agrave;","ℵ":"&aleph;","α":"&alpha;","ā":"&amacr;","⨿":"&amalg;","∧":"&wedge;","⩕":"&andand;","⩜":"&andd;","⩘":"&andslope;","⩚":"&andv;","∠":"&angle;","⦤":"&ange;","∡":"&measuredangle;","⦨":"&angmsdaa;","⦩":"&angmsdab;","⦪":"&angmsdac;","⦫":"&angmsdad;","⦬":"&angmsdae;","⦭":"&angmsdaf;","⦮":"&angmsdag;","⦯":"&angmsdah;","∟":"&angrt;","⊾":"&angrtvb;","⦝":"&angrtvbd;","∢":"&angsph;","⍼":"&angzarr;","ą":"&aogon;","𝕒":"&aopf;","⩰":"&apE;","⩯":"&apacir;","≊":"&approxeq;","≋":"&apid;","'":"&apos;","å":"&aring;","𝒶":"&ascr;","*":"&midast;","ã":"&atilde;","ä":"&auml;","⨑":"&awint;","⫭":"&bNot;","≌":"&bcong;","϶":"&bepsi;","‵":"&bprime;","∽":"&bsim;","⋍":"&bsime;","⊽":"&barvee;","⌅":"&barwedge;","⎶":"&bbrktbrk;","б":"&bcy;","„":"&ldquor;","⦰":"&bemptyv;","β":"&beta;","ℶ":"&beth;","≬":"&twixt;","𝔟":"&bfr;","◯":"&xcirc;","⨀":"&xodot;","⨁":"&xoplus;","⨂":"&xotime;","⨆":"&xsqcup;","★":"&starf;","▽":"&xdtri;","△":"&xutri;","⨄":"&xuplus;","⤍":"&rbarr;","⧫":"&lozf;","▴":"&utrif;","▾":"&dtrif;","◂":"&ltrif;","▸":"&rtrif;","␣":"&blank;","▒":"&blk12;","░":"&blk14;","▓":"&blk34;","█":"&block;","=⃥":"&bne;","≡⃥":"&bnequiv;","⌐":"&bnot;","𝕓":"&bopf;","⋈":"&bowtie;","╗":"&boxDL;","╔":"&boxDR;","╖":"&boxDl;","╓":"&boxDr;","═":"&boxH;","╦":"&boxHD;","╩":"&boxHU;","╤":"&boxHd;","╧":"&boxHu;","╝":"&boxUL;","╚":"&boxUR;","╜":"&boxUl;","╙":"&boxUr;","║":"&boxV;","╬":"&boxVH;","╣":"&boxVL;","╠":"&boxVR;","╫":"&boxVh;","╢":"&boxVl;","╟":"&boxVr;","⧉":"&boxbox;","╕":"&boxdL;","╒":"&boxdR;","┐":"&boxdl;","┌":"&boxdr;","╥":"&boxhD;","╨":"&boxhU;","┬":"&boxhd;","┴":"&boxhu;","⊟":"&minusb;","⊞":"&plusb;","⊠":"&timesb;","╛":"&boxuL;","╘":"&boxuR;","┘":"&boxul;","└":"&boxur;","│":"&boxv;","╪":"&boxvH;","╡":"&boxvL;","╞":"&boxvR;","┼":"&boxvh;","┤":"&boxvl;","├":"&boxvr;","¦":"&brvbar;","𝒷":"&bscr;","⁏":"&bsemi;","\\":"&bsol;","⧅":"&bsolb;","⟈":"&bsolhsub;","•":"&bullet;","⪮":"&bumpE;","ć":"&cacute;","∩":"&cap;","⩄":"&capand;","⩉":"&capbrcup;","⩋":"&capcap;","⩇":"&capcup;","⩀":"&capdot;","∩︀":"&caps;","⁁":"&caret;","⩍":"&ccaps;","č":"&ccaron;","ç":"&ccedil;","ĉ":"&ccirc;","⩌":"&ccups;","⩐":"&ccupssm;","ċ":"&cdot;","⦲":"&cemptyv;","¢":"&cent;","𝔠":"&cfr;","ч":"&chcy;","✓":"&checkmark;","χ":"&chi;","○":"&cir;","⧃":"&cirE;","ˆ":"&circ;","≗":"&cire;","↺":"&olarr;","↻":"&orarr;","Ⓢ":"&oS;","⊛":"&oast;","⊚":"&ocir;","⊝":"&odash;","⨐":"&cirfnint;","⫯":"&cirmid;","⧂":"&cirscir;","♣":"&clubsuit;",":":"&colon;",",":"&comma;","@":"&commat;","∁":"&complement;","⩭":"&congdot;","𝕔":"&copf;","℗":"&copysr;","↵":"&crarr;","✗":"&cross;","𝒸":"&cscr;","⫏":"&csub;","⫑":"&csube;","⫐":"&csup;","⫒":"&csupe;","⋯":"&ctdot;","⤸":"&cudarrl;","⤵":"&cudarrr;","⋞":"&curlyeqprec;","⋟":"&curlyeqsucc;","↶":"&curvearrowleft;","⤽":"&cularrp;","∪":"&cup;","⩈":"&cupbrcap;","⩆":"&cupcap;","⩊":"&cupcup;","⊍":"&cupdot;","⩅":"&cupor;","∪︀":"&cups;","↷":"&curvearrowright;","⤼":"&curarrm;","⋎":"&cuvee;","⋏":"&cuwed;","¤":"&curren;","∱":"&cwint;","⌭":"&cylcty;","⥥":"&dHar;","†":"&dagger;","ℸ":"&daleth;","‐":"&hyphen;","⤏":"&rBarr;","ď":"&dcaron;","д":"&dcy;","⇊":"&downdownarrows;","⩷":"&eDDot;","°":"&deg;","δ":"&delta;","⦱":"&demptyv;","⥿":"&dfisht;","𝔡":"&dfr;","♦":"&diams;","ϝ":"&gammad;","⋲":"&disin;","÷":"&divide;","⋇":"&divonx;","ђ":"&djcy;","⌞":"&llcorner;","⌍":"&dlcrop;",$:"&dollar;","𝕕":"&dopf;","≑":"&eDot;","∸":"&minusd;","∔":"&plusdo;","⊡":"&sdotb;","⌟":"&lrcorner;","⌌":"&drcrop;","𝒹":"&dscr;","ѕ":"&dscy;","⧶":"&dsol;","đ":"&dstrok;","⋱":"&dtdot;","▿":"&triangledown;","⦦":"&dwangle;","џ":"&dzcy;","⟿":"&dzigrarr;","é":"&eacute;","⩮":"&easter;","ě":"&ecaron;","≖":"&eqcirc;","ê":"&ecirc;","≕":"&eqcolon;","э":"&ecy;","ė":"&edot;","≒":"&fallingdotseq;","𝔢":"&efr;","⪚":"&eg;","è":"&egrave;","⪖":"&eqslantgtr;","⪘":"&egsdot;","⪙":"&el;","⏧":"&elinters;","ℓ":"&ell;","⪕":"&eqslantless;","⪗":"&elsdot;","ē":"&emacr;","∅":"&varnothing;"," ":"&emsp13;"," ":"&emsp14;"," ":"&emsp;","ŋ":"&eng;"," ":"&ensp;","ę":"&eogon;","𝕖":"&eopf;","⋕":"&epar;","⧣":"&eparsl;","⩱":"&eplus;","ε":"&epsilon;","ϵ":"&varepsilon;","=":"&equals;","≟":"&questeq;","⩸":"&equivDD;","⧥":"&eqvparsl;","≓":"&risingdotseq;","⥱":"&erarr;","ℯ":"&escr;","η":"&eta;","ð":"&eth;","ë":"&euml;","€":"&euro;","!":"&excl;","ф":"&fcy;","♀":"&female;","ﬃ":"&ffilig;","ﬀ":"&fflig;","ﬄ":"&ffllig;","𝔣":"&ffr;","ﬁ":"&filig;",fj:"&fjlig;","♭":"&flat;","ﬂ":"&fllig;","▱":"&fltns;","ƒ":"&fnof;","𝕗":"&fopf;","⋔":"&pitchfork;","⫙":"&forkv;","⨍":"&fpartint;","½":"&half;","⅓":"&frac13;","¼":"&frac14;","⅕":"&frac15;","⅙":"&frac16;","⅛":"&frac18;","⅔":"&frac23;","⅖":"&frac25;","¾":"&frac34;","⅗":"&frac35;","⅜":"&frac38;","⅘":"&frac45;","⅚":"&frac56;","⅝":"&frac58;","⅞":"&frac78;","⁄":"&frasl;","⌢":"&sfrown;","𝒻":"&fscr;","⪌":"&gtreqqless;","ǵ":"&gacute;","γ":"&gamma;","⪆":"&gtrapprox;","ğ":"&gbreve;","ĝ":"&gcirc;","г":"&gcy;","ġ":"&gdot;","⪩":"&gescc;","⪀":"&gesdot;","⪂":"&gesdoto;","⪄":"&gesdotol;","⋛︀":"&gesl;","⪔":"&gesles;","𝔤":"&gfr;","ℷ":"&gimel;","ѓ":"&gjcy;","⪒":"&glE;","⪥":"&gla;","⪤":"&glj;","≩":"&gneqq;","⪊":"&gnapprox;","⪈":"&gneq;","⋧":"&gnsim;","𝕘":"&gopf;","ℊ":"&gscr;","⪎":"&gsime;","⪐":"&gsiml;","⪧":"&gtcc;","⩺":"&gtcir;","⋗":"&gtrdot;","⦕":"&gtlPar;","⩼":"&gtquest;","⥸":"&gtrarr;","≩︀":"&gvnE;","ъ":"&hardcy;","⥈":"&harrcir;","↭":"&leftrightsquigarrow;","ℏ":"&plankv;","ĥ":"&hcirc;","♥":"&heartsuit;","…":"&mldr;","⊹":"&hercon;","𝔥":"&hfr;","⤥":"&searhk;","⤦":"&swarhk;","⇿":"&hoarr;","∻":"&homtht;","↩":"&larrhk;","↪":"&rarrhk;","𝕙":"&hopf;","―":"&horbar;","𝒽":"&hscr;","ħ":"&hstrok;","⁃":"&hybull;","í":"&iacute;","î":"&icirc;","и":"&icy;","е":"&iecy;","¡":"&iexcl;","𝔦":"&ifr;","ì":"&igrave;","⨌":"&qint;","∭":"&tint;","⧜":"&iinfin;","℩":"&iiota;","ĳ":"&ijlig;","ī":"&imacr;","ı":"&inodot;","⊷":"&imof;","Ƶ":"&imped;","℅":"&incare;","∞":"&infin;","⧝":"&infintie;","⊺":"&intercal;","⨗":"&intlarhk;","⨼":"&iprod;","ё":"&iocy;","į":"&iogon;","𝕚":"&iopf;","ι":"&iota;","¿":"&iquest;","𝒾":"&iscr;","⋹":"&isinE;","⋵":"&isindot;","⋴":"&isins;","⋳":"&isinsv;","ĩ":"&itilde;","і":"&iukcy;","ï":"&iuml;","ĵ":"&jcirc;","й":"&jcy;","𝔧":"&jfr;","ȷ":"&jmath;","𝕛":"&jopf;","𝒿":"&jscr;","ј":"&jsercy;","є":"&jukcy;","κ":"&kappa;","ϰ":"&varkappa;","ķ":"&kcedil;","к":"&kcy;","𝔨":"&kfr;","ĸ":"&kgreen;","х":"&khcy;","ќ":"&kjcy;","𝕜":"&kopf;","𝓀":"&kscr;","⤛":"&lAtail;","⤎":"&lBarr;","⪋":"&lesseqqgtr;","⥢":"&lHar;","ĺ":"&lacute;","⦴":"&laemptyv;","λ":"&lambda;","⦑":"&langd;","⪅":"&lessapprox;","«":"&laquo;","⤟":"&larrbfs;","⤝":"&larrfs;","↫":"&looparrowleft;","⤹":"&larrpl;","⥳":"&larrsim;","↢":"&leftarrowtail;","⪫":"&lat;","⤙":"&latail;","⪭":"&late;","⪭︀":"&lates;","⤌":"&lbarr;","❲":"&lbbrk;","{":"&lcub;","[":"&lsqb;","⦋":"&lbrke;","⦏":"&lbrksld;","⦍":"&lbrkslu;","ľ":"&lcaron;","ļ":"&lcedil;","л":"&lcy;","⤶":"&ldca;","⥧":"&ldrdhar;","⥋":"&ldrushar;","↲":"&ldsh;","≤":"&leq;","⇇":"&llarr;","⋋":"&lthree;","⪨":"&lescc;","⩿":"&lesdot;","⪁":"&lesdoto;","⪃":"&lesdotor;","⋚︀":"&lesg;","⪓":"&lesges;","⋖":"&ltdot;","⥼":"&lfisht;","𝔩":"&lfr;","⪑":"&lgE;","⥪":"&lharul;","▄":"&lhblk;","љ":"&ljcy;","⥫":"&llhard;","◺":"&lltri;","ŀ":"&lmidot;","⎰":"&lmoustache;","≨":"&lneqq;","⪉":"&lnapprox;","⪇":"&lneq;","⋦":"&lnsim;","⟬":"&loang;","⇽":"&loarr;","⟼":"&xmap;","↬":"&rarrlp;","⦅":"&lopar;","𝕝":"&lopf;","⨭":"&loplus;","⨴":"&lotimes;","∗":"&lowast;","◊":"&lozenge;","(":"&lpar;","⦓":"&lparlt;","⥭":"&lrhard;","‎":"&lrm;","⊿":"&lrtri;","‹":"&lsaquo;","𝓁":"&lscr;","⪍":"&lsime;","⪏":"&lsimg;","‚":"&sbquo;","ł":"&lstrok;","⪦":"&ltcc;","⩹":"&ltcir;","⋉":"&ltimes;","⥶":"&ltlarr;","⩻":"&ltquest;","⦖":"&ltrPar;","◃":"&triangleleft;","⥊":"&lurdshar;","⥦":"&luruhar;","≨︀":"&lvnE;","∺":"&mDDot;","¯":"&strns;","♂":"&male;","✠":"&maltese;","▮":"&marker;","⨩":"&mcomma;","м":"&mcy;","—":"&mdash;","𝔪":"&mfr;","℧":"&mho;","µ":"&micro;","⫰":"&midcir;","−":"&minus;","⨪":"&minusdu;","⫛":"&mlcp;","⊧":"&models;","𝕞":"&mopf;","𝓂":"&mscr;","μ":"&mu;","⊸":"&mumap;","⋙̸":"&nGg;","≫⃒":"&nGt;","⇍":"&nlArr;","⇎":"&nhArr;","⋘̸":"&nLl;","≪⃒":"&nLt;","⇏":"&nrArr;","⊯":"&nVDash;","⊮":"&nVdash;","ń":"&nacute;","∠⃒":"&nang;","⩰̸":"&napE;","≋̸":"&napid;","ŉ":"&napos;","♮":"&natural;","⩃":"&ncap;","ň":"&ncaron;","ņ":"&ncedil;","⩭̸":"&ncongdot;","⩂":"&ncup;","н":"&ncy;","–":"&ndash;","⇗":"&neArr;","⤤":"&nearhk;","≐̸":"&nedot;","⤨":"&toea;","𝔫":"&nfr;","↮":"&nleftrightarrow;","⫲":"&nhpar;","⋼":"&nis;","⋺":"&nisd;","њ":"&njcy;","≦̸":"&nleqq;","↚":"&nleftarrow;","‥":"&nldr;","𝕟":"&nopf;","¬":"&not;","⋹̸":"&notinE;","⋵̸":"&notindot;","⋷":"&notinvb;","⋶":"&notinvc;","⋾":"&notnivb;","⋽":"&notnivc;","⫽⃥":"&nparsl;","∂̸":"&npart;","⨔":"&npolint;","↛":"&nrightarrow;","⤳̸":"&nrarrc;","↝̸":"&nrarrw;","𝓃":"&nscr;","⊄":"&nsub;","⫅̸":"&nsubseteqq;","⊅":"&nsup;","⫆̸":"&nsupseteqq;","ñ":"&ntilde;","ν":"&nu;","#":"&num;","№":"&numero;"," ":"&numsp;","⊭":"&nvDash;","⤄":"&nvHarr;","≍⃒":"&nvap;","⊬":"&nvdash;","≥⃒":"&nvge;",">⃒":"&nvgt;","⧞":"&nvinfin;","⤂":"&nvlArr;","≤⃒":"&nvle;","<⃒":"&nvlt;","⊴⃒":"&nvltrie;","⤃":"&nvrArr;","⊵⃒":"&nvrtrie;","∼⃒":"&nvsim;","⇖":"&nwArr;","⤣":"&nwarhk;","⤧":"&nwnear;","ó":"&oacute;","ô":"&ocirc;","о":"&ocy;","ő":"&odblac;","⨸":"&odiv;","⦼":"&odsold;","œ":"&oelig;","⦿":"&ofcir;","𝔬":"&ofr;","˛":"&ogon;","ò":"&ograve;","⧁":"&ogt;","⦵":"&ohbar;","⦾":"&olcir;","⦻":"&olcross;","⧀":"&olt;","ō":"&omacr;","ω":"&omega;","ο":"&omicron;","⦶":"&omid;","𝕠":"&oopf;","⦷":"&opar;","⦹":"&operp;","∨":"&vee;","⩝":"&ord;","ℴ":"&oscr;","ª":"&ordf;","º":"&ordm;","⊶":"&origof;","⩖":"&oror;","⩗":"&orslope;","⩛":"&orv;","ø":"&oslash;","⊘":"&osol;","õ":"&otilde;","⨶":"&otimesas;","ö":"&ouml;","⌽":"&ovbar;","¶":"&para;","⫳":"&parsim;","⫽":"&parsl;","п":"&pcy;","%":"&percnt;",".":"&period;","‰":"&permil;","‱":"&pertenk;","𝔭":"&pfr;","φ":"&phi;","ϕ":"&varphi;","☎":"&phone;","π":"&pi;","ϖ":"&varpi;","ℎ":"&planckh;","+":"&plus;","⨣":"&plusacir;","⨢":"&pluscir;","⨥":"&plusdu;","⩲":"&pluse;","⨦":"&plussim;","⨧":"&plustwo;","⨕":"&pointint;","𝕡":"&popf;","£":"&pound;","⪳":"&prE;","⪷":"&precapprox;","⪹":"&prnap;","⪵":"&prnE;","⋨":"&prnsim;","′":"&prime;","⌮":"&profalar;","⌒":"&profline;","⌓":"&profsurf;","⊰":"&prurel;","𝓅":"&pscr;","ψ":"&psi;"," ":"&puncsp;","𝔮":"&qfr;","𝕢":"&qopf;","⁗":"&qprime;","𝓆":"&qscr;","⨖":"&quatint;","?":"&quest;","⤜":"&rAtail;","⥤":"&rHar;","∽̱":"&race;","ŕ":"&racute;","⦳":"&raemptyv;","⦒":"&rangd;","⦥":"&range;","»":"&raquo;","⥵":"&rarrap;","⤠":"&rarrbfs;","⤳":"&rarrc;","⤞":"&rarrfs;","⥅":"&rarrpl;","⥴":"&rarrsim;","↣":"&rightarrowtail;","↝":"&rightsquigarrow;","⤚":"&ratail;","∶":"&ratio;","❳":"&rbbrk;","}":"&rcub;","]":"&rsqb;","⦌":"&rbrke;","⦎":"&rbrksld;","⦐":"&rbrkslu;","ř":"&rcaron;","ŗ":"&rcedil;","р":"&rcy;","⤷":"&rdca;","⥩":"&rdldhar;","↳":"&rdsh;","▭":"&rect;","⥽":"&rfisht;","𝔯":"&rfr;","⥬":"&rharul;","ρ":"&rho;","ϱ":"&varrho;","⇉":"&rrarr;","⋌":"&rthree;","˚":"&ring;","‏":"&rlm;","⎱":"&rmoustache;","⫮":"&rnmid;","⟭":"&roang;","⇾":"&roarr;","⦆":"&ropar;","𝕣":"&ropf;","⨮":"&roplus;","⨵":"&rotimes;",")":"&rpar;","⦔":"&rpargt;","⨒":"&rppolint;","›":"&rsaquo;","𝓇":"&rscr;","⋊":"&rtimes;","▹":"&triangleright;","⧎":"&rtriltri;","⥨":"&ruluhar;","℞":"&rx;","ś":"&sacute;","⪴":"&scE;","⪸":"&succapprox;","š":"&scaron;","ş":"&scedil;","ŝ":"&scirc;","⪶":"&succneqq;","⪺":"&succnapprox;","⋩":"&succnsim;","⨓":"&scpolint;","с":"&scy;","⋅":"&sdot;","⩦":"&sdote;","⇘":"&seArr;","§":"&sect;",";":"&semi;","⤩":"&tosa;","✶":"&sext;","𝔰":"&sfr;","♯":"&sharp;","щ":"&shchcy;","ш":"&shcy;","­":"&shy;","σ":"&sigma;","ς":"&varsigma;","⩪":"&simdot;","⪞":"&simg;","⪠":"&simgE;","⪝":"&siml;","⪟":"&simlE;","≆":"&simne;","⨤":"&simplus;","⥲":"&simrarr;","⨳":"&smashp;","⧤":"&smeparsl;","⌣":"&ssmile;","⪪":"&smt;","⪬":"&smte;","⪬︀":"&smtes;","ь":"&softcy;","/":"&sol;","⧄":"&solb;","⌿":"&solbar;","𝕤":"&sopf;","♠":"&spadesuit;","⊓︀":"&sqcaps;","⊔︀":"&sqcups;","𝓈":"&sscr;","☆":"&star;","⊂":"&subset;","⫅":"&subseteqq;","⪽":"&subdot;","⫃":"&subedot;","⫁":"&submult;","⫋":"&subsetneqq;","⊊":"&subsetneq;","⪿":"&subplus;","⥹":"&subrarr;","⫇":"&subsim;","⫕":"&subsub;","⫓":"&subsup;","♪":"&sung;","¹":"&sup1;","²":"&sup2;","³":"&sup3;","⫆":"&supseteqq;","⪾":"&supdot;","⫘":"&supdsub;","⫄":"&supedot;","⟉":"&suphsol;","⫗":"&suphsub;","⥻":"&suplarr;","⫂":"&supmult;","⫌":"&supsetneqq;","⊋":"&supsetneq;","⫀":"&supplus;","⫈":"&supsim;","⫔":"&supsub;","⫖":"&supsup;","⇙":"&swArr;","⤪":"&swnwar;","ß":"&szlig;","⌖":"&target;","τ":"&tau;","ť":"&tcaron;","ţ":"&tcedil;","т":"&tcy;","⌕":"&telrec;","𝔱":"&tfr;","θ":"&theta;","ϑ":"&vartheta;","þ":"&thorn;","×":"&times;","⨱":"&timesbar;","⨰":"&timesd;","⌶":"&topbot;","⫱":"&topcir;","𝕥":"&topf;","⫚":"&topfork;","‴":"&tprime;","▵":"&utri;","≜":"&trie;","◬":"&tridot;","⨺":"&triminus;","⨹":"&triplus;","⧍":"&trisb;","⨻":"&tritime;","⏢":"&trpezium;","𝓉":"&tscr;","ц":"&tscy;","ћ":"&tshcy;","ŧ":"&tstrok;","⥣":"&uHar;","ú":"&uacute;","ў":"&ubrcy;","ŭ":"&ubreve;","û":"&ucirc;","у":"&ucy;","ű":"&udblac;","⥾":"&ufisht;","𝔲":"&ufr;","ù":"&ugrave;","▀":"&uhblk;","⌜":"&ulcorner;","⌏":"&ulcrop;","◸":"&ultri;","ū":"&umacr;","ų":"&uogon;","𝕦":"&uopf;","υ":"&upsilon;","⇈":"&uuarr;","⌝":"&urcorner;","⌎":"&urcrop;","ů":"&uring;","◹":"&urtri;","𝓊":"&uscr;","⋰":"&utdot;","ũ":"&utilde;","ü":"&uuml;","⦧":"&uwangle;","⫨":"&vBar;","⫩":"&vBarv;","⦜":"&vangrt;","⊊︀":"&vsubne;","⫋︀":"&vsubnE;","⊋︀":"&vsupne;","⫌︀":"&vsupnE;","в":"&vcy;","⊻":"&veebar;","≚":"&veeeq;","⋮":"&vellip;","𝔳":"&vfr;","𝕧":"&vopf;","𝓋":"&vscr;","⦚":"&vzigzag;","ŵ":"&wcirc;","⩟":"&wedbar;","≙":"&wedgeq;","℘":"&wp;","𝔴":"&wfr;","𝕨":"&wopf;","𝓌":"&wscr;","𝔵":"&xfr;","ξ":"&xi;","⋻":"&xnis;","𝕩":"&xopf;","𝓍":"&xscr;","ý":"&yacute;","я":"&yacy;","ŷ":"&ycirc;","ы":"&ycy;","¥":"&yen;","𝔶":"&yfr;","ї":"&yicy;","𝕪":"&yopf;","𝓎":"&yscr;","ю":"&yucy;","ÿ":"&yuml;","ź":"&zacute;","ž":"&zcaron;","з":"&zcy;","ż":"&zdot;","ζ":"&zeta;","𝔷":"&zfr;","ж":"&zhcy;","⇝":"&zigrarr;","𝕫":"&zopf;","𝓏":"&zscr;","‍":"&zwj;","‌":"&zwnj;"}}};

/***/ }),

/***/ "../../node_modules/html-entities/lib/numeric-unicode-map.js":
/*!*******************************************************************!*\
  !*** ../../node_modules/html-entities/lib/numeric-unicode-map.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.numericUnicodeMap={0:65533,128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};

/***/ }),

/***/ "../../node_modules/html-entities/lib/surrogate-pairs.js":
/*!***************************************************************!*\
  !*** ../../node_modules/html-entities/lib/surrogate-pairs.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.fromCodePoint=String.fromCodePoint||function(astralCodePoint){return String.fromCharCode(Math.floor((astralCodePoint-65536)/1024)+55296,(astralCodePoint-65536)%1024+56320)};exports.getCodePoint=String.prototype.codePointAt?function(input,position){return input.codePointAt(position)}:function(input,position){return(input.charCodeAt(position)-55296)*1024+input.charCodeAt(position+1)-56320+65536};exports.highSurrogateFrom=55296;exports.highSurrogateTo=56319;

/***/ }),

/***/ "./page/source/shader.wgsl":
/*!*********************************!*\
  !*** ./page/source/shader.wgsl ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// ------------------------- Object Values ---------------------- //\r\n@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;\r\n@group(0) @binding(1) var<storage, read> instancePositions: array<vec4<f32>>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// ------------------------- World Values ---------------------- //\r\n@group(1) @binding(0) var<uniform> viewProjectionMatrix: mat4x4<f32>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// ------------------------- User Inputs ------------------------ //\r\n@group(2) @binding(0) var cubetextureSampler: sampler;\r\n@group(2) @binding(1) var cubeTexture: texture_2d<f32>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// --------------------- Light calculations --------------------- //\r\nstruct AmbientLight {\r\n    color: vec4<f32>\r\n}\r\n@group(1) @binding(1) var<uniform> ambientLight: AmbientLight;\r\n\r\nstruct PointLight {\r\n    position: vec4<f32>,\r\n    color: vec4<f32>,\r\n    range: f32\r\n}\r\n@group(1) @binding(2) var<storage, read> pointLights: array<PointLight>;\r\n\r\n/**\r\n * Calculate point light output.\r\n */\r\nfn calculatePointLights(fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r\n    // Count of point lights.\r\n    let pointLightCount: u32 = arrayLength(&pointLights);\r\n\r\n    var lightResult: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r\n\r\n    for (var index: u32 = 0; index < pointLightCount; index++) {\r\n        var pointLight: PointLight = pointLights[index];\r\n\r\n        // Calculate light strength based on angle of incidence.\r\n        let lightDirection: vec4<f32> = normalize(pointLight.position - fragmentPosition);\r\n        let diffuse: f32 = max(dot(normal, lightDirection), 0.0);\r\n\r\n        lightResult += pointLight.color * diffuse;\r\n    }\r\n\r\n    return lightResult;\r\n}\r\n\r\n/**\r\n * Apply lights to fragment color.\r\n */\r\nfn applyLight(colorIn: vec4<f32>, fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r\n    var lightColor: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r\n\r\n    lightColor += ambientLight.color;\r\n    lightColor += calculatePointLights(fragmentPosition, normal);\r\n\r\n    return lightColor * colorIn;\r\n}\r\n// -------------------------------------------------------------- //\r\n\r\nstruct VertexOut {\r\n    @builtin(position) position: vec4<f32>,\r\n    @location(0) uv: vec2<f32>,\r\n    @location(1) normal: vec4<f32>,\r\n    @location(2) fragmentPosition: vec4<f32>\r\n}\r\n\r\nstruct VertexIn {\r\n    @builtin(instance_index) instanceId : u32,\r\n    @location(0) position: vec4<f32>,\r\n    @location(1) uv: vec2<f32>,\r\n    @location(2) normal: vec4<f32>\r\n}\r\n\r\n@vertex\r\nfn vertex_main(vertex: VertexIn) -> VertexOut {\r\n    var instancePosition: vec4<f32> = instancePositions[vertex.instanceId];\r\n    var instancePositionMatrix: mat4x4<f32> = mat4x4<f32>(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, instancePosition.x * 5, instancePosition.y * 5, instancePosition.z * 5, 1);\r\n\r\n    var out: VertexOut;\r\n    out.position = viewProjectionMatrix * transformationMatrix * instancePositionMatrix * vertex.position;\r\n    out.uv = vertex.uv;\r\n    out.normal = vertex.normal;\r\n    out.fragmentPosition = transformationMatrix * instancePositionMatrix * vertex.position;\r\n\r\n    return out;\r\n}\r\n\r\nstruct FragmentIn {\r\n    @location(0) uv: vec2<f32>,\r\n    @location(1) normal: vec4<f32>,\r\n    @location(2) fragmentPosition: vec4<f32>\r\n}\r\n\r\n@fragment\r\nfn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {\r\n    return applyLight(textureSample(cubeTexture, cubetextureSampler, fragment.uv), fragment.fragmentPosition, fragment.normal);\r\n}");

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
 * @typedef {Object} Options
 * @property {boolean} hot
 * @property {boolean} liveReload
 * @property {boolean} progress
 * @property {boolean | { warnings?: boolean, errors?: boolean, runtimeErrors?: boolean, trustedTypesPolicyName?: string }} overlay
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
    var needShowOverlayForWarnings = typeof options.overlay === "boolean" ? options.overlay : options.overlay && options.overlay.warnings;
    if (needShowOverlayForWarnings) {
      overlay.send({
        type: "BUILD_ERROR",
        level: "warning",
        messages: _warnings
      });
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
    var needShowOverlayForErrors = typeof options.overlay === "boolean" ? options.overlay : options.overlay && options.overlay.errors;
    if (needShowOverlayForErrors) {
      overlay.send({
        type: "BUILD_ERROR",
        level: "error",
        messages: _errors
      });
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
/* harmony export */   "createOverlay": () => (/* binding */ createOverlay),
/* harmony export */   "formatProblem": () => (/* binding */ formatProblem)
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
 * @property {boolean} [catchRuntimeError]
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
      var headerElement = document.createElement("div");
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
   */
  function show(type, messages, trustedTypesPolicyName) {
    ensureOverlayExists(function () {
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
        messages = _ref.messages;
      return show(level, messages, options.trustedTypesPolicyName);
    },
    hideOverlay: hide
  });
  if (options.catchRuntimeError) {
    (0,_overlay_runtime_error_js__WEBPACK_IMPORTED_MODULE_1__.listenToRuntimeError)(function (errorEvent) {
      // error property may be empty in older browser like IE
      var error = errorEvent.error,
        message = errorEvent.message;
      if (!error && !message) {
        return;
      }
      var errorObject = error instanceof Error ? error : new Error(error || message);
      overlayService.send({
        type: "RUNTIME_ERROR",
        messages: [{
          message: errorObject.message,
          stack: (0,_overlay_runtime_error_js__WEBPACK_IMPORTED_MODULE_1__.parseErrorToStacks)(errorObject)
        }]
      });
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
/* harmony export */   "listenToRuntimeError": () => (/* binding */ listenToRuntimeError),
/* harmony export */   "parseErrorToStacks": () => (/* binding */ parseErrorToStacks)
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
      messages: []
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
          level: "error"
        };
      },
      appendMessages: function appendMessages(context, event) {
        return {
          messages: context.messages.concat(event.messages),
          level: event.level || context.level
        };
      },
      setMessages: function setMessages(context, event) {
        return {
          messages: event.messages,
          level: event.level || context.level
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
/* harmony export */   "containerStyle": () => (/* binding */ containerStyle),
/* harmony export */   "dismissButtonStyle": () => (/* binding */ dismissButtonStyle),
/* harmony export */   "headerStyle": () => (/* binding */ headerStyle),
/* harmony export */   "iframeStyle": () => (/* binding */ iframeStyle),
/* harmony export */   "msgStyles": () => (/* binding */ msgStyles),
/* harmony export */   "msgTextStyle": () => (/* binding */ msgTextStyle),
/* harmony export */   "msgTypeStyle": () => (/* binding */ msgTypeStyle)
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
/* harmony export */   "client": () => (/* binding */ client),
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
/* harmony export */   "log": () => (/* binding */ log),
/* harmony export */   "logEnabledFeatures": () => (/* binding */ logEnabledFeatures),
/* harmony export */   "setLogLevel": () => (/* binding */ setLogLevel)
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
	var lastHash;
	var upToDate = function upToDate() {
		return lastHash.indexOf(__webpack_require__.h()) >= 0;
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

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

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

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function (level) {
	logLevel = level;
};

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

/***/ "../kartoffelgames.core.data/library/source/data_container/dictionary/dictionary.js":
/*!******************************************************************************************!*\
  !*** ../kartoffelgames.core.data/library/source/data_container/dictionary/dictionary.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

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

"use strict";

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

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseTree = void 0;
const dictionary_1 = __webpack_require__(/*! ../dictionary/dictionary */ "../kartoffelgames.core.data/library/source/data_container/dictionary/dictionary.js");
const list_1 = __webpack_require__(/*! ../list/list */ "../kartoffelgames.core.data/library/source/data_container/list/list.js");
/**
 * BaseTree with generic path.
 */
class BaseTree {
    /**
     * Constructor.
     * Basic initialization.
     */
    constructor() {
        this.mBranches = new dictionary_1.Dictionary();
        this.mParent = null;
    }
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

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListTree = void 0;
const base_tree_1 = __webpack_require__(/*! ./base-tree */ "../kartoffelgames.core.data/library/source/data_container/tree/base-tree.js");
const list_1 = __webpack_require__(/*! ../list/list */ "../kartoffelgames.core.data/library/source/data_container/list/list.js");
/**
 * Tree with additional item list.
 */
class ListTree extends base_tree_1.BaseTree {
    /**
     * Initialise list.
     */
    constructor() {
        super();
        this.mItemList = new list_1.List();
    }
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

"use strict";

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

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Exception = void 0;
/**
 * Basic exception.
 */
class Exception extends Error {
    /**
     * Constructor. Create exception.
     * @param pMessage - Messsage of exception.
     * @param pTarget - Target exception throws.
     */
    constructor(pMessage, pTarget) {
        super(pMessage);
        this.mTarget = pTarget;
    }
    /**
     * Target exception throws.
     */
    get target() {
        return this.mTarget;
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

"use strict";

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

"use strict";

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

"use strict";

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

/***/ }),

/***/ "../kartoffelgames.web.game_input/library/source/configuration/device-configuration.js":
/*!*********************************************************************************************!*\
  !*** ../kartoffelgames.web.game_input/library/source/configuration/device-configuration.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DeviceConfiguration = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
class DeviceConfiguration {
    /**
     * Constructor.
     */
    constructor() {
        this.mTriggerTolerance = 0;
        this.mButtonActions = new core_data_1.Dictionary();
        this.mActionsButtons = new core_data_1.Dictionary();
    }
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
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const button_value_type_enum_1 = __webpack_require__(/*! ../enum/button-value-type.enum */ "../kartoffelgames.web.game_input/library/source/enum/button-value-type.enum.js");
/**
 * Gamepad mapping.
 */
class GamepadButtonMapping {
    /**
     * Constructor.
     */
    constructor(pMapping) {
        this.mMapping = new core_data_1.Dictionary();
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
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const button_value_type_enum_1 = __webpack_require__(/*! ../enum/button-value-type.enum */ "../kartoffelgames.web.game_input/library/source/enum/button-value-type.enum.js");
const gamepad_button_mapping_1 = __webpack_require__(/*! ./gamepad-button-mapping */ "../kartoffelgames.web.game_input/library/source/configuration/gamepad-button-mapping.js");
class InputConfiguration {
    /**
     * Constructor.
     */
    constructor(pDefault) {
        this.mGampadMappingList = new Array();
        this.mDeviceSettings = new core_data_1.Dictionary();
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
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const gamepad_input_device_1 = __webpack_require__(/*! ../device/gamepad-input-device */ "../kartoffelgames.web.game_input/library/source/device/gamepad-input-device.js");
/**
 * Handles connect and disconnection of gamepads.
 */
class GamepadConnector {
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
GamepadConnector.mGamepads = new core_data_1.Dictionary();
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
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const input_action_event_1 = __webpack_require__(/*! ../event/input-action-event */ "../kartoffelgames.web.game_input/library/source/event/input-action-event.js");
const input_button_event_1 = __webpack_require__(/*! ../event/input-button-event */ "../kartoffelgames.web.game_input/library/source/event/input-button-event.js");
class BaseInputDevice extends EventTarget {
    /**
     * Constructor.s
     * @param pId - Game input id.
     */
    constructor(pId, pDeviceType, pDeviceConfiguration) {
        super();
        this.mId = pId;
        this.mConnected = false;
        this.mDeviceType = pDeviceType;
        this.mButtonState = new core_data_1.Dictionary();
        this.mActionStates = new core_data_1.Dictionary();
        this.mDeviceConfiguration = pDeviceConfiguration;
    }
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
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
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
        const lGamepadButtonList = core_data_1.EnumUtil.enumValuesToArray(gamepad_button_enum_1.GamepadButton);
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
})(ButtonValueType = exports.ButtonValueType || (exports.ButtonValueType = {}));
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
})(GamepadButton = exports.GamepadButton || (exports.GamepadButton = {}));
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
})(InputDevice = exports.InputDevice || (exports.InputDevice = {}));
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
})(KeyboardButton = exports.KeyboardButton || (exports.KeyboardButton = {}));
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
})(MouseButton = exports.MouseButton || (exports.MouseButton = {}));
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
     * Constructor.
     * @param pType - Event type.
     * @param pState - Button state.
     */
    constructor(pType, pButton, pState) {
        super(pType);
        this.mState = pState;
        this.mButton = pButton;
    }
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
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
class InputDevices {
    /**
     * Constructor.
     * @param pConfiguration - input configuration.
     */
    constructor(pConfiguration) {
        this.mConnectionChangeListenerList = new Array();
        this.mInputDevices = new core_data_1.Dictionary();
        this.mConfiguration = pConfiguration;
    }
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
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
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
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
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
/******/ 		__webpack_require__.h = () => ("2f59fc4360d34aca6ef8")
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
/******/ 		var dataWebpackPrefix = "@kartoffelgames/web.gpu:";
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
/******/ 		// eslint-disable-next-line no-unused-vars
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
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
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
/******/ 			return Promise.all(results);
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
/******/ 							},
/******/ 							[])
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
/******/ 					while (i > -1 && !scriptUrl) scriptUrl = scripts[i--].src;
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
/******/ 		self["webpackHotUpdate_kartoffelgames_web_gpu"] = (chunkId, moreModules, runtime) => {
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
/******/ 	
/******/ })()
;
//# sourceMappingURL=page.js.map