import { Dictionary } from '@kartoffelgames/core.data';
import { KeyboardButton } from '../enum/keyboard-button.enum';
import { GamepadButton } from '../enum/gamepad-button.enum';
import { InputButton } from '../types';

export class InputButtonAlias {
    private readonly mAlias: Dictionary<InputButton, Array<GamepadButton> | Array<KeyboardButton>>;
    private readonly mAssignedAlias: Dictionary<InputButton, Array<InputButton>>;

    /**
     * Constructor.
     */
    public constructor() {
        this.mAlias = new Dictionary<InputButton, Array<GamepadButton> | Array<KeyboardButton>>();
        this.mAssignedAlias = new Dictionary<InputButton, Array<InputButton>>();
    }

    /**
     * Get alias of button.
     * @param pTargetButton - Button.
     */
    public aliasOf(pTargetButton: InputButton): Array<InputButton> | null {
        return this.mAlias.get(pTargetButton) ?? null;
    }

    /**
     * Get all assigned target buttons of alias button.
     * @param pAliasButton - Alias button.
     */
    public assignedTargetOf(pAliasButton: InputButton): Array<InputButton> | null {
        return this.mAssignedAlias.get(pAliasButton) ?? null;
    }

    /**
     * Set alias buttons that trigger the target when all alias buttons are pressed.
     * @param pTargetButton - Target button.
     * @param pAlias - Alias buttons.
     */
    public setAlias(pTargetButton: InputButton, pAlias: Array<GamepadButton> | Array<KeyboardButton>): void {
        this.mAlias.set(pTargetButton, pAlias);

        for (const lAliasButton of pAlias) {
            // Init target button list when not set.
            if (!this.mAssignedAlias.has(lAliasButton)) {
                this.mAssignedAlias.set(lAliasButton, new Array<InputButton>());
            }

            // Add target button to 
            const lTargetButtonList: Array<InputButton> = <Array<InputButton>>this.mAssignedAlias.get(lAliasButton);
            if (!lTargetButtonList.includes(pTargetButton)) {
                lTargetButtonList.push(pTargetButton);
            }
        }
    }
}