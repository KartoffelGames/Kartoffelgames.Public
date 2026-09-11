/**
 * Every benchmark input of the benchmark language.
 *
 * The medium input is one realistic module. The full input is the same module repeated with
 * renamed declarations. Shapes that are pathological for a top down parser are generated
 * separately, so they can be measured as their own benchmark entries.
 * Keeping every input in one place makes the three benchmark files differ in their input only.
 */
export class BenchmarkSource {
    /**
     * Smallest input that still produces a complete document.
     */
    public static readonly SMALL: string = `
// Smallest complete module.
module tiny;

const gravity: float = 9.81;

function halve(value: float): float {
    return value * 0.5;
}
`;

    /**
     * Header of every generated document. Declared once, no matter how often the unit is repeated.
     */
    private static readonly HEADER: string = `
// ---------------------------------------------------------------------------
// Particle simulation written in the benchmark language.
// ---------------------------------------------------------------------------
module simulation;

import "std/math" as Math;
import "std/collection" as Collection;

alias Scalar = float;
alias ParticleList = List<Particle>;
alias ParticleLookup = Map<Text, List<Particle>>;
`;

    /**
     * Template of one realistic module. Every declared name contains the suffix placeholder.
     */
    private static readonly UNIT_TEMPLATE: string = `
// ---------------------------------------------------------------------------
// Particle state and data records.
// ---------------------------------------------------------------------------

enum ParticleState__N__ {
    Spawning = 0,
    Alive = 1,
    Fading = 2,
    Dead = 3
}

@layout("packed")
record Vector3__N__ {
    x: float,
    y: float,
    z: float
}

@layout("packed")
@alignment(16)
record Particle__N__ {
    position: Vector3__N__,
    velocity: Vector3__N__,
    @hint("srgb")
    color: Vector4,
    lifetime: float,
    seed: uint,
    state: int
}

record Emitter__N__ {
    origin: Vector3__N__,
    spread: float,
    rate: float,
    seed: uint,
    particles: List<Particle__N__>,
    lookup: Map<Text, int>
}

const GRAVITY__N__: float = 9.81;
const MAX_PARTICLES__N__: int = 4096;
const DAMPING__N__: Vector3__N__ = new Vector3__N__(0.98, 0.98, 0.98);
const LABELS__N__: List<Text> = new List<Text>("spawning", "alive", "fading", "dead");

/*
 * Vector helpers.
 */

function addVector__N__(left: Vector3__N__, right: Vector3__N__): Vector3__N__ {
    return new Vector3__N__(left.x + right.x, left.y + right.y, left.z + right.z);
}

function scaleVector__N__(source: Vector3__N__, factor: float): Vector3__N__ {
    return new Vector3__N__(source.x * factor, source.y * factor, source.z * factor);
}

function lengthOf__N__(source: Vector3__N__): float {
    // Squared length before the root.
    const squared: float = source.x * source.x + source.y * source.y + source.z * source.z;
    return Math.sqrt(squared);
}

function normalize__N__(source: Vector3__N__): Vector3__N__ {
    const length: float = lengthOf__N__(source);

    if (length <= 0.0) {
        return new Vector3__N__(0.0, 0.0, 0.0);
    }

    return scaleVector__N__(source, 1.0 / length);
}

function clampScalar__N__(value: float, lower: float, upper: float): float {
    return Math.clamp<float>(value, lower, upper);
}

/*
 * Simulation.
 */

function integrate__N__(particle: Particle__N__, delta: float): Particle__N__ {
    // Gravity only affects the vertical velocity.
    particle.velocity.y -= GRAVITY__N__ * delta;

    particle.velocity.x *= DAMPING__N__.x;
    particle.velocity.y *= DAMPING__N__.y;
    particle.velocity.z *= DAMPING__N__.z;

    particle.position.x += particle.velocity.x * delta;
    particle.position.y += particle.velocity.y * delta;
    particle.position.z += particle.velocity.z * delta;

    particle.lifetime -= delta;

    if (particle.lifetime <= 0.0) {
        particle.state = ParticleState__N__.Dead;
    } else if (particle.lifetime < 0.25) {
        particle.state = ParticleState__N__.Fading;
    } else {
        particle.state = ParticleState__N__.Alive;
    }

    return particle;
}

function respawn__N__(emitter: Emitter__N__, particle: Particle__N__): Particle__N__ {
    /* Reset the particle back to the emitter origin. */
    particle.position = emitter.origin;
    particle.velocity = normalize__N__(new Vector3__N__(Math.random(emitter.seed), 1.0, Math.random(emitter.seed)));
    particle.lifetime = 1.0 + emitter.spread * 0.5;
    particle.color = new Vector4(1.0, 1.0, 1.0, 1.0);
    particle.state = ParticleState__N__.Spawning;

    return particle;
}

function simulate__N__(emitter: Emitter__N__, delta: float, steps: int): int {
    let alive: int = 0;
    let index: int = 0;

    for (let step: int = 0; step < steps; step++) {
        index = 0;

        while (index < emitter.particles.count) {
            let current: Particle__N__ = emitter.particles[index];
            current = integrate__N__(current, delta);

            if (current.state == ParticleState__N__.Dead) {
                emitter.particles[index] = respawn__N__(emitter, current);
            } else {
                alive += 1;
            }

            index++;
        }
    }

    return alive;
}

function collide__N__(emitter: Emitter__N__, floor: float): int {
    let hits: int = 0;

    for (let index: int = 0; index < emitter.particles.count; index++) {
        const particle: Particle__N__ = emitter.particles[index];

        if (particle.position.y > floor) {
            continue;
        }

        if (particle.state == ParticleState__N__.Dead) {
            break;
        }

        {
            // Nested block keeps the bounce math out of the outer scope.
            const bounce: float = clampScalar__N__(-particle.velocity.y * 0.6, 0.0, 12.0);
            particle.velocity.y = bounce;
            particle.position.y = floor;
        }

        hits++;
    }

    return hits;
}

function classify__N__(particle: Particle__N__): Text {
    const fading: bool = (particle.state == ParticleState__N__.Fading) || (particle.lifetime < 0.1);
    const dead: bool = (particle.state == ParticleState__N__.Dead) && !fading;

    if (dead) {
        return LABELS__N__[3];
    }

    return fading ? LABELS__N__[2] : LABELS__N__[1];
}

function summarize__N__(emitter: Emitter__N__): Text {
    let report: Text = "";
    let index: int = 0;

    while (index < emitter.particles.count) {
        const particle: Particle__N__ = emitter.particles[index];
        report += classify__N__(particle);
        index++;
    }

    if (report == "") {
        return "empty";
    }

    return report;
}

function rebuildLookup__N__(emitter: Emitter__N__): Map<Text, int> {
    const lookup: Map<Text, int> = new Map<Text, int>();

    for (let index: int = 0; index < emitter.particles.count; index++) {
        const label: Text = classify__N__(emitter.particles[index]);
        const previous: int = lookup[label];
        lookup[label] = previous + 1;
    }

    emitter.lookup = lookup;

    return lookup;
}
`;

