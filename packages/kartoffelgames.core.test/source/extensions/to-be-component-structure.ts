import { Dictionary } from '@kartoffelgames/core';
import type { InjectionConstructor } from '@kartoffelgames/core-dependency-injection';
import { expect } from '@std/expect';
import { DeepEqual } from './to-be-deep-equal.ts';

const gRecreateElementStructure = <T extends InjectionConstructor | ChildNodeStructure>(pExpectedStructure: T, pActualNode: Node): T => {
    // Check if structure or constructor.
    if (typeof pExpectedStructure === 'function') {
        return <T><InjectionConstructor>pActualNode.constructor;
    } else {
        // Structure.
        const lExpectedStructure: ChildNodeStructure = pExpectedStructure;

        // Create new structure.
        const lNewStructure: ChildNodeStructure = {
            node: <InjectionConstructor>pActualNode.constructor
        };

        // Recreate child list.
        if ('childs' in lExpectedStructure) {
            if (pActualNode instanceof Element) {
                if (lExpectedStructure.useShadowRoot) {
                    lNewStructure.childs = gRecreateComponentChildStructure(<ComponentStructure>lExpectedStructure.childs, <ShadowRoot>pActualNode.shadowRoot);
                } else {
                    lNewStructure.childs = gRecreateComponentChildStructure(<ComponentStructure>lExpectedStructure.childs, pActualNode);
                }
            } else {
                lNewStructure.childs = null;
            }
        }

        // Copy "useShadowRoot".
        if ('useShadowRoot' in lExpectedStructure) {
            lNewStructure.useShadowRoot = lExpectedStructure.useShadowRoot;
        }

        // Recreate attributes.
        if ('attributes' in lExpectedStructure) {
            if (pActualNode instanceof Element) {
                // Create empty attribute list.
                lNewStructure.attributes = new Array<{ name: string, value: string; } | null>();

                // Try to add all expected attributes.
                if (lExpectedStructure.attributes) {
                    for (const lAttribute of lExpectedStructure.attributes) {
                        if (lAttribute && pActualNode.hasAttribute(lAttribute.name)) {
                            lNewStructure.attributes.push({
                                name: lAttribute.name,
                                value: <string>pActualNode.getAttribute(lAttribute.name)
                            });
                        } else {
                            lNewStructure.attributes.push(null);
                        }
                    }
                }

            } else {
                lNewStructure.attributes = null;
            }
        }

        // Recreate text content.
        if ('textContent' in lExpectedStructure) {
            lNewStructure.textContent = <string>pActualNode.textContent;
        }

        return <T>lNewStructure;
    }
};

const gRecreateComponentChildStructure = (pExpectedStructure: ComponentStructure, pActualElement: Element | ShadowRoot): ComponentStructure => {
    const lRecreatedStructureList: ComponentStructure = new Array<InjectionConstructor | ChildNodeStructure>();

    // Get max length of expected or actual childs.
    const lMaxChildCount: number = Math.max(pExpectedStructure.length, pActualElement.childNodes.length);

    // For each possible child.
    for (let lIndex: number = 0; lIndex < lMaxChildCount; lIndex++) {
        const lExpectedChild: InjectionConstructor | ChildNodeStructure | null = pExpectedStructure[lIndex] ?? null;
        const lActualChild: Node | null = pActualElement.childNodes[lIndex] ?? null;

        // Kepp null values.
        if (lExpectedChild === null || lActualChild === null) {
            lRecreatedStructureList.push(null);
        } else {
            // Try to recreate component structure.
            lRecreatedStructureList.push(gRecreateElementStructure(lExpectedChild, lActualChild));
        }
    }

    return lRecreatedStructureList;
};


// Extend expect with deepEqual.
expect.extend({
    toBeComponentStructure(pContext, pStructure: ComponentStructure, pUseShadowRoot: boolean) {
        // Cant compare none 
        if (!(pContext.value instanceof Element)) {
            // Must fail even when test is negated.
            return { message: () => `Expected value to be an html element.`, pass: false !== pContext.isNot };
        }

        let lActualStructure: ComponentStructure;
        if (pUseShadowRoot) {
            lActualStructure = gRecreateComponentChildStructure(pStructure, pContext.value.shadowRoot!);
        } else {
            lActualStructure = gRecreateComponentChildStructure(pStructure, pContext.value);
        }

        const [lCheckPassed, lMessage] = DeepEqual('[ROOT]', pStructure, lActualStructure, new Dictionary<object, object>());

        return { message: () => lMessage, pass: lCheckPassed };
    }
});

export type ComponentStructure = Array<InjectionConstructor | ChildNodeStructure | null>;

export type ChildNodeStructure = {
    node: InjectionConstructor | null,
    useShadowRoot?: boolean;
    childs?: ComponentStructure | null;
    attributes?: Array<{ name: string, value: string; } | null> | null;
    textContent?: string;
};