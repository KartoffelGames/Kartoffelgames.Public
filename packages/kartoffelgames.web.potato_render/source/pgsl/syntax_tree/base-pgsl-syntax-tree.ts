import { Dictionary, Exception } from '@kartoffelgames/core';
import { ParserException } from '@kartoffelgames/core.parser';
import { PgslModuleSyntaxTree } from './pgsl-module-syntax-tree';

/**
 * Base pgsl syntax tree object.
 */
export abstract class BasePgslSyntaxTree<TSetupData = unknown> {
    private readonly mBuildIn: boolean;
    private readonly mChilds: Array<BasePgslSyntaxTree>;
    private readonly mIsScopeBarrier: boolean;
    private readonly mMeta: SyntaxTreeMeta;
    private mParent: BasePgslSyntaxTree | null;
    private readonly mScopedValues: Dictionary<string, BasePgslSyntaxTree>;
    private mSetupCompleted: boolean;
    private mSetupData: TSetupData | null;
    private mSetupStarted: boolean;
    
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
        if (!this.mParent) {
            throw new Exception('PGSL-Structure not attached to any document', this);
        }

        return this.mParent.document;
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
    public get parent(): BasePgslSyntaxTree | null {
        return this.mParent;
    }

    /**
     * Setup data.
     */
    protected get setupData(): TSetupData | null {
        return this.mSetupData;
    }

    /**
     * Constructor.
     * 
     * @param pData - Initial data.
     * @param pMeta - Syntax tree meta data.
     * @param pBuildIn - Buildin value.
     */
    public constructor(pMeta: BasePgslSyntaxTreeMeta, pDefinesValueScope: boolean) {
        this.mSetupStarted = false;
        this.mSetupCompleted = false;

        // Set initial data and null setup data.
        this.mSetupData = null;

        // Setup scoped value list.
        this.mIsScopeBarrier = pDefinesValueScope;
        this.mScopedValues = new Dictionary<string, BasePgslSyntaxTree>();

        // Save meta information.
        this.mMeta = {
            position: {
                start: {
                    line: pMeta.range[0],
                    column: pMeta.range[1],
                },
                end: {
                    line: pMeta.range[2],
                    column: pMeta.range[3]
                }
            }
        };
        this.mBuildIn = pMeta.buildIn ?? false;

        // Hirachy information.
        this.mParent = null;
        this.mChilds = new Array<BasePgslSyntaxTree>();
    }

    /**
     * Add child syntax tree.
     * Sets childs parent.
     * 
     * @param pChild - Child syntax tree.
     */
    public appendChild(...pChild: Array<BasePgslSyntaxTree>): void {
        // Add any child.
        for (const lChild of pChild) {
            // Append to child list. 
            this.mChilds.push(lChild);

            // Set childs parent.
            lChild.setParent(this);

            // Direct setup when parent is setup.
            if (this.mSetupStarted) {
                lChild.setup();
            }
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
    public getScopedValue(pValueName: string): BasePgslSyntaxTree {
        // Try to read declaration
        let lDeclaration: BasePgslSyntaxTree | undefined = this.mScopedValues.get(pValueName);

        // When not declaration is found, search in parent scoped.
        if (!lDeclaration && this.mParent) {
            lDeclaration = this.mParent.getScopedValue(pValueName);
        }

        if (!lDeclaration) {
            throw new Exception(`Value with the name "${pValueName}" not defined in current scope.`, this);
        }

        return lDeclaration;
    }

    /**
     * Push a value to next available scope.
     * 
     * @param pValueName - Value name.
     * @param pValue - Value of scoped name. 
     */
    public pushScopedValue(pValueName: string, pValue: BasePgslSyntaxTree): void {
        // Save value when current tree defines a scope barrier.
        if (this.mIsScopeBarrier) {
            if (this.mScopedValues.has(pValueName)) {
                throw new Exception(`Scoped value "${pValueName}" Already defined for current scope.`, this);
            }

            // Set value to this scope.
            this.mScopedValues.set(pValueName, pValue);
            return;
        }

        // Can only add value to next scope when current tree has a parent.
        if (!this.mParent) {
            throw new Exception(`Can't push value "${pValueName}" to current scope. No scope defined.`, this);
        }

        // Push value to parent. Hopefully it is the next available scope barrier. 
        this.mParent.pushScopedValue(pValueName, pValue);
    }

    /**
     * Setup tree structure. 
     */
    public setup(): this {
        // Dont need to setup a second time.
        if (this.mSetupStarted) {
            return this;
        }

        // Lock another setup.
        this.mSetupStarted = true;

        // Setup all child structures.
        for (const lChild of this.mChilds) {
            lChild.setup();
        }

        // Apply data.
        try {
            // Call structure setup function.
            this.mSetupData = this.onSetup();

            // Complete setup.
            this.mSetupCompleted = true;
        } catch (pError) {
            // Get message of exception.
            let lMessage: string = '';
            if (pError instanceof Error) {
                lMessage = pError.message;
            } else {
                lMessage = (<any>pError).toString();
            }

            // Extend message by file name.
            lMessage = `Transpile file setup failed: ${lMessage}`;

            // Build and throw parser exception.
            throw new ParserException(lMessage, this,
                this.mMeta.position.start.column,
                this.mMeta.position.start.line,
                this.mMeta.position.end.column,
                this.mMeta.position.end.line
            );
        }

        // Return reference.
        return this;
    }

    /**
     * Validate tree structure. 
     */
    public validateIntegrity(): this {
        if (!this.mSetupCompleted) {
            throw new Exception('Syntax tree must be setup to be validated.', this);
        }

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
            lMessage = `Transpile file validation failed: ${lMessage}`;

            // Build and throw parser exception.
            throw new ParserException(lMessage, this,
                this.mMeta.position.start.column,
                this.mMeta.position.start.line,
                this.mMeta.position.end.column,
                this.mMeta.position.end.line
            );
        }

        // Return reference.
        return this;
    }

    /**
     * Throws when the syntax tree was not validated.
     */
    protected ensureSetup(): asserts this is { setupData: TSetupData; } {
        if (!this.mSetupCompleted) {
            throw new Exception('Syntax tree must be setup to access properties.', this);
        }
    }

    /**
     * Retrieve data of current structure.
     */
    protected onSetup(): TSetupData {
        // Nothing to setup.
        return null as TSetupData;
    }

    /**
     * Retrieve data of current structure.
     */
    protected onValidateIntegrity(): void {
        // Nothing to validate.
    }

    /**
     * Set parent tree of syntax tree.
     * 
     * @param pParent - Parent of structure.
     */
    private setParent(pParent: BasePgslSyntaxTree): this {
        // Cant set parent twice.
        if (this.mParent) {
            throw new Exception('PGSL-Structure has a parent can not be moved.', this);
        }

        // Set parent.
        this.mParent = pParent;

        // Return reference.
        return this;
    }

    // TODO: Add something that can transpile into wgsl.
}

export type BasePgslSyntaxTreeMeta = {
    range: [number, number, number, number],
    buildIn?: boolean;
};

export type SyntaxTreeMeta = {
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