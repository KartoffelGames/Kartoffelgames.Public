import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Processor } from '../../core/core_entity/processor.ts';
import type { LevelProcedure } from '../../core/data/level-procedure.ts';
import { ModuleDataLevel } from '../../core/data/module-data-level.ts';
import { AccessMode } from '../../core/enum/access-mode.enum.ts';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum.ts';
import type { IAttributeOnUpdate } from '../../core/module/attribute_module/attribute-module.ts';
import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator.ts';
import { ModuleAttribute } from '../../core/module/injection_reference/module-attribute.ts';
import { ModuleTargetNode } from '../../core/module/injection_reference/module-target-node.ts';

/**
 * Bind value to view object.
 * If the user class object changes, the view object value gets updated.
 */
@PwbAttributeModule({
    access: AccessMode.Read,
    selector: /^\[[\w$]+\]$/,
    trigger: UpdateTrigger.Any
})
export class OneWayBindingAttributeModule extends Processor implements IAttributeOnUpdate {
    private mLastValue: any;
    private readonly mProcedure: LevelProcedure<any>;
    private readonly mTarget: Node;
    private readonly mTargetProperty: string;

    /**
     * Constructor.
     * @param pTargetNode - Target element.
     * @param pModuleValues - Values of module.
     * @param pModuleAttribute - Attribute of module.
     */
    public constructor(pTargetNode = Injection.use(ModuleTargetNode), pModuleValues = Injection.use(ModuleDataLevel), pModuleAttribute = Injection.use(ModuleAttribute)) {
        super();

        this.mTarget = pTargetNode;

        // Create expression procedure form attribute value.
        this.mProcedure = pModuleValues.createExpressionProcedure(pModuleAttribute.value);

        // Get view object information. Remove starting [ and end ].
        this.mTargetProperty = pModuleAttribute.name.substring(1, pModuleAttribute.name.length - 1);

        // Create uncompareable value as initial value.
        this.mLastValue = Symbol('Uncomparable');
    }

    /**
     * Update value on target element.
     * @returns false for 'do not update'.
     */
    public onUpdate(): boolean {
        // Read current value.
        const lExecutionResult: any = this.mProcedure.execute();
        if (lExecutionResult === this.mLastValue) {
            return false;
        }

        // Save last value.
        this.mLastValue = lExecutionResult;

        // Set view object property.
        Reflect.set(this.mTarget, this.mTargetProperty, lExecutionResult);

        return true;
    }
}