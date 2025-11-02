import { Exception } from "@kartoffelgames/core";
import { PgslDeclarationType } from "../enum/pgsl-declaration-type.enum.ts";
import { PgslValueTrace } from "../trace/pgsl-value-trace.ts";
import { PgslParserResultType } from "./type/pgsl-parser-result-type.ts";
import { PgslType } from "../type/pgsl-type.ts";

/**
 * Represents a binding result from PGSL parser with type and location information.
 */
export class PgslParserResultBinding {
    private readonly mType: PgslParserResultType;
    private readonly mBindingType: PgslParserResultBindingType;
    private readonly mBindGroupName: string;
    private readonly mBindGroupIndex: number;
    private readonly mBindLocationName: string;
    private readonly mBindLocationIndex: number;

    /**
     * Gets the type information for the binding.
     *
     * @returns The parser result type.
     */
    public get type(): PgslParserResultType {
        return this.mType;
    }

    /**
     * Gets the type of binding.
     *
     * @returns The binding type (uniform or storage).
     */
    public get bindingType(): PgslParserResultBindingType {
        return this.mBindingType;
    }

    /**
     * Gets the name of the bind group.
     *
     * @returns The bind group name.
     */
    public get bindGroupName(): string {
        return this.mBindGroupName;
    }

    /**
     * Gets the index of the bind group.
     *
     * @returns The bind group index.
     */
    public get bindGroupIndex(): number {
        return this.mBindGroupIndex;
    }

    /**
     * Gets the name of the bind location.
     *
     * @returns The bind location name.
     */
    public get bindLocationName(): string {
        return this.mBindLocationName;
    }

    /**
     * Gets the index of the bind location.
     *
     * @returns The bind location index.
     */
    public get bindLocationIndex(): number {
        return this.mBindLocationIndex;
    }

    /**
     * Creates a new PGSL parser result binding.
     *
     * @param pParameters - The constructor parameters containing all binding information.
     */
    public constructor(pBinding: PgslValueTrace) {
        // Convert binding type from trace.
        this.mBindingType = (() => {
            switch (pBinding.declarationType) {
                case PgslDeclarationType.Uniform: return 'uniform';
                case PgslDeclarationType.Storage: return 'storage';
                default: throw new Exception(`Unsupported binding declaration type in PgslValueTrace: ${pBinding.declarationType}`, this);
            }
        })();

        // Check for null binding information.
        if (pBinding.bindingInformation === null) {
            throw new Exception('Binding information is null in PgslValueTrace.', this);
        }

        // Set binding information.
        this.mBindGroupName = pBinding.bindingInformation.bindGroupName;
        this.mBindGroupIndex = pBinding.bindingInformation.bindGroupIndex;
        this.mBindLocationName = pBinding.bindingInformation.bindLocationName;
        this.mBindLocationIndex = pBinding.bindingInformation.bindLocationIndex;

        // Convert type.
        this.mType = this.convertType(pBinding.type);
    }

    private convertType(pType: PgslType): PgslParserResultType {
        // Conversion logic here...
    }
}

export type PgslParserResultBindingType = 'uniform' | 'storage';

