import type { KeyboardButton } from './enum/keyboard-button.enum.ts';
import type { GamepadButton } from './enum/gamepad-button.enum.ts';
import type { MouseButton } from './enum/mouse-button.enum.ts';

export type InputButton = KeyboardButton | GamepadButton | MouseButton;