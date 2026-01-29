import { expect } from '@kartoffelgames/core-test';
import { PgslParser } from '../source/parser/pgsl-parser.ts';
import type { PgslParserResult } from '../source/parser_result/pgsl-parser-result.ts';
import { WgslTranspiler } from '../source/transpilation/wgsl/wgsl-transpiler.ts';

// Create parser instance.
const gPgslParser: PgslParser = new PgslParser();

Deno.test('WebGPU - Compatibility', async () => {
    const lCodeText: string = `
        // ------------------------- Object Values ---------------------- //
        [GroupBinding("object", "transformation_matrix")]
        uniform transformationMatrix: Matrix44<float>;

        [GroupBinding("object", "instance_positions")]
        [AccessMode(AccessMode.Read)]
        storage instancePositions: Array<Vector4<float>>;
        // -------------------------------------------------------------- //


        // ------------------------- World Values ---------------------- //
        [GroupBinding("world", "view_projection_matrix")]
        uniform viewProjectionMatrix: Matrix44<float>;
        // -------------------------------------------------------------- //


        // ------------------------- User Inputs ------------------------ //
        [GroupBinding("user", "cube_texture_sampler")]
        uniform cubeTextureSampler: Sampler;

        [GroupBinding("user", "cube_texture") ]
        uniform cubeTexture: Texture2d<float>;
        // -------------------------------------------------------------- //

        const lightStrength: int = 23;

        // --------------------- Light calculations --------------------- //
        struct AmbientLight {
            color: Vector4<float>
        }

        [GroupBinding("world", "ambient_light")]
        uniform ambientLight: AmbientLight;

        struct PointLight {
            position: Vector4<float>,
            color: Vector4<float>,
            range: float
        }

        [GroupBinding("world", "point_lights")]
        [AccessMode(AccessMode.Read) ]
        storage pointLights: Array<PointLight>;

        /**
         * Calculate point light output.
         */
        function calculatePointLights(fragmentPosition: Vector4<float>, normal: Vector4<float>): Vector4<float> {
            // Count of point lights.
            const pointLightCount: uint = arrayLength(&pointLights);

            let lightResult: Vector4<float> = new Vector4<float>(0, 0, 0, 1);
            for (let index: uint = 0; index < pointLightCount; index++) {
                const pointLight: PointLight = pointLights[index];

                // Calculate light strength based on angle of incidence.
                let lightDirection: Vector4<float> = normalize(pointLight.position - fragmentPosition);
                let diffuse: float = max(dot(normal, lightDirection), 0.0);

                lightResult += pointLight.color * diffuse;
            }

            return lightResult;
        }

        /**
         * Apply lights to fragment color.
         */
        function applyLight(colorIn: Vector4<float>, fragmentPosition: Vector4<float>, normal: Vector4<float>): Vector4<float> {
            let lightColor: Vector4<float> = new Vector4<float>(0, 0, 0, 1);

            lightColor += ambientLight.color;
            lightColor += calculatePointLights(fragmentPosition, normal);

            return lightColor * colorIn;
        }
        // -------------------------------------------------------------- //

        struct VertexOut {
            position: Position,

            [Location("uv")]
            uv: Vector2<float>,

            [Location("normal")]
            normal: Vector4<float>,

            [Location("fragment_position")]
            fragmentPosition: Vector4<float>
        }

        struct VertexIn {
            instanceId : InstanceIndex,

            [Location("position")]
            position: Vector4<float>,

            [Location("uv")]
            uv: Vector2<float>,

            [Location("normal")]
            normal: Vector4<float>
        }

        [Vertex()]
        function vertex_main(vertex: VertexIn): VertexOut {
            const instancePosition: Vector4<float> = instancePositions[vertex.instanceId];
            const instancePositionMatrix: Matrix44<float> = new Matrix44(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, instancePosition.x * 5, instancePosition.y * 5, instancePosition.z * 5, 1);

            // Overrideable variable.
            let rewriteable: int = 1;
            rewriteable = 2;

            let out: VertexOut;
            out.position = viewProjectionMatrix * transformationMatrix * instancePositionMatrix * vertex.position;
            out.uv = vertex.uv;
            out.normal = vertex.normal;
            out.fragmentPosition = transformationMatrix * instancePositionMatrix * vertex.position;

            return out;
        }

        struct FragmentIn {
            [Location("uv")]
            uv: Vector2<float>,

            [Location("normal")]
            normal: Vector4<float>,

            [Location("fragment_position")]
            fragmentPosition: Vector4<float>
        }

        struct FragmentOut {
            [Location("buffer")]
            color: Vector4<float>
        }

        [Fragment()]
        function fragment_main(fragment: FragmentIn): FragmentOut {
            let out: FragmentOut;
            out.color = applyLight(textureSample(cubeTexture, cubeTextureSampler, fragment.uv), fragment.fragmentPosition, fragment.normal);
            
            return out;
        }
    `;

    // Setup. Transpile PGSL to WGSL.
    const lTranspilationResult: PgslParserResult = gPgslParser.transpile(lCodeText, new WgslTranspiler());

    expect(lTranspilationResult.incidents).toHaveLength(0);

    // Setup. Request WebGPU device.
    const lAdapter = await navigator.gpu.requestAdapter();
    const lDevice = await lAdapter?.requestDevice();
    if (!lDevice) {
        console.warn('WebGPU device not available, skipping test');
        return;
    }

    // Process. Create shader module with new error scope.
    lDevice.pushErrorScope('validation');
    lDevice.createShaderModule({
        code: lTranspilationResult.source
    });

    // Validate. Should produce no error.
    expect(await lDevice.popErrorScope()).toBeNull();
});