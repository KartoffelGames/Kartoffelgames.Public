import { Exception } from "@kartoffelgames/core";
import { PotatnoProjectType } from "./potatno-project.ts";

/**
 * Definition of a port on a node, used for type checking and code generation.
 */
export class PotatnoPortDefinition<TProjectType extends PotatnoProjectType = PotatnoProjectType> {
	private readonly mName: string;
	private readonly mPortType: PotatnoPortDefinitionType;
	private readonly mDataType: TProjectType | null;

	/**
	 * Port name as registered on the node definition.
	 */
	public get name(): string {
		return this.mName;
	}

	/**
	 * Port kind discriminator.
	 */
	public get portType(): PotatnoPortDefinitionType {
		return this.mPortType;
	}

	/**
	 * Data type identifier when the port carries a typed value.
	 */
	public get dataType(): TProjectType | null {
		return this.mDataType;
	}

	/**
	 * Constructor.
	 *
	 * @param pName - Registered port name.
	 * @param pDefinition - Raw port definition data.
	 */
	public constructor(pName: string, pPortType: PotatnoPortDefinitionType, dataType?: TProjectType) {
		this.mName = pName;
		this.mPortType = pPortType;

        // Data type must be specified for value ports.
        if (pPortType === 'value' && !dataType) {
            throw new Exception(`Data type must be specified for value port '${pName}'.`, this);
        }

        // Data type must not be specified for flow ports.
        if (pPortType === 'flow' && dataType) {
            throw new Exception(`Data type must not be specified for flow port '${pName}'.`, this);
        }

		this.mDataType = dataType ?? null;
	}
}

export type PotatnoPortDefinitionType = 'flow' | 'value';
export type PotatnoPortDefinitionDirection = 'input' | 'output';