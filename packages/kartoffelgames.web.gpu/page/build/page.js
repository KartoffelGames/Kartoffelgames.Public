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

/***/ "./page/source/cube/cube.ts":
/*!**********************************!*\
  !*** ./page/source/cube/cube.ts ***!
  \**********************************/
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
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const web_game_input_1 = __webpack_require__(/*! @kartoffelgames/web.game-input */ "../kartoffelgames.web.game_input/library/source/index.js");
const bind_group_layout_1 = __webpack_require__(/*! ../../source/base/binding/bind-group-layout */ "./source/base/binding/bind-group-layout.ts");
const gpu_device_1 = __webpack_require__(/*! ../../source/base/gpu/gpu-device */ "./source/base/gpu/gpu-device.ts");
const primitive_buffer_format_enum_1 = __webpack_require__(/*! ../../source/base/memory_layout/buffer/enum/primitive-buffer-format.enum */ "./source/base/memory_layout/buffer/enum/primitive-buffer-format.enum.ts");
const primitive_buffer_multiplier_enum_1 = __webpack_require__(/*! ../../source/base/memory_layout/buffer/enum/primitive-buffer-multiplier.enum */ "./source/base/memory_layout/buffer/enum/primitive-buffer-multiplier.enum.ts");
const compute_stage_enum_1 = __webpack_require__(/*! ../../source/constant/compute-stage.enum */ "./source/constant/compute-stage.enum.ts");
const primitive_cullmode_enum_1 = __webpack_require__(/*! ../../source/constant/primitive-cullmode.enum */ "./source/constant/primitive-cullmode.enum.ts");
const sampler_type_enum_1 = __webpack_require__(/*! ../../source/constant/sampler-type.enum */ "./source/constant/sampler-type.enum.ts");
const storage_binding_type_enum_1 = __webpack_require__(/*! ../../source/constant/storage-binding-type.enum */ "./source/constant/storage-binding-type.enum.ts");
const texture_dimension_enum_1 = __webpack_require__(/*! ../../source/constant/texture-dimension.enum */ "./source/constant/texture-dimension.enum.ts");
const texture_format_enum_1 = __webpack_require__(/*! ../../source/constant/texture-format.enum */ "./source/constant/texture-format.enum.ts");
const vertex_parameter_step_mode_enum_1 = __webpack_require__(/*! ../../source/constant/vertex-parameter-step-mode.enum */ "./source/constant/vertex-parameter-step-mode.enum.ts");
const cube_1 = __webpack_require__(/*! ./cube/cube */ "./page/source/cube/cube.ts");
const light_box_shader_wgsl_1 = __webpack_require__(/*! ./light-box-shader.wgsl */ "./page/source/light-box-shader.wgsl");
const shader_wgsl_1 = __webpack_require__(/*! ./shader.wgsl */ "./page/source/shader.wgsl");
const ambient_light_1 = __webpack_require__(/*! ./something_better/light/ambient-light */ "./page/source/something_better/light/ambient-light.ts");
const transform_1 = __webpack_require__(/*! ./something_better/transform */ "./page/source/something_better/transform.ts");
const perspective_projection_1 = __webpack_require__(/*! ./something_better/view_projection/projection/perspective-projection */ "./page/source/something_better/view_projection/projection/perspective-projection.ts");
const view_projection_1 = __webpack_require__(/*! ./something_better/view_projection/view-projection */ "./page/source/something_better/view_projection/view-projection.ts");
const gHeight = 100;
const gWidth = 100;
const gDepth = 100;
const gInitCameraControls = (pCanvas, pCamera, pCameraBuffer) => {
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
    pCameraBuffer.writeRaw(pCamera.getMatrix(view_projection_1.CameraMatrix.ViewProjection).dataArray);
  }, 8);
  pCanvas.addEventListener('click', () => {
    pCanvas.requestPointerLock();
  });
};
_asyncToGenerator(function* () {
  const lGpu = yield gpu_device_1.GpuDevice.request('high-performance');
  // Create canvas.
  const lCanvasTexture = lGpu.canvas(document.getElementById('canvas'));
  // Create and configure render targets.
  const lRenderTargets = lGpu.renderTargets().setup(pSetup => {
    // Add "color" target and init new texture.
    pSetup.addColor('color', 0, true, {
      r: 1,
      g: 0.5,
      b: 0.5,
      a: 0
    }).use(lCanvasTexture);
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
      lRenderTargets.resize(lNewCanvasHeight, lNewCanvasWidth, 4);
    }).observe(lCanvasWrapper);
  })();
  // Create shader.
  const lWoodBoxShader = lGpu.shader(shader_wgsl_1.default).setup(pShaderSetup => {
    // Set parameter.
    pShaderSetup.parameter('animationSeconds', compute_stage_enum_1.ComputeStage.Vertex);
    // Vertex entry.
    pShaderSetup.vertexEntryPoint('vertex_main', pVertexParameterSetup => {
      pVertexParameterSetup.buffer('position', primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Index).withParameter('position', 0, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector4);
      pVertexParameterSetup.buffer('uv', primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Vertex).withParameter('uv', 1, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector2);
      pVertexParameterSetup.buffer('normal', primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Vertex).withParameter('normal', 2, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector4);
    });
    // Fragment entry.
    pShaderSetup.fragmentEntryPoint('fragment_main').addRenderTarget('main', 0, primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector4);
    // Object bind group.
    pShaderSetup.group(0, new bind_group_layout_1.BindGroupLayout(lGpu, 'object').setup(pBindGroupSetup => {
      pBindGroupSetup.binding(0, 'transformationMatrix', compute_stage_enum_1.ComputeStage.Vertex).withPrimitive(primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix44);
      pBindGroupSetup.binding(1, 'instancePositions', compute_stage_enum_1.ComputeStage.Vertex, storage_binding_type_enum_1.StorageBindingType.Read).withArray().withPrimitive(primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector4);
    }));
    // World bind group.
    pShaderSetup.group(1, new bind_group_layout_1.BindGroupLayout(lGpu, 'world').setup(pBindGroupSetup => {
      pBindGroupSetup.binding(0, 'viewProjectionMatrix', compute_stage_enum_1.ComputeStage.Vertex).withPrimitive(primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix44);
      pBindGroupSetup.binding(1, 'timestamp', compute_stage_enum_1.ComputeStage.Vertex).withPrimitive(primitive_buffer_format_enum_1.PrimitiveBufferFormat.Uint32, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Single);
      pBindGroupSetup.binding(2, 'ambientLight', compute_stage_enum_1.ComputeStage.Fragment).withStruct(pStruct => {
        pStruct.property('color').asPrimitive(primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector4);
      });
      pBindGroupSetup.binding(3, 'pointLights', compute_stage_enum_1.ComputeStage.Fragment | compute_stage_enum_1.ComputeStage.Vertex, storage_binding_type_enum_1.StorageBindingType.Read).withArray().withStruct(pStruct => {
        pStruct.property('position').asPrimitive(primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector4);
        pStruct.property('color').asPrimitive(primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector4);
        pStruct.property('range').asPrimitive(primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Single);
      });
      pBindGroupSetup.binding(4, 'debugValue', compute_stage_enum_1.ComputeStage.Fragment, storage_binding_type_enum_1.StorageBindingType.ReadWrite).withPrimitive(primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Single);
    }));
    // User bind group
    pShaderSetup.group(2, new bind_group_layout_1.BindGroupLayout(lGpu, 'user').setup(pBindGroupSetup => {
      pBindGroupSetup.binding(0, 'cubeTextureSampler', compute_stage_enum_1.ComputeStage.Fragment).withSampler(sampler_type_enum_1.SamplerType.Filter);
      pBindGroupSetup.binding(1, 'cubeTexture', compute_stage_enum_1.ComputeStage.Fragment).withTexture(texture_dimension_enum_1.TextureDimension.TwoDimension, texture_format_enum_1.TextureFormat.Rgba8unorm, false);
    }));
  });
  // Create shader.
  const lLightBoxShader = lGpu.shader(light_box_shader_wgsl_1.default).setup(pShaderSetup => {
    // Vertex entry.
    pShaderSetup.vertexEntryPoint('vertex_main', pVertexParameterSetup => {
      pVertexParameterSetup.buffer('position', primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Index).withParameter('position', 0, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector4);
      pVertexParameterSetup.buffer('uv', primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Vertex).withParameter('uv', 1, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector2);
      pVertexParameterSetup.buffer('normal', primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, vertex_parameter_step_mode_enum_1.VertexParameterStepMode.Vertex).withParameter('normal', 2, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector4);
    });
    // Fragment entry.
    pShaderSetup.fragmentEntryPoint('fragment_main').addRenderTarget('main', 0, primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector4);
    // Object bind group.
    pShaderSetup.group(0, new bind_group_layout_1.BindGroupLayout(lGpu, 'object').setup(pBindGroupSetup => {
      pBindGroupSetup.binding(0, 'transformationMatrix', compute_stage_enum_1.ComputeStage.Vertex).withPrimitive(primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix44);
    }));
    // World bind group.
    pShaderSetup.group(1, lWoodBoxShader.layout.getGroupLayout('world'));
  });
  // Create render module from shader.
  const lWoodBoxRenderModule = lWoodBoxShader.createRenderModule('vertex_main', 'fragment_main');
  const lLightBoxRenderModule = lLightBoxShader.createRenderModule('vertex_main', 'fragment_main');
  /*
   * Transformation and position group.
   */
  const lWoodBoxTransformationGroup = lWoodBoxRenderModule.layout.getGroupLayout('object').create();
  // Create transformation.
  const lWoodBoxTransform = new transform_1.Transform();
  lWoodBoxTransform.setScale(1, 1, 1);
  lWoodBoxTransformationGroup.data('transformationMatrix').createBuffer(new Float32Array(lWoodBoxTransform.getMatrix(transform_1.TransformMatrix.Transformation).dataArray));
  // Create instance positions.
  const lCubeInstanceTransformationData = new Array();
  for (let lWidthIndex = 0; lWidthIndex < gWidth; lWidthIndex++) {
    for (let lHeightIndex = 0; lHeightIndex < gHeight; lHeightIndex++) {
      for (let lDepthIndex = 0; lDepthIndex < gDepth; lDepthIndex++) {
        lCubeInstanceTransformationData.push(lWidthIndex * 3, lHeightIndex * 3, lDepthIndex * 3, 1);
      }
    }
  }
  lWoodBoxTransformationGroup.data('instancePositions').createBuffer(new Float32Array(lCubeInstanceTransformationData));
  /*
   * Transformation and position group.
   */
  const lLightBoxTransformationGroup = lLightBoxShader.layout.getGroupLayout('object').create();
  // Create transformation.
  const lLightBoxTransform = new transform_1.Transform();
  lLightBoxTransform.setScale(1, 1, 1);
  lLightBoxTransformationGroup.data('transformationMatrix').createBuffer(new Float32Array(lLightBoxTransform.getMatrix(transform_1.TransformMatrix.Transformation).dataArray));
  /*
   * Camera and world group.
   */
  const lWorldGroup = lWoodBoxRenderModule.layout.getGroupLayout('world').create();
  // Create camera perspective.
  const lPerspectiveProjection = new perspective_projection_1.PerspectiveProjection();
  lPerspectiveProjection.aspectRatio = lRenderTargets.width / lRenderTargets.height;
  lPerspectiveProjection.angleOfView = 72;
  lPerspectiveProjection.near = 0.1;
  lPerspectiveProjection.far = 9999999;
  // Resize canvas.
  (() => {
    const lCanvasWrapper = document.querySelector('.canvas-wrapper');
    new ResizeObserver(() => {
      const lNewCanvasHeight = Math.max(0, lCanvasWrapper.clientHeight - 20);
      const lNewCanvasWidth = Math.max(lCanvasWrapper.clientWidth - 20, 0);
      // Resize displayed render targets.
      lPerspectiveProjection.aspectRatio = lNewCanvasWidth / lNewCanvasHeight;
    }).observe(lCanvasWrapper);
  })();
  // Create camera.
  const lCamera = new view_projection_1.ViewProjection(lPerspectiveProjection);
  lCamera.transformation.setTranslation(0, 0, -4);
  lWorldGroup.data('viewProjectionMatrix').createBuffer(new Float32Array(lCamera.getMatrix(view_projection_1.CameraMatrix.ViewProjection).dataArray));
  // Create ambient light.
  const lAmbientLight = new ambient_light_1.AmbientLight();
  lAmbientLight.setColor(0.3, 0.3, 0.3);
  lWorldGroup.data('ambientLight').createBuffer(new Float32Array(lAmbientLight.data));
  // Create point lights.
  lWorldGroup.data('pointLights').createBuffer(new Float32Array([/* Position */1, 1, 1, 1, /* Color */1, 0, 0, 1, /* Range */200, 0, 0, 0, /* Position */10, 10, 10, 1, /* Color */0, 0, 1, 1, /* Range */200, 0, 0, 0]));
  // Create timestamp.
  lWorldGroup.data('timestamp').createBuffer(new Uint32Array(1));
  const lTimestampBuffer = lWorldGroup.data('timestamp').get();
  // Create debug value.
  lWorldGroup.data('debugValue').createBuffer(new Float32Array(1));
  const lDebugBuffer = lWorldGroup.data('debugValue').get();
  window.debugBuffer = () => {
    lDebugBuffer.readRaw(0, 4).then(pResulto => {
      // eslint-disable-next-line no-console
      console.log(pResulto);
    });
  };
  /*
   * User defined group.
   */
  const lWoodBoxUserGroup = lWoodBoxRenderModule.layout.getGroupLayout('user').create();
  // Setup cube texture.
  yield lWoodBoxUserGroup.data('cubeTexture').createImage('/source/cube/cube-texture.png');
  // Setup Sampler.
  lWoodBoxUserGroup.data('cubeTextureSampler').createSampler();
  // Generate render parameter from parameter layout.
  const lMesh = lWoodBoxRenderModule.vertexParameter.create(cube_1.CubeVertexIndices);
  lMesh.set('position', cube_1.CubeVertexPositionData);
  lMesh.set('uv', cube_1.CubeVertexUvData);
  lMesh.set('normal', cube_1.CubeVertexNormalData);
  // Create pipeline.
  const lWoodBoxPipeline = lWoodBoxRenderModule.create(lRenderTargets);
  lWoodBoxPipeline.primitiveCullMode = primitive_cullmode_enum_1.PrimitiveCullMode.Front;
  lWoodBoxPipeline.setParameter('animationSeconds', 3);
  window.animationSpeed = pSeconds => {
    lWoodBoxPipeline.setParameter('animationSeconds', pSeconds);
  };
  const lLightBoxPipeline = lLightBoxRenderModule.create(lRenderTargets);
  lLightBoxPipeline.primitiveCullMode = primitive_cullmode_enum_1.PrimitiveCullMode.Front;
  // Create instruction.
  const lRenderPass = lGpu.renderPass(lRenderTargets);
  lRenderPass.addStep(lWoodBoxPipeline, lMesh, [lWoodBoxTransformationGroup, lWorldGroup, lWoodBoxUserGroup], gWidth * gHeight * gDepth);
  lRenderPass.addStep(lLightBoxPipeline, lMesh, [lLightBoxTransformationGroup, lWorldGroup], lWorldGroup.data('pointLights').get().length / 12);
  /**
   * Controls
   */
  gInitCameraControls(lCanvasTexture.canvas, lCamera, lWorldGroup.data('viewProjectionMatrix').get());
  /*
   * Execution
   */
  const lRenderExecutor = lGpu.executor(pExecutor => {
    lRenderPass.execute(pExecutor);
  });
  const lFpsLabel = document.getElementById('fpsCounter');
  // Actual execute.
  let lLastTime = 0;
  const lRender = pTime => {
    // Start new frame.
    lGpu.startNewFrame();
    // Update time stamp data.
    lTimestampBuffer.write([pTime], []);
    // Generate encoder and add render commands.
    lRenderExecutor.execute();
    const lFps = 1000 / (pTime - lLastTime);
    window.currentFps = lFps;
    lLastTime = pTime;
    // Update FPS counter.
    lFpsLabel.textContent = lFps.toString();
    // Refresh canvas
    requestAnimationFrame(lRender);
  };
  requestAnimationFrame(lRender);
})();

/***/ }),

/***/ "./page/source/math/euler.ts":
/*!***********************************!*\
  !*** ./page/source/math/euler.ts ***!
  \***********************************/
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

/***/ "./page/source/math/matrix.ts":
/*!************************************!*\
  !*** ./page/source/math/matrix.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Matrix = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
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

/***/ "./page/source/math/quaternion.ts":
/*!****************************************!*\
  !*** ./page/source/math/quaternion.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


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

/***/ "./page/source/something_better/light/ambient-light.ts":
/*!*************************************************************!*\
  !*** ./page/source/something_better/light/ambient-light.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AmbientLight = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
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
      throw new core_1.Exception(`Color values need to be in 0 to 1 range. (R:${pRed}, G:${pGreen}, B:${pBlue})`, this);
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

"use strict";


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

"use strict";


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

"use strict";


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

/***/ "./source/base/binding/bind-group-data-setup.ts":
/*!******************************************************!*\
  !*** ./source/base/binding/bind-group-data-setup.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroupDataSetup = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gpu_buffer_1 = __webpack_require__(/*! ../buffer/gpu-buffer */ "./source/base/buffer/gpu-buffer.ts");
