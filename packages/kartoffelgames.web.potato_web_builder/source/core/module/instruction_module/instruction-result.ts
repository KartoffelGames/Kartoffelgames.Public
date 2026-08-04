import { Exception } from '@kartoffelgames/core';
import type { PwbTemplate } from '../../component/template/nodes/pwb-template.ts';
import type { DataLevel } from '../../data/data-level.ts';

/**
 * Results for instruction module.
 * 
 * @public
 */
export class InstructionResult {
    private readonly mDataLevels: Set<DataLevel>;
    private readonly mElementList: Array<InstructionResultElement>;
    private readonly mTemplates: Set<PwbTemplate>;

    /**
     * Get list of created elements.
     */
    public get elementList(): ReadonlyArray<InstructionResultElement> {
        return this.mElementList;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mElementList = new Array<InstructionResultElement>();

        // Fast access to templates and data levels to check for double use.
        this.mTemplates = new Set<PwbTemplate>();
        this.mDataLevels = new Set<DataLevel>();
    }

    /**
     * Add new element to result.
     * Can't use same template for multiple elements.
     *
     * @param pTemplateElement - New template element.
     * @param pLevelData - New Values of instruction level.
     * @param pKey - Used to detect changes appart from the set template.
     *
     * @throws {@link Exception}
     * When the same template reference should be added more than once.
     */
    public addElement(pTemplateElement: PwbTemplate, pLevelData: DataLevel, pKey: unknown): void {
        // Check if value or temple is used in another element.
        if (this.mTemplates.has(pTemplateElement) || this.mDataLevels.has(pLevelData)) {
            throw new Exception(`Can't add same template or values for multiple Elements.`, this);
        }

        // Add template and data level to sets to prevent future duplicates.
        this.mTemplates.add(pTemplateElement);
        this.mDataLevels.add(pLevelData);

        // Add element to list.
        this.mElementList.push({ template: pTemplateElement, dataLevel: pLevelData, key: pKey });
    }
}

/**
 * Result element of manipulator module.
 * 
 * @internal
 */
export type InstructionResultElement = {
    /**
     * Template.
     */
    template: PwbTemplate;

    /**
     * Temporary values of instruction module item.
     */
    dataLevel: DataLevel;

    /**
     * Key used by the instruction builder to detect differences on update and reusing exiting html elements.
     */
    key: unknown;
};