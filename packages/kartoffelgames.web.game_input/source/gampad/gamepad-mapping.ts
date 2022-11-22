import { Dictionary } from '@kartoffelgames/core.data';
import { GamepadButtonType } from './enum/gamepad-button-type.enum';
import { GamepadButton } from '../enum/gamepad-button.enum';

/**
 * Gamepad mapping.
 */
 export class GamepadMapping {
    private readonly mMapping: Dictionary<GamepadButton, GamepadButtonMapping>;

    /**
     * Constructor.
     */
    public constructor(pMapping?: { [key in GamepadButton]?: GamepadButtonMapping }) {
        this.mMapping = new Dictionary<GamepadButton, GamepadButtonMapping>();

        // Apply optional mapping.
        if (pMapping) {
            for (const lButton of Object.keys(pMapping)) {
                const lButtonMapping: GamepadButtonMapping | undefined = pMapping[<GamepadButton>lButton];
                if (lButtonMapping) {
                    this.addMapping(<GamepadButton>lButton, lButtonMapping.type, lButtonMapping.index);
                }
            }
        }
    }

    /**
     * Add button mapping.
     * @param pButton - Button.
     * @param pButtonType - Type of button.
     * @param pButtonIndex - Mapped index.
     */
    public addMapping(pButton: GamepadButton, pButtonType: GamepadButtonType, pButtonIndex: number): void {
        this.mMapping.set(pButton, { type: pButtonType, index: pButtonIndex });
    }

    /**
     * Get button value of mapped button.
     * Unmapped buttons return allways zero.
     * @param pButton - Button.
     * @param pGamepad - Gamepad data.
     */
    public executeMapping(pButton: GamepadButton, pGamepad: Gamepad): number {
        const lButtonMapping: GamepadButtonMapping | undefined = this.mMapping.get(pButton);

        // Return unpressed value on all unmapped buttons. 
        if (!lButtonMapping) {
            return 0;
        }

        // Access correct button array for axis or button  buttons.
        if (lButtonMapping.type === GamepadButtonType.Button) {
            return pGamepad.buttons[lButtonMapping.index].value;
        } else { // Axis.   
            return pGamepad.axes[lButtonMapping.index];
        }
    }
}

type GamepadButtonMapping = {
    type: GamepadButtonType;
    index: number;
};