const gpu_object_child_setup_1 = __webpack_require__(/*! ../gpu/object/gpu-object-child-setup */ "./source/base/gpu/object/gpu-object-child-setup.ts");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ../memory_layout/buffer/base-buffer-memory-layout */ "./source/base/memory_layout/buffer/base-buffer-memory-layout.ts");
const primitive_buffer_format_enum_1 = __webpack_require__(/*! ../memory_layout/buffer/enum/primitive-buffer-format.enum */ "./source/base/memory_layout/buffer/enum/primitive-buffer-format.enum.ts");
const sampler_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/sampler-memory-layout */ "./source/base/memory_layout/texture/sampler-memory-layout.ts");
const texture_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/texture-memory-layout */ "./source/base/memory_layout/texture/texture-memory-layout.ts");
const image_texture_1 = __webpack_require__(/*! ../texture/image-texture */ "./source/base/texture/image-texture.ts");
const texture_sampler_1 = __webpack_require__(/*! ../texture/texture-sampler */ "./source/base/texture/texture-sampler.ts");
const video_texture_1 = __webpack_require__(/*! ../texture/video-texture */ "./source/base/texture/video-texture.ts");
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
  createBuffer(pDataOrType, pVariableSizeCount = null) {
    // Layout must be a buffer memory layout.
    if (!(this.mBindLayout.layout instanceof base_buffer_memory_layout_1.BaseBufferMemoryLayout)) {
      throw new core_1.Exception(`Bind data layout is not suitable for buffers.`, this);
    }
    // Read buffer type from parameter.
    const lBufferFormat = (() => {
      // Parameter is type.
      if (typeof pDataOrType === 'string') {
        return pDataOrType;
      }
      // Get buffer type from typed array.
      switch (true) {
        case pDataOrType instanceof Float32Array:
          {
            return primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32;
          }
        case pDataOrType instanceof Uint32Array:
          {
            return primitive_buffer_format_enum_1.PrimitiveBufferFormat.Uint32;
          }
        case pDataOrType instanceof Int32Array:
          {
            return primitive_buffer_format_enum_1.PrimitiveBufferFormat.Sint32;
          }
        default:
          {
            throw new core_1.Exception(`Buffer data is not suitable for binding buffer creation`, this);
          }
      }
    })();
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
    // Create buffer.
    const lBuffer = new gpu_buffer_1.GpuBuffer(this.device, this.mBindLayout.layout, lBufferFormat, lVariableItemCount);
    // Add initial data.
    if (typeof pDataOrType === 'object') {
      lBuffer.initialData(() => {
        return pDataOrType;
      });
    }
    // Send created data.
    this.sendData(lBuffer);
  }
  /**
   * Create new image texture with loaded images.
   *
   * @param pSourceList - Image source list.
   *
   * @returns promise that resolves when all images are loaded.
   */
  createImage(...pSourceList) {
    var _this = this;
    return _asyncToGenerator(function* () {
      // Layout must be a texture memory layout.
      if (!(_this.mBindLayout.layout instanceof texture_memory_layout_1.TextureMemoryLayout)) {
        throw new core_1.Exception(`Bind data layout is not suitable for image textures.`, _this);
      }
      // Create image texture.
      const lTexture = new image_texture_1.ImageTexture(_this.device, _this.mBindLayout.layout);
      // Load images async.
      const lImageLoading = lTexture.load(...pSourceList);
      // Send created texture to parent bind group.
      _this.sendData(lTexture);
      return lImageLoading;
    })();
  }
  /**
   * Create new sampler.
   */
  createSampler() {
    // Layout must be a sampler memory layout.
    if (!(this.mBindLayout.layout instanceof sampler_memory_layout_1.SamplerMemoryLayout)) {
      throw new core_1.Exception(`Bind data layout is not suitable for samplers.`, this);
    }
    // Send created data.
    this.sendData(new texture_sampler_1.TextureSampler(this.device, this.mBindLayout.layout));
  }
  /**
   * Create new video texture.
   *
   * @param pSource - Video source.
   */
  createVideo(pSource) {
    // Layout must be a sampler memory layout.
    if (!(this.mBindLayout.layout instanceof texture_memory_layout_1.TextureMemoryLayout)) {
      throw new core_1.Exception(`Bind data layout is not suitable for samplers.`, this);
    }
    // Create video texture with initial source.
    const lVideoTexture = new video_texture_1.VideoTexture(this.device, this.mBindLayout.layout);
    lVideoTexture.source = pSource;
    // Send created data.
    this.sendData(lVideoTexture);
  }
  /**
   * Get current binded data.
   *
   * @returns current set bind data.
   *
   * @throws {@link Exception}
   * When no data was set.
   */
  get() {
    // Validate existance.
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
   */
  set(pData) {
    this.sendData(pData);
  }
}
exports.BindGroupDataSetup = BindGroupDataSetup;

/***/ }),

/***/ "./source/base/binding/bind-group-layout.ts":
/*!**************************************************!*\
  !*** ./source/base/binding/bind-group-layout.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroupLayoutInvalidationType = exports.BindGroupLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const storage_binding_type_enum_1 = __webpack_require__(/*! ../../constant/storage-binding-type.enum */ "./source/constant/storage-binding-type.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ../memory_layout/buffer/base-buffer-memory-layout */ "./source/base/memory_layout/buffer/base-buffer-memory-layout.ts");
const sampler_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/sampler-memory-layout */ "./source/base/memory_layout/texture/sampler-memory-layout.ts");
const texture_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/texture-memory-layout */ "./source/base/memory_layout/texture/texture-memory-layout.ts");
const bind_group_1 = __webpack_require__(/*! ./bind-group */ "./source/base/binding/bind-group.ts");
const bind_group_layout_setup_1 = __webpack_require__(/*! ./setup/bind-group-layout-setup */ "./source/base/binding/setup/bind-group-layout-setup.ts");
// TODO: Find a good way to create new binding groups.
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
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
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
              hasDynamicOffset: false
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
        case lEntry.layout instanceof texture_memory_layout_1.TextureMemoryLayout:
          {
            // Uniform bind when without storage binding.
            if (lEntry.storageType === storage_binding_type_enum_1.StorageBindingType.None) {
              // Read texture capabilities.
              const lTextureFormatCapabilities = this.device.formatValidator.capabilityOf(lEntry.layout.format);
              // Create image texture bind information.
              lLayoutEntry.texture = {
                sampleType: lTextureFormatCapabilities.type[0],
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
      // Register change listener for layout changes.
      lBinding.layout.addInvalidationListener(() => {
        this.invalidate(BindGroupLayoutInvalidationType.Layout);
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
var BindGroupLayoutInvalidationType;
(function (BindGroupLayoutInvalidationType) {
  BindGroupLayoutInvalidationType["Layout"] = "LayoutChange";
  BindGroupLayoutInvalidationType["Setting"] = "BindingSettingChange";
})(BindGroupLayoutInvalidationType || (exports.BindGroupLayoutInvalidationType = BindGroupLayoutInvalidationType = {}));

/***/ }),

/***/ "./source/base/binding/bind-group.ts":
/*!*******************************************!*\
  !*** ./source/base/binding/bind-group.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroupInvalidationType = exports.BindGroup = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const buffer_usage_enum_1 = __webpack_require__(/*! ../../constant/buffer-usage.enum */ "./source/constant/buffer-usage.enum.ts");
const storage_binding_type_enum_1 = __webpack_require__(/*! ../../constant/storage-binding-type.enum */ "./source/constant/storage-binding-type.enum.ts");
const texture_usage_enum_1 = __webpack_require__(/*! ../../constant/texture-usage.enum */ "./source/constant/texture-usage.enum.ts");
const gpu_buffer_1 = __webpack_require__(/*! ../buffer/gpu-buffer */ "./source/base/buffer/gpu-buffer.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ../memory_layout/buffer/base-buffer-memory-layout */ "./source/base/memory_layout/buffer/base-buffer-memory-layout.ts");
const sampler_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/sampler-memory-layout */ "./source/base/memory_layout/texture/sampler-memory-layout.ts");
const texture_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/texture-memory-layout */ "./source/base/memory_layout/texture/texture-memory-layout.ts");
const base_texture_1 = __webpack_require__(/*! ../texture/base-texture */ "./source/base/texture/base-texture.ts");
const canvas_texture_1 = __webpack_require__(/*! ../texture/canvas-texture */ "./source/base/texture/canvas-texture.ts");
const frame_buffer_texture_1 = __webpack_require__(/*! ../texture/frame-buffer-texture */ "./source/base/texture/frame-buffer-texture.ts");
const image_texture_1 = __webpack_require__(/*! ../texture/image-texture */ "./source/base/texture/image-texture.ts");
const texture_sampler_1 = __webpack_require__(/*! ../texture/texture-sampler */ "./source/base/texture/texture-sampler.ts");
const bind_group_data_setup_1 = __webpack_require__(/*! ./bind-group-data-setup */ "./source/base/binding/bind-group-data-setup.ts");
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
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    this.mLayout = pBindGroupLayout;
    this.mBindData = new core_1.Dictionary();
    // Register change listener for layout changes.
    pBindGroupLayout.addInvalidationListener(() => {
      this.invalidate(BindGroupInvalidationType.Layout);
    });
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
        case pData instanceof base_texture_1.BaseTexture:
          {
            if (!(lBindLayout.layout instanceof texture_memory_layout_1.TextureMemoryLayout)) {
              throw new core_1.Exception(`Texture added to bind data "${pBindName}" but binding does not expect a texture.`, this);
            }
            // Extend buffer usage based on if it is a storage or not.
            if (lBindLayout.storageType !== storage_binding_type_enum_1.StorageBindingType.None) {
              pData.extendUsage(texture_usage_enum_1.TextureUsage.Storage);
            } else {
              pData.extendUsage(texture_usage_enum_1.TextureUsage.Texture);
            }
            break;
          }
        default:
          {
            throw new core_1.Exception(`Unsupported resource added to bind data "${pBindName}".`, this);
          }
      }
      // Set data.
      this.mBindData.set(pBindName, pData);
      // Trigger update data is invalid.
      pData.addInvalidationListener(() => {
        this.invalidate(BindGroupInvalidationType.Data);
      });
      // Trigger update on data change. 
      this.invalidate(BindGroupInvalidationType.Data);
    });
  }
  /**
   * Generate native gpu bind data group.
   */
  generateNative() {
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
      // Frame buffer bind.
      if (lBindData instanceof frame_buffer_texture_1.FrameBufferTexture) {
        lGroupEntry.resource = lBindData.native;
        lEntryList.push(lGroupEntry);
        continue;
      }
      // Image texture bind.
      if (lBindData instanceof image_texture_1.ImageTexture) {
        lGroupEntry.resource = lBindData.native;
        lEntryList.push(lGroupEntry);
        continue;
      }
      // Canvas texture bind.
      if (lBindData instanceof canvas_texture_1.CanvasTexture) {
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
  BindGroupInvalidationType["Layout"] = "LayoutChange";
  BindGroupInvalidationType["Data"] = "DataChange";
})(BindGroupInvalidationType || (exports.BindGroupInvalidationType = BindGroupInvalidationType = {}));

/***/ }),

/***/ "./source/base/binding/pipeline-layout.ts":
/*!************************************************!*\
  !*** ./source/base/binding/pipeline-layout.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PipelineLayoutInvalidationType = exports.PipelineLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
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
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    // Init storages.
    this.mBindGroupNames = new core_1.Dictionary();
    this.mInitialBindGroups = new core_1.Dictionary();
    this.mBindGroups = new core_1.Dictionary();
    this.mBindGroupInvalidationListener = new WeakMap();
    // TODO: Check gpu restriction.
    //this.device.gpu.limits.maxBindGroups
    // Set initial work groups.
    for (const [lGroupIndex, lGroup] of pInitialGroups) {
      // Restrict dublicate names.
      if (this.mBindGroupNames.has(lGroup.name)) {
        throw new core_1.Exception(`Can add group name "${lGroup.name}" only once.`, this);
      }
      // Restrict dublicate locations.
      if (this.mInitialBindGroups.has(lGroupIndex)) {
        throw new core_1.Exception(`Can add group location index "${lGroupIndex}" only once.`, this);
      }
      // Set name to index mapping.
      this.mBindGroupNames.set(lGroup.name, lGroupIndex);
      // Set bind groups to initial data and working bind group.
      this.mInitialBindGroups.set(lGroupIndex, lGroup);
      this.mBindGroups.set(lGroupIndex, lGroup);
      // Add invalidationlistener.
      const lListener = () => {
        this.invalidate(PipelineLayoutInvalidationType.GroupChange);
      };
      lGroup.addInvalidationListener(lListener);
      this.mBindGroupInvalidationListener.set(lGroup, lListener);
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
   * Remove placeholder group.
   *
   * @param pName - Bind group name of replacement.
   */
  removePlaceholderGroup(pName) {
    const lBindGroupIndex = this.groupIndex(pName);
    // Clean old placeholder.
    const lLastBindGroup = this.mBindGroups.get(lBindGroupIndex);
    if (lLastBindGroup) {
      // Remove invalidation listener.
      lLastBindGroup.removeInvalidationListener(this.mBindGroupInvalidationListener.get(lLastBindGroup));
      // Remove old name.
      this.mBindGroupNames.delete(lLastBindGroup.name);
    }
    // Remove replacement layout.
    this.mBindGroups.delete(lBindGroupIndex);
  }
  /**
   * Replace existing bind group.
   *
   * @param pGroupName - Layout name that should be replaced.
   * @param pBindGroup - Replacement bind group.
   */
  replaceGroup(pGroupName, pBindGroup) {
    const lBindGroupIndex = this.groupIndex(pGroupName);
    // Read original bind group.
    const lInitialGroup = this.mInitialBindGroups.get(lBindGroupIndex);
    if (!lInitialGroup) {
      throw new core_1.Exception(`Only initial bind group layouts can be replaced.`, this);
    }
    // Read binding lists.
    const lInitialBindingList = pBindGroup.bindings;
    const lReplacementBindingList = pBindGroup.bindings;
    // Compare inital it with replacement to check compatibility.
    if (lInitialBindingList.length !== lReplacementBindingList.length) {
      throw new core_1.Exception(`Replacement group does not include all bindings.`, this);
    }
    // Compare all bindings.
    for (let lBindingIndex = 0; lBindingIndex < lInitialBindingList.length; lBindingIndex++) {
      const lInitialBinding = lInitialBindingList.at(lBindingIndex);
      const lReplacementBinding = lReplacementBindingList.at(lBindingIndex);
      // Continue on undefined or when bind layout is the same.
      if (lInitialBinding === lReplacementBinding) {
        continue;
      }
      // Can't set binding of something that is not there.
      if (typeof lInitialBinding === 'undefined') {
        throw new core_1.Exception(`Can't replace group binding with index "${lBindingIndex}". Layout binding does not exists in initial layout.`, this);
      }
      // Group must have the same bindings no binding can be missed.
      if (typeof lReplacementBinding === 'undefined') {
        throw new core_1.Exception(`Can't omit group binding with index "${lBindingIndex}".`, this);
      }
      // Same binding name.
      if (lInitialBinding.name !== lReplacementBinding.name) {
        throw new core_1.Exception(`Group binding replacement "${lReplacementBinding.name}" must be named "${lInitialBinding.name}"`, this);
      }
      // Must share the same access mode.
      if (lReplacementBinding.storageType !== lReplacementBinding.storageType) {
        throw new core_1.Exception(`Group binding replacement "${lReplacementBinding.name}" must have the same storage type.`, this);
      }
      // Must share the same visibility.
      if ((lReplacementBinding.visibility & lInitialBinding.visibility) !== lReplacementBinding.visibility) {
        throw new core_1.Exception(`Group binding replacement "${lReplacementBinding.name}" must at least cover the initial visibility.`, this);
      }
      // Must be same memory layout.
      if (lReplacementBinding.constructor !== lInitialBinding.constructor) {
        throw new core_1.Exception(`Group binding replacement "${lReplacementBinding.name}" must have the same memory layout as initial bind group layout.`, this);
      }
      // TODO: layout: BaseMemoryLayout; some type of equal.
    }
    // Remove last 
    const lLastBindGroup = this.mBindGroups.get(lBindGroupIndex);
    if (lLastBindGroup) {
      // Remove invalidation listener.
      lLastBindGroup.removeInvalidationListener(this.mBindGroupInvalidationListener.get(lLastBindGroup));
    }
    // Replace binding group and add invalidation listener.
    const lListener = () => {
      this.invalidate(PipelineLayoutInvalidationType.GroupChange);
    };
    pBindGroup.addInvalidationListener(lListener);
    this.mBindGroupInvalidationListener.set(pBindGroup, lListener);
    // Trigger updates.
    this.invalidate(PipelineLayoutInvalidationType.GroupReplace);
  }
  /**
   * Set a placeholder group that will not be used.
   *
   * @param pIndex - Group index.
   * @param pLayout - [Optional] Bind group Layout.
   */
  setPlaceholderGroup(pIndex, pLayout) {
    // Initial group must be undefined.
    if (this.mInitialBindGroups.has(pIndex)) {
      throw new core_1.Exception(`Group binding placeholder can not replace a requiered bind group.`, this);
    }
    // Clean old placeholder.
    const lLastBindGroup = this.mBindGroups.get(pIndex);
    if (lLastBindGroup) {
      // Remove invalidation listener.
      lLastBindGroup.removeInvalidationListener(this.mBindGroupInvalidationListener.get(lLastBindGroup));
      // Remove old name.
      this.mBindGroupNames.delete(lLastBindGroup.name);
    }
    // Add replacment layout and name.
    this.mBindGroups.set(pIndex, pLayout);
    this.mBindGroupNames.set(pLayout.name, pIndex);
    // Register change listener for layout changes.
    const lListener = () => {
      this.invalidate(PipelineLayoutInvalidationType.GroupChange);
    };
    pLayout.addInvalidationListener(lListener);
    this.mBindGroupInvalidationListener.set(pLayout, lListener);
    // Trigger auto update.
    this.invalidate(PipelineLayoutInvalidationType.GroupReplace);
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
var PipelineLayoutInvalidationType;
(function (PipelineLayoutInvalidationType) {
  PipelineLayoutInvalidationType["GroupReplace"] = "GroupReplace";
  PipelineLayoutInvalidationType["GroupChange"] = "GroupChange";
})(PipelineLayoutInvalidationType || (exports.PipelineLayoutInvalidationType = PipelineLayoutInvalidationType = {}));

/***/ }),

/***/ "./source/base/binding/setup/bind-group-layout-array-memory-layout-setup.ts":
/*!**********************************************************************************!*\
  !*** ./source/base/binding/setup/bind-group-layout-array-memory-layout-setup.ts ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroupLayoutArrayMemoryLayoutSetup = void 0;
const gpu_object_child_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-child-setup */ "./source/base/gpu/object/gpu-object-child-setup.ts");
const array_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/array-buffer-memory-layout */ "./source/base/memory_layout/buffer/array-buffer-memory-layout.ts");
const primitive_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/primitive-buffer-memory-layout */ "./source/base/memory_layout/buffer/primitive-buffer-memory-layout.ts");
const struct_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/struct-buffer-memory-layout */ "./source/base/memory_layout/buffer/struct-buffer-memory-layout.ts");
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

/***/ "./source/base/binding/setup/bind-group-layout-memory-layout-setup.ts":
/*!****************************************************************************!*\
  !*** ./source/base/binding/setup/bind-group-layout-memory-layout-setup.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroupLayoutMemoryLayoutSetup = void 0;
const gpu_object_child_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-child-setup */ "./source/base/gpu/object/gpu-object-child-setup.ts");
const array_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/array-buffer-memory-layout */ "./source/base/memory_layout/buffer/array-buffer-memory-layout.ts");
const primitive_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/primitive-buffer-memory-layout */ "./source/base/memory_layout/buffer/primitive-buffer-memory-layout.ts");
const struct_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/struct-buffer-memory-layout */ "./source/base/memory_layout/buffer/struct-buffer-memory-layout.ts");
const sampler_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/texture/sampler-memory-layout */ "./source/base/memory_layout/texture/sampler-memory-layout.ts");
const texture_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/texture/texture-memory-layout */ "./source/base/memory_layout/texture/texture-memory-layout.ts");
const bind_group_layout_array_memory_layout_setup_1 = __webpack_require__(/*! ./bind-group-layout-array-memory-layout-setup */ "./source/base/binding/setup/bind-group-layout-array-memory-layout-setup.ts");
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
    const lLayout = new sampler_memory_layout_1.SamplerMemoryLayout(this.device, {
      samplerType: pSamplerType
    });
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
   * @param pMultisampled  - Is texture multisampled.
   */
  withTexture(pTextureDimension, pTextureFormat, pMultisampled) {
    const lLayout = new texture_memory_layout_1.TextureMemoryLayout(this.device, {
      dimension: pTextureDimension,
      format: pTextureFormat,
      multisampled: pMultisampled
    });
    // Send created data.
    this.sendData(lLayout);
  }
}
exports.BindGroupLayoutMemoryLayoutSetup = BindGroupLayoutMemoryLayoutSetup;

/***/ }),

