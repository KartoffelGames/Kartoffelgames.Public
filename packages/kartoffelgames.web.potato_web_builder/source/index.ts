/* istanbul ignore file */

// Component
export { IComponentOnAttributeChange, IComponentOnConnect, IComponentOnDeconstruct, IComponentOnDisconnect, IComponentOnUpdate } from './core/component/component';
export { PwbComponent } from './core/component/pwb-component.decorator';
export { PwbConfiguration, PwbDebugLogLevel } from './core/configuration/pwb-configuration';
export { Processor } from './core/core_entity/processor';
export { PwbApp } from './pwb-app/pwb-app';

// Module Injections
export { ExtensionModule } from './core/extension/extension-module';
export { AttributeModule } from './core/module/attribute_module/attribute-module';
export { ExpressionModule } from './core/module/expression_module/expression-module';
export { ModuleAttribute } from './core/module/injection_reference/module-attribute';
export { ModuleTargetNode } from './core/module/injection_reference/module-target-node';
export { ModuleTemplate } from './core/module/injection_reference/module-template';
export { InstructionModule } from './core/module/instruction_module/instruction-module';
export { ModuleValues } from './core/module/module-values';

// Component Injections
export { Component } from './core/component/component';
export { ComponentElement } from './core/component/component-element';
export { ComponentScopedValues } from './core/component/injection_reference/component-scoped-values';

// Modules
export { IExtensionOnDeconstruct, IExtensionOnExecute } from './core/extension/extension-module';
export { PwbExtensionModule } from './core/extension/pwb-extension-module.decorator';
export { IAttributeOnDeconstruct, IAttributeOnUpdate } from './core/module/attribute_module/attribute-module';
export { PwbAttributeModule } from './core/module/attribute_module/pwb-attribute-module.decorator';
export { IExpressionOnDeconstruct, IExpressionOnUpdate } from './core/module/expression_module/expression-module';
export { PwbExpressionModule } from './core/module/expression_module/pwb-expression-module.decorator';
export { IInstructionOnDeconstruct, IInstructionOnUpdate } from './core/module/instruction_module/instruction-module';
export { InstructionResult } from './core/module/instruction_module/instruction-result';
export { PwbInstructionModule } from './core/module/instruction_module/pwb-instruction-module.decorator';
export { ModuleValueProcedure } from './core/module/module-value-procedure';
export { ScopedValues } from './core/scoped-values';

export { AccessMode } from './core/enum/access-mode.enum';

// Default extensions.
export { PwbComponentEventListener } from './module/component-event-listener/pwb-component-event-listener.decorator';
export { ComponentEvent } from './module/component-event/component-event';
export { ComponentEventEmitter } from './module/component-event/component-event-emitter';
export { PwbComponentEvent } from './module/component-event/pwb-component-event.decorator';
export { PwbExport } from './module/export/pwb-export.decorator';
export { PwbChild } from './module/pwb_child/pwb-child.decorator';

// Xml
export { TemplateParser } from './core/component/template/template-parser';

// Import default modules
import './module/dynamic-content/dynamic-content-module';
import './module/event_attribute/event-attribute-module';
import './module/for-instruction/for-instruction-module';
import './module/if_instruction/if-instruction-module';
import './module/one_way_binding/one-way-binding-attribute-module';
import './module/pwb_child/pwb-child-attribute-module';
import './module/slot_attribute/slot-instruction-module';
import './module/two_way_binding/two-way-binding-attribute-module';

// Import default extensions.
import './module/component-event-listener/component-event-listener-component-extension';
import './module/component-event/component-event-extension';
import './module/export/export-extension';
import './module/pwb_app_injection/pwb-app-injection-extension';

// Set debugger to global scope.
import { PwbConfiguration, PwbDebugLogLevel } from './core/configuration/pwb-configuration';
globalThis['PotatoWebBuilder'] = {
    configuration: PwbConfiguration,
    logLevel: PwbDebugLogLevel
};

declare global {
    // eslint-disable-next-line no-var, @typescript-eslint/naming-convention
    var PotatoWebBuilder: {
        configuration: any,
        logLevel: typeof PwbDebugLogLevel;
    };
}


// TODO: Make any update sync again.
// TODO: Create a weakmap with current running update cycle id. (Symbol as id???)
// TODO: Save for each updater the cycle id with the correct update state. When it is found on update return cached result.
// TODO: Create a master / slave updater. Only the master shedules and retriggers updates. 
// TODO: When frame time is reached, return update false for any update. Notify the master that the current update should be resheduled with the same frame id.
// TODO: When resheduled task are run through, start the next update cycle with a new frame id.
// TODO: Dont forget loggin.