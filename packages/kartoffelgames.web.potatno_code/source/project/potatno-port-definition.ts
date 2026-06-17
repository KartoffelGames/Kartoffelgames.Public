import type { PotatnoProjectGenericType, PotatnoProjectTypeNames, PotatnoProjectTypesDefinition } from './potatno-project-types-definition.ts';

/**
 * Definition of a port on a node, used for type checking and code generation.
 */
export class PotatnoPortDefinition<TProjectTypes extends PotatnoProjectTypesDefinition> {
	private readonly mDataType: PotatnoProjectTypeNames<TProjectTypes> | PotatnoProjectGenericType | null;
	private readonly mId: string;
	private readonly mLabel: string;
	private readonly mPortType: PotatnoPortDefinitionType;
	private readonly mRegions: PotatnoPortDefinitionRegions;

	/**
	 * Data type identifier when the port carries a typed value.
	 */
	public get dataType(): PotatnoProjectTypeNames<TProjectTypes> | PotatnoProjectGenericType | null {
		return this.mDataType;
	}

	/**
	 * Port identifier as registered on the node definition.
	 */
	public get id(): string {
		return this.mId;
	}

	/**
	 * Display label for this port.
	 */
	public get label(): string {
		return this.mLabel;
	}

	/**
	 * Port kind discriminator.
	 */
	public get portType(): PotatnoPortDefinitionType {
		return this.mPortType;
	}

	/**
	 * Regions this port adds to the graph when its output is traversed.
	 */
	public get regions(): PotatnoPortDefinitionRegions {
		return this.mRegions;
	}

	/**
	 * Constructor.
	 *
	 * @param pPortDefinition - Raw port definition data.
	 */
	public constructor(pPortDefinition: PotatnoPortDefinitionConfiguration<TProjectTypes>) {
		this.mLabel = pPortDefinition.label;
		this.mId = pPortDefinition.id;
		this.mPortType = pPortDefinition.portType;

		// Only value ports have a data type, flow ports do not.
		if (pPortDefinition.portType === 'value') {
			this.mDataType = pPortDefinition.dataType;
		} else {
			this.mDataType = null;
		}

		this.mRegions = {
			add: pPortDefinition.regions?.add ?? new Array<string>(),
		};
	}
}

export type PotatnoPortDefinitionType = 'flow' | 'value';
export type PotatnoPortDefinitionDirection = 'input' | 'output';

/**
 * Regions an output port contributes to the graph when traversed.
 */
export type PotatnoPortDefinitionRegions = {
	/**
	 * Regions this port adds to the graph when its output is traversed.
	 */
	add: ReadonlyArray<string>;
};

/**
 * Definition of a port type used when registering node definitions.
 */

export type PotatnoPortDefinitionConfiguration<TProjectTypes extends PotatnoProjectTypesDefinition> = {
	/**
	 * Display label for the port.
	 */
	label: string;

	/**
	 * Id of the port (used as the code-gen key, e.g. pContext.outputs["x"]).
	 */
	id: string;

	/**
	 * Regions this port adds to the graph when its output is traversed.
	 */
	regions?: Partial<PotatnoPortDefinitionRegions>;
} & ({
	/**
	 * Fixed type discriminator for flow ports.
	 */
	portType: 'flow';
} | {

	/**
	 * Fixed type discriminator for value ports.
	 */
	portType: 'value';

	/**
	 * Data type identifier for the port.
	 */
	dataType: PotatnoProjectTypeNames<TProjectTypes> | PotatnoProjectGenericType;
});
