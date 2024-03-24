import { Dictionary } from '@kartoffelgames/core.data';
import { Component } from '../component';

/**
 * Interface between persistent values directly from component and temporary values
 * that are not directly inside the component but attached to it.
 *
 * Simple access for all value types: TemporaryValue, IdChild and ComponentProcessor values.
 * has-, get-, set-, remove-.
 */
export class LayerValues {
    private readonly mComponent: Component;
    private readonly mParentLayer: LayerValues | null;
    private readonly mTemporaryValues: Dictionary<string, any>;

    /**
     * Component manager connected with layer value.
     */
    public get component(): Component {
        return this.mComponent;
    }

    /**
     * Get root value of component.
     */
    public get rootValue(): LayerValues {
        if (this.mParentLayer === null) {
            return this;
        } else {
            return this.mParentLayer.rootValue;
        }
    }

    /**
     * Get all keys of temorary values.
     */
    private get temporaryValuesList(): Array<string> {
        const lKeyList: Array<string> = this.mTemporaryValues.map<string>((pKey: string) => pKey);

        // Get key list from parent.
        if (this.mParentLayer) {
            lKeyList.push(...this.mParentLayer.temporaryValuesList);
        }

        return lKeyList;
    }

    /**
     * Constructor.
     * New component value layer.
     * @param pParentLayer - Parent layer. Values on root layer.
     */
    public constructor(pParentLayer: LayerValues | Component) {
        this.mTemporaryValues = new Dictionary<string, any>();

        if (pParentLayer instanceof Component) {
            this.mParentLayer = null;
            this.mComponent = pParentLayer;
        } else {
            this.mParentLayer = pParentLayer;
            this.mComponent = pParentLayer.component;
        }
    }

    /**
     * Check for changes into two value handler.
     * @param pHandler - Handler two.
     */
    public equals(pHandler: LayerValues): boolean {
        // Compare if it has the same component processor object.
        if (this.component.processor !== pHandler.component.processor) {
            return false;
        }

        // Get temporary value keys and sort. 
        const lSortedTemporaryValueKeyListOne: Array<string> = this.temporaryValuesList.sort();
        const lSortedTemporaryValueKeyListTwo: Array<string> = pHandler.temporaryValuesList.sort();

        // Compare temporary value keys.
        if (lSortedTemporaryValueKeyListOne.join() !== lSortedTemporaryValueKeyListTwo.join()) {
            return false;
        }

        // Check for temporary values differences from one to two.
        for (const lTemporaryValueOneKey of lSortedTemporaryValueKeyListOne) {
            // Check for difference.
            if (this.getValue(lTemporaryValueOneKey) !== pHandler.getValue(lTemporaryValueOneKey)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Gets the html element specified temporary value.
     * @param pValueName - Name of value.
     */
    public getValue<TValue>(pValueName: string): TValue {
        let lValue: any = this.mTemporaryValues.get(pValueName);

        // If value was not found and parent exists, search in parent values.
        if (typeof lValue === 'undefined' && this.mParentLayer) {
            lValue = this.mParentLayer.getValue(pValueName);
        }

        return lValue;
    }

    /**
     * Remove temporary value from this layer.
     * @param pValueName - Name of value.
     */
    public removeLayerValue(pValueName: string): void {
        // Remove value from html element.
        this.mTemporaryValues.delete(pValueName);
    }

    /**
     * Add or replaces temporary value in this manipulator scope.
     * @param pKey - Key of value.
     * @param pValue - Value.
     */
    public setLayerValue<TValue>(pKey: string, pValue: TValue): void {
        // Set value to current layer.
        this.mTemporaryValues.set(pKey, pValue);
    }

    /**
     * Set value to root. All child can access this value.
     * @param pKey - Value key.
     * @param pValue - Value.
     */
    public setRootValue<TValue>(pKey: string, pValue: TValue): void {
        this.rootValue.setLayerValue(pKey, pValue);
    }
}