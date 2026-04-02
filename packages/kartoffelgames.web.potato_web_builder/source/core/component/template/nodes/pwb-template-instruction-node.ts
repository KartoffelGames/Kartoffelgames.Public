import { IPwbTemplateNode } from './i-pwb-template-node.interface.ts';

/**
 * Multiplicator node.
 * 
 * Implied syntax for templates are:
 * ``` PwbTemplate
 * $Single(Instruction)
 * 
 * $SingleWithoutInstruction
 * 
 * $Multi(Instruction) {
 *  <MoreContent />
 * }
 * 
 * $MultiWithoutInstruction {
 *  <MoreContent />
 * }
 * ```
 */
export class PwbTemplateInstructionNode implements IPwbTemplateNode {
    private readonly mChildList: Array<IPwbTemplateNode>;
    private readonly mInstruction: string;
    private readonly mInstructionType: string;

    /**
     * Get childs of instruction node list.
     */
    public get childList(): ReadonlyArray<IPwbTemplateNode> {
        return this.mChildList;
    }

    /**
     * Multiplicator nodes instruction.
     */
    public get instruction(): string {
        return this.mInstruction;
    }

    /**
     * Instruction type.
     */
    public get instructionType(): string {
        return this.mInstructionType;
    }

    /**
     * Constructor.
     */
    public constructor(pInstructionType: string, pInstruction: string) {
        this.mChildList = Array<IPwbTemplateNode>();
        this.mInstruction = pInstruction;
        this.mInstructionType = pInstructionType;
    }

    /**
     * Add child node to node list.
     * 
     * @param pNode - Base node.
     */
    public appendChild(...pNode: Array<IPwbTemplateNode>): void {
        this.mChildList.push(...pNode);
    }

    /**
     * Clone multiplicator node.
     * 
     * @returns new instance of current node with the same data.
     */
    public clone(): PwbTemplateInstructionNode {
        const lClonedNode: PwbTemplateInstructionNode = new PwbTemplateInstructionNode(this.instructionType, this.instruction);

        // Deep clone every node.
        for (const lNode of this.mChildList) {
            lClonedNode.appendChild(lNode.clone());
        }

        return lClonedNode;
    }

    /**
     * Compare current node with another one.
     * 
     * @param pBaseNode - Base xml node.
     * 
     * @returns if the set node is equal to this node.
     */
    public equals(pBaseNode: IPwbTemplateNode): boolean {
        // Check type, instruction value and type.
        if (!(pBaseNode instanceof PwbTemplateInstructionNode) || pBaseNode.instruction !== this.instruction || pBaseNode.instructionType !== this.instructionType) {
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
     * 
     * @param pNode - Child to remove.
     */
    public removeChild(pNode: IPwbTemplateNode): IPwbTemplateNode | undefined {
        // Search for node index and skip if node is not found.
        const lIndex: number = this.mChildList.indexOf(pNode);
        if (lIndex === -1) {
            return undefined;
        }

        // Remove index from list and return removed child.
        return this.mChildList.splice(lIndex, 1)[0];
    }
}