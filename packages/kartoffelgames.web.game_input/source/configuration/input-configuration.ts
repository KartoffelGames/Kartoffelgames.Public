import { Dictionary } from '@kartoffelgames/core';
import { ButtonValueType } from '../enum/button-value-type.enum.ts';
import type { DeviceConfiguration } from './device-configuration.ts';
import { GamepadButtonMapping } from './gamepad-button-mapping.ts';

export class InputConfiguration {
    private readonly mDefaultDevice: DeviceConfiguration;
    private readonly mDeviceSettings: Dictionary<string, DeviceConfiguration>;
    private readonly mGampadMappingList: Array<MappingAssignment> = new Array<MappingAssignment>();
    private readonly mStandardGamepadMapping: GamepadButtonMapping;

    /**
     * Constructor.
     */
    public constructor(pDefault: DeviceConfiguration) {
        this.mDeviceSettings = new Dictionary<string, DeviceConfiguration>();
        this.mDefaultDevice = pDefault;

        // Gamepad mapping.
        this.mGampadMappingList = new Array<MappingAssignment>();
        this.mStandardGamepadMapping = new GamepadButtonMapping({
            clusterButtonBottom: { type: ButtonValueType.Button, index: 0 },
            clusterButtonRight: { type: ButtonValueType.Button, index: 1 },
            clusterButtonLeft: { type: ButtonValueType.Button, index: 2 },
            clusterButtonTop: { type: ButtonValueType.Button, index: 3 },
            buttonLeft: { type: ButtonValueType.Button, index: 4 },
            buttonRight: { type: ButtonValueType.Button, index: 5 },
            triggerLeft: { type: ButtonValueType.Button, index: 6 },
            triggerRight: { type: ButtonValueType.Button, index: 7 },
            selectButton: { type: ButtonValueType.Button, index: 8 },
            startButton: { type: ButtonValueType.Button, index: 9 },
            homeButton: { type: ButtonValueType.Button, index: 16 },
            directionalPadTop: { type: ButtonValueType.Button, index: 12 },
            directionalPadBottom: { type: ButtonValueType.Button, index: 13 },
            directionalPadRight: { type: ButtonValueType.Button, index: 15 },
            directionalPadLeft: { type: ButtonValueType.Button, index: 14 },
            leftThumbStickButton: { type: ButtonValueType.Button, index: 10 },
            leftThumbStickXaxis: { type: ButtonValueType.Axis, index: 0 },
            leftThumbStickYaxis: { type: ButtonValueType.Axis, index: 1 },
            rightThumbStickButton: { type: ButtonValueType.Button, index: 11 },
            rightThumbStickXaxis: { type: ButtonValueType.Axis, index: 2 },
            rightThumbStickYaxis: { type: ButtonValueType.Axis, index: 3 },
        });
    }

    /**
     * Add gamepad mapping by id matching.
     * @param pIdAssignment - Regex for assigning to matching gamepad ids.
     * @param pMapping - Gamepad mapping.
     */
    public addGamepadMapping(pIdAssignment: RegExp, pMapping: GamepadButtonMapping): void {
        this.mGampadMappingList.push({ mapping: pMapping, idMatch: pIdAssignment });
    }

    /**
     * Get device settings.
     * @param pDeviceId - Device id.
     */
    public deviceConfiguration(pDeviceId: string): DeviceConfiguration {
        // Init device with cloned default configuration.
        if (!this.mDeviceSettings.has(pDeviceId)) {
            const lDefaultClone: DeviceConfiguration = this.mDefaultDevice.clone();
            this.mDeviceSettings.set(pDeviceId, lDefaultClone);
        }

        return this.mDeviceSettings.get(pDeviceId)!;
    }

    /**
     * Get mapping of gamepad.
     * @param pGamepadId - Manufacturer id of gamepad.
     */
    public getGampadMapping(pGamepadId: string, pGamepadMappingType: GamepadMappingType): GamepadButtonMapping {
        for (const lMappingAssignment of this.mGampadMappingList) {
            if (lMappingAssignment.idMatch.test(pGamepadId)) {
                return lMappingAssignment.mapping;
            }
        }

        // Map with gamepad mapping type.
        if (pGamepadMappingType === 'standard') {
            return this.mStandardGamepadMapping;
        }

        return this.mStandardGamepadMapping;
    }
}

type MappingAssignment = {
    mapping: GamepadButtonMapping,
    idMatch: RegExp;
};
