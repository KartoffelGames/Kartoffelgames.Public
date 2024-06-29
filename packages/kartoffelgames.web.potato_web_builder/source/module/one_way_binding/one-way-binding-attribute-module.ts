import { ModuleTargetNode } from '../../core/module/injection_reference/module-target-node';
import { IAttributeOnUpdate } from '../../core/module/attribute_module/attribute-module';
import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator';
import { ModuleValues } from '../../core/module/module-values';
import { AccessMode } from '../../core/enum/access-mode.enum';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum';
import { ModuleAttribute } from '../../core/module/injection_reference/module-attribute';

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
    private readonly mExecutionString: string;
    private mLastValue: any;
    private readonly mModuleValues: ModuleValues;
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
        this.mModuleValues = pModuleValues;

        // Get execution string.
        this.mExecutionString = pModuleAttribute.value;

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
        const lExecutionResult: any = this.mModuleValues.executeExpression(this.mExecutionString);

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