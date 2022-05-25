/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./demo/source/index.ts":
/*!******************************!*\
  !*** ./demo/source/index.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

var cms_app_1 = __webpack_require__(/*! ../../source/cms-app */ "./source/cms-app.ts");

var cms_element_1 = __webpack_require__(/*! ../../source/cms-element/cms-element */ "./source/cms-element/cms-element.ts");

var pwb_cms_element_decorator_1 = __webpack_require__(/*! ../../source/cms-element/pwb-cms-element.decorator */ "./source/cms-element/pwb-cms-element.decorator.ts");

var MyHeadingElement = class MyHeadingElement extends cms_element_1.CmsElement {
  constructor() {
    super();
    this.data.headingType = 'h1';
    this.data.text = 'My Cool Heading';
  }

};
MyHeadingElement = __decorate([(0, pwb_cms_element_decorator_1.PwbCmsElement)({
  selector: 'my-heading-element',
  componentTemplate: "\n    <h1 *pwbIf=\"this.data.headingType === 'h1'\" >{{this.data.text}}</h1>\n    <h2 *pwbIf=\"this.data.headingType === 'h2'\" >{{this.data.text}}</h2>\n    <h3 *pwbIf=\"this.data.headingType === 'h3'\" >{{this.data.text}}</h3>\n    ",
  formularTemplate: "\n    <select [(value)]=\"this.data.headingType\">\n        <option value=\"h1\">Heading 1</option>\n        <option value=\"h2\">Heading 2</option>\n        <option value=\"h3\">Heading 3</option>\n    </select>\n    <input [(value)]=\"this.data.text\" />\n    "
}), __metadata("design:paramtypes", [])], MyHeadingElement);
document.addEventListener('DOMContentLoaded', () => {
  var lApp = new cms_app_1.CmsApp('CMS-App');
  lApp.addMenuItem('Main', 'Heading H1', MyHeadingElement, {
    headingType: 'h1',
    text: 'This is a H1'
  });
  lApp.addMenuItem('Main', 'Heading H2', MyHeadingElement, {
    headingType: 'h2',
    text: 'This is a H2'
  });
  lApp.appendTo(document.body);
});

/***/ }),

/***/ "./source/cms-app.ts":
/*!***************************!*\
  !*** ./source/cms-app.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CmsApp = void 0;

var web_potato_web_builder_1 = __webpack_require__(/*! @kartoffelgames/web.potato-web-builder */ "../kartoffelgames.web.potato_web_builder/library/source/index.js");

var cms_elements_1 = __webpack_require__(/*! ./cms-element/cms-elements */ "./source/cms-element/cms-elements.ts");

var cms_editor_component_1 = __webpack_require__(/*! ./component/cms-editor/cms-editor-component */ "./source/component/cms-editor/cms-editor-component.ts");

class CmsApp extends web_potato_web_builder_1.PwbApp {
  /**
   * Constructor.
   * @param pAppName -  Cms app name.
   */
  constructor(pAppName) {
    super(pAppName);
    this.addContent(cms_editor_component_1.CmsEditorComponent);
  }
  /**
   * Add element to element selector.
   * @param pMenuGroup - Menu group name.
   * @param pText - Element text description.
   * @param pElement - CMS-Element
   * @param pPreset - Element preset data.
   */


  addMenuItem(pMenuGroup, pText, pElement, pPreset) {
    cms_elements_1.CmsElements.addMenuItem(pMenuGroup, pText, pElement, pPreset);
  }

}

exports.CmsApp = CmsApp; // TODO: Specify column count.
// TODO: Handle data load.

/***/ }),

/***/ "./source/cms-element/cms-element.ts":
/*!*******************************************!*\
  !*** ./source/cms-element/cms-element.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CmsElement = void 0;

var web_potato_web_builder_1 = __webpack_require__(/*! @kartoffelgames/web.potato-web-builder */ "../kartoffelgames.web.potato_web_builder/library/source/index.js");

class CmsElement {
  /**
   * Constructor.
   */
  constructor() {
    this.mData = {};
    this.mStyle = {};
  }
  /**
   * Get element data.
   */


  get data() {
    return this.mData;
  }
  /**
   * Set element data.
   */


  set data(pData) {
    this.mData = pData;
  }
  /**
   * Get element style.
   */


  get style() {
    return this.mStyle;
  }
  /**
   * Set element style.
   */


  set style(pStyle) {
    this.mStyle = pStyle;
  }

}

__decorate([web_potato_web_builder_1.PwbExport, __metadata("design:type", Object), __metadata("design:paramtypes", [Object])], CmsElement.prototype, "data", null);

__decorate([web_potato_web_builder_1.PwbExport, __metadata("design:type", Object), __metadata("design:paramtypes", [Object])], CmsElement.prototype, "style", null);

exports.CmsElement = CmsElement;

/***/ }),

/***/ "./source/cms-element/cms-elements.ts":
/*!********************************************!*\
  !*** ./source/cms-element/cms-elements.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CmsElements = void 0;

var core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");

var core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");

var component_manager_1 = __webpack_require__(/*! @kartoffelgames/web.potato-web-builder/library/source/component/component-manager */ "../kartoffelgames.web.potato_web_builder/library/source/component/component-manager.js");

class CmsElements {
  /**
   * Add element as cms element.
   * @param pElementClass - element constructor.
   */
  static addElement(pElementClass) {
    // TODO: Validate pElementClass as CMS-Element
    var lElementSelector = core_dependency_injection_1.Metadata.get(pElementClass).getMetadata(component_manager_1.ComponentManager.METADATA_SELECTOR);
    CmsElements.mElements.add(pElementClass, lElementSelector);
  }
  /**
   * Add element to menu.
   * @param pMenuGroup - Menu group name.
   * @param pText - Element text description.
   * @param pElement - CMS-Element
   * @param pPreset - Element preset data.
   */


  static addMenuItem(pMenuGroup, pText, pElement, pPreset) {
    var lMenuItemList = CmsElements.mMenuElements.get(pMenuGroup);

    if (!lMenuItemList) {
      lMenuItemList = new Array();
      CmsElements.mMenuElements.set(pMenuGroup, lMenuItemList);
    } // Find element selector.


    var lElementSelector = CmsElements.mElements.get(pElement);

    if (!lElementSelector) {
      throw new core_data_1.Exception('Element is not a cmd element.', CmsElements);
    } // Add menu item description.


    lMenuItemList.push({
      description: {
        text: pText
      },
      element: lElementSelector,
      presetData: pPreset
    });
  }
  /**
   * Get menu items of group.
   * @param pMenuGroup - Menu group.
   */


  static getMenuItems(pMenuGroup) {
    var _CmsElements$mMenuEle;

    return (_CmsElements$mMenuEle = CmsElements.mMenuElements.get(pMenuGroup)) !== null && _CmsElements$mMenuEle !== void 0 ? _CmsElements$mMenuEle : new Array();
  }

}

exports.CmsElements = CmsElements;
CmsElements.mElements = new core_data_1.Dictionary();
CmsElements.mMenuElements = new core_data_1.Dictionary();

/***/ }),

/***/ "./source/cms-element/pwb-cms-element.decorator.ts":
/*!*********************************************************!*\
  !*** ./source/cms-element/pwb-cms-element.decorator.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {



Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.PwbCmsElement = void 0;

var web_potato_web_builder_1 = __webpack_require__(/*! @kartoffelgames/web.potato-web-builder */ "../kartoffelgames.web.potato_web_builder/library/source/index.js");

var cms_edit_tools_component_1 = __webpack_require__(/*! ../component/cms-edit-tools/cms-edit-tools-component */ "./source/component/cms-edit-tools/cms-edit-tools-component.ts");

var cms_elements_1 = __webpack_require__(/*! ./cms-elements */ "./source/cms-element/cms-elements.ts");
/**
 * AtScript. CMS element.
 * @param pParameter - Parameter defaults on creation.
 */


function PwbCmsElement(pParameter) {
  // Needs constructor without argument.
  return pUserClassConstructor => {
    var _pParameter$component, _pParameter$style;

    // Validate correct cconstructor inheritance. TODO: validate with metdata.
    // if(pUserClassConstructor.prototype instanceof CmsElement){
    //     throw new Exception('Cms element must inherit CmsElement', PwbCmsElement);
    // }
    // Infuse setting formular template.
    var lTemplate = "<cms-edit-tools>".concat(pParameter.formularTemplate, "</cms-edit-tools>").concat((_pParameter$component = pParameter.componentTemplate) !== null && _pParameter$component !== void 0 ? _pParameter$component : '');
    (0, web_potato_web_builder_1.PwbComponent)({
      selector: pParameter.selector,
      template: lTemplate,
      style: (_pParameter$style = pParameter.style) !== null && _pParameter$style !== void 0 ? _pParameter$style : '',
      components: [cms_edit_tools_component_1.CmsEditToolsComponent]
    })(pUserClassConstructor);
    cms_elements_1.CmsElements.addElement(pUserClassConstructor);
  };
}

exports.PwbCmsElement = PwbCmsElement;

/***/ }),

/***/ "./source/component/cms-edit-form/cms-edit-form-component.ts":
/*!*******************************************************************!*\
  !*** ./source/component/cms-edit-form/cms-edit-form-component.ts ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CmsEditFormComponent = void 0;

var web_potato_web_builder_1 = __webpack_require__(/*! @kartoffelgames/web.potato-web-builder */ "../kartoffelgames.web.potato_web_builder/library/source/index.js");

var cms_edit_form_component_css_1 = __webpack_require__(/*! ./cms-edit-form-component.css */ "./source/component/cms-edit-form/cms-edit-form-component.css");

var cms_edit_form_component_html_1 = __webpack_require__(/*! ./cms-edit-form-component.html */ "./source/component/cms-edit-form/cms-edit-form-component.html");

var CmsEditFormComponent = class CmsEditFormComponent {
  /**
   * Constructor.
   */
  constructor() {
    this.hidden = true;
  }
  /**
   * Hide dialog.
   */


  close() {
    this.hidden = true;
  }
  /**
  * Show dialog.
  */


  show() {
    this.hidden = false;
  }

};

__decorate([web_potato_web_builder_1.PwbExport, __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], CmsEditFormComponent.prototype, "close", null);

__decorate([web_potato_web_builder_1.PwbExport, __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", void 0)], CmsEditFormComponent.prototype, "show", null);

CmsEditFormComponent = __decorate([(0, web_potato_web_builder_1.PwbComponent)({
  selector: 'cms-edit-form',
  template: cms_edit_form_component_html_1.default,
  style: cms_edit_form_component_css_1.default
}), __metadata("design:paramtypes", [])], CmsEditFormComponent);
exports.CmsEditFormComponent = CmsEditFormComponent;

/***/ }),

/***/ "./source/component/cms-edit-tools/cms-edit-tools-component.ts":
/*!*********************************************************************!*\
  !*** ./source/component/cms-edit-tools/cms-edit-tools-component.ts ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CmsEditToolsComponent = void 0;

var web_potato_web_builder_1 = __webpack_require__(/*! @kartoffelgames/web.potato-web-builder */ "../kartoffelgames.web.potato_web_builder/library/source/index.js");

var cms_edit_form_component_1 = __webpack_require__(/*! ../cms-edit-form/cms-edit-form-component */ "./source/component/cms-edit-form/cms-edit-form-component.ts");

var cms_edit_tools_component_css_1 = __webpack_require__(/*! ./cms-edit-tools-component.css */ "./source/component/cms-edit-tools/cms-edit-tools-component.css");

var cms_edit_tools_component_html_1 = __webpack_require__(/*! ./cms-edit-tools-component.html */ "./source/component/cms-edit-tools/cms-edit-tools-component.html");

var CmsEditToolsComponent = class CmsEditToolsComponent {
  /**
   * Open edit form.
   */
  openForm() {
    this.mFormElement.show();
  }

};

__decorate([(0, web_potato_web_builder_1.PwbChild)('editForm'), __metadata("design:type", cms_edit_form_component_1.CmsEditFormComponent)], CmsEditToolsComponent.prototype, "mFormElement", void 0);

CmsEditToolsComponent = __decorate([(0, web_potato_web_builder_1.PwbComponent)({
  selector: 'cms-edit-tools',
  template: cms_edit_tools_component_html_1.default,
  style: cms_edit_tools_component_css_1.default,
  components: [cms_edit_form_component_1.CmsEditFormComponent]
})], CmsEditToolsComponent);
exports.CmsEditToolsComponent = CmsEditToolsComponent;

/***/ }),

/***/ "./source/component/cms-editor/cms-editor-component.ts":
/*!*************************************************************!*\
  !*** ./source/component/cms-editor/cms-editor-component.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CmsEditorComponent = void 0;

var web_potato_web_builder_1 = __webpack_require__(/*! @kartoffelgames/web.potato-web-builder */ "../kartoffelgames.web.potato_web_builder/library/source/index.js");

var cms_elements_1 = __webpack_require__(/*! ../../cms-element/cms-elements */ "./source/cms-element/cms-elements.ts");

var cms_template_content_module_1 = __webpack_require__(/*! ../../module/cms-template-content-module */ "./source/module/cms-template-content-module.ts");

var cms_editor_component_css_1 = __webpack_require__(/*! ./cms-editor-component.css */ "./source/component/cms-editor/cms-editor-component.css");

var cms_editor_component_html_1 = __webpack_require__(/*! ./cms-editor-component.html */ "./source/component/cms-editor/cms-editor-component.html");

var CmsEditorComponent = class CmsEditorComponent {
  /**
   * Constructor.
   */
  constructor() {
    this.contentData = new Array();
    this.menuGroup = 'Main'; // TODO: TO empty string. Only for debug.
  }
  /**
   * Get menu items of selected group.
   */


  get menuItems() {
    return cms_elements_1.CmsElements.getMenuItems(this.menuGroup);
  }
  /**
   * On content drop. Can be element or preset data.
   * @param pEvent - Drag event
   */


  onContentDrop(pEvent) {
    var _pEvent$dataTransfer;

    var lElementDataJson = (_pEvent$dataTransfer = pEvent.dataTransfer) === null || _pEvent$dataTransfer === void 0 ? void 0 : _pEvent$dataTransfer.getData('elementData'); // Check for existing data.

    if (typeof lElementDataJson !== 'undefined' && lElementDataJson !== '') {
      var lElementData = JSON.parse(lElementDataJson); // TODO: Remove element if it was only moved and not created.

      this.contentData.push(lElementData);
    }

    console.log(this.contentData);
  }
  /**
   * On element preset drag.
   * @param pEvent - Drag event.
   */


  onElementPresetDrag(pEvent) {
    var _lElementPreset$prese, _pEvent$dataTransfer2;

    var lTarget = pEvent.target;
    var lElementPreset = JSON.parse(lTarget.dataset['preset']); // Create CmsElementData from target.

    var lElementData = {
      element: lElementPreset.element,
      data: (_lElementPreset$prese = lElementPreset.presetData) !== null && _lElementPreset$prese !== void 0 ? _lElementPreset$prese : {},
      style: {}
    }; // Set element data as json string into drag event.

    (_pEvent$dataTransfer2 = pEvent.dataTransfer) === null || _pEvent$dataTransfer2 === void 0 ? void 0 : _pEvent$dataTransfer2.setData('elementData', JSON.stringify(lElementData));
  }

};

__decorate([web_potato_web_builder_1.PwbExport, __metadata("design:type", Array)], CmsEditorComponent.prototype, "contentData", void 0);

__decorate([web_potato_web_builder_1.PwbExport, __metadata("design:type", String)], CmsEditorComponent.prototype, "menuGroup", void 0);

CmsEditorComponent = __decorate([(0, web_potato_web_builder_1.PwbComponent)({
  selector: 'cms-editor',
  template: cms_editor_component_html_1.default,
  style: cms_editor_component_css_1.default,
  modules: [cms_template_content_module_1.CmsTemplateContenModule]
}), __metadata("design:paramtypes", [])], CmsEditorComponent);
exports.CmsEditorComponent = CmsEditorComponent;

/***/ }),

/***/ "./source/module/cms-template-content-module.ts":
/*!******************************************************!*\
  !*** ./source/module/cms-template-content-module.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {



var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CmsTemplateContenModule = void 0;

var core_xml_1 = __webpack_require__(/*! @kartoffelgames/core.xml */ "../kartoffelgames.core.xml/library/source/index.js");

var web_change_detection_1 = __webpack_require__(/*! @kartoffelgames/web.change-detection */ "../kartoffelgames.web.change_detection/library/source/index.js");

var web_potato_web_builder_1 = __webpack_require__(/*! @kartoffelgames/web.potato-web-builder */ "../kartoffelgames.web.potato_web_builder/library/source/index.js");

var CmsTemplateContenModule = class CmsTemplateContenModule {
  /**
   * Constructor
   * @param pAttributeReference - Attribute reference.
   * @param pTemplateReference - Template reference.
   */
  constructor(pAttributeReference, pValueReference) {
    this.mDataExpression = pAttributeReference.value.value;
    this.mLayerValues = pValueReference.value;
    this.mCompareHandler = new web_change_detection_1.CompareHandler(Symbol('Uncompareable'), 4);
  }
  /**
   * On update. Replace current template with list of elements.
   */


  onUpdate() {
    // Read element data from data expression.
    var lElementData = web_potato_web_builder_1.ComponentScopeExecutor.executeSilent(this.mDataExpression, this.mLayerValues); // Optimize by checking data with CompareHandler.
    // Skip when values are the same.

    if (this.mCompareHandler.compareAndUpdate(lElementData)) {
      return null;
    } // Create all elements from element data and add those to current template childs.


    var lResult = new web_potato_web_builder_1.MultiplicatorResult();

    for (var lContentData of lElementData) {
      // Create new value layer.
      var lData = new web_potato_web_builder_1.LayerValues(this.mLayerValues); // Create element with element selector as tagname.

      var lElement = new core_xml_1.XmlElement();
      lElement.tagName = lContentData.element; // Add data as layer value and bind to element.

      lData.setLayerValue('data', lContentData.data);
      lElement.setAttribute('[data]', 'data'); // Add style as layer value and bind to element.

      lData.setLayerValue('style', lContentData.data);
      lElement.setAttribute('[style]', 'style');
      console.log(lContentData); // Add element and layer values to results.

      lResult.addElement(lElement, lData);
    }

    return lResult;
  }

};
CmsTemplateContenModule = __decorate([(0, web_potato_web_builder_1.PwbMultiplicatorAttributeModule)({
  selector: /^\*cmsTemplateContent$/
}), __metadata("design:paramtypes", [web_potato_web_builder_1.ModuleAttributeReference, web_potato_web_builder_1.ModuleLayerValuesReference])], CmsTemplateContenModule);
exports.CmsTemplateContenModule = CmsTemplateContenModule;

/***/ }),

/***/ "./source/component/cms-edit-form/cms-edit-form-component.css":
/*!********************************************************************!*\
  !*** ./source/component/cms-edit-form/cms-edit-form-component.css ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (".overlay {\r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100vw;\r\n    height: 100vh;\r\n    background-color: rgba(90, 90, 90, 0.40);\r\n}\r\n\r\n.dialog {\r\n    position: fixed;\r\n    background-color: red;\r\n    left: 50%;\r\n    top: 50%;\r\n    transform: translate(-50%, -50%);\r\n}");

/***/ }),

/***/ "./source/component/cms-edit-form/cms-edit-form-component.html":
/*!*********************************************************************!*\
  !*** ./source/component/cms-edit-form/cms-edit-form-component.html ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<!-- Blocking overlay -->\r\n<div *pwbIf=\"!this.hidden\" class=\"overlay\">\r\n\r\n    <!-- Dialog -->\r\n    <div class=\"dialog\">\r\n\r\n        <div $DEFAULT />\r\n\r\n        <!-- Actions -->\r\n        <div>\r\n            <button (click)=\"this.close()\">Ok</button>\r\n            <button>Cancel</button>\r\n        </div>\r\n\r\n    </div>\r\n\r\n\r\n\r\n</div>");

/***/ }),

/***/ "./source/component/cms-edit-tools/cms-edit-tools-component.css":
/*!**********************************************************************!*\
  !*** ./source/component/cms-edit-tools/cms-edit-tools-component.css ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("");

/***/ }),

/***/ "./source/component/cms-edit-tools/cms-edit-tools-component.html":
/*!***********************************************************************!*\
  !*** ./source/component/cms-edit-tools/cms-edit-tools-component.html ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<button (click)=\"this.openForm()\">EDIT</button>\r\n\r\n<cms-edit-form #editForm $DEFAULT/>");

/***/ }),

/***/ "./source/component/cms-editor/cms-editor-component.css":
/*!**************************************************************!*\
  !*** ./source/component/cms-editor/cms-editor-component.css ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (":host {\r\n    display: flex;\r\n    width: 100%;\r\n    height: 100%;\r\n    border: 1px solid #000;\r\n}\r\n\r\n.element-picker {\r\n    width: 50px;\r\n    height: 100%;\r\n    box-shadow: 9px 0px 10px -5px #606060;\r\n}\r\n\r\n.element {\r\n    background-color: red;\r\n}\r\n\r\n.content {\r\n    width: 100%;\r\n    height: 100%;\r\n}");

/***/ }),

/***/ "./source/component/cms-editor/cms-editor-component.html":
/*!***************************************************************!*\
  !*** ./source/component/cms-editor/cms-editor-component.html ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("<!-- Element picker wrapper -->\r\n<div class=\"element-picker\">\r\n\r\n    <!-- Element display -->\r\n    <div class=\"element\" draggable=\"true\" *pwbFor=\"menuItem of this.menuItems\" data-preset=\"{{ window.JSON.stringify(menuItem) }}\" (dragstart)=\"this.onElementPresetDrag($event)\">\r\n        <span>{{menuItem.description.text}}</span>\r\n    </div>\r\n\r\n</div>\r\n\r\n<!-- Content -->\r\n<div class=\"content\" (dragover)=\"$event.preventDefault()\" (drop)=\"this.onContentDrop($event)\">\r\n    <content-placeholder *cmsTemplateContent=\"this.contentData\" />\r\n</div>");

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
     * Return all values of an enum as array.
     * @param pEnum - typeof Enum object.
     */
    static enumNamesToArray(pEnum) {
        // Convert enum to array.
        const lResultArray = Object.values(pEnum);
        return lResultArray.slice(0, lResultArray.length / 2);
    }
    /**
     * Return all values of an enum as array.
     * @param pEnum - typeof Enum object.
     */
    static enumValuesToArray(pEnum) {
        // Convert enum to array.
        const lResultArray = Object.values(pEnum);
        return lResultArray.slice(lResultArray.length / 2);
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

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/decoration-history/decoration-history.js":
/*!***********************************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/decoration-history/decoration-history.js ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DecorationHistory = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
class DecorationHistory {
    /**
     * Add an decoration history.
     * @param pFromConstructor - Previous constructor.
     * @param pToConstructor - Changed / next construtor.
     */
    static addHistory(pFromConstructor, pToConstructor) {
        DecorationHistory.mBackwardHistory.add(pToConstructor, pFromConstructor);
    }
    /**
     * Get the root constructor of decoration history.
     * @param pConstructor - Constructor with decorations.
     */
    static getRootOf(pConstructor) {
        // Iterate over history as long as history can't go back.
        let lNextEntry = pConstructor;
        while (DecorationHistory.mBackwardHistory.has(lNextEntry)) {
            lNextEntry = DecorationHistory.mBackwardHistory.get(lNextEntry);
        }
        return lNextEntry;
    }
}
exports.DecorationHistory = DecorationHistory;
DecorationHistory.mBackwardHistory = new core_data_1.Dictionary();
//# sourceMappingURL=decoration-history.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/decorator/extended-metadata.decorator.js":
/*!***********************************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/decorator/extended-metadata.decorator.js ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExtendedMetadata = void 0;
const metadata_1 = __webpack_require__(/*! ../metadata/metadata */ "../kartoffelgames.core.dependency_injection/library/source/metadata/metadata.js");
const reflect_initializer_1 = __webpack_require__(/*! ../reflect/reflect-initializer */ "../kartoffelgames.core.dependency_injection/library/source/reflect/reflect-initializer.js");
reflect_initializer_1.ReflectInitializer.initialize();
/**
 * AtScript.
 * Add metadata to class, method, accessor or property
 * @param pMetadataKey - Key of metadata.
 * @param pMetadataValue - Value of metadata.
 */
function ExtendedMetadata(pMetadataKey, pMetadataValue) {
    return (pTarget, pProperty) => {
        // Get constructor from prototype if is an instanced member.
        let lConstructor;
        if (typeof pTarget !== 'function') {
            lConstructor = pTarget.constructor;
        }
        else {
            lConstructor = pTarget;
        }
        // Set metadata for property or class.
        if (pProperty) {
            metadata_1.Metadata.get(lConstructor).getProperty(pProperty).setMetadata(pMetadataKey, pMetadataValue);
        }
        else {
            metadata_1.Metadata.get(lConstructor).setMetadata(pMetadataKey, pMetadataValue);
        }
    };
}
exports.ExtendedMetadata = ExtendedMetadata;
//# sourceMappingURL=extended-metadata.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/decorator/injectable-singleton.decorator.js":
/*!**************************************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/decorator/injectable-singleton.decorator.js ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InjectableSingleton = void 0;
const inject_mode_1 = __webpack_require__(/*! ../enum/inject-mode */ "../kartoffelgames.core.dependency_injection/library/source/enum/inject-mode.js");
const injection_1 = __webpack_require__(/*! ../injection/injection */ "../kartoffelgames.core.dependency_injection/library/source/injection/injection.js");
const reflect_initializer_1 = __webpack_require__(/*! ../reflect/reflect-initializer */ "../kartoffelgames.core.dependency_injection/library/source/reflect/reflect-initializer.js");
reflect_initializer_1.ReflectInitializer.initialize();
/**
 * AtScript.
 * Mark class to be injectable as an singleton object.
 * @param pConstructor - Constructor.
 */
function InjectableSingleton(pConstructor) {
    injection_1.Injection.registerInjectable(pConstructor, inject_mode_1.InjectMode.Singleton);
}
exports.InjectableSingleton = InjectableSingleton;
//# sourceMappingURL=injectable-singleton.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/decorator/injectable.decorator.js":
/*!****************************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/decorator/injectable.decorator.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Injectable = void 0;
const inject_mode_1 = __webpack_require__(/*! ../enum/inject-mode */ "../kartoffelgames.core.dependency_injection/library/source/enum/inject-mode.js");
const reflect_initializer_1 = __webpack_require__(/*! ../reflect/reflect-initializer */ "../kartoffelgames.core.dependency_injection/library/source/reflect/reflect-initializer.js");
const injection_1 = __webpack_require__(/*! ../injection/injection */ "../kartoffelgames.core.dependency_injection/library/source/injection/injection.js");
reflect_initializer_1.ReflectInitializer.initialize();
/**
 * AtScript.
 * Mark class to be injectable as an instanced object.
 * @param pConstructor - Constructor.
 */
function Injectable(pConstructor) {
    injection_1.Injection.registerInjectable(pConstructor, inject_mode_1.InjectMode.Instanced);
}
exports.Injectable = Injectable;
//# sourceMappingURL=injectable.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/enum/inject-mode.js":
/*!**************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/enum/inject-mode.js ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InjectMode = void 0;
var InjectMode;
(function (InjectMode) {
    InjectMode[InjectMode["Singleton"] = 1] = "Singleton";
    InjectMode[InjectMode["Instanced"] = 2] = "Instanced";
})(InjectMode = exports.InjectMode || (exports.InjectMode = {}));
//# sourceMappingURL=inject-mode.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/index.js":
/*!***************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DecorationHistory = exports.Metadata = exports.Injection = exports.Injector = void 0;
// Injection
var injector_1 = __webpack_require__(/*! ./injector */ "../kartoffelgames.core.dependency_injection/library/source/injector.js");
Object.defineProperty(exports, "Injector", ({ enumerable: true, get: function () { return injector_1.Injector; } }));
var injection_1 = __webpack_require__(/*! ./injection/injection */ "../kartoffelgames.core.dependency_injection/library/source/injection/injection.js");
Object.defineProperty(exports, "Injection", ({ enumerable: true, get: function () { return injection_1.Injection; } }));
// Metadata
var metadata_1 = __webpack_require__(/*! ./metadata/metadata */ "../kartoffelgames.core.dependency_injection/library/source/metadata/metadata.js");
Object.defineProperty(exports, "Metadata", ({ enumerable: true, get: function () { return metadata_1.Metadata; } }));
// Decoration
var decoration_history_1 = __webpack_require__(/*! ./decoration-history/decoration-history */ "../kartoffelgames.core.dependency_injection/library/source/decoration-history/decoration-history.js");
Object.defineProperty(exports, "DecorationHistory", ({ enumerable: true, get: function () { return decoration_history_1.DecorationHistory; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/injection/injection.js":
/*!*****************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/injection/injection.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Injection = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const inject_mode_1 = __webpack_require__(/*! ../enum/inject-mode */ "../kartoffelgames.core.dependency_injection/library/source/enum/inject-mode.js");
const decoration_history_1 = __webpack_require__(/*! ../decoration-history/decoration-history */ "../kartoffelgames.core.dependency_injection/library/source/decoration-history/decoration-history.js");
const metadata_1 = __webpack_require__(/*! ../metadata/metadata */ "../kartoffelgames.core.dependency_injection/library/source/metadata/metadata.js");
class Injection {
    static createObject(pConstructor, pForceCreateOrLocalInjections, pLocalInjections) {
        // Decide between local injection or force creation parameter.
        let lLocalInjections;
        let lForceCreate;
        if (typeof pForceCreateOrLocalInjections === 'object' && pForceCreateOrLocalInjections !== null) {
            lForceCreate = false;
            lLocalInjections = pForceCreateOrLocalInjections;
        }
        else {
            lForceCreate = !!pForceCreateOrLocalInjections;
            lLocalInjections = pLocalInjections ?? new core_data_1.Dictionary();
        }
        // Find constructor in decoration history that was used for registering. Only root can be registered.
        let lRegisteredConstructor = decoration_history_1.DecorationHistory.getRootOf(pConstructor);
        if (!Injection.mInjectableConstructor.has(lRegisteredConstructor)) {
            throw new core_data_1.Exception(`Constructor "${pConstructor.name}" is not registered for injection and can not be build`, Injection);
        }
        // Replace current constructor with global replacement.
        let lConstructor;
        if (Injection.mInjectableReplacement.has(lRegisteredConstructor)) {
            const lReplacementConstructor = Injection.mInjectableReplacement.get(lRegisteredConstructor);
            lConstructor = lReplacementConstructor;
            // Set replacement constructor that was used for registering. Is allways registered.
            lRegisteredConstructor = decoration_history_1.DecorationHistory.getRootOf(lReplacementConstructor);
        }
        else {
            lConstructor = pConstructor;
        }
        // Get constructor parameter type information and default to empty parameter list.
        let lParameterTypeList = metadata_1.Metadata.get(lRegisteredConstructor).parameterTypeList;
        if (lParameterTypeList === null) {
            lParameterTypeList = new Array();
        }
        // Get injection mode.
        const lInjecttionMode = Injection.mInjectMode.get(lRegisteredConstructor);
        // Return cached sinleton object if not forced to create a new one.
        if (!lForceCreate && lInjecttionMode === inject_mode_1.InjectMode.Singleton && Injection.mSingletonMapping.has(lRegisteredConstructor)) {
            return Injection.mSingletonMapping.get(lRegisteredConstructor);
        }
        // Create parameter.
        const lConstructorParameter = new Array();
        for (const lParameterType of lParameterTypeList) {
            let lCreatedParameter;
            // Check if parameter can be replaced with an local injection
            if ((lInjecttionMode !== inject_mode_1.InjectMode.Singleton || lForceCreate) && lLocalInjections.has(lParameterType)) {
                lCreatedParameter = lLocalInjections.get(lParameterType);
            }
            else {
                // Proxy exception.
                try {
                    // Get injectable parameter.
                    lCreatedParameter = Injection.createObject(lParameterType, lLocalInjections);
                }
                catch (pException) {
                    // Error is always an Exception.
                    const lException = pException;
                    throw new core_data_1.Exception(`Parameter "${lParameterType.name}" of ${lConstructor.name} is not injectable.\n` + lException.message, Injection);
                }
            }
            // Add parameter to construction parameter list.
            lConstructorParameter.push(lCreatedParameter);
        }
        // Create object.
        const lCreatedObject = new lConstructor(...lConstructorParameter);
        // Cache singleton objects but only if not forced to create.
        if (!lForceCreate && lInjecttionMode === inject_mode_1.InjectMode.Singleton) {
            Injection.mSingletonMapping.add(lRegisteredConstructor, lCreatedObject);
        }
        return lCreatedObject;
    }
    /**
     * Register an constructor for injection.
     * @param pConstructor - Constructor that can be injected.
     * @param pMode - Mode of injection.
     */
    static registerInjectable(pConstructor, pMode) {
        // Find root constructor of decorated constructor to habe registered constructor allways available top down.
        const lBaseConstructor = decoration_history_1.DecorationHistory.getRootOf(pConstructor);
        // Map constructor.
        Injection.mInjectableConstructor.add(lBaseConstructor, pConstructor);
        Injection.mInjectMode.add(lBaseConstructor, pMode);
    }
    /**
     * Replaces an constructor so instead of the original, the replacement gets injected.
     * Both consructors must be registered.
     * @param pOriginalConstructor - Original constructor that should be replaced.
     * @param pReplacementConstructor - Replacement constructor that gets injected instead of original constructor.
     */
    static replaceInjectable(pOriginalConstructor, pReplacementConstructor) {
        // Find original registered original. Only root can be registerd.
        const lRegisteredOriginal = decoration_history_1.DecorationHistory.getRootOf(pOriginalConstructor);
        if (!Injection.mInjectableConstructor.has(lRegisteredOriginal)) {
            throw new core_data_1.Exception('Original constructor is not registered.', Injection);
        }
        // Find replacement registered original. Only root can be registered.
        const lRegisteredReplacement = decoration_history_1.DecorationHistory.getRootOf(pReplacementConstructor);
        if (!Injection.mInjectableConstructor.has(lRegisteredReplacement)) {
            throw new core_data_1.Exception('Replacement constructor is not registered.', Injection);
        }
        // Register replacement.
        Injection.mInjectableReplacement.set(lRegisteredOriginal, pReplacementConstructor);
    }
}
exports.Injection = Injection;
Injection.mInjectMode = new core_data_1.Dictionary();
Injection.mInjectableConstructor = new core_data_1.Dictionary();
Injection.mInjectableReplacement = new core_data_1.Dictionary();
Injection.mSingletonMapping = new core_data_1.Dictionary();
//# sourceMappingURL=injection.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/injector.js":
/*!******************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/injector.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Injector = void 0;
const injectable_decorator_1 = __webpack_require__(/*! ./decorator/injectable.decorator */ "../kartoffelgames.core.dependency_injection/library/source/decorator/injectable.decorator.js");
const injectable_singleton_decorator_1 = __webpack_require__(/*! ./decorator/injectable-singleton.decorator */ "../kartoffelgames.core.dependency_injection/library/source/decorator/injectable-singleton.decorator.js");
const extended_metadata_decorator_1 = __webpack_require__(/*! ./decorator/extended-metadata.decorator */ "../kartoffelgames.core.dependency_injection/library/source/decorator/extended-metadata.decorator.js");
class Injector {
}
exports.Injector = Injector;
/**
 * AtScript.
 * Add metadata to class, method, accessor or property
 * @param pMetadataKey - Key of metadata.
 * @param pMetadataValue - Value of metadata.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
Injector.ExtendedMetadata = extended_metadata_decorator_1.ExtendedMetadata;
/**
 * AtScript.
 * Mark class to be injectable as an instanced object.
 * @param pConstructor - Constructor.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
Injector.Injectable = injectable_decorator_1.Injectable;
/**
 * AtScript.
 * Mark class to be injectable as an singleton object.
 * @param pConstructor - Constructor.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
Injector.InjectableSingleton = injectable_singleton_decorator_1.InjectableSingleton;
//# sourceMappingURL=injector.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/metadata/constructor-metadata.js":
/*!***************************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/metadata/constructor-metadata.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConstructorMetadata = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const property_metadata_1 = __webpack_require__(/*! ./property-metadata */ "../kartoffelgames.core.dependency_injection/library/source/metadata/property-metadata.js");
/**
 * Constructor metadata.
 */
class ConstructorMetadata {
    /**
     * Constructor.
     * Initialize lists.
     */
    constructor() {
        this.mCustomMetadata = new core_data_1.Dictionary();
        this.mPropertyMetadata = new core_data_1.Dictionary();
        this.mParameterTypes = null;
    }
    /**
     * Get parameter type information.
     */
    get parameterTypeList() {
        return this.mParameterTypes;
    }
    /**
     * Set parameter type information.
     */
    set parameterTypeList(pParameterTypes) {
        // Copy array.
        this.mParameterTypes = pParameterTypes;
    }
    /**
     * Get metadata of constructor.
     * @param pMetadataKey - Metadata key.
     */
    getMetadata(pMetadataKey) {
        return this.mCustomMetadata.get(pMetadataKey) ?? null;
    }
    /**
     * Get property by key.
     * Creates new property metadata if it not already exists.
     * @param pPropertyKey - Key of property.
     */
    getProperty(pPropertyKey) {
        // Create if missing.
        if (!this.mPropertyMetadata.has(pPropertyKey)) {
            this.mPropertyMetadata.add(pPropertyKey, new property_metadata_1.PropertyMetadata());
        }
        return this.mPropertyMetadata.get(pPropertyKey);
    }
    /**
     * Set metadata of constructor.
     * @param pMetadataKey - Metadata key.
     * @param pMetadataValue - Metadata value.
     */
    setMetadata(pMetadataKey, pMetadataValue) {
        this.mCustomMetadata.set(pMetadataKey, pMetadataValue);
    }
}
exports.ConstructorMetadata = ConstructorMetadata;
//# sourceMappingURL=constructor-metadata.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/metadata/metadata.js":
/*!***************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/metadata/metadata.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Metadata = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const decoration_history_1 = __webpack_require__(/*! ../decoration-history/decoration-history */ "../kartoffelgames.core.dependency_injection/library/source/decoration-history/decoration-history.js");
const constructor_metadata_1 = __webpack_require__(/*! ./constructor-metadata */ "../kartoffelgames.core.dependency_injection/library/source/metadata/constructor-metadata.js");
/**
 * Static.
 * Metadata storage.
 */
