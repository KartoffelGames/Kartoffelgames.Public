import { DeviceConfiguration } from '../configuration/device-configuration';
import { InputConfiguration } from '../configuration/input-configuration';
import { InputDevice } from '../enum/input-device.enum';
import { KeyboardButton } from '../enum/keyboard-button.enum';
import { MouseButton } from '../enum/mouse-button.enum';
import { BaseInputDevice } from './base-input-device';

export class MouseKeyboardInputDevice extends BaseInputDevice {

    /**
     * Constructor.
     * @param pConfiguration - Iput configuration.
     */
    public constructor(pConfiguration: InputConfiguration) {
        const lDeviceId: string = 'KEYBOARD_MOUSE_1';
        const lDeviceConfiguration: DeviceConfiguration = pConfiguration.deviceConfiguration(lDeviceId);

        super(lDeviceId, InputDevice.MouseKeyboard, lDeviceConfiguration);

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
        // Capture mouse movement for next frame.
        let lMovementX: number = 0;
        let lMovementY: number = 0;
        document.addEventListener('mousemove', (pMouseEvent) => {
            lMovementX += pMouseEvent.movementX;
            lMovementY += pMouseEvent.movementY;
        });

        const lMouseMoveReport = () => {
            // Calculate to axis value by set base value to 10 pixels.
            this.setButtonState(MouseButton.Xaxis, lMovementX / 10);
            this.setButtonState(MouseButton.Yaxis, lMovementY / 10);

            // Reset mouse movement.
            lMovementX = 0;
            lMovementY = 0;

            window.requestAnimationFrame(lMouseMoveReport);
        };
        window.requestAnimationFrame(lMouseMoveReport);

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