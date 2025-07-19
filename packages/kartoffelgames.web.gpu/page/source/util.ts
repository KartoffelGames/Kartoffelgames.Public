import { Dictionary } from '@kartoffelgames/core';
import { GpuBufferView } from '../../source/buffer/gpu-buffer-view.ts';
import { CameraMatrix, ViewProjection } from './camera/view_projection/view-projection.ts';

export const InitCameraControls = (pCanvas: HTMLCanvasElement, pCamera: ViewProjection, pCameraBuffer: GpuBufferView<Float32Array>): void => {

    const lCurrentActionValue: Dictionary<string, number> = new Dictionary<string, number>();

    // Initialize all action values to 0
    lCurrentActionValue.set('Forward', 0);
    lCurrentActionValue.set('Back', 0);
    lCurrentActionValue.set('Left', 0);
    lCurrentActionValue.set('Right', 0);
    lCurrentActionValue.set('Up', 0);
    lCurrentActionValue.set('Down', 0);
    lCurrentActionValue.set('RotateLeft', 0);
    lCurrentActionValue.set('RotateRight', 0);
    lCurrentActionValue.set('Yaw', 0);
    lCurrentActionValue.set('Pitch', 0);

    // Keyboard event handlers
    window.addEventListener('keydown', (pEvent) => {
        switch (pEvent.code) {
            case 'KeyW':
                lCurrentActionValue.set('Forward', 1);
                break;
            case 'KeyS':
                lCurrentActionValue.set('Back', 1);
                break;
            case 'KeyA':
                lCurrentActionValue.set('Left', 1);
                break;
            case 'KeyD':
                lCurrentActionValue.set('Right', 1);
                break;
            case 'ShiftLeft':
                lCurrentActionValue.set('Up', 1);
                break;
            case 'ControlLeft':
                lCurrentActionValue.set('Down', 1);
                break;
            case 'KeyQ':
                lCurrentActionValue.set('RotateLeft', 1);
                break;
            case 'KeyE':
                lCurrentActionValue.set('RotateRight', 1);
                break;
        }
    });

    window.addEventListener('keyup', (pEvent) => {
        switch (pEvent.code) {
            case 'KeyW':
                lCurrentActionValue.set('Forward', 0);
                break;
            case 'KeyS':
                lCurrentActionValue.set('Back', 0);
                break;
            case 'KeyA':
                lCurrentActionValue.set('Left', 0);
                break;
            case 'KeyD':
                lCurrentActionValue.set('Right', 0);
                break;
            case 'ShiftLeft':
                lCurrentActionValue.set('Up', 0);
                break;
            case 'ControlLeft':
                lCurrentActionValue.set('Down', 0);
                break;
            case 'KeyQ':
                lCurrentActionValue.set('RotateLeft', 0);
                break;
            case 'KeyE':
                lCurrentActionValue.set('RotateRight', 0);
                break;
        }
    });

    // Mouse movement for camera rotation
    let lMouseMoveTimeout: number | null = null;
    
    window.addEventListener('mousemove', (pEvent) => {
        const lDeltaX = pEvent.movementX;
        const lDeltaY = pEvent.movementY;

        // Normalize mouse movement to -1 to 1 range (10x faster sensitivity)
        const lSensitivity = 0.5;
        const lYawValue = Math.max(-1, Math.min(1, lDeltaX * lSensitivity));
        const lPitchValue = Math.max(-1, Math.min(1, lDeltaY * lSensitivity));

        lCurrentActionValue.set('Yaw', lYawValue);
        lCurrentActionValue.set('Pitch', lPitchValue);
        
        // Clear existing timeout
        if (lMouseMoveTimeout !== null) {
            clearTimeout(lMouseMoveTimeout);
        }
        
        // Reset mouse values after a short delay when movement stops
        lMouseMoveTimeout = setTimeout(() => {
            lCurrentActionValue.set('Yaw', 0);
            lCurrentActionValue.set('Pitch', 0);
        }, 16); // ~1 frame at 60fps
    });

    pCanvas.addEventListener('click', () => {
        pCanvas.requestPointerLock();
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
        pCameraBuffer.write(pCamera.getMatrix(CameraMatrix.ViewProjection).dataArray, ['viewProjection']);
        pCameraBuffer.write(pCamera.getMatrix(CameraMatrix.View).dataArray, ['view']);
        pCameraBuffer.write(pCamera.getMatrix(CameraMatrix.Projection).dataArray, ['projection']);
        pCameraBuffer.write([pCamera.transformation.translationX, pCamera.transformation.translationY, pCamera.transformation.translationZ], ['position']);

        pCameraBuffer.write(pCamera.getMatrix(CameraMatrix.Rotation).dataArray, ['translation', 'rotation']);
        pCameraBuffer.write(pCamera.getMatrix(CameraMatrix.Translation).dataArray, ['translation', 'translation']);
        pCameraBuffer.write(pCamera.getMatrix(CameraMatrix.Rotation).inverse().dataArray, ['invertedTranslation', 'rotation']);
        pCameraBuffer.write(pCamera.getMatrix(CameraMatrix.Translation).inverse().dataArray, ['invertedTranslation', 'translation']);
    }, 8);
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