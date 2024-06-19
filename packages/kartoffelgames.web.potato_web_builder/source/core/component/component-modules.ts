import { Exception } from '@kartoffelgames/core.data';
import { MustacheExpressionModule } from '../../default_module/mustache_expression/mustache-expression-module';
import { AttributeModule } from '../module/attribute_module/attribute-module';
import { ExpressionModule, IPwbExpressionModuleProcessorConstructor } from '../module/expression_module/expression-module';
import { ExpressionModuleConfiguration, GlobalModuleStorage } from '../module/global-module-storage';
import { InstructionModule } from '../module/instruction_module/instruction-module';
import { Component } from './component';
import { PwbTemplateInstructionNode } from './template/nodes/pwb-template-instruction-node';
import { PwbTemplateAttribute } from './template/nodes/values/pwb-template-attribute';
import { PwbTemplateExpression } from './template/nodes/values/pwb-template-expression';
import { LayerValues } from './values/layer-values';

/**
 * Handles every kind of component modules. Keeps the current used expression module.
 * Main entry point for creating new module instances.
 * 
 * @internal
 */
export class ComponentModules {
    // TODO: Cache attribute and instruction constructor by the name to create it faster next time.

    private readonly mComponent: Component;
    private readonly mExpressionModule: IPwbExpressionModuleProcessorConstructor;
    private readonly mGlobalModuleStorage: GlobalModuleStorage;

    /**
     * Constructor.
     * 
     * @param pExpressionModule - default expression module for this component. 
     * @param pComponent - Component.
     */
    public constructor(pComponent: Component, pExpressionModule?: IPwbExpressionModuleProcessorConstructor) {
        // Get expression module.
        this.mExpressionModule = pExpressionModule ?? <IPwbExpressionModuleProcessorConstructor><any>MustacheExpressionModule;
        this.mComponent = pComponent;
        this.mGlobalModuleStorage = new GlobalModuleStorage();
    }

    /**
     * Create static module based on attribute.
     * When no module matches for attribute, null is returned instead.
     * 
     * @param pTemplate - Attribute template.
     * @param pTargetNode - Target element of static module.
     * @param pValues - Values of current layer.
     * 
     * @returns Created static module when it was matched, otherwise null.
     */
    public createAttributeModule(pTemplate: PwbTemplateAttribute, pTargetNode: Element, pValues: LayerValues): AttributeModule | null {
        // Find static modules.
        for (const lModuleConfiguration of this.mGlobalModuleStorage.attributeModuleConfigurations) {
            if (lModuleConfiguration.selector.test(pTemplate.name)) {
                // Get constructor and create new module.
                const lModule: AttributeModule = new AttributeModule({
                    accessMode: lModuleConfiguration.access,
                    constructor: lModuleConfiguration.constructor,
                    targetTemplate: pTemplate,
                    values: pValues,
                    parent: this.mComponent,
                    targetNode: pTargetNode
                });

                return lModule;
            }
        }

        return null;
    }

    /**
     * Check if template uses any manipulator modules.
     * @param pTemplate - Text node template.
     * @param pTargetNode - Build text node.
     * @param pValues - Values of current layer.
     * 
     * @throws {@link Exception}
     * When no expression node could be found.
     */
    public createExpressionModule(pTemplate: PwbTemplateExpression, pTargetNode: Text, pValues: LayerValues): ExpressionModule {
        const lModuleConfiguration: ExpressionModuleConfiguration | undefined = this.mGlobalModuleStorage.getExpressionModuleConfiguration(this.mExpressionModule);
        if (!lModuleConfiguration) {
            throw new Exception(`An expression module could not be found.`, this);
        }

        const lModule: ExpressionModule = new ExpressionModule({
            constructor: lModuleConfiguration.constructor,
            targetTemplate: pTemplate,
            values: pValues,
            parent: this.mComponent,
            targetNode: pTargetNode
        });

        return lModule;
    }

    /**
     * Check if template uses any manipulator modules.
     * @param pTemplate - Template element.
     * @param pValues - Values of current layer.
     * 
     * @throws {@link Exception}
     * When no instruction node with type could be found.
     */
    public createInstructionModule(pTemplate: PwbTemplateInstructionNode, pValues: LayerValues): InstructionModule {
        // Find manipulator module inside attributes.
        for (const lModuleConfiguration of this.mGlobalModuleStorage.instructionModuleConfigurations) {
            // Only manipulator modules.
            if (lModuleConfiguration.instructionType === pTemplate.instructionType) {
                // Get constructor and create new module.
                const lModule: InstructionModule = new InstructionModule(lModuleConfiguration.constructor, this.mComponent, pTemplate, pValues,);

                return lModule;
            }
        }

        // Instruction module could not be found.
        throw new Exception(`Instruction module type "${pTemplate.instructionType}" not found.`, this);
    }
}