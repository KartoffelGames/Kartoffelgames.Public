import { TransformationComponent } from '../../source/component/transformation-component.ts';
import type { GameEntity } from '../../source/core/hierarchy/game-entity.ts';

/**
 * Handles keyboard and mouse input for camera movement and rotation.
 * Polls input state at a fixed interval and applies movement to the camera entity.
 */
export class CameraController {
    private readonly mCanvas: HTMLCanvasElement;
    private readonly mCamera: GameEntity;
    private readonly mKeyState: Set<string>;
    private mMouseDown: boolean;
    private readonly mMouseMovement: { x: number; y: number };
    private mIntervalId: number | null;

    /**
     * The camera entity.
     */
    public get camera(): GameEntity {
        return this.mCamera;
    }

    /**
     * Constructor.
     *
     * @param pCanvas - The canvas element to listen for mouse events on.
     * @param pCamera - The camera entity to control.
     */
    public constructor(pCanvas: HTMLCanvasElement, pCamera: GameEntity) {
        this.mCanvas = pCanvas;
        this.mCamera = pCamera;
        this.mKeyState = new Set<string>();
        this.mMouseDown = false;
        this.mMouseMovement = { x: 0, y: 0 };
        this.mIntervalId = null;

        this.setupEventListeners();
    }

    /**
     * Start the input polling loop at ~60fps.
     */
    public start(): void {
        if (this.mIntervalId !== null) {
            return;
        }

        const lAnimationFrame = () => {
            this.pollInput();
            this.mIntervalId = globalThis.requestAnimationFrame(lAnimationFrame);
        };
        this.mIntervalId = globalThis.requestAnimationFrame(lAnimationFrame);
    }

    /**
     * Register keyboard and mouse event listeners.
     */
    private setupEventListeners(): void {
        document.addEventListener('keydown', (pEvent: KeyboardEvent) => {
            this.mKeyState.add(pEvent.key.toLowerCase());
            if (['shift', 'control'].includes(pEvent.key.toLowerCase())) {
                pEvent.preventDefault();
            }
        });

        document.addEventListener('keyup', (pEvent: KeyboardEvent) => {
            this.mKeyState.delete(pEvent.key.toLowerCase());
        });

        this.mCanvas.addEventListener('mousedown', () => {
            this.mMouseDown = true;
        });

        document.addEventListener('mouseup', () => {
            this.mMouseDown = false;
        });

        this.mCanvas.addEventListener('mousemove', (pEvent: MouseEvent) => {
            if (this.mMouseDown) {
                const lSensitivity: number = 0.3;
                this.mMouseMovement.x += pEvent.movementX * lSensitivity;
                this.mMouseMovement.y += pEvent.movementY * lSensitivity;
            }
        });
    }

    /**
     * Process current input state and apply camera movement/rotation.
     */
    private pollInput(): void {
        const lMoveSpeed: number = 0.1;
        const lRotateSpeed: number = 1.0;

        const lCameraTransformation: TransformationComponent = this.mCamera.getComponent(TransformationComponent);

        // Movement: WASD + Shift/Control.
        let lForward: number = 0;
        let lRight: number = 0;
        let lUp: number = 0;

        if (this.mKeyState.has('w')) { lForward += lMoveSpeed; }
        if (this.mKeyState.has('s')) { lForward -= lMoveSpeed; }
        if (this.mKeyState.has('a')) { lRight -= lMoveSpeed; }
        if (this.mKeyState.has('d')) { lRight += lMoveSpeed; }
        if (this.mKeyState.has('shift')) { lUp += lMoveSpeed; }
        if (this.mKeyState.has('control')) { lUp -= lMoveSpeed; }

        if (lForward !== 0 || lRight !== 0 || lUp !== 0) {
            lCameraTransformation.translateInDirection(lForward, lRight, lUp);
        }

        // Mouse look rotation.
        if (this.mMouseMovement.x !== 0 || this.mMouseMovement.y !== 0) {
            lCameraTransformation.addEulerRotation(this.mMouseMovement.y, this.mMouseMovement.x, 0);
            this.mMouseMovement.x = 0;
            this.mMouseMovement.y = 0;
        }

        // Roll rotation: Q/E.
        let lRoll: number = 0;
        if (this.mKeyState.has('q')) { lRoll -= lRotateSpeed; }
        if (this.mKeyState.has('e')) { lRoll += lRotateSpeed; }

        if (lRoll !== 0) {
            lCameraTransformation.addEulerRotation(0, 0, lRoll);
        }
    }
}
