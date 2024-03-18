import { ComponentManager } from '../component/component-manager';

/**
 * ComponentManager reference.
 * Acts as injection reference but the actual ComponentManager should be injected instead.
 * 
 * Should never be initialized.
 */
export class ComponentManagerReference extends ComponentManager { }