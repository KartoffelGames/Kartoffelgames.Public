import { Dictionary } from '@kartoffelgames/core.data';
import { LayerValues } from '../../component/values/layer-values';
import { PwbAttributeModule } from '../../decorator/pwb-attribute-module.decorator';
import { AccessMode } from '../../enum/access-mode.enum';
import { ComponentUpdateHandlerReference } from '../../injection/references/component/component-update-handler-reference';
import { ModuleKeyReference } from '../../injection/references/module/module-key-reference';
import { ModuleLayerValuesReference } from '../../injection/references/module/module-layer-values-reference';
import { ModuleTargetNodeReference } from '../../injection/references/module/module-target-node-reference';
import { ModuleValueReference } from '../../injection/references/module/module-value-reference';
import { IPwbAttributeModuleOnUpdate } from '../../interface/module.interface';
import { ComponentScopeExecutor } from '../../module/execution/component-scope-executor';

@PwbAttributeModule({
    selector: /^\[\([[\w$]+\)\]$/,
    access: AccessMode.ReadWrite
})
export class TwoWayBindingAttributeModule implements IPwbAttributeModuleOnUpdate {
    private readonly mAttributeKey: string;
    private readonly mAttributeValue: string;
    private mLastDataValue: any;
    private mLastViewValue: any;
    private readonly mLayerValues: LayerValues;
    private readonly mTargetNode: Node;

    /**
     * Constructor.
     * @param pTargetNode - Target element.
     * @param pLayerValues - Values of component.
     * @param pAttribute - Attribute of module.
     */
    public constructor(pTargetNode: ModuleTargetNodeReference, pLayerValues: ModuleLayerValuesReference, pAttributeKey: ModuleKeyReference, pAttributeValue: ModuleValueReference, pUpdateHandler: ComponentUpdateHandlerReference) {
        this.mTargetNode = pTargetNode;
        this.mLayerValues = pLayerValues;

        // Get property name.
        this.mAttributeKey = pAttributeKey.substring(2, pAttributeKey.length - 2);
        this.mAttributeValue = pAttributeValue.toString();

        // Set start compare values.
        this.mLastDataValue = Symbol('Uncomparable');
        this.mLastViewValue = Symbol('Uncomparable');

        // Patch target. Do nothing with it.
        pUpdateHandler.registerObject(this.mTargetNode);
    }

    /**
     * Update view object on property change.
     * @param pProperty - Property that got updated.
     */
    public onUpdate(): boolean {
        // Try to update view only on module initialize.
        const lCurrentDataValue: any = ComponentScopeExecutor.executeSilent(this.mAttributeValue, this.mLayerValues);

        // Check for changes in this value.
        if (lCurrentDataValue !== this.mLastDataValue) {
            // Update target view
            Reflect.set(this.mTargetNode, this.mAttributeKey, lCurrentDataValue);

            // Update view compare with same value. 
            this.mLastDataValue = lCurrentDataValue;

            // Set flag that value was updated.
            return true;
        }

        const lCurrentViewValue: any = Reflect.get(this.mTargetNode, this.mAttributeKey);

        // Check for changes in view.
        if (lCurrentViewValue !== this.mLastViewValue) {
            const lExtendedValues: Dictionary<string, any> = new Dictionary<string, any>();
            lExtendedValues.set('$DATA', lCurrentViewValue);

            // Update value.
            ComponentScopeExecutor.execute(`${this.mAttributeValue} = $DATA;`, this.mLayerValues, lExtendedValues);

            // Update compare.
            this.mLastViewValue = lCurrentViewValue;

            // Set flag that value was updated.
            return true;
        }

        return false;
    }
}