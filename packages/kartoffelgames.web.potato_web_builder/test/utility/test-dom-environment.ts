// @deno-types="npm:@types/jsdom"
import { JSDOM, DOMWindow } from 'npm:jsdom';

const defaultHtml = '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>';

// define this here so that we only ever dynamically populate KEYS once.

const PATCH_SYMBOL = Symbol.for('PATCH_SYMBOL');
const KEYS: Array<string> = [];

export default function globalJsdom(html = defaultHtml, options = {}) {
	// Idempotency
	if (globalThis.navigator && globalThis.navigator.userAgent && globalThis.navigator.userAgent.includes('Node.js') && globalThis.document && (<any>globalThis.document).globalsPatched === PATCH_SYMBOL) {
		return;
	}

	// set a default url if we don't get one - otherwise things explode when we copy localstorage keys
	if (!('url' in options)) { Object.assign(options, { url: 'http://localhost:3000' }); }

	// enable pretendToBeVisual by default since react needs
	// window.requestAnimationFrame, see https://github.com/jsdom/jsdom#pretending-to-be-a-visual-browser
	if (!('pretendToBeVisual' in options)) { Object.assign(options, { pretendToBeVisual: true }); }

	const jsdom = new JSDOM(html, options);
	const { window } = jsdom;
	const { document } = window;

	// generate our list of keys by enumerating document.window - this list may vary
	// based on the jsdom version. filter out internal methods as well as anything
	// that node already defines

	if (KEYS.length === 0) {
		KEYS.push(...Object.getOwnPropertyNames(window).filter((k) => !k.startsWith('_') && !(k in globalThis)));
		// going to add our jsdom instance, see below
		KEYS.push('$jsdom');
	}
	// eslint-disable-next-line no-return-assign
	KEYS.forEach((key) => (<any>globalThis)[key] = window[key]);

	// setup document / window / window.console
	globalThis.document = document;
	globalThis.window = window as unknown as Window & typeof globalThis;
	window['console'] = globalThis.console;

	(<any>document).globalsPatched = PATCH_SYMBOL;
}

globalJsdom();

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