/***/ "./source/base/binding/setup/bind-group-layout-setup.ts":
/*!**************************************************************!*\
  !*** ./source/base/binding/setup/bind-group-layout-setup.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BindGroupLayoutSetup = void 0;
const storage_binding_type_enum_1 = __webpack_require__(/*! ../../../constant/storage-binding-type.enum */ "./source/constant/storage-binding-type.enum.ts");
const gpu_object_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-setup */ "./source/base/gpu/object/gpu-object-setup.ts");
const bind_group_layout_memory_layout_setup_1 = __webpack_require__(/*! ./bind-group-layout-memory-layout-setup */ "./source/base/binding/setup/bind-group-layout-memory-layout-setup.ts");
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

/***/ "./source/base/buffer/gpu-buffer.ts":
/*!******************************************!*\
  !*** ./source/base/buffer/gpu-buffer.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuBufferInvalidationType = exports.GpuBuffer = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const buffer_usage_enum_1 = __webpack_require__(/*! ../../constant/buffer-usage.enum */ "./source/constant/buffer-usage.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const primitive_buffer_format_enum_1 = __webpack_require__(/*! ../memory_layout/buffer/enum/primitive-buffer-format.enum */ "./source/base/memory_layout/buffer/enum/primitive-buffer-format.enum.ts");
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
    return this.mItemCount * this.bytePerElement + 3 & ~3;
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
   * Byte per buffer element.
   */
  get bytePerElement() {
    // Read bytes per element
    return (() => {
      switch (this.mDataType) {
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32:
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Sint32:
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Uint32:
          return 4;
        default:
          // Float16
          throw new core_1.Exception(`Could not create a size for ${this.mDataType} type.`, this);
      }
    })();
  }
  /**
   * Constructor.
   * @param pDevice - GPU.
   * @param pLayout - Buffer layout.
   * @param pInitialData  - Inital data. Can be empty. Or Buffer size.
   */
  constructor(pDevice, pLayout, pDataType, pVariableSizeCount = null) {
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    this.mLayout = pLayout;
    // Set config.
    this.mDataType = pDataType;
    // At default buffer can not be read and not be written to.
    this.mBufferUsage = buffer_usage_enum_1.BufferUsage.None;
    // Read and write buffers.
    this.mWriteBuffer = {
      limitation: Number.MAX_SAFE_INTEGER,
      ready: new Array(),
      buffer: new Set()
    };
    this.mReadBuffer = null;
    if (pLayout.variableSize !== 0 && pVariableSizeCount === null) {
      throw new core_1.Exception('Variable size must be set for gpu buffers with variable memory layouts.', this);
    }
    // Layout size can be variable so we clamp variable size to 0. 
    const lByteSize = (pVariableSizeCount ?? 0) * pLayout.variableSize + pLayout.fixedSize;
    // Set buffer initial data from buffer size or buffer data.
    this.mItemCount = lByteSize / 4; // All data is 4byte/ 32bit. 
    // No intial data.
    this.mInitialDataCallback = null;
    // Register change listener for layout changes.
    pLayout.addInvalidationListener(() => {
      this.invalidate(GpuBufferInvalidationType.Layout);
    });
  }
  /**
   * Extend usage of buffer.
   * Might trigger a buffer rebuild.
   *
   * @param pUsage - Buffer usage.
   */
  extendUsage(pUsage) {
    // Update only when not already set.
    if ((this.mBufferUsage & pUsage) === 0) {
      this.mBufferUsage |= pUsage;
      this.invalidate(GpuBufferInvalidationType.Usage);
    }
    return this;
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
    this.invalidate(GpuBufferInvalidationType.InitialData);
    return this;
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
   *
   * @param pOffset - Data read offset.
   * @param pSize - Data read size.
   */
  readRaw(pOffset, pSize) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      // Set buffer as writeable.
      _this2.extendUsage(buffer_usage_enum_1.BufferUsage.CopySource);
      const lOffset = pOffset ?? 0;
      const lSize = pSize ?? _this2.size;
      // Create a new buffer when it is not already created.
      if (_this2.mReadBuffer === null) {
        _this2.mReadBuffer = _this2.device.gpu.createBuffer({
          label: `ReadWaveBuffer`,
          size: _this2.size,
          usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
          mappedAtCreation: false
        });
      }
      // Copy buffer data from native into staging.
      const lCommandDecoder = _this2.device.gpu.createCommandEncoder();
      lCommandDecoder.copyBufferToBuffer(_this2.native, lOffset, _this2.mReadBuffer, lOffset, lSize);
      _this2.device.gpu.queue.submit([lCommandDecoder.finish()]);
      // Get buffer and map data.
      yield _this2.mReadBuffer.mapAsync(GPUMapMode.READ, lOffset, lSize);
      // Read result from mapped range and copy it with slice.
      const lBufferReadResult = _this2.createTypedArray(_this2.mReadBuffer.getMappedRange().slice(0));
      // Map read buffer again.
      _this2.mReadBuffer.unmap();
      // Get mapped data and force it into typed array.
      return lBufferReadResult;
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
   *
   * @param pData - Data.
   * @param pOffset - Data offset.
   */
  writeRaw(pData, pOffset) {
    var _this4 = this;
    return _asyncToGenerator(function* () {
      // Set buffer as writeable.
      _this4.extendUsage(buffer_usage_enum_1.BufferUsage.CopyDestination);
      // Read native before reading staging buffers.
      // On Native read, staging buffers can be destroyed.
      const lNative = _this4.native;
      // Try to read a mapped buffer from waving list.
      let lStagingBuffer = null;
      if (_this4.mWriteBuffer.ready.length === 0) {
        // Create new buffer when limitation is not meet.
        if (_this4.mWriteBuffer.buffer.size < _this4.mWriteBuffer.limitation) {
          lStagingBuffer = _this4.device.gpu.createBuffer({
            label: `RingBuffer-WriteWaveBuffer-${_this4.mWriteBuffer.buffer.size}`,
            size: _this4.size,
            usage: GPUBufferUsage.MAP_WRITE | GPUBufferUsage.COPY_SRC,
            mappedAtCreation: true
          });
          // Add new buffer to complete list.
          _this4.mWriteBuffer.buffer.add(lStagingBuffer);
        }
      } else {
        // Pop as long as staging buffer is not destroyed or could not be found.
        lStagingBuffer = _this4.mWriteBuffer.ready.pop();
      }
      // Get byte length and offset of data to write.
      const lDataByteLength = pData.length * _this4.bytePerElement;
      const lOffset = pOffset ?? 0;
      // When no staging buffer is available, use the slow native.
      if (!lStagingBuffer) {
        // Write data into mapped range.
        _this4.device.gpu.queue.writeBuffer(lNative, lOffset, _this4.createTypedArray(pData), 0, lDataByteLength);
        return;
      }
      // Execute write operations on waving buffer.
      const lBufferArray = _this4.createTypedArray(lStagingBuffer.getMappedRange(lOffset, lDataByteLength));
      lBufferArray.set(pData);
      // Unmap for copying data.
      lStagingBuffer.unmap();
      // Copy buffer data from staging into wavig buffer.
      const lCommandDecoder = _this4.device.gpu.createCommandEncoder();
      lCommandDecoder.copyBufferToBuffer(lStagingBuffer, lOffset, lNative, lOffset, lDataByteLength);
      _this4.device.gpu.queue.submit([lCommandDecoder.finish()]);
      // Shedule staging buffer remaping.
      lStagingBuffer.mapAsync(GPUMapMode.WRITE).then(() => {
        // Check for destroyed state, it is destroyed when not in write buffer list.
        if (_this4.mWriteBuffer.buffer.has(lStagingBuffer)) {
          _this4.mWriteBuffer.ready.push(lStagingBuffer);
        }
      }).catch(() => {
        // Remove buffer when it could not be mapped.
        _this4.mWriteBuffer.buffer.delete(lStagingBuffer);
        lStagingBuffer.destroy();
      });
    })();
  }
  /**
   * Destroy wave and ready buffer.
   */
  destroyNative(pNativeObject, _pReason) {
    pNativeObject.destroy();
    // Only clear staging buffers when layout, and therfore the buffer size has changed.
    //if (pReason.has(GpuBufferInvalidationType.Layout)) {
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
    //}
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
      usage: this.mBufferUsage,
      mappedAtCreation: !!lInitalData
    });
    // Write data. Is completly async.
    if (lInitalData) {
      // Write initial data.
      const lMappedBuffer = this.createTypedArray(lBuffer.getMappedRange());
      // Validate buffer and initial data length.
      if (lMappedBuffer.length !== lInitalData.length) {
        throw new core_1.Exception(`Initial buffer data (length: ${lInitalData.length}) does not fit into buffer (length: ${lMappedBuffer.length}). `, this);
      }
      // Set data to buffer.
      lMappedBuffer.set(lInitalData);
      // Unmap buffer.
      lBuffer.unmap();
    }
    return lBuffer;
  }
  /**
   * Create a typed array based on buffer data type.
   *
   * @param pArrayBuffer - Array buffer.
   *
   * @returns typed array.
   */
  createTypedArray(pArrayBuffer) {
    // Read bytes per element
    const lArrayBufferConstructor = (() => {
      switch (this.mDataType) {
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32:
          return Float32Array;
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Sint32:
          return Int32Array;
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Uint32:
          return Uint32Array;
        default:
          // Float16
          throw new core_1.Exception(`Could not create a buffered array for ${this.mDataType} type.`, this);
      }
    })();
    return new lArrayBufferConstructor(pArrayBuffer);
  }
}
exports.GpuBuffer = GpuBuffer;
var GpuBufferInvalidationType;
(function (GpuBufferInvalidationType) {
  GpuBufferInvalidationType["Layout"] = "LayoutChange";
  GpuBufferInvalidationType["InitialData"] = "InitialDataChange";
  GpuBufferInvalidationType["Usage"] = "UsageChange";
})(GpuBufferInvalidationType || (exports.GpuBufferInvalidationType = GpuBufferInvalidationType = {}));

/***/ }),

/***/ "./source/base/execution/gpu-execution.ts":
/*!************************************************!*\
  !*** ./source/base/execution/gpu-execution.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuExecution = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
class GpuExecution extends gpu_object_1.GpuObject {
  /**
   * GPU command encoder.
   */
  get encoder() {
    if (!this.mEncoder) {
      throw new core_1.Exception('Execution is not started', this);
    }
    return this.mEncoder;
  }
  constructor(pDevice, pExecution) {
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    this.mExecutionFunction = pExecution;
    this.mEncoder = null;
  }
  execute() {
    this.mEncoder = this.device.gpu.createCommandEncoder({
      label: 'Execution'
    });
    this.mExecutionFunction(this);
    // TODO: Execution is async.
    // Submit commands to queue and clear command encoder.
    this.device.gpu.queue.submit([this.mEncoder.finish()]);
    this.mEncoder = null;
  }
}
exports.GpuExecution = GpuExecution;

/***/ }),

/***/ "./source/base/execution/pass/compute-pass.ts":
/*!****************************************************!*\
  !*** ./source/base/execution/pass/compute-pass.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ComputePass = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
class ComputePass extends gpu_object_1.GpuObject {
  /**
   * Constructor.
   * @param pDevice - Device reference.
   */
  constructor(pDevice) {
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
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
      // Get and validate existance of set bind group.
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
   * @param pExecutor - Executor context.
   */
  execute(pExecution) {
    // Pass descriptor is set, when the pipeline ist set.
    const lComputePassEncoder = pExecution.encoder.beginComputePass();
    // Instruction cache.
    let lPipeline = null;
    // Buffer for current set bind groups.
    const lBindGroupList = new Array();
    let lHighestBindGroupListIndex = -1;
    // Execute instructions.
    for (const lInstruction of this.mInstructionList) {
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
        lComputePassEncoder.setPipeline(lPipeline.native);
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

/***/ "./source/base/execution/pass/render-pass.ts":
/*!***************************************************!*\
  !*** ./source/base/execution/pass/render-pass.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderPass = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const bind_group_1 = __webpack_require__(/*! ../../binding/bind-group */ "./source/base/binding/bind-group.ts");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const render_targets_1 = __webpack_require__(/*! ../../pipeline/target/render-targets */ "./source/base/pipeline/target/render-targets.ts");
class RenderPass extends gpu_object_1.GpuObject {
  /**
   * Constructor.
   *
   * @param pDevice - Device reference.
   * @param pRenderTargets - Render targets.
   * @param pStaticBundle - Bundle is static and does not update very often.
   */
  constructor(pDevice, pRenderTargets, pStaticBundle) {
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    this.mInstructionList = new Array();
    this.mRenderTargets = pRenderTargets;
    this.mBundleConfig = {
      enabled: pStaticBundle,
      writeDepth: false,
      writeStencil: false,
      bundle: null
    };
    // Update bundle when render target has changed.
    pRenderTargets.addInvalidationListener(() => {
      this.mBundleConfig.bundle = null;
    }, [render_targets_1.RenderTargetsInvalidationType.Config]); // TODO: Update pipeline on format change.
  }
  /**
   * Add instruction step.
   *
   * @param pPipeline - Pipeline.
   * @param pParameter - Pipeline parameter.
   * @param pBindData - Pipline bind data groups.
   * @param pInstanceCount - Instance count.
   */
  addStep(pPipeline, pParameter, pBindData, pInstanceCount = 1) {
    // Validate same render targets.
    if (this.mRenderTargets !== pPipeline.renderTargets) {
      throw new core_1.Exception('Instruction render pass not valid for instruction set.', this);
    }
    const lStep = {
      pipeline: pPipeline,
      parameter: pParameter,
      instanceCount: pInstanceCount,
      bindData: new Array()
    };
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
      // Get and validate existance of set bind group.
      const lBindDataGroup = lBindGroups.get(lGroupName);
      if (!lBindDataGroup) {
        throw new core_1.Exception(`Required bind group "${lGroupName}" not set.`, this);
      }
      // Validate same layout bind layout.
      const lBindGroupLayout = lPipelineLayout.getGroupLayout(lGroupName);
      if (lBindDataGroup.layout !== lBindGroupLayout) {
        throw new core_1.Exception(`Source bind group layout for "${lGroupName}" does not match target layout.`, this);
      }
      lStep.bindData[lPipelineLayout.groupIndex(lGroupName)] = lBindDataGroup;
    }
    this.mInstructionList.push(lStep);
    // Update bundle write depth config.
    if (pPipeline.writeDepth) {
      this.mBundleConfig.writeDepth = true;
    }
    // Clear bundle when adding new steps.
    this.mBundleConfig.bundle = null;
    // Clear bundle when anything has changes.
    pPipeline.addInvalidationListener(() => {
      this.mBundleConfig.bundle = null;
    });
    pParameter.addInvalidationListener(() => {
      this.mBundleConfig.bundle = null;
    });
    // Clear bundle on any bindgroup change.
    for (const lGroupName of lPipelineLayout.groups) {
      lBindGroups.get(lGroupName).addInvalidationListener(() => {
        this.mBundleConfig.bundle = null;
      }, [bind_group_1.BindGroupInvalidationType.Data]);
    }
  }
  /**
   * Execute steps in a row.
   *
   * @param pExecutor - Executor context.
   */
  execute(pExecution) {
    // Execute cached or execute direct based on static or variable bundles.
    if (this.mBundleConfig.enabled) {
      this.cachedExecute(pExecution);
    } else {
      this.directExecute(pExecution);
    }
  }
  /**
   * Execute render pass as cached bundle.
   *
   * @param pExecutor - Executor context.
   */
  cachedExecute(pExecution) {
    // Generate new bundle when not already cached or render target got changed.
    if (!this.mBundleConfig.bundle) {
      // Generate GPURenderBundleEncoderDescriptor from GPURenderPassDescriptor.
      const lRenderBundleEncoderDescriptor = {
        colorFormats: this.mRenderTargets.colorTextures.map(pRenderTarget => {
          return pRenderTarget.layout.format;
        }),
        // Render target multisample level.
        sampleCount: this.mRenderTargets.multiSampleLevel,
        // Enable depth or stencil write.
        depthReadOnly: !this.mBundleConfig.writeDepth,
        stencilReadOnly: !this.mBundleConfig.writeStencil
      };
      // Optional depth stencil.
      if (this.mRenderTargets.depthTexture) {
        lRenderBundleEncoderDescriptor.depthStencilFormat = this.mRenderTargets.depthTexture.layout.format;
      }
      // Create render bundle.
      const lRenderBundleEncoder = this.device.gpu.createRenderBundleEncoder(lRenderBundleEncoderDescriptor);
      // Fill render queue.
      this.setRenderQueue(lRenderBundleEncoder);
      // Save render bundle.
      this.mBundleConfig.bundle = {
        bundle: lRenderBundleEncoder.finish(),
        descriptor: this.mRenderTargets.native
      };
    }
    // Pass descriptor is set, when the pipeline is set.
    const lRenderPassEncoder = pExecution.encoder.beginRenderPass(this.mRenderTargets.native);
    // Add cached render bundle.
    lRenderPassEncoder.executeBundles([this.mBundleConfig.bundle?.bundle]);
    // End render queue.
    lRenderPassEncoder.end();
  }
  /**
   * Execute steps in a row without caching.
   *
   * @param pExecutor - Executor context.
   */
  directExecute(pExecution) {
    // Pass descriptor is set, when the pipeline is set.
    const lRenderPassEncoder = pExecution.encoder.beginRenderPass(this.mRenderTargets.native);
    // Fill render queue.
    this.setRenderQueue(lRenderPassEncoder);
    // End render queue.
    lRenderPassEncoder.end();
  }
  /**
   * Fill encoder with each render step.
   *
   * @param pEncoder - Render encoder.
   */
  setRenderQueue(pEncoder) {
    // Instruction cache.
    let lPipeline = null;
    // Buffer for current set vertex buffer.
    const lVertexBufferList = new core_1.Dictionary();
    let lHighestVertexParameterListIndex = -1;
    // Buffer for current set bind groups.
    const lBindGroupList = new Array();
    let lHighestBindGroupListIndex = -1;
    // Execute instructions.
    for (const lInstruction of this.mInstructionList) {
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
          pEncoder.setBindGroup(lBindGroupIndex, lNewBindGroup.native);
        }
      }
      // Cache for bind group length of this instruction.
      let lLocalHighestVertexParameterListIndex = -1;
      // Add vertex attribute buffer.
      const lBufferNames = lInstruction.pipeline.module.vertexParameter.bufferNames;
      for (let lBufferIndex = 0; lBufferIndex < lBufferNames.length; lBufferIndex++) {
        // Read buffer information.
        const lAttributeBufferName = lBufferNames[lBufferIndex];
        const lNewAttributeBuffer = lInstruction.parameter.get(lAttributeBufferName);
        // Extend group list length.
        if (lBufferIndex > lLocalHighestVertexParameterListIndex) {
          lLocalHighestVertexParameterListIndex = lBufferIndex;
        }
        // Use cached vertex buffer or use new.
        if (lNewAttributeBuffer !== lVertexBufferList.get(lBufferIndex)) {
          lVertexBufferList.set(lBufferIndex, lNewAttributeBuffer);
          pEncoder.setVertexBuffer(lBufferIndex, lNewAttributeBuffer.native);
        }
      }
      // Use cached pipeline or use new.
      if (lInstruction.pipeline !== lPipeline) {
        lPipeline = lInstruction.pipeline;
        // Generate and set new pipeline.
        pEncoder.setPipeline(lPipeline.native);
        // Only clear bind buffer when a new pipeline is set.
        // Same pipelines must have set the same bind group layouts.
        if (lHighestBindGroupListIndex > lLocalHighestBindGroupListIndex) {
          for (let lBindGroupIndex = lLocalHighestBindGroupListIndex + 1; lBindGroupIndex < lHighestBindGroupListIndex + 1; lBindGroupIndex++) {
            pEncoder.setBindGroup(lBindGroupIndex, null);
          }
        }
        // Update global bind group list length.
        lHighestBindGroupListIndex = lLocalHighestBindGroupListIndex;
        // Only clear vertex buffer when a new pipeline is set.
        // Same pipeline must have the same vertex parameter layout.
        if (lHighestVertexParameterListIndex > lLocalHighestVertexParameterListIndex) {
          for (let lVertexParameterBufferIndex = lLocalHighestVertexParameterListIndex + 1; lVertexParameterBufferIndex < lHighestVertexParameterListIndex + 1; lVertexParameterBufferIndex++) {
            pEncoder.setVertexBuffer(lVertexParameterBufferIndex, null);
          }
        }
        // Update global bind group list length.
        lHighestVertexParameterListIndex = lLocalHighestVertexParameterListIndex;
      }
      // Draw indexed when parameters are indexable.
      if (lInstruction.parameter.layout.indexable) {
        // Set indexbuffer.
        pEncoder.setIndexBuffer(lInstruction.parameter.indexBuffer.native, 'uint32'); // TODO: Dynamicly switch between 32 and 16 bit based on length.
        // Create draw call.
        pEncoder.drawIndexed(lInstruction.parameter.indexBuffer.length, lInstruction.instanceCount);
      } else {
        // Create draw call.
        pEncoder.draw(lInstruction.parameter.vertexCount, lInstruction.instanceCount);
      }
      // TODO: Indirect dispatch.
    }
  }
}
exports.RenderPass = RenderPass;