class Metadata {
    /**
     * Get metadata of constructor.
     */
    static get(pConstructor) {
        // Use root constructor to register metadata information.
        const lRegisteredConstructor = decoration_history_1.DecorationHistory.getRootOf(pConstructor);
        // Create new or get metadata.
        let lMetadata;
        if (this.mConstructorMetadata.has(lRegisteredConstructor)) {
            lMetadata = Metadata.mConstructorMetadata.get(lRegisteredConstructor);
        }
        else {
            lMetadata = new constructor_metadata_1.ConstructorMetadata();
            Metadata.mConstructorMetadata.add(lRegisteredConstructor, lMetadata);
        }
        return lMetadata;
    }
}
exports.Metadata = Metadata;
Metadata.mConstructorMetadata = new core_data_1.Dictionary();
//# sourceMappingURL=metadata.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/metadata/property-metadata.js":
/*!************************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/metadata/property-metadata.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PropertyMetadata = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
class PropertyMetadata {
    /**
     * Constructor.
     * Initialize lists.
     */
    constructor() {
        this.mCustomMetadata = new core_data_1.Dictionary();
        this.mParameterTypes = null;
        this.mType = null;
        this.mReturnType = null;
    }
    /**
     * Get parameter type information.
     */
    get parameterTypes() {
        return this.mParameterTypes;
    }
    /**
     * Set parameter type information.
     */
    set parameterTypes(pParameterTypes) {
        // Copy array.
        if (pParameterTypes !== null) {
            this.mParameterTypes = core_data_1.List.newListWith(...pParameterTypes);
        }
        else {
            this.mParameterTypes = null;
        }
    }
    /**
     * Get return type information.
     */
    get returnType() {
        return this.mReturnType;
    }
    /**
     * Set return type information.
     */
    set returnType(pReturnType) {
        this.mReturnType = pReturnType;
    }
    /**
     * Get property type information.
     */
    get type() {
        return this.mType;
    }
    /**
     * Set property type information.
     */
    set type(pReturnType) {
        this.mType = pReturnType;
    }
    /**
     * Get metadata of constructor.
     * @param pMetadataKey - Metadata key.
     */
    getMetadata(pMetadataKey) {
        return this.mCustomMetadata.get(pMetadataKey) ?? null;
    }
    /**
     * Set metadata of constructor.
     * @param pMetadataKey - Metadata key.
     * @param pMetadataValue - Metadata value.
     */
    setMetadata(pMetadataKey, pMetadataValue) {
        this.mCustomMetadata.set(pMetadataKey, pMetadataValue);
    }
}
exports.PropertyMetadata = PropertyMetadata;
//# sourceMappingURL=property-metadata.js.map

/***/ }),

/***/ "../kartoffelgames.core.dependency_injection/library/source/reflect/reflect-initializer.js":
/*!*************************************************************************************************!*\
  !*** ../kartoffelgames.core.dependency_injection/library/source/reflect/reflect-initializer.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReflectInitializer = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const decoration_history_1 = __webpack_require__(/*! ../decoration-history/decoration-history */ "../kartoffelgames.core.dependency_injection/library/source/decoration-history/decoration-history.js");
const metadata_1 = __webpack_require__(/*! ../metadata/metadata */ "../kartoffelgames.core.dependency_injection/library/source/metadata/metadata.js");
class ReflectInitializer {
    /**
     * Initializes global defintions for decorate and metadata into the Reflect object.
     */
    static initialize() {
        if (!ReflectInitializer.mExported) {
            ReflectInitializer.mExported = true;
            ReflectInitializer.export('decorate', ReflectInitializer.decorate);
            ReflectInitializer.export('metadata', ReflectInitializer.metadata);
        }
    }
    /**
     * Decorate class, method, parameter or property.
     * @param pDecoratorList - List of decorators.
     * @param pTarget - Target for decorator.
     * @param pPropertyKey - Key of property on member decorator.
     * @param pDescriptor - Descriptor of member on member decorator.
     */
    static decorate(pDecoratorList, pTarget, pPropertyKey, pDescriptor) {
        let lDecoratorResult;
        if (pPropertyKey && pDescriptor) {
            // Decorate accessor, function. Returns new descriptor.
            lDecoratorResult = ReflectInitializer.decorateMethod(pDecoratorList, pTarget, pPropertyKey, pDescriptor);
        }
        else if (pPropertyKey && !pDescriptor) {
            // Decorate property or parameter. Has no return value.
            ReflectInitializer.decorateProperty(pDecoratorList, pTarget, pPropertyKey);
            lDecoratorResult = null; // Is ignored.
        }
        else { // Only target set.
            // Decorate class. Returns replacement class.
            lDecoratorResult = ReflectInitializer.decorateClass(pDecoratorList, pTarget);
        }
        return lDecoratorResult;
    }
    /**
     * Decorate class.
     * @param pDecoratorList - Decorators.
     * @param pConstructor - Target constructor.
     */
    static decorateClass(pDecoratorList, pConstructor) {
        let lCurrentConstrutor = pConstructor;
        // Run all metadata decorator first.
        for (const lDecorator of pDecoratorList) {
            if (lDecorator.isMetadata) {
                // Metadata decorator doesn't return values.
                lDecorator(pConstructor);
            }
        }
        // For each decorator included metadata decorator.
        for (const lDecorator of pDecoratorList) {
            // If the decorator was a metadata decorator use the original class as target.
            if (!lDecorator.isMetadata) {
                // Execute decorator.
                const lNewConstructor = lDecorator(pConstructor);
                // Check if decorator does return different class.
                if (!!lNewConstructor && lNewConstructor !== lCurrentConstrutor) {
                    if (typeof lNewConstructor === 'function') {
                        // Add changed construtor to the decoration history.
                        decoration_history_1.DecorationHistory.addHistory(lCurrentConstrutor, lNewConstructor);
                        lCurrentConstrutor = lNewConstructor;
                    }
                    else {
                        throw new core_data_1.Exception('Constructor decorator does not return supported value.', lDecorator);
                    }
                }
            }
        }
        return lCurrentConstrutor;
    }
    /**
     * Decorate method or accessor.
     * @param pDecoratorList - Decorators.
     * @param pTarget - Is on instanced target the prototype and on static the constructor.s
     * @param pPropertyKey - Key of property decorator.
     * @param pDescriptor - Descriptor of property
     */
    static decorateMethod(pDecoratorList, pTarget, pPropertyKey, pDescriptor) {
        let lCurrentDescriptor = pDescriptor;
        // For each decorator.
        for (const lDecorator of pDecoratorList) {
            // Execute decorator.
            const lDecoratedMember = lDecorator(pTarget, pPropertyKey, lCurrentDescriptor);
            // Check if decorator does return different PropertyDescriptor.
            if (lDecoratedMember) {
                if (typeof lDecoratedMember === 'object') {
                    lCurrentDescriptor = lDecoratedMember;
                }
                else {
                    throw new core_data_1.Exception('Member decorator does not return supported value.', lDecorator);
                }
            }
        }
        return lCurrentDescriptor;
    }
    /**
     * Decorate property or parameter..
     * @param pDecoratorList - Decorators.
     * @param pTarget - Is on instanced target the prototype and on static the constructor.s
     * @param pPropertyKey - Key of property decorator.
     */
    static decorateProperty(pDecoratorList, pTarget, pPropertyKey) {
        // For each decorator.
        for (const lDecorator of pDecoratorList) {
            // Execute decorator. Doesn't return any value.
            lDecorator(pTarget, pPropertyKey, undefined); // Index number gets overriden for parameter decorator.
        }
    }
    /**
     * Export property into Reflect object.
     * @param pKey - Key of property.
     * @param pValue - Value of property.
     */
    static export(pKey, pValue) {
        // Find root for accessing Reflect.
        /* istanbul ignore next */
        const lRoot = typeof window === 'object' ? window : __webpack_require__.g;
        // Set target as Reflect of root. (window or global).
        const lTarget = lRoot.Reflect;
        Object.defineProperty(lTarget, pKey, { configurable: true, writable: true, value: pValue });
    }
    /**
     * Get constructor from prototype.
     * @param pPrototypeOrConstructor - Prototype or constructor of class.
     */
    static getConstructor(pPrototypeOrConstructor) {
        // Get constructor from prototype if is an instanced member.
        if (typeof pPrototypeOrConstructor !== 'function') {
            return pPrototypeOrConstructor.constructor;
        }
        else {
            return pPrototypeOrConstructor;
        }
    }
    /**
     * Entry point for Typescripts emitDecoratorMetadata data.
     * @param pMetadataKey - Key of metadata.
     * @param pMetadataValue - Value of metadata. Usually only "design:paramtypes" data.
     */
    static metadata(pMetadataKey, pMetadataValue) {
        /*
           __metadata("design:type", Function), // Parameter Value
           __metadata("design:paramtypes", [Number, String]), // Function or Constructor Parameter
           __metadata("design:returntype", void 0) // Function return type.
        */
        const lResultDecorator = (pConstructorOrPrototype, pProperty, pDescriptorOrIndex) => {
            // Get constructor from prototype if is an instanced member.
            const lConstructor = ReflectInitializer.getConstructor(pConstructorOrPrototype);
            const lConstructorMetadata = metadata_1.Metadata.get(lConstructor);
            if (pProperty) {
                const lPropertyMetadata = lConstructorMetadata.getProperty(pProperty);
                // If not parameter index.
                /* istanbul ignore else */
                if (typeof pDescriptorOrIndex !== 'number') {
                    // Property decorator.
                    /* istanbul ignore else */
                    if (pMetadataKey === 'design:paramtypes') {
                        lPropertyMetadata.parameterTypes = pMetadataValue;
                    }
                    else if (pMetadataKey === 'design:type') {
                        lPropertyMetadata.type = pMetadataValue;
                    }
                    else if (pMetadataKey === 'design:returntype') {
                        lPropertyMetadata.returnType = pMetadataValue;
                    }
                    // Ignore future metadata.
                }
                // Else. Parameter decorator.
                // Ignore else case. Not supported.
            }
            else {
                // Class decorator.
                /* istanbul ignore else */
                if (pMetadataKey === 'design:paramtypes') {
                    lConstructorMetadata.parameterTypeList = pMetadataValue;
                }
                // Ignore future metadata.
            }
        };
        // Set as metadata constructor and return.
        lResultDecorator.isMetadata = true;
        return lResultDecorator;
    }
}
exports.ReflectInitializer = ReflectInitializer;
ReflectInitializer.mExported = false;
//# sourceMappingURL=reflect-initializer.js.map

/***/ }),

/***/ "../kartoffelgames.core.xml/library/source/attribute/xml-attribute.js":
/*!****************************************************************************!*\
  !*** ../kartoffelgames.core.xml/library/source/attribute/xml-attribute.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XmlAttribute = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
/**
 * Xml attribute. Can handle values with lists or string.
 */
class XmlAttribute {
    constructor(pName, pNamespacePrefix = null, pSeperator = ' ') {
        this.mValues = new core_data_1.List();
        this.mName = pName;
        this.mSeperator = pSeperator;
        this.mNamespacePrefix = pNamespacePrefix;
        this.mXmlElement = null;
    }
    /**
     * Get attribute name without namespace prefix.
     */
    get name() {
        return this.mName;
    }
    /**
     * Namespace.
     */
    get namespace() {
        // Check if attribute is append and has an prefix.
        if (this.xmlElement && this.namespacePrefix) {
            return this.xmlElement.getNamespace(this.namespacePrefix);
        }
        // Default namespace is allways null.
        return null;
    }
    /**
     * Namespace key of attribute.
     */
    get namespacePrefix() {
        return this.mNamespacePrefix;
    }
    /**
     * Get attribute name with namespace prefix.
     */
    get qualifiedName() {
        if (this.mNamespacePrefix) {
            return `${this.mNamespacePrefix}:${this.mName}`;
        }
        else {
            return this.mName;
        }
    }
    /**
     * Seperator values get joined.
     */
    get seperator() {
        return this.mSeperator;
    }
    /**
     * Get value list as string.
     */
    get value() {
        return this.mValues.join(this.mSeperator);
    }
    /**
     * Set value list as string.
     */
    set value(pValue) {
        // Clear list.
        this.mValues.splice(0, this.mValues.length);
        // Split with seperator and add to value list.
        this.mValues.push(...pValue.split(this.mSeperator));
    }
    /**
     * Get value list.
     */
    get valueList() {
        return this.mValues.clone();
    }
    /**
     * Xml element of attribute.
     */
    get xmlElement() {
        return this.mXmlElement;
    }
    /**
     * Xml element of attribute.
     */
    set xmlElement(pXmlElement) {
        this.mXmlElement = pXmlElement;
    }
}
exports.XmlAttribute = XmlAttribute;
//# sourceMappingURL=xml-attribute.js.map

/***/ }),

/***/ "../kartoffelgames.core.xml/library/source/document/xml-document.js":
/*!**************************************************************************!*\
  !*** ../kartoffelgames.core.xml/library/source/document/xml-document.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XmlDocument = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const base_xml_node_1 = __webpack_require__(/*! ../node/base-xml-node */ "../kartoffelgames.core.xml/library/source/node/base-xml-node.js");
/**
 * XMLDocument.
 */
class XmlDocument extends base_xml_node_1.BaseXmlNode {
    /**
     * Constructor.
     */
    constructor(pDefaultNamespace) {
        super();
        this.mDefaultNamespace = pDefaultNamespace;
        this.mBodyElementList = new core_data_1.List();
    }
    /**
     * Get all document xml nodes.
     */
    get body() {
        return this.mBodyElementList.clone();
    }
    /**
     * Get nodes namespace.
     */
    get defaultNamespace() {
        return this.mDefaultNamespace;
    }
    /**
     * Get xml nodes document.
     */
    get document() {
        return this;
    }
    /**
     * Append child to document body.
     * @param pXmlNode - Xml node.
     */
    appendChild(...pXmlNodeList) {
        this.mBodyElementList.push(...pXmlNodeList);
        for (const lChildNode of pXmlNodeList) {
            lChildNode.parent = this;
        }
    }
    /**
     * Clonse document with all nodes.
     */
    clone() {
        const lXmlDocument = new XmlDocument(this.defaultNamespace);
        // Clone all child nodes.
        for (const lXmlNode of this.mBodyElementList) {
            lXmlDocument.appendChild(lXmlNode.clone());
        }
        return lXmlDocument;
    }
    /**
     * Compare two documents for equality.
     * @param pBaseNode - Node that should be compared.
     */
    equals(pBaseNode) {
        // Check type, tagname, namespace and namespace prefix.
        if (!(pBaseNode instanceof XmlDocument)) {
            return false;
        }
        // Same namespace.
        if (pBaseNode.mDefaultNamespace !== this.mDefaultNamespace) {
            return false;
        }
        // Same length
        if (pBaseNode.body.length !== this.body.length) {
            return false;
        }
        // Compare each body element.
        for (let lIndex = 0; lIndex < this.body.length; lIndex++) {
            if (!this.body[lIndex].equals(pBaseNode.body[lIndex])) {
                return false;
            }
        }
        return true;
    }
}
exports.XmlDocument = XmlDocument;
//# sourceMappingURL=xml-document.js.map

/***/ }),

/***/ "../kartoffelgames.core.xml/library/source/enum/node-type.js":
/*!*******************************************************************!*\
  !*** ../kartoffelgames.core.xml/library/source/enum/node-type.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NodeType = void 0;
/**
 * Type of xml node.
 */
var NodeType;
(function (NodeType) {
    NodeType[NodeType["Text"] = 1] = "Text";
    NodeType[NodeType["EmptyTag"] = 2] = "EmptyTag";
    NodeType[NodeType["OpeningTag"] = 3] = "OpeningTag";
    NodeType[NodeType["ClosingTag"] = 4] = "ClosingTag";
    NodeType[NodeType["Comment"] = 5] = "Comment";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
//# sourceMappingURL=node-type.js.map

/***/ }),

/***/ "../kartoffelgames.core.xml/library/source/index.js":
/*!**********************************************************!*\
  !*** ../kartoffelgames.core.xml/library/source/index.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XmlParser = exports.CommentNode = exports.XmlDocument = exports.XmlAttribute = exports.NodeType = exports.XmlElement = exports.TextNode = exports.BaseXmlNode = exports.BaseXmlParser = void 0;
// Exports for package.
var base_xml_parser_1 = __webpack_require__(/*! ./parser/base-xml-parser */ "../kartoffelgames.core.xml/library/source/parser/base-xml-parser.js");
Object.defineProperty(exports, "BaseXmlParser", ({ enumerable: true, get: function () { return base_xml_parser_1.BaseXmlParser; } }));
var base_xml_node_1 = __webpack_require__(/*! ./node/base-xml-node */ "../kartoffelgames.core.xml/library/source/node/base-xml-node.js");
Object.defineProperty(exports, "BaseXmlNode", ({ enumerable: true, get: function () { return base_xml_node_1.BaseXmlNode; } }));
var text_node_1 = __webpack_require__(/*! ./node/text-node */ "../kartoffelgames.core.xml/library/source/node/text-node.js");
Object.defineProperty(exports, "TextNode", ({ enumerable: true, get: function () { return text_node_1.TextNode; } }));
var xml_element_1 = __webpack_require__(/*! ./node/xml-element */ "../kartoffelgames.core.xml/library/source/node/xml-element.js");
Object.defineProperty(exports, "XmlElement", ({ enumerable: true, get: function () { return xml_element_1.XmlElement; } }));
var node_type_1 = __webpack_require__(/*! ./enum/node-type */ "../kartoffelgames.core.xml/library/source/enum/node-type.js");
Object.defineProperty(exports, "NodeType", ({ enumerable: true, get: function () { return node_type_1.NodeType; } }));
var xml_attribute_1 = __webpack_require__(/*! ./attribute/xml-attribute */ "../kartoffelgames.core.xml/library/source/attribute/xml-attribute.js");
Object.defineProperty(exports, "XmlAttribute", ({ enumerable: true, get: function () { return xml_attribute_1.XmlAttribute; } }));
var xml_document_1 = __webpack_require__(/*! ./document/xml-document */ "../kartoffelgames.core.xml/library/source/document/xml-document.js");
Object.defineProperty(exports, "XmlDocument", ({ enumerable: true, get: function () { return xml_document_1.XmlDocument; } }));
var comment_node_1 = __webpack_require__(/*! ./node/comment-node */ "../kartoffelgames.core.xml/library/source/node/comment-node.js");
Object.defineProperty(exports, "CommentNode", ({ enumerable: true, get: function () { return comment_node_1.CommentNode; } }));
var xml_parser_1 = __webpack_require__(/*! ./parser/xml-parser */ "../kartoffelgames.core.xml/library/source/parser/xml-parser.js");
Object.defineProperty(exports, "XmlParser", ({ enumerable: true, get: function () { return xml_parser_1.XmlParser; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../kartoffelgames.core.xml/library/source/node/base-xml-node.js":
/*!***********************************************************************!*\
  !*** ../kartoffelgames.core.xml/library/source/node/base-xml-node.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseXmlNode = void 0;
/**
 * Basic node.
 */
class BaseXmlNode {
    /**
     * Constructor.
     */
    constructor() {
        this.mParent = null;
    }
    /**
     * Get xml nodes document.
     */
    get document() {
        return this.parent?.document ?? null;
    }
    /**
     * Get Parent of node.
     */
    get parent() {
        return this.mParent;
    }
    /**
     * Set parent of node.
     * @internal
     */
    set parent(pParent) {
        this.mParent = pParent;
    }
}
exports.BaseXmlNode = BaseXmlNode;
//# sourceMappingURL=base-xml-node.js.map

/***/ }),

/***/ "../kartoffelgames.core.xml/library/source/node/comment-node.js":
/*!**********************************************************************!*\
  !*** ../kartoffelgames.core.xml/library/source/node/comment-node.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentNode = void 0;
const base_xml_node_1 = __webpack_require__(/*! ./base-xml-node */ "../kartoffelgames.core.xml/library/source/node/base-xml-node.js");
/**
 * Node only contains text.
 */
class CommentNode extends base_xml_node_1.BaseXmlNode {
    /**
     * Constructor.
     */
    constructor() {
        super();
        this.mText = '';
    }
    /**
     * Get nodes namespace.
     */
    get defaultNamespace() {
        return this.parent?.defaultNamespace ?? null;
    }
    /**
     * Get text string of node.
     */
    get text() {
        return this.mText;
    }
    /**
     * Set text string of node.
     * @param pText - Text of node.
     */
    set text(pText) {
        this.mText = pText;
    }
    /**
     * Clone current node.
     */
    clone() {
        const lCommentNodeClone = new CommentNode();
        lCommentNodeClone.text = this.text;
        return lCommentNodeClone;
    }
    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    equals(pBaseNode) {
        return pBaseNode instanceof CommentNode && pBaseNode.text === this.text;
    }
}
exports.CommentNode = CommentNode;
//# sourceMappingURL=comment-node.js.map

/***/ }),

/***/ "../kartoffelgames.core.xml/library/source/node/text-node.js":
/*!*******************************************************************!*\
  !*** ../kartoffelgames.core.xml/library/source/node/text-node.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TextNode = void 0;
const base_xml_node_1 = __webpack_require__(/*! ./base-xml-node */ "../kartoffelgames.core.xml/library/source/node/base-xml-node.js");
/**
 * Node only contains text.
 */
class TextNode extends base_xml_node_1.BaseXmlNode {
    /**
     * Constructor.
     */
    constructor() {
        super();
        this.mText = '';
    }
    /**
     * Get nodes namespace.
     */
    get defaultNamespace() {
        return this.parent?.defaultNamespace ?? null;
    }
    /**
     * Get text string of node.
     */
    get text() {
        return this.mText;
    }
    /**
     * Set text string of node.
     * @param pText - Text of node.
     */
    set text(pText) {
        this.mText = pText;
    }
    /**
     * Clone current node.
     */
    clone() {
        const lTextNodeClone = new TextNode();
        lTextNodeClone.text = this.text;
        return lTextNodeClone;
    }
    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    equals(pBaseNode) {
        return pBaseNode instanceof TextNode && pBaseNode.text === this.text;
    }
}
exports.TextNode = TextNode;
//# sourceMappingURL=text-node.js.map

/***/ }),

/***/ "../kartoffelgames.core.xml/library/source/node/xml-element.js":
/*!*********************************************************************!*\
  !*** ../kartoffelgames.core.xml/library/source/node/xml-element.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XmlElement = void 0;
const xml_attribute_1 = __webpack_require__(/*! ../attribute/xml-attribute */ "../kartoffelgames.core.xml/library/source/attribute/xml-attribute.js");
const base_xml_node_1 = __webpack_require__(/*! ./base-xml-node */ "../kartoffelgames.core.xml/library/source/node/base-xml-node.js");
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const core_data_2 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
/**
 * Xml node.
 */
class XmlElement extends base_xml_node_1.BaseXmlNode {
    /**
     * Constructor.
     */
    constructor() {
        super();
        this.mAttributeDictionary = new core_data_1.Dictionary();
        this.mChildList = Array();
        this.mNamespacePrefix = null;
        this.mTagName = '';
    }
    /**
     * Get all attributes from xml node.
     */
    get attributeList() {
        return core_data_2.List.newListWith(...this.mAttributeDictionary.values());
    }
    /**
     * Get childs of xml node list.
     */
    get childList() {
        return core_data_2.List.newListWith(...this.mChildList);
    }
    /**
     * Get default namespace.
     */
    get defaultNamespace() {
        // Get default namespace.
        return this.getNamespace() ?? null;
    }
    /**
     * Namespace of xml node.
     */
    get namespace() {
        // Prefix has high priority.
        if (this.namespacePrefix) {
            return this.getNamespace(this.namespacePrefix);
        }
        // Default namespace.
        return this.defaultNamespace;
    }
    /**
     * Get namespace prefix of xml node.
     */
    get namespacePrefix() {
        return this.mNamespacePrefix;
    }
    /**
     * Set namespace prefix of xml node.
     */
    set namespacePrefix(pNamespacePrefix) {
        this.mNamespacePrefix = pNamespacePrefix;
    }
    /**
     * Qualified tagname with namespace prefix.
     */
    get qualifiedTagName() {
        if (this.mNamespacePrefix) {
            return `${this.mNamespacePrefix}:${this.mTagName}`;
        }
        else {
            return this.mTagName;
        }
    }
    /**
     * Get tagname without namespace prefix.
     */
    get tagName() {
        return this.mTagName;
    }
    /**
     * Set tagname without namespace prefix.
     */
    set tagName(pTagName) {
        this.mTagName = pTagName;
    }
    /**
     * Add child node to node list.
     * @param pNode - Base node.
     */
    appendChild(...pNode) {
        // Set parent for each child and remove child from previous parent.
        for (const lChild of pNode) {
            // If child has already parent.
            if (lChild.parent instanceof XmlElement) {
                lChild.parent.removeChild(lChild);
            }
            lChild.parent = this;
        }
        this.mChildList.push(...pNode);
    }
    /**
     * Clone current node.
     */
    clone() {
        const lClonedNode = new XmlElement();
        lClonedNode.tagName = this.tagName;
        lClonedNode.namespacePrefix = this.namespacePrefix;
        // Add attributes.
        for (const lAttribute of this.attributeList) {
            lClonedNode.setAttribute(lAttribute.name, lAttribute.value, lAttribute.namespacePrefix);
        }
        // Deep clone every node.
        for (const lNode of this.mChildList) {
            lClonedNode.appendChild(lNode.clone());
        }
        return lClonedNode;
    }
    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     */
    equals(pBaseNode) {
        // Check type, tagname, namespace and namespace prefix.
        if (!(pBaseNode instanceof XmlElement) || pBaseNode.qualifiedTagName !== this.qualifiedTagName) {
            return false;
        }
        // Check same count of attributes.
        if (pBaseNode.attributeList.length !== this.attributeList.length) {
            return false;
        }
        // Check all attributes.
        for (const lAttribute of pBaseNode.mAttributeDictionary.values()) {
            // This checks also for wrong namespace prefix by checking for qualified attribute name.
            const lAttributeTwo = this.mAttributeDictionary.get(lAttribute.qualifiedName);
            if (!lAttributeTwo || lAttributeTwo.value !== lAttribute.value) {
                return false;
            }
        }
        // Check same count of childs.
        if (pBaseNode.childList.length !== this.childList.length) {
            return false;
        }
        // Deep check all childnodes
        for (let lIndex = 0; lIndex < pBaseNode.childList.length; lIndex++) {
            if (!pBaseNode.childList[lIndex].equals(this.childList[lIndex])) {
                return false;
            }
        }
        return true;
    }
    /**
     * Get attribute of xml node.
     * Returns null if attribute does not exist.
     * @param pKey - Full qualified name of attribute.
     */
    getAttribute(pKey) {
        return this.mAttributeDictionary.get(pKey);
    }
    /**
     * Get namespace of prefix or if no prefix is set, get the default namespace.
     */
    getNamespace(pPrefix = null) {
        // Get namespace from prefix or default namespace.
        if (pPrefix) {
            const lPrefixLowerCase = pPrefix.toLowerCase();
            // Check for local prefix namespace.
            const lPrefixNamespaceAttribute = this.attributeList.find((pAttribute) => {
                return pAttribute.namespacePrefix?.toLowerCase() === 'xmlns' && pAttribute.name.toLowerCase() === lPrefixLowerCase;
            });
            // Return default namespace if it is defined.
            if (lPrefixNamespaceAttribute) {
                return lPrefixNamespaceAttribute.value;
            }
            // Get prefix namespace from parent, if parent is a xml element.
            if (this.parent instanceof XmlElement) {
                return this.parent.getNamespace(pPrefix);
            }
        }
        else {
            // Check for local default namespace.
            const lDefaultNamespaceAttribute = this.attributeList.find((pAttribute) => {
                return pAttribute.qualifiedName === 'xmlns';
            });
            // Return default namespace if it is defined.
            if (lDefaultNamespaceAttribute) {
                return lDefaultNamespaceAttribute.value;
            }
            // Get parent mapping.
            return this.parent?.defaultNamespace ?? null;
        }
        return null;
    }
    /**
     * Removes attribute and return if attribute was removed/existed.
     * @param pKey - Key of attribute.
     */
    removeAttribute(pKey) {
        if (this.mAttributeDictionary.has(pKey)) {
            this.mAttributeDictionary.delete(pKey);
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Remove child from XmlNode.
     * Return removed child.
     * @param pNode - Child to remove.
     */
    removeChild(pNode) {
        const lIndex = this.mChildList.indexOf(pNode);
        let lRemovedChild = undefined;
        // If list contains node.
        if (lIndex !== -1) {
            lRemovedChild = this.mChildList.splice(lIndex, 1)[0];
            // If xml node remove parent connection.
            lRemovedChild.parent = null;
        }
        return lRemovedChild;
    }
    /**
     * Set and get Attribute of xml node. Creates new one if attribute does not exist.
     * @param pKey - Key of attribute.
     * @param pValue - Name of attribute.
     * @param pNamespacePrefix - Namespace prefix of attribute.
     */
    setAttribute(pKey, pValue, pNamespacePrefix = null) {
        let lAttribute;
        // Create qualifed attribute name.
        let lQualifiedTagName;
        if (pNamespacePrefix) {
            lQualifiedTagName = `${pNamespacePrefix}:${pKey}`;
        }
        else {
            lQualifiedTagName = pKey;
        }
        if (this.mAttributeDictionary.has(lQualifiedTagName)) {
            lAttribute = this.mAttributeDictionary.get(lQualifiedTagName);
        }
        else {
            lAttribute = new xml_attribute_1.XmlAttribute(pKey, pNamespacePrefix);
            this.mAttributeDictionary.add(lQualifiedTagName, lAttribute);
        }
        // Set this as attributes parent xml element.
        lAttribute.xmlElement = this;
        // Set value.
        lAttribute.value = pValue;
        return lAttribute;
    }
}
exports.XmlElement = XmlElement;
//# sourceMappingURL=xml-element.js.map

/***/ }),

/***/ "../kartoffelgames.core.xml/library/source/parser/base-xml-parser.js":
/*!***************************************************************************!*\
  !*** ../kartoffelgames.core.xml/library/source/parser/base-xml-parser.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseXmlParser = void 0;
const node_type_1 = __webpack_require__(/*! ../enum/node-type */ "../kartoffelgames.core.xml/library/source/enum/node-type.js");
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const xml_document_1 = __webpack_require__(/*! ../document/xml-document */ "../kartoffelgames.core.xml/library/source/document/xml-document.js");
/**
 * XML parser. Can handle none XML conform styles with different parser modes.
 */
class BaseXmlParser {
    /**
     * Constructor. Creates parser with specified mode.
     * @param pParserMode - Mode how parser handles different characters.
     */
    constructor(pParserConfig = {}) {
        this.mConfig = {};
        // Set default config.
        this.mConfig.allowedAttributeCharacters = pParserConfig.allowedAttributeCharacters ?? 'abcdefghijklmnopqrstuvwxyz_:-.1234567890';
        this.mConfig.allowedTagNameCharacters = pParserConfig.allowedTagNameCharacters ?? 'abcdefghijklmnopqrstuvwxyz_:-.1234567890';
        this.mConfig.removeComments = !!pParserConfig.removeComments;
        // Extend allowed character for case insensitivity and escape.
        this.mConfig.allowedAttributeCharacters = this.escapeRegExp(this.mConfig.allowedAttributeCharacters.toLowerCase() + this.mConfig.allowedAttributeCharacters.toUpperCase());
        this.mConfig.allowedTagNameCharacters = this.escapeRegExp(this.mConfig.allowedTagNameCharacters.toLowerCase() + this.mConfig.allowedTagNameCharacters.toUpperCase());
    }
    /**
     * Parse xml string to node list.
     * String can have divergent nameings for tagnames and attributes if adjusted in parser config.
     * @param pXmlString - Xml formated string.
     */
    parse(pXmlString) {
        const lRegexString = new RegExp(/"[^"]*"/gs);
        const lRegexXmlParts = new RegExp(/<[^>]*>|[^<>]*/gs);
        // Wrapp xml string inside root node.
        let lXmlString = `<${BaseXmlParser.ROOT_NODE_NAME}>${pXmlString}</${BaseXmlParser.ROOT_NODE_NAME}>`;
        // Escape greater than and lower than inside strings.
        lXmlString = lXmlString.replace(lRegexString, (pMatch) => {
            return pMatch.replace('<', '&ltxp;').replace('>', '&gtxp;');
        });
        // Break Xml into parts and filter empty lines. Does allways match.
        const lXmlPartsMatch = lXmlString.match(lRegexXmlParts);
        const lXmlPartList = lXmlPartsMatch.filter((pValue) => {
            return pValue && !pValue.match(/^\s*$/);
        });
        // Convert xml parts to more specified simple nodes.
        const lXmlElementList = lXmlPartList.map((pValue) => {
            const lNode = new SimpleNode(this.getNodeType(pValue));
            lNode.nodeHead = pValue;
            // If node is not a text node and not comment, add NodeName.
            if (lNode.nodeType !== node_type_1.NodeType.Text && lNode.nodeType !== node_type_1.NodeType.Comment) {
                lNode.nodeName = this.getNodeName(lNode.nodeHead);
            }
            return lNode;
        });
        // Remove closing tag.
        lXmlElementList.splice(lXmlElementList.length - 1, 1);
        // Pack all content into previously added root node.
        let lRootNode = lXmlElementList.splice(0, 1)[0];
        lRootNode.nodeBody.push(...lXmlElementList);
        // Pack node into correct child nodes.
        lRootNode = this.packXmlContent(lRootNode);
        // Convert root SimpleNode to xml node. Root node can only be xml node.
        const lConvertedRootNode = this.convertSimpleNode(lRootNode);
        // Add all ROOT-NODE childs to document.
        const lDocument = new xml_document_1.XmlDocument(this.getDefaultNamespace());
        lDocument.appendChild(...lConvertedRootNode.childList);
        return lDocument;
    }
    /**
     * Convert simple node to xml nodes.
     * @param pSimpleNode - Complete simple node.
     */
    convertSimpleNode(pSimpleNode) {
        if (pSimpleNode.nodeType === node_type_1.NodeType.OpeningTag || pSimpleNode.nodeType === node_type_1.NodeType.EmptyTag) {
            // Find attributes and namespaces.
            const lAttributes = this.getAttributesFromString(this.getAttributeString(pSimpleNode));
            // Get namespace information for xml node.
            const lNodeNamespaceInfo = this.getXmlElementInformation(pSimpleNode.nodeName);
            // Create new node.
            const lResultNode = new (this.getXmlElementConstructor())();
            lResultNode.tagName = lNodeNamespaceInfo.name;
            lResultNode.namespacePrefix = lNodeNamespaceInfo.namespacePrefix;
            // Add attributes to new node.
            for (const lAttribute of lAttributes) {
                lResultNode.setAttribute(lAttribute.name, lAttribute.value, lAttribute.namespacePrefix);
            }
            // Add all child element.
            for (const lChild of pSimpleNode.nodeBody) {
                const lXmlNode = this.convertSimpleNode(lChild);
                // Do not add wrong or empty nodes.
                if (lXmlNode) {
                    lResultNode.appendChild(lXmlNode);
                }
            }
            return lResultNode;
        }
        else if (pSimpleNode.nodeType === node_type_1.NodeType.Text) {
            // Text. Create text node. Remove quotation.
            const lTextNode = new (this.getTextNodeConstructor())();
            lTextNode.text = pSimpleNode.nodeHead.replace(/^"/, '').replace(/"$/, '').replace('&ltxp;', '<').replace('&gtxp;', '>');
            return lTextNode;
        }
        else if (pSimpleNode.nodeType === node_type_1.NodeType.Comment && !this.mConfig.removeComments) {
            // Comment. Create comment node.
            const lCommentNode = new (this.geCommentNodeConstructor())();
            lCommentNode.text = pSimpleNode.nodeHead.substr(4, pSimpleNode.nodeHead.length - 7).trim();
            return lCommentNode;
        }
        return null;
    }
    /**
     * Escape text to be inserted into an regex.
     * @param pText - String.
     */
    escapeRegExp(pText) {
        return pText.replace(/[.*+?^${}()\-|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
    /**
     * Get attribute string of node. Removes opening and closing lower/greater than and tagname.
     * @param pSimpleNode - Simple node. Only opening and empty nodes.
     */
    getAttributeString(pSimpleNode) {
        let lNodeString = pSimpleNode.nodeHead;
        // Remove opening lower than and tagname.
        // ^\<\s*[TAGNAME]
        const lRegexOpeningLowerThanTagName = new RegExp(`^<\\s*[${this.mConfig.allowedTagNameCharacters}]+`);
        // Remove from node string.
        lNodeString = lNodeString.replace(lRegexOpeningLowerThanTagName, '');
        // Remove closing greater than from node string.
        if (pSimpleNode.nodeType === node_type_1.NodeType.OpeningTag) {
            lNodeString = lNodeString.replace(/\s*>$/, '');
        }
        else {
            // Is Empty Tag
            lNodeString = lNodeString.replace(/\s*\/\s*>$/, '');
        }
        return lNodeString;
    }
    /**
     * Get attributes from attribute string. Override oldest attribute if dubicate.
     * @param pAttributeString - Attribute string. String that only contains attributes.
     */
    getAttributesFromString(pAttributeString) {
        const lAttributes = new Array();
        const lRegexAttributeParts = new RegExp(/([^\s=]+)(="([^"]*)")?|([^\s]+)/gs);
        const lRegexNameCheck = new RegExp(`^[${this.mConfig.allowedAttributeCharacters}]+$`);
        // Iterate over each attribute.
        let lAttributeParts;
        while ((lAttributeParts = lRegexAttributeParts.exec(pAttributeString))) {
            // Check noneparseable regex group.
            if (lAttributeParts[4]) {
                throw new core_data_1.Exception(`Can't parse attribute part: "${lAttributeParts[4]}"`, this);
            }
            let lNamespacePrefix = null;
            let lName = lAttributeParts[1];
            const lValue = lAttributeParts[3] ?? '';
            // Check if name is correct.
            if (!lRegexNameCheck.test(lName)) {
                throw new core_data_1.Exception(`Can't parse attribute name: "${lName}"`, this);
            }
            // Split name with namespace prefix. Does allways match.
            const lAttributeNameParts = /(([^\s]+):)?([^\s]+)/.exec(lAttributeParts[1]);
            // Check if namespace exists and add namespace prefix.
            if (lAttributeNameParts[2]) {
                lName = lAttributeNameParts[3];
                lNamespacePrefix = lAttributeNameParts[2];
            }
            // Add attribute.
            lAttributes.push({
                name: lName,
                namespacePrefix: lNamespacePrefix,
                // Replace escaped characters with original and normalize newlines.
                value: lValue.replace('&ltxp;', '<').replace('&gtxp;', '>').replace('\n', ' ')
            });
        }
        return lAttributes;
    }
    /**
     * Get tagname of node string. Throws error if name can not be found.
     * @param pXmlPart - Part of xml. Text, closing, opening or empty node as string.
     * @throws - When name can not be found, Node is only a text node.
     */
    getNodeName(pXmlPart) {
        const lRegexPossibleTagName = new RegExp(/<[\s/]*([^\s></]+)/);
        const lRegexNameCheck = new RegExp(`^[${this.mConfig.allowedTagNameCharacters}]+$`);
        // Test if node starts and ends with lower/greater than.
        const lTagName = lRegexPossibleTagName.exec(pXmlPart);
        // Only return tagname if found and correct name syntax.
        if (lTagName && lRegexNameCheck.test(lTagName[1])) {
            return lTagName[1];
        }
        // Throw exception if no name was found.
        throw new core_data_1.Exception(`Error resolving XML-Tagname from "${pXmlPart}"`, this);
    }
    /**
     * Get type of node from node syntax.
     * Must start and end with lower or greater than or none of both.
     * @param pXmlPart - Part of xml. Text, closing, opening or empty node as string.
     */
    getNodeType(pXmlPart) {
        // Check if node starts with lower than.
        if (pXmlPart.startsWith('</')) {
            return node_type_1.NodeType.ClosingTag;
        }
        else if (pXmlPart.startsWith('<!--')) {
            return node_type_1.NodeType.Comment;
        }
        else if (pXmlPart.startsWith('<')) {
            // Check if Tag gets closed by greater than.
            if (pXmlPart.endsWith('/>')) {
                return node_type_1.NodeType.EmptyTag;
            }
            else {
                // Single lower than.
                return node_type_1.NodeType.OpeningTag;
            }
        }
        // Default: Text.
        return node_type_1.NodeType.Text;
    }
    /**
     * Get xml node information from tagnames.
     * @param pFullQualifiedTagName - Full qualified tagname with namespace prefix.
     */
    getXmlElementInformation(pFullQualifiedTagName) {
        let lTagname;
        let lNamespacePrefix = null;
        // Find namespace prefix and tagname of qualified tagname. Does allways match something.
        const lTagnameGroups = /(([^\s]+):)?([^\s]+)/.exec(pFullQualifiedTagName);
        // If namespace before tagname exists.
        if (lTagnameGroups[2]) {
            lTagname = lTagnameGroups[3];
            lNamespacePrefix = lTagnameGroups[2];
        }
        else {
            lTagname = pFullQualifiedTagName;
        }
        return {
            name: lTagname,
            namespacePrefix: lNamespacePrefix
        };
    }
    /**
     * Moves Nodes inside NodeBody into correct child nodes and clears closing tags.
     * @param pRootNode - Root node containing unpacked {SimpeNode} in NodeBody.
     * @throws Exception - When no closing or opening tag was found.
     */
    packXmlContent(pRootNode) {
        // For each content inside simple node.
        for (let lIndex = 0; lIndex < pRootNode.nodeBody.length; lIndex++) {
            const lChildNode = pRootNode.nodeBody[lIndex];
            // If closing tags should be processed, no opening tag was before closing tag.
            if (lChildNode.nodeType === node_type_1.NodeType.ClosingTag) {
                throw new core_data_1.Exception(`Error unexpected closing XML-Tag ${lChildNode.nodeName}`, this);
            }
            else if (lChildNode.nodeType === node_type_1.NodeType.OpeningTag) {
                let lTagLevel = 0;
                let lFoundClosingIndex = -1;
                // Find closing tag.
                for (let lChildIndex = lIndex + 1; lChildIndex < pRootNode.nodeBody.length; lChildIndex++) {
                    const lSearchNode = pRootNode.nodeBody[lChildIndex];
                    // Found tag with same name.
                    if (lSearchNode.nodeName === lChildNode.nodeName) {
                        // Check if closing tag. If not closing, add new level.
                        if (lSearchNode.nodeType === node_type_1.NodeType.OpeningTag) {
                            lTagLevel++;
                        }
                        else if (lSearchNode.nodeType !== node_type_1.NodeType.EmptyTag) {
                            // node type can only be closing. nodeName can not be undefined on opening tags.
                            lTagLevel--;
                            // If level is on lowest, on current child level.
                            if (lTagLevel < 0) {
                                lFoundClosingIndex = lChildIndex;
                                break;
                            }
                        }
                    }
                }
                // Check if no closing tag was found.
                if (lFoundClosingIndex < 0) {
                    throw new core_data_1.Exception(`Error closing XML-Tag ${lChildNode.nodeName}`, this);
                }
                // Remove content for child node from root node and add to child node.
                const lChildBodyContent = pRootNode.nodeBody.splice(lIndex + 1, lFoundClosingIndex - (lIndex + 1));
                lChildNode.nodeBody.push(...lChildBodyContent);
                // Remove closing node.
                pRootNode.nodeBody.splice(lIndex + 1, 1);
            }
        }
        // Rekursion process all tags with possible content.
        for (const lNode of pRootNode.nodeBody) {
            if (lNode.nodeType === node_type_1.NodeType.OpeningTag) {
                this.packXmlContent(lNode);
            }
        }
        return pRootNode;
    }
}
exports.BaseXmlParser = BaseXmlParser;
BaseXmlParser.ROOT_NODE_NAME = 'ROOT-NODE';
/**
 * Simple node for better organising.
 */
class SimpleNode {
    /**
     * Constructor.
     * Create new simple node.
     */
    constructor(pNodeType) {
        this.mNodeBody = new Array();
        this.mNodeHead = '';
        this.mNodeName = '';
        this.mNodeType = pNodeType;
    }
    /**
     * Node body. Sorted.
     */
    get nodeBody() {
        return this.mNodeBody;
    }
    /**
     * Get node head.
     */
    get nodeHead() {
        return this.mNodeHead;
    }
    /**
     * Set node head.
     */
    set nodeHead(pHead) {
        this.mNodeHead = pHead;
    }
    /**
     * Get node name. Cant have any name if node is a text node.
     */
    get nodeName() {
        return this.mNodeName;
    }
    /**
     * Set node name.
     */
    set nodeName(pName) {
        this.mNodeName = pName;
    }
    /**
     * Get type of node.
     */
    get nodeType() {
        return this.mNodeType;
    }
}
//# sourceMappingURL=base-xml-parser.js.map

/***/ }),

/***/ "../kartoffelgames.core.xml/library/source/parser/xml-parser.js":
/*!**********************************************************************!*\
  !*** ../kartoffelgames.core.xml/library/source/parser/xml-parser.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XmlParser = void 0;
const comment_node_1 = __webpack_require__(/*! ../node/comment-node */ "../kartoffelgames.core.xml/library/source/node/comment-node.js");
const text_node_1 = __webpack_require__(/*! ../node/text-node */ "../kartoffelgames.core.xml/library/source/node/text-node.js");
const xml_element_1 = __webpack_require__(/*! ../node/xml-element */ "../kartoffelgames.core.xml/library/source/node/xml-element.js");
const base_xml_parser_1 = __webpack_require__(/*! ./base-xml-parser */ "../kartoffelgames.core.xml/library/source/parser/base-xml-parser.js");
class XmlParser extends base_xml_parser_1.BaseXmlParser {
    /**
     * Get Comment node constructor.
     */
    geCommentNodeConstructor() {
        return comment_node_1.CommentNode;
    }
    /**
     * Get documents default namespace.
     */
    getDefaultNamespace() {
        return 'http://www.w3.org/1999/xhtml';
    }
    /**
     * Get Text node constructor.
     */
    getTextNodeConstructor() {
        return text_node_1.TextNode;
    }
    /**
     * Get XML Element constructor.
     */
    getXmlElementConstructor() {
        return xml_element_1.XmlElement;
    }
}
exports.XmlParser = XmlParser;
//# sourceMappingURL=xml-parser.js.map

