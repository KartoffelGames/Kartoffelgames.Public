// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';

var LIVING_KEYS = [
    'DOMException',
    'NamedNodeMap',
    'Attr',
    'Node',
    'Element',
    'DocumentFragment',
    'HTMLDocument',
    'Document',
    'CharacterData',
    'Comment',
    'DocumentType',
    'DOMImplementation',
    'ProcessingInstruction',
    'Image',
    'Text',
    'Event',
    'CustomEvent',
    'MessageEvent',
    'ErrorEvent',
    'HashChangeEvent',
    'PopStateEvent',
    'UIEvent',
    'MouseEvent',
    'KeyboardEvent',
    'TouchEvent',
    'ProgressEvent',
    'EventTarget',
    'Location',
    'History',
    'HTMLElement',
    'HTMLAnchorElement',
    'HTMLAppletElement',
    'HTMLAreaElement',
    'HTMLAudioElement',
    'HTMLBaseElement',
    'HTMLBodyElement',
    'HTMLBRElement',
    'HTMLButtonElement',
    'HTMLCanvasElement',
    'HTMLDataElement',
    'HTMLDataListElement',
    'HTMLDialogElement',
    'HTMLDirectoryElement',
    'HTMLDivElement',
    'HTMLDListElement',
    'HTMLEmbedElement',
    'HTMLFieldSetElement',
    'HTMLFontElement',
    'HTMLFormElement',
    'HTMLFrameElement',
    'HTMLFrameSetElement',
    'HTMLHeadingElement',
    'HTMLHeadElement',
    'HTMLHRElement',
    'HTMLHtmlElement',
    'HTMLIFrameElement',
    'HTMLImageElement',
    'HTMLInputElement',
    'HTMLLabelElement',
    'HTMLLegendElement',
    'HTMLLIElement',
    'HTMLLinkElement',
    'HTMLMapElement',
    'HTMLMediaElement',
    'HTMLMenuElement',
    'HTMLMetaElement',
    'HTMLMeterElement',
    'HTMLModElement',
    'HTMLObjectElement',
    'HTMLOListElement',
    'HTMLOptGroupElement',
    'HTMLOptionElement',
    'HTMLOutputElement',
    'HTMLParagraphElement',
    'HTMLParamElement',
    'HTMLPreElement',
    'HTMLProgressElement',
    'HTMLQuoteElement',
    'HTMLScriptElement',
    'HTMLSelectElement',
    'HTMLSourceElement',
    'HTMLSpanElement',
    'HTMLStyleElement',
    'HTMLTableCaptionElement',
    'HTMLTableCellElement',
    'HTMLTableColElement',
    'HTMLTableDataCellElement',
    'HTMLTableElement',
    'HTMLTableHeaderCellElement',
    'HTMLTimeElement',
    'HTMLTitleElement',
    'HTMLTableRowElement',
    'HTMLTableSectionElement',
    'HTMLTemplateElement',
    'HTMLTextAreaElement',
    'HTMLTrackElement',
    'HTMLUListElement',
    'HTMLUnknownElement',
    'HTMLVideoElement',
    'StyleSheet',
    'MediaList',
    'CSSStyleSheet',
    'CSSRule',
    'CSSStyleRule',
    'CSSMediaRule',
    'CSSImportRule',
    'CSSStyleDeclaration',
    'StyleSheetList',
    'XPathException',
    'XPathExpression',
    'XPathResult',
    'XPathEvaluator',
    'HTMLCollection',
    'NodeFilter',
    'NodeIterator',
    'NodeList',
    'Blob',
    'File',
    'FileList',
    'FormData',
    'XMLHttpRequest',
    'XMLHttpRequestEventTarget',
    'XMLHttpRequestUpload',
    'DOMTokenList',
    'URL'
];

