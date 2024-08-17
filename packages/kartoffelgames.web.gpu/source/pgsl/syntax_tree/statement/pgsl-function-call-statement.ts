import { PgslExpression } from '../expression/pgsl-expression-syntax-tree';
import { PgslTemplateList } from '../general/pgsl-template-list-syntax-tree';
import { PgslStatement } from './pgsl-statement';

export class PgslFunctionCallStatement extends PgslStatement {
    private mName: string;
    private mParameterList: Array<PgslExpression>;
    private mTemplateList: PgslTemplateList | null;


    /**
     * Function name.
     */
    public get name(): string {
        return this.mName;
    } set name(pFunctionName: string) {
        this.mName = pFunctionName;
    }

    /**
     * Function parameter.
     */
    public get parameter(): Array<PgslExpression> {
        return this.mParameterList;
    } set parameter(pParameterList: Array<PgslExpression>) {
        this.mParameterList = pParameterList;
    }

    /**
     * Function template.
     */
    public get templateList(): PgslTemplateList | null {
        return this.mTemplateList;
    } set templateList(pTemplateList: PgslTemplateList | null) {
        this.mTemplateList = pTemplateList;
    }

    /**
     * Constructor.
     */
    public constructor() {
        super();

        this.mName = '';
        this.mParameterList = new Array<PgslExpression>();
        this.mTemplateList = null;
    }
}