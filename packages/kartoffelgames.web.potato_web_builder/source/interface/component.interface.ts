import { Component } from '../component/component';

export interface ComponentProcessor extends Partial<IPwbOnDeconstruct>, Partial<IPwbAfterUpdate>, Partial<IPwbOnUpdate>, Partial<IPwbOnAttributeChange> {
    /**
     * Exposure of component object.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    readonly __component__: Component;
}

export type ComponentProcessorConstructor = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    readonly __component_selector__: string;

    new(...pParameter: Array<any>): ComponentProcessor;
};

export interface ComponentElement extends HTMLElement {
    /**
     * Exposure of component object.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    readonly __component__: Component;
}

export interface IPwbOnDeconstruct {
    onPwbDeconstruct(): void;
}

export interface IPwbAfterUpdate {
    afterPwbUpdate(): void;
}

export interface IPwbOnUpdate {
    onPwbUpdate(): void;
}

export interface IPwbOnAttributeChange {
    onPwbAttributeChange(pAttributeName: string): void;
}