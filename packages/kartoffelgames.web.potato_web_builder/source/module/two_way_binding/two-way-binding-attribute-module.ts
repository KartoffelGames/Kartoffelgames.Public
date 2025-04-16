import { Processor } from '../../core/core_entity/processor.ts';
import { AccessMode } from '../../core/enum/access-mode.enum.ts';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum.ts';
import { AttributeModule, type IAttributeOnUpdate } from '../../core/module/attribute_module/attribute-module.ts';
import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator.ts';
import { ModuleAttribute } from '../../core/module/injection_reference/module-attribute.ts';
import { ModuleTargetNode } from '../../core/module/injection_reference/module-target-node.ts';
import type { LevelProcedure } from '../../core/data/level-procedure.ts';
import { ModuleDataLevel } from '../../core/data/module-data-level.ts';
import { Injection } from '@kartoffelgames/core-dependency-injection';

@PwbAttributeModule({
    access: AccessMode.ReadWrite,
    selector: /^\[\([[\w$]+\)\]$/,
    trigger: UpdateTrigger.Any
})
export class TwoWayBindingAttributeModule extends Processor implements IAttributeOnUpdate {
    private readonly mAttributeKey: string;
    private mLastDataValue: any;
    private readonly mReadProcedure: LevelProcedure<any>;
    private readonly mTargetNode: Node;
    private readonly mWriteProcedure: LevelProcedure<void>;

    /**
     * Constructor.
     * 
     * @param pTargetNode - Target element.
     * @param pModuleValues - Data level of module.
     * @param pModuleAttribute - Module attribute.
     * @param pAttributeModule - Attribute module.
     */
    public constructor(pTargetNode = Injection.use(ModuleTargetNode), pModuleValues = Injection.use(ModuleDataLevel), pModuleAttribute = Injection.use(ModuleAttribute), pAttributeModule = Injection.use(AttributeModule)) {
        super();
        
        this.mTargetNode = pTargetNode;

        // Get property name.
        this.mAttributeKey = pModuleAttribute.name.substring(2, pModuleAttribute.name.length - 2);

        // Create procedures.
        this.mReadProcedure = pModuleValues.createExpressionProcedure(pModuleAttribute.value);
        this.mWriteProcedure = pModuleValues.createExpressionProcedure(`${pModuleAttribute.value} = $DATA;`, ['$DATA']);

        // Set start compare values.
        this.mLastDataValue = Symbol('Uncomparable');

        // Patch target. Do nothing with it.
        pAttributeModule.registerObject(this.mTargetNode);
    }

    /**
     * Update view object on property change.
     * @param pProperty - Property that got updated.
     */
    public onUpdate(): boolean {
        // Try to update view only on module initialize.
        const lCurrentDataValue: any = this.mReadProcedure.execute();

        // Check for changes in this value.
        if (lCurrentDataValue !== this.mLastDataValue) {
            // Update target view
            Reflect.set(this.mTargetNode, this.mAttributeKey, lCurrentDataValue);

            // Update view compare with same value. 
            this.mLastDataValue = lCurrentDataValue;

            // Set flag that value was updated.
            return true;
        }

        const lCurrentViewValue: any = Reflect.get(this.mTargetNode, this.mAttributeKey);

        // Check for changes in view.
        if (lCurrentViewValue !== lCurrentDataValue) {
            // Set temporary value.
            this.mWriteProcedure.setTemporaryValue('$DATA', lCurrentViewValue);

            // Update value.
            this.mWriteProcedure.execute();

            // Update compare.
            this.mLastDataValue = lCurrentViewValue;

            // Set flag that value was updated.
            return true;
        }

        return false;
    }
}