import { BaseXmlNode } from '@kartoffelgames/core.xml';

export interface ComponentProcessor extends Partial<IPwbOnInit>, Partial<IPwbAfterInit>, Partial<IPwbOnDeconstruct>, Partial<IPwbSlotAssign>, Partial<IPwbAfterUpdate>, Partial<IPwbOnUpdate>, Partial<IPwbOnAttributeChange> { }

export type ComponentProcessorConstructor = {
    new(...pParameter: Array<any>): ComponentProcessor;
};

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