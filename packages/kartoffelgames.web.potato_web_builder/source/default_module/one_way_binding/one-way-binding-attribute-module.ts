import { LayerValues } from '../../core/component/values/layer-values';
import { IOnUpdate } from '../../core/core_entity/core-entity.interface';
import { ModuleKeyReference } from '../../core/injection-reference/module/module-key-reference';
import { ModuleLayerValuesReference } from '../../core/injection-reference/module/module-layer-values-reference';
import { ModuleTargetNodeReference } from '../../core/injection-reference/module/module-target-node-reference';
import { ModuleValueReference } from '../../core/injection-reference/module/module-value-reference';
import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator';
import { ComponentScopeExecutor } from '../../core/module/execution/component-scope-executor';
import { AccessMode } from '../../enum/access-mode.enum';
import { UpdateTrigger } from '../../enum/update-trigger.enum';

/**
 * Bind value to view object.
 * If the user class object changes, the view object value gets updated.
 */
@PwbAttributeModule({
    access: AccessMode.Read,
    selector: /^\[[\w$]+\]$/,
    trigger: UpdateTrigger.Default
})
export class OneWayBindingAttributeModule implements IOnUpdate {
    private readonly mExecutionString: string;
    private mLastValue: any;
    private readonly mTarget: Node;
    private readonly mTargetProperty: string;
    private readonly mValueHandler: LayerValues;

    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pValueReference - Values of component.
     * @param pAttributeValueReference - Attribute of module.
     */
    public constructor(pTargetReference: ModuleTargetNodeReference, pValueReference: ModuleLayerValuesReference, pAttributeKeyReference: ModuleKeyReference, pAttributeValueReference: ModuleValueReference) {
        this.mTarget = pTargetReference;
        this.mValueHandler = pValueReference;

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
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(this.mExecutionString, this.mValueHandler);

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