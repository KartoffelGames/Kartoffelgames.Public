import { Component } from '../component/component';

export interface ComponentProcessor extends Partial<IPwbOnDeconstruct>, Partial<IPwbAfterUpdate>, Partial<IPwbOnUpdate>, Partial<IPwbOnAttributeChange>, Partial<IPwbOnConnect>,Partial<IPwbOnDisconnect> {
    /**
     * Exposure of component object.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    readonly __component__: Component;
}

export type ComponentProcessorConstructor = {
    new(...pParameter: Array<any>): ComponentProcessor;
};

export interface ComponentElement extends HTMLElement {
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

export interface IPwbOnConnect {
    onPwbConnect(): void;
}

export interface IPwbOnDisconnect {
    onPwbDisconnect(): void;
}

export interface IPwbOnAttributeChange {
    onPwbAttributeChange(pAttributeName: string): void;
}