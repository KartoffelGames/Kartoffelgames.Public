import { MustacheExpressionModule } from '../default/mustache_expression/mustache-expression-module';
import { ExpressionModule } from '../module/expression-module';
import { ExpressionModuleConfiguration, GlobalModuleStorage } from '../module/global-module-storage';
import { IPwbExpressionModuleProcessorConstructor } from '../interface/module';
import { MultiplicatorModule } from '../module/multiplicator-module';
import { StaticModule } from '../module/static-module';
import { ComponentManager } from './component-manager';
import { PwbTemplateInstructionNode } from './template/nodes/pwb-template-instruction-node';
import { PwbTemplateAttribute } from './template/nodes/values/pwb-template-attribute';
import { PwbTemplateExpression } from './template/nodes/values/pwb-template-expression';
import { LayerValues } from './values/layer-values';
import { Exception } from '@kartoffelgames/core.data';

export class ComponentModules {
    private readonly mComponentManager: ComponentManager;
    private readonly mExpressionModule: IPwbExpressionModuleProcessorConstructor;
    private readonly mGlobalModuleStorage: GlobalModuleStorage;

    /**
     * Constructor.
     * @param pExpressionModule - default expression module for this component. 
     * @param pComponentManager - Component manager.
     */
    public constructor(pComponentManager: ComponentManager, pExpressionModule?: IPwbExpressionModuleProcessorConstructor) {
        // Get expression module.
        this.mExpressionModule = pExpressionModule ?? <IPwbExpressionModuleProcessorConstructor><any>MustacheExpressionModule;
        this.mComponentManager = pComponentManager;
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
    public createAttributeModule(pTemplate: PwbTemplateAttribute, pTargetNode: Element, pValues: LayerValues): StaticModule | null {
        // Find static modules.
        for (const lModuleConfiguration of this.mGlobalModuleStorage.attributeModuleConfigurations) {
            if (lModuleConfiguration.selector.test(pTemplate.name)) {
                // Get constructor and create new module.
                const lModule: StaticModule = new StaticModule({
                    moduleDefinition: lModuleConfiguration,
                    moduleClass: lModuleConfiguration.constructor,
                    targetTemplate: pTemplate.node,
                    targetAttribute: pTemplate,
                    values: pValues,
                    componentManager: this.mComponentManager,
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
        if(!lModuleConfiguration) {
            throw new Exception(`An expression module could not be found.`, this);
        }

        const lModule: ExpressionModule = new ExpressionModule({
            module: lModuleConfiguration,
            targetTemplate: pTemplate,
            values: pValues,
            componentManager: this.mComponentManager,
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
    public createInstructionModule(pTemplate: PwbTemplateInstructionNode, pValues: LayerValues): MultiplicatorModule {
        // Find manipulator module inside attributes.
        for (const lModuleConfiguration of this.mGlobalModuleStorage.instructionModuleConfigurations) {
            // Only manipulator modules.
            if (lModuleConfiguration.instructionType === pTemplate.instructionType) {
                // Get constructor and create new module.
                const lModule: MultiplicatorModule = new MultiplicatorModule({
                    module: lModuleConfiguration,
                    targetTemplate: pTemplate,
                    values: pValues,
                    componentManager: this.mComponentManager,
                });

                return lModule;
            }
        }

        // Instruction module could not be found.
        throw new Exception(`Instruction module type "${pTemplate.instructionType}" not found.`, this);
    }
}