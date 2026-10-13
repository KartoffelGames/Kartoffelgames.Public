import { expect } from '@kartoffelgames/core-test';
import { StructDeclarationAst } from '../../../../source/abstract_syntax_tree/declaration/struct-declaration-ast.ts';
import { PgslNumericType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-numeric-type.ts';
import { PgslVectorType } from '../../../../source/abstract_syntax_tree/type/definition/pgsl-vector-type.ts';
import { PgslCoreFeatureSet } from '../../../../source/feature_set/core_set/pgsl-core-feature-set.ts';
import { PgslFrexpStructFeatureSetConstructor } from '../../../../source/feature_set/core_set/struct/pgsl-frexp-struct-feature-set-processor.ts';
import { PgslParser } from '../../../../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../../../../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../../../../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('PgslFrexpStructFeatureSetConstructor.declarations', async (pContext) => {
    await pContext.step('__frexp_result_f32', () => {
        // Setup.
        const lProcessor: PgslFrexpStructFeatureSetConstructor = new PgslFrexpStructFeatureSetConstructor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is a struct.
        const lDeclaration: StructDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === '__frexp_result_f32') as StructDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(StructDeclarationAst);

        // Evaluation. Property names.
        expect(lDeclaration.data.properties.map((pProperty) => pProperty.data.name)).toBeDeepEqual(['fract', 'exp']);

        // Evaluation. Fract property type.
        const lFractType: PgslNumericType = lDeclaration.data.properties[0].data.typeDeclaration.data.type as PgslNumericType;
        expect(lFractType).toBeInstanceOf(PgslNumericType);
        expect(lFractType.numericTypeName).toBe(PgslNumericType.typeName.float32);

        // Evaluation. Exp property type.
        const lExpType: PgslNumericType = lDeclaration.data.properties[1].data.typeDeclaration.data.type as PgslNumericType;
        expect(lExpType).toBeInstanceOf(PgslNumericType);
        expect(lExpType.numericTypeName).toBe(PgslNumericType.typeName.signedInteger);
    });

    await pContext.step('__frexp_result_f16', () => {
        // Setup.
        const lProcessor: PgslFrexpStructFeatureSetConstructor = new PgslFrexpStructFeatureSetConstructor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is a struct.
        const lDeclaration: StructDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === '__frexp_result_f16') as StructDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(StructDeclarationAst);

        // Evaluation. Property names.
        expect(lDeclaration.data.properties.map((pProperty) => pProperty.data.name)).toBeDeepEqual(['fract', 'exp']);

        // Evaluation. Fract property type.
        const lFractType: PgslNumericType = lDeclaration.data.properties[0].data.typeDeclaration.data.type as PgslNumericType;
        expect(lFractType).toBeInstanceOf(PgslNumericType);
        expect(lFractType.numericTypeName).toBe(PgslNumericType.typeName.float16);

        // Evaluation. Exp property type.
        const lExpType: PgslNumericType = lDeclaration.data.properties[1].data.typeDeclaration.data.type as PgslNumericType;
        expect(lExpType).toBeInstanceOf(PgslNumericType);
        expect(lExpType.numericTypeName).toBe(PgslNumericType.typeName.signedInteger);
    });

    await pContext.step('__frexp_result_abstractFloat', () => {
        // Setup.
        const lProcessor: PgslFrexpStructFeatureSetConstructor = new PgslFrexpStructFeatureSetConstructor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is a struct.
        const lDeclaration: StructDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === '__frexp_result_abstractFloat') as StructDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(StructDeclarationAst);

        // Evaluation. Property names.
        expect(lDeclaration.data.properties.map((pProperty) => pProperty.data.name)).toBeDeepEqual(['fract', 'exp']);

        // Evaluation. Fract property type.
        const lFractType: PgslNumericType = lDeclaration.data.properties[0].data.typeDeclaration.data.type as PgslNumericType;
        expect(lFractType).toBeInstanceOf(PgslNumericType);
        expect(lFractType.numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);

        // Evaluation. Exp property type.
        const lExpType: PgslNumericType = lDeclaration.data.properties[1].data.typeDeclaration.data.type as PgslNumericType;
        expect(lExpType).toBeInstanceOf(PgslNumericType);
        expect(lExpType.numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);
    });

    await pContext.step('__frexp_result_vec2_f32', () => {
        // Setup.
        const lProcessor: PgslFrexpStructFeatureSetConstructor = new PgslFrexpStructFeatureSetConstructor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is a struct.
        const lDeclaration: StructDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === '__frexp_result_vec2_f32') as StructDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(StructDeclarationAst);

        // Evaluation. Property names.
        expect(lDeclaration.data.properties.map((pProperty) => pProperty.data.name)).toBeDeepEqual(['fract', 'exp']);

        // Evaluation. Fract property type.
        const lFractType: PgslVectorType = lDeclaration.data.properties[0].data.typeDeclaration.data.type as PgslVectorType;
        expect(lFractType).toBeInstanceOf(PgslVectorType);
        expect(lFractType.dimension).toBe(2);
        expect((lFractType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.float32);

        // Evaluation. Exp property type.
        const lExpType: PgslVectorType = lDeclaration.data.properties[1].data.typeDeclaration.data.type as PgslVectorType;
        expect(lExpType).toBeInstanceOf(PgslVectorType);
        expect(lExpType.dimension).toBe(2);
        expect((lExpType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.signedInteger);
    });

    await pContext.step('__frexp_result_vec2_f16', () => {
        // Setup.
        const lProcessor: PgslFrexpStructFeatureSetConstructor = new PgslFrexpStructFeatureSetConstructor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is a struct.
        const lDeclaration: StructDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === '__frexp_result_vec2_f16') as StructDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(StructDeclarationAst);

        // Evaluation. Property names.
        expect(lDeclaration.data.properties.map((pProperty) => pProperty.data.name)).toBeDeepEqual(['fract', 'exp']);

        // Evaluation. Fract property type.
        const lFractType: PgslVectorType = lDeclaration.data.properties[0].data.typeDeclaration.data.type as PgslVectorType;
        expect(lFractType).toBeInstanceOf(PgslVectorType);
        expect(lFractType.dimension).toBe(2);
        expect((lFractType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.float16);

        // Evaluation. Exp property type.
        const lExpType: PgslVectorType = lDeclaration.data.properties[1].data.typeDeclaration.data.type as PgslVectorType;
        expect(lExpType).toBeInstanceOf(PgslVectorType);
        expect(lExpType.dimension).toBe(2);
        expect((lExpType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.signedInteger);
    });

    await pContext.step('__frexp_result_vec2_abstractFloat', () => {
        // Setup.
        const lProcessor: PgslFrexpStructFeatureSetConstructor = new PgslFrexpStructFeatureSetConstructor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is a struct.
        const lDeclaration: StructDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === '__frexp_result_vec2_abstractFloat') as StructDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(StructDeclarationAst);

        // Evaluation. Property names.
        expect(lDeclaration.data.properties.map((pProperty) => pProperty.data.name)).toBeDeepEqual(['fract', 'exp']);

        // Evaluation. Fract property type.
        const lFractType: PgslVectorType = lDeclaration.data.properties[0].data.typeDeclaration.data.type as PgslVectorType;
        expect(lFractType).toBeInstanceOf(PgslVectorType);
        expect(lFractType.dimension).toBe(2);
        expect((lFractType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);

        // Evaluation. Exp property type.
        const lExpType: PgslVectorType = lDeclaration.data.properties[1].data.typeDeclaration.data.type as PgslVectorType;
        expect(lExpType).toBeInstanceOf(PgslVectorType);
        expect(lExpType.dimension).toBe(2);
        expect((lExpType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);
    });

    await pContext.step('__frexp_result_vec3_f32', () => {
        // Setup.
        const lProcessor: PgslFrexpStructFeatureSetConstructor = new PgslFrexpStructFeatureSetConstructor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is a struct.
        const lDeclaration: StructDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === '__frexp_result_vec3_f32') as StructDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(StructDeclarationAst);

        // Evaluation. Property names.
        expect(lDeclaration.data.properties.map((pProperty) => pProperty.data.name)).toBeDeepEqual(['fract', 'exp']);

        // Evaluation. Fract property type.
        const lFractType: PgslVectorType = lDeclaration.data.properties[0].data.typeDeclaration.data.type as PgslVectorType;
        expect(lFractType).toBeInstanceOf(PgslVectorType);
        expect(lFractType.dimension).toBe(3);
        expect((lFractType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.float32);

        // Evaluation. Exp property type.
        const lExpType: PgslVectorType = lDeclaration.data.properties[1].data.typeDeclaration.data.type as PgslVectorType;
        expect(lExpType).toBeInstanceOf(PgslVectorType);
        expect(lExpType.dimension).toBe(3);
        expect((lExpType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.signedInteger);
    });

    await pContext.step('__frexp_result_vec3_f16', () => {
        // Setup.
        const lProcessor: PgslFrexpStructFeatureSetConstructor = new PgslFrexpStructFeatureSetConstructor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is a struct.
        const lDeclaration: StructDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === '__frexp_result_vec3_f16') as StructDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(StructDeclarationAst);

        // Evaluation. Property names.
        expect(lDeclaration.data.properties.map((pProperty) => pProperty.data.name)).toBeDeepEqual(['fract', 'exp']);

        // Evaluation. Fract property type.
        const lFractType: PgslVectorType = lDeclaration.data.properties[0].data.typeDeclaration.data.type as PgslVectorType;
        expect(lFractType).toBeInstanceOf(PgslVectorType);
        expect(lFractType.dimension).toBe(3);
        expect((lFractType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.float16);

        // Evaluation. Exp property type.
        const lExpType: PgslVectorType = lDeclaration.data.properties[1].data.typeDeclaration.data.type as PgslVectorType;
        expect(lExpType).toBeInstanceOf(PgslVectorType);
        expect(lExpType.dimension).toBe(3);
        expect((lExpType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.signedInteger);
    });

    await pContext.step('__frexp_result_vec3_abstractFloat', () => {
        // Setup.
        const lProcessor: PgslFrexpStructFeatureSetConstructor = new PgslFrexpStructFeatureSetConstructor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is a struct.
        const lDeclaration: StructDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === '__frexp_result_vec3_abstractFloat') as StructDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(StructDeclarationAst);

        // Evaluation. Property names.
        expect(lDeclaration.data.properties.map((pProperty) => pProperty.data.name)).toBeDeepEqual(['fract', 'exp']);

        // Evaluation. Fract property type.
        const lFractType: PgslVectorType = lDeclaration.data.properties[0].data.typeDeclaration.data.type as PgslVectorType;
        expect(lFractType).toBeInstanceOf(PgslVectorType);
        expect(lFractType.dimension).toBe(3);
        expect((lFractType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);

        // Evaluation. Exp property type.
        const lExpType: PgslVectorType = lDeclaration.data.properties[1].data.typeDeclaration.data.type as PgslVectorType;
        expect(lExpType).toBeInstanceOf(PgslVectorType);
        expect(lExpType.dimension).toBe(3);
        expect((lExpType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);
    });

    await pContext.step('__frexp_result_vec4_f32', () => {
        // Setup.
        const lProcessor: PgslFrexpStructFeatureSetConstructor = new PgslFrexpStructFeatureSetConstructor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is a struct.
        const lDeclaration: StructDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === '__frexp_result_vec4_f32') as StructDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(StructDeclarationAst);

        // Evaluation. Property names.
        expect(lDeclaration.data.properties.map((pProperty) => pProperty.data.name)).toBeDeepEqual(['fract', 'exp']);

        // Evaluation. Fract property type.
        const lFractType: PgslVectorType = lDeclaration.data.properties[0].data.typeDeclaration.data.type as PgslVectorType;
        expect(lFractType).toBeInstanceOf(PgslVectorType);
        expect(lFractType.dimension).toBe(4);
        expect((lFractType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.float32);

        // Evaluation. Exp property type.
        const lExpType: PgslVectorType = lDeclaration.data.properties[1].data.typeDeclaration.data.type as PgslVectorType;
        expect(lExpType).toBeInstanceOf(PgslVectorType);
        expect(lExpType.dimension).toBe(4);
        expect((lExpType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.signedInteger);
    });

    await pContext.step('__frexp_result_vec4_f16', () => {
        // Setup.
        const lProcessor: PgslFrexpStructFeatureSetConstructor = new PgslFrexpStructFeatureSetConstructor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is a struct.
        const lDeclaration: StructDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === '__frexp_result_vec4_f16') as StructDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(StructDeclarationAst);

        // Evaluation. Property names.
        expect(lDeclaration.data.properties.map((pProperty) => pProperty.data.name)).toBeDeepEqual(['fract', 'exp']);

        // Evaluation. Fract property type.
        const lFractType: PgslVectorType = lDeclaration.data.properties[0].data.typeDeclaration.data.type as PgslVectorType;
        expect(lFractType).toBeInstanceOf(PgslVectorType);
        expect(lFractType.dimension).toBe(4);
        expect((lFractType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.float16);

        // Evaluation. Exp property type.
        const lExpType: PgslVectorType = lDeclaration.data.properties[1].data.typeDeclaration.data.type as PgslVectorType;
        expect(lExpType).toBeInstanceOf(PgslVectorType);
        expect(lExpType.dimension).toBe(4);
        expect((lExpType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.signedInteger);
    });

    await pContext.step('__frexp_result_vec4_abstractFloat', () => {
        // Setup.
        const lProcessor: PgslFrexpStructFeatureSetConstructor = new PgslFrexpStructFeatureSetConstructor(new PgslCoreFeatureSet());

        // Process.
        lProcessor.process();

        // Evaluation. Declaration is a struct.
        const lDeclaration: StructDeclarationAst = lProcessor.declarations.find((pDeclaration) => pDeclaration.name === '__frexp_result_vec4_abstractFloat') as StructDeclarationAst;
        expect(lDeclaration).toBeInstanceOf(StructDeclarationAst);

        // Evaluation. Property names.
        expect(lDeclaration.data.properties.map((pProperty) => pProperty.data.name)).toBeDeepEqual(['fract', 'exp']);

        // Evaluation. Fract property type.
        const lFractType: PgslVectorType = lDeclaration.data.properties[0].data.typeDeclaration.data.type as PgslVectorType;
        expect(lFractType).toBeInstanceOf(PgslVectorType);
        expect(lFractType.dimension).toBe(4);
        expect((lFractType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.abstractFloat);

        // Evaluation. Exp property type.
        const lExpType: PgslVectorType = lDeclaration.data.properties[1].data.typeDeclaration.data.type as PgslVectorType;
        expect(lExpType).toBeInstanceOf(PgslVectorType);
        expect(lExpType.dimension).toBe(4);
        expect((lExpType.innerType as PgslNumericType).numericTypeName).toBe(PgslNumericType.typeName.abstractInteger);
    });
});

Deno.test('PgslFrexpStructFeatureSetConstructor - Transpilation', async (pContext) => {
    await pContext.step('Scalar result properties', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslNumericType.typeName.float32} = 1.5;
                let fractValue: ${PgslNumericType.typeName.float32} = frexp(inputValue).fract;
                let expValue: ${PgslNumericType.typeName.signedInteger} = frexp(inputValue).exp;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Fract and exp property are read from the WGSL result struct.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var inputValue:f32=1.5;` +
            `var fractValue:f32=frexp(inputValue).fract;` +
            `var expValue:i32=frexp(inputValue).exp;` +
            `}`
        );
    });

    await pContext.step('Vector result properties', () => {
        // Setup.
        const lCodeText: string = `
            function testFunction(): void {
                let inputValue: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = new ${PgslVectorType.typeName.vector2}(1.5, 2.0);
                let fractValue: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.float32}> = frexp(inputValue).fract;
                let expValue: ${PgslVectorType.typeName.vector2}<${PgslNumericType.typeName.signedInteger}> = frexp(inputValue).exp;
            }
        `;

        // Process.
        const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

        // Evaluation. No errors.
        expect(lTranspilationResult.incidents).toHaveLength(0);

        // Evaluation. Fract and exp property are read from the WGSL result struct.
        expect(lTranspilationResult.source).toBe(
            `fn testFunction(){` +
            `var inputValue:vec2<f32>=vec2(1.5,2.0);` +
            `var fractValue:vec2<f32>=frexp(inputValue).fract;` +
            `var expValue:vec2<i32>=frexp(inputValue).exp;` +
            `}`
        );
    });
});
