import { Exception } from '@kartoffelgames/core';
import { Injection } from '@kartoffelgames/core-dependency-injection';
import { Component, PwbComponent, PwbExport, type IComponentOnDeconstruct } from '@kartoffelgames/web-potato-web-builder';
import type { PotatnoDocumentPort } from '../../../document/potatno-document-port.ts';
import type { PotatnoPortDefinitionDirection, PotatnoPortDefinitionType } from '../../../project/potatno-port-definition.ts';
import type { PotatnoProjectTypesDefinition } from '../../../project/potatno-project-types-definition.ts';
import { PotatnoCodeUiManagerChangeType, PotatnoUiManager, type PotatnoCodeUiManagerUnsubscribe } from '../../manager/potatno-ui-manager.ts';
import handleCss from './potatno-port-handle-component.css' with { type: 'text' };
import handleTemplate from './potatno-port-handle-component.html' with { type: 'text' };

/**
 * Shared port handle for the potatno-code visual editor.
 * Renders the flow/value handle including its connection animation.
 * Derives its color, port type, direction and error state from the assigned "port";
 * the connection state is controlled from the outside through "connected".
 *
 * Exported attributes:
 *  - "port": The domain port the handle represents.
 *  - "connected": Whether the handle renders (and animates into) its connected state.
 */
@PwbComponent({
    selector: 'potatno-port-handle',
    template: handleTemplate,
    style: handleCss,
})
export class PotatnoPortHandleComponent implements IComponentOnDeconstruct {
    private readonly mComponent: Component;
    private mConnected: boolean;
    private readonly mManager: PotatnoUiManager;
    private mPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition> | null;
    private readonly mUnsubscribe: PotatnoCodeUiManagerUnsubscribe;

    /**
     * Connection state of the handle. Controlled from the outside.
     */
    @PwbExport()
    public get connected(): boolean {
        return this.mConnected;
    } set connected(pConnected: unknown) {
        this.mConnected = this.parseBoolean(pConnected);

        // Only render once a port is available.
        if (this.mPort) {
            this.mComponent.updater.updateAsync();
        }
    }

    /**
     * Whether the port currently has a validation error.
     */
    public get hasError(): boolean {
        return this.mManager.integrity.errorItems.has(this.port);
    }

    /**
     * Whether a port has been assigned. Guards the template before the first port is set.
     */
    public get hasPort(): boolean {
        return this.mPort !== null;
    }

    /**
     * The domain port object to render.
     */
    @PwbExport()
    public get port(): PotatnoDocumentPort<PotatnoProjectTypesDefinition> {
        if (!this.mPort) {
            throw new Exception('Port is not setup', this);
        }

        return this.mPort;
    } set port(pPort: PotatnoDocumentPort<PotatnoProjectTypesDefinition>) {
        // Skip reassigning the same port.
        if (this.mPort === pPort) {
            return;
        }
        
        this.mPort = pPort;

        // Manually update. Synchron.
        this.mComponent.updater.update();
    }

    /**
     * Computed color for the port handle.
     * Flow ports use the primary text color; value ports use a type-derived hue.
     */
    public get portColor(): string {
        // Color for flow ports.
        if (this.port.portType === 'flow') {
            return 'var(--potatno-color-text)';
        }

        return this.mManager.generateStringColor(this.port.resolvedDataType);
    }

    /**
     * Port direction. Drives the handle orientation and slide-out direction.
     */
    public get portDirection(): PotatnoPortDefinitionDirection {
        return this.port.direction ?? 'output';
    }

    /**
     * Port type. Selects the flow or value handle shape.
     */
    public get portType(): PotatnoPortDefinitionType {
        return this.port.portType;
    }

    /**
     * Create the port handle component.
     *
     * @param pComponent - Injected component reference, used to trigger self-updates.
     * @param pManager - Injected shared UI manager singleton.
     */
    public constructor(pComponent: Component = Injection.use(Component), pManager: PotatnoUiManager = Injection.use(PotatnoUiManager)) {
        this.mComponent = pComponent;
        this.mManager = pManager;
        this.mPort = null;
        this.mConnected = false;

        // Refresh on connection or validation changes, as the resolved type color and error state can change.
        this.mUnsubscribe = this.mManager.subscribe(PotatnoCodeUiManagerChangeType.Connection | PotatnoCodeUiManagerChangeType.SpecialValidation, () => {
            this.mComponent.updater.updateAsync();
        });
    }

    /**
     * Detach the manager subscription.
     */
    public onDeconstruct(): void {
        this.mUnsubscribe();
    }

    /**
     * Parse an unknown (possibly string attribute) value into a boolean.
     *
     * @param pValue - Value to parse.
     *
     * @returns a boolean.
     */
    private parseBoolean(pValue: unknown): boolean {
        // A string attribute might be the literal "true" or "false".
        if (typeof pValue === 'string') {
            // Empty strings are considered as true also. Because setting a empty attribute also is "true".
            if (pValue === '') {
                return true;
            }

            // Check for a string with the literal true or false string.
            const lValue: string = pValue.toLowerCase();
            if (lValue === 'true' || lValue === 'false') {
                return lValue === 'true';
            }
        }

        return Boolean(pValue);
    }
}
