import { expect } from '@kartoffelgames/core-test';
import { after, describe, it } from '@std/testing/bdd';
import { DeviceConfiguration } from '../../../source/configuration/device-configuration.ts';
import { GamepadButtonMapping } from '../../../source/configuration/gamepad-button-mapping.ts';
import { InputConfiguration } from '../../../source/configuration/input-configuration.ts';
import { GamepadConnector } from '../../../source/connector/gamepad-connector.ts';
import { BaseInputDevice } from '../../../source/device/base-input-device.ts';
import { GamepadInputDevice } from '../../../source/device/gamepad-input-device.ts';
import { ButtonValueType } from '../../../source/enum/button-value-type.enum.ts';
import { GamepadButton } from '../../../source/enum/gamepad-button.enum.ts';
import { InputDevice } from '../../../source/enum/input-device.enum.ts';
import { InputButtonEvent } from '../../../source/event/input-button-event.ts';
import { InputDevices } from '../../../source/input-devices.ts';
import { AddGamepad, RemoveGamepad } from '../../mock/gamepad-mock.ts';
import '../../mock/request-animation-frame-mock-session.ts';

let gIndex: number = 0;
const gNextIndex = () => {
    return gIndex++;
};

const gInputDeviceList: Array<InputDevices> = [];

describe('GamepadInputDevice', () => {
    after(() => {
        for (const lInputDevices of gInputDeviceList) {
            // Cleanup.
            for (const lDevice of lInputDevices.devices) {
                lInputDevices.unregisterDevice(lDevice);
            }
        }

        for (let lIndex = 0; lIndex <= gIndex; lIndex++) {
            RemoveGamepad(lIndex);
        }
    });

    it('-- Button down', async () => {
        // Setup variables.
        const lGamepadIndex: number = gNextIndex();
        const lPressedButton = GamepadButton.ButtonRight;
        const lPressedButtonIndex = 1;
        const lButtonValue = 0.8;

        // Setup config.
        const lGamepadMapping = new GamepadButtonMapping();
        lGamepadMapping.addMapping(lPressedButton, ButtonValueType.Button, lPressedButtonIndex);

        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        lConfig.addGamepadMapping(/Gamepad_mock/, lGamepadMapping);

        // Setup.
        const lInputDevices: InputDevices = new InputDevices(lConfig);
        gInputDeviceList.push(lInputDevices); // For cleanup.

        // Process.
        lInputDevices.registerConnector(new GamepadConnector());
        const lDevice: GamepadInputDevice = await new Promise((pResolve) => {
            lInputDevices.onConnectionChange((pDevice: BaseInputDevice) => {
                pResolve(<GamepadInputDevice>pDevice);
            });
            AddGamepad(lGamepadIndex, lPressedButtonIndex, ButtonValueType.Button, 0);
        });

        // Process button value.
        const lButtonState = await new Promise((pResolve) => {
            lDevice.addEventListener('buttondown', (pEvent: InputButtonEvent) => {
                pResolve(pEvent.state);
            });
            AddGamepad(lGamepadIndex, lPressedButtonIndex, ButtonValueType.Button, lButtonValue);
        });

        // Evaluation.
        expect(lButtonState).toBe(lButtonValue);
    });

    it('-- Button up', async () => {
        // Setup variables.
        const lGamepadIndex: number = gNextIndex();
        const lPressedButton = GamepadButton.ButtonRight;
        const lPressedButtonIndex = 1;

        // Setup config.
        const lGamepadMapping = new GamepadButtonMapping();
        lGamepadMapping.addMapping(lPressedButton, ButtonValueType.Button, lPressedButtonIndex);

        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        lConfig.addGamepadMapping(/Gamepad_mock/, lGamepadMapping);

        // Setup.
        const lInputDevices: InputDevices = new InputDevices(lConfig);
        gInputDeviceList.push(lInputDevices); // For cleanup.

        // Process.
        lInputDevices.registerConnector(new GamepadConnector());
        const lDevice: GamepadInputDevice = await new Promise((pResolve) => {
            lInputDevices.onConnectionChange((pDevice: BaseInputDevice) => {
                pResolve(<GamepadInputDevice>pDevice);
            });
            AddGamepad(lGamepadIndex, lPressedButtonIndex, ButtonValueType.Button, 0);
        });

        // Process button value.
        await new Promise((pResolve) => {
            lDevice.addEventListener('buttondown', (pEvent: InputButtonEvent) => {
                pResolve(pEvent.state);
            });
            AddGamepad(lGamepadIndex, lPressedButtonIndex, ButtonValueType.Button, 1);
        });

        // Process button value.
        const lButtonState = await new Promise((pResolve) => {
            lDevice.addEventListener('buttonup', (pEvent: InputButtonEvent) => {
                pResolve(pEvent.state);
            });
            AddGamepad(lGamepadIndex, lPressedButtonIndex, ButtonValueType.Button, 0);
        });

        // Evaluation.
        expect(lButtonState).toBe(0);
    });

    it('-- Axis move', async () => {
        // Setup variables.
        const lGamepadIndex: number = gNextIndex();
        const lPressedButton = GamepadButton.LeftThumbStickXaxis;
        const lPressedButtonIndex = 1;
        const lButtonValue = 0.8;

        // Setup config.
        const lGamepadMapping = new GamepadButtonMapping();
        lGamepadMapping.addMapping(lPressedButton, ButtonValueType.Axis, lPressedButtonIndex);

        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        lConfig.addGamepadMapping(/Gamepad_mock/, lGamepadMapping);

        // Setup.
        const lInputDevices: InputDevices = new InputDevices(lConfig);
        gInputDeviceList.push(lInputDevices); // For cleanup.

        // Process.
        lInputDevices.registerConnector(new GamepadConnector());
        const lDevice: GamepadInputDevice = await new Promise((pResolve) => {
            lInputDevices.onConnectionChange((pDevice: BaseInputDevice) => {
                pResolve(<GamepadInputDevice>pDevice);
            });
            AddGamepad(lGamepadIndex, lPressedButtonIndex, ButtonValueType.Axis, 0);
        });

        // Process button value.
        const lButtonState = await new Promise((pResolve) => {
            lDevice.addEventListener('buttondown', (pEvent: InputButtonEvent) => {
                pResolve(pEvent.state);
            });
            AddGamepad(lGamepadIndex, lPressedButtonIndex, ButtonValueType.Axis, lButtonValue);

            // TODO: Test inifitiy pennding.
            pResolve(-999);
        });

        // Evaluation.
        expect(lButtonState).toBe(lButtonValue);
    });

    it('-- Device type', async () => {
        // Setup variables.
        const lGamepadIndex: number = gNextIndex();

        // Setup config.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lInputDevices: InputDevices = new InputDevices(lConfig);
        gInputDeviceList.push(lInputDevices); // For cleanup.

        // Process.
        lInputDevices.registerConnector(new GamepadConnector());
        const lDevice: GamepadInputDevice = await new Promise((pResolve) => {
            lInputDevices.onConnectionChange((pDevice: BaseInputDevice) => {
                pResolve(<GamepadInputDevice>pDevice);
            });
            AddGamepad(lGamepadIndex, 0, ButtonValueType.Button, 0);
        });

        // Evaluation.
        expect(lDevice.deviceType).toBe(InputDevice.Gamepad);
    });
});