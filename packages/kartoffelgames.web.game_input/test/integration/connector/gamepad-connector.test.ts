import { expect } from 'chai';
import { GamepadButton, InputButtonEvent } from '../../../source';
import { DeviceConfiguration } from '../../../source/configuration/device-configuration';
import { GamepadButtonMapping } from '../../../source/configuration/gamepad-button-mapping';
import { InputConfiguration } from '../../../source/configuration/input-configuration';
import { GamepadConnector } from '../../../source/connector/gamepad-connector';
import { BaseInputDevice } from '../../../source/device/base-input-device';
import { GamepadInputDevice } from '../../../source/device/gamepad-input-device';
import { ButtonValueType } from '../../../source/enum/button-value-type.enum';
import { InputDevices } from '../../../source/input-devices';
import { AddGamepad, RemoveGamepad } from '../../mock/gamepad-mock';

let gIndex: number = 0;
const gNextIndex = () => {
    return gIndex++;
};

const gInputDeviceList: Array<InputDevices> = [];

describe('GamepadConnector', () => {
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

    it('-- Connect gamepad', async () => {
        // Setup variables.
        const lGamepadIndex: number = gNextIndex();

        // Setup.
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
        expect(lDevice).to.be.instanceOf(GamepadInputDevice);
        expect(lDevice.connected).to.be.true;
    });

    it('-- Disconnect gamepad', async () => {
        // Setup variables.
        const lGamepadIndex: number = gNextIndex();

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lInputDevices: InputDevices = new InputDevices(lConfig);
        gInputDeviceList.push(lInputDevices); // For cleanup.  
        AddGamepad(lGamepadIndex, 0, ButtonValueType.Button, 0);

        // Process.
        lInputDevices.registerConnector(new GamepadConnector());
        const lDevice: GamepadInputDevice = await new Promise((pResolve) => {
            lInputDevices.onConnectionChange((pDevice: BaseInputDevice) => {
                if (!pDevice.connected) {
                    pResolve(<GamepadInputDevice>pDevice);
                }
            });
            RemoveGamepad(lGamepadIndex);
        });

        // Evaluation.
        expect(lDevice).to.be.instanceOf(GamepadInputDevice);
        expect(lDevice.connected).to.be.false;
    });

    it('-- Connect already connected', () => {
        // Setup variables.
        const lGamepadIndex: number = gNextIndex();

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lInputDevices: InputDevices = new InputDevices(lConfig);
        gInputDeviceList.push(lInputDevices); // For cleanup.    
        AddGamepad(lGamepadIndex, 0, ButtonValueType.Button, 0);

        // Process.
        lInputDevices.registerConnector(new GamepadConnector());
        const lDeviceList: Array<BaseInputDevice> = lInputDevices.devices;

        // Evaluation.
        expect(lDeviceList).to.length.greaterThan(0);
    });

    it('-- Reconnect gamepad', async () => {
        // Setup variables.
        const lGamepadIndex: number = gNextIndex();

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lInputDevices: InputDevices = new InputDevices(lConfig);
        gInputDeviceList.push(lInputDevices); // For cleanup.

        // Setup connect device.
        lInputDevices.registerConnector(new GamepadConnector());
        await new Promise((pResolve) => {
            lInputDevices.onConnectionChange(() => {
                pResolve(true);
            });
            AddGamepad(lGamepadIndex, 0, ButtonValueType.Button, 0);
        });

        // Setup disconnect device.
        await new Promise((pResolve) => {
            lInputDevices.onConnectionChange(() => {
                pResolve(true);
            });
            RemoveGamepad(lGamepadIndex);
        });

        // Process. Reconnect device.
        const lDevice: GamepadInputDevice = await new Promise((pResolve) => {
            lInputDevices.onConnectionChange((pDevice: BaseInputDevice) => {
                pResolve(<GamepadInputDevice>pDevice);
            });
            AddGamepad(lGamepadIndex, 0, ButtonValueType.Button, 0);
        });

        // Evaluation.
        expect(lDevice).to.be.instanceOf(GamepadInputDevice);
        expect(lDevice.connected).to.be.true;
    });

    it('-- Apply correct mapping', async () => {
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
            lDevice.addEventListener('buttonstatechange', (pEvent: InputButtonEvent) => {
                pResolve(pEvent.state);
            });
            AddGamepad(lGamepadIndex, lPressedButtonIndex, ButtonValueType.Button, lButtonValue);
        });

        // Evaluation.
        expect(lButtonState).to.be.equal(lButtonValue);
    });
});