    /**
     * Everyday sized input. One realistic module of the benchmark language.
     */
    public static get medium(): string {
        return BenchmarkSource.HEADER + BenchmarkSource.unit('');
    }

    /**
     * Input that exceeds everyday usage.
     * The realistic module is repeated with renamed declarations.
     *
     * The pathological shapes are deliberately not part of this document. They are measured
     * as their own benchmark entries, so a single shape can not hide inside one total.
     *
     * @param pUnitCount - How often the realistic module is repeated.
     *
     * @returns Full sized benchmark input.
     */
    public static full(pUnitCount: number): string {
        const lCodePartList: Array<string> = new Array<string>();

        // Header and the repeated realistic module.
        lCodePartList.push(BenchmarkSource.HEADER);
        for (let lUnitIndex: number = 0; lUnitIndex < pUnitCount; lUnitIndex++) {
            lCodePartList.push(BenchmarkSource.unit(lUnitIndex === 0 ? '' : `${lUnitIndex}`));
        }

        return lCodePartList.join('\n');
    }

    /**
     * Statements that only succeed on a late branch alternative.
     * Every statement first fails as a call statement and as an increment statement
     * before it is accepted as an assignment statement.
     *
     * @param pStatementCount - Count of statements in the function body.
     *
     * @returns Code of the stress declaration.
     */
    public static stressBacktracking(pStatementCount: number): string {
        const lStatementList: Array<string> = new Array<string>();
        for (let lStatementIndex: number = 0; lStatementIndex < pStatementCount; lStatementIndex++) {
            lStatementList.push(`    alpha.beta.gamma[${lStatementIndex}].delta = Math.mix(alpha.beta.gamma[${lStatementIndex}].epsilon, alpha.beta.zeta, 0.5);`);
        }

        return `
// Stress: ${pStatementCount} statements that are only accepted by a late branch alternative.
function stressBacktracking(alpha: Container): void {
${lStatementList.join('\n')}
}
`;
    }

