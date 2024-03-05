import { List } from '@kartoffelgames/core.data';
import { BasePwbTemplateNode } from './base-pwb-template-node';

/**
 * Multiplicator node.
 * 
 * Implied syntax for templates are:
 * ``` PwbTemplate
 * @Single(Instruction)
 * 
 * @SingleWithoutInstruction
 * 
 * @Multi(Instruction) {
 *  <MoreContent />
 * }
 * 
 * @MultiWithoutInstruction {
 *  <MoreContent />
 * }
 * ```
 */
export class PwbTemplateInstructionNode extends BasePwbTemplateNode {
    private readonly mChildList: Array<BasePwbTemplateNode>;
    private mInstruction: string;
    private mInstructionType: string;

    /**
     * Get childs of instruction node list.
     */
    public get childList(): Array<BasePwbTemplateNode> {
        return List.newListWith(...this.mChildList);
    }

    /**
     * Multiplicator nodes instruction.
     */
    public get instruction(): string {
        return this.mInstruction;
    } set instruction(pValue: string) {
        this.mInstruction = pValue;
    }

    /**
     * Instruction type.
     */
    public get instructionType(): string {
        return this.mInstructionType;
    } set instructionType(pValue: string) {
        this.mInstructionType = pValue;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mChildList = Array<BasePwbTemplateNode>();
        this.mInstruction = '';
        this.mInstructionType = '';
    }

    /**
     * Add child node to node list.
     * @param pNode - Base node.
     */
    public appendChild(...pNode: Array<BasePwbTemplateNode>): void {
        // Set parent for each child and remove child from previous parent.
        for (const lChild of pNode) {
            lChild.parent = this;
        }

        this.mChildList.push(...pNode);
    }

    /**
     * Clone multiplicator node.
     * 
     * @returns new instance of current node with the same data.
     */
    public override clone(): PwbTemplateInstructionNode {
        const lClonedNode: PwbTemplateInstructionNode = new PwbTemplateInstructionNode();
        lClonedNode.instruction = this.instruction;
        lClonedNode.instructionType = this.instructionType;

        // Deep clone every node.
        for (const lNode of this.mChildList) {
            lClonedNode.appendChild(lNode.clone());
        }

        return lClonedNode;
    }

    /**
     * Compare current node with another one.
     * @param pBaseNode - Base xml node.
     * 
     * @returns if the set node is equal to this node.
     */
    override equals(pBaseNode: BasePwbTemplateNode): boolean {
        // Check type, instruction value and type.
        if (!(pBaseNode instanceof PwbTemplateInstructionNode) || pBaseNode.instruction !== this.instruction  || pBaseNode.instructionType !== this.instructionType) {
            return false;
        }

        // Check same count of childs.
        if (pBaseNode.childList.length !== this.childList.length) {
            return false;
        }

        // Deep check all childnodes
        for (let lIndex: number = 0; lIndex < pBaseNode.childList.length; lIndex++) {
            if (!pBaseNode.childList[lIndex].equals(this.childList[lIndex])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Remove child from XmlNode.
     * Return removed child.
     * @param pNode - Child to remove.
     */
    public removeChild(pNode: BasePwbTemplateNode): BasePwbTemplateNode | undefined {
        const lIndex: number = this.mChildList.indexOf(pNode);
        let lRemovedChild: BasePwbTemplateNode | undefined = undefined;

        // If list contains node.
        if (lIndex !== -1) {
            lRemovedChild = this.mChildList.splice(lIndex, 1)[0];

            // If xml node remove parent connection.
            lRemovedChild.parent = null;
        }

        return lRemovedChild;
    }
}