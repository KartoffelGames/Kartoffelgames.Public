import { Exception } from '@kartoffelgames/core';
import { PgslModuleSyntaxTree } from './pgsl-module-syntax-tree';
import { ParserException } from '@kartoffelgames/core.parser';

/**
 * Base pgsl syntax tree object.
 */
export abstract class BasePgslSyntaxTree<TType extends string, TData extends object> {
    private readonly mBuildIn: boolean;
    private mParent: UnknownPgslSyntaxTree | null;
    private readonly mType: TType;

    /**
     * Structure is build in and does not be included in the final output.
     * Can still be used for validation.
     */
    public get buildIn(): boolean {
        return this.mBuildIn;
    }

    /**
     * Assoziated document of pgsl structure.
     */
    public get document(): PgslModuleSyntaxTree {
        if (!this.parent) {
            throw new Exception('PGSL-Structure not attached to any document', this);
        }

        return this.parent?.document;
    }

    /**
     * Parent structure of this object.
     * 
     * @throws {@link Exception}
     * When structure was not assigned to a parent.
     */
    public get parent(): UnknownPgslSyntaxTree | null {
        return this.mParent;
    }

    /**
     * Constructor.
     */
    public constructor(pType: TType, pBuildIn: boolean = false) {
        this.mBuildIn = pBuildIn;
        this.mType = pType;
        this.mParent = null;
    }

    /**
     * Append syntax tree data structure to this tree.
     * Replaces and extends current data but does not reset current set data.
     * 
     * @remarks
     * Validates data and throws parser errors.
     * 
     * @param pData - Data structure of syntax tree.
     */
    public applyDataStructure(pData: PgslSyntaxTreeDataStructure<TType, TData>, pParent: UnknownPgslSyntaxTree | null): this {
        // Only set parent when parent should be set.
        if (pParent) {
            // Cant set parent twice.
            if (this.mParent) {
                throw new Exception('PGSL-Structure has a parent can not be moved.', this);
            }

            // Set parent.
            this.mParent = pParent;
        }

        try {
            // Call structure apply function.
            this.applyData(pData.data);
        } catch (pError) {
            // Get message of exception.
            let lMessage: string = '';
            if (pError instanceof Error) {
                lMessage = pError.message;
            } else {
                lMessage = (<any>pError).toString();
            }

            // Extend message by file name.
            lMessage = `File<${pData.meta.file}>: ${lMessage}`;

            // Build and throw parser exception.
            throw new ParserException(lMessage, this,
                pData.meta.position.start.column,
                pData.meta.position.start.line,
                pData.meta.position.end.column,
                pData.meta.position.end.line
            );
        }

        return this;
    }

    /**
     * Append syntax tree data structure to this tree.
     * Replaces and extends current data but does not reset current set data.
     * 
     * @remarks
     * Validates data and throws parser errors.
     * 
     * @param pData - Data structure of syntax tree.
     */
    public retrieveDataStructure(): PgslSyntaxTreeDataStructure<TType, TData> {
        // Restrict output of buildin structures.
        if (this.mBuildIn) {
            throw new Exception(`Can't retrieve data from build in structures.`, this);
        }

        // Call structure apply function.
        const lData = this.retrieveData();

        // Build placeholder meta data.
        const lMeta: PgslSyntaxTreeDataStructure<TType, TData>['meta'] = {
            type: this.mType as TType,
            file: '<Untraceable-serialize>',
            buildIn: this.mBuildIn,
            position: {
                start: {
                    column: 0, line: 0
                },
                end: {
                    column: 0, line: 0
                }
            }
        };

        return {
            meta: lMeta,
            data: lData
        };
    }

    /**
     * Apply data to current structure.
     * Any thrown error is converted into a parser error.
     * 
     * @param pData - Structure data.
     */
    protected abstract applyData(pData: TData): void;

    /**
     * Retrieve data of current structure.
     */
    protected abstract retrieveData(): TData;

    // TODO: Add something that can transpile into wgsl.
}

export type UnknownPgslSyntaxTree = BasePgslSyntaxTree<string, object>;

export type PgslSyntaxTreeDataStructure<TDataType extends string, TData extends object> = {
    meta: {
        type: TDataType;
        file: string;
        buildIn: boolean;
        position: {
            start: {
                column: number;
                line: number;
            };
            end: {
                column: number;
                line: number;
            };
        };
    };
    data: TData;
};