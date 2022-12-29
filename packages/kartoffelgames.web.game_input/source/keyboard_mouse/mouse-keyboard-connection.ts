import { InputDevices } from '../input-devices';
import { MouseKeyboardGameInput } from './mouse-keyboard-game-input';

export class MouseKeyboardConnection {
    /**
     * Init keyboard and mouse input devices.
     */
    public static init(): void {
        InputDevices.registerDevice(new MouseKeyboardGameInput());
    }
}