var OTHER_KEYS = [
    'addEventListener',
    'alert',
    'atob',
    'blur',
    'btoa',
    /* 'clearInterval', */
    /* 'clearTimeout', */
    'close',
    'confirm',
    /* 'console', */
    'createPopup',
    'dispatchEvent',
    'document',
    'focus',
    'frames',
    'getComputedStyle',
    'history',
    'innerHeight',
    'innerWidth',
    'length',
    'location',
    'moveBy',
    'moveTo',
    'name',
    'navigator',
    'open',
    'outerHeight',
    'outerWidth',
    'pageXOffset',
    'pageYOffset',
    'parent',
    'postMessage',
    'print',
    'prompt',
    'removeEventListener',
    'resizeBy',
    'resizeTo',
    'screen',
    'screenLeft',
    'screenTop',
    'screenX',
    'screenY',
    'scroll',
    'scrollBy',
    'scrollLeft',
    'scrollTo',
    'scrollTop',
    'scrollX',
    'scrollY',
    'self',
    /* 'setInterval', */
    /* 'setTimeout', */
    'stop',
    /* 'toString', */
    'top',
    'window'
];

const KEYS = LIVING_KEYS.concat(OTHER_KEYS);

(() => {
    const html = '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>';

    // Idempotency
    if (globalThis.navigator && globalThis.navigator.userAgent && globalThis.navigator.userAgent.indexOf('Node.js') > -1 && globalThis.document && typeof (<any>globalThis.document).destroy === 'symbol') {
        return;
    }

    var document = new JSDOM(html, { pretendToBeVisual: true });
    var window = document.window;

    KEYS.forEach(function (key) {
        (<any>globalThis)[key] = window[key];
    });

    globalThis.document = window.document;
    (<any>globalThis).window = window;
    window['console'] = globalThis.console;
    (<any>document).destroy = Symbol('destroy');
})()


/**
 * // TODO: For later.
 */
/*
const globalDefaultTarget = (pGlobalThis: DOMWindow): InteractionZoneGlobalScopeTarget => {
    // Create default globalThis target.
    const lTarget = {
        target: pGlobalThis,
        patches: {
            promise: pGlobalThis.Promise?.name,
            eventTarget: pGlobalThis.EventTarget?.name,
            classes: new Array<string>(),
            functions: new Array<string>()
        }
    } satisfies InteractionZoneGlobalScopeTarget;

    // Add all asyncron functions.
    const lAsyncFunctionNames: Array<string | undefined> = [
        pGlobalThis.requestAnimationFrame?.name,
        pGlobalThis.setInterval?.name,
        pGlobalThis.setTimeout?.name
    ];
    lTarget.patches.functions.push(...lAsyncFunctionNames.filter(pClass => !!pClass) as Array<string>);

    // Add all global classes with events.
    const lDomClassNames: Array<string | undefined> = [
        pGlobalThis.XMLHttpRequestEventTarget?.name,
        pGlobalThis.XMLHttpRequest?.name,
        pGlobalThis.Document?.name,
        pGlobalThis.SVGElement?.name,
        pGlobalThis.Element?.name,
        pGlobalThis.HTMLElement?.name,
        pGlobalThis.HTMLMediaElement?.name,
        pGlobalThis.HTMLFrameSetElement?.name,
        pGlobalThis.HTMLBodyElement?.name,
        pGlobalThis.HTMLFrameElement?.name,
        pGlobalThis.HTMLIFrameElement?.name,
        pGlobalThis.HTMLMarqueeElement?.name,
        pGlobalThis.Worker?.name,
        pGlobalThis.IDBRequest?.name,
        pGlobalThis.IDBOpenDBRequest?.name,
        pGlobalThis.IDBDatabase?.name,
        pGlobalThis.IDBTransaction?.name,
        pGlobalThis.WebSocket?.name,
        pGlobalThis.FileReader?.name,
        pGlobalThis.Notification?.name,
        pGlobalThis.RTCPeerConnection?.name
    ];
    lTarget.patches.classes.push(...lDomClassNames.filter(pClass => !!pClass) as Array<string>);

    // Add all global classes with async callbacks.
    const lObserverClassNames: Array<string | undefined> = [
        pGlobalThis.ResizeObserver?.name,
        pGlobalThis.MutationObserver?.name,
        pGlobalThis.IntersectionObserver?.name
    ];
    lTarget.patches.classes.push(...lObserverClassNames.filter(pClass => !!pClass) as Array<string>);

    return lTarget;
};
*/