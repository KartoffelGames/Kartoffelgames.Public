import { PgslParser } from "../source/parser/pgsl-parser.ts";
import { WgslTranspiler } from "../source/transpilation/wgsl/wgsl-transpiler.ts";

Deno.bench('Create parser instance', () => {
    new PgslParser();
});

Deno.bench('Minimal transpilation', () => {
    const lCodeText: string = `const a: float = 5.0;`;

    // Setup. Transpile PGSL to WGSL.
    new PgslParser().transpile(lCodeText, new WgslTranspiler());
});

Deno.bench("Full transpilation", () => {
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
    new PgslParser().transpile(lCodeText, new WgslTranspiler());
});