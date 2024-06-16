/* istanbul ignore file */

// Component
export { ComponentProcessor, ComponentProcessorConstructor } from './component_entity/component/component.interface';
export { PwbApp } from './pwb-app/pwb-app';
export { IPwbOnDeconstruct, IPwbAfterUpdate, IPwbOnUpdate, IPwbOnAttributeChange } from './component_entity/component/component.interface';
export { PwbComponent } from './component_entity/component/pwb-component.decorator';

// Module Injections
export { ModuleConstructorReference } from './component_entity/injection-reference/module/module-constructor-reference';
export { ModuleKeyReference } from './component_entity/injection-reference/module/module-key-reference';
export { ModuleLayerValuesReference } from './component_entity/injection-reference/module/module-layer-values-reference';
export { ModuleReference } from './component_entity/injection-reference/module/module-reference';
export { ModuleTargetNodeReference } from './component_entity/injection-reference/module/module-target-node-reference';
export { ModuleTemplateReference } from './component_entity/injection-reference/module/module-template-reference';
export { ModuleValueReference } from './component_entity/injection-reference/module/module-value-reference';

// Component Injections
export { ComponentConstructorReference } from './component_entity/injection-reference/component/component-constructor-reference';
export { ComponentElementReference } from './component_entity/injection-reference/component/component-element-reference';
export { ComponentUpdateHandlerReference } from './component_entity/injection-reference/component/component-update-handler-reference';
export { ComponentLayerValuesReference } from './component_entity/injection-reference/component/component-layer-values-reference';

// Modules
export { ComponentScopeExecutor } from './component_entity/module/execution/component-scope-executor';
export { IPwbAttributeModuleOnUpdate } from './component_entity/module/attribute_module/attribute-module';
export { IPwbModuleOnDeconstruct } from './component_entity/module/base-module';
export { IPwbExpressionModuleOnUpdate } from './component_entity/module/expression_module/expression-module';
export { IPwbExtensionModuleOnDeconstruct } from './component_entity/module/extension_module/extension-module';
export { IPwbInstructionModuleOnUpdate } from './component_entity/module/instruction_module/instruction-module';
export { InstructionResult } from './component_entity/module/instruction_module/result/instruction-result';
export { AccessMode } from './enum/access-mode.enum';
export { LayerValues } from './component_entity/component/values/layer-values';
export { PwbExpressionModule } from './component_entity/module/expression_module/pwb-expression-module.decorator';
export { PwbInstructionModule } from './component_entity/module/instruction_module/pwb-instruction-module.decorator';
export { PwbAttributeModule } from './component_entity/module/attribute_module/pwb-attribute-module.decorator';
export { PwbExtensionModule } from './component_entity/module/extension_module/pwb-extension-module.decorator';

// Default extensions.
export { ComponentEvent } from './default/component-event/component-event';
export { ComponentEventEmitter } from './default/component-event/component-event-emitter';
export { PwbComponentEvent } from './default/component-event/pwb-component-event.decorator';
export { PwbChild } from './default/pwb_child/pwb-child.decorator';
export { PwbExport } from './default/export/pwb-export.decorator';
export { PwbEventListener } from './default/event-listener/pwb-event-listener.decorator';

// Xml
export { TemplateParser } from './component_entity/component/template/template-parser';

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
