import { IInputConnector } from '../interface/i-input-connector.interface';
import { InputDevices } from '../input-devices';
import { MouseKeyboardInputDevice } from '../device/mouse-keyboard-input-device';

export class MouseKeyboardConnector implements IInputConnector {
    /**
     * Init keyboard and mouse input devices.
     */
    public init(pDevices: InputDevices): void {
        pDevices.registerDevice(new MouseKeyboardInputDevice(pDevices.configuration));
    }
}