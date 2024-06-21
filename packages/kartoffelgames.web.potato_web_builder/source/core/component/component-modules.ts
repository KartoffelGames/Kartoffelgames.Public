import { Exception } from '@kartoffelgames/core.data';
import { MustacheExpressionModule } from '../../default_module/mustache_expression/mustache-expression-module';
import { CoreEntityProcessorConstructorSetup, CoreEntityRegister } from '../core_entity/core-entity-register';
import { AttributeModule, AttributeModuleConfiguration } from '../module/attribute_module/attribute-module';
import { ExpressionModule, ExpressionModuleConfiguration, IPwbExpressionModuleProcessorConstructor } from '../module/expression_module/expression-module';
import { InstructionModule, InstructionModuleConfiguration } from '../module/instruction_module/instruction-module';
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
    private readonly mCoreEntityRegister: CoreEntityRegister;
    private readonly mExpressionModule: IPwbExpressionModuleProcessorConstructor;

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
        this.mCoreEntityRegister = new CoreEntityRegister();
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
        for (const lSetup of this.mCoreEntityRegister.get<AttributeModuleConfiguration>(AttributeModule)) {
            if (lSetup.processorConfiguration.selector.test(pTemplate.name)) {
                // Get constructor and create new module.
                const lModule: AttributeModule = new AttributeModule({
                    accessMode: lSetup.processorConfiguration.access,
                    processorConstructor: lSetup.processorConstructor,
                    parent: this.mComponent,
                    targetNode: pTargetNode,
                    targetTemplate: pTemplate,
                    values: pValues,
                    interactionTrigger: lSetup.processorConfiguration.trigger
                }).setup();

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
        const lSetup: CoreEntityProcessorConstructorSetup<ExpressionModuleConfiguration> | undefined = this.mCoreEntityRegister.get<ExpressionModuleConfiguration>(ExpressionModule).find((pSetup: CoreEntityProcessorConstructorSetup<ExpressionModuleConfiguration>) => {
            return pSetup.processorConstructor === this.mExpressionModule;
        });

        if (!lSetup) {
            throw new Exception(`An expression module could not be found.`, this);
        }

        const lModule: ExpressionModule = new ExpressionModule({
            processorConstructor: lSetup.processorConstructor,
            parent: this.mComponent,
            targetNode: pTargetNode,
            targetTemplate: pTemplate,
            values: pValues,
            interactionTrigger: lSetup.processorConfiguration.trigger
        }).setup();

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
        for (const lSetup of this.mCoreEntityRegister.get<InstructionModuleConfiguration>(InstructionModule)) {
            // Only manipulator modules.
            if (lSetup.processorConfiguration.instructionType === pTemplate.instructionType) {
                // Get constructor and create new module.
                const lModule: InstructionModule = new InstructionModule({
                    processorConstructor: lSetup.processorConstructor,
                    parent: this.mComponent,
                    targetTemplate: pTemplate,
                    values: pValues,
                    interactionTrigger: lSetup.processorConfiguration.trigger
                }).setup();

                return lModule;
            }
        }

        // Instruction module could not be found.
        throw new Exception(`Instruction module type "${pTemplate.instructionType}" not found.`, this);
    }
}