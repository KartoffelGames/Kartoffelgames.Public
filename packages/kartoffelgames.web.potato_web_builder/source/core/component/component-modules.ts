import { Dictionary, Exception } from '@kartoffelgames/core';
import { MustacheExpressionModule } from '../../module/mustache_expression/mustache-expression-module';
import { CoreEntityProcessorConstructorSetup, CoreEntityRegister } from '../core_entity/core-entity-register';
import { AttributeModule, AttributeModuleConfiguration } from '../module/attribute_module/attribute-module';
import { ExpressionModule, ExpressionModuleConfiguration, IPwbExpressionModuleProcessorConstructor } from '../module/expression_module/expression-module';
import { InstructionModule, InstructionModuleConfiguration } from '../module/instruction_module/instruction-module';
import { Component } from './component';
import { PwbTemplateInstructionNode } from './template/nodes/pwb-template-instruction-node';
import { PwbTemplateAttribute } from './template/nodes/values/pwb-template-attribute';
import { PwbTemplateExpression } from './template/nodes/values/pwb-template-expression';
import { ScopedValues } from '../scoped-values';

/**
 * Handles every kind of component modules. Keeps the current used expression module.
 * Main entry point for creating new module instances.
 * 
 * @internal
 */
export class ComponentModules {
    private static readonly mAttributeModuleCache: Dictionary<string, CoreEntityProcessorConstructorSetup<AttributeModuleConfiguration> | null> = new Dictionary<string, CoreEntityProcessorConstructorSetup<AttributeModuleConfiguration> | null>();
    private static readonly mExpressionModuleCache: WeakMap<IPwbExpressionModuleProcessorConstructor, CoreEntityProcessorConstructorSetup<ExpressionModuleConfiguration>> = new WeakMap<IPwbExpressionModuleProcessorConstructor, CoreEntityProcessorConstructorSetup<ExpressionModuleConfiguration>>();
    private static readonly mInstructionModuleCache: Dictionary<string, CoreEntityProcessorConstructorSetup<InstructionModuleConfiguration>> = new Dictionary<string, CoreEntityProcessorConstructorSetup<InstructionModuleConfiguration>>();

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
     * @param pValues - Values of current scope.
     * 
     * @returns Created static module when it was matched, otherwise null.
     */
    public createAttributeModule(pTemplate: PwbTemplateAttribute, pTargetNode: Element, pValues: ScopedValues): AttributeModule | null {
        // Read attribute setup of expression module.
        const lAttributeModuleSetup: CoreEntityProcessorConstructorSetup<AttributeModuleConfiguration> | null = (() => {
            // Try to read cached attribute module.
            const lCachedSetup: CoreEntityProcessorConstructorSetup<AttributeModuleConfiguration> | null | undefined = ComponentModules.mAttributeModuleCache.get(pTemplate.name);
            if (lCachedSetup || lCachedSetup === null) {
                return lCachedSetup;
            }

            // On failed cache search for module setup.
            for (const lSetup of this.mCoreEntityRegister.get<AttributeModuleConfiguration>(AttributeModule)) {
                if (lSetup.processorConfiguration.selector.test(pTemplate.name)) {
                    // Cache setup and return
                    ComponentModules.mAttributeModuleCache.set(pTemplate.name, lSetup);
                    return lSetup;
                }
            }

            // Cache empty result.
            ComponentModules.mAttributeModuleCache.set(pTemplate.name, null);

            return null;
        })();

        // No module found.
        if (lAttributeModuleSetup === null) {
            return null;
        }

        // Create new module, setup and return.
        return new AttributeModule({
            accessMode: lAttributeModuleSetup.processorConfiguration.access,
            processorConstructor: lAttributeModuleSetup.processorConstructor,
            parent: this.mComponent,
            targetNode: pTargetNode,
            targetTemplate: pTemplate,
            values: pValues,
            interactionTrigger: lAttributeModuleSetup.processorConfiguration.trigger
        }).setup();
    }

    /**
     * Check if template uses any manipulator modules.
     * @param pTemplate - Text node template.
     * @param pTargetNode - Build text node.
     * @param pValues - Values of current scope.
     * 
     * @throws {@link Exception}
     * When no expression node could be found.
     */
    public createExpressionModule(pTemplate: PwbTemplateExpression, pTargetNode: Text, pValues: ScopedValues): ExpressionModule {
        // Read expression setup of expression module.
        const lExpressionSetup: CoreEntityProcessorConstructorSetup<ExpressionModuleConfiguration> = (() => {
            // Try to read cached information.
            const lCachedSetup: CoreEntityProcessorConstructorSetup<ExpressionModuleConfiguration> | undefined = ComponentModules.mExpressionModuleCache.get(this.mExpressionModule);
            if (lCachedSetup) {
                return lCachedSetup;
            }

            // On cache fail, filter for expression setup.
            const lNewSetup: CoreEntityProcessorConstructorSetup<ExpressionModuleConfiguration> | undefined = this.mCoreEntityRegister.get<ExpressionModuleConfiguration>(ExpressionModule).find((pSetup: CoreEntityProcessorConstructorSetup<ExpressionModuleConfiguration>) => {
                return pSetup.processorConstructor === this.mExpressionModule;
            });

            if (!lNewSetup) {
                throw new Exception(`An expression module could not be found.`, this);
            }

            // Cache found expression setup information.
            ComponentModules.mExpressionModuleCache.set(this.mExpressionModule, lNewSetup);

            return lNewSetup;
        })();

        // Build, setup and return new expression module.
        return new ExpressionModule({
            processorConstructor: lExpressionSetup.processorConstructor,
            parent: this.mComponent,
            targetNode: pTargetNode,
            targetTemplate: pTemplate,
            values: pValues,
            interactionTrigger: lExpressionSetup.processorConfiguration.trigger
        }).setup();
    }

    /**
     * Check if template uses any manipulator modules.
     * @param pTemplate - Template element.
     * @param pValues - Values of current scope.
     * 
     * @throws {@link Exception}
     * When no instruction node with type could be found.
     */
    public createInstructionModule(pTemplate: PwbTemplateInstructionNode, pValues: ScopedValues): InstructionModule {
        // Read instruction setup of expression module.
        const lInstructioneModuleSetup: CoreEntityProcessorConstructorSetup<InstructionModuleConfiguration> | null = (() => {
            // Try to read cached instruction module.
            const lCachedSetup: CoreEntityProcessorConstructorSetup<InstructionModuleConfiguration> | undefined = ComponentModules.mInstructionModuleCache.get(pTemplate.instructionType);
            if (lCachedSetup) {
                return lCachedSetup;
            }

            // On failed cache search for module setup.
            for (const lSetup of this.mCoreEntityRegister.get<InstructionModuleConfiguration>(InstructionModule)) {
                // Only manipulator modules.
                if (lSetup.processorConfiguration.instructionType === pTemplate.instructionType) {
                    // Cache setup and return
                    ComponentModules.mInstructionModuleCache.set(pTemplate.instructionType, lSetup);
                    return lSetup;
                }
            }

            // Instruction module could not be found.
            throw new Exception(`Instruction module type "${pTemplate.instructionType}" not found.`, this);
        })();

        // Build, setup and return new instruction module.
        return new InstructionModule({
            processorConstructor: lInstructioneModuleSetup.processorConstructor,
            parent: this.mComponent,
            targetTemplate: pTemplate,
            values: pValues,
            interactionTrigger: lInstructioneModuleSetup.processorConfiguration.trigger
        }).setup();
    }
}