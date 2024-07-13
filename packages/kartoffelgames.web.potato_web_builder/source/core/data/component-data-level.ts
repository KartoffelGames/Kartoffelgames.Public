/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { DataLevel } from './data-level';
import { LevelProcedure } from './level-procedure';

/**
 * Component data level.
 * Can be used to create a expression that is executed inside the data level.
 */
export class ComponentDataLevel {
    private readonly mDataLevel: DataLevel;

    /**
     * Level data of module.
     */
    public get data(): DataLevel {
        return this.mDataLevel;
    }

    /**
     * Constructor. 
     * Create expression executor with embedded values.
     * 
     * @param pInstructionLevelData - Level data. 
     */
    public constructor(pInstructionLevelData: DataLevel) {
        this.mDataLevel = pInstructionLevelData;
    }

    /**
     * Create expression procedure in component processor context.
     * Extended values are used only for this procedure.
     * 
     * @param pExpression - Expression to execute.
     * @param pExtendedValues - Names of extended values.
     */
    public createExpressionProcedure<TResult = any>(pExpression: string, pExtendedValues?: Array<string>): LevelProcedure<TResult> {
        return new LevelProcedure(pExpression, this.data, pExtendedValues ?? []);
    }

    /**
     * Add or replaces temporary value in this manipulator scope.
     * 
     * @param pKey - Key of value.
     * @param pValue - Value.
     */
    public setTemporaryValue<TValue>(pKey: string, pValue: TValue): void {
        // Set value to data level.
        this.data.setTemporaryValue(pKey, pValue);
    }
}