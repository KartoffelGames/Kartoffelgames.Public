import { expect } from '@kartoffelgames/core-test';
import { AttributeListAst } from "../source/abstract_syntax_tree/general/attribute-list-ast.ts";
import { PgslArrayType } from "../source/abstract_syntax_tree/type/pgsl-array-type.ts";
import { PgslBuildInType } from "../source/abstract_syntax_tree/type/pgsl-build-in-type.ts";
import { PgslNumericType } from "../source/abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { PgslParser } from '../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('Import', async (pContext) => {
    await pContext.step('Basic import', () => {
        // TODO: Import tests and more.
    });
});
