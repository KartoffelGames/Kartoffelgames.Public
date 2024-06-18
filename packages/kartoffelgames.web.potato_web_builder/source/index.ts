/* istanbul ignore file */

// Component
export { ComponentProcessor, ComponentProcessorConstructor } from './core/component/component.interface';
export { PwbApp } from './pwb-app/pwb-app';
export { IPwbOnDeconstruct, IPwbAfterUpdate, IPwbOnUpdate, IPwbOnAttributeChange } from './core/component/component.interface';
export { PwbComponent } from './core/component/pwb-component.decorator';

// Module Injections
export { ModuleConstructorReference } from './core/injection-reference/module/module-constructor-reference';
export { ModuleKeyReference } from './core/injection-reference/module/module-key-reference';
export { ModuleLayerValuesReference } from './core/injection-reference/module/module-layer-values-reference';
export { ModuleReference } from './core/injection-reference/module/module-reference';
export { ModuleTargetNodeReference } from './core/injection-reference/module/module-target-node-reference';
export { ModuleTemplateReference } from './core/injection-reference/module/module-template-reference';
export { ModuleValueReference } from './core/injection-reference/module/module-value-reference';

// Component Injections
export { ComponentConstructorReference } from './core/injection-reference/component/component-constructor-reference';
export { ComponentElementReference } from './core/injection-reference/component/component-element-reference';
export { ComponentUpdateHandlerReference } from './core/injection-reference/component/component-update-handler-reference';
export { ComponentLayerValuesReference } from './core/injection-reference/component/component-layer-values-reference';

// Modules
export { ComponentScopeExecutor } from './core/module/execution/component-scope-executor';
export { IPwbAttributeModuleOnUpdate } from './core/module/attribute_module/attribute-module';
export { IPwbModuleOnDeconstruct } from './core/module/base-module';
export { IPwbExpressionModuleOnUpdate } from './core/module/expression_module/expression-module';
export { IPwbExtensionModuleOnDeconstruct } from './core/extension/extension-module';
export { IPwbInstructionModuleOnUpdate } from './core/module/instruction_module/instruction-module';
export { InstructionResult } from './core/module/instruction_module/result/instruction-result';
export { AccessMode } from './enum/access-mode.enum';
export { LayerValues } from './core/component/values/layer-values';
export { PwbExpressionModule } from './core/module/expression_module/pwb-expression-module.decorator';
export { PwbInstructionModule } from './core/module/instruction_module/pwb-instruction-module.decorator';
export { PwbAttributeModule } from './core/module/attribute_module/pwb-attribute-module.decorator';
export { PwbExtensionModule } from './core/extension/pwb-extension-module.decorator';

// Default extensions.
export { ComponentEvent } from './default_module/component-event/component-event';
export { ComponentEventEmitter } from './default_module/component-event/component-event-emitter';
export { PwbComponentEvent } from './default_module/component-event/pwb-component-event.decorator';
export { PwbChild } from './default_module/pwb_child/pwb-child.decorator';
export { PwbExport } from './default_module/export/pwb-export.decorator';
export { PwbEventListener } from './default_module/event-listener/pwb-event-listener.decorator';

// Xml
export { TemplateParser } from './core/component/template/template-parser';

// Import default modules
import './default_module/component-event/component-event-attribute-module';
import './default_module/one_way_binding/one-way-binding-attribute-module';
import './default_module/pwb_child/pwb-child-attribute-module';
import './default_module/for-instruction/for-instruction-module';
import './default_module/if_instruction/if-instruction-module';
import './default_module/slot_attribute/slot-instruction-module';
import './default_module/two_way_binding/two-way-binding-attribute-module';
import './default_module/dynamic-content/dynamic-content-module';

// Import default extensions.
import './default_module/component-event/component-event-extension';
import './default_module/event-listener/event-listener-component-extension';
import './default_module/export/export-extension';
import './default_module/pwb_app_injection/pwb-app-injection-extension';