/***/ }),

/***/ "../kartoffelgames.web.change_detection/library/source/change_detection/change-detection.js":
/*!**************************************************************************************************!*\
  !*** ../kartoffelgames.web.change_detection/library/source/change_detection/change-detection.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangeDetection = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const error_allocation_1 = __webpack_require__(/*! ./execution_zone/error-allocation */ "../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/error-allocation.js");
const execution_zone_1 = __webpack_require__(/*! ./execution_zone/execution-zone */ "../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/execution-zone.js");
const patcher_1 = __webpack_require__(/*! ./execution_zone/patcher/patcher */ "../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/patcher/patcher.js");
const interaction_detection_proxy_1 = __webpack_require__(/*! ./synchron_tracker/interaction-detection-proxy */ "../kartoffelgames.web.change_detection/library/source/change_detection/synchron_tracker/interaction-detection-proxy.js");
/**
 * Merges execution zone and proxy tracking.
 */
class ChangeDetection {
    constructor(pName, pParentChangeDetection, pLooseParent, pSilent) {
        // Patch for execution zone.
        patcher_1.Patcher.patch(globalThis);
        // Initialize lists
        this.mChangeListenerList = new core_data_1.List();
        this.mErrorListenerList = new core_data_1.List();
        // Save parent.
        if (pLooseParent) {
            this.mParent = null;
            this.mLooseParent = pParentChangeDetection ?? null;
        }
        else {
            this.mParent = pParentChangeDetection ?? null;
            this.mLooseParent = pParentChangeDetection ?? null;
        }
        // Create new execution zone or use old one.
        if (typeof pName === 'string') {
            this.mExecutionZone = new execution_zone_1.ExecutionZone(pName);
        }
        else {
            this.mExecutionZone = pName;
        }
        // Register interaction event and connect execution zone with change detection.
        this.mExecutionZone.onInteraction = (_pZoneName, pFunction, pStacktrace) => {
            this.dispatchChangeEvent({ source: pFunction, property: 'apply', stacktrace: pStacktrace });
        };
        ChangeDetection.mZoneConnectedChangeDetections.set(this.mExecutionZone, this);
        // Set silent state. Convert null to false.
        this.mSilent = !!pSilent;
        // Catch global error, check if allocated zone is child of this change detection and report the error.
        const lErrorHandler = (pErrorEvent, pError) => {
            // Get change detection
            const lErrorZone = error_allocation_1.ErrorAllocation.getExecutionZoneOfError(pError);
            if (lErrorZone) {
                // Zone error has allways a ChangeDetection.
                const lChangeDetection = ChangeDetection.mZoneConnectedChangeDetections.get(lErrorZone);
                // Check if error change detection is child of the change detection.
                if (lChangeDetection.isChildOf(this)) {
                    // Suppress console error message if error should be suppressed
                    const lExecuteDefault = this.dispatchErrorEvent(pError);
                    if (!lExecuteDefault) {
                        pErrorEvent.preventDefault();
                    }
                }
            }
        };
        // Create error and rejection listener.
        this.mWindowErrorListener = (pEvent) => {
            lErrorHandler(pEvent, pEvent.error);
        };
        this.mWindowRejectionListener = (pEvent) => {
            const lPromise = pEvent.promise;
            const lPromiseZone = Reflect.get(lPromise, patcher_1.Patcher.PATCHED_PROMISE_ZONE_KEY);
            error_allocation_1.ErrorAllocation.allocateError(pEvent.reason, lPromiseZone);
            lErrorHandler(pEvent, pEvent.reason);
        };
        // Register global error listener.
        window.addEventListener('error', this.mWindowErrorListener);
        window.addEventListener('unhandledrejection', this.mWindowRejectionListener);
    }
    /**
     * Get current change detection.
     */
    static get current() {
        const lCurrentZone = execution_zone_1.ExecutionZone.current;
        let lCurrentChangeDetection = ChangeDetection.mZoneConnectedChangeDetections.get(lCurrentZone);
        // Initialize new change detection
        if (!lCurrentChangeDetection) {
            lCurrentChangeDetection = new ChangeDetection(lCurrentZone);
        }
        return lCurrentChangeDetection;
    }
    /**
     * Get current change detection.
     * Ignores all silent zones and returns next none silent zone.
     */
    static get currentNoneSilent() {
        let lCurrent = ChangeDetection.current;
        while (lCurrent?.isSilent) {
            lCurrent = lCurrent.mParent;
        }
        // There is allways an none silent zone.
        return lCurrent;
    }
    /**
     * Get original object from InteractionDetectionProxy-Proxy.
     * @param pObject - Possible ChangeDetectionProxy object.
     * @returns original object.
     */
    static getUntrackedObject(pObject) {
        return interaction_detection_proxy_1.InteractionDetectionProxy.getOriginal(pObject);
    }
    /**
     * If change detection is silent.
     */
    get isSilent() {
        return this.mSilent;
    }
    /**
     * Get change detection loose parent.
     * A parent not connected by change detection rather than zones.
     */
    get looseParent() {
        return this.mLooseParent;
    }
    /**
     * Get change detection name.
     */
    get name() {
        return this.mExecutionZone.name;
    }
    /**
     * Get change detection parent.
     */
    get parent() {
        return this.mParent;
    }
    /**
     * Add listener for change events.
     * @param pListener - Listener.
     */
    addChangeListener(pListener) {
        this.mChangeListenerList.push(pListener);
    }
    /**
     * Add listener for error events.
     * @param pListener - Listener.
     */
    addErrorListener(pListener) {
        this.mErrorListenerList.push(pListener);
    }
    /**
     * Create child detection that does not notice changes from parent.
     * Parent will notice any change inside child.
     * @param pName
     * @returns
     */
    createChildDetection(pName) {
        return new ChangeDetection(pName, this);
    }
    /**
     * Deconstruct change detection.
     */
    deconstruct() {
        // Register global error listener.
        window.removeEventListener('error', this.mWindowErrorListener);
        window.removeEventListener('unhandledrejection', this.mWindowRejectionListener);
    }
    /**
     * Trigger all change event.
     */
    dispatchChangeEvent(pReason) {
        // One trigger if change detection is not silent.
        if (!this.mSilent) {
            // Get current executing zone.
            const lCurrentChangeDetection = ChangeDetection.current;
            // Execute all listener in event target zone.
            lCurrentChangeDetection.execute(() => {
                this.callChangeListener(pReason);
                // Pass through change event to parent.
                this.mParent?.dispatchChangeEvent(pReason);
            });
        }
    }
    /**
     * Executes function in change detections execution zone.
     * Asynchron calls can only be detected if they are sheduled inside this zone.
     * Does not call change callback.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    execute(pFunction, ...pArgs) {
        return this.mExecutionZone.executeInZoneSilent(pFunction, ...pArgs);
    }
    /**
     * Register an object for change detection.
     * Returns proxy object that should be used to track changes.
     * @param pObject - Object or function.
     */
    registerObject(pObject) {
        // Get change trigger on all events.
        if (pObject instanceof EventTarget) {
            patcher_1.Patcher.patchObject(pObject, this.mExecutionZone);
        }
        // Create interaction proxy and send change and error event to this change detection.
        const lProxy = new interaction_detection_proxy_1.InteractionDetectionProxy(pObject);
        lProxy.onChange = (pSource, pProperty, pStacktrace) => {
            this.dispatchChangeEvent({ source: pSource, property: pProperty, stacktrace: pStacktrace });
        };
        return lProxy.proxy;
    }
    /**
     * Remove change event listener from change detection.
     * @param pListener - Listener.
     */
    removeChangeListener(pListener) {
        this.mChangeListenerList.remove(pListener);
    }
    /**
     * Remove error event listener from error detection.
     * @param pListener - Listener.
     */
    removeErrorListener(pListener) {
        this.mErrorListenerList.remove(pListener);
    }
    /**
     * Creates new silent zone and executes function.
     * Does not call change callback.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    silentExecution(pFunction, ...pArgs) {
        const lChangeDetection = new ChangeDetection(`${this.name}-SilentCD`, this, false, true);
        let lExecutionResult;
        try {
            lExecutionResult = lChangeDetection.execute(pFunction, ...pArgs);
        }
        finally {
            // Deconstruct change detection. Error events are not needed on temporary change detections.
            lChangeDetection.deconstruct();
        }
        return lExecutionResult;
    }
    /**
     * Call all registered change listener.
     */
    callChangeListener(pReason) {
        // Dispatch change event.
        for (const lListener of this.mChangeListenerList) {
            lListener(pReason);
        }
    }
    /**
     * Call all registered error listener.
     */
    callErrorListener(pError) {
        let lExecuteDefault = true;
        // Dispatch error event.
        for (const lListener of this.mErrorListenerList) {
            if (lListener(pError) === false) {
                lExecuteDefault = false;
            }
        }
        return lExecuteDefault;
    }
    /**
     * Trigger all change event.
     */
    dispatchErrorEvent(pError) {
        // Get current executing zone.
        const lCurrentChangeDetection = ChangeDetection.current;
        // Execute all listener in event target zone.
        return lCurrentChangeDetection.execute(() => {
            return this.callErrorListener(pError);
        });
    }
    /**
     * Check if this change detection is a child of another change detection.
     * @param pChangeDetection - Possible parent change detection.
     */
    isChildOf(pChangeDetection) {
        if (pChangeDetection === this) {
            return true;
        }
        return !!this.parent?.isChildOf(pChangeDetection);
    }
}
exports.ChangeDetection = ChangeDetection;
ChangeDetection.mZoneConnectedChangeDetections = new WeakMap();
//# sourceMappingURL=change-detection.js.map

/***/ }),

/***/ "../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/error-allocation.js":
/*!*****************************************************************************************************************!*\
  !*** ../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/error-allocation.js ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorAllocation = void 0;
/**
 * Allocates current error to its execution zone.
 */
class ErrorAllocation {
    /**
     * Allocate error with execution zone.
     * @param pError - Error data.
     * @param pExecutionZone - Zone of error.
     */
    static allocateError(pError, pExecutionZone) {
        ErrorAllocation.mExecutionZone = pExecutionZone;
        ErrorAllocation.mError = pError;
    }
    /**
     * Get execution zone of error.
     * @param pError - Error.
     */
    static getExecutionZoneOfError(pError) {
        if (pError === ErrorAllocation.mError) {
            return ErrorAllocation.mExecutionZone;
        }
        return null;
    }
}
exports.ErrorAllocation = ErrorAllocation;
//# sourceMappingURL=error-allocation.js.map

/***/ }),

/***/ "../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/execution-zone.js":
/*!***************************************************************************************************************!*\
  !*** ../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/execution-zone.js ***!
  \***************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExecutionZone = void 0;
const error_allocation_1 = __webpack_require__(/*! ./error-allocation */ "../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/error-allocation.js");
/**
 * Detects if registered object has possibly changed or any asynchron function inside this zone was executed.
 * Can' check for async and await
 */
class ExecutionZone {
    /**
     * Constructor.
     * Create new zone.
     * @param pZoneName - Name of zone.
     */
    constructor(pZoneName) {
        this.mName = pZoneName;
        this.mInteractionCallback = null;
    }
    /**
     * Current execution zone.
     */
    static get current() {
        return ExecutionZone.mCurrentZone;
    }
    /**
     * Name of zone.
     */
    get name() {
        return this.mName;
    }
    /**
     * Get change callback.
     */
    get onInteraction() {
        return this.mInteractionCallback;
    }
    /**
     * Set change callback.
     */
    set onInteraction(pInteractionCallback) {
        this.mInteractionCallback = pInteractionCallback;
    }
    /**
     * Executes function in this execution zone.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    executeInZone(pFunction, ...pArgs) {
        // Save current executing zone.
        const lLastZone = ExecutionZone.current;
        // Set this zone as execution zone and execute function.
        ExecutionZone.mCurrentZone = this;
        let lResult;
        // Try to execute
        try {
            lResult = pFunction(...pArgs);
        }
        catch (pError) {
            error_allocation_1.ErrorAllocation.allocateError(pError, this);
            throw pError;
        }
        finally {
            // Dispach change event.
            this.dispatchChangeEvent(this.mName, pFunction, Error().stack);
            // Reset to last zone.
            ExecutionZone.mCurrentZone = lLastZone;
        }
        return lResult;
    }
    /**
     * Executes function in this execution zone.
     * @param pFunction - Function.
     * @param pArgs - function execution arguments.
     */
    executeInZoneSilent(pFunction, ...pArgs) {
        // Save current executing zone.
        const lLastZone = ExecutionZone.current;
        // Set this zone as execution zone and execute function.
        ExecutionZone.mCurrentZone = this;
        let lResult;
        // Try to execute
        try {
            lResult = pFunction(...pArgs);
        }
        catch (pError) {
            error_allocation_1.ErrorAllocation.allocateError(pError, this);
            throw pError;
        }
        finally {
            // Reset to last zone.
            ExecutionZone.mCurrentZone = lLastZone;
        }
        return lResult;
    }
    /**
     * Dispatch change event.
     * @param pZoneName - Zone name.
     */
    dispatchChangeEvent(pZoneName, pFunction, pStacktrace) {
        // Call change callbacks.
        this.onInteraction?.(pZoneName, pFunction, pStacktrace);
    }
}
exports.ExecutionZone = ExecutionZone;
ExecutionZone.mCurrentZone = new ExecutionZone('Default');
//# sourceMappingURL=execution-zone.js.map

/***/ }),

/***/ "../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/patcher/event-names.js":
/*!********************************************************************************************************************!*\
  !*** ../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/patcher/event-names.js ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventNames = void 0;
class EventNames {
}
exports.EventNames = EventNames;
// eslint-disable-next-line @typescript-eslint/naming-convention
EventNames.EVENT_TARGET_PATCHED_KEY = Symbol('_Event_Target_Patched');
EventNames.changeCriticalEvents = ['input', 'change'];
EventNames.detailEventNames = ['toggle'];
EventNames.documentEventNames = [
    'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'freeze', 'fullscreenchange',
    'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
    'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
    'visibilitychange', 'resume'
];
EventNames.formEventNames = ['autocomplete', 'autocompleteerror'];
EventNames.frameEventNames = ['load'];
EventNames.frameSetEventNames = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'];
EventNames.globalEventHandlersEventNames = [
    'abort', 'animationcancel', 'animationend', 'animationiteration', 'auxclick', 'beforeinput', 'blur',
    'cancel', 'canplay', 'canplaythrough', 'change', 'compositionstart', 'compositionupdate',
    'compositionend', 'cuechange', 'click', 'close', 'contextmenu', 'curechange', 'dblclick', 'drag',
    'dragend', 'dragenter', 'dragexit', 'dragleave', 'dragover', 'drop', 'durationchange', 'emptied',
    'ended', 'error', 'focus', 'focusin', 'focusout', 'gotpointercapture', 'input', 'invalid', 'keydown',
    'keypress', 'keyup', 'load', 'loadstart', 'loadeddata', 'loadedmetadata', 'lostpointercapture',
    'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel',
    'orientationchange', 'pause', 'play', 'playing', 'pointercancel', 'pointerdown', 'pointerenter',
    'pointerleave', 'pointerlockchange', 'mozpointerlockchange', 'webkitpointerlockerchange',
    'pointerlockerror', 'mozpointerlockerror', 'webkitpointerlockerror', 'pointermove', 'pointout',
    'pointerover', 'pointerup', 'progress', 'ratechange', 'reset', 'resize', 'scroll', 'seeked', 'seeking',
    'select', 'selectionchange', 'selectstart', 'show', 'sort', 'stalled', 'submit', 'suspend', 'timeupdate',
    'volumechange', 'touchcancel', 'touchmove', 'touchstart', 'touchend', 'transitioncancel',
    'transitionend', 'waiting', 'wheel'
];
EventNames.htmlElementEventNames = [
    'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
    'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
    'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
];
EventNames.idbIndexEventNames = [
    'upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'
];
EventNames.marqueeEventNames = ['bounce', 'finish', 'start'];
EventNames.mediaElementEventNames = [
    'encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'
];
EventNames.notificationEventNames = ['click', 'show', 'error', 'close'];
EventNames.rtcPeerConnectionEventNames = [
    'connectionstatechange', 'datachannel', 'icecandidate', 'icecandidateerror',
    'iceconnectionstatechange', 'icegatheringstatechange', 'negotiationneeded', 'signalingstatechange', 'track'
];
EventNames.webglEventNames = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'];
EventNames.websocketEventNames = ['close', 'error', 'open', 'message'];
EventNames.windowEventNames = [
    'absolutedeviceorientation', 'afterinput', 'afterprint', 'appinstalled', 'beforeinstallprompt',
    'beforeprint', 'beforeunload', 'devicelight', 'devicemotion', 'deviceorientation',
    'deviceorientationabsolute', 'deviceproximity', 'hashchange', 'languagechange', 'message',
    'mozbeforepaint', 'offline', 'online', 'paint', 'pageshow', 'pagehide', 'popstate',
    'rejectionhandled', 'storage', 'unhandledrejection', 'unload', 'userproximity',
    'vrdisplyconnected', 'vrdisplaydisconnected', 'vrdisplaypresentchange'
];
EventNames.workerEventNames = ['error', 'message'];
EventNames.xmlHttpRequestEventNames = [
    'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
    'readystatechange'
];
// eslint-disable-next-line @typescript-eslint/member-ordering
EventNames.eventNames = [
    ...EventNames.globalEventHandlersEventNames, ...EventNames.webglEventNames,
    ...EventNames.formEventNames, ...EventNames.detailEventNames, ...EventNames.documentEventNames,
    ...EventNames.windowEventNames, ...EventNames.htmlElementEventNames
];
//# sourceMappingURL=event-names.js.map

/***/ }),

/***/ "../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/patcher/patcher.js":
/*!****************************************************************************************************************!*\
  !*** ../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/patcher/patcher.js ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Patcher = void 0;
const execution_zone_1 = __webpack_require__(/*! ../execution-zone */ "../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/execution-zone.js");
const event_names_1 = __webpack_require__(/*! ./event-names */ "../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/patcher/event-names.js");
class Patcher {
    /**
     * Patches functions and objects in global scope to track asynchron calls.
     * @param pGlobalObject - Global enviroment object
     */
    static patch(pGlobalObject) {
        if (!Patcher.mIsPatched) {
            Patcher.mIsPatched = true;
            const lPatcher = new Patcher();
            lPatcher.patchGlobals(pGlobalObject);
        }
    }
    /**
     * Listen on all event.
     * @param pObject - EventTarget.
     * @param pZone - Zone.
     */
    static patchObject(pObject, pZone) {
        pZone.executeInZoneSilent(() => {
            if (!(Patcher.EVENT_TARGET_PATCHED_KEY in pObject)) {
                // Add all events without function.
                for (const lEventName of event_names_1.EventNames.changeCriticalEvents) {
                    pObject.addEventListener(lEventName, () => { return; });
                }
                Reflect.set(pObject, Patcher.EVENT_TARGET_PATCHED_KEY, true);
            }
        });
    }
    /**
     * Patch class and its methods.
     * @param pConstructor - Class constructor.
     */
    patchClass(pConstructor) {
        // Skip undefined or not found constructor.
        if (typeof pConstructor !== 'function') {
            return pConstructor;
        }
        const lSelf = this;
        const lPrototype = pConstructor.prototype;
        // For each prototype property.
        for (const lClassMemberName of Object.getOwnPropertyNames(lPrototype)) {
            // Skip constructor.
            if (lClassMemberName === 'constructor') {
                continue;
            }
            const lDescriptor = Object.getOwnPropertyDescriptor(lPrototype, lClassMemberName);
            const lValue = lDescriptor.value;
            // Only try to patch methods.
            if (typeof lValue === 'function') {
                lPrototype[lClassMemberName] = this.patchFunctionParameter(lValue);
            }
        }
        // Save original promise.
        const lOriginalClass = pConstructor;
        // Extend class to path constructor.
        const lPatchedClass = class PatchedClass extends pConstructor {
            /**
             * Patch all arguments of constructor.
             * @param pArgs - Any argument.
             */
            constructor(...pArgs) {
                // Get zone.
                const lCurrentZone = execution_zone_1.ExecutionZone.current;
                for (let lArgIndex = 0; lArgIndex < pArgs.length; lArgIndex++) {
                    const lArgument = pArgs[lArgIndex];
                    // Patch all arguments that are function. 
                    if (typeof lArgument === 'function') {
                        const lOriginalParameterFunction = lArgument;
                        const lPatchedParameterFunction = lSelf.wrapFunctionInZone(lSelf.patchFunctionParameter(lArgument), lCurrentZone);
                        // Cross reference original and patched function.
                        Reflect.set(lPatchedParameterFunction, Patcher.ORIGINAL_FUNCTION_KEY, lOriginalParameterFunction);
                        Reflect.set(lOriginalParameterFunction, Patcher.PATCHED_FUNCTION_KEY, lPatchedParameterFunction);
                        pArgs[lArgIndex] = lPatchedParameterFunction;
                    }
                }
                super(...pArgs);
            }
        };
        // Add original class with symbol key.
        Reflect.set(lPatchedClass, Patcher.ORIGINAL_CLASS_KEY, lOriginalClass);
        return lPatchedClass;
    }
    /**
     * Patch EventTarget class for executing event listener in zone the listener was created.
     * Does not patch twice.
     * @param pGlobalObject - Global this object.
     */
    patchEventTarget(pGlobalObject) {
        const lProto = pGlobalObject.EventTarget.prototype;
        // Dont patch twice.
        if (!(Patcher.ORIGINAL_FUNCTION_KEY in lProto.addEventListener)) {
            // Add event
            lProto.addEventListener = this.patchFunctionParameter(lProto.addEventListener);
        }
        // Dont patch twice.
        if (!(Patcher.ORIGINAL_FUNCTION_KEY in lProto.removeEventListener)) {
            // Remove event.
            const lOriginalRemoveEventListener = lProto.removeEventListener;
            lProto.removeEventListener = function (pType, pCallback, pOptions) {
                const lPatchedCallback = Reflect.get(pCallback, Patcher.PATCHED_FUNCTION_KEY);
                lOriginalRemoveEventListener.call(this, pType, lPatchedCallback, pOptions);
            };
            // Cross reference original and patched function.
            Reflect.set(lProto.removeEventListener, Patcher.ORIGINAL_FUNCTION_KEY, lOriginalRemoveEventListener);
            Reflect.set(lOriginalRemoveEventListener, Patcher.PATCHED_FUNCTION_KEY, lProto.removeEventListener);
        }
    }
    /**
     * Wrap function so all callbacks gets executed inside the zone the function was called.
     * Saves original function with ORIGINAL_FUNCTION_KEY inside patched function.
     * Saves patched function with PATCHED_FUNCTION_KEY inside original function.
     * @param pFunction - Function.
     */
    patchFunctionParameter(pFunction) {
        const lSelf = this;
        const lPatchedFunction = function (...pArgs) {
            // Get zone.
            const lCurrentZone = execution_zone_1.ExecutionZone.current;
            for (let lArgIndex = 0; lArgIndex < pArgs.length; lArgIndex++) {
                const lArgument = pArgs[lArgIndex];
                // Patch all arguments that are function. 
                if (typeof lArgument === 'function') {
                    const lOriginalParameterFunction = lArgument;
                    const lPatchedParameterFunction = lSelf.wrapFunctionInZone(lSelf.patchFunctionParameter(lArgument), lCurrentZone);
                    // Cross reference original and patched function.
                    Reflect.set(lPatchedParameterFunction, Patcher.ORIGINAL_FUNCTION_KEY, lOriginalParameterFunction);
                    Reflect.set(lOriginalParameterFunction, Patcher.PATCHED_FUNCTION_KEY, lPatchedParameterFunction);
                    pArgs[lArgIndex] = lPatchedParameterFunction;
                }
            }
            return pFunction.call(this, ...pArgs);
        };
        // Cross reference original and patched function.
        Reflect.set(lPatchedFunction, Patcher.ORIGINAL_FUNCTION_KEY, pFunction);
        Reflect.set(pFunction, Patcher.PATCHED_FUNCTION_KEY, lPatchedFunction);
        return lPatchedFunction;
    }
    /**
     * Patches functions and objects in global scope to track asynchron calls.
     * @param pGlobalObject - Global enviroment object
     */
    patchGlobals(pGlobalObject) {
        // Timer
        pGlobalObject.requestAnimationFrame = this.patchFunctionParameter(pGlobalObject.requestAnimationFrame);
        pGlobalObject.setInterval = this.patchFunctionParameter(pGlobalObject.setInterval);
        pGlobalObject.setTimeout = this.patchFunctionParameter(pGlobalObject.setTimeout);
        // Promise
        pGlobalObject.Promise = this.patchPromise(pGlobalObject.Promise);
        // Observer
        pGlobalObject.ResizeObserver = this.patchClass(pGlobalObject.ResizeObserver);
        pGlobalObject.MutationObserver = this.patchClass(pGlobalObject.MutationObserver);
        pGlobalObject.IntersectionObserver = this.patchClass(pGlobalObject.IntersectionObserver);
        // Event target !!!before Pathing on events. 
        this.patchEventTarget(pGlobalObject);
        // Patch HTML elements
        /* istanbul ignore next */
        {
            this.patchOnProperties(pGlobalObject.XMLHttpRequestEventTarget?.prototype, event_names_1.EventNames.xmlHttpRequestEventNames);
            this.patchOnProperties(pGlobalObject.XMLHttpRequest?.prototype, event_names_1.EventNames.xmlHttpRequestEventNames);
            this.patchOnProperties(pGlobalObject, ['messageerror', ...event_names_1.EventNames.eventNames]);
            this.patchOnProperties(pGlobalObject.Document?.prototype, event_names_1.EventNames.eventNames);
            this.patchOnProperties(pGlobalObject.SVGElement?.prototype, event_names_1.EventNames.eventNames);
            this.patchOnProperties(pGlobalObject.Element?.prototype, event_names_1.EventNames.eventNames);
            this.patchOnProperties(pGlobalObject.HTMLElement?.prototype, event_names_1.EventNames.eventNames);
            this.patchOnProperties(pGlobalObject.HTMLMediaElement?.prototype, event_names_1.EventNames.mediaElementEventNames);
            this.patchOnProperties(pGlobalObject.HTMLFrameSetElement?.prototype, [...event_names_1.EventNames.windowEventNames, ...event_names_1.EventNames.frameSetEventNames]);
            this.patchOnProperties(pGlobalObject.HTMLBodyElement?.prototype, [...event_names_1.EventNames.windowEventNames, ...event_names_1.EventNames.frameSetEventNames]);
            this.patchOnProperties(pGlobalObject.HTMLFrameElement?.prototype, event_names_1.EventNames.frameEventNames);
            this.patchOnProperties(pGlobalObject.HTMLIFrameElement?.prototype, event_names_1.EventNames.frameEventNames);
            this.patchOnProperties(pGlobalObject.HTMLMarqueeElement?.prototype, event_names_1.EventNames.marqueeEventNames);
            // Worker.
            this.patchOnProperties(pGlobalObject.Worker && Worker?.prototype, event_names_1.EventNames.workerEventNames);
            // Index DB.
            this.patchOnProperties(pGlobalObject.IDBIndex?.prototype, event_names_1.EventNames.idbIndexEventNames);
            this.patchOnProperties(pGlobalObject.IDBRequest?.prototype, event_names_1.EventNames.idbIndexEventNames);
            this.patchOnProperties(pGlobalObject.IDBOpenDBRequest?.prototype, event_names_1.EventNames.idbIndexEventNames);
            this.patchOnProperties(pGlobalObject.IDBDatabase?.prototype, event_names_1.EventNames.idbIndexEventNames);
            this.patchOnProperties(pGlobalObject.IDBTransaction?.prototype, event_names_1.EventNames.idbIndexEventNames);
            this.patchOnProperties(pGlobalObject.IDBCursor?.prototype, event_names_1.EventNames.idbIndexEventNames);
            // Websocket.
            this.patchOnProperties(pGlobalObject.WebSocket?.prototype, event_names_1.EventNames.websocketEventNames);
            // Filereader
            this.patchOnProperties(pGlobalObject.FileReader?.prototype, event_names_1.EventNames.xmlHttpRequestEventNames);
            // Notification
            this.patchOnProperties(pGlobalObject.Notification?.prototype, event_names_1.EventNames.notificationEventNames);
            // RTCPeerConnection
            this.patchOnProperties(pGlobalObject.RTCPeerConnection?.prototype, event_names_1.EventNames.rtcPeerConnectionEventNames);
        }
        // HTMLCanvasElement.toBlob
        pGlobalObject.HTMLCanvasElement.prototype.toBlob = this.patchFunctionParameter(pGlobalObject.HTMLCanvasElement.prototype.toBlob);
    }
    /**
     * Patch every onproperty of XHR.
     * Does not patch twice.
     */
    patchOnProperties(pObject, pEventNames) {
        const lSelf = this;
        // Check for correct object type.
        if (typeof pObject !== 'object' || pObject === null) {
            return;
        }
        // Patch every event.
        for (const lEventName of pEventNames) {
            const lPropertyName = `on${lEventName}`;
            const lStorageKey = Patcher.ON_PROPERTY_FUNCTION_KEY.toString() + lPropertyName;
            const lPatchedFlag = Patcher.IS_PATCHED_FLAG_KEY.toString() + lPropertyName;
            // Skip if already patched.
            if (pObject[lPatchedFlag]) {
                continue;
            }
            const lDescriptorInformation = Object.getOwnPropertyDescriptor(pObject, lPropertyName);
            // if the descriptor not exists or is not configurable skip the property patch.
            if (!lDescriptorInformation || !lDescriptorInformation.configurable) {
                continue;
            }
            // Remove set value and writable flag to be able to add set and get.
            delete lDescriptorInformation.writable;
            delete lDescriptorInformation.value;
            lDescriptorInformation.set = function (pEventListener) {
                // Remove current added listener.
                if (typeof this[lStorageKey] === 'function') {
                    this.removeEventListener(lEventName, this[lStorageKey]);
                }
                if (typeof pEventListener === 'function') {
                    // Save new listener
                    this[lStorageKey] = lSelf.wrapFunctionInZone(pEventListener, execution_zone_1.ExecutionZone.current);
                    // Add new listener if defined.
                    this.addEventListener(lEventName, this[lStorageKey]);
                }
                else {
                    // Save whatever value this is.
                    this[lStorageKey] = pEventListener;
                }
            };
            lDescriptorInformation.get = function () {
                const lPatchedFunction = this[lStorageKey];
                if (typeof lPatchedFunction === 'function') {
                    return lPatchedFunction[Patcher.ORIGINAL_FUNCTION_KEY];
                }
                else {
                    return lPatchedFunction;
                }
            };
            Object.defineProperty(pObject, lPropertyName, lDescriptorInformation);
            pObject[lPatchedFlag] = true;
        }
    }
    /**
     * Patch promise.
     * @param pConstructor - Promise constructor.
     */
    patchPromise(pConstructor) {
        const lConstructor = this.patchClass(pConstructor);
        const lOriginalClass = Reflect.get(lConstructor, Patcher.ORIGINAL_CLASS_KEY);
        // Patch only the constructor.
        const lPatchedClass = class PatchedClass extends lConstructor {
            constructor(...pArgs) {
                super(...pArgs);
                // Get zone.
                const lCurrentZone = execution_zone_1.ExecutionZone.current;
                Reflect.set(this, Patcher.PATCHED_PROMISE_ZONE_KEY, lCurrentZone);
            }
        };
        // Add original class with symbol key.
        Reflect.set(lPatchedClass, Patcher.ORIGINAL_CLASS_KEY, lOriginalClass);
        return lPatchedClass;
    }
    /**
     * Patch function, so function gets always executed inside specified zone.
     * Saves original function with ORIGINAL_FUNCTION_KEY inside patched function.
     * Saves patched function with PATCHED_FUNCTION_KEY inside original function.
     * @param pFunction - Function.
     * @param pZone - Zone.
     */
    wrapFunctionInZone(pFunction, pZone) {
        const lPatchedFunction = function (...pArgs) {
            return pZone.executeInZone(pFunction, ...pArgs);
        };
        // Save original function
        Reflect.set(lPatchedFunction, Patcher.ORIGINAL_FUNCTION_KEY, pFunction);
        Reflect.set(pFunction, Patcher.PATCHED_FUNCTION_KEY, lPatchedFunction);
        return lPatchedFunction;
    }
}
exports.Patcher = Patcher;
// eslint-disable-next-line @typescript-eslint/naming-convention
Patcher.EVENT_TARGET_PATCHED_KEY = Symbol('_Event_Target_Patched');
// eslint-disable-next-line @typescript-eslint/naming-convention
Patcher.IS_PATCHED_FLAG_KEY = Symbol('_ObjectIsPatched');
// eslint-disable-next-line @typescript-eslint/naming-convention
Patcher.ON_PROPERTY_FUNCTION_KEY = Symbol('_PatchedOnPropertyFunctionKey');
// eslint-disable-next-line @typescript-eslint/naming-convention
Patcher.ORIGINAL_CLASS_KEY = Symbol('_OriginalClassKey');
// eslint-disable-next-line @typescript-eslint/naming-convention
Patcher.ORIGINAL_FUNCTION_KEY = Symbol('_OriginalFunctionKey');
// eslint-disable-next-line @typescript-eslint/naming-convention
Patcher.PATCHED_FUNCTION_KEY = Symbol('_PatchedFunctionKey');
// eslint-disable-next-line @typescript-eslint/naming-convention
Patcher.PATCHED_PROMISE_ZONE_KEY = Symbol('_PatchedPromiseZoneKey');
Patcher.mIsPatched = false;
//# sourceMappingURL=patcher.js.map

