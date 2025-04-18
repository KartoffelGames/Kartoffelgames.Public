import { Dictionary, Exception } from '@kartoffelgames/core';
import type { PwbApplicationConfiguration } from '../../application/pwb-application-configuration.ts';
import { MustacheExpressionModule } from '../../module/mustache_expression/mustache-expression-module.ts';
import { type CoreEntityProcessorConstructorSetup, CoreEntityRegister } from '../core_entity/core-entity-register.ts';
import type { DataLevel } from '../data/data-level.ts';
import { AttributeModule, type AttributeModuleConfiguration } from '../module/attribute_module/attribute-module.ts';
import { ExpressionModule, type ExpressionModuleConfiguration, type IPwbExpressionModuleProcessorConstructor } from '../module/expression_module/expression-module.ts';
import { InstructionModule, type InstructionModuleConfiguration } from '../module/instruction_module/instruction-module.ts';
import type { Component } from './component.ts';
import type { PwbTemplateInstructionNode } from './template/nodes/pwb-template-instruction-node.ts';
import type { PwbTemplateAttribute } from './template/nodes/values/pwb-template-attribute.ts';
import type { PwbTemplateExpression } from './template/nodes/values/pwb-template-expression.ts';

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
    public createAttributeModule(pApplicationContext: PwbApplicationConfiguration, pTemplate: PwbTemplateAttribute, pTargetNode: Element, pValues: DataLevel): AttributeModule | null {
        // Read attribute setup of expression module.
        const lAttributeModuleSetup: CoreEntityProcessorConstructorSetup<AttributeModuleConfiguration> | null = (() => {
            // Try to read cached attribute module.
            const lCachedSetup: CoreEntityProcessorConstructorSetup<AttributeModuleConfiguration> | null | undefined = ComponentModules.mAttributeModuleCache.get(pTemplate.name);
            if (lCachedSetup || lCachedSetup === null) {
                return lCachedSetup;
            }

            // On failed cache search for module setup.
            for (const lSetup of CoreEntityRegister.get<AttributeModuleConfiguration>(AttributeModule)) {
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
            applicationContext: pApplicationContext,
            accessMode: lAttributeModuleSetup.processorConfiguration.access,
            constructor: lAttributeModuleSetup.processorConstructor,
            parent: this.mComponent,
            targetNode: pTargetNode,
            targetTemplate: pTemplate,
            values: pValues,
            trigger: lAttributeModuleSetup.processorConfiguration.trigger
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
    public createExpressionModule(pApplicationContext: PwbApplicationConfiguration, pTemplate: PwbTemplateExpression, pTargetNode: Text, pValues: DataLevel): ExpressionModule {
        // Read expression setup of expression module.
        const lExpressionSetup: CoreEntityProcessorConstructorSetup<ExpressionModuleConfiguration> = (() => {
            // Try to read cached information.
            const lCachedSetup: CoreEntityProcessorConstructorSetup<ExpressionModuleConfiguration> | undefined = ComponentModules.mExpressionModuleCache.get(this.mExpressionModule);
            if (lCachedSetup) {
                return lCachedSetup;
            }

            // On cache fail, filter for expression setup.
            const lNewSetup: CoreEntityProcessorConstructorSetup<ExpressionModuleConfiguration> | undefined = CoreEntityRegister.get<ExpressionModuleConfiguration>(ExpressionModule).find((pSetup: CoreEntityProcessorConstructorSetup<ExpressionModuleConfiguration>) => {
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
            applicationContext: pApplicationContext,
            constructor: lExpressionSetup.processorConstructor,
            parent: this.mComponent,
            targetNode: pTargetNode,
            targetTemplate: pTemplate,
            values: pValues,
            trigger: lExpressionSetup.processorConfiguration.trigger
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
    public createInstructionModule(pApplicationContext: PwbApplicationConfiguration, pTemplate: PwbTemplateInstructionNode, pValues: DataLevel): InstructionModule {
        // Read instruction setup of expression module.
        const lInstructioneModuleSetup: CoreEntityProcessorConstructorSetup<InstructionModuleConfiguration> | null = (() => {
            // Try to read cached instruction module.
            const lCachedSetup: CoreEntityProcessorConstructorSetup<InstructionModuleConfiguration> | undefined = ComponentModules.mInstructionModuleCache.get(pTemplate.instructionType);
            if (lCachedSetup) {
                return lCachedSetup;
            }

            // On failed cache search for module setup.
            for (const lSetup of CoreEntityRegister.get<InstructionModuleConfiguration>(InstructionModule)) {
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
            applicationContext: pApplicationContext,
            constructor: lInstructioneModuleSetup.processorConstructor,
            parent: this.mComponent,
            targetTemplate: pTemplate,
            values: pValues,
            trigger: lInstructioneModuleSetup.processorConfiguration.trigger
        }).setup();
    }
}