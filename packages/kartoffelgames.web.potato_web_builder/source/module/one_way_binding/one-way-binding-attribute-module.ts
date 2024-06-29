import { ModuleTargetNode } from '../../core/module/injection_reference/module-target-node';
import { IAttributeOnUpdate } from '../../core/module/attribute_module/attribute-module';
import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator';
import { ModuleValues } from '../../core/module/module-values';
import { AccessMode } from '../../core/enum/access-mode.enum';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum';
import { ModuleAttribute } from '../../core/module/injection_reference/module-attribute';
import { ModuleValueProcedure } from '../../core/module/module-value-procedure';

/**
 * Bind value to view object.
 * If the user class object changes, the view object value gets updated.
 */
@PwbAttributeModule({
    access: AccessMode.Read,
    selector: /^\[[\w$]+\]$/,
    trigger: UpdateTrigger.Any
})
export class OneWayBindingAttributeModule implements IAttributeOnUpdate {
    private mLastValue: any;
    private readonly mProcedure: ModuleValueProcedure<any>;
    private readonly mTarget: Node;
    private readonly mTargetProperty: string;

    /**
     * Constructor.
     * @param pTargetNode - Target element.
     * @param pModuleValues - Values of module.
     * @param pModuleAttribute - Attribute of module.
     */
    public constructor(pTargetNode: ModuleTargetNode, pModuleValues: ModuleValues, pModuleAttribute: ModuleAttribute) {
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
        const lExecutionResult: any = this.mProcedure.execute();

        if (lExecutionResult !== this.mLastValue) {
            // Save last value.
            this.mLastValue = lExecutionResult;

            // Set view object property.
            Reflect.set(this.mTarget, this.mTargetProperty, lExecutionResult);

            return true;
        }

        return false;
    }
}