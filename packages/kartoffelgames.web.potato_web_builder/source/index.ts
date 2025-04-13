/* istanbul ignore file */

// Component
export type { IComponentOnAttributeChange, IComponentOnConnect, IComponentOnDeconstruct, IComponentOnDisconnect, IComponentOnUpdate } from './core/component/component.ts';
export { PwbComponent } from './core/component/pwb-component.decorator.ts';
export { PwbConfiguration, PwbDebugLogLevel } from './core/configuration/pwb-configuration.ts';
export { PwbGlobalResource } from './core/core_entity/interaction-tracker/pwb-global-resource.decorator.ts';
export { Processor } from './core/core_entity/processor.ts';

// Module Injections
export { ModuleDataLevel as ModuleValues } from './core/data/module-data-level.ts';
export { ExtensionModule } from './core/extension/extension-module.ts';
export { AttributeModule } from './core/module/attribute_module/attribute-module.ts';
export { ExpressionModule } from './core/module/expression_module/expression-module.ts';
export { ModuleAttribute } from './core/module/injection_reference/module-attribute.ts';
export { ModuleTargetNode } from './core/module/injection_reference/module-target-node.ts';
export { ModuleTemplate } from './core/module/injection_reference/module-template.ts';
export { InstructionModule } from './core/module/instruction_module/instruction-module.ts';

// Component Injections
export { ComponentElement } from './core/component/component-element.ts';
export { Component } from './core/component/component.ts';
export { ComponentDataLevel } from './core/data/component-data-level.ts';

// Modules
export { DataLevel } from './core/data/data-level.ts';
export { LevelProcedure } from './core/data/level-procedure.ts';
export { ModuleDataLevel } from './core/data/module-data-level.ts';
export type { IExtensionOnDeconstruct, IExtensionOnExecute } from './core/extension/extension-module.ts';
export { PwbExtensionModule } from './core/extension/pwb-extension-module.decorator.ts';
export type { IAttributeOnDeconstruct, IAttributeOnUpdate } from './core/module/attribute_module/attribute-module.ts';
export { PwbAttributeModule } from './core/module/attribute_module/pwb-attribute-module.decorator.ts';
export type { IExpressionOnDeconstruct, IExpressionOnUpdate } from './core/module/expression_module/expression-module.ts';
export { PwbExpressionModule } from './core/module/expression_module/pwb-expression-module.decorator.ts';
export type { IInstructionOnDeconstruct, IInstructionOnUpdate } from './core/module/instruction_module/instruction-module.ts';
export { InstructionResult } from './core/module/instruction_module/instruction-result.ts';
export { PwbInstructionModule } from './core/module/instruction_module/pwb-instruction-module.decorator.ts';

export { AccessMode } from './core/enum/access-mode.enum.ts';

// Default extensions.
export { PwbComponentEventListener } from './module/component-event-listener/pwb-component-event-listener.decorator.ts';
export { ComponentEventEmitter } from './module/component-event/component-event-emitter.ts';
export { ComponentEvent } from './module/component-event/component-event.ts';
export { PwbComponentEvent } from './module/component-event/pwb-component-event.decorator.ts';
export { PwbExport } from './module/export/pwb-export.decorator.ts';
export { PwbChild } from './module/pwb_child/pwb-child.decorator.ts';

// Xml
export { PwbTemplateInstructionNode } from './core/component/template/nodes/pwb-template-instruction-node.ts';
export { PwbTemplateTextNode } from './core/component/template/nodes/pwb-template-text-node.ts';
export { PwbTemplateXmlNode } from './core/component/template/nodes/pwb-template-xml-node.ts';
export { PwbTemplateAttribute } from './core/component/template/nodes/values/pwb-template-attribute.ts';
export { PwbTemplateExpression } from './core/component/template/nodes/values/pwb-template-expression.ts';
export { TemplateParser } from './core/component/template/template-parser.ts';

// Import default modules
import './module/dynamic-content/dynamic-content-module.ts';
import './module/event_attribute/event-attribute-module.ts';
import './module/for-instruction/for-instruction-module.ts';
import './module/if_instruction/if-instruction-module.ts';
import './module/one_way_binding/one-way-binding-attribute-module.ts';
import './module/pwb_child/pwb-child-attribute-module.ts';
import './module/slot_instruction/slot-instruction-module.ts';
import './module/two_way_binding/two-way-binding-attribute-module.ts';

// Import default extensions.
import './module/component-event-listener/component-event-listener-component-extension.ts';
import './module/component-event-listener/component-event-listener-module-extension.ts';
import './module/export/export-extension.ts';

// Set debugger to global scope.
import { PwbConfiguration, PwbDebugLogLevel } from './core/configuration/pwb-configuration.ts';
globalThis['PotatoWebBuilder'] = {
    global: PwbConfiguration,
    logLevel: PwbDebugLogLevel
};

declare global {
    // eslint-disable-next-line no-var, @typescript-eslint/naming-convention
    var PotatoWebBuilder: {
        global: typeof PwbConfiguration,
        logLevel: typeof PwbDebugLogLevel;
    };
}