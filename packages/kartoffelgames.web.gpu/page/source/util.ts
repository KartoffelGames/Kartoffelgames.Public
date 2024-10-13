import { Dictionary } from '@kartoffelgames/core';
import { DeviceConfiguration, KeyboardButton, MouseButton, InputConfiguration, InputDevices, MouseKeyboardConnector, BaseInputDevice } from '@kartoffelgames/web.game-input';
import { ViewProjection, CameraMatrix } from './camera/view_projection/view-projection';
import { BindGroup } from '../../source/binding/bind-group';
import { GpuBuffer } from '../../source/buffer/gpu-buffer';

export const InitCameraControls = (pCanvas: HTMLCanvasElement, pCamera: ViewProjection, pWorldGroup: BindGroup): void => {
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
    const lInputConfiguration: InputConfiguration = new InputConfiguration(lDefaultConfiguaration);
    const lInputDevices: InputDevices = new InputDevices(lInputConfiguration);
    lInputDevices.registerConnector(new MouseKeyboardConnector());

    const lCurrentActionValue: Dictionary<string, number> = new Dictionary<string, number>();
    const lKeyboard: BaseInputDevice = lInputDevices.devices[0];
    lKeyboard.addEventListener('actionstatechange', (pEvent) => {
        lCurrentActionValue.set(pEvent.action, pEvent.state);
    });
    window.setInterval(() => {
        const lSpeed = 10;

        // Z Axis
        if (lCurrentActionValue.get('Forward')! > 0) {
            pCamera.transformation.translateInDirection((lCurrentActionValue.get('Forward')! / 50) * lSpeed, 0, 0);
        }
        if (lCurrentActionValue.get('Back')! > 0) {
            pCamera.transformation.translateInDirection(-(lCurrentActionValue.get('Back')! / 50) * lSpeed, 0, 0);
        }

        // X Axis
        if (lCurrentActionValue.get('Right')! > 0) {
            pCamera.transformation.translateInDirection(0, (lCurrentActionValue.get('Right')! / 50) * lSpeed, 0);
        }
        if (lCurrentActionValue.get('Left')! > 0) {
            pCamera.transformation.translateInDirection(0, -(lCurrentActionValue.get('Left')! / 50) * lSpeed, 0);
        }

        // Y Axis
        if (lCurrentActionValue.get('Up')! > 0) {
            pCamera.transformation.translateInDirection(0, 0, (lCurrentActionValue.get('Up')! / 50) * lSpeed);
        }
        if (lCurrentActionValue.get('Down')! > 0) {
            pCamera.transformation.translateInDirection(0, 0, -(lCurrentActionValue.get('Down')! / 50) * lSpeed);
        }

        // Rotation.
        if (lCurrentActionValue.get('Yaw')! > 0 || lCurrentActionValue.get('Yaw')! < 0) {
            pCamera.transformation.addEulerRotation(0, lCurrentActionValue.get('Yaw')!, 0);
        }
        if (lCurrentActionValue.get('Pitch')! > 0 || lCurrentActionValue.get('Pitch')! < 0) {
            pCamera.transformation.addEulerRotation(lCurrentActionValue.get('Pitch')!, 0, 0);
        }
        if (lCurrentActionValue.get('RotateLeft')! > 0) {
            pCamera.transformation.addEulerRotation(0, 0, lCurrentActionValue.get('RotateLeft')!);
        }
        if (lCurrentActionValue.get('RotateRight')! > 0) {
            pCamera.transformation.addEulerRotation(0, 0, -lCurrentActionValue.get('RotateRight')!);
        }

        // Update transformation buffer.
        pWorldGroup.data('camera').get<GpuBuffer>().write(pCamera.getMatrix(CameraMatrix.ViewProjection).dataArray, ['viewProjection']);
        pWorldGroup.data('camera').get<GpuBuffer>().write(pCamera.getMatrix(CameraMatrix.View).dataArray, ['view']);
        pWorldGroup.data('camera').get<GpuBuffer>().write(pCamera.getMatrix(CameraMatrix.Projection).dataArray, ['projection']);

        pWorldGroup.data('camera').get<GpuBuffer>().write(pCamera.getMatrix(CameraMatrix.Rotation).dataArray, ['translation', 'rotation']);
        pWorldGroup.data('camera').get<GpuBuffer>().write(pCamera.getMatrix(CameraMatrix.Translation).dataArray, ['translation', 'translation']);
        pWorldGroup.data('camera').get<GpuBuffer>().write(pCamera.getMatrix(CameraMatrix.Rotation).inverse().dataArray, ['invertedTranslation', 'rotation']);
        pWorldGroup.data('camera').get<GpuBuffer>().write(pCamera.getMatrix(CameraMatrix.Translation).inverse().dataArray, ['invertedTranslation', 'translation']);
    }, 8);
    pCanvas.addEventListener('click', () => {
        pCanvas.requestPointerLock();
    });
};

export const UpdateFpsDisplay = (() => {
    let lMaxFps: number = 0;

    return (pFps: number, pWidth: number): void => {
        const lCanvas: HTMLCanvasElement = document.getElementById('fps-display') as HTMLCanvasElement;
        const lCanvasContext: CanvasRenderingContext2D = lCanvas.getContext('2d', { willReadFrequently: true })!;

        // Update canvas width.
        if (pWidth !== lCanvas.width) {
            lCanvas.width = pWidth;
            lCanvas.height = 30;
        }

        if (lCanvas.width < 2) {
            return;
        }

        // Get current fps image data except the first pixel column.
        const lLastFpsData: ImageData = lCanvasContext.getImageData(1, 0, lCanvas.width - 1, lCanvas.height);

        // Adjust to new fps scaling.
        let lScaling: number = 1;
        if (lMaxFps < pFps) {
            lScaling = lMaxFps / pFps;
            lMaxFps = pFps;
        }

        // now clear the right-most pixels:
        if (lScaling === 1) {
            lCanvasContext.clearRect(lCanvas.width - 1, 0, 1, lCanvas.height);
        } else {
            lCanvasContext.clearRect(0, 0, lCanvas.width, lCanvas.height);
        }

        // Put image data to left.
        const lScalingSize: number = Math.floor(lCanvas.height * lScaling);
        lCanvasContext.putImageData(lLastFpsData, 0, lCanvas.height - (lScalingSize), 0, 0, lCanvas.width - 1, lScalingSize);

        // Calculate heigt of rect.
        const lRectHeight: number = (pFps / lMaxFps) * lCanvas.height;

        // Draw current fps.
        lCanvasContext.fillStyle = '#87beee';
        lCanvasContext.fillRect(lCanvas.width - 1, lCanvas.height - lRectHeight, 1, lRectHeight);
    };
})();