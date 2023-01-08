import { KeyboardButton } from './enum/keyboard-button.enum';
import { GamepadButton } from './enum/gamepad-button.enum';
import { MouseButton } from './enum/mouse-button.enum';

export type InputButton = KeyboardButton | GamepadButton | MouseButton;