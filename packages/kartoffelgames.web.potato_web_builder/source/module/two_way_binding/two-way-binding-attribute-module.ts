import { Dictionary } from '@kartoffelgames/core';
import { CoreEntityUpdateZone } from '../../core/core_entity/core-entity-update-zone';
import { IAttributeOnUpdate } from '../../core/module/attribute_module/attribute-module';
import { PwbAttributeModule } from '../../core/module/attribute_module/pwb-attribute-module.decorator';
import { ModuleAttribute } from '../../core/module/injection_reference/module-attribute';
import { ModuleTargetNode } from '../../core/module/injection_reference/module-target-node';
import { ModuleValues } from '../../core/module/module-values';
import { AccessMode } from '../../core/enum/access-mode.enum';
import { UpdateTrigger } from '../../core/enum/update-trigger.enum';

@PwbAttributeModule({
    access: AccessMode.ReadWrite,
    selector: /^\[\([[\w$]+\)\]$/,
    trigger: UpdateTrigger.NoSyncCalls
})
export class TwoWayBindingAttributeModule implements IAttributeOnUpdate {
    private readonly mAttributeKey: string;
    private readonly mAttributeValue: string;
    private mLastDataValue: any;
    private mLastViewValue: any;
    private readonly mModuleValues: ModuleValues;
    private readonly mTargetNode: Node;

    /**
     * Constructor.
     * @param pTargetNode - Target element.
     * @param pModuleValues - Scoped values of component.
     * @param pModuleAttribute - Module attribute.
     * @param pUpdateZone - Component update zone.
     */
    public constructor(pTargetNode: ModuleTargetNode, pModuleValues: ModuleValues, pModuleAttribute: ModuleAttribute, pUpdateZone: CoreEntityUpdateZone) {
        this.mTargetNode = pTargetNode;
        this.mModuleValues = pModuleValues;

        // Get property name.
        this.mAttributeKey = pModuleAttribute.name.substring(2, pModuleAttribute.name.length - 2);
        this.mAttributeValue = pModuleAttribute.value;

        // Set start compare values.
        this.mLastDataValue = Symbol('Uncomparable');
        this.mLastViewValue = Symbol('Uncomparable');

        // Patch target. Do nothing with it.
        pUpdateZone.registerObject(this.mTargetNode);
    }

    /**
     * Update view object on property change.
     * @param pProperty - Property that got updated.
     */
    public onUpdate(): boolean {
        // Try to update view only on module initialize.
        const lCurrentDataValue: any = this.mModuleValues.executeExpression(this.mAttributeValue);

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
        if (lCurrentViewValue !== lCurrentDataValue) {
            const lExtendedValues: Dictionary<string, any> = new Dictionary<string, any>();
            lExtendedValues.set('$DATA', lCurrentViewValue);

            // Update value.
            this.mModuleValues.executeExpression(`${this.mAttributeValue} = $DATA;`, lExtendedValues);

            // Update compare.
            this.mLastViewValue = lCurrentViewValue;

            // Set flag that value was updated.
            return true;
        }

        return false;
    }
}