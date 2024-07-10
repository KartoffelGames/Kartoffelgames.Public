import { Dictionary, Exception } from '@kartoffelgames/core';
import { Component } from '../component/component';

/**
 * Interface between persistent values directly from component and temporary values
 * that are not directly inside the component but attached to it.
 *
 * Has the {@link store} property that allways sets and gets the data to the correct location
 * or the {@link setTemporaryValue} function to only set temporary values.
 */
export class DataLevel {
    private readonly mComponent: Component;
    private readonly mDataProxy: LevelValues;
    private readonly mParentLevel: DataLevel | null;
    private mTemporaryValues: Dictionary<string, any>;

    /**
     * Data object with all current and parents data.
     */
    public get store(): LevelValues {
        return this.mDataProxy;
    }

    /**
     * Constructor.
     * New component value level.
     * @param pParentDataLeve - Parent level. Values on root level.
     */
    public constructor(pParentDataLeve: DataLevel | Component) {
        this.mTemporaryValues = new Dictionary<string, any>();

        if (pParentDataLeve instanceof Component) {
            this.mParentLevel = null;
            this.mComponent = pParentDataLeve;
        } else {
            this.mParentLevel = pParentDataLeve;
            this.mComponent = pParentDataLeve.mComponent;
        }

        // Create data proxy.
        this.mDataProxy = this.createAccessProxy();
    }

    /**
     * Add or replaces temporary value in this level.
     * 
     * @param pKey - Key of value.
     * @param pValue - Value.
     */
    public setTemporaryValue<TValue>(pKey: string, pValue: TValue): void {
        // Set value to current level.
        this.mTemporaryValues.set(pKey, pValue);
    }

    /**
     * 
     * @param pLevelData - Level data.
     */
    public updateLevelData(pLevelData: DataLevel): void {
        if(pLevelData.mParentLevel !== this.mParentLevel){
            throw new Exception(`Can't update InstructionLevelData for a deeper level than it target data.`, this);
        }

        this.mTemporaryValues = pLevelData.mTemporaryValues;
    }

    /**
     * Create a proxy object that decide what data is written to or read from temporary or processor values.
     * 
     * @returns Proxy object.
     */
    private createAccessProxy(): LevelValues {
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
        if (this.mParentLevel) {
            lKeyList.push(...this.mParentLevel.getTemporaryValuesList());
        }

        return lKeyList;
    }

    /**
     * Gets the html element specified temporary value.
     * 
     * @param pValueName - Name of value.
     */
    private getValue<TValue>(pValueName: string): TValue | undefined {
        // Only return value when it exists in current level.
        if (this.mTemporaryValues.has(pValueName)) {
            return this.mTemporaryValues.get(pValueName);
        }

        // If value was not found and parent exists, search in parent values.
        if (this.mParentLevel) {
            return this.mParentLevel.getValue(pValueName);
        }

        // When it does not exist in current level nor in parent, return component processor value.
        // This in hits only on root data level. child level can never access the component processor.
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
        if (!this.mParentLevel) {
            return false;
        }

        // If value was not found and parent exists, search in parent values.
        return this.mParentLevel.hasTemporaryValue(pValueName);
    }
}

type LevelValues = { [key: PropertyKey]: any; };