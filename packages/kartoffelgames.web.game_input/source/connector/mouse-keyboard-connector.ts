import type { IInputConnector } from '../interface/i-input-connector.interface.ts';
import type { InputDevices } from '../input-devices.ts';
import { MouseKeyboardInputDevice } from '../device/mouse-keyboard-input-device.ts';

export class MouseKeyboardConnector implements IInputConnector {
    /**
     * Init keyboard and mouse input devices.
     */
    public init(pDevices: InputDevices): void {
        pDevices.registerDevice(new MouseKeyboardInputDevice(pDevices.configuration));
    }
}