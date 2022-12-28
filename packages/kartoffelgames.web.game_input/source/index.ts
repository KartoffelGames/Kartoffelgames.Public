import { MouseKeyboardConnection } from './keyboard_mouse/mouse-keyboard-connection';
GamepadConnection.init();

import { GamepadConnection } from './gampad/gamepad-connection';
MouseKeyboardConnection.init();

export { GamepadConnection, MouseKeyboardConnection };
export { InputDevices } from './input-devices';
export { InputConfiguration } from './configuration/input-configuration';