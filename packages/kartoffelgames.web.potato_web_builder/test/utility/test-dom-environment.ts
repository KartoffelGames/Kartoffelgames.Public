// @deno-types="npm:@types/jsdom"
import { JSDOM } from 'npm:jsdom';

(() => {
	const lJsDom = new JSDOM('<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>', { pretendToBeVisual: true, url: 'http://localhost:3000' });
	const lWindow = lJsDom.window;
	const lDocument = lWindow.document;

	const lKeyList: Array<string> = [...Object.getOwnPropertyNames(lWindow).filter((pKey) => !pKey.startsWith('_') && !(pKey in globalThis))];
	for (const lKey of lKeyList) {
		(<any>globalThis)[lKey] = lWindow[lKey];
	}

	// setup document / window / window.console
	globalThis.document = lDocument;
	globalThis.window = lWindow as unknown as Window & typeof globalThis;
	lWindow['console'] = globalThis.console;
})();