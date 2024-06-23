/* istanbul ignore file */

// Component
export { PwbApp } from './pwb-app/pwb-app';
export { PwbComponent } from './core/component/pwb-component.decorator';
export { IComponentOnAttributeChange, IComponentOnConnect, IComponentOnDeconstruct, IComponentOnDisconnect, IComponentOnUpdate } from './core/component/component';

// Module Injections
export { ModuleConstructorReference } from './core/injection-reference/module/module-constructor-reference';
export { ModuleKeyReference } from './core/injection-reference/module/module-key-reference';
export { ModuleReference } from './core/injection-reference/module/module-reference';
export { ModuleTargetNodeReference } from './core/injection-reference/module/module-target-node-reference';
export { ModuleTemplateReference } from './core/injection-reference/module/module-template-reference';
export { ModuleValueReference } from './core/injection-reference/module/module-value-reference';
export { ModuleValues } from './core/module/module-values';

// Component Injections
export { ComponentElement } from './core/component/component-element';
export { ComponentValuesReference } from './core/injection-reference/component/component-values-reference';
export { CoreEntityUpdateZone } from './core/core_entity/core-entity-update-zone';

// Modules
export { PwbExtensionModule, } from './core/extension/pwb-extension-module.decorator';
export { IExtensionOnDeconstruct, IExtensionOnExecute } from './core/extension/extension-module';
export { PwbAttributeModule } from './core/module/attribute_module/pwb-attribute-module.decorator';
export { IAttributeOnDeconstruct, IAttributeOnUpdate } from './core/module/attribute_module/attribute-module';
export { PwbExpressionModule } from './core/module/expression_module/pwb-expression-module.decorator';
export { IExpressionOnDeconstruct, IExpressionOnUpdate } from './core/module/expression_module/expression-module';
export { PwbInstructionModule } from './core/module/instruction_module/pwb-instruction-module.decorator';
export { InstructionResult } from './core/module/instruction_module/result/instruction-result';
export { IInstructionOnDeconstruct, IInstructionOnUpdate } from './core/module/instruction_module/instruction-module';
export { ScopedValues } from './core/scoped-values';

export { AccessMode } from './enum/access-mode.enum';

// Default extensions.
export { ComponentEvent } from './default_module/component-event/component-event';
export { ComponentEventEmitter } from './default_module/component-event/component-event-emitter';
export { PwbComponentEvent } from './default_module/component-event/pwb-component-event.decorator';
export { PwbEventListener } from './default_module/event-listener/pwb-event-listener.decorator';
export { PwbExport } from './default_module/export/pwb-export.decorator';
export { PwbChild } from './default_module/pwb_child/pwb-child.decorator';

// Xml
export { TemplateParser } from './core/component/template/template-parser';

// Import default modules
import './default_module/component-event/component-event-attribute-module';
import './default_module/dynamic-content/dynamic-content-module';
import './default_module/for-instruction/for-instruction-module';
import './default_module/if_instruction/if-instruction-module';
import './default_module/one_way_binding/one-way-binding-attribute-module';
import './default_module/pwb_child/pwb-child-attribute-module';
import './default_module/slot_attribute/slot-instruction-module';
import './default_module/two_way_binding/two-way-binding-attribute-module';

// Import default extensions.
import './default_module/component-event/component-event-extension';
import './default_module/event-listener/event-listener-component-extension';
import './default_module/export/export-extension';
import './default_module/pwb_app_injection/pwb-app-injection-extension';


