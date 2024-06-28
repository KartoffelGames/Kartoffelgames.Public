import { Exception, List } from '@kartoffelgames/core';
import { PwbTemplate } from '../../component/template/nodes/pwb-template';
import { ScopedValues } from '../../scoped-values';

/**
 * Results for instruction module.
 * 
 * @public
 */
export class InstructionResult {
    private readonly mElementList: Array<InstructionResultElement>;

    /**
     * Get list of created elements.
     */
    public get elementList(): Array<InstructionResultElement> {
        return List.newListWith(...this.mElementList);
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mElementList = new Array<InstructionResultElement>();
    }

    /**
     * Add new element to result.
     * Can't use same template for multiple elements.
     * 
     * @param pTemplateElement - New template element.
     * @param pElementScopedValues - New Values of element with current current value as parent.
     * 
     * @throws {@link Exception}
     * When the same template reference should be added more than once.
     */
    public addElement(pTemplateElement: PwbTemplate, pElementScopedValues: ScopedValues): void {
        // Check if value or temple is used in another element.
        const lDoubledIndex: number = this.mElementList.findIndex(pElement => {
            return pElement.template === pTemplateElement || pElement.componentValues === pElementScopedValues;
        });

        // Do not allow double use of template or scoped values.
        if (lDoubledIndex === -1) {
            this.mElementList.push({ template: pTemplateElement, componentValues: pElementScopedValues });
        } else {
            throw new Exception(`Can't add same template or values for multiple Elements.`, this);
        }
    }
}

/**
 * Result element of manipulator module.
 * 
 * @internal
 */
export type InstructionResultElement = {
    template: PwbTemplate;
    componentValues: ScopedValues;
};