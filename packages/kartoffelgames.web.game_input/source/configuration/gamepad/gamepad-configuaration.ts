import { ButtonValueType } from '../../enum/button-value-type.enum';
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
            clusterButtonBottom: { type: ButtonValueType.Button, index: 0 },
            clusterButtonRight: { type: ButtonValueType.Button, index: 1 },
            clusterButtonLeft: { type: ButtonValueType.Button, index: 2 },
            clusterButtonTop: { type: ButtonValueType.Button, index: 3 },
            buttonLeft: { type: ButtonValueType.Button, index: 4 },
            buttonRight: { type: ButtonValueType.Button, index: 5 },
            triggerLeft: { type: ButtonValueType.Button, index: 6 },
            triggerRight: { type: ButtonValueType.Button, index: 7 },
            selectButton: { type: ButtonValueType.Button, index: 8 },
            startButton: { type: ButtonValueType.Button, index: 9 },
            homeButton: { type: ButtonValueType.Button, index: 16 },
            directionalPadTop: { type: ButtonValueType.Button, index: 12 },
            directionalPadBottom: { type: ButtonValueType.Button, index: 13 },
            directionalPadRight: { type: ButtonValueType.Button, index: 15 },
            directionalPadLeft: { type: ButtonValueType.Button, index: 14 },
            leftThumbStickButton: { type: ButtonValueType.Button, index: 10 },
            leftThumbStickXaxis: { type: ButtonValueType.Axis, index: 0 },
            leftThumbStickYaxis: { type: ButtonValueType.Axis, index: 1 },
            rightThumbStickButton: { type: ButtonValueType.Button, index: 11 },
            rightThumbStickXaxis: { type: ButtonValueType.Axis, index: 2 },
            rightThumbStickYaxis: { type: ButtonValueType.Axis, index: 3 },
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
