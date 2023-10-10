import { Exception } from '@kartoffelgames/core.data';
import { PgslFunction } from '../pgsl-function';
import { PgslVariable } from '../pgsl-variable';
import { PgslType } from '../type/pgsl-type';
import { PgslValue } from './pgsl-value';

export class PgslFunctionCall {
    private readonly mFunction: PgslFunction;
    private readonly mParameterList: Array<PgslValue>;

    /**
     * Function.
     */
    public get function(): PgslFunction {
        return this.mFunction;
    }

    /**
     * Call parameter.
     */
    public get parameter(): Array<PgslValue> {
        return [...this.mParameterList];
    }

    /**
     * Constructor.
     * @param pFunction - Function.
     * @param pParameterList - Function parameter values.
     */
    public constructor(pFunction: PgslFunction, ...pParameterList: Array<PgslValue>) {
        this.mFunction = pFunction;

        const lTargetParameterList: Array<PgslVariable> = pFunction.parameter;

        // Validate parameter count.
        if (pParameterList.length !== pFunction.parameter.length) {
            throw new Exception(`Invalid parameters. ${pFunction.name} needs ${pFunction.parameter.length} parameters.`, this);
        }

        // Validate parameter types.
        for (let lParameterIndex = 0; lParameterIndex < pFunction.parameter.length; lParameterIndex++) {
            const lTargetParameterVariable: PgslVariable = lTargetParameterList[lParameterIndex];

            const lTargetParameterType: PgslType = lTargetParameterVariable.type;
            const lSourceType: PgslType = pParameterList[lParameterIndex].resultType;

            if (!lTargetParameterType.equal(lSourceType)) {
                throw new Exception(`Invalid parameter for ${this.mFunction.name}. Parameter ${lTargetParameterVariable.name} has a invalid type.`, this);
            }
        }

        this.mParameterList = pParameterList;
    }
}