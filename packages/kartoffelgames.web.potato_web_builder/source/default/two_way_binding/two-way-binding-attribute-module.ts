import { Dictionary } from '@kartoffelgames/core.data';
import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { LayerValues } from '../../component/values/layer-values';
import { PwbAttributeModule } from '../../decorator/pwb-attribute-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { IPwbAttributeModuleOnUpdate } from '../../interface/module.interface';
import { ComponentLayerValuesReference } from '../../injection_reference/component/component-layer-values-reference';
import { ModuleTargetNodeReference } from '../../injection_reference/module/module-target-node-reference';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';
import { ModuleKeyReference } from '../../injection_reference/module/module-key-reference';
import { ModuleValueReference } from '../../injection_reference/module/module-value-reference';
import { ComponentUpdateHandlerReference } from '../../injection_reference/component/component-update-handler-reference';

@PwbAttributeModule({
    selector: /^\[\([[\w$]+\)\]$/,
    access: AccessMode.ReadWrite
})
export class TwoWayBindingAttributeModule implements IPwbAttributeModuleOnUpdate {
    private readonly mAttributeKey: string;
    private readonly mAttributeValue: string;
    private readonly mLayerValues: LayerValues;
    private readonly mTargetNode: Node;
    private readonly mUserObjectCompareHandler: CompareHandler<any>;
    private readonly mViewCompareHandler: CompareHandler<any>;
    
    /**
     * Constructor.
     * @param pTargetNode - Target element.
     * @param pLayerValues - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pTargetNode: ModuleTargetNodeReference, pLayerValues: ComponentLayerValuesReference, pAttributeKey: ModuleKeyReference, pAttributeValue: ModuleValueReference, pUpdateHandler: ComponentUpdateHandlerReference) {
        this.mTargetNode = pTargetNode;
        this.mLayerValues = pLayerValues;

        // Get property name.
        this.mAttributeKey = pAttributeKey.substring(2, pAttributeKey.length - 2);
        this.mAttributeValue = pAttributeValue.toString();

        // Add comparison handler for this and for the target view value.
        this.mUserObjectCompareHandler = new CompareHandler(Symbol('Uncompareable'), 4);
        this.mViewCompareHandler = new CompareHandler(Symbol('Uncompareable'), 4);

        // Patch target. Do nothing with it.
        pUpdateHandler.registerObject(this.mTargetNode);
    }

    /**
     * Update view object on property change.
     * @param pProperty - Property that got updated.
     */
    public onUpdate(): boolean {
        // Try to update view only on module initialize.
        const lCurrentValue: any = ComponentScopeExecutor.executeSilent(this.mAttributeValue, this.mLayerValues);

        // Check for changes in this value.
        if (!this.mUserObjectCompareHandler.compareAndUpdate(lCurrentValue)) {
            // Update target view
            Reflect.set(this.mTargetNode, this.mAttributeKey, lCurrentValue);

            // Update view compare with same value. 
            this.mViewCompareHandler.update(lCurrentValue);

            // Set flag that value was updated.
            return true;
        }

        const lViewValue: any = Reflect.get(this.mTargetNode, this.mAttributeKey);

        // Check for changes in view.
        if (!this.mViewCompareHandler.compareAndUpdate(lViewValue)) {
            const lExtendedValues: Dictionary<string, any> = new Dictionary<string, any>();
            lExtendedValues.set('$DATA', lViewValue);

            // Update value.
            ComponentScopeExecutor.execute(`${this.mAttributeValue} = $DATA;`, this.mLayerValues, lExtendedValues);

            // Update compare.
            this.mUserObjectCompareHandler.update(lViewValue);

            // Set flag that value was updated.
            return true;
        }

        return false;
    }
}