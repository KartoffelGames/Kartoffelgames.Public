import { expect } from 'chai';
import { DeviceConfiguration } from '../../source/configuration/device-configuration';
import { InputConfiguration } from '../../source/configuration/input-configuration';
import { MouseKeyboardConnector } from '../../source/connector/mouse-keyboard-connector';
import { BaseInputDevice } from '../../source/device/base-input-device';
import { MouseKeyboardInputDevice } from '../../source/device/mouse-keyboard-input-device';
import { InputDevices } from '../../source/input-devices';
import '../mock/request-animation-frame-mock-session';

const gCreateConfig = (): InputConfiguration => {
    const lDeviceConfiguration = new DeviceConfiguration();
    return new InputConfiguration(lDeviceConfiguration);
};

const gInputDeviceList: Array<InputDevices> = [];

describe('InputDevices', () => {
    after(() => {
        for (const lInputDevices of gInputDeviceList) {
            // Cleanup.
            for (const lDevice of lInputDevices.devices) {
                lInputDevices.unregisterDevice(lDevice);
            }
        }
    });

    it('Property: configuration', () => {
        // Setup.
        const lConfig: InputConfiguration = gCreateConfig();
        const lInputDevices: InputDevices = new InputDevices(lConfig);

        // Process.
        const lResultConfiguration: InputConfiguration = lInputDevices.configuration;

        // Evaluation.
        expect(lResultConfiguration).to.equal(lConfig);
    });

    it('Property: devices', () => {
        // Setup.
        const lConfig: InputConfiguration = gCreateConfig();
        const lInputDevices: InputDevices = new InputDevices(lConfig);
        gInputDeviceList.push(lInputDevices); // For cleanup.
        lInputDevices.registerConnector(new MouseKeyboardConnector());

        // Process.
        const lDeviceList: Array<BaseInputDevice> = lInputDevices.devices;

        // Evaluation.
        expect(lDeviceList[0]).to.be.instanceOf(MouseKeyboardInputDevice);
    });

    it('Method: onConnectionChange', () => {
        // Setup.
        const lConfig: InputConfiguration = gCreateConfig();
        const lInputDevices: InputDevices = new InputDevices(lConfig);
        gInputDeviceList.push(lInputDevices); // For cleanup.

        // Process.
        let lDevice: BaseInputDevice | null = null;
        lInputDevices.onConnectionChange((pDevice: BaseInputDevice) => {
            lDevice = pDevice;
        });
        lInputDevices.registerConnector(new MouseKeyboardConnector());

        // Evaluation.
        expect(lDevice).to.be.instanceOf(MouseKeyboardInputDevice);
    });

    it('Method: registerConnector', () => {
        // Setup.
        const lConfig: InputConfiguration = gCreateConfig();
        const lInputDevices: InputDevices = new InputDevices(lConfig);
        gInputDeviceList.push(lInputDevices); // For cleanup.

        // Process.
        lInputDevices.registerConnector(new MouseKeyboardConnector());
        const lDeviceList: Array<BaseInputDevice> = lInputDevices.devices;

        // Evaluation.
        expect(lDeviceList[0]).to.be.instanceOf(MouseKeyboardInputDevice);
    });

    describe('Method: registerDevice', () => {
        it('-- Single device', () => {
            // Setup.
            const lConfig: InputConfiguration = gCreateConfig();
            const lInputDevices: InputDevices = new InputDevices(lConfig);
            gInputDeviceList.push(lInputDevices); // For cleanup.

            // Setup device.
            const lDevice = new MouseKeyboardInputDevice(lConfig);

            // Process.
            lInputDevices.registerDevice(lDevice);
            const lDeviceList: Array<BaseInputDevice> = lInputDevices.devices;

            // Evaluation.
            expect(lDeviceList[0]).to.equal(lDevice);
        });

        it('-- Register two times', () => {
            // Setup.
            const lConfig: InputConfiguration = gCreateConfig();
            const lInputDevices: InputDevices = new InputDevices(lConfig);
            gInputDeviceList.push(lInputDevices); // For cleanup.

            // Setup device.
            const lDevice = new MouseKeyboardInputDevice(lConfig);

            // Process.
            lInputDevices.registerDevice(lDevice);
            lInputDevices.registerDevice(lDevice);
            const lDeviceList: Array<BaseInputDevice> = lInputDevices.devices;

            // Evaluation.
            expect(lDeviceList[0]).to.equal(lDevice);
        });
    });

    it('Method: unregisterDevice', () => {
        // Setup.
        const lConfig: InputConfiguration = gCreateConfig();
        const lInputDevices: InputDevices = new InputDevices(lConfig);
        gInputDeviceList.push(lInputDevices); // For cleanup.

        // Setup device.
        const lDevice = new MouseKeyboardInputDevice(lConfig);
        lInputDevices.registerDevice(lDevice);

        // Process.
        lInputDevices.unregisterDevice(lDevice);
        const lDeviceList: Array<BaseInputDevice> = lInputDevices.devices;

        // Evaluation.
        expect(lDeviceList[0]).to.be.instanceOf(MouseKeyboardInputDevice);
        expect(lDevice.connected).to.be.false;
    });
});