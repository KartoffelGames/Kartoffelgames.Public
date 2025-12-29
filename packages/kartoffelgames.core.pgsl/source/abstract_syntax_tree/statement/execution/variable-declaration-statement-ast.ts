import { EnumUtil } from '@kartoffelgames/core';
import { PgslAccessModeEnum } from '../../../buildin/enum/pgsl-access-mode-enum.ts';
import type { VariableDeclarationStatementCst } from '../../../concrete_syntax_tree/statement.type.ts';
import { PgslDeclarationType } from '../../../enum/pgsl-declaration-type.enum.ts';
import { PgslValueAddressSpace } from '../../../enum/pgsl-value-address-space.enum.ts';
import { PgslValueFixedState } from '../../../enum/pgsl-value-fixed-state.ts';
import type { AbstractSyntaxTreeContext } from '../../abstract-syntax-tree-context.ts';
import { AbstractSyntaxTree } from '../../abstract-syntax-tree.ts';
import { ExpressionAstBuilder } from '../../expression/expression-ast-builder.ts';
import type { IExpressionAst } from '../../expression/i-expression-ast.interface.ts';
import { TypeDeclarationAst } from '../../general/type-declaration-ast.ts';
import type { IValueStoreAst, ValueStoreAstData } from '../../i-value-store-ast.interface.ts';
import { PgslPointerType } from '../../type/pgsl-pointer-type.ts';
import type { IType } from '../../type/i-type.interface.ts';
import type { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

// TODO: Declaration types var should not exist. let should be transpiled to var in WGSL. And const to let or const based on usage.

/**
 * PGSL structure holding a variable declaration for a function scope variable.
 */
export class VariableDeclarationStatementAst extends AbstractSyntaxTree<VariableDeclarationStatementCst, VariableDeclarationStatementAstData> implements IStatementAst, IValueStoreAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     */
    protected onProcess(pContext: AbstractSyntaxTreeContext): VariableDeclarationStatementAstData {
        // Parse declaration type.
        let lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, this.cst.declarationType);
        if (!lDeclarationType) {
            pContext.pushIncident(`Declaration type "${this.cst.declarationType}" not defined.`, this);

            lDeclarationType = PgslDeclarationType.Var;
        }

        // Create type declaration.
        const lTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(this.cst.typeDeclaration).process(pContext);
        const lType: IType = lTypeDeclaration.data.type;

        // Expression value has a fixed byte size.
        let lFixedState: PgslValueFixedState = PgslValueFixedState.Variable;
        let lConstantValue: number | string | null = null;
        let lExpression: IExpressionAst | null = null;

        // Read expression attachment when a expression is present.
        if (this.cst.expression) {
            lExpression = ExpressionAstBuilder.build(this.cst.expression, pContext);
            lFixedState = lExpression.data.fixedState;
            lConstantValue = lExpression.data.constantValue;

            // Validate same type.
            if (!lExpression.data.resolveType.isImplicitCastableInto(lType)) {
                pContext.pushIncident(`Expression values type can't be converted to variables type.`, lExpression);
            }
        }

        // Create list of all bit operations.
        const lDeclarationTypeList: Array<PgslDeclarationType> = [
            PgslDeclarationType.Const,
            PgslDeclarationType.Let
        ];

        // Validate.
        if (!lDeclarationTypeList.includes(lDeclarationType)) {
            pContext.pushIncident(`Declaration type "${lDeclarationType}" can not be used for block variable declarations.`, this);
        }

        // Value validation does not apply to pointers.
        if (!(lType instanceof PgslPointerType)) {
            // Type needs to be storable.
            if (!lType.data.storable) {
                pContext.pushIncident(`Type is not storable or a pointer of it.`, this);
            }

            // Const declaration type needs to be constructible.
            if (this.cst.declarationType === PgslDeclarationType.Const && !lType.data.constructible) {
                pContext.pushIncident(`Constant variable declarations can only be of a constructible type.`, this);
            }
        } else {
            // If a expression is present, read the address space and attach it to the pointer type.
            if (lExpression) {
                lType.assignAddressSpace(lExpression.data.storageAddressSpace, pContext);
            }
        }

        // Validate const value need to have a initialization.
        if (this.cst.declarationType === PgslDeclarationType.Const && !this.cst.expression) {
            pContext.pushIncident(`Constants need a initializer value.`, this);
        }

        // Push variable to current scope.
        if(!pContext.addValue(this.cst.name, this)) {
            pContext.pushIncident(`Variable with name "${this.cst.name}" already defined.`, this);
        }

        return {
            // Statement data.
            typeDeclaration: lTypeDeclaration,
            expression: lExpression,

            // Value store data.
            fixedState: lFixedState,
            declarationType: lDeclarationType,
            addressSpace: PgslValueAddressSpace.Function,
            type: lType,
            name: this.cst.name,
            constantValue: typeof lConstantValue === 'number' ? lConstantValue : null,
            accessMode: PgslAccessModeEnum.VALUES.ReadWrite,
        };
    }
}

export type VariableDeclarationStatementAstData = {
    typeDeclaration: TypeDeclarationAst;
    expression: IExpressionAst | null;
} & StatementAstData & ValueStoreAstData;