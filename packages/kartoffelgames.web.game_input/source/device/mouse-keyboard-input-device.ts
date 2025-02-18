import { DeviceConfiguration } from '../configuration/device-configuration.ts';
import { InputConfiguration } from '../configuration/input-configuration.ts';
import { InputDevice } from '../enum/input-device.enum.ts';
import { KeyboardButton } from '../enum/keyboard-button.enum.ts';
import { MouseButton } from '../enum/mouse-button.enum.ts';
import { BaseInputDevice } from './base-input-device.ts';

export class MouseKeyboardInputDevice extends BaseInputDevice {
    private mLoopRunning: boolean;
    private mMovementX: number = 0;
    private mMovementY: number = 0;

    /**
     * Constructor.
     * @param pConfiguration - Iput configuration.
     */
    public constructor(pConfiguration: InputConfiguration) {
        const lDeviceId: string = 'KEYBOARD_MOUSE_1';
        const lDeviceConfiguration: DeviceConfiguration = pConfiguration.deviceConfiguration(lDeviceId);

        super(lDeviceId, InputDevice.MouseKeyboard, lDeviceConfiguration);

        this.mLoopRunning = false;
        this.setupCaptureListener();
    }

    /**
     * On connection state change.
     */
    protected onConnectionStateChange(): void {
        if (this.connected && !this.mLoopRunning) {
            this.startMouseMoveScanLoop();
        }
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
        document.addEventListener('mousemove', (pMouseEvent) => {
            this.mMovementX += pMouseEvent.movementX;
            this.mMovementY += pMouseEvent.movementY;
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

    /**
     * Start scanning mouse movements.
     */
    private startMouseMoveScanLoop(): void {
        // Reset mouse movement.
        this.mMovementX = 0;
        this.mMovementY = 0;

        const lMouseMoveReport = () => {
            // Calculate to axis value by set base value to 10 pixels.
            this.setButtonState(MouseButton.Xaxis, this.mMovementX / 10);
            this.setButtonState(MouseButton.Yaxis, this.mMovementY / 10);

            // Reset mouse movement.
            this.mMovementX = 0;
            this.mMovementY = 0;

            if (this.connected) {
                globalThis.requestAnimationFrame(lMouseMoveReport);
            } else {
                this.mLoopRunning = false;
            }
        };

        globalThis.requestAnimationFrame(lMouseMoveReport);
        this.mLoopRunning = true;
    }
}