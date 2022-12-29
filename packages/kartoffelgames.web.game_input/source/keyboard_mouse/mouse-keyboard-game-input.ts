import { InputDevice } from '../enum/input-device.enum';
import { KeyboardButton } from '../enum/keyboard-button.enum';
import { MouseButton } from '../enum/mouse-button.enum';
import { BaseGameInput } from '../game_input/base-game-input';

export class MouseKeyboardGameInput extends BaseGameInput {

    /**
     * Constructor.
     * @param pGamepad - Gamepad object.
     */
    public constructor() {
        super('KEYBOARD_MOUSE_1', InputDevice.MouseKeyboard);

        this.setupCaptureListener();
    }

    /**
     * Set value of mouse button.
     * @param pButtonNumber - Button number of MouseEvent.button.
     * @param pValue - Button values.
     */
    private setMouseButtonValue(pButtonNumber: number, pValue: number): void {
        switch (pButtonNumber) {
            case 0: {
                this.setButtonState(MouseButton.MainLeft, pValue);
                break;
            }
            case 1: {
                this.setButtonState(MouseButton.MainMiddle, pValue);
                break;
            }
            case 2: {
                this.setButtonState(MouseButton.MainRight, pValue);
                break;
            }
            case 3: {
                this.setButtonState(MouseButton.SecondaryBack, pValue);
                break;
            }
            case 4: {
                this.setButtonState(MouseButton.SecondaryForward, pValue);
                break;
            }
        }
    }

    /**
     * Setup event listener for keyboard and mouse events.
     */
    private setupCaptureListener(): void {
        // Capture mouse movement. Calculate to axis value by set base value to 10 pixels.
        document.addEventListener('mousemove', (pMouseEvent) => {
            this.setButtonState(MouseButton.Xaxis, pMouseEvent.movementX / 10);
            this.setButtonState(MouseButton.Yaxis, pMouseEvent.movementY / 10);
        });

        // Mouse button events.
        document.addEventListener('mouseup', (pMouseEvent) => {
            this.setMouseButtonValue(pMouseEvent.button, 0);
        });
        document.addEventListener('mousedown', (pMouseEvent) => {
            this.setMouseButtonValue(pMouseEvent.button, 1);
        });

        // Keyboard event.
        document.addEventListener('keydown', (pKeyboardEvent) => {
            const lInputKey: KeyboardButton = <KeyboardButton>pKeyboardEvent.code;
            this.setButtonState(lInputKey, 1);
        });
        document.addEventListener('keyup', (pKeyboardEvent) => {
            const lInputKey: KeyboardButton = <KeyboardButton>pKeyboardEvent.code;
            this.setButtonState(lInputKey, 0);
        });
    }
}