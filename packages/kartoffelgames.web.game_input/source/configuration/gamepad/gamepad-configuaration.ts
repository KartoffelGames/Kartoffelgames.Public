import { GamepadButtonType } from '../../enum/gamepad-button-type.enum';
import { GamepadButtonMapping } from './gamepad-button-mapping';

export class GamepadConfiguration {
    private readonly mMappingList: Array<MappingAssignment> = new Array<MappingAssignment>();
    private readonly mStandardMapping: GamepadButtonMapping;
    private mTriggerTolerance: number;

    /**
     * Get standart gamepad mapping.
     */
    public get standardMapping(): GamepadButtonMapping {
        return this.mStandardMapping;
    }

    /**
     * Tolerance on wich buttons and axis are marked as pressed.
     */
    public get triggerTolerance(): number {
        return this.mTriggerTolerance;
    } set triggerTolerance(pTolerance: number) {
        this.mTriggerTolerance = pTolerance;
    }

    /**
     * Constructor.
     * Initializes standard mapping.
     */
    public constructor() {
        this.mTriggerTolerance = 0;
        this.mMappingList = new Array<MappingAssignment>();
        this.mStandardMapping = new GamepadButtonMapping({
            clusterButtonBottom: { type: GamepadButtonType.Button, index: 0 },
            clusterButtonRight: { type: GamepadButtonType.Button, index: 1 },
            clusterButtonLeft: { type: GamepadButtonType.Button, index: 2 },
            clusterButtonTop: { type: GamepadButtonType.Button, index: 3 },
            buttonLeft: { type: GamepadButtonType.Button, index: 4 },
            buttonRight: { type: GamepadButtonType.Button, index: 5 },
            triggerLeft: { type: GamepadButtonType.Button, index: 6 },
            triggerRight: { type: GamepadButtonType.Button, index: 7 },
            selectButton: { type: GamepadButtonType.Button, index: 8 },
            startButton: { type: GamepadButtonType.Button, index: 9 },
            homeButton: { type: GamepadButtonType.Button, index: 16 },
            directionalPadTop: { type: GamepadButtonType.Button, index: 12 },
            directionalPadBottom: { type: GamepadButtonType.Button, index: 13 },
            directionalPadRight: { type: GamepadButtonType.Button, index: 15 },
            directionalPadLeft: { type: GamepadButtonType.Button, index: 14 },
            leftThumbStickButton: { type: GamepadButtonType.Button, index: 10 },
            leftThumbStickXaxis: { type: GamepadButtonType.Axis, index: 0 },
            leftThumbStickYaxis: { type: GamepadButtonType.Axis, index: 1 },
            rightThumbStickButton: { type: GamepadButtonType.Button, index: 11 },
            rightThumbStickXaxis: { type: GamepadButtonType.Axis, index: 2 },
            rightThumbStickYaxis: { type: GamepadButtonType.Axis, index: 3 },
        });
    }

    /**
     * Add gamepad mapping by id matching.
     * @param pIdAssignment - Regex for assigning to matching gamepad ids.
     * @param pMapping - Gamepad mapping.
     */
    public addMapping(pIdAssignment: RegExp, pMapping: GamepadButtonMapping): void {
        this.mMappingList.push({ mapping: pMapping, idMatch: pIdAssignment });
    }

    /**
     * Get mapping of gamepad.
     * @param pGamepadId - Manufacturer id of gamepad.
     */
    public getMapping(pGamepadId: string): GamepadButtonMapping | null {
        for (const lMappingAssignment of this.mMappingList) {
            if (lMappingAssignment.idMatch.test(pGamepadId)) {
                return lMappingAssignment.mapping;
            }
        }

        return null;
    }
}

type MappingAssignment = {
    mapping: GamepadButtonMapping,
    idMatch: RegExp;
};
