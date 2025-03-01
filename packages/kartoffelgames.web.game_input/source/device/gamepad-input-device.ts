import { EnumUtil } from '@kartoffelgames/core';
import type { DeviceConfiguration } from '../configuration/device-configuration.ts';
import type { GamepadButtonMapping } from '../configuration/gamepad-button-mapping.ts';
import type { InputConfiguration } from '../configuration/input-configuration.ts';
import { GamepadButton } from '../enum/gamepad-button.enum.ts';
import { InputDevice } from '../enum/input-device.enum.ts';
import { BaseInputDevice } from './base-input-device.ts';

export class GamepadInputDevice extends BaseInputDevice {
    private readonly mGamepadInformation: GamepadGameInputInformation;
    private mLoopRunning: boolean;

    /**
     * Constructor.
     * @param pGamepad - Gamepad object.
     */
    public constructor(pGamepad: GamepadGameInputInformation, pConfiguration: InputConfiguration) {
        const lDeviceId: string = `gamepad_${pGamepad.index}`;
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
        const lGamepadButtonList: Array<GamepadButton> = EnumUtil.valuesOf<GamepadButton>(GamepadButton);
        const lLoop = () => {
            // Only scan on connected gamepads.
            if (this.connected) {
                // Find connected gamepad. Gamepad does allways exists. Even after disconnect.
                const lGamepad = globalThis.navigator.getGamepads().find((pGamepad) => {
                    return pGamepad!.index === this.mGamepadInformation.index;
                })!;

                // Scan each gamepad button.
                for (const lButton of lGamepadButtonList) {
                    // Read button value.
                    const lButtonValue = this.mGamepadInformation.mapping.executeMapping(lButton, lGamepad);

                    // Set button value.
                    this.setButtonState(lButton, lButtonValue);
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