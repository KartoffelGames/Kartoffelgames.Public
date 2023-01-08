import { expect } from 'chai';
import { DeviceConfiguration } from '../../../source/configuration/device-configuration';
import { InputConfiguration } from '../../../source/configuration/input-configuration';
import { MouseKeyboardConnector } from '../../../source/connector/mouse-keyboard-connector';
import { BaseInputDevice } from '../../../source/device/base-input-device';
import { MouseKeyboardInputDevice } from '../../../source/device/mouse-keyboard-input-device';
import { InputDevices } from '../../../source/input-devices';
import '../../mock/request-animation-frame-mock-session';

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

    it('Method: constructor', () => {
        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lInputDevices: InputDevices = new InputDevices(lConfig);
        gInputDeviceList.push(lInputDevices); // For cleanup.
        lInputDevices.registerConnector(new MouseKeyboardConnector());

        // Process.
        const lDeviceList: Array<BaseInputDevice> = lInputDevices.devices;

        // Evaluation.
        expect(lDeviceList[0]).to.be.instanceOf(MouseKeyboardInputDevice);
    });
});