/***/ }),

/***/ "../kartoffelgames.web.change_detection/library/source/change_detection/synchron_tracker/interaction-detection-proxy.js":
/*!******************************************************************************************************************************!*\
  !*** ../kartoffelgames.web.change_detection/library/source/change_detection/synchron_tracker/interaction-detection-proxy.js ***!
  \******************************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InteractionDetectionProxy = void 0;
const change_detection_1 = __webpack_require__(/*! ../change-detection */ "../kartoffelgames.web.change_detection/library/source/change_detection/change-detection.js");
const patcher_1 = __webpack_require__(/*! ../execution_zone/patcher/patcher */ "../kartoffelgames.web.change_detection/library/source/change_detection/execution_zone/patcher/patcher.js");
class InteractionDetectionProxy {
    /**
     * Constructor.
     * Create observation
     * @param pTarget - Target object or function.
     * @param pChangeDetectionCallback
     */
    constructor(pTarget) {
        // Initialize values. Set to null as long as other wrapper was found. 
        this.mChangeCallback = null;
        this.mOriginalObject = null;
        this.mProxyObject = null;
        // Use already created wrapper if it exist.
        const lWrapper = InteractionDetectionProxy.getWrapper(pTarget);
        if (lWrapper) {
            return lWrapper;
        }
        // Create new wrapper.
        this.mOriginalObject = InteractionDetectionProxy.getOriginal(pTarget);
        // Create new proxy object.
        this.mProxyObject = this.createProxyObject(pTarget);
        // Create access to get the wrapper on the original object.
        const lSelf = this;
        Object.defineProperty(this.mOriginalObject, InteractionDetectionProxy.OBSERVER_ORIGINAL_KEY, {
            writable: false,
            value: lSelf,
            enumerable: false
        });
    }
    /**
     * Get original object from InteractionDetectionProxy-Proxy.
     * @param pProxy - Possible ChangeDetectionProxy object.
     */
    static getOriginal(pProxy) {
        let lOriginalValue;
        if (typeof pProxy === 'object' && pProxy !== null || typeof pProxy === 'function') {
            // Try to get Proxy wrapper.
            const lWrapper = InteractionDetectionProxy.getWrapper(pProxy);
            lOriginalValue = lWrapper?.mOriginalObject ?? pProxy;
        }
        else {
            // Value can't be a proxy object.
            lOriginalValue = pProxy;
        }
        return lOriginalValue;
    }
    /**
     * Get wrapper object of proxy.
     * @param pProxy - Proxy object.
     * @returns InteractionDetectionProxy or null if not a InteractionDetectionProxy-proxy.
     */
    static getWrapper(pProxy) {
        // Check if object is a InteractionDetectionProxy-proxy.
        const lDesciptor = Object.getOwnPropertyDescriptor(pProxy, InteractionDetectionProxy.OBSERVER_DESCRIPTOR_KEY);
        if (lDesciptor && lDesciptor.value instanceof InteractionDetectionProxy) {
            return lDesciptor.value;
        }
        // Check if object is the original but has the proxys information.
        const lWrapper = Reflect.get(pProxy, InteractionDetectionProxy.OBSERVER_ORIGINAL_KEY);
        if (lWrapper) {
            return lWrapper;
        }
        return undefined;
    }
    /**
     * Get change callback.
     */
    get onChange() {
        return this.mChangeCallback;
    }
    /**
     * Set change callback.
     */
    set onChange(pChangeCallback) {
        this.mChangeCallback = pChangeCallback;
    }
    /**
     * Get proxy object for target.
     */
    get proxy() {
        return this.mProxyObject;
    }
    /**
     * Create change detection proxy from object.
     * @param pTarget - Target object.
     */
    createProxyObject(pTarget) {
        const lSelf = this;
        // Create proxy handler.
        const lProxyObject = new Proxy(pTarget, {
            /**
             * Add property to object.
             * Triggers change event.
             * @param pTargetObject - Target object.
             * @param pTarget - Original object.
             * @param pPropertyName - Name of property.
             */
            set(pTargetObject, pPropertyName, pNewPropertyValue) {
                const lResult = Reflect.set(pTargetObject, pPropertyName, pNewPropertyValue);
                lSelf.dispatchChangeEvent(pTargetObject, pPropertyName, Error().stack);
                return lResult;
            },
            /**
             * Get property from object.
             * Returns Proxy element on function or object type.
             * @param pTarget - The target object.
             * @param pProperty - The name or Symbol  of the property to get.
             * @param lReceiver - Either the proxy or an object that inherits from the proxy.
             */
            get(pTarget, pProperty, _pReceiver) {
                const lResult = Reflect.get(pTarget, pProperty);
                if (typeof lResult === 'object' && lResult !== null || typeof lResult === 'function') {
                    const lProxy = new InteractionDetectionProxy(lResult);
                    lProxy.onChange = (pSourceObject, pProperty) => {
                        lSelf.dispatchChangeEvent(pSourceObject, pProperty, Error().stack);
                    };
                    return lProxy.proxy;
                }
                else {
                    return lResult;
                }
            },
            /**
             * Remove property from object.
             * @param pTarget - Original object.
             * @param pPropertyName - Name of property.
             */
            deleteProperty(pTargetObject, pPropertyName) {
                Reflect.deleteProperty(pTargetObject, pPropertyName);
                lSelf.dispatchChangeEvent(pTargetObject, pPropertyName, Error().stack);
                return true;
            },
            /**
             * Called on function call.
             * @param pTargetObject - Function that was called.
             * @param pThisArgument - This argument of call.
             * @param pArgumentsList - All arguments of call.
             */
            apply(pTargetObject, pThisArgument, pArgumentsList) {
                const lOriginalThisObject = InteractionDetectionProxy.getOriginal(pThisArgument);
                let lResult;
                let lFunctionResult;
                // Execute function and dispatch change event on synchron exceptions.
                try {
                    lFunctionResult = pTargetObject.call(lOriginalThisObject, ...pArgumentsList);
                }
                catch (e) {
                    lSelf.dispatchChangeEvent(lOriginalThisObject, pTargetObject, Error().stack);
                    throw e;
                }
                // Get original promise constructor.
                let lPromiseConstructor = Promise;
                /* istanbul ignore next */
                while (patcher_1.Patcher.ORIGINAL_CLASS_KEY in lPromiseConstructor) {
                    lPromiseConstructor = Reflect.get(lPromiseConstructor, patcher_1.Patcher.ORIGINAL_CLASS_KEY);
                }
                // Override possible system promise. 
                if (lFunctionResult instanceof lPromiseConstructor) {
                    lResult = new globalThis.Promise((pResolve, pReject) => {
                        // Can't call finally because wrong execution queue.
                        // Wrong: await THIS() -> Code after THIS() -> Dispatched Event.
                        // Right: await THIS() -> Dispatched Event -> Code after THIS().
                        lFunctionResult.then((pResult) => {
                            lSelf.dispatchChangeEvent(lOriginalThisObject, pTargetObject, Error().stack);
                            pResolve(pResult);
                        }).catch((pReason) => {
                            lSelf.dispatchChangeEvent(lOriginalThisObject, pTargetObject, Error().stack);
                            pReject(pReason);
                        });
                    });
                }
                else {
                    lSelf.dispatchChangeEvent(lOriginalThisObject, pTargetObject, Error().stack);
                    lResult = lFunctionResult;
                }
                return lResult;
            },
            /**
             * Get ObjectDescriptor from object.
             * @param pTargetObject - Original object.
             * @param pPropertyName - Name of property.
             */
            getOwnPropertyDescriptor(pTargetObject, pPropertyName) {
                // Get "fake" descriptor containing this observer.
                if (pPropertyName === InteractionDetectionProxy.OBSERVER_DESCRIPTOR_KEY) {
                    return { configurable: true, enumerable: true, value: lSelf };
                }
                // Get real object descriptor.
                return Object.getOwnPropertyDescriptor(pTargetObject, pPropertyName);
            }
        });
        return lProxyObject;
    }
    /**
     * Trigger change event.
     */
    dispatchChangeEvent(pSourceObject, pProperty, pStacktrace) {
        // Only trigger if current change detection is not silent.
        if (!change_detection_1.ChangeDetection.current.isSilent) {
            this.onChange?.(pSourceObject, pProperty, pStacktrace);
        }
    }
}
exports.InteractionDetectionProxy = InteractionDetectionProxy;
// Descriptor key for the fake descriptor.
// eslint-disable-next-line @typescript-eslint/naming-convention
InteractionDetectionProxy.OBSERVER_DESCRIPTOR_KEY = Symbol('ChangeDetectionProxyDescriptor');
// eslint-disable-next-line @typescript-eslint/naming-convention
InteractionDetectionProxy.OBSERVER_ORIGINAL_KEY = Symbol('ChangeDetectionProxyWrapper');
//# sourceMappingURL=interaction-detection-proxy.js.map

/***/ }),

/***/ "../kartoffelgames.web.change_detection/library/source/comparison/compare-handler.js":
/*!*******************************************************************************************!*\
  !*** ../kartoffelgames.web.change_detection/library/source/comparison/compare-handler.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CompareHandler = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const interaction_detection_proxy_1 = __webpack_require__(/*! ../change_detection/synchron_tracker/interaction-detection-proxy */ "../kartoffelgames.web.change_detection/library/source/change_detection/synchron_tracker/interaction-detection-proxy.js");
/**
 * Handler for comparing different values.
 */
class CompareHandler {
    /**
     * Constructor.
     * Create Compare that deep compares values up to specified depth.
     * @param pValue - Current value.
     * @param pMaxComparisonDepth - [Default: 4]. Maximal depth for object and array comparison.
     */
    constructor(pValue, pMaxComparisonDepth = 4) {
        // Get original value to trigger no proxy change detection.
        const lOriginalValue = interaction_detection_proxy_1.InteractionDetectionProxy.getOriginal(pValue);
        this.mCompareMemory = new core_data_1.Dictionary();
        this.mCloneMemory = new core_data_1.Dictionary();
        this.mMaxDepth = pMaxComparisonDepth;
        this.mCurrentValue = this.cloneValue(lOriginalValue, 0);
    }
    /**
     * Compare value with internal value.
     * @param pValue - New value.
     */
    compare(pValue) {
        // Get original value to trigger no proxy change detection.
        const lOriginalNewValue = interaction_detection_proxy_1.InteractionDetectionProxy.getOriginal(pValue);
        // Compare value.
        const lCompareResult = this.compareValue(lOriginalNewValue, this.mCurrentValue, 0);
        // Clear compare memory.
        this.mCompareMemory.clear();
        return lCompareResult;
    }
    /**
     * Compares the last value and the new value.
     * If the new value has changed, the last value is overriden with the new one.
     * @param pNewValue - New value.
     * @returns is the last and the new value are the same.
     */
    compareAndUpdate(pNewValue) {
        // Compare
        const lIsSame = this.compare(pNewValue);
        // Update only if value is not the same.
        if (!lIsSame) {
            this.update(pNewValue);
        }
        return lIsSame;
    }
    /**
     * Update internal value.
     * Clones value.
     * @param pValue - New Value.
     */
    update(pValue) {
        // Get original value to trigger no proxy change detection.
        const lOriginalNewValue = interaction_detection_proxy_1.InteractionDetectionProxy.getOriginal(pValue);
        this.mCurrentValue = this.cloneValue(lOriginalNewValue, 0);
        // Clear clone memory.
        this.mCloneMemory.clear();
    }
    /**
     * Depp clone array. Till max depth is reached.
     * @param pValue - Array.
     * @param pCurrentDepth - Current depth of cloning.
     * @returns deep cloned array.
     */
    cloneArray(pValue, pCurrentDepth) {
        const lClonedArray = new Array();
        // Do not clone nested parent values again.
        // Fails for a fraction of cases.
        if (this.mCloneMemory.has(pValue)) {
            return this.mCloneMemory.get(pValue);
        }
        else {
            this.mCloneMemory.set(pValue, lClonedArray);
        }
        // Clone items only if max depth not reached.
        if (pCurrentDepth < this.mMaxDepth) {
            for (const lItem of pValue) {
                lClonedArray.push(this.cloneValue(lItem, pCurrentDepth + 1));
            }
        }
        return lClonedArray;
    }
    /**
     * Depp clone object. Till max depth is reached.
     * @param pValue - Object.
     * @param pCurrentDepth - Current depth of cloning.
     * @returns deep cloned object.
     */
    cloneObject(pValue, pCurrentDepth) {
        const lObjectClone = {};
        // Do not clone nested parent values again.
        // Fails for a fraction of cases.
        if (this.mCloneMemory.has(pValue)) {
            return this.mCloneMemory.get(pValue);
        }
        else {
            this.mCloneMemory.set(pValue, lObjectClone);
        }
        // Clone items only if max depth not reached.
        if (pCurrentDepth < this.mMaxDepth) {
            for (const lKey in pValue) {
                lObjectClone[lKey] = this.cloneValue(pValue[lKey], pCurrentDepth + 1);
            }
        }
        return lObjectClone;
    }
    /**
     * Deep clone value till max depth is reached.
     * @param pValue - Value to clone.
     * @param pCurrentDepth - Current depth of cloning.
     * @returns cloned value. Does not clone instances ot functions.
     */
    cloneValue(pValue, pCurrentDepth) {
        // Check if value is object.
        if (typeof pValue === 'object' && pValue !== null) {
            if (Array.isArray(pValue)) {
                return this.cloneArray(pValue, pCurrentDepth);
            }
            else { // Is object
                // Don't clone html elements.
                if (pValue instanceof Node) {
                    return pValue;
                }
                else {
                    return this.cloneObject(pValue, pCurrentDepth);
                }
            }
        }
        else if (typeof pValue === 'function') {
            return pValue;
        }
        else {
            // return simple value. Number, String, Function, Boolean, Undefined.
            return pValue;
        }
    }
    /**
     * Compare two arrays and their keys.
     * @param pNewValue - New value.
     * @param pLastValue - Old saved value.
     * @param pCurrentDepth - Current depth of comparison.
     * @returns if arrays are same.
     */
    compareArray(pNewValue, pLastValue, pCurrentDepth) {
        // Check same item count.
        if (pNewValue.length !== pLastValue.length) {
            return false;
        }
        // Do not compare nested parent values again.
        // Fails for a fraction of cases.
        if (this.mCompareMemory.has(pNewValue)) {
            return true;
        }
        else {
            this.mCompareMemory.set(pNewValue, true);
        }
        // Compare each key.
        for (let lIndex = 0; lIndex < pNewValue.length; lIndex++) {
            if (!this.compareValue(pNewValue[lIndex], pLastValue[lIndex], pCurrentDepth + 1)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Compare two objects and their keys.
     * @param pNewValue - New value.
     * @param pLastValue - Old saved value.
     * @param pCurrentDepth - Current depth of comparison.
     * @returns if object are same.
     */
    compareObject(pNewValue, pLastValue, pCurrentDepth) {
        // Check same property count.
        if (Object.keys(pNewValue).length !== Object.keys(pLastValue).length) {
            return false;
        }
        // Ignore HTMLElements.
        if (pNewValue instanceof Node || pLastValue instanceof Node) {
            return pNewValue === pLastValue;
        }
        // Do not compare nested parent values again.
        // Fails for a fraction of cases.
        if (this.mCompareMemory.has(pNewValue)) {
            return true;
        }
        else {
            this.mCompareMemory.set(pNewValue, true);
        }
        // Compare each key.
        for (const lKey in pNewValue) {
            const lNewValue = Reflect.get(pNewValue, lKey);
            const lLastValue = Reflect.get(pLastValue, lKey);
            if (!this.compareValue(lNewValue, lLastValue, pCurrentDepth + 1)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Compare two values and return if they are the same.
     * @param lOriginalNewValue - New value.
     * @param lOriginalCurrentValue - Old saved value.
     * @param pCurrentDepth - Current depth of comparison.
     * @returns if object are same.
     */
    compareValue(pNewValue, pLastValue, pCurrentDepth) {
        // Check type.
        if (typeof pNewValue !== typeof pLastValue || pNewValue === null && pLastValue !== null || pNewValue !== null && pLastValue === null) {
            return false;
        }
        // Check if both are simple or object values.
        if (typeof pNewValue === 'object' && pNewValue !== null) {
            if (Array.isArray(pNewValue)) {
                // Check if both are arrays.
                if (!Array.isArray(pLastValue)) {
                    return false;
                }
                // Only proceed if max depth not reached.
                if (pCurrentDepth < this.mMaxDepth) {
                    return this.compareArray(pNewValue, pLastValue, pCurrentDepth);
                }
                else {
                    return true;
                }
            }
            else { // Is object
                // Check if both are not arrays..
                if (Array.isArray(pLastValue)) {
                    return false;
                }
                // Only proceed if max depth not reached.
                if (pCurrentDepth < this.mMaxDepth) {
                    return this.compareObject(pNewValue, pLastValue, pCurrentDepth);
                }
                else {
                    return true;
                }
            }
        }
        else if (typeof pNewValue === 'function') {
            return pNewValue === pLastValue;
        }
        else {
            // Check simple value. Number, String, Function, Boolean, Undefined.
            return pNewValue === pLastValue;
        }
    }
}
exports.CompareHandler = CompareHandler;
//# sourceMappingURL=compare-handler.js.map

/***/ }),

/***/ "../kartoffelgames.web.change_detection/library/source/comparison/difference-search.js":
/*!*********************************************************************************************!*\
  !*** ../kartoffelgames.web.change_detection/library/source/comparison/difference-search.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangeState = exports.DifferenceSearch = void 0;
class DifferenceSearch {
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
exports.DifferenceSearch = DifferenceSearch;
var ChangeState;
(function (ChangeState) {
    ChangeState[ChangeState["Remove"] = 1] = "Remove";
    ChangeState[ChangeState["Insert"] = 2] = "Insert";
    ChangeState[ChangeState["Keep"] = 3] = "Keep";
})(ChangeState = exports.ChangeState || (exports.ChangeState = {}));
//# sourceMappingURL=difference-search.js.map

/***/ }),

/***/ "../kartoffelgames.web.change_detection/library/source/index.js":
/*!**********************************************************************!*\
  !*** ../kartoffelgames.web.change_detection/library/source/index.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChangeState = exports.DifferenceSearch = exports.ChangeDetection = exports.CompareHandler = void 0;
var compare_handler_1 = __webpack_require__(/*! ./comparison/compare-handler */ "../kartoffelgames.web.change_detection/library/source/comparison/compare-handler.js");
Object.defineProperty(exports, "CompareHandler", ({ enumerable: true, get: function () { return compare_handler_1.CompareHandler; } }));
var change_detection_1 = __webpack_require__(/*! ./change_detection/change-detection */ "../kartoffelgames.web.change_detection/library/source/change_detection/change-detection.js");
Object.defineProperty(exports, "ChangeDetection", ({ enumerable: true, get: function () { return change_detection_1.ChangeDetection; } }));
// Difference search
var difference_search_1 = __webpack_require__(/*! ./comparison/difference-search */ "../kartoffelgames.web.change_detection/library/source/comparison/difference-search.js");
Object.defineProperty(exports, "DifferenceSearch", ({ enumerable: true, get: function () { return difference_search_1.DifferenceSearch; } }));
Object.defineProperty(exports, "ChangeState", ({ enumerable: true, get: function () { return difference_search_1.ChangeState; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/builder/base-builder.js":
/*!*************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/builder/base-builder.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseBuilder = void 0;
const content_manager_1 = __webpack_require__(/*! ../content/content-manager */ "../kartoffelgames.web.potato_web_builder/library/source/component/content/content-manager.js");
const layer_values_1 = __webpack_require__(/*! ../values/layer-values */ "../kartoffelgames.web.potato_web_builder/library/source/component/values/layer-values.js");
/**
 * Builder helper that builds and updates content of component.
 */
class BaseBuilder {
    /**
     * Constructor.
     * Builder helper that builds and updates content of component.
     * @param pComponentContent - Component content.
     * @param pParentLayerValues - New component values.
     * @param pManipulatorScope - If builder is inside an manipulator scope.
     */
    constructor(pTemplate, pShadowParent, pModules, pParentLayerValues, pParentBuilder) {
        this.mShadowParent = pShadowParent;
        this.mParentBuilder = pParentBuilder;
        // Clone template and connect to shadow parent.
        const lTemplateClone = pTemplate.clone();
        lTemplateClone.parent = this.shadowParent;
        this.mTemplate = pTemplate;
        // Create new layer of values.
        this.mComponentValues = new layer_values_1.LayerValues(pParentLayerValues);
        const lPrefix = this.isMultiplicator() ? 'MULTIPLICATE' : 'STATIC';
        this.mContentManager = new content_manager_1.ContentManager(pModules, lPrefix);
    }
    /**
     * Content anchor for later appending build and initilised elements on this place.
     */
    get anchor() {
        return this.mContentManager.anchor;
    }
    /**
     * Get boundary of builder. Top and bottom element of builder.
     */
    get boundary() {
        return this.mContentManager.getBoundary();
    }
    /**
     * Content template.
     */
    get template() {
        return this.mTemplate;
    }
    /**
     * Get component values of builder.
     */
    get values() {
        return this.mComponentValues;
    }
    /**
     * Get component content of builder.
     */
    get contentManager() {
        return this.mContentManager;
    }
    /**
     * If builder is inside an manipulator scope.
     */
    get inManipulatorScope() {
        if (this.isMultiplicator()) {
            return true;
        }
        else if (!this.mParentBuilder) {
            return false;
        }
        else {
            return this.mParentBuilder.inManipulatorScope;
        }
    }
    /**
     * Shadow parent of all template elements.
     * Not actuall parent for
     */
    get shadowParent() {
        return this.mShadowParent;
    }
    /**
     * Cleanup all modules, content and anchor.
     * Builder is unuseable after this.
     */
    deconstruct() {
        this.contentManager.deconstruct();
    }
    /**
     * Update content based on changed property.
     */
    update() {
        // Update this builder.
        let lUpdated = this.onUpdate();
        // Update all child builder and keep updated true state.
        for (const lBuilder of this.contentManager.childBuilderList) {
            lUpdated = lBuilder.update() || lUpdated;
        }
        return lUpdated;
    }
}
exports.BaseBuilder = BaseBuilder;
//# sourceMappingURL=base-builder.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/builder/multiplicator-builder.js":
/*!**********************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/builder/multiplicator-builder.js ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MultiplicatorBuilder = void 0;
const web_change_detection_1 = __webpack_require__(/*! @kartoffelgames/web.change-detection */ "../kartoffelgames.web.change_detection/library/source/index.js");
const base_builder_1 = __webpack_require__(/*! ./base-builder */ "../kartoffelgames.web.potato_web_builder/library/source/component/builder/base-builder.js");
const static_builder_1 = __webpack_require__(/*! ./static-builder */ "../kartoffelgames.web.potato_web_builder/library/source/component/builder/static-builder.js");
class MultiplicatorBuilder extends base_builder_1.BaseBuilder {
    /**
     * Constructor.
     * @param pTemplate - Template.
     * @param pShadowParent - Shadow parent html element.
     * @param pModules - Attribute modules.
     * @param pParentLayerValues -
     * @param pParentBuilder
     */
    constructor(pTemplate, pShadowParent, pModules, pParentLayerValues, pParentBuilder) {
        super(pTemplate, pShadowParent, pModules, pParentLayerValues, pParentBuilder);
    }
    /**
     * If builder is multiplicator.
     */
    isMultiplicator() {
        return true;
    }
    /**
     * Update content dependent on temporar value.
     */
    onUpdate() {
        // Create multiplicator module if is does not exist.
        if (!this.contentManager.multiplicatorModule) {
            const lTemplate = this.template;
            // Create module and save inside. Allways has existing module bc. can only be called with found multiplicator module.
            const lManipulatorModule = this.contentManager.modules.getElementMultiplicatorModule(lTemplate, this.values);
            this.contentManager.multiplicatorModule = lManipulatorModule;
        }
        // Call module update.
        const lModuleResult = this.contentManager.multiplicatorModule.update();
        if (lModuleResult) {
            // Add shadow parent to all module results.
            for (const lResult of lModuleResult.elementList) {
                lResult.template.parent = this.shadowParent;
            }
            // Get current StaticBuilder. Only content are static builder.
            const lOldStaticBuilderList = this.contentManager.rootElementList;
            // Update content and save new added builder.
            this.updateStaticBuilder(lOldStaticBuilderList, lModuleResult.elementList);
        }
        // No need to report any update.
        // New static builder are always updating.
        return false;
    }
    /**
     * Insert new content after last found content.
     * @param pNewContent - New content.
     * @param pLastContent - Last content that comes before new content.
     */
    insertNewContent(pNewContent, pLastContent) {
        // Create new static builder.
        const lStaticBuilder = new static_builder_1.StaticBuilder(pNewContent.template, this.shadowParent, this.contentManager.modules, pNewContent.componentValues, this);
        // Prepend content if no content is before the new content. 
        if (pLastContent === null) {
            this.contentManager.prepend(lStaticBuilder);
        }
        else {
            // Append after content that is before the new content. Obviously -,-
            this.contentManager.after(lStaticBuilder, pLastContent);
        }
        return lStaticBuilder;
    }
    /**
     * Update content of manipulator builder.
     * @param pNewContentList - New content list.
     * @param pOldContentList - Old content list.
     */
    updateStaticBuilder(pOldContentList, pNewContentList) {
        // Define difference search.
        const lDifferenceSearch = new web_change_detection_1.DifferenceSearch((pA, pB) => {
            return pB.componentValues.equal(pA.values) && pB.template.equals(pA.template);
        });
        // Get differences of old an new content.
        const lDifferenceList = lDifferenceSearch.differencesOf(pOldContentList, pNewContentList);
        let lLastContent = null;
        for (const lHistoryItem of lDifferenceList) {
            // Update, Remove or do nothing with static builder depended on change state.
            if (lHistoryItem.changeState === web_change_detection_1.ChangeState.Keep) {
                lLastContent = lHistoryItem.item;
            }
            else if (lHistoryItem.changeState === web_change_detection_1.ChangeState.Remove) {
                this.contentManager.remove(lHistoryItem.item);
            }
            else { // if (lHistoryItem.changeState === ChangeState.Insert)
                // Create new static builder, insert after last content.
                lLastContent = this.insertNewContent(lHistoryItem.item, lLastContent);
            }
        }
    }
}
exports.MultiplicatorBuilder = MultiplicatorBuilder;
//# sourceMappingURL=multiplicator-builder.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/builder/static-builder.js":
/*!***************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/builder/static-builder.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StaticBuilder = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const core_xml_1 = __webpack_require__(/*! @kartoffelgames/core.xml */ "../kartoffelgames.core.xml/library/source/index.js");
const static_module_1 = __webpack_require__(/*! ../../module/static-module */ "../kartoffelgames.web.potato_web_builder/library/source/module/static-module.js");
const element_creator_1 = __webpack_require__(/*! ../content/element-creator */ "../kartoffelgames.web.potato_web_builder/library/source/component/content/element-creator.js");
const base_builder_1 = __webpack_require__(/*! ./base-builder */ "../kartoffelgames.web.potato_web_builder/library/source/component/builder/base-builder.js");
const multiplicator_builder_1 = __webpack_require__(/*! ./multiplicator-builder */ "../kartoffelgames.web.potato_web_builder/library/source/component/builder/multiplicator-builder.js");
class StaticBuilder extends base_builder_1.BaseBuilder {
    /**
     * Constructor.
     * @param pTemplate - Template.
     * @param pShadowParent - Shadow parent html element.
     * @param pModules - Attribute modules.
     * @param pParentLayerValues -
     * @param pParentBuilder
     */
    constructor(pTemplate, pShadowParent, pModules, pParentLayerValues, pParentBuilder) {
        super(pTemplate, pShadowParent, pModules, pParentLayerValues, pParentBuilder);
        // Not initialized on start.
        this.mInitialized = false;
    }
    /**
     * Build template with multiplicator module.
     * Creates a new multiplicator builder and append to content.
     * @param pMultiplicatorTemplate - Template with multiplicator module.
     * @param pParentHtmlElement - Build parent element of template.
     * @param pShadowParent - Parent template element that is loosly linked as parent.
     */
    buildMultiplicatorTemplate(pMultiplicatorTemplate, pParentHtmlElement, pShadowParent) {
        // Create new component builder and add to content.
        const lMultiplicatorBuilder = new multiplicator_builder_1.MultiplicatorBuilder(pMultiplicatorTemplate, pShadowParent, this.contentManager.modules, this.values, this);
        this.contentManager.append(lMultiplicatorBuilder, pParentHtmlElement);
    }
    /**
     * Build static template.
     * Create and link all modules.
     * @param pElementTemplate - Element template.
     * @param pParentHtmlElement - Parent of template.
     */
    buildStaticTemplate(pElementTemplate, pParentHtmlElement) {
        // Build element.
        const lHtmlNode = element_creator_1.ElementCreator.createElement(pElementTemplate);
        // Every attribute is a module. Even text attributes without any any expression.
        for (const lModule of this.contentManager.modules.getElementStaticModules(pElementTemplate, lHtmlNode, this.values)) {
            // Check if module is allowd in current scope.
            if (this.inManipulatorScope && lModule.moduleDefinition.forbiddenInManipulatorScopes) {
                throw new core_data_1.Exception(`Module ${lModule.moduleDefinition.selector.source} is forbidden inside manipulator scopes.`, this);
            }
            // Link modules.
            this.contentManager.linkModule(lModule, lHtmlNode);
        }
        // Append element to parent.
        this.contentManager.append(lHtmlNode, pParentHtmlElement);
        // Build childs.
        this.buildTemplate(pElementTemplate.childList, lHtmlNode, pElementTemplate);
    }
    /**
     * Build text template and append to parent.
     * @param pTextTemplate - Text template.
     * @param pParentHtmlElement - Build parent element of template.
     */
    buildTextTemplate(pTextTemplate, pParentHtmlElement) {
        // Create and process expression module, append text node to content.
        const lHtmlNode = element_creator_1.ElementCreator.createText('');
        // Create and link expression module, link only if text has any expression.
        const lExpressionModule = this.contentManager.modules.getTextExpressionModule(pTextTemplate, lHtmlNode, this.values);
        this.contentManager.linkModule(lExpressionModule, lHtmlNode);
        // Append text to parent.
        this.contentManager.append(lHtmlNode, pParentHtmlElement);
    }
    /**
     * If builder is multiplicator.
     */
    isMultiplicator() {
        return false;
    }
    /**
     * Update static builder.
     */
    onUpdate() {
        if (!this.mInitialized) {
            this.mInitialized = true;
            this.buildTemplate([this.template]);
        }
        // Get all modules.
        const lModuleList = this.contentManager.linkedModuleList;
        // Sort by write->readwrite->read->expression and update.
        lModuleList.sort((pModuleA, pModuleB) => {
            // "Calculate" execution priority of module A.
            let lCompareValueA;
            if (pModuleA instanceof static_module_1.StaticModule) {
                if (pModuleA.isWriting && !pModuleA.isReading) {
                    lCompareValueA = 4;
                }
                else if (pModuleA.isWriting && pModuleA.isReading) {
                    lCompareValueA = 3;
                }
                else { // if (!pModuleA.isWriting && pModuleA.isReading) {
                    lCompareValueA = 2;
                }
            }
            else { // Expression
                lCompareValueA = 1;
            }
            // "Calculate" execution priority of module A.
            let lCompareValueB;
            if (pModuleB instanceof static_module_1.StaticModule) {
                if (pModuleB.isWriting && !pModuleB.isReading) {
                    lCompareValueB = 4;
                }
                else if (pModuleB.isWriting && pModuleB.isReading) {
                    lCompareValueB = 3;
                }
                else { // if (!pModuleB.isWriting && pModuleB.isReading) 
                    lCompareValueB = 2;
                }
            }
            else {
                lCompareValueB = 1;
            }
            return lCompareValueA - lCompareValueB;
        });
        let lUpdated = false;
        for (const lModule of lModuleList) {
            lUpdated = lModule.update() || lUpdated;
        }
        return lUpdated;
    }
    /**
     * Build template. Creates and link modules.
     * @param pTemplateNodeList - Template node list.
     * @param pParentElement - Parent element of templates.
     */
    buildTemplate(pTemplateNodeList, pParentElement = null, pShadowParent = null) {
        // Get shadow parent of template nodes.
        // Use builder shadow parent is template is a root node.
        let lShadowParent = pShadowParent;
        if (lShadowParent === null) {
            lShadowParent = this.shadowParent;
        }
        // Create each template.
        for (const lTemplateNode of pTemplateNodeList) {
            /* istanbul ignore else */
            if (lTemplateNode instanceof core_xml_1.XmlDocument) {
                // Ignore documents just process body.
                this.buildTemplate(lTemplateNode.body, pParentElement, lTemplateNode);
            }
            else if (lTemplateNode instanceof core_xml_1.TextNode) {
                this.buildTextTemplate(lTemplateNode, pParentElement);
            }
            else if (lTemplateNode instanceof core_xml_1.XmlElement) {
                // Differentiate between static and multiplicator templates.
                const lMultiplicatorAttribute = this.contentManager.modules.getMultiplicatorAttribute(lTemplateNode);
                if (lMultiplicatorAttribute) {
                    this.buildMultiplicatorTemplate(lTemplateNode, pParentElement, lShadowParent);
                }
                else {
                    this.buildStaticTemplate(lTemplateNode, pParentElement);
                }
            }
            // Ignore comments.
        }
    }
}
exports.StaticBuilder = StaticBuilder;
//# sourceMappingURL=static-builder.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/component-connection.js":
/*!*************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/component-connection.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentConnection = void 0;
class ComponentConnection {
    /**
     * Get connected component manager of object.
     * Supported types are HTMLElements or UserObjects.
     * @param pObject - Instace that is connected to
     * @returns
     */
    static componentManagerOf(pObject) {
        return ComponentConnection.mComponentManagerConnections.get(pObject);
    }
    /**
     * Connect instance with component manager.
     * @param pObject - Instance.
     * @param pComponentManager - Component manager of instance.
     */
    static connectComponentManagerWith(pObject, pComponentManager) {
        ComponentConnection.mComponentManagerConnections.set(pObject, pComponentManager);
    }
}
exports.ComponentConnection = ComponentConnection;
ComponentConnection.mComponentManagerConnections = new WeakMap();
//# sourceMappingURL=component-connection.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/component-extensions.js":
/*!*************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/component-extensions.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentExtensions = void 0;
const component_extension_1 = __webpack_require__(/*! ../extension/component-extension */ "../kartoffelgames.web.potato_web_builder/library/source/extension/component-extension.js");
const extensions_1 = __webpack_require__(/*! ../extension/extensions */ "../kartoffelgames.web.potato_web_builder/library/source/extension/extensions.js");
// Import default extensions.
__webpack_require__(/*! ../default/component-event/component-event-extension */ "../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event-extension.js");
__webpack_require__(/*! ../default/export/export-extension */ "../kartoffelgames.web.potato_web_builder/library/source/default/export/export-extension.js");
__webpack_require__(/*! ../default/event-listener/event-listener-component-extension */ "../kartoffelgames.web.potato_web_builder/library/source/default/event-listener/event-listener-component-extension.js");
__webpack_require__(/*! ../default/pwb_app_injection/pwb-app-injection-extension */ "../kartoffelgames.web.potato_web_builder/library/source/default/pwb_app_injection/pwb-app-injection-extension.js");
class ComponentExtensions {
    /**
     * Constructor.
     */
    constructor() {
        // Create all extensions.
        this.mExtensionList = new Array();
    }
    /**
     * Deconstruct all extensions.
     */
    deconstruct() {
        for (const lExtension of this.mExtensionList) {
            lExtension.deconstruct();
        }
    }
    /**
     * Execute patcher extensions.
     * @param pParameter - Parameter.
     */
    executeInjectorExtensions(pParameter) {
        const lInjectionTypeList = new Array();
        for (const lExtensionClass of extensions_1.Extensions.componentInjectorExtensions) {
            // Create extension and add to extension list.
            const lExtension = new component_extension_1.ComponentExtension({
                extensionClass: lExtensionClass,
                componentElement: pParameter.componentElement,
                componentManager: pParameter.componentManager,
                targetClass: pParameter.targetClass,
                targetObject: null
            });
            this.mExtensionList.push(lExtension);
            // Collect extensions.
            lInjectionTypeList.push(...lExtension.collectInjections());
        }
        return lInjectionTypeList;
    }
    /**
     * Execute patcher extensions.
     * @param pParameter - Parameter.
     */
    executePatcherExtensions(pParameter) {
        for (const lExtensionClass of extensions_1.Extensions.componentPatcherExtensions) {
            this.mExtensionList.push(new component_extension_1.ComponentExtension({
                extensionClass: lExtensionClass,
                componentElement: pParameter.componentElement,
                componentManager: pParameter.componentManager,
                targetClass: pParameter.targetClass,
                targetObject: pParameter.targetObject
            }));
        }
    }
}
exports.ComponentExtensions = ComponentExtensions;
//# sourceMappingURL=component-extensions.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/component-manager.js":
/*!**********************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/component-manager.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentManager = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const core_xml_1 = __webpack_require__(/*! @kartoffelgames/core.xml */ "../kartoffelgames.core.xml/library/source/index.js");
const component_element_reference_1 = __webpack_require__(/*! ../injection_reference/component-element-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-element-reference.js");
const component_update_reference_1 = __webpack_require__(/*! ../injection_reference/component-update-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-update-reference.js");
const static_builder_1 = __webpack_require__(/*! ./builder/static-builder */ "../kartoffelgames.web.potato_web_builder/library/source/component/builder/static-builder.js");
const component_connection_1 = __webpack_require__(/*! ./component-connection */ "../kartoffelgames.web.potato_web_builder/library/source/component/component-connection.js");
const component_extensions_1 = __webpack_require__(/*! ./component-extensions */ "../kartoffelgames.web.potato_web_builder/library/source/component/component-extensions.js");
const component_modules_1 = __webpack_require__(/*! ./component-modules */ "../kartoffelgames.web.potato_web_builder/library/source/component/component-modules.js");
const element_creator_1 = __webpack_require__(/*! ./content/element-creator */ "../kartoffelgames.web.potato_web_builder/library/source/component/content/element-creator.js");
const element_handler_1 = __webpack_require__(/*! ./handler/element-handler */ "../kartoffelgames.web.potato_web_builder/library/source/component/handler/element-handler.js");
const update_handler_1 = __webpack_require__(/*! ./handler/update-handler */ "../kartoffelgames.web.potato_web_builder/library/source/component/handler/update-handler.js");
const user_object_handler_1 = __webpack_require__(/*! ./handler/user-object-handler */ "../kartoffelgames.web.potato_web_builder/library/source/component/handler/user-object-handler.js");
const template_parser_1 = __webpack_require__(/*! ./parser/template-parser */ "../kartoffelgames.web.potato_web_builder/library/source/component/parser/template-parser.js");
const layer_values_1 = __webpack_require__(/*! ./values/layer-values */ "../kartoffelgames.web.potato_web_builder/library/source/component/values/layer-values.js");
/**
 * Base component handler. Handles initialisation and update of components.
 */
