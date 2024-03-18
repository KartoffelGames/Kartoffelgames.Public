import { Dictionary } from '@kartoffelgames/core.data';
import { CompareHandler } from '@kartoffelgames/web.change-detection';
import { LayerValues } from '../../component/values/layer-values';
import { PwbAttributeModule } from '../../decorator/pwb-attribute-module.decorator';
import { ModuleAccessMode } from '../../enum/module-access-mode.enum';
import { IPwbAttributeModuleOnUpdate } from '../../interface/module.interface';
import { ModuleAttributeReference } from '../../injection_reference/module-attribute-reference';
import { ComponentManagerReference } from '../../injection_reference/general/component-manager-reference';
import { ModuleLayerValuesReference } from '../../injection_reference/module/module-layer-values-reference';
import { ModuleTargetNode } from '../../injection_reference/module/module-target-node-reference';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';

@PwbAttributeModule({
    selector: /^\[\([[\w$]+\)\]$/,
    access: ModuleAccessMode.ReadWrite,
    forbiddenInManipulatorScopes: false
})
export class TwoWayBindingAttributeModule implements IPwbAttributeModuleOnUpdate {
    private readonly mAttributeReference: ModuleAttributeReference;
    private readonly mTarget: Node;
    private readonly mThisProperty: string;
    private readonly mUserObjectCompareHandler: CompareHandler<any>;
    private readonly mValueHandler: LayerValues;
    private readonly mViewCompareHandler: CompareHandler<any>;
    private readonly mViewProperty: string;

    /**
     * Constructor.
     * @param pTargetReference - Target element.
     * @param pValueReference - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pTargetReference: ModuleTargetNode, pValueReference: ModuleLayerValuesReference, pAttributeReference: ModuleAttributeReference, pComponentManagerReference: ComponentManagerReference) {
        this.mTarget = <Node>pTargetReference.value;
        this.mValueHandler = pValueReference.value;
        this.mAttributeReference = pAttributeReference;

        // Get property name.
        const lAttributeKey: string = this.mAttributeReference.value.name;
        this.mViewProperty = lAttributeKey.substr(2, lAttributeKey.length - 4);
        this.mThisProperty = this.mAttributeReference.value.asText;

        // Add comparison handler for this and for the target view value.
        this.mUserObjectCompareHandler = new CompareHandler(Symbol('Uncompareable'), 4);
        this.mViewCompareHandler = new CompareHandler(Symbol('Uncompareable'), 4);

        // Patch target. Do nothing with it.
        pComponentManagerReference.value.updateHandler.registerObject(this.mTarget);
    }

    /**
     * Update view object on property change.
     * @param pProperty - Property that got updated.
     */
    public onUpdate(): boolean {
        let lValueChanged: boolean = false;
        // Try to update view only on module initialize.
        const lThisValue: any = ComponentScopeExecutor.executeSilent(this.mThisProperty, this.mValueHandler);

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
                ComponentScopeExecutor.execute(`${this.mThisProperty} = $DATA;`, this.mValueHandler, lExtendedValues);

                // Update compare.
                this.mUserObjectCompareHandler.update(lTargetViewValue);

                // Set flag that value was updated.
                lValueChanged = true;
            }
        }

        return lValueChanged;
    }
}