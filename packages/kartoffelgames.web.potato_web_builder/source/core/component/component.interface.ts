import { IUserProcessor } from '../user_entity/base-user-entity';

export interface ComponentProcessor extends IUserProcessor, Partial<IPwbOnDeconstruct>, Partial<IPwbAfterUpdate>, Partial<IPwbOnUpdate>, Partial<IPwbOnAttributeChange>, Partial<IPwbOnConnect>,Partial<IPwbOnDisconnect> {
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