class ComponentManager {
    /**
     * Constructor.
     * @param pUserClass - User class constructor.
     * @param pTemplateString - Template as xml string.
     * @param pExpressionModule - Expression module constructor.
     * @param pHtmlComponent - HTMLElement of component.
     * @param pUpdateScope - Update scope of component.
     */
    constructor(pUserClass, pTemplateString, pExpressionModule, pHtmlComponent, pUpdateScope) {
        // Load cached or create new module handler and template.
        let lTemplate = ComponentManager.mComponentCache.get(pUserClass);
        if (!lTemplate) {
            lTemplate = ComponentManager.mXmlParser.parse(pTemplateString ?? '');
            ComponentManager.mComponentCache.set(pUserClass, lTemplate);
        }
        const lModules = new component_modules_1.ComponentModules(this, pExpressionModule);
        // Create update handler.
        const lUpdateScope = pUpdateScope;
        this.mUpdateHandler = new update_handler_1.UpdateHandler(lUpdateScope);
        this.mUpdateHandler.addUpdateListener(() => {
            // Call user class on update function.
            this.mUpdateHandler.executeOutZone(() => {
                this.mUserObjectHandler.callOnPwbUpdate();
            });
            // Update and callback after update.
            if (this.mRootBuilder.update()) {
                this.mUserObjectHandler.callAfterPwbUpdate();
            }
        });
        // Create element handler.
        this.mElementHandler = new element_handler_1.ElementHandler(pHtmlComponent);
        // Initialize user object injections.
        const lLocalInjections = new Array();
        lLocalInjections.push(new component_element_reference_1.ComponentElementReference(pHtmlComponent));
        lLocalInjections.push(new component_update_reference_1.ComponentUpdateReference(this.mUpdateHandler));
        // Create injection extensions.
        this.mExtensions = new component_extensions_1.ComponentExtensions();
        // Create local injections with extensions.
        this.mUpdateHandler.executeInZone(() => {
            lLocalInjections.push(...this.mExtensions.executeInjectorExtensions({
                componentManager: this,
                componentElement: pHtmlComponent,
                targetClass: pUserClass
            }));
        });
        // Create user object handler.
        this.mUserObjectHandler = new user_object_handler_1.UserObjectHandler(pUserClass, this.updateHandler, lLocalInjections);
        // After build, before initialization.
        this.mUserObjectHandler.callOnPwbInitialize();
        // Connect with this component manager.
        component_connection_1.ComponentConnection.connectComponentManagerWith(this.elementHandler.htmlElement, this);
        component_connection_1.ComponentConnection.connectComponentManagerWith(this.userObjectHandler.userObject, this);
        component_connection_1.ComponentConnection.connectComponentManagerWith(this.userObjectHandler.untrackedUserObject, this);
        // Create patcher extensions.
        this.mUpdateHandler.executeInZone(() => {
            this.mExtensions.executePatcherExtensions({
                componentManager: this,
                componentElement: pHtmlComponent,
                targetClass: this.mUserObjectHandler.userClass,
                targetObject: this.mUserObjectHandler.userObject
            });
        });
        // Create component builder.
        this.mRootBuilder = new static_builder_1.StaticBuilder(lTemplate, lTemplate, lModules, new layer_values_1.LayerValues(this), null);
        this.elementHandler.shadowRoot.appendChild(this.mRootBuilder.anchor);
        this.mUserObjectHandler.callAfterPwbInitialize();
    }
    /**
     * Get element handler.
     */
    get elementHandler() {
        return this.mElementHandler;
    }
    /**
     * Get component values of the root builder.
     */
    get rootValues() {
        return this.mRootBuilder.values.rootValue;
    }
    /**
     * Update handler.
     */
    get updateHandler() {
        return this.mUpdateHandler;
    }
    /**
     * Get user class object.
     */
    get userObjectHandler() {
        return this.mUserObjectHandler;
    }
    /**
     * Create style element and prepend it to this component.
     * @param pStyle - Css style as string.
     */
    addStyle(pStyle) {
        const lStyleTemplate = new core_xml_1.XmlElement();
        lStyleTemplate.tagName = 'style';
        lStyleTemplate.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        const lStyleElement = element_creator_1.ElementCreator.createElement(lStyleTemplate);
        lStyleElement.innerHTML = pStyle;
        this.elementHandler.shadowRoot.prepend(lStyleElement);
    }
    /**
     * Called when component get attached to DOM.
     */
    connected() {
        this.updateHandler.enabled = true;
        // Trigger light update.
        this.updateHandler.requestUpdate({
            source: this.userObjectHandler.userObject,
            property: Symbol('any'),
            stacktrace: Error().stack
        });
    }
    /**
     * Deconstruct element.
     */
    deconstruct() {
        // Disable updates.
        this.updateHandler.enabled = false;
        // User callback.
        this.userObjectHandler.callOnPwbDeconstruct();
        // Deconstruct all extensions.
        this.mExtensions.deconstruct();
        // Remove change listener from app.
        this.updateHandler.deconstruct();
        // Deconstruct all child element.
        this.mRootBuilder.deconstruct();
    }
    /**
     * Called when component gets detached from DOM.
     */
    disconnected() {
        this.updateHandler.enabled = false;
    }
}
exports.ComponentManager = ComponentManager;
ComponentManager.METADATA_SELECTOR = 'pwb:selector';
ComponentManager.mComponentCache = new core_data_1.Dictionary();
ComponentManager.mXmlParser = new template_parser_1.TemplateParser();
//# sourceMappingURL=component-manager.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/component-modules.js":
/*!**********************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/component-modules.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentModules = void 0;
const expression_module_1 = __webpack_require__(/*! ../module/expression-module */ "../kartoffelgames.web.potato_web_builder/library/source/module/expression-module.js");
const multiplicator_module_1 = __webpack_require__(/*! ../module/multiplicator-module */ "../kartoffelgames.web.potato_web_builder/library/source/module/multiplicator-module.js");
const static_module_1 = __webpack_require__(/*! ../module/static-module */ "../kartoffelgames.web.potato_web_builder/library/source/module/static-module.js");
const mustache_expression_module_1 = __webpack_require__(/*! ../default/mustache_expression/mustache-expression-module */ "../kartoffelgames.web.potato_web_builder/library/source/default/mustache_expression/mustache-expression-module.js");
const module_type_1 = __webpack_require__(/*! ../module/enum/module-type */ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-type.js");
const modules_1 = __webpack_require__(/*! ../module/modules */ "../kartoffelgames.web.potato_web_builder/library/source/module/modules.js");
// Import default modules
__webpack_require__(/*! ../default/component-event/component-event-attribute-module */ "../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event-attribute-module.js");
__webpack_require__(/*! ../default/pwb_for_of/for-of-manipulator-attribute-module */ "../kartoffelgames.web.potato_web_builder/library/source/default/pwb_for_of/for-of-manipulator-attribute-module.js");
__webpack_require__(/*! ../default/pwb_child/pwb-child-attribute-module */ "../kartoffelgames.web.potato_web_builder/library/source/default/pwb_child/pwb-child-attribute-module.js");
__webpack_require__(/*! ../default/pwb_if/if-manipulator-attribute-module */ "../kartoffelgames.web.potato_web_builder/library/source/default/pwb_if/if-manipulator-attribute-module.js");
__webpack_require__(/*! ../default/one_way_binding/one-way-binding-attribute-module */ "../kartoffelgames.web.potato_web_builder/library/source/default/one_way_binding/one-way-binding-attribute-module.js");
__webpack_require__(/*! ../default/slot_attribute/slot-attribute-module */ "../kartoffelgames.web.potato_web_builder/library/source/default/slot_attribute/slot-attribute-module.js");
__webpack_require__(/*! ../default/two_way_binding/two-way-binding-attribute-module */ "../kartoffelgames.web.potato_web_builder/library/source/default/two_way_binding/two-way-binding-attribute-module.js");
class ComponentModules {
    /**
     * Constructor.
     * @param pExpressionModule - default expression module for this component.
     * @param pComponentManager - Component manager.
     */
    constructor(pComponentManager, pExpressionModule) {
        // Get expression module.
        this.mExpressionModule = pExpressionModule ?? mustache_expression_module_1.MustacheExpressionModule;
        this.mComponentManager = pComponentManager;
    }
    /**
     * Check if template uses any manipulator modules.
     * @param pTemplate - Template element.
     * @param pValues - Values of current layer.
     */
    getElementMultiplicatorModule(pTemplate, pValues) {
        // Find manipulator module inside attributes.
        for (const lDefinition of modules_1.Modules.moduleDefinitions) {
            // Only manipulator modules.
            if (lDefinition.type === module_type_1.ModuleType.Manipulator) {
                for (const lAttribute of pTemplate.attributeList) {
                    if (lDefinition.selector.test(lAttribute.qualifiedName)) {
                        // Get constructor and create new module.
                        const lModule = new multiplicator_module_1.MultiplicatorModule({
                            moduleDefinition: lDefinition,
                            moduleClass: modules_1.Modules.getModuleClass(lDefinition),
                            targetTemplate: pTemplate,
                            targetAttribute: lAttribute,
                            values: pValues,
                            componentManager: this.mComponentManager,
                        });
                        return lModule;
                    }
                }
            }
        }
        // Line can be called. But current code does not allow it.
        /* istanbul ignore next */
        return undefined;
    }
    /**
     * Get all static modules of template.
     * @param pTemplate - Template
     * @param pElement - Build template.
     * @param pValues - Layer values.
     */
    getElementStaticModules(pTemplate, pElement, pValues) {
        const lModules = new Array();
        // Find static modules inside attributes.
        for (const lAttribute of pTemplate.attributeList) {
            let lModuleFound = false;
            // Find static modules.
            for (const lDefinition of modules_1.Modules.moduleDefinitions) {
                if (lDefinition.type === module_type_1.ModuleType.Static && lDefinition.selector.test(lAttribute.qualifiedName)) {
                    // Get constructor and create new module.
                    const lModule = new static_module_1.StaticModule({
                        moduleDefinition: lDefinition,
                        moduleClass: modules_1.Modules.getModuleClass(lDefinition),
                        targetTemplate: pTemplate,
                        targetAttribute: lAttribute,
                        values: pValues,
                        componentManager: this.mComponentManager,
                        targetNode: pElement
                    });
                    lModules.push(lModule);
                    lModuleFound = true;
                    break;
                }
            }
            // When no static module is found, use expression module.
            if (!lModuleFound) {
                const lModule = new expression_module_1.ExpressionModule({
                    moduleDefinition: modules_1.Modules.getModuleDefinition(this.mExpressionModule),
                    moduleClass: this.mExpressionModule,
                    targetTemplate: pTemplate,
                    targetAttribute: lAttribute,
                    values: pValues,
                    componentManager: this.mComponentManager,
                    targetNode: pElement
                });
                lModules.push(lModule);
            }
        }
        return lModules;
    }
    /**
     * Check if template uses any manipulator modules.
     * @param pTemplate - Key list for possible multiplicator modules.
     */
    getMultiplicatorAttribute(pTemplate) {
        // Find manipulator module inside attributes.
        for (const lDefinition of modules_1.Modules.moduleDefinitions) {
            // Only manipulator modules.
            if (lDefinition.type === module_type_1.ModuleType.Manipulator) {
                for (const lAttribute of pTemplate.attributeList) {
                    if (lDefinition.selector.test(lAttribute.qualifiedName)) {
                        return lAttribute;
                    }
                }
            }
        }
        return undefined;
    }
    /**
     * Check if template uses any manipulator modules.
     * @param pTemplate - Text node template.
     * @param pTextNode - Build text node.
     * @param pValues - Values of current layer.
     */
    getTextExpressionModule(pTemplate, pTextNode, pValues) {
        const lModule = new expression_module_1.ExpressionModule({
            moduleDefinition: modules_1.Modules.getModuleDefinition(this.mExpressionModule),
            moduleClass: this.mExpressionModule,
            targetTemplate: pTemplate,
            values: pValues,
            componentManager: this.mComponentManager,
            targetNode: pTextNode
        });
        return lModule;
    }
}
exports.ComponentModules = ComponentModules;
//# sourceMappingURL=component-modules.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/content/content-manager.js":
/*!****************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/content/content-manager.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ContentManager = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const base_builder_1 = __webpack_require__(/*! ../builder/base-builder */ "../kartoffelgames.web.potato_web_builder/library/source/component/builder/base-builder.js");
const component_connection_1 = __webpack_require__(/*! ../component-connection */ "../kartoffelgames.web.potato_web_builder/library/source/component/component-connection.js");
const element_creator_1 = __webpack_require__(/*! ./element-creator */ "../kartoffelgames.web.potato_web_builder/library/source/component/content/element-creator.js");
class ContentManager {
    /**
     * Constructor.
     */
    constructor(pModules, pAnchorPrefix) {
        this.mMultiplicatorModule = null;
        this.mModules = pModules;
        this.mRootChildList = new core_data_1.List();
        this.mChildBuilderList = new core_data_1.List();
        this.mChildComponentList = new core_data_1.List();
        this.mLinkedModules = new core_data_1.Dictionary();
        this.mContentAnchor = element_creator_1.ElementCreator.createComment(pAnchorPrefix + ' ' + Math.random().toString(16).substring(3).toUpperCase());
        this.mBoundaryDescription = {
            start: this.mContentAnchor,
            end: this.mContentAnchor
        };
    }
    /**
     * Get content anchor.
     * All content of this content manager gets append to this anchor.
     */
    get anchor() {
        return this.mContentAnchor;
    }
    /**
     * Get all child builder.
     */
    get childBuilderList() {
        return this.mChildBuilderList;
    }
    /**
     * Get all linked module lists.
     */
    get linkedModuleList() {
        const lAllModuleList = new Array();
        for (const lNodeModuleList of this.mLinkedModules.values()) {
            lAllModuleList.push(...lNodeModuleList);
        }
        return lAllModuleList;
    }
    /**
     * Get all child builder.
     */
    get modules() {
        return this.mModules;
    }
    /**
     * Get multiplicator module of layer.
     */
    get multiplicatorModule() {
        return this.mMultiplicatorModule;
    }
    /**
     * Set multiplicator module of layer.
     */
    set multiplicatorModule(pModule) {
        this.mMultiplicatorModule = pModule;
    }
    /**
     * Get root elements.
     * Elements are returned in order.
     */
    get rootElementList() {
        return this.mRootChildList;
    }
    /**
     * Append child element after target.
     * @param pChild - Child node.
     * @param pTarget - Target where child gets append after.
     */
    after(pChild, pTarget) {
        this.insertContent(pChild, pTarget, 'After');
    }
    /**
     * Append child element to parent.
     * Appends to root if no parent is specified.
     * @param pChild - Child node.
     * @param pParentElement - Parent element of child.
     */
    append(pChild, pParentElement) {
        this.insertContent(pChild, pParentElement, 'Append');
    }
    /**
     * Deconstructs all builder and elements.
     */
    deconstruct() {
        // Deconstruct builder.
        for (const lBuilder of this.mChildBuilderList) {
            lBuilder.deconstruct();
        }
        // Deconstruct components.
        for (const lComponent of this.mChildComponentList) {
            // Child component has always an component manager.
            const lComponentManager = component_connection_1.ComponentConnection.componentManagerOf(lComponent);
            lComponentManager.deconstruct();
        }
        // Deconstruct modules.
        this.mMultiplicatorModule?.deconstruct();
        for (const lModule of this.linkedModuleList) {
            lModule.deconstruct();
        }
        // Remove all content. Only remove root elements. GC makes the rest.
        this.anchor.remove();
        for (const lRootChild of this.mRootChildList) {
            // Only remove elements. Builder are already deconstructed.
            if (!(lRootChild instanceof base_builder_1.BaseBuilder)) {
                this.remove(lRootChild);
            }
        }
    }
    /**
     * Get content boundry. Start and end content.
     */
    getBoundary() {
        // Top is always the anchor.
        const lTop = this.mBoundaryDescription.start;
        // Get last element of builder if bottom element is a builder 
        // or use node as bottom element.  
        let lBottom;
        /* istanbul ignore if */
        if (this.mBoundaryDescription.end instanceof base_builder_1.BaseBuilder) {
            // Not used but good to have.
            lBottom = this.mBoundaryDescription.end.boundary.end;
        }
        else {
            lBottom = this.mBoundaryDescription.end;
        }
        return {
            start: lTop,
            end: lBottom
        };
    }
    /**
     * Link module to node.
     * @param pModule - Module.
     * @param pNode - Build node.
     */
    linkModule(pModule, pNode) {
        // Get module list of node. Create if it not exists.
        let lModuleList = this.mLinkedModules.get(pNode);
        if (!lModuleList) {
            lModuleList = new Array();
            this.mLinkedModules.set(pNode, lModuleList);
        }
        // Add module as linked module to node module list.
        lModuleList.push(pModule);
    }
    /**
     * Prepend child element to parent.
     * Prepends to root if no parent is specified.
     * @param pChild - Child node.
     */
    prepend(pChild) {
        this.insertContent(pChild, null, 'Prepend');
    }
    /**
     * Remove and deconstruct content.
     * @param pChild - Child element of layer.
     */
    remove(pChild) {
        if (pChild instanceof base_builder_1.BaseBuilder) {
            pChild.deconstruct();
        }
        else {
            // Check if element is a component. If so deconstruct.
            const lComponentManager = component_connection_1.ComponentConnection.componentManagerOf(pChild);
            lComponentManager?.deconstruct();
            // Remove from parent.
            if (pChild.parentElement) {
                pChild.parentElement.removeChild(pChild);
            }
            else {
                pChild.getRootNode().removeChild(pChild);
            }
            // Unlink modules.
            const lModuleList = this.mLinkedModules.get(pChild);
            if (lModuleList) {
                // Deconstruct all linked modules.
                for (const lModule of lModuleList) {
                    lModule.deconstruct();
                }
                // Delete element from linked module.
                this.mLinkedModules.delete(pChild);
            }
        }
        // Remove from storages.
        this.unregisterContent(pChild);
    }
    insertContent(pChild, pTarget, pMode) {
        // Get anchor of child if child is a builder.
        const lRealChildNode = (pChild instanceof base_builder_1.BaseBuilder) ? pChild.anchor : pChild;
        // Get real parent element. 
        let lRealParent;
        if (pMode === 'Append' || pMode === 'Prepend') {
            lRealParent = pTarget;
            if (!lRealParent) {
                // Parent is null, because element should be append to builder root.
                // Builder parent is builder anchor parent. If anchor parent is null, builder parent is the component shadow root.
                lRealParent = this.mContentAnchor.parentElement ?? this.mContentAnchor.getRootNode();
            }
        }
        else { // pMode === 'After'
            // Native elements currently not used. But good to have.
            /* istanbul ignore next */
            lRealParent = (pTarget instanceof base_builder_1.BaseBuilder) ? pTarget.anchor.parentElement : pTarget.parentElement;
            // Parent is null, because direct parent is the component shadow root.
            // When parent element is null "this.mContentAnchor.parentElement" is also null. So this check would be unnessessary. 
            lRealParent = lRealParent ?? this.mContentAnchor.getRootNode();
        }
        // If child gets append to builder root. Is is root if real parent is this builders parent element or component shadow root.
        const lIsRoot = (lRealParent === this.mContentAnchor.parentElement || lRealParent === this.mContentAnchor.getRootNode());
        // Get node the child gets insert AFTER.
        let lRealTarget;
        if (pMode === 'Append') {
            const lParent = pTarget;
            // Last element of parent.
            if (lParent) {
                // Parent is element. Get last child of element.
                const lParentChildNodes = lParent.childNodes;
                lRealTarget = lParentChildNodes[lParentChildNodes.length - 1];
            }
            else {
                // "Parent" is this builder. Get last element boundary.
                lRealTarget = this.getBoundary().end;
            }
        }
        else if (pMode === 'Prepend') {
            // When parent is set, parent is an element, therefore there is no target before the first element.
            /* istanbul ignore if */
            if (pTarget) {
                // Not used but good to have.
                lRealTarget = null;
            }
            else {
                // "Parent" is this builder. Get first element, that is always this builders anchor.
                lRealTarget = this.getBoundary().start;
            }
        }
        else { // pMode === "After"
            // Native elements currently not used. But good to have.
            /* istanbul ignore next */
            lRealTarget = (pTarget instanceof base_builder_1.BaseBuilder) ? pTarget.boundary.end : pTarget;
        }
        // Get previous sibling content only if added on root.
        let lTargetContent = null;
        if (lIsRoot) {
            if (pMode === 'Prepend') {
                // Sibling before first element => null.
                lTargetContent = null;
            }
            else if (pMode === 'Append') {
                // Last content of builder.
                lTargetContent = this.mRootChildList[this.mRootChildList.length - 1];
            }
            else { // pMode === "After"
                lTargetContent = pTarget;
            }
        }
        // Insert element.
        if (lRealTarget) {
            // When there is a target. Get next sibling and append element after that sibling.
            // Like: parent.insertAfter(child, target);
            // If nextSibling is null, insertBefore is called as appendChild(child).
            lRealParent.insertBefore(lRealChildNode, lRealTarget.nextSibling);
        }
        else {
            // No target means prepend to parent. Parent is allways an element and never a builder.
            lRealParent.prepend(lRealChildNode);
        }
        // Register content.
        if (lIsRoot) {
            if (lTargetContent !== null) {
                this.registerContent(pChild, lIsRoot, lTargetContent);
            }
            else {
                this.registerContent(pChild, lIsRoot);
            }
        }
        else {
            this.registerContent(pChild, lIsRoot);
        }
    }
    registerContent(pChild, pRoot, pPreviousSibling) {
        // Add to builder or component storage.
        if (pChild instanceof base_builder_1.BaseBuilder) {
            this.mChildBuilderList.push(pChild);
        }
        else if (component_connection_1.ComponentConnection.componentManagerOf(pChild)) {
            this.mChildComponentList.push(pChild);
        }
        // Add element in order if element is on root level.
        if (pRoot) {
            // Set index to -1 of no previous sibling exists.
            const lSiblingIndex = (pPreviousSibling) ? this.mRootChildList.indexOf(pPreviousSibling) : -1;
            // Extend boundary if child is new last element.
            if ((lSiblingIndex + 1) === this.mRootChildList.length) {
                this.mBoundaryDescription.end = pChild;
            }
            // Add root child after previous sibling.
            this.mRootChildList.splice(lSiblingIndex + 1, 0, pChild);
        }
    }
    /**
     * Removes child from all storages and shrink boundary.
     * @param pChild - Child element.
     */
    unregisterContent(pChild) {
        // Remove from builder or component storage.
        if (pChild instanceof base_builder_1.BaseBuilder) {
            this.mChildBuilderList.remove(pChild);
        }
        else if (component_connection_1.ComponentConnection.componentManagerOf(pChild)) {
            this.mChildComponentList.remove(pChild);
        }
        // Remove from root childs and shrink boundary.
        const lChildRootIndex = this.mRootChildList.indexOf(pChild);
        // Check for boundary shrink.
        if ((lChildRootIndex + 1) === this.mRootChildList.length) {
            // Check if one root child remains otherwise use anchor as end boundary.
            if (this.mRootChildList.length > 1) {
                this.mBoundaryDescription.end = this.mRootChildList[lChildRootIndex - 1];
            }
            else {
                this.mBoundaryDescription.end = this.mContentAnchor;
            }
        }
        this.mRootChildList.remove(pChild);
    }
}
exports.ContentManager = ContentManager;
//# sourceMappingURL=content-manager.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/content/element-creator.js":
/*!****************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/content/element-creator.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ElementCreator = void 0;
class ElementCreator {
    /**
     * Create comment node.
     * @param pText - Comment text.
     * @returns comment with text as content.
     */
    static createComment(pText) {
        return document.createComment(pText);
    }
    /**
     * Create element with correct namespace.
     * Ignores namespace information for custom elements.
     * @param pXmlElement - Xml content node.
     */
    static createElement(pXmlElement) {
        const lNamespace = pXmlElement.namespace;
        const lTagname = pXmlElement.qualifiedTagName;
        // On custom element
        if (lTagname.includes('-')) {
            // Get custom element.
            const lCustomElement = window.customElements.get(lTagname);
            // Create custom element.
            if (typeof lCustomElement !== 'undefined') {
                return new lCustomElement();
            }
        }
        return document.createElementNS(lNamespace, lTagname);
    }
    /**
     * Create text node.
     * @param pText - Text.
     * @returns text node with specified text.
     */
    static createText(pText) {
        return document.createTextNode(pText);
    }
}
exports.ElementCreator = ElementCreator;
//# sourceMappingURL=element-creator.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/decorator/pwb-component.decorator.js":
/*!**************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/decorator/pwb-component.decorator.js ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PwbComponent = void 0;
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const component_manager_1 = __webpack_require__(/*! ../component-manager */ "../kartoffelgames.web.potato_web_builder/library/source/component/component-manager.js");
const update_scope_1 = __webpack_require__(/*! ../enum/update-scope */ "../kartoffelgames.web.potato_web_builder/library/source/component/enum/update-scope.js");
/**
 * AtScript. PWB Component.
 * @param pParameter - Parameter defaults on creation.
 */
function PwbComponent(pParameter) {
    // Needs constructor without argument.
    return (pUserClassConstructor) => {
        // Set user class to be injectable.
        core_dependency_injection_1.Injector.Injectable(pUserClassConstructor);
        // Set element metadata.
        core_dependency_injection_1.Metadata.get(pUserClassConstructor).setMetadata(component_manager_1.ComponentManager.METADATA_SELECTOR, pParameter.selector);
        // Create custom html element of parent type.
        const lPwbComponentConstructor = class extends HTMLElement {
            /**
             * Constructor.
             * Build custom html element thats build itself.
             */
            constructor() {
                super();
                // Create component handler.
                this.mComponentManager = new component_manager_1.ComponentManager(pUserClassConstructor, pParameter.template ?? null, pParameter.expressionmodule, this, pParameter.updateScope ?? update_scope_1.UpdateScope.Global);
                // Append style if specified. Styles are scoped on components shadow root.
                if (pParameter.style) {
                    this.mComponentManager.addStyle(pParameter.style);
                }
            }
            /**
             * Lifecycle callback.
             * Callback when element get attached to dom.
             */
            connectedCallback() {
                this.mComponentManager.connected();
            }
            /**
             * Lifecycle callback.
             * Callback when element get detached from dom.
             */
            disconnectedCallback() {
                this.mComponentManager.disconnected();
            }
        };
        // Define current element as new custom html element.
        window.customElements.define(pParameter.selector, lPwbComponentConstructor);
    };
}
exports.PwbComponent = PwbComponent;
//# sourceMappingURL=pwb-component.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/enum/update-scope.js":
/*!**********************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/enum/update-scope.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateScope = void 0;
var UpdateScope;
(function (UpdateScope) {
    /**
     * Update on every change inside app.
     */
    UpdateScope[UpdateScope["Global"] = 1] = "Global";
    /**
     * Update on every changes inside component.
     * Better performance but not every change is covered.
     */
    UpdateScope[UpdateScope["Capsuled"] = 2] = "Capsuled";
    /**
     * Only update manually.
     */
    UpdateScope[UpdateScope["Manual"] = 3] = "Manual";
})(UpdateScope = exports.UpdateScope || (exports.UpdateScope = {}));
//# sourceMappingURL=update-scope.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/handler/element-handler.js":
/*!****************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/handler/element-handler.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ElementHandler = void 0;
class ElementHandler {
    /**
     * Constructor.
     * @param pHtmlElement - HTMLElement.
     * @param pUserObjectHandler - User object handler.
     */
    constructor(pHtmlElement) {
        this.mHtmlElement = pHtmlElement;
        this.mShadowRoot = this.mHtmlElement.attachShadow({ mode: 'open' });
    }
    /**
     * Get html element.
     */
    get htmlElement() {
        return this.mHtmlElement;
    }
    /**
     * Elements shadow root.
     */
    get shadowRoot() {
        return this.mShadowRoot;
    }
}
exports.ElementHandler = ElementHandler;
//# sourceMappingURL=element-handler.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/handler/loop-detection-handler.js":
/*!***********************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/handler/loop-detection-handler.js ***!
  \***********************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoopError = exports.LoopDetectionHandler = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const web_change_detection_1 = __webpack_require__(/*! @kartoffelgames/web.change-detection */ "../kartoffelgames.web.change_detection/library/source/index.js");
class LoopDetectionHandler {
    /**
     * Constructor.
     */
    constructor(pMaxStackSize) {
        this.mCurrentCallChain = new core_data_1.List();
        this.mMaxStackSize = pMaxStackSize;
        this.mOnError = null;
        this.mNextSheduledCall = 0;
        this.mInActiveChain = false;
    }
    /**
     * Get if loop detection has an active chain.
     * Active chain breaks when the asynchron function is called.
     * The chain restores, when a new asyncron function is sheduled.
     */
    get activeChain() {
        return this.mInActiveChain;
    }
    /**
     * Set callback for asynchron errors.
     */
    set onError(pErrorHandler) {
        this.mOnError = pErrorHandler;
    }
    /**
     * Calls function asynchron. Checks for loops and
     * Throws error if stack overflows.
     * @param pUserFunction - Function that should be called.
     * @param pReason - Stack reason.
     */
    callAsynchron(pUserFunction, pReason) {
        if (!this.mInActiveChain) {
            this.mInActiveChain = true;
            // Create and expand call stack.
            this.mCurrentCallChain.push(pReason);
            // Function for asynchron call.
            const lAsynchronFunction = () => {
                // Call function. User can decide on none silent zone inside function.
                // Set component to not updating so new changes doesn't get ignnored.
                this.mInActiveChain = false;
                const lLastLength = this.mCurrentCallChain.length;
                try {
                    // Call function after saving last chain length.
                    // If no other call was sheduled during this call, the length will be the same after. 
                    pUserFunction();
                    // Clear call chain list if no other call in this cycle was made.
                    if (lLastLength === this.mCurrentCallChain.length) {
                        this.mCurrentCallChain.clear();
                    }
                    else if (this.mCurrentCallChain.length > this.mMaxStackSize) {
                        // Throw if too many calles were chained. 
                        throw new LoopError('Call loop detected', this.mCurrentCallChain);
                    }
                }
                catch (pException) {
                    // Execute on error.
                    const lSuppressError = this.mOnError?.(pException) === true;
                    // Unblock further calls and clear call chain.
                    this.mInActiveChain = false;
                    this.mCurrentCallChain.clear();
                    // Cancel next call cycle.
                    globalThis.cancelAnimationFrame(this.mNextSheduledCall);
                    // Rethrow error. Used only for debugging and testing.
                    /* istanbul ignore else */
                    if (lSuppressError) {
                        // Prevent any other updates. Debug only.
                        this.mInActiveChain = true;
                    }
                    else {
                        throw pException;
                    }
                }
            };
            // Call on next frame. 
            // Do not call change detection on requestAnimationFrame.
            this.mNextSheduledCall = web_change_detection_1.ChangeDetection.current.silentExecution(globalThis.requestAnimationFrame, lAsynchronFunction);
        }
    }
}
exports.LoopDetectionHandler = LoopDetectionHandler;
class LoopError extends Error {
    /**
     * Constructor.
     * Create loop error.
     * @param pMessage - Error Message.
     * @param pChain - Current call chain.
     */
    constructor(pMessage, pChain) {
        super(pMessage);
        this.mChain = [...pChain];
    }
    /**
     * Asynchron call chain.
     */
    get chain() {
        // More of the same. Needs no testing.
        /* istanbul ignore next */
        return this.mChain;
    }
}
exports.LoopError = LoopError;
//# sourceMappingURL=loop-detection-handler.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/handler/update-handler.js":
/*!***************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/handler/update-handler.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateHandler = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const web_change_detection_1 = __webpack_require__(/*! @kartoffelgames/web.change-detection */ "../kartoffelgames.web.change_detection/library/source/index.js");
const update_scope_1 = __webpack_require__(/*! ../enum/update-scope */ "../kartoffelgames.web.potato_web_builder/library/source/component/enum/update-scope.js");
const loop_detection_handler_1 = __webpack_require__(/*! ./loop-detection-handler */ "../kartoffelgames.web.potato_web_builder/library/source/component/handler/loop-detection-handler.js");
class UpdateHandler {
    /**
     * Constructor.
     * @param pUpdateScope - Update scope.
     */
    constructor(pUpdateScope) {
        this.mUpdateScope = pUpdateScope;
        this.mUpdateListener = new core_data_1.List();
        this.mEnabled = false;
        this.mUpdateWaiter = new core_data_1.List();
        this.mLoopDetectionHandler = new loop_detection_handler_1.LoopDetectionHandler(10);
        // Create new change detection if component is not inside change detection or mode is capsuled.
        if (this.mUpdateScope === update_scope_1.UpdateScope.Manual) {
            // Manual zone outside every other zone.
            this.mChangeDetection = new web_change_detection_1.ChangeDetection('Manual Zone', web_change_detection_1.ChangeDetection.current, true, true);
        }
        else if (this.mUpdateScope === update_scope_1.UpdateScope.Capsuled) {
            this.mChangeDetection = new web_change_detection_1.ChangeDetection('DefaultComponentZone', web_change_detection_1.ChangeDetection.current, true);
        }
        else {
            this.mChangeDetection = web_change_detection_1.ChangeDetection.currentNoneSilent;
        }
        // Add listener for changes inside change detection.
        if (this.mUpdateScope !== update_scope_1.UpdateScope.Manual) {
            this.mChangeDetectionListener = (pReason) => { this.sheduleUpdate(pReason); };
            this.mChangeDetection.addChangeListener(this.mChangeDetectionListener);
        }
        else {
            this.mChangeDetectionListener = () => { };
        }
        // Define error handler.
        this.mLoopDetectionHandler.onError = (pError) => {
            // Supress error of any waiter were waiting.
            // Error should be handled by the async waiter.
            return this.releaseWaiter(pError);
        };
    }
    /**
     * Get enabled state of update handler.
     * Does not report any updates on disabled state.
     */
    get enabled() {
        return this.mEnabled;
    }
    /**
     * Get enabled state of update handler.
     * Does not report any updates on disabled state.
     */
    set enabled(pEnabled) {
        this.mEnabled = pEnabled;
    }
    /**
     * Listen for updates.
     * @param pListener - Listener.
     */
    addUpdateListener(pListener) {
        this.mUpdateListener.push(pListener);
    }
    /**
     * Deconstruct update handler.
     */
    deconstruct() {
        // Disconnect from change listener. Does nothing if listener is not defined.
        this.mChangeDetection.removeChangeListener(this.mChangeDetectionListener);
        // Remove all update listener.
        this.mUpdateListener.clear();
        if (this.mUpdateScope !== update_scope_1.UpdateScope.Global) {
            this.mChangeDetection.deconstruct();
        }
        // Disable handling.
        this.enabled = false;
    }
    /**
     * Execute function inside update detection scope.
     * @param pFunction - Function.
     */
    executeInZone(pFunction) {
        this.mChangeDetection.execute(pFunction);
    }
    /**
     * Execute function outside update detection scope.
     * @param pFunction - Function.
     */
    executeOutZone(pFunction) {
        this.mChangeDetection.silentExecution(pFunction);
    }
    /**
     * Shedule forced manual update.
     * @param pReason - Update reason.
     */
    forceUpdate(pReason) {
        this.sheduleUpdate(pReason);
        // Request update to dispatch change events on other components.
        this.requestUpdate(pReason);
    }
    /**
     * Register object and pass on update events.
     * @param pObject - Object.
     */
    registerObject(pObject) {
        return this.mChangeDetection.registerObject(pObject);
    }
    /**
     * Request update.
     * @param pReason
     */
    requestUpdate(pReason) {
        this.mChangeDetection.dispatchChangeEvent(pReason);
    }
    /**
     * Wait for the component update.
     * Returns Promise<false> if there is currently no update cycle.
     */
    async waitForUpdate() {
        if (this.mLoopDetectionHandler.activeChain) {
            // Add new callback to waiter line.
            return new Promise((pResolve, pReject) => {
                this.mUpdateWaiter.push((pError) => {
                    if (pError) {
                        // Reject if any error exist.
                        pReject(pError);
                    }
                    else {
                        // Is resolved when all data were updated.
                        pResolve(true);
                    }
                });
            });
        }
        else {
            return false;
        }
    }
    /**
     * Call all update listener.
     */
    dispatchUpdateListener(pReason) {
        // Trigger all update listener.
        for (const lListener of this.mUpdateListener) {
            lListener.call(this, pReason);
        }
    }
    /**
     * Release all update waiter.
     * @param pError - Error object.
     * @returns if any waiter were waiting.
     */
    releaseWaiter(pError) {
        const lWaiterExist = this.mUpdateWaiter.length > 0;
        // Release all waiter.
        for (const lUpdateWaiter of this.mUpdateWaiter) {
            lUpdateWaiter(pError);
        }
        // Clear waiter list.
        this.mUpdateWaiter.clear();
        return lWaiterExist;
    }
    /**
     * Update component parts that used the property.
     */
    sheduleUpdate(pReason) {
        if (!this.enabled) {
            this.releaseWaiter();
            return;
        }
        this.mLoopDetectionHandler.callAsynchron(() => {
            this.mChangeDetection.execute(() => {
                // Call every update listener.
                this.dispatchUpdateListener(pReason);
                // Check if any changes where made during the listener calls. If not, release all waiter.
                if (!this.mLoopDetectionHandler.activeChain) {
                    this.releaseWaiter();
                }
            });
        }, pReason);
    }
}
exports.UpdateHandler = UpdateHandler;
//# sourceMappingURL=update-handler.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/handler/user-object-handler.js":
/*!********************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/handler/user-object-handler.js ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserObjectHandler = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const web_change_detection_1 = __webpack_require__(/*! @kartoffelgames/web.change-detection */ "../kartoffelgames.web.change_detection/library/source/index.js");
class UserObjectHandler {
    /**
     * Constrcutor.
     * @param pUserClass - User object constructor.
     */
    constructor(pUserClass, pUpdateHandler, pInjectionList) {
        // Create injection mapping. Ignores none objects.
        const lLocalInjections = new core_data_1.Dictionary();
        for (const lInjectionObject of pInjectionList) {
            if (typeof lInjectionObject === 'object' && lInjectionObject !== null) {
                lLocalInjections.add(lInjectionObject.constructor, lInjectionObject);
            }
        }
        // Create user object inside update zone.
        // Constructor needs to be called inside zone.
        let lUntrackedUserObject = null;
        pUpdateHandler.executeInZone(() => {
            lUntrackedUserObject = core_dependency_injection_1.Injection.createObject(pUserClass, lLocalInjections);
        });
        this.mUserObject = pUpdateHandler.registerObject(lUntrackedUserObject);
        this.mUserClass = pUserClass;
    }
    /**
     * Untracked user class instance.
     */
    get untrackedUserObject() {
        return web_change_detection_1.ChangeDetection.getUntrackedObject(this.mUserObject);
    }
    /**
     * User class.
     */
    get userClass() {
        return this.mUserClass;
    }
    /**
     * User class instance.
     */
    get userObject() {
        return this.mUserObject;
    }
    /**
     * Call onPwbInitialize of user class object.
     */
    callAfterPwbInitialize() {
        this.callUserCallback('afterPwbInitialize');
    }
    /**
     * Call onPwbInitialize of user class object.
     */
    callAfterPwbUpdate() {
        this.callUserCallback('afterPwbUpdate');
    }
    /**
     * Call onPwbInitialize of user class object.
     * @param pAttributeName - Name of updated attribute.
     */
    callOnPwbAttributeChange(pAttributeName) {
        this.callUserCallback('onPwbAttributeChange', pAttributeName);
    }
    /**
     * Call onPwbDeconstruct of user class object.
     */
    callOnPwbDeconstruct() {
        this.callUserCallback('onPwbDeconstruct');
    }
    /**
     * Call onPwbInitialize of user class object.
     */
    callOnPwbInitialize() {
        this.callUserCallback('onPwbInitialize');
    }
    /**
     * Call onPwbInitialize of user class object.
     */
    callOnPwbUpdate() {
        this.callUserCallback('onPwbUpdate');
    }
    /**
     * Callback by name.
     * @param pCallbackKey - Callback name.
     */
    callUserCallback(pCallbackKey, ...pArguments) {
        // Callback when it exits
        if (pCallbackKey in this.mUserObject) {
            this.mUserObject[pCallbackKey](...pArguments);
        }
    }
}
exports.UserObjectHandler = UserObjectHandler;
//# sourceMappingURL=user-object-handler.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/parser/template-parser.js":
/*!***************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/parser/template-parser.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TemplateParser = void 0;
const core_xml_1 = __webpack_require__(/*! @kartoffelgames/core.xml */ "../kartoffelgames.core.xml/library/source/index.js");
/**
 * XML parser for parsing template strings.
 */
