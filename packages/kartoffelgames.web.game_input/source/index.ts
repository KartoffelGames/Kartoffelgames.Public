import { MouseKeyboardConnection } from './keyboard_mouse/mouse-keyboard-connection';
MouseKeyboardConnection.init();

import { GamepadConnection } from './gampad/gamepad-connection';
GamepadConnection.init();

export { GamepadConnection, MouseKeyboardConnection };
export { InputDevices } from './input-devices';
export { InputConfiguration } from './configuration/input-configuration';