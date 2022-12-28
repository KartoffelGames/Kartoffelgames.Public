import { InputDevice } from '../enum/input-device.enum';
import { InputDevices } from '../input-devices';
import { MouseKeyboardGameInput } from './mouse-keyboard-game-input';

export class MouseKeyboardConnection {
    /**
     * Init keyboard and mouse input devices.
     */
    public static init(): void {
        InputDevices.registerDevice(new MouseKeyboardGameInput('KEYBOARD_MOUSE_1', InputDevice.MouseKeyboard));
    }
}