/***/ }),

/***/ "./source/base/gpu/capabilities/gpu-capabilities.ts":
/*!**********************************************************!*\
  !*** ./source/base/gpu/capabilities/gpu-capabilities.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuCapabilities = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gpu_feature_enum_1 = __webpack_require__(/*! ./gpu-feature.enum */ "./source/base/gpu/capabilities/gpu-feature.enum.ts");
const gpu_limit_enum_1 = __webpack_require__(/*! ./gpu-limit.enum */ "./source/base/gpu/capabilities/gpu-limit.enum.ts");
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

/***/ "./source/base/gpu/capabilities/gpu-feature.enum.ts":
/*!**********************************************************!*\
  !*** ./source/base/gpu/capabilities/gpu-feature.enum.ts ***!
  \**********************************************************/
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

/***/ "./source/base/gpu/capabilities/gpu-limit.enum.ts":
/*!********************************************************!*\
  !*** ./source/base/gpu/capabilities/gpu-limit.enum.ts ***!
  \********************************************************/
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

/***/ "./source/base/gpu/gpu-device.ts":
/*!***************************************!*\
  !*** ./source/base/gpu/gpu-device.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuDevice = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const texture_dimension_enum_1 = __webpack_require__(/*! ../../constant/texture-dimension.enum */ "./source/constant/texture-dimension.enum.ts");
const gpu_execution_1 = __webpack_require__(/*! ../execution/gpu-execution */ "./source/base/execution/gpu-execution.ts");
const compute_pass_1 = __webpack_require__(/*! ../execution/pass/compute-pass */ "./source/base/execution/pass/compute-pass.ts");
const render_pass_1 = __webpack_require__(/*! ../execution/pass/render-pass */ "./source/base/execution/pass/render-pass.ts");
const texture_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/texture-memory-layout */ "./source/base/memory_layout/texture/texture-memory-layout.ts");
const render_targets_1 = __webpack_require__(/*! ../pipeline/target/render-targets */ "./source/base/pipeline/target/render-targets.ts");
const shader_1 = __webpack_require__(/*! ../shader/shader */ "./source/base/shader/shader.ts");
const canvas_texture_1 = __webpack_require__(/*! ../texture/canvas-texture */ "./source/base/texture/canvas-texture.ts");
const texture_format_capabilities_1 = __webpack_require__(/*! ../texture/texture-format-capabilities */ "./source/base/texture/texture-format-capabilities.ts");
const gpu_capabilities_1 = __webpack_require__(/*! ./capabilities/gpu-capabilities */ "./source/base/gpu/capabilities/gpu-capabilities.ts");
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
      const lDevice = GpuDevice.mDevices.get(lAdapter) ?? (yield lAdapter.requestDevice());
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
    this.mFrameChangeListener = new Array();
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
    // Create basic canvas layout.
    const lLayout = new texture_memory_layout_1.TextureMemoryLayout(this, {
      dimension: texture_dimension_enum_1.TextureDimension.TwoDimension,
      format: this.formatValidator.preferredCanvasFormat,
      multisampled: false
    });
    return new canvas_texture_1.CanvasTexture(this, lLayout, lCanvas);
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
   * Create new render pass.
   *
   * @param pRenderTargets - Render targets of pass.
   * @param pStaticBundle - Bundle is static and does not update very often.
   *
   * @returns new render pass.
   */
  renderPass(pRenderTargets, pStaticBundle = true) {
    return new render_pass_1.RenderPass(this, pRenderTargets, pStaticBundle);
  }
  /**
   * Create render target object.
   *
   * @returns render target object.
   */
  renderTargets() {
    return new render_targets_1.RenderTargets(this);
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

/***/ "./source/base/gpu/object/gpu-object-child-setup.ts":
/*!**********************************************************!*\
  !*** ./source/base/gpu/object/gpu-object-child-setup.ts ***!
  \**********************************************************/
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

/***/ "./source/base/gpu/object/gpu-object-invalidation-reasons.ts":
/*!*******************************************************************!*\
  !*** ./source/base/gpu/object/gpu-object-invalidation-reasons.ts ***!
  \*******************************************************************/
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
   * Life time was reached.
   */
  get lifeTimeReached() {
    return this.mLifeTimeReached;
  }
  set lifeTimeReached(pLifeTimeReached) {
    this.mLifeTimeReached = pLifeTimeReached;
  }
  /**
   * Constructor.
   */
  constructor() {
    this.mReasons = new Set();
    this.mLifeTimeReached = false;
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
    return this.mReasons.size > 0 || this.mLifeTimeReached || this.mDeconstruct;
  }
  /**
   * Clear all reasons.
   */
  clear() {
    this.mLifeTimeReached = false;
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

/***/ "./source/base/gpu/object/gpu-object-life-time.enum.ts":
/*!*************************************************************!*\
  !*** ./source/base/gpu/object/gpu-object-life-time.enum.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuObjectLifeTime = void 0;
var GpuObjectLifeTime;
(function (GpuObjectLifeTime) {
  GpuObjectLifeTime[GpuObjectLifeTime["Persistent"] = 0] = "Persistent";
  GpuObjectLifeTime[GpuObjectLifeTime["Frame"] = 1] = "Frame";
})(GpuObjectLifeTime || (exports.GpuObjectLifeTime = GpuObjectLifeTime = {}));

/***/ }),

/***/ "./source/base/gpu/object/gpu-object-setup.ts":
/*!****************************************************!*\
  !*** ./source/base/gpu/object/gpu-object-setup.ts ***!
  \****************************************************/
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

/***/ "./source/base/gpu/object/gpu-object.ts":
/*!**********************************************!*\
  !*** ./source/base/gpu/object/gpu-object.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.GpuObject = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const gpu_object_invalidation_reasons_1 = __webpack_require__(/*! ./gpu-object-invalidation-reasons */ "./source/base/gpu/object/gpu-object-invalidation-reasons.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ./gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
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
  constructor(pDevice, pNativeLifeTime) {
    // Save static settings.
    this.mDevice = pDevice;
    this.mIsSetup = false;
    // Init default settings and config.
    this.mDeconstructed = false;
    this.mNativeObject = null;
    // Init lists.
    this.mUpdateListenerList = new core_1.Dictionary();
    this.mInvalidationReasons = new gpu_object_invalidation_reasons_1.GpuObjectInvalidationReasons();
    // Validate life time.
    switch (pNativeLifeTime) {
      case gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent:
        {
          // Do nothing.
          break;
        }
      case gpu_object_life_time_enum_1.GpuObjectLifeTime.Frame:
        {
          // TODO: Remove it on deconstruct.
          this.mDevice.addFrameChangeListener(() => {
            this.mInvalidationReasons.lifeTimeReached = true;
            this.invalidate('');
          });
          break;
        }
    }
  }
  /**
   * Add invalidation listener.
   *
   * @param pListener - Listener.
   * @param pAffected - Trigger listener only on those reasons.
   */
  addInvalidationListener(pListener, pAffected) {
    this.mUpdateListenerList.set(pListener, pAffected ? new Set(pAffected) : null);
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
  invalidate(pReason) {
    // Add invalidation reason.
    this.mInvalidationReasons.add(pReason);
    // Call parent update listerner.
    for (const [lInvalidationListener, lAffected] of this.mUpdateListenerList) {
      // Call listener only when is has a affected reason.
      if (!lAffected || lAffected.has(pReason)) {
        lInvalidationListener(pReason);
      }
    }
  }
  /**
   * Add invalidation listener.
   * @param pListener - Listener.
   */
  removeInvalidationListener(pListener) {
    this.mUpdateListenerList.delete(pListener);
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
   * @param _pReasons - Reason why it should be newly generated.
   */
  generateNative(_pReasons) {
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
      // Destroy native when existing.
      if (this.mNativeObject !== null) {
        this.destroyNative(this.mNativeObject, this.mInvalidationReasons);
        this.mNativeObject = null;
      }
      // Generate new native.
      this.mNativeObject = this.generateNative(this.mInvalidationReasons);
      if (this.mNativeObject === null) {
        throw new core_1.Exception(`No gpu native object can be generated.`, this);
      }
      // Reset all update reasons.
      this.mInvalidationReasons.clear();
    }
    return this.mNativeObject;
  }
}
exports.GpuObject = GpuObject;
// TODO: Custom invalidation mapping to destinct between creating everything new or replace a view in native objects.

/***/ }),

/***/ "./source/base/memory_layout/base-memory-layout.ts":
/*!*********************************************************!*\
  !*** ./source/base/memory_layout/base-memory-layout.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseMemoryLayout = void 0;
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
class BaseMemoryLayout extends gpu_object_1.GpuObject {
  /**
   * Constuctor.
   * @param pDevice - Device reference.
   */
  constructor(pDevice) {
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
  }
}
exports.BaseMemoryLayout = BaseMemoryLayout;

/***/ }),

/***/ "./source/base/memory_layout/buffer/array-buffer-memory-layout.ts":
/*!************************************************************************!*\
  !*** ./source/base/memory_layout/buffer/array-buffer-memory-layout.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ArrayBufferMemoryLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ./base-buffer-memory-layout */ "./source/base/memory_layout/buffer/base-buffer-memory-layout.ts");
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

/***/ "./source/base/memory_layout/buffer/base-buffer-memory-layout.ts":
/*!***********************************************************************!*\
  !*** ./source/base/memory_layout/buffer/base-buffer-memory-layout.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseBufferMemoryLayout = void 0;
const base_memory_layout_1 = __webpack_require__(/*! ../base-memory-layout */ "./source/base/memory_layout/base-memory-layout.ts");
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

/***/ "./source/base/memory_layout/buffer/enum/primitive-buffer-format.enum.ts":
/*!*******************************************************************************!*\
  !*** ./source/base/memory_layout/buffer/enum/primitive-buffer-format.enum.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PrimitiveBufferFormat = void 0;
var PrimitiveBufferFormat;
(function (PrimitiveBufferFormat) {
  PrimitiveBufferFormat["Float16"] = "float16";
  PrimitiveBufferFormat["Float32"] = "float32";
  PrimitiveBufferFormat["Uint32"] = "uint32";
  PrimitiveBufferFormat["Sint32"] = "sint32";
})(PrimitiveBufferFormat || (exports.PrimitiveBufferFormat = PrimitiveBufferFormat = {}));

/***/ }),

/***/ "./source/base/memory_layout/buffer/enum/primitive-buffer-multiplier.enum.ts":
/*!***********************************************************************************!*\
  !*** ./source/base/memory_layout/buffer/enum/primitive-buffer-multiplier.enum.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PrimitiveBufferMultiplier = void 0;
var PrimitiveBufferMultiplier;
(function (PrimitiveBufferMultiplier) {
  // Single
  PrimitiveBufferMultiplier["Single"] = "x1";
  // Vector
  PrimitiveBufferMultiplier["Vector2"] = "v2";
  PrimitiveBufferMultiplier["Vector3"] = "v3";
  PrimitiveBufferMultiplier["Vector4"] = "v4";
  // Matrix
  PrimitiveBufferMultiplier["Matrix22"] = "m22";
  PrimitiveBufferMultiplier["Matrix23"] = "m23";
  PrimitiveBufferMultiplier["Matrix24"] = "m24";
  PrimitiveBufferMultiplier["Matrix32"] = "m32";
  PrimitiveBufferMultiplier["Matrix33"] = "m33";
  PrimitiveBufferMultiplier["Matrix34"] = "m34";
  PrimitiveBufferMultiplier["Matrix42"] = "m42";
  PrimitiveBufferMultiplier["Matrix43"] = "m43";
  PrimitiveBufferMultiplier["Matrix44"] = "m44";
})(PrimitiveBufferMultiplier || (exports.PrimitiveBufferMultiplier = PrimitiveBufferMultiplier = {}));

/***/ }),

/***/ "./source/base/memory_layout/buffer/primitive-buffer-memory-layout.ts":
/*!****************************************************************************!*\
  !*** ./source/base/memory_layout/buffer/primitive-buffer-memory-layout.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PrimitiveBufferMemoryLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ./base-buffer-memory-layout */ "./source/base/memory_layout/buffer/base-buffer-memory-layout.ts");
const primitive_buffer_format_enum_1 = __webpack_require__(/*! ./enum/primitive-buffer-format.enum */ "./source/base/memory_layout/buffer/enum/primitive-buffer-format.enum.ts");
const primitive_buffer_multiplier_enum_1 = __webpack_require__(/*! ./enum/primitive-buffer-multiplier.enum */ "./source/base/memory_layout/buffer/enum/primitive-buffer-multiplier.enum.ts");
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
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float16:
          return 2;
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32:
          return 4;
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Uint32:
          return 4;
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Sint32:
          return 4;
      }
    })();
    // Calculate alignment and size.
    [this.mAlignment, this.mSize] = (() => {
      switch (pParameter.primitiveMultiplier) {
        case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Single:
          return [this.mSize, this.mSize];
        case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector2:
          return [this.mSize * 2, this.mSize * 2];
        case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector3:
          return [this.mSize * 4, this.mSize * 3];
        case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector4:
          return [this.mSize * 4, this.mSize * 4];
        case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix22:
          return [this.mSize * 2, this.mSize * 2 * 2];
        case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix23:
          return [this.mSize * 4, this.mSize * 2 * 3];
        case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix24:
          return [this.mSize * 4, this.mSize * 2 * 4];
        case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix32:
          return [this.mSize * 2, this.mSize * 3 * 2];
        case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix33:
          return [this.mSize * 4, this.mSize * 3 * 3];
        case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix34:
          return [this.mSize * 4, this.mSize * 3 * 4];
        case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix42:
          return [this.mSize * 2, this.mSize * 4 * 2];
        case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix43:
          return [this.mSize * 4, this.mSize * 4 * 3];
        case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix44:
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

/***/ "./source/base/memory_layout/buffer/struct-buffer-memory-layout-property-setup.ts":
/*!****************************************************************************************!*\
  !*** ./source/base/memory_layout/buffer/struct-buffer-memory-layout-property-setup.ts ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StructBufferMemoryLayoutPropertySetup = void 0;
const gpu_object_child_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-child-setup */ "./source/base/gpu/object/gpu-object-child-setup.ts");
const array_buffer_memory_layout_1 = __webpack_require__(/*! ./array-buffer-memory-layout */ "./source/base/memory_layout/buffer/array-buffer-memory-layout.ts");
const primitive_buffer_memory_layout_1 = __webpack_require__(/*! ./primitive-buffer-memory-layout */ "./source/base/memory_layout/buffer/primitive-buffer-memory-layout.ts");
const struct_buffer_memory_layout_1 = __webpack_require__(/*! ./struct-buffer-memory-layout */ "./source/base/memory_layout/buffer/struct-buffer-memory-layout.ts");
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

/***/ "./source/base/memory_layout/buffer/struct-buffer-memory-layout-setup.ts":
/*!*******************************************************************************!*\
  !*** ./source/base/memory_layout/buffer/struct-buffer-memory-layout-setup.ts ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StructBufferMemoryLayoutSetup = void 0;
const gpu_object_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-setup */ "./source/base/gpu/object/gpu-object-setup.ts");
const struct_buffer_memory_layout_property_setup_1 = __webpack_require__(/*! ./struct-buffer-memory-layout-property-setup */ "./source/base/memory_layout/buffer/struct-buffer-memory-layout-property-setup.ts");
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

/***/ "./source/base/memory_layout/buffer/struct-buffer-memory-layout.ts":
/*!*************************************************************************!*\
  !*** ./source/base/memory_layout/buffer/struct-buffer-memory-layout.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StructBufferMemoryLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ./base-buffer-memory-layout */ "./source/base/memory_layout/buffer/base-buffer-memory-layout.ts");
const struct_buffer_memory_layout_setup_1 = __webpack_require__(/*! ./struct-buffer-memory-layout-setup */ "./source/base/memory_layout/buffer/struct-buffer-memory-layout-setup.ts");
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

/***/ "./source/base/memory_layout/buffer/vertex-buffer-memory-layout.ts":
/*!*************************************************************************!*\
  !*** ./source/base/memory_layout/buffer/vertex-buffer-memory-layout.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexBufferMemoryLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const base_buffer_memory_layout_1 = __webpack_require__(/*! ./base-buffer-memory-layout */ "./source/base/memory_layout/buffer/base-buffer-memory-layout.ts");
const primitive_buffer_format_enum_1 = __webpack_require__(/*! ./enum/primitive-buffer-format.enum */ "./source/base/memory_layout/buffer/enum/primitive-buffer-format.enum.ts");
const primitive_buffer_multiplier_enum_1 = __webpack_require__(/*! ./enum/primitive-buffer-multiplier.enum */ "./source/base/memory_layout/buffer/enum/primitive-buffer-multiplier.enum.ts");
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
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float16:
          return 2;
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32:
          return 4;
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Uint32:
          return 4;
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Sint32:
          return 4;
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
          case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Single:
            return lPrimitiveByteCount;
          case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector2:
            return lPrimitiveByteCount * 2;
          case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector3:
            return lPrimitiveByteCount * 3;
          case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Vector4:
            return lPrimitiveByteCount * 4;
          case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix22:
            return lPrimitiveByteCount * 2 * 2;
          case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix23:
            return lPrimitiveByteCount * 2 * 3;
          case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix24:
            return lPrimitiveByteCount * 2 * 4;
          case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix32:
            return lPrimitiveByteCount * 3 * 2;
          case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix33:
            return lPrimitiveByteCount * 3 * 3;
          case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix34:
            return lPrimitiveByteCount * 3 * 4;
          case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix42:
            return lPrimitiveByteCount * 4 * 2;
          case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix43:
            return lPrimitiveByteCount * 4 * 3;
          case primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Matrix44:
            return lPrimitiveByteCount * 4 * 4;
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

