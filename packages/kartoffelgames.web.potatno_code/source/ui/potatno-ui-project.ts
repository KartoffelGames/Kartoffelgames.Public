import type { PotatnoProject } from '../project/potatno-project.ts';
import type { PotatnoProjectTypesDefinition } from '../project/potatno-project-types-definition.ts';

/**
 * Project shape accepted by UI components that read Potatno project metadata.
 *
 * A shared project-shape contract with no single owning class — every UI component that reads
 * project metadata widens the project to this alias, so it lives in its own file rather than
 * attached to one component.
 */
export type PotatnoUiProject = PotatnoProject<PotatnoProjectTypesDefinition<string>>;