class TemplateParser extends core_xml_1.XmlParser {
    /**
     * Constructor.
     * Set new setting for parsing attributes with special characters and remove comments.
     */
    constructor() {
        super({
            // Attribute name with everything.
            allowedAttributeCharacters: 'abcdefghijklmnopqrstuvwxyz_:-.1234567890*[]()$§%&?#',
            // Remove user comments.
            removeComments: true
        });
    }
}
exports.TemplateParser = TemplateParser;
//# sourceMappingURL=template-parser.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/component/values/layer-values.js":
/*!************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/component/values/layer-values.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LayerValues = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const component_manager_1 = __webpack_require__(/*! ../component-manager */ "../kartoffelgames.web.potato_web_builder/library/source/component/component-manager.js");
/**
 * Interface between persistent values directly from component and temporary values
 * that are not directly inside the component but attached to it.
 *
 * Simple access for all value types: TemporaryValue, IdChild and UserClassValue.
 * has-, get-, set-, remove-.
 */
class LayerValues {
    /**
     * Constructor.
     * New component value layer.
     * @param pParentLayer - Parent layer. ComponentManager on root layer.
     */
    constructor(pParentLayer) {
        this.mTemporaryValues = new core_data_1.Dictionary();
        if (pParentLayer instanceof component_manager_1.ComponentManager) {
            this.mParentLayer = null;
            this.mComponentManager = pParentLayer;
        }
        else {
            this.mParentLayer = pParentLayer;
            this.mComponentManager = pParentLayer.componentManager;
        }
    }
    /**
     * Component manager connected with layer value.
     */
    get componentManager() {
        return this.mComponentManager;
    }
    /**
     * Get root value of component.
     */
    get rootValue() {
        if (this.mParentLayer === null) {
            return this;
        }
        else {
            return this.mParentLayer.rootValue;
        }
    }
    /**
     * Get all keys of temorary values.
     */
    get temporaryValuesList() {
        const lKeyList = this.mTemporaryValues.map((pKey) => pKey);
        // Get key list from parent.
        if (this.mParentLayer) {
            lKeyList.push(...this.mParentLayer.temporaryValuesList);
        }
        return lKeyList;
    }
    /**
     * Check for changes into two value handler.
     * @param pHandler - Handler two.
     */
    equal(pHandler) {
        // Compare if it has the same user class object.
        if (this.componentManager.userObjectHandler.userObject !== pHandler.componentManager.userObjectHandler.userObject) {
            return false;
        }
        // Get temporary value keys and sort. 
        const lSortedTemporaryValueKeyListOne = this.temporaryValuesList.sort();
        const lSortedTemporaryValueKeyListTwo = pHandler.temporaryValuesList.sort();
        // Compare temporary value keys.
        if (lSortedTemporaryValueKeyListOne.join() !== lSortedTemporaryValueKeyListTwo.join()) {
            return false;
        }
        // Check for temporary values differences from one to two.
        for (const lTemporaryValueOneKey of lSortedTemporaryValueKeyListOne) {
            // Check for difference.
            if (this.getValue(lTemporaryValueOneKey) !== pHandler.getValue(lTemporaryValueOneKey)) {
                return false;
            }
        }
        return true;
    }
    /**
     * Gets the html element specified temporary value.
     * @param pValueName - Name of value.
     */
    getValue(pValueName) {
        let lValue = this.mTemporaryValues.get(pValueName);
        // If value was not found and parent exists, search in parent values.
        if (typeof lValue === 'undefined' && this.mParentLayer) {
            lValue = this.mParentLayer.getValue(pValueName);
        }
        return lValue;
    }
    /**
     * Remove temporary value from this layer.
     * @param pValueName - Name of value.
     */
    removeLayerValue(pValueName) {
        // Remove value from html element.
        this.mTemporaryValues.delete(pValueName);
    }
    /**
     * Add or replaces temporary value in this manipulator scope.
     * @param pKey - Key of value.
     * @param pValue - Value.
     */
    setLayerValue(pKey, pValue) {
        // Set value to current layer.
        this.mTemporaryValues.set(pKey, pValue);
    }
    /**
     * Set value to root. All child can access this value.
     * @param pKey - Value key.
     * @param pValue - Value.
     */
    setRootValue(pKey, pValue) {
        this.rootValue.setLayerValue(pKey, pValue);
    }
}
exports.LayerValues = LayerValues;
//# sourceMappingURL=layer-values.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event-attribute-module.js":
/*!***************************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event-attribute-module.js ***!
  \***************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventAttributeModule = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const module_attribute_reference_1 = __webpack_require__(/*! ../../injection_reference/module-attribute-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-attribute-reference.js");
const module_layer_values_reference_1 = __webpack_require__(/*! ../../injection_reference/module-layer-values-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-layer-values-reference.js");
const module_target_reference_1 = __webpack_require__(/*! ../../injection_reference/module-target-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-target-reference.js");
const pwb_static_attribute_module_decorator_1 = __webpack_require__(/*! ../../module/decorator/pwb-static-attribute-module.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-static-attribute-module.decorator.js");
const module_access_type_1 = __webpack_require__(/*! ../../module/enum/module-access-type */ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-access-type.js");
const component_scope_executor_1 = __webpack_require__(/*! ../../module/execution/component-scope-executor */ "../kartoffelgames.web.potato_web_builder/library/source/module/execution/component-scope-executor.js");
let EventAttributeModule = class EventAttributeModule {
    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pValueReference - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    constructor(pTargetReference, pValueReference, pAttributeReference) {
        this.mTarget = pTargetReference.value;
        this.mEventName = pAttributeReference.value.name.substr(1, pAttributeReference.value.name.length - 2);
        // Define listener.
        this.mListener = (pEvent) => {
            // Add event to external values.
            const lExternalValues = new core_data_1.Dictionary();
            lExternalValues.add('$event', pEvent);
            // Execute string with external event value.
            component_scope_executor_1.ComponentScopeExecutor.execute(pAttributeReference.value.value, pValueReference.value, lExternalValues);
        };
        // Add native event listener.
        this.mTarget.addEventListener(this.mEventName, this.mListener);
    }
    /**
     * Cleanup event on deconstruction.
     */
    onDeconstruct() {
        this.mTarget.removeEventListener(this.mEventName, this.mListener);
    }
};
EventAttributeModule = __decorate([
    (0, pwb_static_attribute_module_decorator_1.PwbStaticAttributeModule)({
        selector: /^\([[\w\-$]+\)$/,
        access: module_access_type_1.ModuleAccessType.Write,
        forbiddenInManipulatorScopes: false
    }),
    __metadata("design:paramtypes", [module_target_reference_1.ModuleTargetReference, module_layer_values_reference_1.ModuleLayerValuesReference, module_attribute_reference_1.ModuleAttributeReference])
], EventAttributeModule);
exports.EventAttributeModule = EventAttributeModule;
//# sourceMappingURL=component-event-attribute-module.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event-emitter.js":
/*!******************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event-emitter.js ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentEventEmitter = void 0;
const component_event_1 = __webpack_require__(/*! ./component-event */ "../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event.js");
/**
 * Event emitter.
 * Use in combination with @HtmlComponentEvent.
 */
class ComponentEventEmitter {
    /**
     * Constructor.
     * Custom event emmiter for html elements.
     * @param pEventName - Event name.
     * @param pHtmlElement - Html element of emmiter.
     */
    constructor(pEventName, pHtmlElement) {
        this.mEventName = pEventName;
        this.mElement = pHtmlElement;
    }
    /**
     * Call all event listener with event arguments.
     * @param pEventArgs - Event arguments.
     */
    dispatchEvent(pEventArgs) {
        // Create and dispatch event.
        const lEvent = new component_event_1.ComponentEvent(this.mEventName, pEventArgs);
        this.mElement.dispatchEvent(lEvent);
    }
}
exports.ComponentEventEmitter = ComponentEventEmitter;
//# sourceMappingURL=component-event-emitter.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event-extension.js":
/*!********************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event-extension.js ***!
  \********************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ComponentEventExtension_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentEventExtension = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const pwb_extension_decorator_1 = __webpack_require__(/*! ../../extension/decorator/pwb-extension.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/extension/decorator/pwb-extension.decorator.js");
const extension_mode_1 = __webpack_require__(/*! ../../extension/enum/extension-mode */ "../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-mode.js");
const extension_type_1 = __webpack_require__(/*! ../../extension/enum/extension-type */ "../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-type.js");
const component_element_reference_1 = __webpack_require__(/*! ../../injection_reference/component-element-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-element-reference.js");
const extension_target_class_reference_1 = __webpack_require__(/*! ../../injection_reference/extension-target-class-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/extension-target-class-reference.js");
const extension_target_object_reference_1 = __webpack_require__(/*! ../../injection_reference/extension-target-object-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/extension-target-object-reference.js");
const component_event_emitter_1 = __webpack_require__(/*! ./component-event-emitter */ "../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event-emitter.js");
let ComponentEventExtension = ComponentEventExtension_1 = class ComponentEventExtension {
    /**
     * Constructor.
     * Override each event emmiter property with a new pre defined event emmiter.
     * @param pTargetClassReference - User class reference.
     * @param pTargetObjectReference - User object reference.
     * @param pElementReference - Component html element reference.
     */
    constructor(pTargetClassReference, pTargetObjectReference, pElementReference) {
        // Get event metadata.
        const lEventProperties = core_dependency_injection_1.Metadata.get(pTargetClassReference.value).getMetadata(ComponentEventExtension_1.METADATA_USER_EVENT_PROPERIES);
        if (lEventProperties !== null) {
            // Easy access target objects.
            const lTargetObject = pTargetObjectReference.value;
            const lTargetElement = pElementReference.value;
            // Override each property with the corresponding component event emitter.
            for (const lEventName of lEventProperties.keys()) {
                const lPropertyKey = lEventProperties.get(lEventName);
                // Check property type.
                if (core_dependency_injection_1.Metadata.get(pTargetClassReference.value).getProperty(lPropertyKey).type !== component_event_emitter_1.ComponentEventEmitter) {
                    throw new core_data_1.Exception(`Event emiter property must be of type ${component_event_emitter_1.ComponentEventEmitter.name}`, this);
                }
                // Create component event emitter.
                const lEventEmitter = new component_event_emitter_1.ComponentEventEmitter(lEventName, lTargetElement);
                // Override property with created component event emmiter getter.
                Object.defineProperty(lTargetObject, lPropertyKey, {
                    get: () => {
                        return lEventEmitter;
                    }
                });
            }
        }
    }
};
ComponentEventExtension.METADATA_USER_EVENT_PROPERIES = 'pwb:user_event_properties';
ComponentEventExtension = ComponentEventExtension_1 = __decorate([
    (0, pwb_extension_decorator_1.PwbExtension)({
        type: extension_type_1.ExtensionType.Component,
        mode: extension_mode_1.ExtensionMode.Patch
    }),
    __metadata("design:paramtypes", [extension_target_class_reference_1.ExtensionTargetClassReference, extension_target_object_reference_1.ExtensionTargetObjectReference, component_element_reference_1.ComponentElementReference])
], ComponentEventExtension);
exports.ComponentEventExtension = ComponentEventExtension;
//# sourceMappingURL=component-event-extension.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event.js":
/*!**********************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event.js ***!
  \**********************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentEvent = void 0;
class ComponentEvent extends Event {
    /**
     * Pwb custom event constructor.
     * @param pEventName - Event name.
     * @param pValue - Event value.
     */
    constructor(pEventName, pValue) {
        super(pEventName);
        this.mValue = pValue;
    }
    /**
     * Event value.
     */
    get value() {
        return this.mValue;
    }
}
exports.ComponentEvent = ComponentEvent;
//# sourceMappingURL=component-event.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/component-event/pwb-component-event.decorator.js":
/*!************************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/component-event/pwb-component-event.decorator.js ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PwbComponentEvent = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const component_event_extension_1 = __webpack_require__(/*! ./component-event-extension */ "../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event-extension.js");
/**
 * Define event for external access.
 * @param pEventName - Name of event.
 */
function PwbComponentEvent(pEventName) {
    return (pTarget, pPropertyKey, _pDescriptor) => {
        // Usually Class Prototype. Globaly.
        const lPrototype = pTarget;
        const lUserClassConstructor = lPrototype.constructor;
        // Check if real prototype.
        if (typeof pTarget === 'function') {
            throw new core_data_1.Exception('Event target is not for an instanced property.', PwbComponentEvent);
        }
        // Get property list from constructor metadata.
        const lEventProperties = core_dependency_injection_1.Metadata.get(lUserClassConstructor).getMetadata(component_event_extension_1.ComponentEventExtension.METADATA_USER_EVENT_PROPERIES) ?? new core_data_1.Dictionary();
        lEventProperties.add(pEventName, pPropertyKey);
        // Set metadata.
        core_dependency_injection_1.Metadata.get(lUserClassConstructor).setMetadata(component_event_extension_1.ComponentEventExtension.METADATA_USER_EVENT_PROPERIES, lEventProperties);
    };
}
exports.PwbComponentEvent = PwbComponentEvent;
//# sourceMappingURL=pwb-component-event.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/event-listener/event-listener-component-extension.js":
/*!****************************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/event-listener/event-listener-component-extension.js ***!
  \****************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EventListenerComponentExtension_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventListenerComponentExtension = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const web_change_detection_1 = __webpack_require__(/*! @kartoffelgames/web.change-detection */ "../kartoffelgames.web.change_detection/library/source/index.js");
const pwb_extension_decorator_1 = __webpack_require__(/*! ../../extension/decorator/pwb-extension.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/extension/decorator/pwb-extension.decorator.js");
const extension_mode_1 = __webpack_require__(/*! ../../extension/enum/extension-mode */ "../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-mode.js");
const extension_type_1 = __webpack_require__(/*! ../../extension/enum/extension-type */ "../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-type.js");
const component_element_reference_1 = __webpack_require__(/*! ../../injection_reference/component-element-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-element-reference.js");
const extension_target_class_reference_1 = __webpack_require__(/*! ../../injection_reference/extension-target-class-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/extension-target-class-reference.js");
const extension_target_object_reference_1 = __webpack_require__(/*! ../../injection_reference/extension-target-object-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/extension-target-object-reference.js");
let EventListenerComponentExtension = EventListenerComponentExtension_1 = class EventListenerComponentExtension {
    /**
     * Constructor.
     * Add each event listener to component events.
     * @param pTargetClassReference - User class reference.
     * @param pTargetObjectReference - User object reference.
     * @param pElementReference - Component manager.
     */
    constructor(pTargetClassReference, pTargetObjectReference, pElementReference) {
        // Get event metadata.
        const lEventPropertyList = core_dependency_injection_1.Metadata.get(pTargetClassReference.value).getMetadata(EventListenerComponentExtension_1.METADATA_USER_EVENT_LISTENER_PROPERIES);
        // Initialize lists.
        this.mEventListenerList = new Array();
        // Only if any event listener is defined.
        if (lEventPropertyList !== null) {
            // Easy access target objects.
            const lTargetObject = pTargetObjectReference.value;
            this.mTargetElement = pElementReference.value;
            // Override each property with the corresponding component event emitter.
            for (const lEventProperty of lEventPropertyList) {
                const [lPropertyKey, lEventName] = lEventProperty;
                // Check property type.
                if (core_dependency_injection_1.Metadata.get(pTargetClassReference.value).getProperty(lPropertyKey).type !== Function) {
                    throw new core_data_1.Exception(`Event listener property must be of type Function`, this);
                }
                // Get target event listener function.
                let lEventListener = Reflect.get(lTargetObject, lPropertyKey);
                lEventListener = web_change_detection_1.ChangeDetection.getUntrackedObject(lEventListener);
                // Add listener element and save for deconstruct.
                this.mEventListenerList.push([lEventName, lEventListener]);
                this.mTargetElement.addEventListener(lEventName, lEventListener);
            }
        }
        else {
            this.mTargetElement = null;
        }
    }
    /**
     * Remove all listener.
     */
    onDeconstruct() {
        // Exit if no events where set.
        if (this.mTargetElement === null) {
            return;
        }
        // Remove all events from target element.
        for (const lListener of this.mEventListenerList) {
            const [lEventName, lFunction] = lListener;
            this.mTargetElement.removeEventListener(lEventName, lFunction);
        }
    }
};
EventListenerComponentExtension.METADATA_USER_EVENT_LISTENER_PROPERIES = 'pwb:user_event_listener_properties';
EventListenerComponentExtension = EventListenerComponentExtension_1 = __decorate([
    (0, pwb_extension_decorator_1.PwbExtension)({
        type: extension_type_1.ExtensionType.Component,
        mode: extension_mode_1.ExtensionMode.Patch
    }),
    __metadata("design:paramtypes", [extension_target_class_reference_1.ExtensionTargetClassReference, extension_target_object_reference_1.ExtensionTargetObjectReference, component_element_reference_1.ComponentElementReference])
], EventListenerComponentExtension);
exports.EventListenerComponentExtension = EventListenerComponentExtension;
//# sourceMappingURL=event-listener-component-extension.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/event-listener/event-listener-module-extension.js":
/*!*************************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/event-listener/event-listener-module-extension.js ***!
  \*************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventListenerModuleExtension = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const web_change_detection_1 = __webpack_require__(/*! @kartoffelgames/web.change-detection */ "../kartoffelgames.web.change_detection/library/source/index.js");
const pwb_extension_decorator_1 = __webpack_require__(/*! ../../extension/decorator/pwb-extension.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/extension/decorator/pwb-extension.decorator.js");
const extension_mode_1 = __webpack_require__(/*! ../../extension/enum/extension-mode */ "../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-mode.js");
const extension_type_1 = __webpack_require__(/*! ../../extension/enum/extension-type */ "../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-type.js");
const component_manager_reference_1 = __webpack_require__(/*! ../../injection_reference/component-manager-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-manager-reference.js");
const extension_target_class_reference_1 = __webpack_require__(/*! ../../injection_reference/extension-target-class-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/extension-target-class-reference.js");
const extension_target_object_reference_1 = __webpack_require__(/*! ../../injection_reference/extension-target-object-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/extension-target-object-reference.js");
const module_target_reference_1 = __webpack_require__(/*! ../../injection_reference/module-target-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-target-reference.js");
const event_listener_component_extension_1 = __webpack_require__(/*! ./event-listener-component-extension */ "../kartoffelgames.web.potato_web_builder/library/source/default/event-listener/event-listener-component-extension.js");
let EventListenerModuleExtension = class EventListenerModuleExtension {
    /**
     * Constructor.
     * Add each event listener to component events.
     * @param pTargetClassReference - User class reference.
     * @param pTargetObjectReference - User object reference.
     * @param pElementReference - Component manager.
     */
    constructor(pTargetClassReference, pTargetObjectReference, pElementReference, pComponentManager) {
        // Get event metadata.
        const lEventPropertyList = core_dependency_injection_1.Metadata.get(pTargetClassReference.value).getMetadata(event_listener_component_extension_1.EventListenerComponentExtension.METADATA_USER_EVENT_LISTENER_PROPERIES);
        // Initialize lists.
        this.mEventListenerList = new Array();
        // Only if any event listener is defined.
        if (lEventPropertyList !== null) {
            // Easy access target objects.
            const lTargetObject = pTargetObjectReference.value;
            this.mTargetElement = pElementReference.value ?? pComponentManager.value.elementHandler.htmlElement;
            // Override each property with the corresponding component event emitter.
            for (const lEventProperty of lEventPropertyList) {
                const [lPropertyKey, lEventName] = lEventProperty;
                // Check property type.
                if (core_dependency_injection_1.Metadata.get(pTargetClassReference.value).getProperty(lPropertyKey).type !== Function) {
                    throw new core_data_1.Exception(`Event listener property must be of type Function`, this);
                }
                // Get target event listener function.
                let lEventListener = Reflect.get(lTargetObject, lPropertyKey);
                lEventListener = web_change_detection_1.ChangeDetection.getUntrackedObject(lEventListener);
                // Add listener element and save for deconstruct.
                this.mEventListenerList.push([lEventName, lEventListener]);
                this.mTargetElement.addEventListener(lEventName, lEventListener);
            }
        }
        else {
            this.mTargetElement = null;
        }
    }
    /**
     * Remove all listener.
     */
    onDeconstruct() {
        // Exit if no events where set.
        if (this.mTargetElement === null) {
            return;
        }
        // Remove all events from target element.
        for (const lListener of this.mEventListenerList) {
            const [lEventName, lFunction] = lListener;
            this.mTargetElement.removeEventListener(lEventName, lFunction);
        }
    }
};
EventListenerModuleExtension = __decorate([
    (0, pwb_extension_decorator_1.PwbExtension)({
        type: extension_type_1.ExtensionType.Module,
        mode: extension_mode_1.ExtensionMode.Patch
    }),
    __metadata("design:paramtypes", [extension_target_class_reference_1.ExtensionTargetClassReference, extension_target_object_reference_1.ExtensionTargetObjectReference, module_target_reference_1.ModuleTargetReference, component_manager_reference_1.ComponentManagerReference])
], EventListenerModuleExtension);
exports.EventListenerModuleExtension = EventListenerModuleExtension;
//# sourceMappingURL=event-listener-module-extension.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/event-listener/pwb-event-listener.decorator.js":
/*!**********************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/event-listener/pwb-event-listener.decorator.js ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PwbEventListener = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const event_listener_component_extension_1 = __webpack_require__(/*! ./event-listener-component-extension */ "../kartoffelgames.web.potato_web_builder/library/source/default/event-listener/event-listener-component-extension.js");
/**
 * Define event for external access.
 * @param pEventName - Name of event.
 */
function PwbEventListener(pEventName) {
    return (pTarget, pPropertyKey, _pDescriptor) => {
        // Usually Class Prototype. Globaly.
        const lPrototype = pTarget;
        const lUserClassConstructor = lPrototype.constructor;
        // Check if real prototype.
        if (typeof pTarget === 'function') {
            throw new core_data_1.Exception('Event listener is only valid on instanced property', PwbEventListener);
        }
        // Get property list from constructor metadata.
        const lEventPropertyList = core_dependency_injection_1.Metadata.get(lUserClassConstructor).getMetadata(event_listener_component_extension_1.EventListenerComponentExtension.METADATA_USER_EVENT_LISTENER_PROPERIES) ?? new Array();
        lEventPropertyList.push([pPropertyKey, pEventName]);
        // Set metadata.
        core_dependency_injection_1.Metadata.get(lUserClassConstructor).setMetadata(event_listener_component_extension_1.EventListenerComponentExtension.METADATA_USER_EVENT_LISTENER_PROPERIES, lEventPropertyList);
    };
}
exports.PwbEventListener = PwbEventListener;
//# sourceMappingURL=pwb-event-listener.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/export/export-extension.js":
/*!**************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/export/export-extension.js ***!
  \**************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ExportExtension_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExportExtension = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const pwb_extension_decorator_1 = __webpack_require__(/*! ../../extension/decorator/pwb-extension.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/extension/decorator/pwb-extension.decorator.js");
const extension_mode_1 = __webpack_require__(/*! ../../extension/enum/extension-mode */ "../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-mode.js");
const extension_type_1 = __webpack_require__(/*! ../../extension/enum/extension-type */ "../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-type.js");
const component_element_reference_1 = __webpack_require__(/*! ../../injection_reference/component-element-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-element-reference.js");
const component_manager_reference_1 = __webpack_require__(/*! ../../injection_reference/component-manager-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-manager-reference.js");
let ExportExtension = ExportExtension_1 = class ExportExtension {
    /**
     * Constructor.
     * @param pTargetElementReference - Component html element reference.
     * @param pComponentManagerReference - Component manager reference.
     */
    constructor(pTargetElementReference, pComponentManagerReference) {
        this.mHtmlElement = pTargetElementReference.value;
        this.mUserObjectHandler = pComponentManagerReference.value.userObjectHandler;
        // All exported properties of target and parent classes.
        const lExportedPropertyList = new core_data_1.List();
        let lClass = this.mUserObjectHandler.userClass;
        do {
            // Find all exported properties of current class layer and add all to merged property list.
            const lPropertyList = core_dependency_injection_1.Metadata.get(lClass).getMetadata(ExportExtension_1.METADATA_EXPORTED_PROPERTIES);
            if (lPropertyList) {
                lExportedPropertyList.push(...lPropertyList);
            }
            // Get next inherited parent class. Exit when no parent was found.
            // eslint-disable-next-line no-cond-assign
        } while (lClass = Object.getPrototypeOf(lClass));
        // Connect exported properties with distinct list.
        this.connectExportedProperties(lExportedPropertyList.distinct());
    }
    /**
     * Connect exported properties to html element attributes with the same name.
     * @param pExportedProperties - Exported user object properties.
     */
    connectExportedProperties(pExportedProperties) {
        this.exportPropertyAsAttribute(pExportedProperties);
        this.patchHtmlAttributes(pExportedProperties);
    }
    /**
     * Export exported properties so that exported user class properties can be accessed from html element.
     */
    exportPropertyAsAttribute(pExportedProperties) {
        // Each exported property.
        for (const lExportProperty of pExportedProperties) {
            // Get property descriptor. HTMLElement has no descriptors -,-
            const lDescriptor = {}; //Object.getOwnPropertyDescriptor(this.mHtmlElement, lExportProperty);
            lDescriptor.enumerable = true;
            lDescriptor.configurable = true;
            delete lDescriptor.value;
            delete lDescriptor.writable;
            // Setter and getter of this property. Execute changes inside component handlers change detection.
            lDescriptor.set = (pValue) => {
                Reflect.set(this.mUserObjectHandler.userObject, lExportProperty, pValue);
                // Call OnAttributeChange.
                this.mUserObjectHandler.callOnPwbAttributeChange(lExportProperty);
            };
            lDescriptor.get = () => {
                let lValue = Reflect.get(this.mUserObjectHandler.userObject, lExportProperty);
                // Bind "this" context to the exported function.
                if (typeof lValue === 'function') {
                    lValue = lValue.bind(this.mUserObjectHandler.userObject);
                }
                return lValue;
            };
            Object.defineProperty(this.mHtmlElement, lExportProperty, lDescriptor);
        }
    }
    /**
     * Patch setAttribute and getAttribute to set and get exported values.
     */
    patchHtmlAttributes(pExportedProperties) {
        // Get original functions.
        const lOriginalSetAttribute = this.mHtmlElement.setAttribute;
        const lOriginalGetAttribute = this.mHtmlElement.getAttribute;
        // Patch set attribute
        this.mHtmlElement.setAttribute = (pQualifiedName, pValue) => {
            // Check if attribute is an exported value and set value to user class object.
            if (pExportedProperties.includes(pQualifiedName)) {
                Reflect.set(this.mHtmlElement, pQualifiedName, pValue);
            }
            lOriginalSetAttribute.call(this.mHtmlElement, pQualifiedName, pValue);
        };
        // Patch get attribute
        this.mHtmlElement.getAttribute = (pQualifiedName) => {
            // Check if attribute is an exported value and return value of user class object.
            if (pExportedProperties.includes(pQualifiedName)) {
                return Reflect.get(this.mHtmlElement, pQualifiedName);
            }
            return lOriginalGetAttribute.call(this.mHtmlElement, pQualifiedName);
        };
    }
};
ExportExtension.METADATA_EXPORTED_PROPERTIES = 'pwb:exported_properties';
ExportExtension = ExportExtension_1 = __decorate([
    (0, pwb_extension_decorator_1.PwbExtension)({
        type: extension_type_1.ExtensionType.Component,
        mode: extension_mode_1.ExtensionMode.Patch
    }),
    __metadata("design:paramtypes", [component_element_reference_1.ComponentElementReference, component_manager_reference_1.ComponentManagerReference])
], ExportExtension);
exports.ExportExtension = ExportExtension;
//# sourceMappingURL=export-extension.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/export/pwb-export.decorator.js":
/*!******************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/export/pwb-export.decorator.js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PwbExport = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const export_extension_1 = __webpack_require__(/*! ./export-extension */ "../kartoffelgames.web.potato_web_builder/library/source/default/export/export-extension.js");
/**
 * AtScript.
 * Export value to component element.
 */
function PwbExport(pTarget, pPropertyKey) {
    // Usually Class Prototype. Globaly.
    const lPrototype = pTarget;
    const lUserClassConstructor = lPrototype.constructor;
    // Check if real decorator on static property.
    if (typeof pTarget === 'function') {
        throw new core_data_1.Exception('Event target is not for a static property.', PwbExport);
    }
    // Get property list from constructor metadata.
    const lExportedPropertyList = core_dependency_injection_1.Metadata.get(lUserClassConstructor).getMetadata(export_extension_1.ExportExtension.METADATA_EXPORTED_PROPERTIES) ?? new Array();
    lExportedPropertyList.push(pPropertyKey);
    // Set metadata.
    core_dependency_injection_1.Metadata.get(lUserClassConstructor).setMetadata(export_extension_1.ExportExtension.METADATA_EXPORTED_PROPERTIES, lExportedPropertyList);
}
exports.PwbExport = PwbExport;
//# sourceMappingURL=pwb-export.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/mustache_expression/mustache-expression-module.js":
/*!*************************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/mustache_expression/mustache-expression-module.js ***!
  \*************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MustacheExpressionModule = void 0;
const pwb_expression_module_decorator_1 = __webpack_require__(/*! ../../module/decorator/pwb-expression-module.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-expression-module.decorator.js");
const module_expression_reference_1 = __webpack_require__(/*! ../../injection_reference/module-expression-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-expression-reference.js");
const module_layer_values_reference_1 = __webpack_require__(/*! ../../injection_reference/module-layer-values-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-layer-values-reference.js");
const component_scope_executor_1 = __webpack_require__(/*! ../../module/execution/component-scope-executor */ "../kartoffelgames.web.potato_web_builder/library/source/module/execution/component-scope-executor.js");
/**
 * Wannabe Mustache expression executor.
 * Executes readonly expressions inside double brackets.
 */
let MustacheExpressionModule = class MustacheExpressionModule {
    /**
     * Constructor.
     * @param pValueReference - Values of component.
     */
    constructor(pValueReference, pExpressionReference) {
        this.mValueHandler = pValueReference.value;
        this.mExpressionReference = pExpressionReference;
    }
    /**
     * Execute expression with ComponentScopeExecutor.
     * @param pExpression - Expression.
     * @param pValues - Component values.
     * @returns expression result.
     */
    onUpdate() {
        // Cut out mustache.
        const lExpression = this.mExpressionReference.value;
        const lExpressionText = lExpression.substr(2, lExpression.length - 4);
        // Execute string
        const lExecutionResult = component_scope_executor_1.ComponentScopeExecutor.executeSilent(lExpressionText, this.mValueHandler);
        return lExecutionResult?.toString();
    }
};
MustacheExpressionModule = __decorate([
    (0, pwb_expression_module_decorator_1.PwbExpressionModule)({
        selector: /{{.*?}}/
    }),
    __metadata("design:paramtypes", [module_layer_values_reference_1.ModuleLayerValuesReference, module_expression_reference_1.ModuleExpressionReference])
], MustacheExpressionModule);
exports.MustacheExpressionModule = MustacheExpressionModule;
//# sourceMappingURL=mustache-expression-module.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/one_way_binding/one-way-binding-attribute-module.js":
/*!***************************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/one_way_binding/one-way-binding-attribute-module.js ***!
  \***************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OneWayBindingAttributeModule = void 0;
const web_change_detection_1 = __webpack_require__(/*! @kartoffelgames/web.change-detection */ "../kartoffelgames.web.change_detection/library/source/index.js");
const pwb_static_attribute_module_decorator_1 = __webpack_require__(/*! ../../module/decorator/pwb-static-attribute-module.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-static-attribute-module.decorator.js");
const module_access_type_1 = __webpack_require__(/*! ../../module/enum/module-access-type */ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-access-type.js");
const module_attribute_reference_1 = __webpack_require__(/*! ../../injection_reference/module-attribute-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-attribute-reference.js");
const module_layer_values_reference_1 = __webpack_require__(/*! ../../injection_reference/module-layer-values-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-layer-values-reference.js");
const module_target_reference_1 = __webpack_require__(/*! ../../injection_reference/module-target-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-target-reference.js");
const component_scope_executor_1 = __webpack_require__(/*! ../../module/execution/component-scope-executor */ "../kartoffelgames.web.potato_web_builder/library/source/module/execution/component-scope-executor.js");
/**
 * Bind value to view object.
 * If the user class object changes, the view object value gets updated.
 */
let OneWayBindingAttributeModule = class OneWayBindingAttributeModule {
    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pValueReference - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    constructor(pTargetReference, pValueReference, pAttributeReference) {
        this.mTarget = pTargetReference.value;
        this.mValueHandler = pValueReference.value;
        // Get execution string.
        this.mExecutionString = pAttributeReference.value.value;
        // Get view object information. Remove starting [ and end ].
        const lAttributeKey = pAttributeReference.value.qualifiedName;
        this.mTargetProperty = lAttributeKey.substr(1, lAttributeKey.length - 2);
        // Create empty compare handler with unique symbol.
        this.mValueCompare = new web_change_detection_1.CompareHandler(Symbol('Uncompareable'), 4);
    }
    /**
     * Update value on target element.
     * @returns false for 'do not update'.
     */
    onUpdate() {
        const lExecutionResult = component_scope_executor_1.ComponentScopeExecutor.executeSilent(this.mExecutionString, this.mValueHandler);
        if (!this.mValueCompare.compareAndUpdate(lExecutionResult)) {
            // Set view object property.
            Reflect.set(this.mTarget, this.mTargetProperty, lExecutionResult);
            return true;
        }
        return false;
    }
};
OneWayBindingAttributeModule = __decorate([
    (0, pwb_static_attribute_module_decorator_1.PwbStaticAttributeModule)({
        selector: /^\[[\w$]+\]$/,
        access: module_access_type_1.ModuleAccessType.Read,
        forbiddenInManipulatorScopes: false
    }),
    __metadata("design:paramtypes", [module_target_reference_1.ModuleTargetReference, module_layer_values_reference_1.ModuleLayerValuesReference, module_attribute_reference_1.ModuleAttributeReference])
], OneWayBindingAttributeModule);
exports.OneWayBindingAttributeModule = OneWayBindingAttributeModule;
//# sourceMappingURL=one-way-binding-attribute-module.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/pwb_app_injection/pwb-app-injection-extension.js":
/*!************************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/pwb_app_injection/pwb-app-injection-extension.js ***!
  \************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PwbAppInjectionExtension = void 0;
const web_change_detection_1 = __webpack_require__(/*! @kartoffelgames/web.change-detection */ "../kartoffelgames.web.change_detection/library/source/index.js");
const pwb_extension_decorator_1 = __webpack_require__(/*! ../../extension/decorator/pwb-extension.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/extension/decorator/pwb-extension.decorator.js");
const extension_mode_1 = __webpack_require__(/*! ../../extension/enum/extension-mode */ "../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-mode.js");
const extension_type_1 = __webpack_require__(/*! ../../extension/enum/extension-type */ "../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-type.js");
const pwb_app_1 = __webpack_require__(/*! ../../pwb-app */ "../kartoffelgames.web.potato_web_builder/library/source/pwb-app.js");
let PwbAppInjectionExtension = class PwbAppInjectionExtension {
    /**
     * Collect all injectables.
     */
    onCollectInjections() {
        const lInjectionList = new Array();
        lInjectionList.push(pwb_app_1.PwbApp.getChangeDetectionApp(web_change_detection_1.ChangeDetection.current) ?? null);
        return lInjectionList;
    }
};
PwbAppInjectionExtension = __decorate([
    (0, pwb_extension_decorator_1.PwbExtension)({
        type: extension_type_1.ExtensionType.Component | extension_type_1.ExtensionType.Module,
        mode: extension_mode_1.ExtensionMode.Inject
    })
], PwbAppInjectionExtension);
exports.PwbAppInjectionExtension = PwbAppInjectionExtension;
//# sourceMappingURL=pwb-app-injection-extension.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/pwb_child/pwb-child-attribute-module.js":
/*!***************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/pwb_child/pwb-child-attribute-module.js ***!
  \***************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PwbChildAttributeModule = void 0;
const pwb_static_attribute_module_decorator_1 = __webpack_require__(/*! ../../module/decorator/pwb-static-attribute-module.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-static-attribute-module.decorator.js");
const module_access_type_1 = __webpack_require__(/*! ../../module/enum/module-access-type */ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-access-type.js");
const module_attribute_reference_1 = __webpack_require__(/*! ../../injection_reference/module-attribute-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-attribute-reference.js");
const component_manager_reference_1 = __webpack_require__(/*! ../../injection_reference/component-manager-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-manager-reference.js");
const module_layer_values_reference_1 = __webpack_require__(/*! ../../injection_reference/module-layer-values-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-layer-values-reference.js");
const module_target_reference_1 = __webpack_require__(/*! ../../injection_reference/module-target-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-target-reference.js");
/**
 * Used with "#IdChildName" like => #PasswordInput.
 */
let PwbChildAttributeModule = class PwbChildAttributeModule {
    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pLayerValues - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    constructor(pTargetReference, pValueReference, pAttributeReference, pComponentManager) {
        const lTarget = pTargetReference.value;
        const lRegistedElement = pComponentManager.value.updateHandler.registerObject(lTarget);
        // Add current html element to temporary root values. Delete starting #.
        pValueReference.value.setRootValue(pAttributeReference.value.qualifiedName.substring(1), lRegistedElement);
    }
};
PwbChildAttributeModule = __decorate([
    (0, pwb_static_attribute_module_decorator_1.PwbStaticAttributeModule)({
        selector: /^#[[\w$]+$/,
        access: module_access_type_1.ModuleAccessType.Write,
        forbiddenInManipulatorScopes: true
    }),
    __metadata("design:paramtypes", [module_target_reference_1.ModuleTargetReference, module_layer_values_reference_1.ModuleLayerValuesReference, module_attribute_reference_1.ModuleAttributeReference, component_manager_reference_1.ComponentManagerReference])
], PwbChildAttributeModule);
exports.PwbChildAttributeModule = PwbChildAttributeModule;
//# sourceMappingURL=pwb-child-attribute-module.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/pwb_child/pwb-child.decorator.js":
/*!********************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/pwb_child/pwb-child.decorator.js ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PwbChild = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const component_connection_1 = __webpack_require__(/*! ../../component/component-connection */ "../kartoffelgames.web.potato_web_builder/library/source/component/component-connection.js");
/**
 * AtScript. Id child
 * @param pIdChildName - Name of id child.
 */
