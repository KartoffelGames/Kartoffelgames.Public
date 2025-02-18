import { KeyboardButton } from './enum/keyboard-button.enum.ts';
import { GamepadButton } from './enum/gamepad-button.enum.ts';
import { MouseButton } from './enum/mouse-button.enum.ts';

export type InputButton = KeyboardButton | GamepadButton | MouseButton;