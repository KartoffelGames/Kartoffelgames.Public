import { Dictionary, ICloneable } from '@kartoffelgames/core';
import { InputButton } from '../types';

export class DeviceConfiguration implements ICloneable<DeviceConfiguration>{
    private readonly mActionsButtons: Dictionary<InputButton, Set<string>>;
    private readonly mButtonActions: Dictionary<string, Set<InputButton>>;
    private mTriggerTolerance: number;

    /**
     * Get all key actions.
     */
    public get keyActions(): Array<ButtonAction> {
        return this.mButtonActions.map<ButtonAction>((pKey: string, pValue: Set<InputButton>) => {
            return { name: pKey, buttons: [...pValue] };
        });
    }

    /**
     * Tolerance on wich buttons and axis are marked as pressed.
     */
    public get triggerTolerance(): number {
        return this.mTriggerTolerance;
    } set triggerTolerance(pTolerance: number) {
        this.mTriggerTolerance = pTolerance;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mTriggerTolerance = 0;
        this.mButtonActions = new Dictionary<string, Set<InputButton>>();
        this.mActionsButtons = new Dictionary<InputButton, Set<string>>();
    }

    /**
     * Add key actions.
     * @param pName - Action name.
     * @param pButtons - Buttons binded to action.
     */
    public addAction(pName: string, pButtons: Array<InputButton>): void {
        this.mButtonActions.set(pName, new Set(pButtons));

        // Map keys to actions. 
        for (const lKey of pButtons) {
            // Init action list.
            if (!this.mActionsButtons.has(lKey)) {
                this.mActionsButtons.set(lKey, new Set());
            }

            this.mActionsButtons.get(lKey)!.add(pName);
        }
    }

    /**
     * Clone device configuration.
     */
    public clone(): DeviceConfiguration {
        const lClone: DeviceConfiguration = new DeviceConfiguration();

        // Trigger tolerance.
        lClone.triggerTolerance = this.triggerTolerance;

        // Copy actions.
        for (const lAction of this.mButtonActions) {
            lClone.addAction(lAction[0], [...lAction[1]]);
        }

        return lClone;
    }

    /**
     * Get keys of actions.
     * @param pActionName - Action name.
     */
    public getActionButtons(pActionName: string): Array<InputButton> {
        return [...(this.mButtonActions.get(pActionName) ?? [])];
    }

    /**
     * Get all actions asigned to button.
     * @param pButton - Button.
     */
    public getActionOfButton(pButton: InputButton): Array<string> {
        // Copy Set to array.
        return [...(this.mActionsButtons.get(pButton) ?? [])];
    }
}

export type ButtonAction = {
    name: string,
    buttons: Array<InputButton>;
};