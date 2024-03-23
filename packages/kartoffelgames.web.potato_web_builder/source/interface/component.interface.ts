import { BaseXmlNode } from '@kartoffelgames/core.xml';
import { Component } from '../component/component';

export interface ComponentProcessor extends Partial<IPwbOnInit>, Partial<IPwbAfterInit>, Partial<IPwbOnDeconstruct>, Partial<IPwbSlotAssign>, Partial<IPwbAfterUpdate>, Partial<IPwbOnUpdate>, Partial<IPwbOnAttributeChange> {
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
    /**
     * Exposure of component object.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    readonly __component__: Component;
}

export interface IPwbSlotAssign { // TODO: How to get rid of this (assignSlotContent)
    assignSlotContent(pTemplate: BaseXmlNode): string;
}

export interface IPwbOnInit {
    onPwbInitialize(): void;
}

export interface IPwbOnDeconstruct {
    onPwbDeconstruct(): void;
}

export interface IPwbAfterInit {
    afterPwbInitialize(): void;
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