/***/ "./source/base/memory_layout/texture/sampler-memory-layout.ts":
/*!********************************************************************!*\
  !*** ./source/base/memory_layout/texture/sampler-memory-layout.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SamplerMemoryLayoutInvalidationType = exports.SamplerMemoryLayout = void 0;
const base_memory_layout_1 = __webpack_require__(/*! ../base-memory-layout */ "./source/base/memory_layout/base-memory-layout.ts");
class SamplerMemoryLayout extends base_memory_layout_1.BaseMemoryLayout {
  /**
   * Sampler type.
   */
  get samplerType() {
    return this.mSamplerType;
  }
  set samplerType(pType) {
    this.mSamplerType = pType;
    this.invalidate(SamplerMemoryLayoutInvalidationType.SamplerType);
  }
  /**
   * Constructor.
   *
   * @param pDevice - Device reference.
   * @param pParameter - Parameter.
   */
  constructor(pDevice, pParameter) {
    super(pDevice);
    this.mSamplerType = pParameter.samplerType;
  }
}
exports.SamplerMemoryLayout = SamplerMemoryLayout;
var SamplerMemoryLayoutInvalidationType;
(function (SamplerMemoryLayoutInvalidationType) {
  SamplerMemoryLayoutInvalidationType["SamplerType"] = "SamplerTypeChange";
})(SamplerMemoryLayoutInvalidationType || (exports.SamplerMemoryLayoutInvalidationType = SamplerMemoryLayoutInvalidationType = {}));

/***/ }),

/***/ "./source/base/memory_layout/texture/texture-memory-layout.ts":
/*!********************************************************************!*\
  !*** ./source/base/memory_layout/texture/texture-memory-layout.ts ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureMemoryLayoutInvalidationType = exports.TextureMemoryLayout = void 0;
const base_memory_layout_1 = __webpack_require__(/*! ../base-memory-layout */ "./source/base/memory_layout/base-memory-layout.ts");
class TextureMemoryLayout extends base_memory_layout_1.BaseMemoryLayout {
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
  } // TODO: Format-Change
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
    this.mDimension = pParameter.dimension;
    this.mFormat = pParameter.format;
    this.mMultisampled = pParameter.multisampled;
  }
}
exports.TextureMemoryLayout = TextureMemoryLayout;
var TextureMemoryLayoutInvalidationType;
(function (TextureMemoryLayoutInvalidationType) {
  TextureMemoryLayoutInvalidationType["Format"] = "FormatChange";
  TextureMemoryLayoutInvalidationType["Dimension"] = "DimensionChange";
})(TextureMemoryLayoutInvalidationType || (exports.TextureMemoryLayoutInvalidationType = TextureMemoryLayoutInvalidationType = {}));

/***/ }),

/***/ "./source/base/pipeline/compute-pipeline.ts":
/*!**************************************************!*\
  !*** ./source/base/pipeline/compute-pipeline.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ComputePipelineInvalidationType = exports.ComputePipeline = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const compute_stage_enum_1 = __webpack_require__(/*! ../../constant/compute-stage.enum */ "./source/constant/compute-stage.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
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
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    this.mShaderModule = pShader;
    // Pipeline constants.
    this.mParameter = new core_1.Dictionary();
    // Listen for shader changes.
    this.mShaderModule.shader.addInvalidationListener(() => {
      this.invalidate(ComputePipelineInvalidationType.Shader);
    });
    this.mShaderModule.shader.layout.addInvalidationListener(() => {
      this.invalidate(ComputePipelineInvalidationType.Shader);
    });
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
    this.invalidate(ComputePipelineInvalidationType.Parameter);
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
    // Async is none GPU stalling. // TODO: Async create compute pipeline somehow.
    return this.device.gpu.createComputePipeline(lPipelineDescriptor);
  }
}
exports.ComputePipeline = ComputePipeline;
var ComputePipelineInvalidationType;
(function (ComputePipelineInvalidationType) {
  ComputePipelineInvalidationType["Shader"] = "ShaderChange";
  ComputePipelineInvalidationType["Config"] = "ConfigChange";
  ComputePipelineInvalidationType["Parameter"] = "ParameterChange";
})(ComputePipelineInvalidationType || (exports.ComputePipelineInvalidationType = ComputePipelineInvalidationType = {}));

/***/ }),

/***/ "./source/base/pipeline/parameter/vertex-parameter-buffer-layout-setup.ts":
/*!********************************************************************************!*\
  !*** ./source/base/pipeline/parameter/vertex-parameter-buffer-layout-setup.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexParameterBufferLayoutSetup = void 0;
const gpu_object_child_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-child-setup */ "./source/base/gpu/object/gpu-object-child-setup.ts");
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

/***/ "./source/base/pipeline/parameter/vertex-parameter-layout-setup.ts":
/*!*************************************************************************!*\
  !*** ./source/base/pipeline/parameter/vertex-parameter-layout-setup.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexParameterLayoutSetup = void 0;
const gpu_object_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-setup */ "./source/base/gpu/object/gpu-object-setup.ts");
const vertex_parameter_buffer_layout_setup_1 = __webpack_require__(/*! ./vertex-parameter-buffer-layout-setup */ "./source/base/pipeline/parameter/vertex-parameter-buffer-layout-setup.ts");
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

/***/ "./source/base/pipeline/parameter/vertex-parameter-layout.ts":
/*!*******************************************************************!*\
  !*** ./source/base/pipeline/parameter/vertex-parameter-layout.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexParameterLayout = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const vertex_parameter_step_mode_enum_1 = __webpack_require__(/*! ../../../constant/vertex-parameter-step-mode.enum */ "./source/constant/vertex-parameter-step-mode.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const primitive_buffer_multiplier_enum_1 = __webpack_require__(/*! ../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum */ "./source/base/memory_layout/buffer/enum/primitive-buffer-multiplier.enum.ts");
const vertex_parameter_1 = __webpack_require__(/*! ./vertex-parameter */ "./source/base/pipeline/parameter/vertex-parameter.ts");
const vertex_parameter_layout_setup_1 = __webpack_require__(/*! ./vertex-parameter-layout-setup */ "./source/base/pipeline/parameter/vertex-parameter-layout-setup.ts");
const vertex_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/vertex-buffer-memory-layout */ "./source/base/memory_layout/buffer/vertex-buffer-memory-layout.ts");
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
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
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
        // Convert multiplier to float32 format. // TODO: How to support other vertex formats.
        let lFormat = `${lBuffer.format}x${lByteMultiplier}`;
        if (lParameter.multiplier === primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Single) {
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

/***/ "./source/base/pipeline/parameter/vertex-parameter.ts":
/*!************************************************************!*\
  !*** ./source/base/pipeline/parameter/vertex-parameter.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexParameterInvalidationType = exports.VertexParameter = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const buffer_usage_enum_1 = __webpack_require__(/*! ../../../constant/buffer-usage.enum */ "./source/constant/buffer-usage.enum.ts");
const vertex_parameter_step_mode_enum_1 = __webpack_require__(/*! ../../../constant/vertex-parameter-step-mode.enum */ "./source/constant/vertex-parameter-step-mode.enum.ts");
const gpu_buffer_1 = __webpack_require__(/*! ../../buffer/gpu-buffer */ "./source/base/buffer/gpu-buffer.ts");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const array_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/array-buffer-memory-layout */ "./source/base/memory_layout/buffer/array-buffer-memory-layout.ts");
const primitive_buffer_format_enum_1 = __webpack_require__(/*! ../../memory_layout/buffer/enum/primitive-buffer-format.enum */ "./source/base/memory_layout/buffer/enum/primitive-buffer-format.enum.ts");
const primitive_buffer_multiplier_enum_1 = __webpack_require__(/*! ../../memory_layout/buffer/enum/primitive-buffer-multiplier.enum */ "./source/base/memory_layout/buffer/enum/primitive-buffer-multiplier.enum.ts");
const primitive_buffer_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/buffer/primitive-buffer-memory-layout */ "./source/base/memory_layout/buffer/primitive-buffer-memory-layout.ts");
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
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    // Set vertex parameter layout.
    this.mLayout = pVertexParameterLayout;
    this.mData = new core_1.Dictionary();
    // Invalidate on layout change.
    this.mLayout.addInvalidationListener(() => {
      this.invalidate(VertexParameterInvalidationType.Data);
    });
    // Create index layout.
    const lIndexLayout = new primitive_buffer_memory_layout_1.PrimitiveBufferMemoryLayout(this.device, {
      primitiveFormat: primitive_buffer_format_enum_1.PrimitiveBufferFormat.Uint32,
      primitiveMultiplier: primitive_buffer_multiplier_enum_1.PrimitiveBufferMultiplier.Single
    });
    // Create index buffer layout.
    const lIndexBufferLayout = new array_buffer_memory_layout_1.ArrayBufferMemoryLayout(this.device, {
      arraySize: pIndices.length,
      innerType: lIndexLayout
    });
    // Create index buffer.
    this.mIndexBuffer = null;
    if (this.mLayout.indexable) {
      this.mIndexBuffer = new gpu_buffer_1.GpuBuffer(pDevice, lIndexBufferLayout, primitive_buffer_format_enum_1.PrimitiveBufferFormat.Uint32).initialData(() => {
        return new Uint32Array(pIndices);
      }).extendUsage(buffer_usage_enum_1.BufferUsage.Index);
    }
    // Save index information.
    this.mIndices = pIndices;
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
      switch (lParameterLayout.format) {
        // TODO. Support all 8 16 and 32 formats. 
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32:
          {
            return new gpu_buffer_1.GpuBuffer(this.device, lParameterLayout.layout, primitive_buffer_format_enum_1.PrimitiveBufferFormat.Float32, lVertexParameterItemCount).initialData(() => {
              return new Float32Array(lData);
            });
          }
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Sint32:
          {
            return new gpu_buffer_1.GpuBuffer(this.device, lParameterLayout.layout, primitive_buffer_format_enum_1.PrimitiveBufferFormat.Sint32, lVertexParameterItemCount).initialData(() => {
              return new Int32Array(lData);
            });
          }
        case primitive_buffer_format_enum_1.PrimitiveBufferFormat.Uint32:
          {
            return new gpu_buffer_1.GpuBuffer(this.device, lParameterLayout.layout, primitive_buffer_format_enum_1.PrimitiveBufferFormat.Uint32, lVertexParameterItemCount).initialData(() => {
              return new Uint32Array(lData);
            });
          }
        default:
          {
            throw new core_1.Exception(`Format "${lParameterLayout.format}" not supported for vertex buffer.`, this);
          }
      }
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
  VertexParameterInvalidationType["Layout"] = "LayoutChange";
})(VertexParameterInvalidationType || (exports.VertexParameterInvalidationType = VertexParameterInvalidationType = {}));

/***/ }),

/***/ "./source/base/pipeline/target/render-targets-setup.ts":
/*!*************************************************************!*\
  !*** ./source/base/pipeline/target/render-targets-setup.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderTargetsSetup = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const texture_operation_enum_1 = __webpack_require__(/*! ../../../constant/texture-operation.enum */ "./source/constant/texture-operation.enum.ts");
const gpu_object_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-setup */ "./source/base/gpu/object/gpu-object-setup.ts");
const canvas_texture_1 = __webpack_require__(/*! ../../texture/canvas-texture */ "./source/base/texture/canvas-texture.ts");
const render_targets_texture_setup_1 = __webpack_require__(/*! ./render-targets-texture-setup */ "./source/base/pipeline/target/render-targets-texture-setup.ts");
class RenderTargetsSetup extends gpu_object_setup_1.GpuObjectSetup {
  /**
   * Constructor
   *
   * @param pSetupReference -Setup references.
   */
  constructor(pSetupReference) {
    super(pSetupReference);
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
      texture: null
    };
    // Add to color attachment list.
    this.setupData.colorTargets.push(lTarget);
    // Return texture setup. Set texture on texture resolve.
    return new render_targets_texture_setup_1.RenderTargetTextureSetup(this.setupReferences, pTexture => {
      lTarget.texture = pTexture;
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
      texture: null
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
    return new render_targets_texture_setup_1.RenderTargetTextureSetup(this.setupReferences, pTexture => {
      // Restrict used texture type to a frame buffer.
      if (pTexture instanceof canvas_texture_1.CanvasTexture) {
        throw new core_1.Exception(`Can't use a canvas texture as depth or stencil texture.`, this);
      }
      this.setupData.depthStencil.texture = pTexture;
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

/***/ "./source/base/pipeline/target/render-targets-texture-setup.ts":
/*!*********************************************************************!*\
  !*** ./source/base/pipeline/target/render-targets-texture-setup.ts ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderTargetTextureSetup = void 0;
const texture_dimension_enum_1 = __webpack_require__(/*! ../../../constant/texture-dimension.enum */ "./source/constant/texture-dimension.enum.ts");
const gpu_object_child_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-child-setup */ "./source/base/gpu/object/gpu-object-child-setup.ts");
const texture_memory_layout_1 = __webpack_require__(/*! ../../memory_layout/texture/texture-memory-layout */ "./source/base/memory_layout/texture/texture-memory-layout.ts");
const frame_buffer_texture_1 = __webpack_require__(/*! ../../texture/frame-buffer-texture */ "./source/base/texture/frame-buffer-texture.ts");
class RenderTargetTextureSetup extends gpu_object_child_setup_1.GpuObjectChildSetup {
  /**
   * Create new color render target.
   */
  new(pFormat) {
    // Lock setup to a setup call.
    this.ensureThatInSetup();
    const lMemoryLayout = new texture_memory_layout_1.TextureMemoryLayout(this.device, {
      dimension: texture_dimension_enum_1.TextureDimension.TwoDimension,
      format: pFormat,
      // TODO: Validate with format validator. // TODO: Add format preferences/restrictions to texture setup.
      multisampled: false // Should be set in render target generation.
    });
    // Callback texture.
    this.sendData(new frame_buffer_texture_1.FrameBufferTexture(this.device, lMemoryLayout));
  }
  /**
   * Use a existing texture.
   *
   * @param pTexture - Existing texture.
   */
  use(pTexture) {
    // Lock setup to a setup call.
    this.ensureThatInSetup();
    // Callback texture.
    this.sendData(pTexture);
  }
}
exports.RenderTargetTextureSetup = RenderTargetTextureSetup;

/***/ }),

/***/ "./source/base/pipeline/target/render-targets.ts":
/*!*******************************************************!*\
  !*** ./source/base/pipeline/target/render-targets.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RenderTargetsInvalidationType = exports.RenderTargets = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const texture_aspect_enum_1 = __webpack_require__(/*! ../../../constant/texture-aspect.enum */ "./source/constant/texture-aspect.enum.ts");
