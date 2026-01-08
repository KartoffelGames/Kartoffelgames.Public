import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from "../../../../source/parser/pgsl-parser.ts";
import { PgslNumericType } from "../../../../source/abstract_syntax_tree/type/pgsl-numeric-type.ts";
import { WgslTranspiler } from "../../../../source/transpilation/wgsl/wgsl-transpiler.ts";
import { PgslParserResult } from "../../../../source/parser_result/pgsl-parser-result.ts";
import { PgslFrexpResult } from "../../../../source/buildin/struct/pgsl-frexp-result.ts";
import { PgslModfResult } from "../../../../source/buildin/struct/pgsl-modf-result.ts";

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

