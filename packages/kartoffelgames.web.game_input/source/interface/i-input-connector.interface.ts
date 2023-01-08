import { InputDevices } from '../input-devices';

export interface IInputConnector {
    /**
     * Start connection cycle.
     * @param pDevices - Device register.
     */
    init(pDevices: InputDevices): void;
}