const texture_operation_enum_1 = __webpack_require__(/*! ../../../constant/texture-operation.enum */ "./source/constant/texture-operation.enum.ts");
const texture_usage_enum_1 = __webpack_require__(/*! ../../../constant/texture-usage.enum */ "./source/constant/texture-usage.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const canvas_texture_1 = __webpack_require__(/*! ../../texture/canvas-texture */ "./source/base/texture/canvas-texture.ts");
const frame_buffer_texture_1 = __webpack_require__(/*! ../../texture/frame-buffer-texture */ "./source/base/texture/frame-buffer-texture.ts");
const render_targets_setup_1 = __webpack_require__(/*! ./render-targets-setup */ "./source/base/pipeline/target/render-targets-setup.ts");
/**
 * Group of textures with the same size and multisample level.
 */
class RenderTargets extends gpu_object_1.GpuObject {
  /**
   * Color attachment textures.
   */
  get colorTextures() {
    // Ensure setup was called.
    this.ensureSetup();
    // Create color attachment list in order.
    const lColorAttachmentList = new Array();
    for (const lColorAttachment of this.mColorTextures.values()) {
      lColorAttachmentList[lColorAttachment.index] = lColorAttachment.texture.target;
    }
    return lColorAttachmentList;
  }
  /**
   * Depth attachment texture.
   */
  get depthTexture() {
    // Ensure setup was called.
    this.ensureSetup();
    // No depth texture setup.
    if (!this.mDepthStencilTexture || !this.mDepthStencilTexture.depth) {
      return null;
    }
    return this.mDepthStencilTexture.target;
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
  get multiSampleLevel() {
    return this.mSize.multisampleLevel;
  }
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  /**
   * Stencil attachment texture.
   */
  get stencilTexture() {
    // Ensure setup was called.
    this.ensureSetup();
    return this.mDepthStencilTexture?.stencil ? this.mDepthStencilTexture.target : null;
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
  constructor(pDevice) {
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    // Set "fixed" 
    this.mSize = {
      width: 1,
      height: 1,
      multisampleLevel: 1
    };
    // Setup initial data.
    this.mDepthStencilTexture = null;
    this.mColorTextures = new core_1.Dictionary();
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
  resize(pHeight, pWidth, pMultisampleLevel = null) {
    // Set 2D size dimensions
    this.mSize.width = pWidth;
    this.mSize.height = pHeight;
    // Optional multisample level.
    if (pMultisampleLevel !== null) {
      if (pMultisampleLevel !== 1 && pMultisampleLevel % 4 !== 0) {
        throw new core_1.Exception(`Only multisample level 1 or 4 is supported.`, this);
      }
      this.mSize.multisampleLevel = pMultisampleLevel;
    }
    // Apply resize for all textures.
    this.applyResize();
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
    // Create color attachment list in order.
    const lColorAttachmentList = new Array();
    for (const lColorAttachment of this.mColorTextures.values()) {
      lColorAttachmentList[lColorAttachment.index] = lColorAttachment;
    }
    // Create color attachments.
    const lColorAttachments = new Array();
    for (const lColorAttachment of lColorAttachmentList) {
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
      // Resolve optional resolve attachment but only when texture uses multisample.
      if (lColorAttachment.texture.resolve) {
        lPassColorAttachment.resolveTarget = lColorAttachment.texture.resolve.native;
      }
      lColorAttachments.push(lPassColorAttachment);
    }
    // Create descriptor with color attachments.
    const lDescriptor = {
      colorAttachments: lColorAttachments
    };
    // Set optional depth attachment.
    if (this.mDepthStencilTexture) {
      const lDepthStencilTexture = this.mDepthStencilTexture.target;
      // Add texture view for depth.
      lDescriptor.depthStencilAttachment = {
        view: lDepthStencilTexture.native
      };
      // Add depth values when depth formats are used.
      if (this.mDepthStencilTexture.depth) {
        // Set clear value of depth texture.
        if (this.mDepthStencilTexture.depth.clearValue !== null) {
          lDescriptor.depthStencilAttachment.depthClearValue = this.mDepthStencilTexture.depth.clearValue;
          lDescriptor.depthStencilAttachment.depthLoadOp = 'clear';
        } else {
          lDescriptor.depthStencilAttachment.depthLoadOp = 'load';
        }
        // Convert Texture operation to load operations.
        lDescriptor.depthStencilAttachment.depthStoreOp = this.mDepthStencilTexture.depth.storeOperation === texture_operation_enum_1.TextureOperation.Keep ? 'store' : 'discard';
      }
      // Add stencil values when stencil formats are used.
      if (this.mDepthStencilTexture.stencil) {
        // Set clear value of stencil texture.
        if (this.mDepthStencilTexture.stencil.clearValue !== null) {
          lDescriptor.depthStencilAttachment.stencilClearValue = this.mDepthStencilTexture.stencil.clearValue;
          lDescriptor.depthStencilAttachment.stencilLoadOp = 'clear';
        } else {
          lDescriptor.depthStencilAttachment.stencilLoadOp = 'load';
        }
        // Convert Texture operation to load operations.
        lDescriptor.depthStencilAttachment.stencilStoreOp = this.mDepthStencilTexture.stencil.storeOperation === texture_operation_enum_1.TextureOperation.Keep ? 'store' : 'discard';
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
    // Setup depth stencil targets.
    if (pReferenceData.depthStencil) {
      // Validate existance of depth stencil texture.
      if (!pReferenceData.depthStencil.texture) {
        throw new core_1.Exception(`Depth/ stencil attachment defined but no texture was assigned.`, this);
      }
      // Save setup texture.
      this.mDepthStencilTexture = {
        target: pReferenceData.depthStencil.texture
      };
      // Passthrough depth stencil texture changes.
      pReferenceData.depthStencil.texture.addInvalidationListener(() => {
        this.invalidate(RenderTargetsInvalidationType.Texture);
      });
      // Add render attachment texture usage to depth stencil texture.
      pReferenceData.depthStencil.texture.extendUsage(texture_usage_enum_1.TextureUsage.RenderAttachment);
      // Read capability of used depth stencil texture format.
      const lFormatCapability = this.device.formatValidator.capabilityOf(pReferenceData.depthStencil.texture.layout.format);
      // Setup depth texture.
      if (pReferenceData.depthStencil.depth) {
        // Validate if depth texture
        if (!lFormatCapability.aspect.types.includes(texture_aspect_enum_1.TextureAspect.Depth)) {
          throw new core_1.Exception('Used texture for the depth texture attachment must have a depth aspect. ', this);
        }
        this.mDepthStencilTexture.depth = {
          clearValue: pReferenceData.depthStencil.depth.clearValue,
          storeOperation: pReferenceData.depthStencil.depth.storeOperation
        };
      }
      // Setup stencil texture.
      if (pReferenceData.depthStencil.stencil) {
        // Validate if depth texture
        if (!lFormatCapability.aspect.types.includes(texture_aspect_enum_1.TextureAspect.Stencil)) {
          throw new core_1.Exception('Used texture for the stencil texture attachment must have a depth aspect. ', this);
        }
        this.mDepthStencilTexture.stencil = {
          clearValue: pReferenceData.depthStencil.stencil.clearValue,
          storeOperation: pReferenceData.depthStencil.stencil.storeOperation
        };
      }
    }
    // Setup color targets.
    const lAttachmentLocations = new Array();
    for (const lAttachment of pReferenceData.colorTargets.values()) {
      // Validate existance of color texture.
      if (!lAttachment.texture) {
        throw new core_1.Exception(`Color attachment "${lAttachment.name}" defined but no texture was assigned.`, this);
      }
      // No double names.
      if (this.mColorTextures.has(lAttachment.name)) {
        throw new core_1.Exception(`Color attachment name "${lAttachment.name}" can only be defined once.`, this);
      }
      // No double location indices.
      if (lAttachmentLocations[lAttachment.index] === true) {
        throw new core_1.Exception(`Color attachment location index "${lAttachment.index}" can only be defined once.`, this);
      }
      // Passthrough color texture changes. Any change.
      lAttachment.texture.addInvalidationListener(() => {
        this.invalidate(RenderTargetsInvalidationType.Texture);
      });
      // Add render attachment texture usage to color texture.
      lAttachment.texture.extendUsage(texture_usage_enum_1.TextureUsage.RenderAttachment);
      // Buffer used location index.
      lAttachmentLocations[lAttachment.index] = true;
      // Convert setup into storage data.
      this.mColorTextures.set(lAttachment.name, {
        name: lAttachment.name,
        index: lAttachment.index,
        clearValue: lAttachment.clearValue,
        storeOperation: lAttachment.storeOperation,
        texture: {
          target: lAttachment.texture
        }
      });
    }
    // Validate attachment list.
    if (lAttachmentLocations.length !== this.mColorTextures.size) {
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
    return new render_targets_setup_1.RenderTargetsSetup(pReferences);
  }
  /**
   * Try to update views of pass descriptor.
   *
   * @param pNative - Native pass descriptor.
   * @param pReasons - Update reason.
   *
   * @returns true when native was updated.
   */
  updateNative(pNative, pReasons) {
    // Native can not be updated on any config changes.
    if (pReasons.has(RenderTargetsInvalidationType.Config)) {
      return false;
    }
    // TODO: Make it more performant.
    // Update only views of descriptor. 
    if (pNative.depthStencilAttachment) {
      pNative.depthStencilAttachment.view = this.mDepthStencilTexture.target.native;
    }
    // Create color attachment list in order.
    const lColorAttachmentList = new Array();
    for (const lColorAttachment of this.mColorTextures.values()) {
      lColorAttachmentList[lColorAttachment.index] = lColorAttachment;
    }
    // Create color attachments.
    for (let lColorAttachmentIndex = 0; lColorAttachmentIndex < lColorAttachmentList.length; lColorAttachmentIndex++) {
      // Read current attachment.
      const lCurrentAttachment = pNative.colorAttachments[lColorAttachmentIndex];
      if (lCurrentAttachment === null) {
        continue;
      }
      // Read setup attachments.
      const lColorAttachment = lColorAttachmentList[lColorAttachmentIndex];
      // Update view.
      lCurrentAttachment.view = lColorAttachment.texture.target.native;
      // Update optional resolve target.
      if (lCurrentAttachment.resolveTarget && lColorAttachment.texture.resolve) {
        lCurrentAttachment.resolveTarget = lColorAttachment.texture.resolve.native;
      }
    }
    return true;
  }
  /**
   * Resize all textures.
   */
  applyResize() {
    // Update buffer texture multisample level.
    for (const lAttachment of this.mColorTextures.values()) {
      // Check for removed or added multisample level.
      if (this.mSize.multisampleLevel === 1) {
        // When the multisample state is removed, use all canvas resolve textures into the actual target and clear the placeholder target buffer.
        if (lAttachment.texture.resolve) {
          // Destroy buffering textures.
          lAttachment.texture.target.deconstruct();
          // Use resolve as target.
          lAttachment.texture.target = lAttachment.texture.resolve;
        }
      } else {
        // When the multisample state is added, use all canvas targets as a resolve texture used after rendering and create a new target buffer texture with multisampling. 
        if (lAttachment.texture.target instanceof canvas_texture_1.CanvasTexture) {
          // Move target into resolve.
          lAttachment.texture.resolve = lAttachment.texture.target;
          // Create new texture from canvas texture.
          lAttachment.texture.target = new frame_buffer_texture_1.FrameBufferTexture(this.device, lAttachment.texture.resolve.layout);
          lAttachment.texture.target.extendUsage(texture_usage_enum_1.TextureUsage.RenderAttachment);
        }
      }
      // Add multisample level only to frame buffers as canvas does not support any mutisampling.
      if (lAttachment.texture.target instanceof frame_buffer_texture_1.FrameBufferTexture) {
        lAttachment.texture.target.multiSampleLevel = this.mSize.multisampleLevel;
      }
    }
    // Update target texture multisample level.
    if (this.mDepthStencilTexture) {
      this.mDepthStencilTexture.target.multiSampleLevel = this.mSize.multisampleLevel;
    }
    // Update buffer texture sizes.
    for (const lAttachment of this.mColorTextures.values()) {
      lAttachment.texture.target.height = this.mSize.height;
      lAttachment.texture.target.width = this.mSize.width;
      if (lAttachment.texture.resolve) {
        lAttachment.texture.resolve.height = this.mSize.height;
        lAttachment.texture.resolve.width = this.mSize.width;
      }
    }
    // Update target texture sizes.
    if (this.mDepthStencilTexture) {
      this.mDepthStencilTexture.target.height = this.mSize.height;
      this.mDepthStencilTexture.target.width = this.mSize.width;
    }
  }
}
exports.RenderTargets = RenderTargets;
var RenderTargetsInvalidationType;
(function (RenderTargetsInvalidationType) {
  RenderTargetsInvalidationType["Config"] = "ConfigChange";
  RenderTargetsInvalidationType["Texture"] = "TextureChange";
})(RenderTargetsInvalidationType || (exports.RenderTargetsInvalidationType = RenderTargetsInvalidationType = {}));

/***/ }),

/***/ "./source/base/pipeline/vertex-fragment-pipeline.ts":
/*!**********************************************************!*\
  !*** ./source/base/pipeline/vertex-fragment-pipeline.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VertexFragmentPipelineInvalidationType = exports.VertexFragmentPipeline = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const compare_function_enum_1 = __webpack_require__(/*! ../../constant/compare-function.enum */ "./source/constant/compare-function.enum.ts");
const compute_stage_enum_1 = __webpack_require__(/*! ../../constant/compute-stage.enum */ "./source/constant/compute-stage.enum.ts");
const primitive_cullmode_enum_1 = __webpack_require__(/*! ../../constant/primitive-cullmode.enum */ "./source/constant/primitive-cullmode.enum.ts");
const primitive_front_face_enum_1 = __webpack_require__(/*! ../../constant/primitive-front-face.enum */ "./source/constant/primitive-front-face.enum.ts");
const primitive_topology_enum_1 = __webpack_require__(/*! ../../constant/primitive-topology.enum */ "./source/constant/primitive-topology.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const render_targets_1 = __webpack_require__(/*! ./target/render-targets */ "./source/base/pipeline/target/render-targets.ts");
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
    this.invalidate(VertexFragmentPipelineInvalidationType.Config);
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
    this.invalidate(VertexFragmentPipelineInvalidationType.Config);
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
    this.invalidate(VertexFragmentPipelineInvalidationType.Config);
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
    this.invalidate(VertexFragmentPipelineInvalidationType.Config);
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
    this.invalidate(VertexFragmentPipelineInvalidationType.Config);
  }
  /**
   * Constructor.
   * Set default data.
   *
   * @param pDevice - Device.
   * @param pShaderRenderModule - Pipeline shader.
   */
  constructor(pDevice, pShaderRenderModule, pRenderTargets) {
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    // Set config objects.
    this.mShaderModule = pShaderRenderModule;
    this.mRenderTargets = pRenderTargets; // TODO: Update pipeline on format change.
    // Pipeline constants.
    this.mParameter = new core_1.Dictionary();
    // Listen for shader changes.
    this.mShaderModule.shader.addInvalidationListener(() => {
      this.invalidate(VertexFragmentPipelineInvalidationType.Shader);
    });
    this.mShaderModule.vertexParameter.addInvalidationListener(() => {
      this.invalidate(VertexFragmentPipelineInvalidationType.Shader);
    });
    this.mShaderModule.shader.layout.addInvalidationListener(() => {
      this.invalidate(VertexFragmentPipelineInvalidationType.Shader);
    });
    // Listen for render target changes.
    this.mRenderTargets.addInvalidationListener(() => {
      this.invalidate(VertexFragmentPipelineInvalidationType.RenderTargets);
    }, [render_targets_1.RenderTargetsInvalidationType.Config]);
    // Depth default settings.
    this.mDepthCompare = compare_function_enum_1.CompareFunction.Less;
    this.mDepthWriteEnabled = true; // TODO: Default based on render target. 
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
    this.invalidate(VertexFragmentPipelineInvalidationType.Parameter);
    return this;
  }
  /**
   * Generate native gpu pipeline data layout.
   */
  generateNative() {
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
      for (const lRenderTarget of this.renderTargets.colorTextures) {
        lFragmentTargetList.push({
          format: lRenderTarget.layout.format
          // blend?: GPUBlendState;   // TODO: GPUBlendState
          // writeMask?: GPUColorWriteFlags; // TODO: GPUColorWriteFlags
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
    if (this.renderTargets.depthTexture) {
      lPipelineDescriptor.depthStencil = {
        depthWriteEnabled: this.writeDepth,
        depthCompare: this.depthCompare,
        format: this.renderTargets.depthTexture.layout.format
      };
    }
    // TODO: Stencil.
    // Set multisample count.
    if (this.renderTargets.multiSampleLevel > 1) {
      lPipelineDescriptor.multisample = {
        count: this.renderTargets.multiSampleLevel
      };
    }
    // Async is none GPU stalling.
    return this.device.gpu.createRenderPipeline(lPipelineDescriptor); // TODO: Async create render pipeline somehow.
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
}
exports.VertexFragmentPipeline = VertexFragmentPipeline;
var VertexFragmentPipelineInvalidationType;
(function (VertexFragmentPipelineInvalidationType) {
  VertexFragmentPipelineInvalidationType["Shader"] = "ShaderChange";
  VertexFragmentPipelineInvalidationType["RenderTargets"] = "RenderTargetsChange";
  VertexFragmentPipelineInvalidationType["Config"] = "ConfigChange";
  VertexFragmentPipelineInvalidationType["Parameter"] = "ParameterChange";
})(VertexFragmentPipelineInvalidationType || (exports.VertexFragmentPipelineInvalidationType = VertexFragmentPipelineInvalidationType = {}));

/***/ }),

/***/ "./source/base/shader/setup/shader-compute-entry-point-setup.ts":
/*!**********************************************************************!*\
  !*** ./source/base/shader/setup/shader-compute-entry-point-setup.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShaderComputeEntryPointSetup = void 0;
const gpu_object_child_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-child-setup */ "./source/base/gpu/object/gpu-object-child-setup.ts");
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

/***/ "./source/base/shader/setup/shader-fragment-entry-point-setup.ts":
/*!***********************************************************************!*\
  !*** ./source/base/shader/setup/shader-fragment-entry-point-setup.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShaderFragmentEntryPointSetup = void 0;
const gpu_object_child_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-child-setup */ "./source/base/gpu/object/gpu-object-child-setup.ts");
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

/***/ "./source/base/shader/setup/shader-setup.ts":
/*!**************************************************!*\
  !*** ./source/base/shader/setup/shader-setup.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShaderSetup = void 0;
const gpu_object_setup_1 = __webpack_require__(/*! ../../gpu/object/gpu-object-setup */ "./source/base/gpu/object/gpu-object-setup.ts");
const vertex_parameter_layout_1 = __webpack_require__(/*! ../../pipeline/parameter/vertex-parameter-layout */ "./source/base/pipeline/parameter/vertex-parameter-layout.ts");
const shader_compute_entry_point_setup_1 = __webpack_require__(/*! ./shader-compute-entry-point-setup */ "./source/base/shader/setup/shader-compute-entry-point-setup.ts");
const shader_fragment_entry_point_setup_1 = __webpack_require__(/*! ./shader-fragment-entry-point-setup */ "./source/base/shader/setup/shader-fragment-entry-point-setup.ts");
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
  /**
   * Add group to layout.
   *
   * @param pIndex - Bind group index.
   * @param pGroup - Group.
   *
   * @returns the same group.
   */
  group(pIndex, pGroup) {
    // Register group.
    this.setupData.bindingGroups.push({
      index: pIndex,
      group: pGroup
    });
    return pGroup;
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

/***/ "./source/base/shader/shader-compute-module.ts":
/*!*****************************************************!*\
  !*** ./source/base/shader/shader-compute-module.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShaderComputeModuleInvalidationType = exports.ShaderComputeModule = void 0;
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const compute_pipeline_1 = __webpack_require__(/*! ../pipeline/compute-pipeline */ "./source/base/pipeline/compute-pipeline.ts");
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
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    this.mEntryPoint = pEntryPointName;
    this.mShader = pShader;
    this.mSize = pSize ?? [-1, -1, -1];
    // Update on shader update.
    pShader.addInvalidationListener(() => {
      this.invalidate(ShaderComputeModuleInvalidationType.Shader);
    });
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
var ShaderComputeModuleInvalidationType;
(function (ShaderComputeModuleInvalidationType) {
  ShaderComputeModuleInvalidationType["Shader"] = "ShaderChange";
})(ShaderComputeModuleInvalidationType || (exports.ShaderComputeModuleInvalidationType = ShaderComputeModuleInvalidationType = {}));

/***/ }),

/***/ "./source/base/shader/shader-render-module.ts":
/*!****************************************************!*\
  !*** ./source/base/shader/shader-render-module.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShaderRenderModuleInvalidationType = exports.ShaderRenderModule = void 0;
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const vertex_fragment_pipeline_1 = __webpack_require__(/*! ../pipeline/vertex-fragment-pipeline */ "./source/base/pipeline/vertex-fragment-pipeline.ts");
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
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    this.mVertexEntryPoint = pVertexEntryPointName;
    this.mVertexParameter = pVertexParameter;
    this.mFragmentEntryPoint = pFragmentEntryPointName ?? null;
    this.mShader = pShader;
    // Update on shader update.
    pShader.addInvalidationListener(() => {
      this.invalidate(ShaderRenderModuleInvalidationType.Shader);
    });
    // Update on vertex parameter.
    pVertexParameter.addInvalidationListener(() => {
      this.invalidate(ShaderRenderModuleInvalidationType.VertexParameter);
    });
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
var ShaderRenderModuleInvalidationType;
(function (ShaderRenderModuleInvalidationType) {
  ShaderRenderModuleInvalidationType["Shader"] = "ShaderChange";
  ShaderRenderModuleInvalidationType["VertexParameter"] = "VertexParameterChange";
})(ShaderRenderModuleInvalidationType || (exports.ShaderRenderModuleInvalidationType = ShaderRenderModuleInvalidationType = {}));

/***/ }),

/***/ "./source/base/shader/shader.ts":
/*!**************************************!*\
  !*** ./source/base/shader/shader.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ShaderInvalidationType = exports.Shader = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const pipeline_layout_1 = __webpack_require__(/*! ../binding/pipeline-layout */ "./source/base/binding/pipeline-layout.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const shader_setup_1 = __webpack_require__(/*! ./setup/shader-setup */ "./source/base/shader/setup/shader-setup.ts");
const shader_compute_module_1 = __webpack_require__(/*! ./shader-compute-module */ "./source/base/shader/shader-compute-module.ts");
const shader_render_module_1 = __webpack_require__(/*! ./shader-render-module */ "./source/base/shader/shader-render-module.ts");
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
  constructor(pDevice, pSource) {
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    // Create shader information for source.
    this.mSource = pSource;
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
      compilationHints: lCompilationHints
      // TODO: sourceMap: undefined
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
    // Invalidate shader every time the pipeline layout changes.
    this.mPipelineLayout.addInvalidationListener(() => {
      this.invalidate(ShaderInvalidationType.PipelineLayout);
    });
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
var ShaderInvalidationType;
(function (ShaderInvalidationType) {
  ShaderInvalidationType["PipelineLayout"] = "PipelineLayoutChange";
})(ShaderInvalidationType || (exports.ShaderInvalidationType = ShaderInvalidationType = {}));

/***/ }),

/***/ "./source/base/texture/base-texture.ts":
/*!*********************************************!*\
  !*** ./source/base/texture/base-texture.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.BaseTexture = void 0;
const texture_usage_enum_1 = __webpack_require__(/*! ../../constant/texture-usage.enum */ "./source/constant/texture-usage.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
class BaseTexture extends gpu_object_1.GpuObject {
  /**
   * Texture memory layout.
   */
  get layout() {
    return this.mMemoryLayout;
  }
  /**
   * Native gpu object.
   */
  get native() {
    return super.native;
  }
  get usage() {
    return this.mTextureUsage;
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   * @param pLayout - Texture layout.
   * @param pCanvas - Canvas of texture.
   */
  constructor(pDevice, pLayout, pLifeTime) {
    super(pDevice, pLifeTime);
    // Set layout.
    this.mMemoryLayout = pLayout;
    this.mTextureUsage = texture_usage_enum_1.TextureUsage.None;
  }
  /**
   * Extend usage of texture.
   * Might trigger a texture rebuild.
   *
   * @param pUsage - Texture usage.
   */
  extendUsage(pUsage) {
    // Update onyl when not already set.
    if ((this.mTextureUsage & pUsage) === 0) {
      this.mTextureUsage |= pUsage;
      this.onUsageExtend();
    }
    return this;
  }
}
exports.BaseTexture = BaseTexture;

/***/ }),

