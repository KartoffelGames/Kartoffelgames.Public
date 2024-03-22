import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { LayerValues } from '../../component/values/layer-values';
import { PwbAttributeModule } from '../../decorator/pwb-attribute-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { IPwbAttributeModuleOnUpdate } from '../../interface/module.interface';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ComponentLayerValuesReference } from '../../injection_reference/general/component-layer-values-reference';
import { ModuleTargetNode } from '../../injection_reference/module/module-target-node-reference';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';

/**
 * Bind value to view object.
 * If the user class object changes, the view object value gets updated.
 */
@PwbAttributeModule({
    selector: /^\[[\w$]+\]$/,
    access: AccessMode.Read,
    forbiddenInManipulatorScopes: false
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
     * @param pAttributeReference - Attribute of module.
     */
    public constructor(pTargetReference: ModuleTargetNode, pValueReference: ComponentLayerValuesReference, pAttributeReference: ModuleAttributeReference) {
        this.mTarget = <Node>pTargetReference.value;
        this.mValueHandler = pValueReference.value;

        // Get execution string.
        this.mExecutionString = pAttributeReference.value.asText;

        // Get view object information. Remove starting [ and end ].
        const lAttributeKey: string = pAttributeReference.value.name;
        this.mTargetProperty = lAttributeKey.substr(1, lAttributeKey.length - 2);

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