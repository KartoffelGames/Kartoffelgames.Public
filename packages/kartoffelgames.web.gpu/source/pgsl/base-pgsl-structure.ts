import { Exception } from '@kartoffelgames/core';
import { PgslDocument } from './pgsl-document';
import { PgslBlockStatement } from './structure/statement/pgsl-block-statement';

/**
 * Base pgsl syntax tree object.
 */
export abstract class BasePgslStructure {
    private mParent: BasePgslStructure | null;

    /**
     * Assoziated document of pgsl structure.
     */
    public abstract readonly document: PgslDocument;

    /**
     * Parent structure of this object.
     * 
     * @throws {@link Exception}
     * When structure was not assigned to a parent.
     */
    public get parent(): BasePgslStructure | null {
        return this.mParent;
    }

    /**
     * Next valid scope.
     * The only valid scope of null is the document.
     */
    public get scope(): PgslBlockStatement | null {
        let lStructure: BasePgslStructure | null = this;
        while ((lStructure = lStructure.parent) !== null) {
            if (lStructure instanceof PgslBlockStatement) {
                return lStructure;
            }
        }

        return null;
    }

    /**
     * Constructor.
     */
    public constructor() {
        this.mParent = null;
    }

    /**
     * Set parent of PGSL-Structure.
     * 
     * @throws {@link Exception}
     * When structure was already assigned to a parent.
     * 
     * @param pParent - Structure parent.
     */
    public setParent(pParent: BasePgslStructure): void {
        if (this.mParent) {
            throw new Exception('PGSL-Structure has a parent can not be moved.', this);
        }

        this.mParent = pParent;
    }

    // TODO: Add something that can transpile into wgsl.

    // TODO: Add something to convert into serializeable object.
    // TODO: Add something to convert from serializeable object.
}