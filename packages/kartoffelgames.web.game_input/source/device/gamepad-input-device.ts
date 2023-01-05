import { EnumUtil } from '@kartoffelgames/core.data';
import { DeviceConfiguration } from '../configuration/device-configuration';
import { GamepadButtonMapping } from '../configuration/gamepad-button-mapping';
import { InputConfiguration } from '../configuration/input-configuration';
import { GamepadButton } from '../enum/gamepad-button.enum';
import { InputDevice } from '../enum/input-device.enum';
import { BaseInputDevice } from './base-input-device';

export class GamepadInputDevice extends BaseInputDevice {
    private readonly mGamepadInformation: GamepadGameInputInformation;
    private mLoopRunning: boolean;

    /**
     * Constructor.
     * @param pGamepad - Gamepad object.
     */
    public constructor(pGamepad: GamepadGameInputInformation, pConfiguration: InputConfiguration) {
        const lDeviceId: string = `gamepad_${pGamepad.id}`;
        const lDeviceConfiguration: DeviceConfiguration = pConfiguration.deviceConfiguration(lDeviceId);

        super(lDeviceId, InputDevice.Gamepad, lDeviceConfiguration);

        this.mGamepadInformation = pGamepad;
        this.mLoopRunning = false;
    }

    /**
     * On connection state change.
     */
    protected onConnectionStateChange(): void {
        if (this.connected && !this.mLoopRunning) {
            this.startScanLoop();
        }
    }

    /**
     * Start scanning for pressed buttons.
     */
    private startScanLoop(): void {
        // Get all gamepad buttons.
        const lGamepadButtonList: Array<GamepadButton> = EnumUtil.enumValuesToArray<GamepadButton>(GamepadButton);
        const lLoop = () => {
            // Only scan on connected gamepads.
            if (this.connected) {
                // Find connected gamepad.
                const lGamepad = globalThis.navigator.getGamepads().find((pGamepad) => {
                    return pGamepad?.id === this.mGamepadInformation.id;
                });

                // On found gamepad.
                if (lGamepad) {
                    // Scan each gamepad button.
                    for (const lButton of lGamepadButtonList) {
                        // Read button value.
                        const lButtonValue = this.mGamepadInformation.mapping.executeMapping(lButton, lGamepad);

                        // Set button value.
                        this.setButtonState(lButton, lButtonValue);
                    }
                } else {
                    // Disconnect gamepad when not found.
                    this.connected = false;
                }
            }

            // Stop loop on disconnect.
            if (this.connected) {
                globalThis.requestAnimationFrame(lLoop);
            } else {
                this.mLoopRunning = false;
            }
        };

        // Request starting animation frame.
        globalThis.requestAnimationFrame(lLoop);
        this.mLoopRunning = true;
    }
}

export type GamepadGameInputInformation = {
    index: number;
    id: string;
    mapping: GamepadButtonMapping;
};