import { Dictionary, TypedArray } from '@kartoffelgames/core.data';
import { DeviceConfiguration, InputConfiguration, InputDevices, KeyboardButton, MouseButton, MouseKeyboardConnector } from '@kartoffelgames/web.game-input';
import { Buffer } from '../../source/base/base/buffer/buffer';
import { CameraMatrix, ViewProjection } from '../../source/something_better/view_projection/view-projection';

export class Movement {
    private readonly mBuffer: Buffer<TypedArray>;
    private readonly mBufferPath: Array<string>;
    private readonly mCamera: ViewProjection;

    public constructor(pCamera: ViewProjection, pCanvas: HTMLCanvasElement, pBuffer: Buffer<TypedArray>, pBufferPath: Array<string>) {
        this.mCamera = pCamera;
        this.mBuffer = pBuffer;
        this.mBufferPath = pBufferPath;

        this.initMovementKeys();

        // Pointer lock on canvas click.
        pCanvas.addEventListener('click', () => {
            pCanvas.requestPointerLock();
        });
    }

    private initMovementKeys() {
        // Register keyboard mouse movements.
        const lDefaultConfiguaration: DeviceConfiguration = new DeviceConfiguration();
        lDefaultConfiguaration.addAction('Forward', [KeyboardButton.KeyW]);
        lDefaultConfiguaration.addAction('Back', [KeyboardButton.KeyS]);
        lDefaultConfiguaration.addAction('Left', [KeyboardButton.KeyA]);
        lDefaultConfiguaration.addAction('Right', [KeyboardButton.KeyD]);
        lDefaultConfiguaration.addAction('Up', [KeyboardButton.ShiftLeft]);
        lDefaultConfiguaration.addAction('Down', [KeyboardButton.ControlLeft]);
        lDefaultConfiguaration.addAction('RotateLeft', [KeyboardButton.KeyQ]);
        lDefaultConfiguaration.addAction('RotateRight', [KeyboardButton.KeyE]);
        lDefaultConfiguaration.addAction('Yaw', [MouseButton.Xaxis]);
        lDefaultConfiguaration.addAction('Pitch', [MouseButton.Yaxis]);
        lDefaultConfiguaration.triggerTolerance = 0.2;

        // Create input configuration with only basic movement.
        const lInputConfiguration: InputConfiguration = new InputConfiguration(lDefaultConfiguaration);

        // Setup input devices by registering mouse and keyboard. 
        const lInputDevices: InputDevices = new InputDevices(lInputConfiguration);
        lInputDevices.registerConnector(new MouseKeyboardConnector());

        // Save 
        const lCurrentActionValue: Dictionary<string, number> = new Dictionary<string, number>();
        lInputDevices.devices[0].addEventListener('actionstatechange', (pEvent) => {
            lCurrentActionValue.set(pEvent.action, pEvent.state);
        });


        window.setInterval(() => {
            const lSpeed = 1;

            // Z Axis
            if (lCurrentActionValue.get('Forward')! > 0) {
                this.mCamera.transformation.translateInDirection((lCurrentActionValue.get('Forward')! / 50) * lSpeed, 0, 0);
            }
            if (lCurrentActionValue.get('Back')! > 0) {
                this.mCamera.transformation.translateInDirection(-(lCurrentActionValue.get('Back')! / 50) * lSpeed, 0, 0);
            }

            // X Axis
            if (lCurrentActionValue.get('Right')! > 0) {
                this.mCamera.transformation.translateInDirection(0, (lCurrentActionValue.get('Right')! / 50) * lSpeed, 0);
            }
            if (lCurrentActionValue.get('Left')! > 0) {
                this.mCamera.transformation.translateInDirection(0, -(lCurrentActionValue.get('Left')! / 50) * lSpeed, 0);
            }

            // Y Axis
            if (lCurrentActionValue.get('Up')! > 0) {
                this.mCamera.transformation.translateInDirection(0, 0, (lCurrentActionValue.get('Up')! / 50) * lSpeed);
            }
            if (lCurrentActionValue.get('Down')! > 0) {
                this.mCamera.transformation.translateInDirection(0, 0, -(lCurrentActionValue.get('Down')! / 50) * lSpeed);
            }

            // Rotation.
            if (lCurrentActionValue.get('Yaw')! > 0 || lCurrentActionValue.get('Yaw')! < 0) {
                this.mCamera.transformation.addEulerRotation(0, lCurrentActionValue.get('Yaw')! * lSpeed, 0);
            }
            if (lCurrentActionValue.get('Pitch')! > 0 || lCurrentActionValue.get('Pitch')! < 0) {
                this.mCamera.transformation.addEulerRotation(lCurrentActionValue.get('Pitch')! * lSpeed, 0, 0);
            }
            if (lCurrentActionValue.get('RotateLeft')! > 0) {
                this.mCamera.transformation.addEulerRotation(0, 0, lCurrentActionValue.get('RotateLeft')! * lSpeed);
            }
            if (lCurrentActionValue.get('RotateRight')! > 0) {
                this.mCamera.transformation.addEulerRotation(0, 0, -lCurrentActionValue.get('RotateRight')! * lSpeed);
            }

            // Update transformation buffer.
            this.mBuffer.write(new Float32Array(this.mCamera.getMatrix(CameraMatrix.ViewProjection).dataArray), this.mBufferPath);
        }, 8);
    }
}
