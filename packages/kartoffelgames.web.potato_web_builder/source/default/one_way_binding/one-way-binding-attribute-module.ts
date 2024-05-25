import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { LayerValues } from '../../component/values/layer-values';
import { PwbAttributeModule } from '../../decorator/pwb-attribute-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { ModuleKeyReference } from '../../injection/references/module/module-key-reference';
import { ModuleLayerValuesReference } from '../../injection/references/module/module-layer-values-reference';
import { ModuleTargetNodeReference } from '../../injection/references/module/module-target-node-reference';
import { ModuleValueReference } from '../../injection/references/module/module-value-reference';
import { IPwbAttributeModuleOnUpdate } from '../../interface/module.interface';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';

/**
 * Bind value to view object.
 * If the user class object changes, the view object value gets updated.
 */
@PwbAttributeModule({
    selector: /^\[[\w$]+\]$/,
    access: AccessMode.Read
})
export class OneWayBindingAttributeModule implements IPwbAttributeModuleOnUpdate {
    private readonly mExecutionString: string;
    private mLastValue: any;
    private readonly mTarget: Node;
    private readonly mTargetProperty: string;
    private readonly mValueCompare: CompareHandler<any>;
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
        this.mValueCompare = new CompareHandler(4);
        this.mLastValue = Symbol('Uncomparable');
    }

    /**
     * Update value on target element.
     * @returns false for 'do not update'.
     */
    public onUpdate(): boolean {
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(this.mExecutionString, this.mValueHandler);

        if (!this.mValueCompare.compare(lExecutionResult, this.mLastValue)) {
            // Save last value.
            this.mLastValue = lExecutionResult;

            // Set view object property.
            Reflect.set(this.mTarget, this.mTargetProperty, lExecutionResult);

            return true;
        }

        return false;
    }
}