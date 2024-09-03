import { InvalidationObject } from '../gpu/invalidation-object';

export abstract class BaseMemoryLayout extends InvalidationObject {
    private readonly mName: string;

    /**
     * Variable name of buffer.
     */
    public get name(): string {
        return this.mName;
    }

    /**
     * Constuctor.
     * @param pParameter - Parameter.
     */
    public constructor(pParameter: MemoryLayoutParameter) {
        super();
        
        this.mName = pParameter.name;
    }
}

export interface MemoryLayoutParameter {
    name: string;
}