/* istanbul ignore file */

// Component
export { UserObject, UserClass } from './interface/user-class';
export { PwbApp } from './pwb-app';
export { IPwbOnInit, IPwbAfterInit, IPwbOnDeconstruct, IPwbSlotAssign, IPwbAfterUpdate, IPwbOnUpdate, IPwbOnAttributeChange } from './interface/user-class';
export { PwbComponent } from './decorator/pwb-component.decorator';

// Injections
export { ComponentElementReference } from './injection_reference/component-element-reference';
export { ComponentUpdateReference } from './injection_reference/component-update-reference';
export { ComponentManagerReference } from './injection_reference/component-manager-reference';
export { ExtensionTargetClassReference } from './injection_reference/extension-target-class-reference';
export { ExtensionTargetObjectReference } from './injection_reference/extension-target-object-reference';
export { ModuleAttributeReference } from './injection_reference/module-attribute-reference';
export { ModuleLayerValuesReference } from './injection_reference/module/module-layer-values-reference';
export { ModuleTargetReference } from './injection_reference/module-target-reference';
export { ModuleTemplateReference } from './injection_reference/module/module-template-reference';

// Modules
export { ComponentScopeExecutor } from './module/execution/component-scope-executor';
export { IPwbExpressionModuleOnUpdate, IPwbAttributeModuleOnUpdate, IPwbInstructionModuleOnUpdate, IPwbModuleOnDeconstruct } from './interface/module';
export { ModuleAccessMode as ModuleAccessType } from './enum/module-access-mode';
export { LayerValues } from './component/values/layer-values';
export { InstructionResult } from './module/result/instruction-result';
export { PwbExpressionModule } from './decorator/pwb-expression-module.decorator';
export { PwbInstructionModule as PwbInstructionAttributeModule } from './decorator/pwb-instruction-module.decorator';
export { PwbAttributeModule as PwbAttributeAttributeModule } from './decorator/pwb-attribute-module.decorator';

// Extension
export { PwbExtension } from './decorator/pwb-extension.decorator';
export { IPwbExtensionOnDeconstruct } from './interface/extension';

// Default extensions.
export { ComponentEvent } from './default/component-event/component-event';
export { ComponentEventEmitter } from './default/component-event/component-event-emitter';
export { PwbComponentEvent } from './default/component-event/pwb-component-event.decorator';
export { PwbChild } from './default/pwb_child/pwb-child.decorator';
export { PwbExport } from './default/export/pwb-export.decorator';
export { PwbEventListener } from './default/event-listener/pwb-event-listener.decorator';

// Xml
export { TemplateParser } from './component/template/template-parser';
export { TextNode, XmlElement, XmlAttribute } from '@kartoffelgames/core.xml';

// Import default modules
import '../default/component-event/component-event-attribute-module';
import '../default/one_way_binding/one-way-binding-attribute-module';
import '../default/pwb_child/pwb-child-attribute-module';
import '../default/pwb_for_of/for-of-manipulator-attribute-module';
import '../default/pwb_if/if-manipulator-attribute-module';
import '../default/slot_attribute/slot-attribute-module';
import '../default/two_way_binding/two-way-binding-attribute-module';