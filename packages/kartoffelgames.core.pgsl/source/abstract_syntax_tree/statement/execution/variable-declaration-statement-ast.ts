import { EnumUtil } from '@kartoffelgames/core';
import { PgslAccessModeEnum } from '../../../feature_set/enum/pgsl-access-mode-enum.ts';
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
import { type BasePgslType, BasePgslTypeKind } from '../../type/definition/base-pgsl-type.ts';
import { PgslPointerType } from '../../type/definition/pgsl-pointer-type.ts';
import type { IStatementAst, StatementAstData } from '../i-statement-ast.interface.ts';

/**
 * PGSL structure holding a variable declaration for a function scope variable.
 */
export class VariableDeclarationStatementAst extends AbstractSyntaxTree<VariableDeclarationStatementCst, VariableDeclarationStatementAstData> implements IStatementAst, IValueStoreAst {
    /**
     * Validate data of current structure.
     * 
     * @param pContext - Validation context.
     * @param pCst - Cst data.
     */
    protected onProcess(pContext: AbstractSyntaxTreeContext, pCst: VariableDeclarationStatementCst): VariableDeclarationStatementAstData {
        // Parse declaration type.
        let lDeclarationType: PgslDeclarationType | undefined = EnumUtil.cast(PgslDeclarationType, pCst.declarationType);
        if (!lDeclarationType) {
            pContext.pushIncident(`Declaration type "${pCst.declarationType}" not defined.`, this);

            lDeclarationType = PgslDeclarationType.Let;
        }

        // Create type declaration.
        const lTypeDeclaration: TypeDeclarationAst = new TypeDeclarationAst(pCst.typeDeclaration).process(pContext);
        const lType: BasePgslType = lTypeDeclaration.data.type;

        // Expression value has a fixed byte size.

        let lConstantValue: number | string | null = null;
        let lExpression: IExpressionAst | null = null;

        // Read expression attachment when a expression is present.
        if (pCst.expression) {
            lExpression = ExpressionAstBuilder.build(pCst.expression).process(pContext);

            // TODO: Only assign a const value when its a const declaration.
            lConstantValue = lExpression.data.constantValue;

            // Validate same type.
            if (lExpression.data.resolveType.conversionRankTo(lType) === Number.POSITIVE_INFINITY) {
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

        // Determinate fixed state based on declaration type and expression.
        const lFixedState: PgslValueFixedState = (() => {
            // Let declarations are always variable.
            if (lDeclarationType === PgslDeclarationType.Let) {
                return PgslValueFixedState.Variable;
            }

            if (lDeclarationType === PgslDeclarationType.Const) {
                // When defined as constant and the expression is also a constant, the fixed state is constant.
                if (lExpression && lExpression.data.fixedState === PgslValueFixedState.Constant) {
                    return PgslValueFixedState.Constant;
                }

                // Otherwise a function scoped fixed value that is not constant on creation time.
                return PgslValueFixedState.ScopeFixed;
            }

            return PgslValueFixedState.Variable;
        })();

        // Value validation does not apply to pointers.
        if (!(lType instanceof PgslPointerType)) {
            // Type needs to be storable.
            if (!lType.isKind(BasePgslTypeKind.Constructible)) {
                pContext.pushIncident(`Type is not constructible type.`, this);
            }
        } else {
            // If a expression is present, read the address space and attach it to the pointer type.
            if (lExpression) {
                lType.assignAddressSpace(lExpression.data.storageAddressSpace, pContext);
            }
        }

        // Validate const value need to have a initialization.
        if (pCst.declarationType === PgslDeclarationType.Const && !pCst.expression) {
            pContext.pushIncident(`Constants need a initializer value.`, this);
        }

        // Push variable to current scope.
        if (!pContext.registerValue(pCst.name, this)) {
            pContext.pushIncident(`Variable with name "${pCst.name}" already defined.`, this);
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
            name: pCst.name,
            constantValue: typeof lConstantValue === 'number' ? lConstantValue : null,
            accessMode: PgslAccessModeEnum.VALUES.ReadWrite,
        };
    }
}

export type VariableDeclarationStatementAstData = {
    typeDeclaration: TypeDeclarationAst;
    expression: IExpressionAst | null;
} & StatementAstData & ValueStoreAstData;