function PwbChild(pIdChildName) {
    return (pTarget, pPropertyKey) => {
        // Check if real decorator on static property.
        if (typeof pTarget === 'function') {
            throw new core_data_1.Exception('Event target is not for a static property.', PwbChild);
        }
        // Define getter accessor that returns id child.
        Object.defineProperty(pTarget, pPropertyKey, {
            get() {
                // Get component manager and exit if target is not a component.
                const lComponentManager = component_connection_1.ComponentConnection.componentManagerOf(this);
                if (!lComponentManager) {
                    throw new core_data_1.Exception('Target is not a Component', this);
                }
                // Get root value. This should be the child.
                const lIdChild = lComponentManager.rootValues.getValue(pIdChildName);
                if (lIdChild instanceof Element) {
                    return lIdChild;
                }
                else {
                    throw new core_data_1.Exception(`Can't find child "${pIdChildName}".`, this);
                }
            }
        });
    };
}
exports.PwbChild = PwbChild;
//# sourceMappingURL=pwb-child.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/pwb_for_of/for-of-manipulator-attribute-module.js":
/*!*************************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/pwb_for_of/for-of-manipulator-attribute-module.js ***!
  \*************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForOfManipulatorAttributeModule = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const web_change_detection_1 = __webpack_require__(/*! @kartoffelgames/web.change-detection */ "../kartoffelgames.web.change_detection/library/source/index.js");
const layer_values_1 = __webpack_require__(/*! ../../component/values/layer-values */ "../kartoffelgames.web.potato_web_builder/library/source/component/values/layer-values.js");
const pwb_multiplicator_attribute_module_decorator_1 = __webpack_require__(/*! ../../module/decorator/pwb-multiplicator-attribute-module.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-multiplicator-attribute-module.decorator.js");
const module_attribute_reference_1 = __webpack_require__(/*! ../../injection_reference/module-attribute-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-attribute-reference.js");
const module_layer_values_reference_1 = __webpack_require__(/*! ../../injection_reference/module-layer-values-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-layer-values-reference.js");
const module_template_reference_1 = __webpack_require__(/*! ../../injection_reference/module-template-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-template-reference.js");
const multiplicator_result_1 = __webpack_require__(/*! ../../module/result/multiplicator-result */ "../kartoffelgames.web.potato_web_builder/library/source/module/result/multiplicator-result.js");
const component_scope_executor_1 = __webpack_require__(/*! ../../module/execution/component-scope-executor */ "../kartoffelgames.web.potato_web_builder/library/source/module/execution/component-scope-executor.js");
/**
 * For of.
 * Doublicates html element for each item in object or array.
 * Syntax: "[CustomName] of [List] (;[CustomIndexName] = $index)?"
 */
let ForOfManipulatorAttributeModule = class ForOfManipulatorAttributeModule {
    /**
     * Constructor.
     * @param pTemplateReference - Target templat.
     * @param pValueReferece - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    constructor(pTemplateReference, pValueReferece, pAttributeReference) {
        /**
         * Add template for element function.
         * @param pModuleResult - module result.
         * @param pExpression - for of expression.
         * @param pObjectValue - value.
         * @param pObjectKey - value key.
         */
        this.addTempateForElement = (pModuleResult, pExpression, pObjectValue, pObjectKey) => {
            const lClonedTemplate = this.mTemplateReference.value.clone();
            const lComponentValues = new layer_values_1.LayerValues(this.mValueHandler);
            lComponentValues.setLayerValue(pExpression.variable, pObjectValue);
            // If custom index is used.
            if (pExpression.indexName) {
                // Add index key as extenal value to execution.
                const lExternalValues = new core_data_1.Dictionary();
                lExternalValues.add('$index', pObjectKey);
                // Execute index expression. Expression is set when index name is set.
                const lIndexExpressionResult = component_scope_executor_1.ComponentScopeExecutor.executeSilent(pExpression.indexExpression, lComponentValues, lExternalValues);
                // Set custom index name as temporary value.
                lComponentValues.setLayerValue(pExpression.indexName, lIndexExpressionResult);
            }
            // Add element.
            pModuleResult.addElement(lClonedTemplate, lComponentValues);
        };
        this.mTemplateReference = pTemplateReference;
        this.mValueHandler = pValueReferece.value;
        this.mAttributeReference = pAttributeReference;
        this.mCompareHandler = new web_change_detection_1.CompareHandler(Symbol('Uncompareable'), 4);
    }
    /**
     * Process module.
     * Execute attribute value and decide if template should be rendered.
     */
    onUpdate() {
        // [CustomName:1] of [List value:2] (;[CustomIndexName:4]=[Index calculating with "index" as key:5])?
        const lRegexAttributeInformation = new RegExp(/^\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*of\s+([^;]+)\s*(;\s*([a-zA-Z]+[a-zA-Z0-9]*)\s*=\s*(.*)\s*)?$/);
        // If attribute value does match regex.
        const lAttributeInformation = lRegexAttributeInformation.exec(this.mAttributeReference.value.value);
        if (lAttributeInformation) {
            // Split match into useable parts.
            const lExpression = {
                variable: lAttributeInformation[1],
                value: lAttributeInformation[2],
                indexName: lAttributeInformation[4],
                indexExpression: lAttributeInformation[5]
            };
            // Create module result that watches for changes in [PropertyName].
            const lModuleResult = new multiplicator_result_1.MultiplicatorResult();
            // Try to get list object from component values.
            const lListObject = component_scope_executor_1.ComponentScopeExecutor.executeSilent(lExpression.value, this.mValueHandler);
            // Skip if values are the same.
            if (this.mCompareHandler.compareAndUpdate(lListObject)) {
                return null;
            }
            // Only proceed if value is added to html element.
            if (typeof lListObject === 'object' && lListObject !== null || Array.isArray(lListObject)) {
                // Iterator iterator and
                if (Symbol.iterator in lListObject) {
                    const lIterator = lListObject;
                    let lIndex = 0;
                    for (const lValue of lIterator) {
                        // Add new template item and count index.
                        this.addTempateForElement(lModuleResult, lExpression, lValue, lIndex++);
                    }
                }
                else {
                    for (const lListObjectKey in lListObject) {
                        this.addTempateForElement(lModuleResult, lExpression, lListObject[lListObjectKey], lListObjectKey);
                    }
                }
                return lModuleResult;
            }
            else {
                // Just ignore. Can be changed later.
                return null;
            }
        }
        else {
            throw new core_data_1.Exception(`pwbFor-Paramater value has wrong format: ${this.mAttributeReference.value.value.toString()}`, this);
        }
    }
};
ForOfManipulatorAttributeModule = __decorate([
    (0, pwb_multiplicator_attribute_module_decorator_1.PwbMultiplicatorAttributeModule)({
        selector: /^\*pwbFor$/
    }),
    __metadata("design:paramtypes", [module_template_reference_1.ModuleTemplateReference, module_layer_values_reference_1.ModuleLayerValuesReference, module_attribute_reference_1.ModuleAttributeReference])
], ForOfManipulatorAttributeModule);
exports.ForOfManipulatorAttributeModule = ForOfManipulatorAttributeModule;
//# sourceMappingURL=for-of-manipulator-attribute-module.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/pwb_if/if-manipulator-attribute-module.js":
/*!*****************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/pwb_if/if-manipulator-attribute-module.js ***!
  \*****************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IfManipulatorAttributeModule = void 0;
const layer_values_1 = __webpack_require__(/*! ../../component/values/layer-values */ "../kartoffelgames.web.potato_web_builder/library/source/component/values/layer-values.js");
const pwb_multiplicator_attribute_module_decorator_1 = __webpack_require__(/*! ../../module/decorator/pwb-multiplicator-attribute-module.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-multiplicator-attribute-module.decorator.js");
const module_attribute_reference_1 = __webpack_require__(/*! ../../injection_reference/module-attribute-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-attribute-reference.js");
const module_layer_values_reference_1 = __webpack_require__(/*! ../../injection_reference/module-layer-values-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-layer-values-reference.js");
const module_template_reference_1 = __webpack_require__(/*! ../../injection_reference/module-template-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-template-reference.js");
const multiplicator_result_1 = __webpack_require__(/*! ../../module/result/multiplicator-result */ "../kartoffelgames.web.potato_web_builder/library/source/module/result/multiplicator-result.js");
const component_scope_executor_1 = __webpack_require__(/*! ../../module/execution/component-scope-executor */ "../kartoffelgames.web.potato_web_builder/library/source/module/execution/component-scope-executor.js");
/**
 * If expression.
 * If the executed result of the attribute value is false, the element will not be append to view.
 */
let IfManipulatorAttributeModule = class IfManipulatorAttributeModule {
    /**
     * Constructor.
     * @param pTemplateReference - Target templat.
     * @param pValueReference - Values of component.
     * @param pAttributeReference - Attribute of module.
     */
    constructor(pTemplateReference, pValueReference, pAttributeReference) {
        this.mTemplateReference = pTemplateReference;
        this.mValueHandler = pValueReference.value;
        this.mAttributeReference = pAttributeReference;
        this.mLastBoolean = false;
        this.mFirstCompare = true;
    }
    /**
     * Decide if module / element should be updated.
     * @returns if element of module should be updated.
     */
    onUpdate() {
        const lExecutionResult = component_scope_executor_1.ComponentScopeExecutor.executeSilent(this.mAttributeReference.value.value, this.mValueHandler);
        if (this.mFirstCompare || !!lExecutionResult !== this.mLastBoolean) {
            this.mLastBoolean = !!lExecutionResult;
            this.mFirstCompare = false;
            // If in any way the execution result is true, add template to result.
            const lModuleResult = new multiplicator_result_1.MultiplicatorResult();
            if (lExecutionResult) {
                lModuleResult.addElement(this.mTemplateReference.value.clone(), new layer_values_1.LayerValues(this.mValueHandler));
            }
            return lModuleResult;
        }
        else {
            // No update needed.
            return null;
        }
    }
};
IfManipulatorAttributeModule = __decorate([
    (0, pwb_multiplicator_attribute_module_decorator_1.PwbMultiplicatorAttributeModule)({
        selector: /^\*pwbIf$/
    }),
    __metadata("design:paramtypes", [module_template_reference_1.ModuleTemplateReference, module_layer_values_reference_1.ModuleLayerValuesReference, module_attribute_reference_1.ModuleAttributeReference])
], IfManipulatorAttributeModule);
exports.IfManipulatorAttributeModule = IfManipulatorAttributeModule;
//# sourceMappingURL=if-manipulator-attribute-module.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/slot_attribute/slot-attribute-module.js":
/*!***************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/slot_attribute/slot-attribute-module.js ***!
  \***************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SlotAttributeModule = void 0;
const core_xml_1 = __webpack_require__(/*! @kartoffelgames/core.xml */ "../kartoffelgames.core.xml/library/source/index.js");
const element_creator_1 = __webpack_require__(/*! ../../component/content/element-creator */ "../kartoffelgames.web.potato_web_builder/library/source/component/content/element-creator.js");
const module_attribute_reference_1 = __webpack_require__(/*! ../../injection_reference/module-attribute-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-attribute-reference.js");
const module_target_reference_1 = __webpack_require__(/*! ../../injection_reference/module-target-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-target-reference.js");
const pwb_static_attribute_module_decorator_1 = __webpack_require__(/*! ../../module/decorator/pwb-static-attribute-module.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-static-attribute-module.decorator.js");
const module_access_type_1 = __webpack_require__(/*! ../../module/enum/module-access-type */ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-access-type.js");
let SlotAttributeModule = class SlotAttributeModule {
    /**
     * Constructor.
     * @param pAttributeReference - Attribute of module.
     * @param pTargetReference - Target element.
     */
    constructor(pAttributeReference, pTargetReference) {
        this.mTargetReference = pTargetReference;
        this.mAttributeReference = pAttributeReference;
        // Get name of slot. Remove starting $.
        const lAttribute = this.mAttributeReference.value;
        const lSlotName = lAttribute.name.substring(1);
        // Create slot xml element.
        const lSlotXmlElement = new core_xml_1.XmlElement();
        lSlotXmlElement.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        lSlotXmlElement.tagName = 'slot';
        // Create slot html element.
        const lSlotElement = element_creator_1.ElementCreator.createElement(lSlotXmlElement);
        // Set slot as default of name is $DEFAUKLT
        if (lSlotName !== 'DEFAULT') {
            lSlotElement.setAttribute('name', lSlotName);
        }
        // Add slot element to target. Gets append as first element.
        pTargetReference.value?.appendChild(lSlotElement);
    }
};
SlotAttributeModule = __decorate([
    (0, pwb_static_attribute_module_decorator_1.PwbStaticAttributeModule)({
        selector: /^\$[\w]+$/,
        forbiddenInManipulatorScopes: false,
        access: module_access_type_1.ModuleAccessType.Write
    }),
    __metadata("design:paramtypes", [module_attribute_reference_1.ModuleAttributeReference, module_target_reference_1.ModuleTargetReference])
], SlotAttributeModule);
exports.SlotAttributeModule = SlotAttributeModule;
//# sourceMappingURL=slot-attribute-module.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/default/two_way_binding/two-way-binding-attribute-module.js":
/*!***************************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/default/two_way_binding/two-way-binding-attribute-module.js ***!
  \***************************************************************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TwoWayBindingAttributeModule = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const web_change_detection_1 = __webpack_require__(/*! @kartoffelgames/web.change-detection */ "../kartoffelgames.web.change_detection/library/source/index.js");
const pwb_static_attribute_module_decorator_1 = __webpack_require__(/*! ../../module/decorator/pwb-static-attribute-module.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-static-attribute-module.decorator.js");
const module_access_type_1 = __webpack_require__(/*! ../../module/enum/module-access-type */ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-access-type.js");
const module_attribute_reference_1 = __webpack_require__(/*! ../../injection_reference/module-attribute-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-attribute-reference.js");
const component_manager_reference_1 = __webpack_require__(/*! ../../injection_reference/component-manager-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-manager-reference.js");
const module_layer_values_reference_1 = __webpack_require__(/*! ../../injection_reference/module-layer-values-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-layer-values-reference.js");
const module_target_reference_1 = __webpack_require__(/*! ../../injection_reference/module-target-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-target-reference.js");
const component_scope_executor_1 = __webpack_require__(/*! ../../module/execution/component-scope-executor */ "../kartoffelgames.web.potato_web_builder/library/source/module/execution/component-scope-executor.js");
let TwoWayBindingAttributeModule = class TwoWayBindingAttributeModule {
    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pValueReference - Values of component.
     * @param pAttribute - Attribute of module.
     */
    constructor(pTargetReference, pValueReference, pAttributeReference, pComponentManagerReference) {
        this.mTarget = pTargetReference.value;
        this.mValueHandler = pValueReference.value;
        this.mAttributeReference = pAttributeReference;
        // Get property name.
        const lAttributeKey = this.mAttributeReference.value.qualifiedName;
        this.mViewProperty = lAttributeKey.substr(2, lAttributeKey.length - 4);
        this.mThisProperty = this.mAttributeReference.value.value;
        // Add comparison handler for this and for the target view value.
        this.mUserObjectCompareHandler = new web_change_detection_1.CompareHandler(Symbol('Uncompareable'), 4);
        this.mViewCompareHandler = new web_change_detection_1.CompareHandler(Symbol('Uncompareable'), 4);
        // Patch target. Do nothing with it.
        pComponentManagerReference.value.updateHandler.registerObject(this.mTarget);
    }
    /**
     * Update view object on property change.
     * @param pProperty - Property that got updated.
     */
    onUpdate() {
        let lValueChanged = false;
        // Try to update view only on module initialize.
        const lThisValue = component_scope_executor_1.ComponentScopeExecutor.executeSilent(this.mThisProperty, this.mValueHandler);
        // Check for changes in this value.
        if (!this.mUserObjectCompareHandler.compareAndUpdate(lThisValue)) {
            // Update target view
            Reflect.set(this.mTarget, this.mViewProperty, lThisValue);
            // Update view compare with same value. 
            this.mViewCompareHandler.update(lThisValue);
            // Set flag that value was updated.
            lValueChanged = true;
        }
        else {
            const lTargetViewValue = Reflect.get(this.mTarget, this.mViewProperty);
            // Check for changes in view.
            if (!this.mViewCompareHandler.compareAndUpdate(lTargetViewValue)) {
                const lExtendedValues = new core_data_1.Dictionary();
                lExtendedValues.set('$DATA', lTargetViewValue);
                // Update value.
                component_scope_executor_1.ComponentScopeExecutor.execute(`${this.mThisProperty} = $DATA;`, this.mValueHandler, lExtendedValues);
                // Update compare.
                this.mUserObjectCompareHandler.update(lTargetViewValue);
                // Set flag that value was updated.
                lValueChanged = true;
            }
        }
        return lValueChanged;
    }
};
TwoWayBindingAttributeModule = __decorate([
    (0, pwb_static_attribute_module_decorator_1.PwbStaticAttributeModule)({
        selector: /^\[\([[\w$]+\)\]$/,
        access: module_access_type_1.ModuleAccessType.ReadWrite,
        forbiddenInManipulatorScopes: false
    }),
    __metadata("design:paramtypes", [module_target_reference_1.ModuleTargetReference, module_layer_values_reference_1.ModuleLayerValuesReference, module_attribute_reference_1.ModuleAttributeReference, component_manager_reference_1.ComponentManagerReference])
], TwoWayBindingAttributeModule);
exports.TwoWayBindingAttributeModule = TwoWayBindingAttributeModule;
//# sourceMappingURL=two-way-binding-attribute-module.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/extension/base-extension.js":
/*!*******************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/extension/base-extension.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseExtension = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const component_manager_reference_1 = __webpack_require__(/*! ../injection_reference/component-manager-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-manager-reference.js");
const extension_target_class_reference_1 = __webpack_require__(/*! ../injection_reference/extension-target-class-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/extension-target-class-reference.js");
const extension_target_object_reference_1 = __webpack_require__(/*! ../injection_reference/extension-target-object-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/extension-target-object-reference.js");
class BaseExtension {
    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    constructor(pParameter) {
        this.mExtensionClass = pParameter.extensionClass;
        this.mExtensionObjectList = new Array();
        // Create injection mapping.
        this.mInjections = new core_data_1.Dictionary();
        this.mInjections.set(component_manager_reference_1.ComponentManagerReference, new component_manager_reference_1.ComponentManagerReference(pParameter.componentManager));
        this.mInjections.set(extension_target_class_reference_1.ExtensionTargetClassReference, new extension_target_class_reference_1.ExtensionTargetClassReference(pParameter.targetClass));
        this.mInjections.set(extension_target_object_reference_1.ExtensionTargetObjectReference, new extension_target_object_reference_1.ExtensionTargetObjectReference(pParameter.targetObject ?? {}));
    }
    /**
     * Collect injections
     */
    collectInjections() {
        const lInjectionTypeList = new Array();
        for (const lExtension of this.mExtensionObjectList) {
            const lTypeList = lExtension.onCollectInjections?.();
            if (lTypeList) {
                lInjectionTypeList.push(...lTypeList);
            }
        }
        return lInjectionTypeList;
    }
    /**
     * Deconstruct module.
     */
    deconstruct() {
        for (const lExtension of this.mExtensionObjectList) {
            lExtension.onDeconstruct?.();
        }
    }
    /**
      * Create extension object.
      * @param pInjections - Local injections.
      */
    createExtensionObject(pInjections) {
        // Clone injections and extend by value reference.
        const lInjections = new core_data_1.Dictionary(this.mInjections);
        // Merge local injections.
        for (const lKey of pInjections.keys()) {
            lInjections.set(lKey, pInjections.get(lKey));
        }
        // Create module object with local injections.
        const lExtensionObject = core_dependency_injection_1.Injection.createObject(this.mExtensionClass, lInjections);
        this.mExtensionObjectList.push(lExtensionObject);
        return lExtensionObject;
    }
}
exports.BaseExtension = BaseExtension;
//# sourceMappingURL=base-extension.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/extension/component-extension.js":
/*!************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/extension/component-extension.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentExtension = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const component_element_reference_1 = __webpack_require__(/*! ../injection_reference/component-element-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-element-reference.js");
const base_extension_1 = __webpack_require__(/*! ./base-extension */ "../kartoffelgames.web.potato_web_builder/library/source/extension/base-extension.js");
class ComponentExtension extends base_extension_1.BaseExtension {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    constructor(pParameter) {
        super(pParameter);
        // Create local injection mapping.
        const lInjections = new core_data_1.Dictionary();
        lInjections.set(component_element_reference_1.ComponentElementReference, new component_element_reference_1.ComponentElementReference(pParameter.componentElement));
        // Create extension.
        this.createExtensionObject(lInjections);
    }
}
exports.ComponentExtension = ComponentExtension;
//# sourceMappingURL=component-extension.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/extension/decorator/pwb-extension.decorator.js":
/*!**************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/extension/decorator/pwb-extension.decorator.js ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PwbExtension = void 0;
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const extensions_1 = __webpack_require__(/*! ../extensions */ "../kartoffelgames.web.potato_web_builder/library/source/extension/extensions.js");
/**
 * AtScript. PWB component extension.
 */
