import { Dictionary, Exception } from '@kartoffelgames/core.data';
import { Component } from './component/component';

/**
 * Interface between persistent values directly from component and temporary values
 * that are not directly inside the component but attached to it.
 *
 * Has the {@link store} property that allways sets and gets the data to the correct location
 * or the {@link setTemporaryValue} function to only set temporary values.
 */
export class ScopedValues {
    private readonly mComponent: Component;
    private readonly mDataProxy: ScopedValueData;
    private readonly mParentScope: ScopedValues | null;
    private readonly mTemporaryValues: Dictionary<string, any>;

    /**
     * Data object with all current scope values.
     */
    public get store(): ScopedValueData {
        return this.mDataProxy;
    }

    /**
     * Constructor.
     * New component value scope.
     * @param pParentScope - Parent scope. Values on root scope.
     */
    public constructor(pParentScope: ScopedValues | Component) {
        this.mTemporaryValues = new Dictionary<string, any>();

        if (pParentScope instanceof Component) {
            this.mParentScope = null;
            this.mComponent = pParentScope;
        } else {
            this.mParentScope = pParentScope;
            this.mComponent = pParentScope.mComponent;
        }

        // Create data proxy.
        this.mDataProxy = this.createAccessProxy();
    }

    /**
     * Check for changes into two value handler.
     * @param pHandler - Handler two.
     */
    public equals(pHandler: ScopedValues): boolean {
        // Compare if it has the same component processor object.
        if (this.mComponent.processor !== pHandler.mComponent.processor) {
            return false;
        }

        // Get temporary value keys and sort. 
        const lSortedTemporaryValueKeyListOne: Array<string> = this.getTemporaryValuesList().sort();
        const lSortedTemporaryValueKeyListTwo: Array<string> = pHandler.getTemporaryValuesList().sort();

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
     * Add or replaces temporary value in this manipulator scope.
     * 
     * @param pKey - Key of value.
     * @param pValue - Value.
     */
    public setTemporaryValue<TValue>(pKey: string, pValue: TValue): void {
        // Set value to current scope.
        this.mTemporaryValues.set(pKey, pValue);
    }

    /**
     * Create a proxy object that decide what data is written to or read from temporary or processor values.
     * 
     * @returns Proxy object.
     */
    private createAccessProxy(): ScopedValueData {
        return new Proxy(new Object(), {
            /**
             * Get value of property.
             * 
             * @param _pTargetObject - Something unused. 
             * @param pPropertyName - Name of requested value.
             * 
             * @returns value of property.
             * 
             * @throws {@link Exception}
             * When the property is not set.
             */
            get: (_pTargetObject: any, pPropertyName: string): any => {
                return this.getValue(pPropertyName);
            },

            /**
             * 
             * @param _pTargetObject  - Something unused. 
             * @param pPropertyName - Target property name. 
             * @param pNewValue - New set value.
             */
            set: (_pTargetObject: any, pPropertyName: string, pNewValue: any): boolean => {
                // Update temporary value when they have overriden persistent values.
                if (this.hasTemporaryValue(pPropertyName)) {
                    this.setTemporaryValue(pPropertyName, pNewValue);
                }

                // Update component processor values when they exist before setting a new temporary value.
                if (pPropertyName in this.mComponent.processor) {
                    (<{ [key: PropertyKey]: any; }>this.mComponent.processor)[pPropertyName] = pNewValue;
                    return true;
                }

                // Set new temporary value. 
                this.setTemporaryValue(pPropertyName, pNewValue);
                return true;
            },

            /**
             * Restrict property deletion.
             */
            deleteProperty: (): boolean => {
                throw new Exception('Deleting properties is not allowed', this);
            },

            /**
             * Get a list of all property owned by this data.
             * @returns list of propery key owned by this data.
             */
            ownKeys: () => {
                // Concat keys from default data and local data. Wrap in Set to distinct array.
                return [...new Set([...(Object.keys(this.mComponent.processor)), ...this.getTemporaryValuesList()])];
            }
        });
    }

    /**
     * Get all keys of temorary values.
     */
    private getTemporaryValuesList(): Array<string> {
        const lKeyList: Array<string> = this.mTemporaryValues.map<string>((pKey: string) => pKey);

        // Get key list from parent.
        if (this.mParentScope) {
            lKeyList.push(...this.mParentScope.getTemporaryValuesList());
        }

        return lKeyList;
    }

    /**
     * Gets the html element specified temporary value.
     * 
     * @param pValueName - Name of value.
     */
    private getValue<TValue>(pValueName: string): TValue | undefined {
        // Only return value when it exists in current scope.
        if (this.mTemporaryValues.has(pValueName)) {
            return this.mTemporaryValues.get(pValueName);
        }

        // If value was not found and parent exists, search in parent values.
        if (this.mParentScope) {
            return this.mParentScope.getValue(pValueName);
        }

        // When it does not exist in current scope nor in parent, return component processor value.
        // This in hits only on root scoped values. child scopeds can never access the component processor.
        if (pValueName in this.mComponent.processor) {
            return (<{ [key: PropertyKey]: any; }>this.mComponent.processor)[pValueName];
        }

        return undefined;
    }

    /**
     * Gets the html element specified temporary value.
     * @param pValueName - Name of value.
     */
    private hasTemporaryValue(pValueName: string): boolean {
        const lExists: boolean = this.mTemporaryValues.has(pValueName);

        // Exists. So it will be.
        if (lExists) {
            return true;
        }

        // No parent and value does not exist.
        if (!this.mParentScope) {
            return false;
        }

        // If value was not found and parent exists, search in parent values.
        return this.mParentScope.hasTemporaryValue(pValueName);
    }
}

type ScopedValueData = { [key: PropertyKey]: any; };