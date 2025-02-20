import { expect } from '@kartoffelgames/core-test';
import { after, describe, it } from '@std/testing/bdd';
import { DeviceConfiguration } from '../../../source/configuration/device-configuration.ts';
import { InputConfiguration } from '../../../source/configuration/input-configuration.ts';
import { MouseKeyboardConnector } from '../../../source/connector/mouse-keyboard-connector.ts';
import { BaseInputDevice } from '../../../source/device/base-input-device.ts';
import { MouseKeyboardInputDevice } from '../../../source/device/mouse-keyboard-input-device.ts';
import { InputDevices } from '../../../source/input-devices.ts';
import '../../mock/request-animation-frame-mock-session.ts';

const gInputDeviceList: Array<InputDevices> = [];

describe('MouseKeyboardConnector', () => {
    after(() => {
        for (const lInputDevices of gInputDeviceList) {
            // Cleanup.
            for (const lDevice of lInputDevices.devices) {
                lInputDevices.unregisterDevice(lDevice);
            }
        }
    });

    it('-- Connect mouse keyboard', () => {
        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lInputDevices: InputDevices = new InputDevices(lConfig);
        gInputDeviceList.push(lInputDevices); // For cleanup.
        lInputDevices.registerConnector(new MouseKeyboardConnector());

        // Process.
        const lDeviceList: Array<BaseInputDevice> = lInputDevices.devices;

        // Evaluation.
        expect(lDeviceList[0]).toBeInstanceOf(MouseKeyboardInputDevice);
    });
});