function PwbExtension(pSettings) {
    return (pExtensionConstructor) => {
        // Set user class to be injectable
        core_dependency_injection_1.Injector.Injectable(pExtensionConstructor);
        // Register module.
        extensions_1.Extensions.add(pExtensionConstructor, pSettings.type, pSettings.mode);
    };
}
exports.PwbExtension = PwbExtension;
//# sourceMappingURL=pwb-extension.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-mode.js":
/*!************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-mode.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExtensionMode = void 0;
var ExtensionMode;
(function (ExtensionMode) {
    ExtensionMode[ExtensionMode["Inject"] = 1] = "Inject";
    ExtensionMode[ExtensionMode["Patch"] = 2] = "Patch";
})(ExtensionMode = exports.ExtensionMode || (exports.ExtensionMode = {}));
//# sourceMappingURL=extension-mode.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-type.js":
/*!************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-type.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExtensionType = void 0;
var ExtensionType;
(function (ExtensionType) {
    ExtensionType[ExtensionType["Component"] = 1] = "Component";
    ExtensionType[ExtensionType["Module"] = 2] = "Module";
})(ExtensionType = exports.ExtensionType || (exports.ExtensionType = {}));
//# sourceMappingURL=extension-type.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/extension/extensions.js":
/*!***************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/extension/extensions.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Extensions = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const extension_mode_1 = __webpack_require__(/*! ./enum/extension-mode */ "../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-mode.js");
const extension_type_1 = __webpack_require__(/*! ./enum/extension-type */ "../kartoffelgames.web.potato_web_builder/library/source/extension/enum/extension-type.js");
class Extensions {
    /**
     * Get all component extensions that inject neew types.
     */
    static get componentInjectorExtensions() {
        return core_data_1.List.newListWith(...Extensions.mComponentInjectorExtensions);
    }
    /**
     * Get all component extensions that only patches.
     */
    static get componentPatcherExtensions() {
        return core_data_1.List.newListWith(...Extensions.mComponentPatcherExtensions);
    }
    /**
     * Get all module extensions that inject neew types.
     */
    static get moduleInjectorExtensions() {
        return core_data_1.List.newListWith(...Extensions.mModuleInjectorExtensions);
    }
    /**
     * Get all module extensions that only patches..
     */
    static get modulePatcherExtensions() {
        return core_data_1.List.newListWith(...Extensions.mModulePatcherExtensions);
    }
    /**
     * Add global component extension.
     * @param pExtension - Component extension constructor.
     * @param pExtensionType - Type of extension.
     */
    static add(pExtension, pExtensionType, pExtensionMode) {
        // Module extensions.
        if ((pExtensionType & extension_type_1.ExtensionType.Module) === extension_type_1.ExtensionType.Module) {
            if (pExtensionMode === extension_mode_1.ExtensionMode.Inject) {
                Extensions.mModuleInjectorExtensions.push(pExtension);
            }
            else {
                Extensions.mModulePatcherExtensions.push(pExtension);
            }
        }
        // Component extensions.
        if ((pExtensionType & extension_type_1.ExtensionType.Component) === extension_type_1.ExtensionType.Component) {
            if (pExtensionMode === extension_mode_1.ExtensionMode.Inject) {
                Extensions.mComponentInjectorExtensions.push(pExtension);
            }
            else {
                Extensions.mComponentPatcherExtensions.push(pExtension);
            }
        }
    }
}
exports.Extensions = Extensions;
Extensions.mComponentInjectorExtensions = new Array();
Extensions.mComponentPatcherExtensions = new Array();
Extensions.mModuleInjectorExtensions = new Array();
Extensions.mModulePatcherExtensions = new Array();
//# sourceMappingURL=extensions.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/extension/module-extension.js":
/*!*********************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/extension/module-extension.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModuleExtension = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const module_attribute_reference_1 = __webpack_require__(/*! ../injection_reference/module-attribute-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-attribute-reference.js");
const module_layer_values_reference_1 = __webpack_require__(/*! ../injection_reference/module-layer-values-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-layer-values-reference.js");
const module_target_reference_1 = __webpack_require__(/*! ../injection_reference/module-target-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-target-reference.js");
const module_template_reference_1 = __webpack_require__(/*! ../injection_reference/module-template-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-template-reference.js");
const base_extension_1 = __webpack_require__(/*! ./base-extension */ "../kartoffelgames.web.potato_web_builder/library/source/extension/base-extension.js");
class ModuleExtension extends base_extension_1.BaseExtension {
    /**
     * Constructor.
     * @param pParameter - Construction parameter.
     */
    constructor(pParameter) {
        super(pParameter);
        // Create local injection mapping.
        const lInjections = new core_data_1.Dictionary();
        lInjections.set(module_template_reference_1.ModuleTemplateReference, new module_template_reference_1.ModuleTemplateReference(pParameter.template));
        if (pParameter.attribute !== null) {
            lInjections.set(module_attribute_reference_1.ModuleAttributeReference, new module_attribute_reference_1.ModuleAttributeReference(pParameter.attribute));
        }
        lInjections.set(module_layer_values_reference_1.ModuleLayerValuesReference, new module_layer_values_reference_1.ModuleLayerValuesReference(pParameter.layerValues));
        lInjections.set(module_target_reference_1.ModuleTargetReference, new module_target_reference_1.ModuleTargetReference(pParameter.element));
        // Create extension.
        this.createExtensionObject(lInjections);
    }
}
exports.ModuleExtension = ModuleExtension;
//# sourceMappingURL=module-extension.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/index.js":
/*!************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XmlAttribute = exports.XmlElement = exports.TextNode = exports.TemplateParser = exports.PwbEventListener = exports.PwbExport = exports.PwbChild = exports.PwbComponentEvent = exports.ComponentEventEmitter = exports.ComponentEvent = exports.PwbExtension = exports.PwbStaticAttributeModule = exports.PwbMultiplicatorAttributeModule = exports.PwbExpressionModule = exports.MultiplicatorResult = exports.LayerValues = exports.ModuleAccessType = exports.ComponentScopeExecutor = exports.ModuleTemplateReference = exports.ModuleTargetReference = exports.ModuleLayerValuesReference = exports.ModuleExpressionReference = exports.ModuleAttributeReference = exports.ExtensionTargetObjectReference = exports.ExtensionTargetClassReference = exports.ComponentManagerReference = exports.ComponentUpdateReference = exports.ComponentElementReference = exports.PwbComponent = exports.PwbApp = void 0;
var pwb_app_1 = __webpack_require__(/*! ./pwb-app */ "../kartoffelgames.web.potato_web_builder/library/source/pwb-app.js");
Object.defineProperty(exports, "PwbApp", ({ enumerable: true, get: function () { return pwb_app_1.PwbApp; } }));
var pwb_component_decorator_1 = __webpack_require__(/*! ./component/decorator/pwb-component.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/component/decorator/pwb-component.decorator.js");
Object.defineProperty(exports, "PwbComponent", ({ enumerable: true, get: function () { return pwb_component_decorator_1.PwbComponent; } }));
// Injections
var component_element_reference_1 = __webpack_require__(/*! ./injection_reference/component-element-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-element-reference.js");
Object.defineProperty(exports, "ComponentElementReference", ({ enumerable: true, get: function () { return component_element_reference_1.ComponentElementReference; } }));
var component_update_reference_1 = __webpack_require__(/*! ./injection_reference/component-update-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-update-reference.js");
Object.defineProperty(exports, "ComponentUpdateReference", ({ enumerable: true, get: function () { return component_update_reference_1.ComponentUpdateReference; } }));
var component_manager_reference_1 = __webpack_require__(/*! ./injection_reference/component-manager-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-manager-reference.js");
Object.defineProperty(exports, "ComponentManagerReference", ({ enumerable: true, get: function () { return component_manager_reference_1.ComponentManagerReference; } }));
var extension_target_class_reference_1 = __webpack_require__(/*! ./injection_reference/extension-target-class-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/extension-target-class-reference.js");
Object.defineProperty(exports, "ExtensionTargetClassReference", ({ enumerable: true, get: function () { return extension_target_class_reference_1.ExtensionTargetClassReference; } }));
var extension_target_object_reference_1 = __webpack_require__(/*! ./injection_reference/extension-target-object-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/extension-target-object-reference.js");
Object.defineProperty(exports, "ExtensionTargetObjectReference", ({ enumerable: true, get: function () { return extension_target_object_reference_1.ExtensionTargetObjectReference; } }));
var module_attribute_reference_1 = __webpack_require__(/*! ./injection_reference/module-attribute-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-attribute-reference.js");
Object.defineProperty(exports, "ModuleAttributeReference", ({ enumerable: true, get: function () { return module_attribute_reference_1.ModuleAttributeReference; } }));
var module_expression_reference_1 = __webpack_require__(/*! ./injection_reference/module-expression-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-expression-reference.js");
Object.defineProperty(exports, "ModuleExpressionReference", ({ enumerable: true, get: function () { return module_expression_reference_1.ModuleExpressionReference; } }));
var module_layer_values_reference_1 = __webpack_require__(/*! ./injection_reference/module-layer-values-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-layer-values-reference.js");
Object.defineProperty(exports, "ModuleLayerValuesReference", ({ enumerable: true, get: function () { return module_layer_values_reference_1.ModuleLayerValuesReference; } }));
var module_target_reference_1 = __webpack_require__(/*! ./injection_reference/module-target-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-target-reference.js");
Object.defineProperty(exports, "ModuleTargetReference", ({ enumerable: true, get: function () { return module_target_reference_1.ModuleTargetReference; } }));
var module_template_reference_1 = __webpack_require__(/*! ./injection_reference/module-template-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-template-reference.js");
Object.defineProperty(exports, "ModuleTemplateReference", ({ enumerable: true, get: function () { return module_template_reference_1.ModuleTemplateReference; } }));
// Modules
var component_scope_executor_1 = __webpack_require__(/*! ./module/execution/component-scope-executor */ "../kartoffelgames.web.potato_web_builder/library/source/module/execution/component-scope-executor.js");
Object.defineProperty(exports, "ComponentScopeExecutor", ({ enumerable: true, get: function () { return component_scope_executor_1.ComponentScopeExecutor; } }));
var module_access_type_1 = __webpack_require__(/*! ./module/enum/module-access-type */ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-access-type.js");
Object.defineProperty(exports, "ModuleAccessType", ({ enumerable: true, get: function () { return module_access_type_1.ModuleAccessType; } }));
var layer_values_1 = __webpack_require__(/*! ./component/values/layer-values */ "../kartoffelgames.web.potato_web_builder/library/source/component/values/layer-values.js");
Object.defineProperty(exports, "LayerValues", ({ enumerable: true, get: function () { return layer_values_1.LayerValues; } }));
var multiplicator_result_1 = __webpack_require__(/*! ./module/result/multiplicator-result */ "../kartoffelgames.web.potato_web_builder/library/source/module/result/multiplicator-result.js");
Object.defineProperty(exports, "MultiplicatorResult", ({ enumerable: true, get: function () { return multiplicator_result_1.MultiplicatorResult; } }));
var pwb_expression_module_decorator_1 = __webpack_require__(/*! ./module/decorator/pwb-expression-module.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-expression-module.decorator.js");
Object.defineProperty(exports, "PwbExpressionModule", ({ enumerable: true, get: function () { return pwb_expression_module_decorator_1.PwbExpressionModule; } }));
var pwb_multiplicator_attribute_module_decorator_1 = __webpack_require__(/*! ./module/decorator/pwb-multiplicator-attribute-module.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-multiplicator-attribute-module.decorator.js");
Object.defineProperty(exports, "PwbMultiplicatorAttributeModule", ({ enumerable: true, get: function () { return pwb_multiplicator_attribute_module_decorator_1.PwbMultiplicatorAttributeModule; } }));
var pwb_static_attribute_module_decorator_1 = __webpack_require__(/*! ./module/decorator/pwb-static-attribute-module.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-static-attribute-module.decorator.js");
Object.defineProperty(exports, "PwbStaticAttributeModule", ({ enumerable: true, get: function () { return pwb_static_attribute_module_decorator_1.PwbStaticAttributeModule; } }));
// Extension
var pwb_extension_decorator_1 = __webpack_require__(/*! ./extension/decorator/pwb-extension.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/extension/decorator/pwb-extension.decorator.js");
Object.defineProperty(exports, "PwbExtension", ({ enumerable: true, get: function () { return pwb_extension_decorator_1.PwbExtension; } }));
// Default extensions.
var component_event_1 = __webpack_require__(/*! ./default/component-event/component-event */ "../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event.js");
Object.defineProperty(exports, "ComponentEvent", ({ enumerable: true, get: function () { return component_event_1.ComponentEvent; } }));
var component_event_emitter_1 = __webpack_require__(/*! ./default/component-event/component-event-emitter */ "../kartoffelgames.web.potato_web_builder/library/source/default/component-event/component-event-emitter.js");
Object.defineProperty(exports, "ComponentEventEmitter", ({ enumerable: true, get: function () { return component_event_emitter_1.ComponentEventEmitter; } }));
var pwb_component_event_decorator_1 = __webpack_require__(/*! ./default/component-event/pwb-component-event.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/default/component-event/pwb-component-event.decorator.js");
Object.defineProperty(exports, "PwbComponentEvent", ({ enumerable: true, get: function () { return pwb_component_event_decorator_1.PwbComponentEvent; } }));
var pwb_child_decorator_1 = __webpack_require__(/*! ./default/pwb_child/pwb-child.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/default/pwb_child/pwb-child.decorator.js");
Object.defineProperty(exports, "PwbChild", ({ enumerable: true, get: function () { return pwb_child_decorator_1.PwbChild; } }));
var pwb_export_decorator_1 = __webpack_require__(/*! ./default/export/pwb-export.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/default/export/pwb-export.decorator.js");
Object.defineProperty(exports, "PwbExport", ({ enumerable: true, get: function () { return pwb_export_decorator_1.PwbExport; } }));
var pwb_event_listener_decorator_1 = __webpack_require__(/*! ./default/event-listener/pwb-event-listener.decorator */ "../kartoffelgames.web.potato_web_builder/library/source/default/event-listener/pwb-event-listener.decorator.js");
Object.defineProperty(exports, "PwbEventListener", ({ enumerable: true, get: function () { return pwb_event_listener_decorator_1.PwbEventListener; } }));
// Xml
var template_parser_1 = __webpack_require__(/*! ./component/parser/template-parser */ "../kartoffelgames.web.potato_web_builder/library/source/component/parser/template-parser.js");
Object.defineProperty(exports, "TemplateParser", ({ enumerable: true, get: function () { return template_parser_1.TemplateParser; } }));
var core_xml_1 = __webpack_require__(/*! @kartoffelgames/core.xml */ "../kartoffelgames.core.xml/library/source/index.js");
Object.defineProperty(exports, "TextNode", ({ enumerable: true, get: function () { return core_xml_1.TextNode; } }));
Object.defineProperty(exports, "XmlElement", ({ enumerable: true, get: function () { return core_xml_1.XmlElement; } }));
Object.defineProperty(exports, "XmlAttribute", ({ enumerable: true, get: function () { return core_xml_1.XmlAttribute; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/base-reference.js":
/*!*****************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/injection_reference/base-reference.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseReference = void 0;
class BaseReference {
    /**
     * Constructor.
     * @param pValue - Value.
     */
    constructor(pValue) {
        this.mValue = pValue;
    }
    /**
     * Value.
     */
    get value() {
        return this.mValue;
    }
}
exports.BaseReference = BaseReference;
//# sourceMappingURL=base-reference.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-element-reference.js":
/*!******************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-element-reference.js ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentElementReference = void 0;
const base_reference_1 = __webpack_require__(/*! ./base-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/base-reference.js");
class ComponentElementReference extends base_reference_1.BaseReference {
}
exports.ComponentElementReference = ComponentElementReference;
//# sourceMappingURL=component-element-reference.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-manager-reference.js":
/*!******************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-manager-reference.js ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentManagerReference = void 0;
const base_reference_1 = __webpack_require__(/*! ./base-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/base-reference.js");
class ComponentManagerReference extends base_reference_1.BaseReference {
}
exports.ComponentManagerReference = ComponentManagerReference;
//# sourceMappingURL=component-manager-reference.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-update-reference.js":
/*!*****************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-update-reference.js ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentUpdateReference = void 0;
class ComponentUpdateReference {
    /**
     * Constructor.
     * @param pUpdateHandler - Update handler.
     */
    constructor(pUpdateHandler) {
        this.mUpdateHandler = pUpdateHandler;
    }
    /**
     * Update component manually.
     */
    update() {
        // Call update component just in case of manual updating.
        this.mUpdateHandler.forceUpdate({
            source: this,
            property: Symbol('manual update'),
            stacktrace: Error().stack
        });
    }
}
exports.ComponentUpdateReference = ComponentUpdateReference;
//# sourceMappingURL=component-update-reference.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/extension-target-class-reference.js":
/*!***********************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/injection_reference/extension-target-class-reference.js ***!
  \***********************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExtensionTargetClassReference = void 0;
const base_reference_1 = __webpack_require__(/*! ./base-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/base-reference.js");
class ExtensionTargetClassReference extends base_reference_1.BaseReference {
}
exports.ExtensionTargetClassReference = ExtensionTargetClassReference;
//# sourceMappingURL=extension-target-class-reference.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/extension-target-object-reference.js":
/*!************************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/injection_reference/extension-target-object-reference.js ***!
  \************************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExtensionTargetObjectReference = void 0;
const base_reference_1 = __webpack_require__(/*! ./base-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/base-reference.js");
class ExtensionTargetObjectReference extends base_reference_1.BaseReference {
}
exports.ExtensionTargetObjectReference = ExtensionTargetObjectReference;
//# sourceMappingURL=extension-target-object-reference.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-attribute-reference.js":
/*!*****************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-attribute-reference.js ***!
  \*****************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModuleAttributeReference = void 0;
const base_reference_1 = __webpack_require__(/*! ./base-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/base-reference.js");
class ModuleAttributeReference extends base_reference_1.BaseReference {
}
exports.ModuleAttributeReference = ModuleAttributeReference;
//# sourceMappingURL=module-attribute-reference.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-expression-reference.js":
/*!******************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-expression-reference.js ***!
  \******************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModuleExpressionReference = void 0;
const base_reference_1 = __webpack_require__(/*! ./base-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/base-reference.js");
class ModuleExpressionReference extends base_reference_1.BaseReference {
}
exports.ModuleExpressionReference = ModuleExpressionReference;
//# sourceMappingURL=module-expression-reference.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-layer-values-reference.js":
/*!********************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-layer-values-reference.js ***!
  \********************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModuleLayerValuesReference = void 0;
const base_reference_1 = __webpack_require__(/*! ./base-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/base-reference.js");
class ModuleLayerValuesReference extends base_reference_1.BaseReference {
}
exports.ModuleLayerValuesReference = ModuleLayerValuesReference;
//# sourceMappingURL=module-layer-values-reference.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-target-reference.js":
/*!**************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-target-reference.js ***!
  \**************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModuleTargetReference = void 0;
const base_reference_1 = __webpack_require__(/*! ./base-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/base-reference.js");
class ModuleTargetReference extends base_reference_1.BaseReference {
}
exports.ModuleTargetReference = ModuleTargetReference;
//# sourceMappingURL=module-target-reference.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-template-reference.js":
/*!****************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-template-reference.js ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModuleTemplateReference = void 0;
const base_reference_1 = __webpack_require__(/*! ./base-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/base-reference.js");
class ModuleTemplateReference extends base_reference_1.BaseReference {
}
exports.ModuleTemplateReference = ModuleTemplateReference;
//# sourceMappingURL=module-template-reference.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/module/base-module.js":
/*!*************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/module/base-module.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseModule = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const core_xml_1 = __webpack_require__(/*! @kartoffelgames/core.xml */ "../kartoffelgames.core.xml/library/source/index.js");
const component_manager_reference_1 = __webpack_require__(/*! ../injection_reference/component-manager-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/component-manager-reference.js");
const module_attribute_reference_1 = __webpack_require__(/*! ../injection_reference/module-attribute-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-attribute-reference.js");
const module_expression_reference_1 = __webpack_require__(/*! ../injection_reference/module-expression-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-expression-reference.js");
const module_layer_values_reference_1 = __webpack_require__(/*! ../injection_reference/module-layer-values-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-layer-values-reference.js");
const module_target_reference_1 = __webpack_require__(/*! ../injection_reference/module-target-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-target-reference.js");
const module_template_reference_1 = __webpack_require__(/*! ../injection_reference/module-template-reference */ "../kartoffelgames.web.potato_web_builder/library/source/injection_reference/module-template-reference.js");
const module_access_type_1 = __webpack_require__(/*! ./enum/module-access-type */ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-access-type.js");
const module_extensions_1 = __webpack_require__(/*! ./module-extensions */ "../kartoffelgames.web.potato_web_builder/library/source/module/module-extensions.js");
class BaseModule {
    /**
     * Constructor.
     * @param pParameter - Parameter.
     */
    constructor(pParameter) {
        // Clone template.
        this.mTemplateClone = pParameter.targetTemplate.clone();
        this.mTemplateClone.parent = pParameter.targetTemplate.parent;
        // Remove target atribute.
        if (this.mTemplateClone instanceof core_xml_1.XmlElement && pParameter.targetAttribute) {
            this.mTemplateClone.removeAttribute(pParameter.targetAttribute.qualifiedName);
        }
        this.mModuleDefinition = pParameter.moduleDefinition;
        this.mModuleClass = pParameter.moduleClass;
        this.mTargetNode = pParameter.targetNode;
        this.mTargetAttribute = pParameter.targetAttribute;
        this.mComponentManager = pParameter.componentManager;
        this.mLayerValues = pParameter.values;
        this.mModuleObjectList = new Array();
        this.mExtensionList = new Array();
        // Create injection mapping.
        this.mInjections = new core_data_1.Dictionary();
        this.mInjections.set(module_layer_values_reference_1.ModuleLayerValuesReference, new module_layer_values_reference_1.ModuleLayerValuesReference(this.mLayerValues));
        this.mInjections.set(component_manager_reference_1.ComponentManagerReference, new component_manager_reference_1.ComponentManagerReference(pParameter.componentManager));
        if (pParameter.targetAttribute !== null) {
            this.mInjections.set(module_attribute_reference_1.ModuleAttributeReference, new module_attribute_reference_1.ModuleAttributeReference(pParameter.targetAttribute));
        }
        this.mInjections.set(module_template_reference_1.ModuleTemplateReference, new module_template_reference_1.ModuleTemplateReference(this.mTemplateClone));
        this.mInjections.set(module_target_reference_1.ModuleTargetReference, new module_target_reference_1.ModuleTargetReference(pParameter.targetNode));
    }
    /**
     * If modules reads data into the view.
     */
    get isReading() {
        return (this.mModuleDefinition.access & module_access_type_1.ModuleAccessType.Read) === module_access_type_1.ModuleAccessType.Read;
    }
    /**
     * If modules writes data out of the view.
     */
    get isWriting() {
        return (this.mModuleDefinition.access & module_access_type_1.ModuleAccessType.Write) === module_access_type_1.ModuleAccessType.Write;
    }
    /**
     * Get module definition.
     */
    get moduleDefinition() {
        return this.mModuleDefinition;
    }
    /**
     * Get target attribute.
     */
    get attribute() {
        return this.mTargetAttribute;
    }
    /**
     * Get target node.
     */
    get node() {
        return this.mTargetNode;
    }
    /**
     * Deconstruct module.
     */
    deconstruct() {
        // Deconstruct extensions.
        for (const lExtensions of this.mExtensionList) {
            lExtensions.deconstruct();
        }
        // Deconstruct modules.
        for (const lModule of this.mModuleObjectList) {
            lModule.onDeconstruct?.();
        }
    }
    /**
      * Create module object.
      * @param pValue - Value for module object.
      */
    createModuleObject(pValue) {
        // Clone injections and extend by value reference.
        const lInjections = new core_data_1.Dictionary(this.mInjections);
        lInjections.set(module_expression_reference_1.ModuleExpressionReference, new module_expression_reference_1.ModuleExpressionReference(pValue));
        // Create extensions and collect extension injections.
        const lExtensions = new module_extensions_1.ModuleExtensions();
        const lExtensionInjectionList = lExtensions.executeInjectorExtensions({
            componentManager: this.mComponentManager,
            targetClass: this.mModuleClass,
            template: this.mTemplateClone,
            attribute: this.mTargetAttribute,
            layerValues: this.mLayerValues,
            element: this.mTargetNode
        });
        // Parse and merge extension injections into local injections.
        for (const lInjectionObject of lExtensionInjectionList) {
            if (typeof lInjectionObject === 'object' && lInjectionObject !== null) {
                lInjections.set(lInjectionObject.constructor, lInjectionObject);
            }
        }
        // Create module object with local injections.
        const lModuleObject = core_dependency_injection_1.Injection.createObject(this.mModuleClass, lInjections);
        this.mModuleObjectList.push(lModuleObject);
        // Execute patcher extensions and save extension for deconstructing.
        this.mExtensionList.push(lExtensions);
        lExtensions.executePatcherExtensions({
            componentManager: this.mComponentManager,
            targetClass: this.mModuleClass,
            targetObject: lModuleObject,
            template: this.mTemplateClone,
            attribute: this.mTargetAttribute,
            layerValues: this.mLayerValues,
            element: this.mTargetNode
        });
        return lModuleObject;
    }
}
exports.BaseModule = BaseModule;
//# sourceMappingURL=base-module.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-expression-module.decorator.js":
/*!*******************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-expression-module.decorator.js ***!
  \*******************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PwbExpressionModule = void 0;
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const module_access_type_1 = __webpack_require__(/*! ../enum/module-access-type */ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-access-type.js");
const module_type_1 = __webpack_require__(/*! ../enum/module-type */ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-type.js");
const modules_1 = __webpack_require__(/*! ../modules */ "../kartoffelgames.web.potato_web_builder/library/source/module/modules.js");
/**
 * AtScript. PWB Expression module.
 * @param pSettings - Module settings.
 */
function PwbExpressionModule(pSettings) {
    return (pExpressionModuleConstructor) => {
        // Set user class to be injectable
        core_dependency_injection_1.Injector.Injectable(pExpressionModuleConstructor);
        // Register module.
        modules_1.Modules.add(pExpressionModuleConstructor, {
            type: module_type_1.ModuleType.Expression,
            selector: pSettings.selector,
            forbiddenInManipulatorScopes: false,
            access: module_access_type_1.ModuleAccessType.Write
        });
    };
}
exports.PwbExpressionModule = PwbExpressionModule;
//# sourceMappingURL=pwb-expression-module.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-multiplicator-attribute-module.decorator.js":
/*!********************************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-multiplicator-attribute-module.decorator.js ***!
  \********************************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PwbMultiplicatorAttributeModule = void 0;
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const module_access_type_1 = __webpack_require__(/*! ../enum/module-access-type */ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-access-type.js");
const module_type_1 = __webpack_require__(/*! ../enum/module-type */ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-type.js");
const modules_1 = __webpack_require__(/*! ../modules */ "../kartoffelgames.web.potato_web_builder/library/source/module/modules.js");
/**
 * AtScript. PWB Multiplicator attribute module.
 * @param pSettings - Module settings.
 */
function PwbMultiplicatorAttributeModule(pSettings) {
    return (pManipulatorModuleConstructor) => {
        // Set user class to be injectable
        core_dependency_injection_1.Injector.Injectable(pManipulatorModuleConstructor);
        // Register module.
        modules_1.Modules.add(pManipulatorModuleConstructor, {
            type: module_type_1.ModuleType.Manipulator,
            selector: pSettings.selector,
            forbiddenInManipulatorScopes: false,
            access: module_access_type_1.ModuleAccessType.Write
        });
    };
}
exports.PwbMultiplicatorAttributeModule = PwbMultiplicatorAttributeModule;
//# sourceMappingURL=pwb-multiplicator-attribute-module.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-static-attribute-module.decorator.js":
/*!*************************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/module/decorator/pwb-static-attribute-module.decorator.js ***!
  \*************************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PwbStaticAttributeModule = void 0;
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const modules_1 = __webpack_require__(/*! ../modules */ "../kartoffelgames.web.potato_web_builder/library/source/module/modules.js");
const module_type_1 = __webpack_require__(/*! ../enum/module-type */ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-type.js");
/**
 * AtScript. PWB static attribute module.
 * @param pSettings - Module settings.
 */
function PwbStaticAttributeModule(pSettings) {
    return (pStaticModuleConstructor) => {
        // Set user class to be injectable
        core_dependency_injection_1.Injector.Injectable(pStaticModuleConstructor);
        // Register module.
        modules_1.Modules.add(pStaticModuleConstructor, {
            type: module_type_1.ModuleType.Static,
            selector: pSettings.selector,
            forbiddenInManipulatorScopes: pSettings.forbiddenInManipulatorScopes,
            access: pSettings.access
        });
    };
}
exports.PwbStaticAttributeModule = PwbStaticAttributeModule;
//# sourceMappingURL=pwb-static-attribute-module.decorator.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-access-type.js":
/*!*************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-access-type.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModuleAccessType = void 0;
/**
 * Access types of attribute module.
 */
var ModuleAccessType;
(function (ModuleAccessType) {
    /**
     * Module reads information from view.
     */
    ModuleAccessType[ModuleAccessType["Read"] = 1] = "Read";
    /**
     * Module writes into view.
     */
    ModuleAccessType[ModuleAccessType["Write"] = 2] = "Write";
    /**
     * Module read from view and writes into view.
     */
    ModuleAccessType[ModuleAccessType["ReadWrite"] = 3] = "ReadWrite";
})(ModuleAccessType = exports.ModuleAccessType || (exports.ModuleAccessType = {}));
//# sourceMappingURL=module-access-type.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-type.js":
/*!******************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/module/enum/module-type.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModuleType = void 0;
var ModuleType;
(function (ModuleType) {
    ModuleType[ModuleType["Static"] = 1] = "Static";
    ModuleType[ModuleType["Manipulator"] = 2] = "Manipulator";
    ModuleType[ModuleType["Expression"] = 3] = "Expression";
})(ModuleType = exports.ModuleType || (exports.ModuleType = {}));
//# sourceMappingURL=module-type.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/module/execution/component-scope-executor.js":
/*!************************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/module/execution/component-scope-executor.js ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ComponentScopeExecutor = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const web_change_detection_1 = __webpack_require__(/*! @kartoffelgames/web.change-detection */ "../kartoffelgames.web.change_detection/library/source/index.js");
/**
 * Executes string in set component values scope.
 */
class ComponentScopeExecutor {
    /**
     * Execute string in userclass context.
     * @param pExpression - Expression to execute.
     * @param pValues - Current component values.
     * @param pExtenedData - Extended data that are only exist for this execution.
     */
    static execute(pExpression, pValues, pExtenedData) {
        const lReferencedValues = ComponentScopeExecutor.extractReferences(pExpression);
        const lExtendedData = pExtenedData ?? new core_data_1.Dictionary();
        const lContext = pValues.componentManager.userObjectHandler.userObject;
        const lEvaluatedFunction = ComponentScopeExecutor.createEvaluationFunktion(pExpression, lReferencedValues, pValues, lExtendedData);
        return lEvaluatedFunction.call(lContext);
    }
    /**
     * Execute string in userclass context.
     * Does not trigger change events.
     * @param pExpression - Expression to execute.
     * @param pValues - Current component values.
     * @param pExtenedData - Extended data that are only exist for this execution.
     */
    static executeSilent(pExpression, pValues, pExtenedData) {
        const lCurrentChangeDetection = web_change_detection_1.ChangeDetection.current;
        return lCurrentChangeDetection.silentExecution(() => {
            return ComponentScopeExecutor.execute(pExpression, pValues, pExtenedData);
        });
    }
    /**
     * Creates a function that returns the expression result value.
     * @param _pExpression - Expression to execute.
     * @param _pReferenceNameList - Names of variables that are not properties from user class object.
     * @param _pReferencedValues - Current component values.
     * @param _pExtenedValue - Extended data that are only exist for this execution.
     * @returns
     */
    static createEvaluationFunktion(_pExpression, _pReferenceNameList, _pReferencedValues, _pExtenedValue) {
        let lString;
        // Starting function
        lString = '(function() {return function () {';
        // Add all enviroment variables.
        for (const lReferenceName of _pReferenceNameList) {
            // Check if reference is a extended data value.
            if (_pExtenedValue.has(lReferenceName)) {
                lString += `const ${lReferenceName} = _pExtenedValue.get('${lReferenceName}');`;
            }
            else {
                lString += `const ${lReferenceName} = _pReferencedValues.getValue('${lReferenceName}');`;
            }
        }
        // Add result from path.
        lString += `return ${_pExpression};`;
        // Ending function
        lString += '}})();';
        // Return evaluated function.
        return eval(lString);
    }
    /**
     * Extract all variable names that are not window or this.
     * @param pExpression - Expression.
     */
    static extractReferences(pExpression) {
        const lSystemNames = new Array();
        lSystemNames.push('do', 'if', 'in', 'for', 'let', 'new', 'try', 'var', 'case', 'else', 'enum', 'eval', 'false', 'null', 'this', 'true', 'void', 'with', 'break', 'catch', 'class', 'const', 'super', 'throw', 'while', 'yield', 'delete', 'export', 'import', 'public', 'return', 'static', 'switch', 'typeof', 'default', 'extends', 'finally', 'package', 'private', 'continue', 'debugger', 'function', 'arguments', 'interface', 'protected', 'implements', 'instanceof', 'self', 'window');
        const lFindingRegex = /"[^"]*?"|'[^']*?'|`[^`]*?`|\.[a-zA-Z0-9_$#]*|[a-zA-Z0-9_$#]+/g;
        let lFoundOccurrence;
        const lResult = new core_data_1.List();
        // Find all words that can be a variable.
        while ((lFoundOccurrence = lFindingRegex.exec(pExpression))) {
            const lVariableName = lFoundOccurrence[0];
            // Ignore names in strings, numbers and properties.
            if (!lVariableName.startsWith('"') && !lVariableName.startsWith(`'`) && !lVariableName.startsWith('`') && !/^[0-9]/.test(lVariableName) && !lVariableName.startsWith('.')) {
                // Ignore system names.
                if (!lSystemNames.includes(lVariableName)) {
                    lResult.push(lVariableName);
                }
            }
        }
        return lResult.distinct();
    }
}
exports.ComponentScopeExecutor = ComponentScopeExecutor;
//# sourceMappingURL=component-scope-executor.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/module/expression-module.js":
/*!*******************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/module/expression-module.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ExpressionModule = void 0;
const base_module_1 = __webpack_require__(/*! ./base-module */ "../kartoffelgames.web.potato_web_builder/library/source/module/base-module.js");
class ExpressionModule extends base_module_1.BaseModule {
    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    constructor(pParameter) {
        super({
            ...pParameter,
            targetAttribute: ('targetAttribute' in pParameter) ? pParameter.targetAttribute : null
        });
        this.mValueWasSet = false;
        this.mProcessList = new Array();
        this.mLastResult = null;
        this.mValueWasSet = false;
        // Get value from attribute or use target textnode.
        let lTargetValue;
        if ('targetAttribute' in pParameter) {
            lTargetValue = pParameter.targetAttribute.value;
        }
        else {
            lTargetValue = pParameter.targetTemplate.text;
        }
        // Create module object for every expression inside value.
        const lModuleList = new Array();
        for (const lExpressionMatch of lTargetValue.matchAll(new RegExp(pParameter.moduleDefinition.selector, 'g'))) {
            lModuleList.push(this.createModuleObject(lExpressionMatch[0]));
        }
        // Split list by every expression.
        const lEmptyValueList = lTargetValue.split(new RegExp(pParameter.moduleDefinition.selector, 'g'));
        // Zip empty expressions with module object list.
        let lModuleIndex = 0;
        for (const lEmptyValue of lEmptyValueList) {
            this.mProcessList.push(lEmptyValue);
            if (lModuleIndex < lModuleList.length) {
                this.mProcessList.push(lModuleList[lModuleIndex]);
            }
            lModuleIndex++;
        }
    }
    /**
     * Update expressions.
     */
    update() {
        // Reduce process list to single string.
        const lNewValue = this.mProcessList.reduce((pReducedValue, pNextValue) => {
            let lProcessedValue;
            if (typeof pNextValue === 'string') {
                lProcessedValue = pNextValue;
            }
            else {
                lProcessedValue = pNextValue.onUpdate();
            }
            return pReducedValue + lProcessedValue;
        }, '');
        // Update value if new value was processed.
        if (!this.mValueWasSet || this.mLastResult !== lNewValue) {
            this.mValueWasSet = true;
            // Node for expressions is allways set.
            const lNode = this.node;
            // Add result text to TextNode or as attribute.
            if (lNode instanceof Element) {
                const lAttribute = this.attribute;
                lNode.setAttribute(lAttribute.qualifiedName, lNewValue);
            }
            else { // Text
                lNode.nodeValue = lNewValue;
            }
            // Save last value.
            this.mLastResult = lNewValue;
            return true;
        }
        else {
            return false;
        }
    }
}
exports.ExpressionModule = ExpressionModule;
//# sourceMappingURL=expression-module.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/module/module-extensions.js":
/*!*******************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/module/module-extensions.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ModuleExtensions = void 0;
const module_extension_1 = __webpack_require__(/*! ../extension/module-extension */ "../kartoffelgames.web.potato_web_builder/library/source/extension/module-extension.js");
const extensions_1 = __webpack_require__(/*! ../extension/extensions */ "../kartoffelgames.web.potato_web_builder/library/source/extension/extensions.js");
// Import default extensions.
__webpack_require__(/*! ../default/event-listener/event-listener-module-extension */ "../kartoffelgames.web.potato_web_builder/library/source/default/event-listener/event-listener-module-extension.js");
__webpack_require__(/*! ../default/pwb_app_injection/pwb-app-injection-extension */ "../kartoffelgames.web.potato_web_builder/library/source/default/pwb_app_injection/pwb-app-injection-extension.js");
class ModuleExtensions {
    /**
     * Constructor.
     */
    constructor() {
        // Create all extensions.
        this.mExtensionList = new Array();
    }
    /**
     * Deconstruct all extensions.
     */
    deconstruct() {
        for (const lExtension of this.mExtensionList) {
            lExtension.deconstruct();
        }
    }
    /**
     * Execute patcher extensions.
     * @param pParameter - Parameter.
     */
    executeInjectorExtensions(pParameter) {
        const lInjectionTypeList = new Array();
        for (const lExtensionClass of extensions_1.Extensions.moduleInjectorExtensions) {
            // Create extension and add to extension list.
            const lExtension = new module_extension_1.ModuleExtension({
                extensionClass: lExtensionClass,
                componentManager: pParameter.componentManager,
                template: pParameter.template,
                attribute: pParameter.attribute,
                layerValues: pParameter.layerValues,
                targetClass: pParameter.targetClass,
                targetObject: null,
                element: pParameter.element
            });
            this.mExtensionList.push(lExtension);
            // Collect extensions.
            lInjectionTypeList.push(...lExtension.collectInjections());
        }
        return lInjectionTypeList;
    }
    /**
     * Execute patcher extensions.
     * @param pParameter - Parameter.
     */
    executePatcherExtensions(pParameter) {
        for (const lExtensionClass of extensions_1.Extensions.modulePatcherExtensions) {
            this.mExtensionList.push(new module_extension_1.ModuleExtension({
                extensionClass: lExtensionClass,
                componentManager: pParameter.componentManager,
                template: pParameter.template,
                attribute: pParameter.attribute,
                layerValues: pParameter.layerValues,
                targetClass: pParameter.targetClass,
                targetObject: pParameter.targetObject,
                element: pParameter.element
            }));
        }
    }
}
exports.ModuleExtensions = ModuleExtensions;
//# sourceMappingURL=module-extensions.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/module/modules.js":
/*!*********************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/module/modules.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Modules = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
class Modules {
    /**
     * Get module definitions of all modules.
     */
    static get moduleDefinitions() {
        return core_data_1.List.newListWith(...Modules.mModuleDefinition.values());
    }
    /**
     * Add module to global scope.
     * @param pModuleClass - User module class.
     * @param pModuleDefinition - Module definition.
     */
    static add(pModuleClass, pModuleDefinition) {
        Modules.mModuleClasses.set(pModuleDefinition, pModuleClass);
        Modules.mModuleDefinition.set(pModuleClass, pModuleDefinition);
    }
    /**
     * Get module definition for module class.
     * @param pModuleClass - Module class.
     */
    static getModuleClass(pModuleDefinition) {
        return Modules.mModuleClasses.get(pModuleDefinition);
    }
    /**
     * Get module definition for module class.
     * @param pModuleClass - Module class.
     */
    static getModuleDefinition(pModuleClass) {
        return Modules.mModuleDefinition.get(pModuleClass);
    }
}
exports.Modules = Modules;
Modules.mModuleClasses = new core_data_1.Dictionary();
Modules.mModuleDefinition = new core_data_1.Dictionary();
//# sourceMappingURL=modules.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/module/multiplicator-module.js":
/*!**********************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/module/multiplicator-module.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MultiplicatorModule = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const base_module_1 = __webpack_require__(/*! ./base-module */ "../kartoffelgames.web.potato_web_builder/library/source/module/base-module.js");
class MultiplicatorModule extends base_module_1.BaseModule {
    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    constructor(pParameter) {
        super({
            ...pParameter,
            targetNode: null
        });
        // Attribute is always set for multiplicator modules.
        const lAttribute = this.attribute;
        this.mModuleObject = this.createModuleObject(lAttribute.value);
    }
    /**
     * Update module.
     */
    update() {
        if (!this.mModuleObject.onUpdate) {
            throw new core_data_1.Exception('Multiplicator modules need to implement IPwbMultiplicatorModuleOnUpdate', this);
        }
        return this.mModuleObject.onUpdate();
    }
}
exports.MultiplicatorModule = MultiplicatorModule;
//# sourceMappingURL=multiplicator-module.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/module/result/multiplicator-result.js":
/*!*****************************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/module/result/multiplicator-result.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MultiplicatorResult = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
/**
 * Results for html manipulator attribute module.
 */
class MultiplicatorResult {
    /**
     * Constructor.
     * Initialize new html manipulator attribute module result.
     */
    constructor() {
        // Initialize list.
        this.mElementList = new Array();
    }
    /**
     * Get list of created elements.
     */
    get elementList() {
        return core_data_1.List.newListWith(...this.mElementList);
    }
    /**
     * Add new element to result.
     * @param pTemplateElement - New template element. Can't use same template for multiple elements.
     * @param pValues - New Value handler of element with current value handler as parent.
     */
    addElement(pTemplateElement, pValues) {
        // Check if value or temple is used in another element.
        const lDoubledIndex = this.mElementList.findIndex(pElement => {
            return pElement.template === pTemplateElement || pElement.componentValues === pValues;
        });
        // Do not allow double use of template or value handler.
        if (lDoubledIndex === -1) {
            this.mElementList.push({ template: pTemplateElement, componentValues: pValues });
        }
        else {
            throw new core_data_1.Exception("Can't add same template or value handler for multiple Elements.", this);
        }
    }
}
exports.MultiplicatorResult = MultiplicatorResult;
//# sourceMappingURL=multiplicator-result.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/module/static-module.js":
/*!***************************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/module/static-module.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StaticModule = void 0;
const base_module_1 = __webpack_require__(/*! ./base-module */ "../kartoffelgames.web.potato_web_builder/library/source/module/base-module.js");
class StaticModule extends base_module_1.BaseModule {
    /**
     * Constructor.
     * @param pParameter - Constructor parameter.
     */
    constructor(pParameter) {
        super(pParameter);
        // Create module object with attribute value. Attribute is always set for static modules.
        const lAttribute = this.attribute;
        this.mModuleObject = this.createModuleObject(lAttribute.value);
    }
    /**
     * Update module.
     */
    update() {
        return this.mModuleObject.onUpdate?.() ?? false;
    }
}
exports.StaticModule = StaticModule;
//# sourceMappingURL=static-module.js.map

/***/ }),

/***/ "../kartoffelgames.web.potato_web_builder/library/source/pwb-app.js":
/*!**************************************************************************!*\
  !*** ../kartoffelgames.web.potato_web_builder/library/source/pwb-app.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PwbApp = void 0;
const core_data_1 = __webpack_require__(/*! @kartoffelgames/core.data */ "../kartoffelgames.core.data/library/source/index.js");
const core_dependency_injection_1 = __webpack_require__(/*! @kartoffelgames/core.dependency-injection */ "../kartoffelgames.core.dependency_injection/library/source/index.js");
const core_xml_1 = __webpack_require__(/*! @kartoffelgames/core.xml */ "../kartoffelgames.core.xml/library/source/index.js");
const web_change_detection_1 = __webpack_require__(/*! @kartoffelgames/web.change-detection */ "../kartoffelgames.web.change_detection/library/source/index.js");
const component_connection_1 = __webpack_require__(/*! ./component/component-connection */ "../kartoffelgames.web.potato_web_builder/library/source/component/component-connection.js");
const component_manager_1 = __webpack_require__(/*! ./component/component-manager */ "../kartoffelgames.web.potato_web_builder/library/source/component/component-manager.js");
const element_creator_1 = __webpack_require__(/*! ./component/content/element-creator */ "../kartoffelgames.web.potato_web_builder/library/source/component/content/element-creator.js");
class PwbApp {
    /**
     * Constructor.
     * @param pAppName - name of app zone.
     */
    constructor(pAppName) {
        this.mAppSealed = false;
        this.mComponentList = new Array();
        this.mChangeDetection = new web_change_detection_1.ChangeDetection(pAppName);
        PwbApp.mChangeDetectionToApp.set(this.mChangeDetection, this);
        // Create app wrapper template.
        const lGenericDivTemplate = new core_xml_1.XmlElement();
        lGenericDivTemplate.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        lGenericDivTemplate.tagName = 'div';
        // Create app wrapper add name as data attribute.
        this.mAppComponent = element_creator_1.ElementCreator.createElement(lGenericDivTemplate);
        this.mAppComponent.setAttribute('data-app', pAppName);
        this.mAppComponent.style.setProperty('width', '100%');
        this.mAppComponent.style.setProperty('height', '100%');
        // Create app shadow root.
        this.mShadowRoot = this.mAppComponent.attachShadow({ mode: 'open' });
        // Add splashscreen container. Fullscreen, full opacity with transistion.
        this.mSplashScreen = element_creator_1.ElementCreator.createElement(lGenericDivTemplate);
        this.mSplashScreen.style.setProperty('position', 'absolute');
        this.mSplashScreen.style.setProperty('width', '100%');
        this.mSplashScreen.style.setProperty('height', '100%');
        this.mSplashScreen.style.setProperty('opacity', '1');
        this.mShadowRoot.appendChild(this.mSplashScreen);
        // Set default splash screen.
        this.mSplashScreenOptions = { background: '', content: '' };
        this.setSplashScreen({
            background: 'linear-gradient(0deg, rgba(47,67,254,1) 8%, rgba(0,23,255,1) 70%)',
            content: '<span style="color: #fff; font-family: arial; font-weight: bold;">PWB</span>',
            animationTime: 500
        });
    }
    /**
     * Get app of change detection.
     * @param pChangeDetection - Change detection.
     */
    static getChangeDetectionApp(pChangeDetection) {
        let lCurrent = pChangeDetection;
        while (lCurrent) {
            if (PwbApp.mChangeDetectionToApp.has(lCurrent)) {
                return PwbApp.mChangeDetectionToApp.get(lCurrent);
            }
            lCurrent = lCurrent.looseParent;
        }
        return undefined;
    }
    /**
     * Get app underlying content.
     */
    get content() {
        return this.mAppComponent;
    }
    /**
     * Append content to app.
     * @param pContentClass - Content constructor.
     */
    addContent(pContentClass) {
        // Sealed error.
        if (this.mAppSealed) {
            throw new core_data_1.Exception('App content is sealed after it got append to the DOM', this);
        }
        // Get content selector.
        const lSelector = core_dependency_injection_1.Metadata.get(pContentClass).getMetadata(component_manager_1.ComponentManager.METADATA_SELECTOR);
        if (!lSelector) {
            throw new core_data_1.Exception('Content is not a component.', this);
        }
        // Add content to content list.
        this.mComponentList.push(pContentClass);
    }
    /**
     * Add error listener that listens for any uncatched error.
     * @param pListener - Error listener.
     */
    addErrorListener(pListener) {
        this.mChangeDetection.addErrorListener(pListener);
    }
    /**
     * Create style element and prepend it to this component.
     * @param pStyle - Css style as string.
     */
    addStyle(pStyle) {
        // Sealed error.
        if (this.mAppSealed) {
            throw new core_data_1.Exception('App content is sealed after it got append to the DOM', this);
        }
        const lStyleTemplate = new core_xml_1.XmlElement();
        lStyleTemplate.tagName = 'style';
        lStyleTemplate.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        const lStyleElement = element_creator_1.ElementCreator.createElement(lStyleTemplate);
        lStyleElement.innerHTML = pStyle;
        this.mShadowRoot.prepend(lStyleElement);
    }
    /**
     * Append app to element.
     * @param pElement - Element.
     */
    async appendTo(pElement) {
        // Append app element to specified element.
        pElement.appendChild(this.mAppComponent);
        // Exit if app was already initialized.
        if (this.mAppSealed) {
            return;
        }
        // Seal content.
        this.mAppSealed = true;
        return new Promise((pResolve, pReject) => {
            // Wait for update and remove splash screen after.
            globalThis.requestAnimationFrame(() => {
                const lUpdateWaiter = new Array();
                // Create new update waiter for each component.
                for (const lComponentConstructor of this.mComponentList) {
                    // Create component and forward error.
                    let lComponent;
                    try {
                        lComponent = this.createComponent(lComponentConstructor);
                    }
                    catch (pError) {
                        pReject(pError);
                        return;
                    }
                    // Get ComponentManager of component and add update waiter to the waiter list. 
                    const lComponentManager = component_connection_1.ComponentConnection.componentManagerOf(lComponent);
                    lUpdateWaiter.push(lComponentManager.updateHandler.waitForUpdate());
                }
                // Promise that waits for all component to finish updating.
                let lUpdatePromise = Promise.all(lUpdateWaiter);
                // Remove splash screen if not in manual mode.
                if (!this.mSplashScreenOptions.manual) {
                    lUpdatePromise = lUpdatePromise.then(async () => {
                        return this.removeSplashScreen();
                    });
                }
                // Forward resolve and rejection.
                lUpdatePromise.then(() => { pResolve(); }).catch((pError) => { pReject(pError); });
            });
        });
    }
    /**
     * Remove splash screen.
     */
    async removeSplashScreen() {
        // Not good for testing.
        /* istanbul ignore next */
        const lTransistionTimerMilliseconds = this.mSplashScreenOptions.animationTime ?? 500;
        this.mSplashScreen.style.setProperty('transition', `opacity ${(lTransistionTimerMilliseconds / 1000).toString()}s linear`);
        this.mSplashScreen.style.setProperty('opacity', '0');
        // Remove splashscreen after transition.
        return new Promise((pResolve) => {
            // Wait for transition to end.
            globalThis.setTimeout(() => {
                this.mSplashScreen.remove();
                // Resolve promise after remove.
                pResolve();
            }, lTransistionTimerMilliseconds);
        });
    }
    /**
     * Set new splash screen.
     * @param pSplashScreen - Splashscreen settings.
     */
    setSplashScreen(pSplashScreen) {
        // Sealed error.
        if (this.mAppSealed) {
            throw new core_data_1.Exception('App content is sealed after it got append to the DOM', this);
        }
        // Set manual state.
        this.mSplashScreenOptions = pSplashScreen;
        // Create app wrapper template.
        const lGenericDivTemplate = new core_xml_1.XmlElement();
        lGenericDivTemplate.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        lGenericDivTemplate.tagName = 'div';
        // Create content wrapper.
        const lContentWrapper = element_creator_1.ElementCreator.createElement(lGenericDivTemplate);
        lContentWrapper.style.setProperty('display', 'grid');
        lContentWrapper.style.setProperty('align-content', 'center');
        lContentWrapper.style.setProperty('width', '100%');
        lContentWrapper.style.setProperty('height', '100%');
        lContentWrapper.style.setProperty('background', pSplashScreen.background);
        // Create spplash screen content and append to content wrapper.
        const lContent = element_creator_1.ElementCreator.createElement(lGenericDivTemplate);
        lContent.style.setProperty('width', 'fit-content');
        lContent.style.setProperty('height', 'fit-content');
        lContent.style.setProperty('margin', '0 auto');
        lContent.innerHTML = pSplashScreen.content;
        lContentWrapper.appendChild(lContent);
        this.mSplashScreen.replaceChildren(lContentWrapper);
    }
    /**
     * Create component.
     * @param pContentClass - Component class.
     */
    createComponent(pContentClass) {
        // Get content selector. Selector is allways found.
        const lSelector = core_dependency_injection_1.Metadata.get(pContentClass).getMetadata(component_manager_1.ComponentManager.METADATA_SELECTOR);
        // Create content template content is always inside xhtml namespace.
        const lContentTemplate = new core_xml_1.XmlElement();
        lContentTemplate.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        lContentTemplate.tagName = lSelector;
        // Create content from template inside change detection.
        let lContent = null;
        this.mChangeDetection.execute(() => {
            lContent = element_creator_1.ElementCreator.createElement(lContentTemplate);
            // Append content to shadow root
            this.mShadowRoot.appendChild(lContent);
        });
        return lContent;
    }
}
exports.PwbApp = PwbApp;
PwbApp.mChangeDetectionToApp = new WeakMap();
//# sourceMappingURL=pwb-app.js.map

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./demo/source/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=kartoffelgames.tool.cms.demo.js.map