/***/ "./source/base/texture/canvas-texture.ts":
/*!***********************************************!*\
  !*** ./source/base/texture/canvas-texture.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CanvasTextureInvalidationType = exports.CanvasTexture = void 0;
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const texture_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/texture-memory-layout */ "./source/base/memory_layout/texture/texture-memory-layout.ts");
const base_texture_1 = __webpack_require__(/*! ./base-texture */ "./source/base/texture/base-texture.ts");
class CanvasTexture extends base_texture_1.BaseTexture {
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
    // Height autoapplies. No need to trigger invalidation.
    this.mCanvas.height = pValue;
  }
  /**
   * Texture width.
   */
  get width() {
    return this.mCanvas.width;
  }
  set width(pValue) {
    // Width autoapplies. No need to trigger invalidation.
    this.mCanvas.width = pValue;
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   * @param pLayout - Texture layout.
   * @param pCanvas - Canvas of texture.
   */
  constructor(pDevice, pLayout, pCanvas) {
    super(pDevice, pLayout, gpu_object_life_time_enum_1.GpuObjectLifeTime.Frame);
    // Set canvas reference.
    this.mCanvas = pCanvas;
    this.mContext = null;
    // Set defaults.
    this.height = 1;
    this.width = 1;
    // Register change listener for layout changes.
    pLayout.addInvalidationListener(() => {
      this.invalidate(CanvasTextureInvalidationType.Layout);
    }, [texture_memory_layout_1.TextureMemoryLayoutInvalidationType.Format]);
  }
  /**
   * Destory texture object.
   * @param _pNativeObject - Native canvas texture.
   */
  destroyNative(_pNativeObject, pReasons) {
    // Context is only invalid on deconstruct or layout has changes.
    const lContextInvalid = pReasons.deconstruct || pReasons.has(CanvasTextureInvalidationType.Layout) || pReasons.has(CanvasTextureInvalidationType.Usage);
    // Only destroy context when child data/layout has changes.
    if (lContextInvalid) {
      // Destory context.
      this.mContext.unconfigure();
      this.mContext = null;
    }
    // Native view can not be destroyed.
  }
  /**
   * Generate native canvas texture view.
   */
  generateNative(pReasons) {
    // Invalidate for frame change.
    if (pReasons.lifeTimeReached) {
      this.invalidate(CanvasTextureInvalidationType.Frame);
    }
    // Read canvas format.
    const lFormat = this.layout.format;
    // Configure new context when not alread configured or destroyed.
    if (!this.mContext) {
      // Create and configure canvas context.
      this.mContext = this.canvas.getContext('webgpu');
      this.mContext.configure({
        device: this.device.gpu,
        format: lFormat,
        usage: this.usage,
        alphaMode: 'opaque'
      });
    }
    // Read current texture of canvas. Needs to be retrieved for each frame.
    const lTexture = this.mContext.getCurrentTexture();
    // force a two dimensional view.
    return lTexture.createView({
      format: lFormat,
      dimension: '2d'
    });
  }
  /**
   * On usage extened. Triggers a texture rebuild.
   */
  onUsageExtend() {
    this.invalidate(CanvasTextureInvalidationType.Usage);
  }
}
exports.CanvasTexture = CanvasTexture;
var CanvasTextureInvalidationType;
(function (CanvasTextureInvalidationType) {
  CanvasTextureInvalidationType["Layout"] = "LayoutChange";
  CanvasTextureInvalidationType["Frame"] = "FrameChange";
  CanvasTextureInvalidationType["Usage"] = "UsageChange";
})(CanvasTextureInvalidationType || (exports.CanvasTextureInvalidationType = CanvasTextureInvalidationType = {}));

/***/ }),

/***/ "./source/base/texture/frame-buffer-texture.ts":
/*!*****************************************************!*\
  !*** ./source/base/texture/frame-buffer-texture.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.FrameBufferTextureInvalidationType = exports.FrameBufferTexture = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const texture_dimension_enum_1 = __webpack_require__(/*! ../../constant/texture-dimension.enum */ "./source/constant/texture-dimension.enum.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const texture_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/texture-memory-layout */ "./source/base/memory_layout/texture/texture-memory-layout.ts");
const base_texture_1 = __webpack_require__(/*! ./base-texture */ "./source/base/texture/base-texture.ts");
class FrameBufferTexture extends base_texture_1.BaseTexture {
  /**
   * Texture depth.
   */
  get depth() {
    return this.mDepth;
  }
  set depth(pValue) {
    this.mDepth = pValue;
    // Invalidate native.
    this.invalidate(FrameBufferTextureInvalidationType.Size);
  }
  /**
   * Texture height.
   */
  get height() {
    return this.mHeight;
  }
  set height(pValue) {
    this.mHeight = pValue;
    // Invalidate native.
    this.invalidate(FrameBufferTextureInvalidationType.Size);
  }
  /**
   * Texture multi sample level. // TODO: Move into layout. Maybe. Or not. As a layout can only hold true or false.
   */
  get multiSampleLevel() {
    return this.mMultiSampleLevel;
  }
  set multiSampleLevel(pValue) {
    this.mMultiSampleLevel = pValue;
    // Invalidate native.
    this.invalidate(FrameBufferTextureInvalidationType.MultiSampleLevel);
  }
  /**
   * Texture width.
   */
  get width() {
    return this.mWidth;
  }
  set width(pValue) {
    this.mWidth = pValue;
    // Invalidate native.
    this.invalidate(FrameBufferTextureInvalidationType.Size);
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   * @param pLayout - Texture memory layout.
   */
  constructor(pDevice, pLayout) {
    super(pDevice, pLayout, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    this.mTexture = null;
    // Set defaults.
    this.mDepth = 1;
    this.mHeight = 1;
    this.mWidth = 1;
    this.mMultiSampleLevel = 1;
    // Register change listener for layout changes.
    pLayout.addInvalidationListener(() => {
      this.invalidate(FrameBufferTextureInvalidationType.Layout);
    }, [texture_memory_layout_1.TextureMemoryLayoutInvalidationType.Dimension, texture_memory_layout_1.TextureMemoryLayoutInvalidationType.Format]);
  }
  /**
   * Destory texture object.
   * @param _pNativeObject - Native canvas texture.
   */
  destroyNative(_pNativeObject) {
    this.mTexture?.destroy();
    this.mTexture = null;
  }
  /**
   * Generate native canvas texture view.
   */
  generateNative() {
    // TODO: Validate format based on layout. Maybe replace used format.
    // Validate two dimensional texture.
    if (this.layout.dimension !== texture_dimension_enum_1.TextureDimension.TwoDimension) {
      throw new core_1.Exception('Frame buffers must be two dimensional.', this);
    }
    // Create and configure canvas context.
    this.mTexture = this.device.gpu.createTexture({
      label: 'Frame-Buffer-Texture',
      size: [this.width, this.height, 1],
      // Force 2d texture.
      format: this.layout.format,
      usage: this.usage,
      dimension: '2d',
      sampleCount: this.multiSampleLevel
    });
    // Force a 2d view.
    return this.mTexture.createView({
      format: this.layout.format,
      dimension: '2d'
    });
  }
  /**
   * On usage extened. Triggers a texture rebuild.
   */
  onUsageExtend() {
    this.invalidate(FrameBufferTextureInvalidationType.Usage);
  }
}
exports.FrameBufferTexture = FrameBufferTexture;
var FrameBufferTextureInvalidationType;
(function (FrameBufferTextureInvalidationType) {
  FrameBufferTextureInvalidationType["Layout"] = "LayoutChange";
  FrameBufferTextureInvalidationType["Size"] = "SizeChange";
  FrameBufferTextureInvalidationType["MultiSampleLevel"] = "MultiSampleLevel";
  FrameBufferTextureInvalidationType["Usage"] = "UsageChange";
})(FrameBufferTextureInvalidationType || (exports.FrameBufferTextureInvalidationType = FrameBufferTextureInvalidationType = {}));

/***/ }),

/***/ "./source/base/texture/image-texture.ts":
/*!**********************************************!*\
  !*** ./source/base/texture/image-texture.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ImageTextureInvalidationType = exports.ImageTexture = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const texture_dimension_enum_1 = __webpack_require__(/*! ../../constant/texture-dimension.enum */ "./source/constant/texture-dimension.enum.ts");
const texture_usage_enum_1 = __webpack_require__(/*! ../../constant/texture-usage.enum */ "./source/constant/texture-usage.enum.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const texture_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/texture-memory-layout */ "./source/base/memory_layout/texture/texture-memory-layout.ts");
const base_texture_1 = __webpack_require__(/*! ./base-texture */ "./source/base/texture/base-texture.ts");
class ImageTexture extends base_texture_1.BaseTexture {
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
    super(pDevice, pLayout, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    this.mTexture = null;
    // Set defaults.
    this.mDepth = 1;
    this.mHeight = 1;
    this.mWidth = 1;
    this.mImageList = new Array();
    // Register change listener for layout changes.
    pLayout.addInvalidationListener(() => {
      this.invalidate(ImageTextureInvalidationType.Layout);
    }, [texture_memory_layout_1.TextureMemoryLayoutInvalidationType.Dimension, texture_memory_layout_1.TextureMemoryLayoutInvalidationType.Format]);
  }
  /**
   * Load image into texture.
   * Images needs to have the same dimensions.
   *
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
            throw new core_1.Exception(`Texture image layers are not the same size. (${lImage.naturalWidth}, ${lImage.naturalHeight}) needs (${lWidth}, ${lHeight}).`, _this);
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
      _this.invalidate(ImageTextureInvalidationType.ImageBinary);
    })();
  }
  /**
   * Destory texture object.
   * @param _pNativeObject - Native canvas texture.
   */
  destroyNative(_pNativeObject) {
    this.mTexture?.destroy();
    this.mTexture = null;
  }
  /**
   * Generate native canvas texture view.
   */
  generateNative() {
    // TODO: Validate format based on layout. Maybe replace used format.
    // Generate gpu dimension from memory layout dimension.
    const lGpuDimension = (() => {
      switch (this.layout.dimension) {
        case texture_dimension_enum_1.TextureDimension.OneDimension:
          {
            return '1d';
          }
        case texture_dimension_enum_1.TextureDimension.TwoDimension:
          {
            return '2d';
          }
        case texture_dimension_enum_1.TextureDimension.TwoDimensionArray:
          {
            return '2d';
          }
        case texture_dimension_enum_1.TextureDimension.Cube:
          {
            return '2d';
          }
        case texture_dimension_enum_1.TextureDimension.CubeArray:
          {
            return '2d';
          }
        case texture_dimension_enum_1.TextureDimension.ThreeDimension:
          {
            return '3d';
          }
      }
    })();
    // To copy images, the texture needs to be a render attachment and copy destination.
    // Extend usage before texture creation.
    if (this.images.length > 0) {
      this.extendUsage(texture_usage_enum_1.TextureUsage.RenderAttachment);
      this.extendUsage(texture_usage_enum_1.TextureUsage.CopyDestination);
    }
    // Create texture with set size, format and usage. Save it for destorying later.
    this.mTexture = this.device.gpu.createTexture({
      label: 'Frame-Buffer-Texture',
      size: [this.width, this.height, this.depth],
      format: this.layout.format,
      usage: this.usage,
      dimension: lGpuDimension
    });
    // Load images into texture. // TODO: Make it somewhat comnpletly async.
    for (let lImageIndex = 0; lImageIndex < this.images.length; lImageIndex++) {
      const lBitmap = this.images[lImageIndex];
      // Copy image into depth layer.
      this.device.gpu.queue.copyExternalImageToTexture({
        source: lBitmap
      }, {
        texture: this.mTexture,
        origin: [0, 0, lImageIndex]
      }, [lBitmap.width, lBitmap.height]);
    }
    // TODO: mipLevel??
    // TODO: ArrayLayer based on dimension.
    // TODO: View descriptor.
    return this.mTexture.createView({
      format: this.layout.format,
      dimension: this.layout.dimension
    });
  }
  /**
   * On usage extened. Triggers a texture rebuild.
   */
  onUsageExtend() {
    this.invalidate(ImageTextureInvalidationType.Usage);
  }
}
exports.ImageTexture = ImageTexture;
var ImageTextureInvalidationType;
(function (ImageTextureInvalidationType) {
  ImageTextureInvalidationType["Layout"] = "LayoutChange";
  ImageTextureInvalidationType["ImageBinary"] = "ImageBinaryChange";
  ImageTextureInvalidationType["Usage"] = "UsageChange";
})(ImageTextureInvalidationType || (exports.ImageTextureInvalidationType = ImageTextureInvalidationType = {}));

/***/ }),

/***/ "./source/base/texture/texture-format-capabilities.ts":
/*!************************************************************!*\
  !*** ./source/base/texture/texture-format-capabilities.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureFormatCapabilities = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const texture_aspect_enum_1 = __webpack_require__(/*! ../../constant/texture-aspect.enum */ "./source/constant/texture-aspect.enum.ts");
const texture_dimension_enum_1 = __webpack_require__(/*! ../../constant/texture-dimension.enum */ "./source/constant/texture-dimension.enum.ts");
const texture_format_enum_1 = __webpack_require__(/*! ../../constant/texture-format.enum */ "./source/constant/texture-format.enum.ts");
const texture_sample_type_enum_1 = __webpack_require__(/*! ../../constant/texture-sample-type.enum */ "./source/constant/texture-sample-type.enum.ts");
const gpu_feature_enum_1 = __webpack_require__(/*! ../gpu/capabilities/gpu-feature.enum */ "./source/base/gpu/capabilities/gpu-feature.enum.ts");
class TextureFormatCapabilities {
  /**
   * Get prefered canvas format.
   */
  get preferredCanvasFormat() {
    return window.navigator.gpu.getPreferredCanvasFormat();
  }
  // TODO: https://www.w3.org/TR/webgpu/#texture-format-caps
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
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R8snorm, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: false,
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R8uint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R8sint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    // 16-bit formats
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R16uint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R16sint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R16float, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg8unorm, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg8snorm, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: false,
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg8uint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg8sint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    // 32-bit formats
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R32uint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: true
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R32sint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: true
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.R32float, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: lFloat32Filterable,
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: true
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg16uint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg16sint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg16float, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba8unorm, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba8unormSrgb, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba8snorm, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: false,
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba8uint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba8sint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bgra8unorm, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: pDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.Bgra8unormStorage),
          writeonly: false,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bgra8unormSrgb, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    // Packed 32-bit formats
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgb9e5ufloat, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 1,
      usage: {
        textureBinding: true,
        renderAttachment: false,
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgb10a2uint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgb10a2unorm, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg11b10ufloat, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: pDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.Rg11b10ufloatRenderable) ? {
          resolveTarget: true,
          blendable: true,
          multisample: true
        } : false,
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    // 64-bit formats
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg32uint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg32sint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rg32float, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: lFloat32Filterable,
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba16uint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba16sint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba16float, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.Float, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: true,
          blendable: true,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
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
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba32sint, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: [texture_sample_type_enum_1.TextureSampleType.SignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: {
          readonly: true,
          writeonly: true,
          readwrite: false
        }
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Rgba32float, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray, texture_dimension_enum_1.TextureDimension.ThreeDimension],
      type: lFloat32Filterable,
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: false
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
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
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Stencil],
        byteCost: 1
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray],
      type: [texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Depth16unorm, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Depth],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray],
      type: [texture_sample_type_enum_1.TextureSampleType.Depth, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: true
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Depth24plus, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Depth],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray],
      type: [texture_sample_type_enum_1.TextureSampleType.Depth, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: false,
          imageTarget: false
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Depth24plusStencil8, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Depth, texture_aspect_enum_1.TextureAspect.Stencil],
        byteCost: 2
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray],
      type: [texture_sample_type_enum_1.TextureSampleType.Depth, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat, texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: false,
          // Stencil supports image copy but depth does not.
          imageTarget: false // Stencil supports image copy but depth does not.
        },
        storage: false
      }
    });
    this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Depth32float, {
      aspect: {
        types: [texture_aspect_enum_1.TextureAspect.Depth],
        byteCost: 4
      },
      dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray],
      type: [texture_sample_type_enum_1.TextureSampleType.Depth, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat],
      compressionLevel: 0,
      usage: {
        textureBinding: true,
        renderAttachment: {
          resolveTarget: false,
          blendable: false,
          multisample: true
        },
        copy: {
          textureSource: true,
          textureTarget: true,
          imageSource: true,
          imageTarget: false
        },
        storage: false
      }
    });
    // "depth32float-stencil8" feature
    if (pDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.Depth32floatStencil8)) {
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Depth32floatStencil8, {
        aspect: {
          types: [texture_aspect_enum_1.TextureAspect.Depth, texture_aspect_enum_1.TextureAspect.Stencil],
          byteCost: 4
        },
        dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray],
        type: [texture_sample_type_enum_1.TextureSampleType.Depth, texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat, texture_sample_type_enum_1.TextureSampleType.UnsignedInteger],
        compressionLevel: 0,
        usage: {
          textureBinding: true,
          renderAttachment: {
            resolveTarget: false,
            blendable: false,
            multisample: true
          },
          copy: {
            textureSource: true,
            textureTarget: true,
            imageSource: true,
            imageTarget: false
          },
          storage: false
        }
      });
    }
    // BC compressed formats
    if (pDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.TextureCompressionBc)) {
      const lBcTextureFormatCapability = (pAspects, pByteOfAspect) => {
        const lFormat = {
          aspect: {
            types: pAspects,
            byteCost: pByteOfAspect
          },
          dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray],
          type: [texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat, texture_sample_type_enum_1.TextureSampleType.Float],
          compressionLevel: 16,
          usage: {
            textureBinding: true,
            renderAttachment: false,
            copy: {
              textureSource: true,
              textureTarget: true,
              imageSource: true,
              imageTarget: true
            },
            storage: false
          }
        };
        if (pDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.TextureCompressionBcSliced3d)) {
          lFormat.dimensions.push(texture_dimension_enum_1.TextureDimension.ThreeDimension);
        }
        return lFormat;
      };
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc1RgbaUnorm, lBcTextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 2));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc1RgbaUnormSrgb, lBcTextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 2));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc2RgbaUnorm, lBcTextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc2RgbaUnormSrgb, lBcTextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc3RgbaUnorm, lBcTextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc3RgbaUnormSrgb, lBcTextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc4Runorm, lBcTextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red], 8));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc4Rsnorm, lBcTextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red], 8));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc5RgUnorm, lBcTextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green], 8));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc5RgSnorm, lBcTextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green], 8));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc6hRgbUfloat, lBcTextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc6hRgbFloat, lBcTextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc7RgbaUnorm, lBcTextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Bc7RgbaUnormSrgb, lBcTextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
    }
    // ETC2 compressed formats
    if (pDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.TextureCompressionEtc2)) {
      const lEtc2TextureFormatCapability = (pAspects, pByteOfAspect) => {
        const lFormat = {
          aspect: {
            types: pAspects,
            byteCost: pByteOfAspect
          },
          dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray],
          type: [texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat, texture_sample_type_enum_1.TextureSampleType.Float],
          compressionLevel: 16,
          usage: {
            textureBinding: true,
            renderAttachment: false,
            copy: {
              textureSource: true,
              textureTarget: true,
              imageSource: true,
              imageTarget: true
            },
            storage: false
          }
        };
        return lFormat;
      };
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Etc2Rgb8unorm, lEtc2TextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue], 2));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Etc2Rgb8unormSrgb, lEtc2TextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue], 2));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Etc2Rgb8a1unorm, lEtc2TextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 2));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Etc2Rgb8a1unormSrgb, lEtc2TextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 2));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Etc2Rgba8unorm, lEtc2TextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Etc2Rgba8unormSrgb, lEtc2TextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha], 4));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.EacR11unorm, lEtc2TextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red], 8));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.EacR11snorm, lEtc2TextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red], 8));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.EacRg11unorm, lEtc2TextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green], 8));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.EacRg11snorm, lEtc2TextureFormatCapability([texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green], 8));
    }
    // ASTC compressed formats
    if (pDevice.capabilities.hasFeature(gpu_feature_enum_1.GpuFeature.TextureCompressionAstc)) {
      const lAstcTextureFormatCapability = pCompressionLevel => {
        const lFormat = {
          aspect: {
            types: [texture_aspect_enum_1.TextureAspect.Red, texture_aspect_enum_1.TextureAspect.Green, texture_aspect_enum_1.TextureAspect.Blue, texture_aspect_enum_1.TextureAspect.Alpha],
            byteCost: 4
          },
          dimensions: [texture_dimension_enum_1.TextureDimension.OneDimension, texture_dimension_enum_1.TextureDimension.TwoDimension, texture_dimension_enum_1.TextureDimension.TwoDimensionArray, texture_dimension_enum_1.TextureDimension.Cube, texture_dimension_enum_1.TextureDimension.CubeArray],
          type: [texture_sample_type_enum_1.TextureSampleType.UnfilterableFloat, texture_sample_type_enum_1.TextureSampleType.Float],
          compressionLevel: pCompressionLevel,
          usage: {
            textureBinding: true,
            renderAttachment: false,
            copy: {
              textureSource: true,
              textureTarget: true,
              imageSource: true,
              imageTarget: true
            },
            storage: false
          }
        };
        return lFormat;
      };
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc4x4unorm, lAstcTextureFormatCapability(16));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc4x4unormSrgb, lAstcTextureFormatCapability(16));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc5x4unorm, lAstcTextureFormatCapability(20));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc5x4unormSrgb, lAstcTextureFormatCapability(20));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc5x5unorm, lAstcTextureFormatCapability(25));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc5x5unormSrgb, lAstcTextureFormatCapability(25));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc6x5unorm, lAstcTextureFormatCapability(30));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc6x5unormSrgb, lAstcTextureFormatCapability(330));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc6x6unorm, lAstcTextureFormatCapability(36));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc6x6unormSrgb, lAstcTextureFormatCapability(36));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc8x5unorm, lAstcTextureFormatCapability(40));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc8x5unormSrgb, lAstcTextureFormatCapability(40));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc8x6unorm, lAstcTextureFormatCapability(48));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc8x6unormSrgb, lAstcTextureFormatCapability(48));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc8x8unorm, lAstcTextureFormatCapability(64));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc8x8unormSrgb, lAstcTextureFormatCapability(64));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x5unorm, lAstcTextureFormatCapability(50));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x5unormSrgb, lAstcTextureFormatCapability(50));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x6unorm, lAstcTextureFormatCapability(60));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x6unormSrgb, lAstcTextureFormatCapability(60));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x8unorm, lAstcTextureFormatCapability(80));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x8unormSrgb, lAstcTextureFormatCapability(80));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x10unorm, lAstcTextureFormatCapability(100));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc10x10unormSrgb, lAstcTextureFormatCapability(100));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc12x10unorm, lAstcTextureFormatCapability(120));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc12x10unormSrgb, lAstcTextureFormatCapability(120));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc12x12unorm, lAstcTextureFormatCapability(144));
      this.mFormatCapabilitys.set(texture_format_enum_1.TextureFormat.Astc12x12unormSrgb, lAstcTextureFormatCapability(144));
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
    return this.mFormatCapabilitys.get(pFormat);
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

