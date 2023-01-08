import { expect } from 'chai';
import { InputActionEvent } from '../../../source';
import { DeviceConfiguration } from '../../../source/configuration/device-configuration';
import { InputConfiguration } from '../../../source/configuration/input-configuration';
import { BaseInputDevice } from '../../../source/device/base-input-device';
import { MouseKeyboardInputDevice } from '../../../source/device/mouse-keyboard-input-device';
import { InputDevice } from '../../../source/enum/input-device.enum';
import { KeyboardButton } from '../../../source/enum/keyboard-button.enum';
import { MouseButton } from '../../../source/enum/mouse-button.enum';
import { InputButtonEvent } from '../../../source/event/input-button-event';
import '../../mock/request-animation-frame-mock-session';

const gInputDeviceList: Array<BaseInputDevice> = [];

describe('MouseKeyboardConnector', () => {
    after(() => {
        // Cleanup.
        for (const lDevice of gInputDeviceList) {
            lDevice.connected = false;
        }
    });

    it('-- Mouse click down: left', async () => {
        // Setup.
        const lButton: MouseButton = MouseButton.MainLeft;
        const lButtonIndex: number = 0;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttondown', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new MouseEvent('mousedown', { button: lButtonIndex }));
            document.dispatchEvent(new MouseEvent('mouseup', { button: lButtonIndex }));
        });

        // Evaluation.
        expect(lButtonValue).to.equal(1);
    });

    it('-- Mouse click up: left', async () => {
        // Setup.
        const lButton: MouseButton = MouseButton.MainLeft;
        const lButtonIndex: number = 0;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttonup', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new MouseEvent('mousedown', { button: lButtonIndex }));
            document.dispatchEvent(new MouseEvent('mouseup', { button: lButtonIndex }));
        });

        // Evaluation.
        expect(lButtonValue).to.equal(0);
    });

    it('-- Mouse click down: middle', async () => {
        // Setup.
        const lButton: MouseButton = MouseButton.MainMiddle;
        const lButtonIndex: number = 1;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttondown', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new MouseEvent('mousedown', { button: lButtonIndex }));
            document.dispatchEvent(new MouseEvent('mouseup', { button: lButtonIndex }));
        });

        // Evaluation.
        expect(lButtonValue).to.equal(1);
    });

    it('-- Mouse click up: middle', async () => {
        // Setup.
        const lButton: MouseButton = MouseButton.MainMiddle;
        const lButtonIndex: number = 1;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttonup', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new MouseEvent('mousedown', { button: lButtonIndex }));
            document.dispatchEvent(new MouseEvent('mouseup', { button: lButtonIndex }));
        });

        // Evaluation.
        expect(lButtonValue).to.equal(0);
    });

    it('-- Mouse click down: right', async () => {
        // Setup.
        const lButton: MouseButton = MouseButton.MainRight;
        const lButtonIndex: number = 2;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttondown', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new MouseEvent('mousedown', { button: lButtonIndex }));
            document.dispatchEvent(new MouseEvent('mouseup', { button: lButtonIndex }));
        });

        // Evaluation.
        expect(lButtonValue).to.equal(1);
    });

    it('-- Mouse click up: right', async () => {
        // Setup.
        const lButton: MouseButton = MouseButton.MainRight;
        const lButtonIndex: number = 2;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttonup', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new MouseEvent('mousedown', { button: lButtonIndex }));
            document.dispatchEvent(new MouseEvent('mouseup', { button: lButtonIndex }));
        });

        // Evaluation.
        expect(lButtonValue).to.equal(0);
    });

    it('-- Mouse click down: back', async () => {
        // Setup.
        const lButton: MouseButton = MouseButton.SecondaryBack;
        const lButtonIndex: number = 3;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttondown', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new MouseEvent('mousedown', { button: lButtonIndex }));
            document.dispatchEvent(new MouseEvent('mouseup', { button: lButtonIndex }));
        });

        // Evaluation.
        expect(lButtonValue).to.equal(1);
    });

    it('-- Mouse click up: back', async () => {
        // Setup.
        const lButton: MouseButton = MouseButton.SecondaryBack;
        const lButtonIndex: number = 3;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttonup', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new MouseEvent('mousedown', { button: lButtonIndex }));
            document.dispatchEvent(new MouseEvent('mouseup', { button: lButtonIndex }));
        });

        // Evaluation.
        expect(lButtonValue).to.equal(0);
    });

    it('-- Mouse click down: forward', async () => {
        // Setup.
        const lButton: MouseButton = MouseButton.SecondaryForward;
        const lButtonIndex: number = 4;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttondown', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new MouseEvent('mousedown', { button: lButtonIndex }));
            document.dispatchEvent(new MouseEvent('mouseup', { button: lButtonIndex }));
        });

        // Evaluation.
        expect(lButtonValue).to.equal(1);
    });

    it('-- Mouse click up: forward', async () => {
        // Setup.
        const lButton: MouseButton = MouseButton.SecondaryForward;
        const lButtonIndex: number = 4;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttonup', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new MouseEvent('mousedown', { button: lButtonIndex }));
            document.dispatchEvent(new MouseEvent('mouseup', { button: lButtonIndex }));
        });

        // Evaluation.
        expect(lButtonValue).to.equal(0);
    });

    it('-- Keyboard press down', async () => {
        // Setup.
        const lButton: KeyboardButton = KeyboardButton.KeyK;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttondown', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new KeyboardEvent('keydown', { code: lButton }));
            document.dispatchEvent(new KeyboardEvent('keyup', { code: lButton }));
        });

        // Evaluation.
        expect(lButtonValue).to.equal(1);
    });

    it('-- Keyboard press up', async () => {
        // Setup.
        const lButton: KeyboardButton = KeyboardButton.KeyK;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttonup', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new KeyboardEvent('keydown', { code: lButton }));
            document.dispatchEvent(new KeyboardEvent('keyup', { code: lButton }));
        });

        // Evaluation.
        expect(lButtonValue).to.equal(0);
    });

    it('-- Mouse move X', async () => {
        // Setup.
        const lButton: MouseButton = MouseButton.Xaxis;
        const lMouseMovement: number = 11;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttonstatechange', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });

            const lMouseMovementEvent = new MouseEvent('mousemove', { movementX: lMouseMovement, movementY: 0 });
            (<any>lMouseMovementEvent).movementX = lMouseMovement;
            (<any>lMouseMovementEvent).movementY = 0;
            document.dispatchEvent(lMouseMovementEvent);
        });

        // Evaluation.
        expect(lButtonValue).to.equal(lMouseMovement / 10);
    });

    it('-- Mouse move Y', async () => {
        // Setup.
        const lButton: MouseButton = MouseButton.Yaxis;
        const lMouseMovement: number = 11;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttonstatechange', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });

            const lMouseMovementEvent = new MouseEvent('mousemove', { movementX: 0, movementY: lMouseMovement });
            (<any>lMouseMovementEvent).movementX = 0;
            (<any>lMouseMovementEvent).movementY = lMouseMovement;
            document.dispatchEvent(lMouseMovementEvent);
        });

        // Evaluation.
        expect(lButtonValue).to.equal(lMouseMovement / 10);
    });

    it('-- Device type', async () => {
        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Evaluation.
        expect(lDevice.deviceType).to.equal(InputDevice.MouseKeyboard);
    });

    it('-- Keyboard is pressed.', async () => {
        // Setup.
        const lButton: KeyboardButton = KeyboardButton.KeyK;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        await new Promise((pResolve) => {
            lDevice.addEventListener('buttondown', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new KeyboardEvent('keydown', { code: lButton }));

        });

        // Check pressed state.
        const lButtonValueCurrent = lDevice.isPressed(lButton);
        document.dispatchEvent(new KeyboardEvent('keyup', { code: lButton }));

        // Evaluation.
        expect(lButtonValueCurrent).to.be.true;
    });

    it('-- Keyboard current button state.', async () => {
        // Setup.
        const lButton: KeyboardButton = KeyboardButton.KeyK;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttondown', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new KeyboardEvent('keydown', { code: lButton }));

        });

        // Check pressed state.
        const lButtonValueCurrent = lDevice.getButtonState(lButton);
        document.dispatchEvent(new KeyboardEvent('keyup', { code: lButton }));

        // Evaluation.
        expect(lButtonValueCurrent).to.equal(lButtonValue);
    });

    it('-- Keyboard current button state with no value.', async () => {
        // Setup.
        const lButton: KeyboardButton = KeyboardButton.KeyK;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        const lButtonValueCurrent = lDevice.getButtonState(lButton);


        // Evaluation.
        expect(lButtonValueCurrent).to.equal(0);
    });

    it('-- Keyboard press down', async () => {
        // Setup.
        const lButton: KeyboardButton = KeyboardButton.KeyK;

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Process.
        lDevice.deviceConfiguration.triggerTolerance = 0;
        await new Promise((pResolve) => {
            lDevice.addEventListener('buttondown', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new KeyboardEvent('keydown', { code: lButton }));
        });

        // Process. Retrigger down.
        lDevice.deviceConfiguration.triggerTolerance = 2;
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('buttonup', (pEvent: InputButtonEvent) => {
                if (pEvent.button === lButton) {
                    pResolve(pEvent.state);
                }
            });
            // Should retrigger button change.
            document.dispatchEvent(new KeyboardEvent('keydown', { code: lButton }));
        });
        document.dispatchEvent(new KeyboardEvent('keyup', { code: lButton })); // Keyup cleanup.

        // Evaluation.
        expect(lButtonValue).to.equal(0);
    });

    it('-- Button action: down', async () => {
        // Setup.
        const lButtonOne: KeyboardButton = KeyboardButton.KeyK;
        const lButtonTwo: KeyboardButton = KeyboardButton.KeyZ;
        const lActionName: string = 'ACTION_ZK';

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Setup define action.
        lDevice.deviceConfiguration.addAction(lActionName, [lButtonOne, lButtonTwo]);

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('actiondown', (pEvent: InputActionEvent) => {
                if (pEvent.action === lActionName) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new KeyboardEvent('keydown', { code: lButtonOne }));
            document.dispatchEvent(new KeyboardEvent('keydown', { code: lButtonTwo }));
        });
        document.dispatchEvent(new KeyboardEvent('keyup', { code: lButtonOne }));
        document.dispatchEvent(new KeyboardEvent('keyup', { code: lButtonTwo }));

        // Evaluation.
        expect(lButtonValue).to.equal(1);
    });

    it('-- Button action: up', async () => {
        // Setup.
        const lButtonOne: KeyboardButton = KeyboardButton.KeyK;
        const lButtonTwo: KeyboardButton = KeyboardButton.KeyZ;
        const lActionName: string = 'ACTION_ZK';

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Setup define action.
        lDevice.deviceConfiguration.addAction(lActionName, [lButtonOne, lButtonTwo]);

        // Process.
        const lButtonValue = await new Promise((pResolve) => {
            lDevice.addEventListener('actionup', (pEvent: InputActionEvent) => {
                if (pEvent.action === lActionName) {
                    pResolve(pEvent.state);
                }
            });
            document.dispatchEvent(new KeyboardEvent('keydown', { code: lButtonOne }));
            document.dispatchEvent(new KeyboardEvent('keydown', { code: lButtonTwo }));
            document.dispatchEvent(new KeyboardEvent('keyup', { code: lButtonOne }));
            document.dispatchEvent(new KeyboardEvent('keyup', { code: lButtonTwo }));
        });

        // Evaluation.
        expect(lButtonValue).to.equal(0);
    });

    it('-- Button action: no button', async () => {
        // Setup.
        const lButtonOne: KeyboardButton = KeyboardButton.KeyK;
        const lButtonTwo: KeyboardButton = KeyboardButton.KeyZ;
        const lActionName: string = 'ACTION_ZK';

        // Setup.
        const lConfig: InputConfiguration = new InputConfiguration(new DeviceConfiguration());
        const lDevice: MouseKeyboardInputDevice = new MouseKeyboardInputDevice(lConfig);
        lDevice.connected = true;
        gInputDeviceList.push(lDevice); // For cleanup.

        // Setup define action.
        lDevice.deviceConfiguration.addAction(lActionName, []);
        lDevice.deviceConfiguration.addAction('NEW_ACTION', [lButtonOne, lButtonTwo]);

        // Process.
        const lValue = await new Promise((pResolve) => {
            lDevice.addEventListener('actiondown', (pEvent: InputActionEvent) => {
                if (pEvent.action === lActionName) {
                    pResolve(0);
                } else {
                    pResolve(1);
                }
            });
            document.dispatchEvent(new KeyboardEvent('keydown', { code: lButtonOne }));
            document.dispatchEvent(new KeyboardEvent('keydown', { code: lButtonTwo }));
        });
        document.dispatchEvent(new KeyboardEvent('keyup', { code: lButtonOne }));
        document.dispatchEvent(new KeyboardEvent('keyup', { code: lButtonTwo }));

        // Evaluation.
        expect(lValue).to.equal(1);
    });
});