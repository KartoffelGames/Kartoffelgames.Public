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
    private readonly mLayerValues: LayerValues;
    private readonly mTarget: Node;
    private readonly mThisProperty: string;
    private readonly mUserObjectCompareHandler: CompareHandler<any>;
    private readonly mViewCompareHandler: CompareHandler<any>;
    private readonly mViewProperty: string;

    /**
     * Constructor.
     * @param pTargetNode - Target element.
     * @param pLayerValues - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pTargetNode: ModuleTargetNodeReference, pLayerValues: ComponentLayerValuesReference, pAttributeKey: ModuleKeyReference, pAttributeValue: ModuleValueReference, pUpdateHandler: ComponentUpdateHandlerReference) {
        this.mTarget = pTargetNode;
        this.mLayerValues = pLayerValues;

        // Get property name.
        this.mViewProperty = pAttributeKey.substring(2, pAttributeKey.length - 2);
        this.mThisProperty = pAttributeValue.toString();

        // Add comparison handler for this and for the target view value.
        this.mUserObjectCompareHandler = new CompareHandler(Symbol('Uncompareable'), 4);
        this.mViewCompareHandler = new CompareHandler(Symbol('Uncompareable'), 4);

        // Patch target. Do nothing with it.
        pUpdateHandler.registerObject(this.mTarget);
    }

    /**
     * Update view object on property change.
     * @param pProperty - Property that got updated.
     */
    public onUpdate(): boolean {
        let lValueChanged: boolean = false;
        // Try to update view only on module initialize.
        const lThisValue: any = ComponentScopeExecutor.executeSilent(this.mThisProperty, this.mLayerValues);

        // Check for changes in this value.
        if (!this.mUserObjectCompareHandler.compareAndUpdate(lThisValue)) {
            // Update target view
            Reflect.set(this.mTarget, this.mViewProperty, lThisValue);

            // Update view compare with same value. 
            this.mViewCompareHandler.update(lThisValue);

            // Set flag that value was updated.
            lValueChanged = true;
        } else {
            const lTargetViewValue: any = Reflect.get(this.mTarget, this.mViewProperty);

            // Check for changes in view.
            if (!this.mViewCompareHandler.compareAndUpdate(lTargetViewValue)) {
                const lExtendedValues: Dictionary<string, any> = new Dictionary<string, any>();
                lExtendedValues.set('$DATA', lTargetViewValue);

                // Update value.
                ComponentScopeExecutor.execute(`${this.mThisProperty} = $DATA;`, this.mLayerValues, lExtendedValues);

                // Update compare.
                this.mUserObjectCompareHandler.update(lTargetViewValue);

                // Set flag that value was updated.
                lValueChanged = true;
            }
        }

        return lValueChanged;
    }
}