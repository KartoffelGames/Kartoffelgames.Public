import { ModuleKeyReference } from '../../core/injection-reference/module/module-key-reference';
import { ModuleTargetNodeReference } from '../../core/injection-reference/module/module-target-node-reference';
import { ModuleValueReference } from '../../core/injection-reference/module/module-value-reference';
import { IAttributeOnUpdate } from '../../core/module/attribute_module/attribute-module';
import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator';
import { ModuleValues } from '../../core/module/module-values';
import { AccessMode } from '../../enum/access-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

/**
 * Bind value to view object.
 * If the user class object changes, the view object value gets updated.
 */
@PwbAttributeModule({
    access: AccessMode.Read,
    selector: /^\[[\w$]+\]$/,
    trigger: UpdateTrigger.NoSyncCalls
})
export class OneWayBindingAttributeModule implements IAttributeOnUpdate {
    private readonly mExecutionString: string;
    private readonly mExpressionExecutor: ModuleValues;
    private mLastValue: any;
    private readonly mTarget: Node;
    private readonly mTargetProperty: string;

    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pValueReference - Values of component.
     * @param pAttributeValueReference - Attribute of module.
     */
    public constructor(pTargetReference: ModuleTargetNodeReference, pExpressionExecutor: ModuleValues, pAttributeKeyReference: ModuleKeyReference, pAttributeValueReference: ModuleValueReference) {
        this.mTarget = pTargetReference;
        this.mExpressionExecutor = pExpressionExecutor;

        // Get execution string.
        this.mExecutionString = pAttributeValueReference.toString();

        // Get view object information. Remove starting [ and end ].
        this.mTargetProperty = pAttributeKeyReference.substring(1, pAttributeKeyReference.length - 1);

        // Create empty compare handler with unique symbol.
        this.mLastValue = Symbol('Uncomparable');
    }

    /**
     * Update value on target element.
     * @returns false for 'do not update'.
     */
    public onUpdate(): boolean {
        const lExecutionResult: any = this.mExpressionExecutor.execute(this.mExecutionString);

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