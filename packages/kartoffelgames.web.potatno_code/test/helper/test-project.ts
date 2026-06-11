import { PotatnoTestProjectGlobalMultiplierVariable } from './potatno_test_project/potatno-test-project-global-multiplier-variable.ts';
import { PotatnoTestProject } from './potatno_test_project/potatno-test-project.ts';

/**
 * Name of the function-scoped variable used to carry the runtime multiplier.
 * Exposed so tests can grep for the symbol in generated code without
 * hard-coding the literal string at multiple call sites.
 */
export const TestProjectGlobalMultiplierVariable: string = PotatnoTestProjectGlobalMultiplierVariable;

/**
 * Test project definition for the PotatnoCode test suite.
 */
export const TestProject = new PotatnoTestProject();

export { PotatnoTestProject };
