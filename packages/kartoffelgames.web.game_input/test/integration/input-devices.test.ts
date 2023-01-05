import { expect } from 'chai';
import { BaseInputDevice, DeviceConfiguration, InputConfiguration, InputDevices, MouseKeyboardConnector } from '../../source';
import { MouseKeyboardInputDevice } from '../../source/device/mouse-keyboard-input-device';
import '../mock/request-animation-frame-mock-session';

const gCreateConfig = (): InputConfiguration => {
    const lDeviceConfiguration = new DeviceConfiguration();
    return new InputConfiguration(lDeviceConfiguration);
};

describe('InputDevices', () => {
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
        lInputDevices.registerConnector(new MouseKeyboardConnector());

        // Process.
        const lDeviceList: Array<BaseInputDevice> = lInputDevices.devices;

        // Evaluation.
        expect(lDeviceList[0]).to.be.instanceOf(MouseKeyboardInputDevice);

        // Cleanup.
        for (const lDevice of lInputDevices.devices) {
            lInputDevices.unregisterDevice(lDevice);
        }
    });

    it('Method: onConnectionChange', () => {
        // Setup.
        const lConfig: InputConfiguration = gCreateConfig();
        const lInputDevices: InputDevices = new InputDevices(lConfig);

        // Process.
        let lDevice: BaseInputDevice | null = null;
        lInputDevices.onConnectionChange((pDevice: BaseInputDevice) => {
            lDevice = pDevice;
        });
        lInputDevices.registerConnector(new MouseKeyboardConnector());

        // Evaluation.
        expect(lDevice).to.be.instanceOf(MouseKeyboardInputDevice);

        // Cleanup.
        for (const lDevice of lInputDevices.devices) {
            lInputDevices.unregisterDevice(lDevice);
        }
    });

    it('Method: registerConnector', () => {
        // Setup.
        const lConfig: InputConfiguration = gCreateConfig();
        const lInputDevices: InputDevices = new InputDevices(lConfig);

        // Process.
        lInputDevices.registerConnector(new MouseKeyboardConnector());
        const lDeviceList: Array<BaseInputDevice> = lInputDevices.devices;

        // Evaluation.
        expect(lDeviceList[0]).to.be.instanceOf(MouseKeyboardInputDevice);

        // Cleanup.
        for (const lDevice of lInputDevices.devices) {
            lInputDevices.unregisterDevice(lDevice);
        }
    });

    describe('Method: registerDevice', () => {
        it('-- Single device', () => {
            // Setup.
            const lConfig: InputConfiguration = gCreateConfig();
            const lInputDevices: InputDevices = new InputDevices(lConfig);

            // Setup device.
            const lDevice = new MouseKeyboardInputDevice(lConfig);

            // Process.
            lInputDevices.registerDevice(lDevice);
            const lDeviceList: Array<BaseInputDevice> = lInputDevices.devices;

            // Evaluation.
            expect(lDeviceList[0]).to.equal(lDevice);

            // Cleanup.
            for (const lDevice of lInputDevices.devices) {
                lInputDevices.unregisterDevice(lDevice);
            }
        });

        it('-- Register two times', () => {
            // Setup.
            const lConfig: InputConfiguration = gCreateConfig();
            const lInputDevices: InputDevices = new InputDevices(lConfig);

            // Setup device.
            const lDevice = new MouseKeyboardInputDevice(lConfig);

            // Process.
            lInputDevices.registerDevice(lDevice);
            lInputDevices.registerDevice(lDevice);
            const lDeviceList: Array<BaseInputDevice> = lInputDevices.devices;

            // Evaluation.
            expect(lDeviceList[0]).to.equal(lDevice);

            // Cleanup.
            for (const lDevice of lInputDevices.devices) {
                lInputDevices.unregisterDevice(lDevice);
            }
        });
    });

    it('Method: unregisterDevice', () => {
        // Setup.
        const lConfig: InputConfiguration = gCreateConfig();
        const lInputDevices: InputDevices = new InputDevices(lConfig);

        // Setup device.
        const lDevice = new MouseKeyboardInputDevice(lConfig);
        lInputDevices.registerDevice(lDevice);

        // Process.
        lInputDevices.unregisterDevice(lDevice);
        const lDeviceList: Array<BaseInputDevice> = lInputDevices.devices;

        // Evaluation.
        expect(lDeviceList[0]).to.be.instanceOf(MouseKeyboardInputDevice);
        expect(lDevice.connected).to.be.false;

        // Cleanup.
        for (const lDevice of lInputDevices.devices) {
            lInputDevices.unregisterDevice(lDevice);
        }
    });
});