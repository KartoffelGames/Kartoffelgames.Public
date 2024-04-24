import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { LayerValues } from '../../component/values/layer-values';
import { PwbAttributeModule } from '../../decorator/pwb-attribute-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { IPwbAttributeModuleOnUpdate } from '../../interface/module.interface';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';
import { ModuleTargetNodeReference } from '../../injection/references/module/module-target-node-reference';
import { ModuleLayerValuesReference } from '../../injection/references/module/module-layer-values-reference';
import { ModuleKeyReference } from '../../injection/references/module/module-key-reference';
import { ModuleValueReference } from '../../injection/references/module/module-value-reference';

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
        this.mValueCompare = new CompareHandler(Symbol('Uncompareable'), 4);
    }

    /**
     * Update value on target element.
     * @returns false for 'do not update'.
     */
    public onUpdate(): boolean {
        const lExecutionResult: any = ComponentScopeExecutor.executeSilent(this.mExecutionString, this.mValueHandler);

        if (!this.mValueCompare.compareAndUpdate(lExecutionResult)) {
            // Set view object property.
            Reflect.set(this.mTarget, this.mTargetProperty, lExecutionResult);

            return true;
        }

        return false;
    }
}