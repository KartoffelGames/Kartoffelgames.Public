import type { InputDevices } from '../input-devices.ts';

export interface IInputConnector {
    /**
     * Start connection cycle.
     * @param pDevices - Device register.
     */
    init(pDevices: InputDevices): void;
}