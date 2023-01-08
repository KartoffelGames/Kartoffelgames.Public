import { expect } from 'chai';
import { DeviceConfiguration } from '../../../source/configuration/device-configuration';
import { GamepadButtonMapping } from '../../../source/configuration/gamepad-button-mapping';
import { InputConfiguration } from '../../../source/configuration/input-configuration';

describe('InputConfiguration', () => {
    it('Method: addGamepadMapping', () => {
        // Setup values.
        const lGamepadId: string = 'GAMEPAD_ID';
        const lMapping = new GamepadButtonMapping();

        // Setup.
        const lInputConfig = new InputConfiguration(new DeviceConfiguration());

        // Process.
        lInputConfig.addGamepadMapping(/GAMEPAD_ID/, lMapping);
        const lResult = lInputConfig.getGampadMapping(lGamepadId, '');

        // Evaluation.
        expect(lResult).to.equal(lMapping);
    });

    describe('Method: deviceConfiguration', () => {
        it('-- New device', () => {
            // Setup.
            const lDeviceConfig = new DeviceConfiguration();
            const lInputConfig = new InputConfiguration(lDeviceConfig);

            // Process.
            const lResult = lInputConfig.deviceConfiguration('DeviceID');

            // Evaluation.
            expect(lResult).to.deep.equal(lDeviceConfig);
        });

        it('-- Old device', () => {
            // Setup.
            const lStandardDeviceConfig = new DeviceConfiguration();
            const lInputConfig = new InputConfiguration(lStandardDeviceConfig);
            const lDeviceConfig = lInputConfig.deviceConfiguration('DeviceID');

            // Process.
            const lResult = lInputConfig.deviceConfiguration('DeviceID');

            // Evaluation.
            expect(lResult).to.equal(lDeviceConfig);
        });
    });

    describe('Method: getGampadMapping', () => {
        it('-- Default mapping when no mapping', () => {
            // Setup.
            const lInputConfig = new InputConfiguration(new DeviceConfiguration());

            // Process.
            const lResultOne = lInputConfig.getGampadMapping('SOME_ID', '');
            const lResultOther = lInputConfig.getGampadMapping('SOME_OTHER_ID', '');

            // Evaluation.
            expect(lResultOne).to.equal(lResultOther);
        });

        it('-- Standard mapping mapping', () => {
            // Setup.
            const lInputConfig = new InputConfiguration(new DeviceConfiguration());
            const lStandardMapping = lInputConfig.getGampadMapping('DEFAULT_ID', '');

            // Process.
            const lResult = lInputConfig.getGampadMapping('', 'standard');

            // Evaluation.
            expect(lResult).to.equal(lStandardMapping);
        });

        it('-- Set mapping', () => {
            // Setup values.
            const lGamepadId: string = 'GAMEPAD_ID';
            const lMapping = new GamepadButtonMapping();

            // Setup.
            const lInputConfig = new InputConfiguration(new DeviceConfiguration());
            lInputConfig.addGamepadMapping(/GAMEPAD_ID/, lMapping);

            // Process.
            const lResult = lInputConfig.getGampadMapping(lGamepadId, 'standard');

            // Evaluation.
            expect(lResult).to.equal(lMapping);
        });
    });
});