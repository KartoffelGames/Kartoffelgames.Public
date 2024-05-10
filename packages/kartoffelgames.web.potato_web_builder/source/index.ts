/* istanbul ignore file */

// Component
export { ComponentProcessor, ComponentProcessorConstructor } from './interface/component.interface';
export { PwbApp } from './pwb-app/pwb-app';
export { IPwbOnDeconstruct, IPwbAfterUpdate, IPwbOnUpdate, IPwbOnAttributeChange } from './interface/component.interface';
export { PwbComponent } from './decorator/pwb-component.decorator';

// Module Injections
export { ModuleConstructorReference } from './injection/references/module/module-constructor-reference';
export { ModuleKeyReference } from './injection/references/module/module-key-reference';
export { ModuleLayerValuesReference } from './injection/references/module/module-layer-values-reference';
export { ModuleReference } from './injection/references/module/module-reference';
export { ModuleTargetNodeReference } from './injection/references/module/module-target-node-reference';
export { ModuleTemplateReference } from './injection/references/module/module-template-reference';
export { ModuleValueReference } from './injection/references/module/module-value-reference';

// Component Injections
export { ComponentConstructorReference } from './injection/references/component/component-constructor-reference';
export { ComponentElementReference } from './injection/references/component/component-element-reference';
export { ComponentUpdateHandlerReference } from './injection/references/component/component-update-handler-reference';
export { ComponentLayerValuesReference } from './injection/references/component/component-layer-values-reference';

// Modules
export { ComponentScopeExecutor } from './module/execution/component-scope-executor';
export { IPwbExpressionModuleOnUpdate, IPwbAttributeModuleOnUpdate, IPwbInstructionModuleOnUpdate, IPwbModuleOnDeconstruct } from './interface/module.interface';
export { AccessMode } from './enum/access-mode.enum';
export { LayerValues } from './component/values/layer-values';
export { InstructionResult } from './module/result/instruction-result';
export { PwbExpressionModule } from './decorator/pwb-expression-module.decorator';
export { PwbInstructionModule } from './decorator/pwb-instruction-module.decorator';
export { PwbAttributeModule } from './decorator/pwb-attribute-module.decorator';

// Extension
export { PwbExtension } from './decorator/pwb-extension.decorator';
export { IPwbExtensionOnDeconstruct } from './interface/extension.interface';

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
import './default/component-event/component-event-attribute-module';
import './default/one_way_binding/one-way-binding-attribute-module';
import './default/pwb_child/pwb-child-attribute-module';
import './default/for-instruction/for-instruction-module';
import './default/if_instruction/if-instruction-module';
import './default/slot_attribute/slot-instruction-module';
import './default/two_way_binding/two-way-binding-attribute-module';
import './default/dynamic-content/dynamic-content-module';

// Import default extensions.
import './default/component-event/component-event-extension';
import './default/event-listener/event-listener-component-extension';
import './default/export/export-extension';
import './default/pwb_app_injection/pwb-app-injection-extension';

