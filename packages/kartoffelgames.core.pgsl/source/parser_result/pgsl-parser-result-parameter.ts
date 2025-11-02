import type { PgslValueTrace } from '../trace/pgsl-value-trace.ts';
import { PgslParserResultType } from './type/pgsl-parser-result-type.ts';
import type { PgslType } from '../type/pgsl-type.ts';

/**
 * Represents a parameter result from PGSL parser with name and type information.
 */
export class PgslParserResultParameter {
    private readonly mName: string;
    private readonly mType: PgslParserResultType;

    /**
     * Gets the name of the parameter.
     *
     * @returns The parameter name.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Gets the type information for the parameter.
     *
     * @returns The parser result type.
     */
    public get type(): PgslParserResultType {
        return this.mType;
    }

    /**
     * Creates a new PGSL parser result parameter.
     *
     * @param pValueTrace - The value trace containing parameter information.
     */
    public constructor(pValueTrace: PgslValueTrace) {
        this.mName = pValueTrace.name;
        this.mType = this.convertType(pValueTrace.type);
    }

    /**
     * Converts a PgslType to a PgslParserResultType.
     *
     * @param pType - The PgslType to convert.
     *
     * @returns The converted PgslParserResultType.
     */
    private convertType(pType: PgslType): PgslParserResultType {
        // TODO: Implement type conversion logic
        // This should match the conversion logic used in PgslParserResultBinding
        throw new Error('Type conversion not yet implemented');
    }
}