/***/ "./source/base/texture/texture-sampler.ts":
/*!************************************************!*\
  !*** ./source/base/texture/texture-sampler.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.TextureSamplerInvalidationType = exports.TextureSampler = void 0;
const core_1 = __webpack_require__(/*! @kartoffelgames/core */ "../kartoffelgames.core/library/source/index.js");
const filter_mode_enum_1 = __webpack_require__(/*! ../../constant/filter-mode.enum */ "./source/constant/filter-mode.enum.ts");
const sampler_type_enum_1 = __webpack_require__(/*! ../../constant/sampler-type.enum */ "./source/constant/sampler-type.enum.ts");
const wrapping_mode_enum_1 = __webpack_require__(/*! ../../constant/wrapping-mode.enum */ "./source/constant/wrapping-mode.enum.ts");
const gpu_object_1 = __webpack_require__(/*! ../gpu/object/gpu-object */ "./source/base/gpu/object/gpu-object.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const sampler_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/sampler-memory-layout */ "./source/base/memory_layout/texture/sampler-memory-layout.ts");
class TextureSampler extends gpu_object_1.GpuObject {
  /**
   * When provided the sampler will be a comparison sampler with the specified compare function.
   */
  get compare() {
    return this.mCompare;
  }
  set compare(pValue) {
    this.mCompare = pValue;
    // Invalidate native object.
    this.invalidate(TextureSamplerInvalidationType.SamplerConfig);
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
    this.invalidate(TextureSamplerInvalidationType.SamplerConfig);
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
    this.invalidate(TextureSamplerInvalidationType.SamplerConfig);
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
    this.invalidate(TextureSamplerInvalidationType.SamplerConfig);
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
    this.invalidate(TextureSamplerInvalidationType.SamplerConfig);
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
    this.invalidate(TextureSamplerInvalidationType.SamplerConfig);
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
    this.invalidate(TextureSamplerInvalidationType.SamplerConfig);
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
    this.invalidate(TextureSamplerInvalidationType.SamplerConfig);
  }
  /**
   * Constructor.
   * @param pDevice - Device.
   * @param pLayout - Sampler memory layout.
   */
  constructor(pDevice, pLayout) {
    super(pDevice, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
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
    pLayout.addInvalidationListener(() => {
      this.invalidate(TextureSamplerInvalidationType.Layout);
    }, [sampler_memory_layout_1.SamplerMemoryLayoutInvalidationType.SamplerType]);
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
var TextureSamplerInvalidationType;
(function (TextureSamplerInvalidationType) {
  TextureSamplerInvalidationType["Layout"] = "LayoutChange";
  TextureSamplerInvalidationType["SamplerConfig"] = "SamplerConfigChange";
})(TextureSamplerInvalidationType || (exports.TextureSamplerInvalidationType = TextureSamplerInvalidationType = {}));

/***/ }),

/***/ "./source/base/texture/video-texture.ts":
/*!**********************************************!*\
  !*** ./source/base/texture/video-texture.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VideoTextureInvalidationType = exports.VideoTexture = void 0;
const texture_dimension_enum_1 = __webpack_require__(/*! ../../constant/texture-dimension.enum */ "./source/constant/texture-dimension.enum.ts");
const gpu_object_life_time_enum_1 = __webpack_require__(/*! ../gpu/object/gpu-object-life-time.enum */ "./source/base/gpu/object/gpu-object-life-time.enum.ts");
const texture_memory_layout_1 = __webpack_require__(/*! ../memory_layout/texture/texture-memory-layout */ "./source/base/memory_layout/texture/texture-memory-layout.ts");
const base_texture_1 = __webpack_require__(/*! ./base-texture */ "./source/base/texture/base-texture.ts");
class VideoTexture extends base_texture_1.BaseTexture {
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
    super(pDevice, pLayout, gpu_object_life_time_enum_1.GpuObjectLifeTime.Persistent);
    this.mTexture = null;
    // Create video.
    this.mVideo = new HTMLVideoElement();
    this.mVideo.loop = false;
    this.mVideo.muted = true; // Allways muted.
    // Register change listener for layout changes.
    pLayout.addInvalidationListener(() => {
      this.invalidate(VideoTextureInvalidationType.Layout);
    }, [texture_memory_layout_1.TextureMemoryLayoutInvalidationType.Dimension, texture_memory_layout_1.TextureMemoryLayoutInvalidationType.Format]);
    // Update video texture on every frame.
    this.device.addFrameChangeListener(() => {
      if (this.mTexture) {
        // TODO: Load current view image into texture.
      }
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
  /**
   * Destory texture object.
   * @param _pNativeObject - Native canvas texture.
   */
  destroyNative(_pNativeObject) {
    this.mTexture?.destroy();
    this.mTexture = null;
  }
  /**
   * Generate native canvas texture view.
   */
  generateNative() {
    // TODO: Validate format based on layout. Maybe replace used format.
    // Generate gpu dimension from memory layout dimension.
    const lGpuDimension = (() => {
      switch (this.layout.dimension) {
        case texture_dimension_enum_1.TextureDimension.OneDimension:
          {
            return '1d';
          }
        case texture_dimension_enum_1.TextureDimension.TwoDimension:
          {
            return '2d';
          }
        case texture_dimension_enum_1.TextureDimension.TwoDimensionArray:
          {
            return '2d';
          }
        case texture_dimension_enum_1.TextureDimension.Cube:
          {
            return '2d';
          }
        case texture_dimension_enum_1.TextureDimension.CubeArray:
          {
            return '2d';
          }
        case texture_dimension_enum_1.TextureDimension.ThreeDimension:
          {
            return '3d';
          }
      }
    })();
    // Create texture with set size, format and usage. Save it for destorying later.
    this.mTexture = this.device.gpu.createTexture({
      label: 'Frame-Buffer-Texture',
      size: [this.width, this.height, 1],
      format: this.layout.format,
      usage: this.usage,
      dimension: lGpuDimension
    });
    // TODO: View descriptor.
    return this.mTexture.createView({
      format: this.layout.format,
      dimension: this.layout.dimension
    });
  }
  /**
   * On usage extened. Triggers a texture rebuild.
   */
  onUsageExtend() {
    this.invalidate(VideoTextureInvalidationType.Usage);
  }
}
exports.VideoTexture = VideoTexture;
var VideoTextureInvalidationType;
(function (VideoTextureInvalidationType) {
  VideoTextureInvalidationType["Layout"] = "LayoutChange";
  VideoTextureInvalidationType["Usage"] = "UsageChange";
})(VideoTextureInvalidationType || (exports.VideoTextureInvalidationType = VideoTextureInvalidationType = {}));

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
  TextureDimension["TwoDimensionArray"] = "2d-array";
  TextureDimension["Cube"] = "cube";
  TextureDimension["CubeArray"] = "cube-array";
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
  TextureUsage[TextureUsage["Texture"] = GPUTextureUsage.TEXTURE_BINDING] = "Texture";
  TextureUsage[TextureUsage["Storage"] = GPUTextureUsage.STORAGE_BINDING] = "Storage";
  TextureUsage[TextureUsage["RenderAttachment"] = GPUTextureUsage.RENDER_ATTACHMENT] = "RenderAttachment";
})(TextureUsage || (exports.TextureUsage = TextureUsage = {}));

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

/***/ "./page/source/light-box-shader.wgsl":
/*!*******************************************!*\
  !*** ./page/source/light-box-shader.wgsl ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// ------------------------- Object Values ---------------------- //\r\n@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// ------------------------- World Values ---------------------- //\r\n@group(1) @binding(0) var<uniform> viewProjectionMatrix: mat4x4<f32>;\r\n@group(1) @binding(1) var<uniform> timestamp: u32;\r\n\r\nstruct AmbientLight {\r\n    color: vec4<f32>\r\n}\r\n@group(1) @binding(2) var<uniform> ambientLight: AmbientLight;\r\n\r\nstruct PointLight {\r\n    position: vec4<f32>,\r\n    color: vec4<f32>,\r\n    range: f32\r\n}\r\n@group(1) @binding(3) var<storage, read> pointLights: array<PointLight>;\r\n\r\n@group(1) @binding(4) var<storage, read_write> debugValue: f32;\r\n// -------------------------------------------------------------- //\r\n\r\nstruct VertexOut {\r\n    @builtin(position) position: vec4<f32>,\r\n    @location(0) color: vec4<f32>,\r\n}\r\n\r\nstruct VertexIn {\r\n    @builtin(instance_index) instanceId : u32,\r\n    @location(0) position: vec4<f32>,\r\n    @location(1) uv: vec2<f32>,\r\n    @location(2) normal: vec4<f32>\r\n}\r\n\r\n@vertex\r\nfn vertex_main(vertex: VertexIn) -> VertexOut {\r\n    var instanceLight: PointLight = pointLights[vertex.instanceId];\r\n\r\n    var out: VertexOut;\r\n    out.position = viewProjectionMatrix * transformationMatrix * (instanceLight.position + vertex.position);\r\n    out.color = instanceLight.color;\r\n\r\n    return out;\r\n}\r\n\r\nstruct FragmentIn {\r\n    @location(0) color: vec4<f32>,\r\n}\r\n\r\n@fragment\r\nfn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {\r\n    return fragment.color;\r\n}");

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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("// ------------------------- Object Values ---------------------- //\r\n@group(0) @binding(0) var<uniform> transformationMatrix: mat4x4<f32>;\r\n@group(0) @binding(1) var<storage, read> instancePositions: array<vec4<f32>>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// ------------------------- World Values ---------------------- //\r\n@group(1) @binding(0) var<uniform> viewProjectionMatrix: mat4x4<f32>;\r\n@group(1) @binding(1) var<uniform> timestamp: u32;\r\n\r\nstruct AmbientLight {\r\n    color: vec4<f32>\r\n}\r\n@group(1) @binding(2) var<uniform> ambientLight: AmbientLight;\r\n\r\nstruct PointLight {\r\n    position: vec4<f32>,\r\n    color: vec4<f32>,\r\n    range: f32\r\n}\r\n@group(1) @binding(3) var<storage, read> pointLights: array<PointLight>;\r\n\r\n@group(1) @binding(4) var<storage, read_write> debugValue: f32;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// ------------------------- User Inputs ------------------------ //\r\n@group(2) @binding(0) var cubeTextureSampler: sampler;\r\n@group(2) @binding(1) var cubeTexture: texture_2d<f32>;\r\n// -------------------------------------------------------------- //\r\n\r\n\r\n// --------------------- Light calculations --------------------- //\r\n\r\n/**\r\n * Calculate point light output.\r\n */\r\nfn calculatePointLights(fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r\n    // Count of point lights.\r\n    let pointLightCount: u32 = arrayLength(&pointLights);\r\n\r\n    var lightResult: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r\n\r\n    for (var index: u32 = 0; index < pointLightCount; index++) {\r\n        var pointLight: PointLight = pointLights[index];\r\n\r\n        // Calculate light strength based on angle of incidence.\r\n        let lightDirection: vec4<f32> = normalize(pointLight.position - fragmentPosition);\r\n        let diffuse: f32 = max(dot(normal, lightDirection), 0.0);\r\n\r\n        lightResult += pointLight.color * diffuse;\r\n    }\r\n\r\n    return lightResult;\r\n}\r\n\r\n/**\r\n * Apply lights to fragment color.\r\n */\r\nfn applyLight(colorIn: vec4<f32>, fragmentPosition: vec4<f32>, normal: vec4<f32>) -> vec4<f32> {\r\n    var lightColor: vec4<f32> = vec4<f32>(0, 0, 0, 1);\r\n\r\n    lightColor += ambientLight.color;\r\n    lightColor += calculatePointLights(fragmentPosition, normal);\r\n\r\n    return lightColor * colorIn;\r\n}\r\n// -------------------------------------------------------------- //\r\n\r\nfn hash(x: u32) -> u32\r\n{\r\n    var result: u32 = x;\r\n    result ^= result >> 16;\r\n    result *= 0x7feb352du;\r\n    result ^= result >> 15;\r\n    result *= 0x846ca68bu;\r\n    result ^= result >> 16;\r\n    return result;\r\n}\r\n\r\nstruct VertexOut {\r\n    @builtin(position) position: vec4<f32>,\r\n    @location(0) uv: vec2<f32>,\r\n    @location(1) normal: vec4<f32>,\r\n    @location(2) fragmentPosition: vec4<f32>\r\n}\r\n\r\nstruct VertexIn {\r\n    @builtin(instance_index) instanceId : u32,\r\n    @location(0) position: vec4<f32>,\r\n    @location(1) uv: vec2<f32>,\r\n    @location(2) normal: vec4<f32>\r\n}\r\n\r\noverride animationSeconds: f32 = 3; \r\n\r\n@vertex\r\nfn vertex_main(vertex: VertexIn) -> VertexOut {\r\n    var instancePosition: vec4<f32> = instancePositions[vertex.instanceId] + vertex.position;\r\n\r\n    // Generate 4 random numbers.\r\n    var hash1: u32 = hash(vertex.instanceId + 1);\r\n    var hash2: u32 = hash(hash1);\r\n    var hash3: u32 = hash(hash2);\r\n    var hash4: u32 = hash(hash3);\r\n\r\n    // Convert into normals.\r\n    var hashStartDisplacement: f32 = (f32(hash1) - pow(2, 31)) * 2 / pow(2, 32);\r\n    var randomNormalPosition: vec3<f32> = vec3<f32>(\r\n        (f32(hash2) - pow(2, 31)) * 2 / pow(2, 32),\r\n        (f32(hash3) - pow(2, 31)) * 2 / pow(2, 32),\r\n        (f32(hash4) - pow(2, 31)) * 2 / pow(2, 32)\r\n    );\r\n\r\n    // Calculate random position and animate a 100m spread. \r\n    var randPosition: vec4<f32> = instancePosition; // Current start.\r\n    randPosition += vec4<f32>(randomNormalPosition, 1) * 1000; // Randomise start spreading 1000m in all directsions.\r\n    randPosition += vec4<f32>(randomNormalPosition, 1) * sin((f32(timestamp) / (1000 * f32(animationSeconds))) + (hashStartDisplacement * 100)) * 100;\r\n    randPosition[3] = 1; // Reset w coord.\r\n\r\n    var transformedInstancePosition: vec4<f32> = transformationMatrix * randPosition;\r\n\r\n    var out: VertexOut;\r\n    out.position = viewProjectionMatrix * transformedInstancePosition;\r\n    out.uv = vertex.uv;\r\n    out.normal = vertex.normal;\r\n    out.fragmentPosition = transformedInstancePosition;\r\n\r\n    return out;\r\n}\r\n\r\nstruct FragmentIn {\r\n    @location(0) uv: vec2<f32>,\r\n    @location(1) normal: vec4<f32>,\r\n    @location(2) fragmentPosition: vec4<f32>\r\n}\r\n\r\n@fragment\r\nfn fragment_main(fragment: FragmentIn) -> @location(0) vec4<f32> {\r\n    return applyLight(textureSample(cubeTexture, cubeTextureSampler, fragment.uv), fragment.fragmentPosition, fragment.normal);\r\n}");

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
/******/ 		__webpack_require__.h = () => ("ee35dccab9575c5c5d65")
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