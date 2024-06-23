import { Exception, List } from '@kartoffelgames/core.data';
import { PwbTemplate } from '../../../component/template/nodes/pwb-template';
import { ScopedValues } from '../../../scoped-values';

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
     * @param pValues - New Value handler of element with current value handler as parent.
     * 
     * @throws {@link Exception}
     * When the same template reference should be added more than once.
     */
    public addElement(pTemplateElement: PwbTemplate, pValues: ScopedValues): void {
        // Check if value or temple is used in another element.
        const lDoubledIndex: number = this.mElementList.findIndex(pElement => {
            return pElement.template === pTemplateElement || pElement.componentValues === pValues;
        });

        // Do not allow double use of template or value handler.
        if (lDoubledIndex === -1) {
            this.mElementList.push({ template: pTemplateElement, componentValues: pValues });
        } else {
            throw new Exception("Can't add same template or value handler for multiple Elements.", this);
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