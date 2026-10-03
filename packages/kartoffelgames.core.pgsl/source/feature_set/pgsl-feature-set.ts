import { Exception } from '@kartoffelgames/core';
import type { BaseDeclarationAst } from '../abstract_syntax_tree/declaration/base-declaration-ast.ts';
import { PgslTypeCache } from '../abstract_syntax_tree/type/pgsl-type-cache.ts';
import type { PgslFeatureSetProcessor, PgslFeatureSetProcessorConstructor } from './pgsl-feature-set-processor.ts';

/**
 * Set of build-in declarations of a pgsl feature.
 */
export abstract class PgslFeatureSet {
    private readonly mDeclaration: Map<string, BaseDeclarationAst>;
    private readonly mTypes: PgslTypeCache;

    /**
     * List of global declarations.
     */
    public get declarations(): Array<BaseDeclarationAst> {
        return [...this.mDeclaration.values()];
    }

    /**
     * Declared names of feature set.
     */
    public get declaredNames(): Array<string> {
        return [...this.mDeclaration.keys()];
    }

    /**
     * Local type cache of feature set.
     */
    public get typeCache(): PgslTypeCache {
        return this.mTypes;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mTypes = new PgslTypeCache();

        // Init declaration containers.
        this.mDeclaration = new Map<string, BaseDeclarationAst>();
    }

    /**
     * Register all declarations of processor.
     * 
     * @param pFeatureSetProcessor - Processor constructor.
     */
    protected registerProcessor(pFeatureSetProcessor: PgslFeatureSetProcessorConstructor) {
        const lProcessor: PgslFeatureSetProcessor = new pFeatureSetProcessor(this).process();

        // Add and validate names.
        for (const lDeclaration of lProcessor.declarations) {
            if (this.mDeclaration.has(lDeclaration.name)) {
                throw new Exception(`Feature set declaration "${lDeclaration.name}" is already declared in this feature set.`, this);
            }

            // Add new declaration name and declaration.
            this.mDeclaration.set(lDeclaration.name, lDeclaration);
        }
    }

    /**
     * Get declaration by name scoped to this feature set.
     * 
     * @param pDeclarationName - Declaration name.
     * 
     * @returns the declaration.
     */
    public declarationOf(pDeclarationName: string): BaseDeclarationAst {
        if (!this.mDeclaration.has(pDeclarationName)) {
            throw new Exception(`Feature set has no declaration "${pDeclarationName}" registered.`, this);
        }

        return this.mDeclaration.get(pDeclarationName)!;
    }
}

/**
 * Constructor of a feature set.
 */
export type PgslFeatureSetConstructor = {
    new(): PgslFeatureSet;
};