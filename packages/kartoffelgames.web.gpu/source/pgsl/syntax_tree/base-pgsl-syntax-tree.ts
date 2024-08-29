import { Dictionary, Exception } from '@kartoffelgames/core';
import { ParserException } from '@kartoffelgames/core.parser';
import { IPgslVariableDeclarationSyntaxTree } from './interface/i-pgsl-variable-declaration-syntax-tree.interface';
import { PgslModuleSyntaxTree } from './pgsl-module-syntax-tree';

/**
 * Base pgsl syntax tree object.
 */
export abstract class BasePgslSyntaxTree<TData extends PgslSyntaxTreeInitData> {
    private readonly mBuildIn: boolean;
    private readonly mChilds: Array<UnknownPgslSyntaxTree>;
    private mIsValid: boolean;
    private readonly mMeta: SyntaxTreeMeta;
    private mParent: UnknownPgslSyntaxTree | null;


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
     * Get syntax tree meta.
     */
    public get meta(): SyntaxTreeMeta {
        return this.mMeta;
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
     * Get all scoped variables of scope.
     */
    protected get scopedVariables(): Dictionary<string, IPgslVariableDeclarationSyntaxTree> {
        // Empty scoped variables.
        if (!this.mParent) {
            return new Dictionary<string, IPgslVariableDeclarationSyntaxTree>();
        }

        return this.mParent.scopedVariables;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pStartColumn - Parsing start column.
     * @param pStartLine - Parsing start line.
     * @param pEndColumn - Parsing end column.
     * @param pEndLine - Parsing end line.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pData: TData, pStartColumn: number, pStartLine: number, pEndColumn: number, pEndLine: number, pBuildIn: boolean = false) {
        this.mBuildIn = pBuildIn;
        this.mParent = null;
        this.mIsValid = false;

        // Save meta information.
        this.mMeta = {
            position: {
                start: {
                    column: pStartColumn,
                    line: pStartLine,
                },
                end: {
                    column: pEndColumn,
                    line: pEndLine,
                },
            }
        };

        // Recursive find all PgslSyntaxTrees
        const lFindChildTreeList = (pData: PgslSyntaxTreeInitData | Array<PgslSyntaxTreeInitDataValue>): Array<UnknownPgslSyntaxTree> => {
            const lChildList: Array<UnknownPgslSyntaxTree> = new Array<UnknownPgslSyntaxTree>();

            for (const lValue of Object.values(pData)) {
                // Single tree structure.
                if (lValue instanceof BasePgslSyntaxTree) {
                    lChildList.push(lValue);
                    continue;
                }

                // String is defnitly not a child.
                if (typeof lValue === 'string') {
                    continue;
                }

                // Recursive find in inner objects.
                lChildList.push(...lFindChildTreeList(lValue));
            }

            return lChildList;
        };

        // Save all childs.
        this.mChilds = lFindChildTreeList(pData);

        // Set this instance to childs parent.
        for (const lChild of this.mChilds) {
            lChild.setParent(this);
        }
    }

    /**
     * Read variable declaration by name.
     * 
     * @param pVariableName - Variable name.
     * 
     * @returns the declaration of the scoped variable.
     * 
     * @throws {@link Exception}
     * When the variable does not exits. 
     */
    public getVariableDeclarationOf(pVariableName: string): IPgslVariableDeclarationSyntaxTree {
        // Try to read declaration
        const lDeclaration: IPgslVariableDeclarationSyntaxTree | undefined = this.scopedVariables.get(pVariableName);
        if (!lDeclaration) {
            throw new Exception(`Variable "${pVariableName}" not defined in current scope.`, this);
        }

        return lDeclaration;
    }

    /**
     * Set parent tree of syntax tree.
     * 
     * @param pParent - Parent of structure.
     */
    public setParent(pParent: UnknownPgslSyntaxTree): this {
        // Cant set parent twice.
        if (this.mParent) {
            throw new Exception('PGSL-Structure has a parent can not be moved.', this);
        }

        // Set parent.
        this.mParent = pParent;

        // Return reference.
        return this;
    }

    /**
     * validate tree structure. 
     */
    public validateIntegrity(): this {
        // Validate all child structures.
        for (const lChild of this.mChilds) {
            lChild.validateIntegrity();
        }

        // Apply data.
        try {
            // Call structure validate function.
            this.onValidateIntegrity();
        } catch (pError) {
            // Get message of exception.
            let lMessage: string = '';
            if (pError instanceof Error) {
                lMessage = pError.message;
            } else {
                lMessage = (<any>pError).toString();
            }

            // Extend message by file name.
            lMessage = `Transpile file: ${lMessage}`;

            // Build and throw parser exception.
            throw new ParserException(lMessage, this,
                this.mMeta.position.start.column,
                this.mMeta.position.start.line,
                this.mMeta.position.end.column,
                this.mMeta.position.end.line
            );
        }

        this.mIsValid = true;

        // Return reference.
        return this;
    }

    /**
     * Throws when the syntax tree was not validated.
     */
    protected ensureValidity(): void {
        if (!this.mIsValid) {
            throw new Exception('Syntax tree is not validated to access properties.', this);
        }
    }

    /**
     * Retrieve data of current structure.
     */
    protected abstract onValidateIntegrity(): void;

    // TODO: Add something that can transpile into wgsl.
}

type SyntaxTreeMeta = {
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

export type UnknownPgslSyntaxTree = BasePgslSyntaxTree<PgslSyntaxTreeInitData>;

type PgslSyntaxTreeInitDataValue = BasePgslSyntaxTree<PgslSyntaxTreeInitData> | string | PgslSyntaxTreeInitData | Array<PgslSyntaxTreeInitDataValue>;
export type PgslSyntaxTreeInitData = { [Key: string]: PgslSyntaxTreeInitDataValue; };