    /**
     * Nested parentheses.
     *
     * Every nesting level makes the expression graph try each of its combining alternatives
     * again, so the cost of this shape grows by a factor of ten per level with the current
     * parser. The depth used by the benchmark is small on purpose.
     *
     * @param pDepth - Nesting depth.
     *
     * @returns Code of the stress declaration.
     */
    public static stressDeepNesting(pDepth: number): string {
        const lOpening: string = '('.repeat(pDepth);
        const lClosing: string = ')'.repeat(pDepth);

        return `
// Stress: ${pDepth} levels of nested parentheses.
const stressDeepNesting: float = ${lOpening}1.0 + 2.0${lClosing};
`;
    }

    /**
     * A single expression built from many operands.
     * Every operand adds one level of right recursion to the expression graph.
     *
     * @param pOperandCount - Count of operands in the chain.
     *
     * @returns Code of the stress declaration.
     */
    public static stressLongChain(pOperandCount: number): string {
        const lOperandList: Array<string> = new Array<string>();
        for (let lOperandIndex: number = 0; lOperandIndex < pOperandCount; lOperandIndex++) {
            lOperandList.push(`${lOperandIndex}`);
        }

        return `
// Stress: expression with ${pOperandCount} operands.
const stressLongChain: int = ${lOperandList.join(' + ')};
`;
    }

    /**
     * A single call with many parameters.
     * Grows the recursive expression list graph in one direction only.
     *
     * @param pParameterCount - Count of call parameters.
     *
     * @returns Code of the stress declaration.
     */
    public static stressWideCall(pParameterCount: number): string {
        const lParameterList: Array<string> = new Array<string>();
        for (let lParameterIndex: number = 0; lParameterIndex < pParameterCount; lParameterIndex++) {
            lParameterList.push(`${lParameterIndex}.5`);
        }

        return `
// Stress: call with ${pParameterCount} parameters.
function stressWideCall(): void {
    Collection.combine(${lParameterList.join(', ')});
}
`;
    }

    /**
     * A single record with many properties.
     * Grows the recursive property list graph in one direction only.
     *
     * @param pPropertyCount - Count of record properties.
     *
     * @returns Code of the stress declaration.
     */
    public static stressWideRecord(pPropertyCount: number): string {
        const lPropertyList: Array<string> = new Array<string>();
        for (let lPropertyIndex: number = 0; lPropertyIndex < pPropertyCount; lPropertyIndex++) {
            lPropertyList.push(`    field${lPropertyIndex}: float`);
        }

        return `
// Stress: record with ${pPropertyCount} properties.
record StressWideRecord {
${lPropertyList.join(',\n')}
}
`;
    }

    /**
     * One realistic module of the benchmark language.
     * Every declared name carries the suffix, so the unit can be repeated inside one document.
     *
     * @param pSuffix - Suffix appended to every declared name.
     *
     * @returns Code of one realistic module.
     */
    public static unit(pSuffix: string): string {
        return BenchmarkSource.UNIT_TEMPLATE.replaceAll('__N__', pSuffix);
    }

}
