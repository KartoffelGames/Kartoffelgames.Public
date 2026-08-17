import { serveDir } from 'jsr:@std/http@^1/file-server';
import { dirname, join } from 'jsr:@std/path@^1';

// Desktop client entry. `deno desktop` compiles this file into a native application whose webview is bound to the http
// server started below (Deno.serve auto-binds to the address the webview navigates to). The build copies the page
// directory next to the executable via this entry's "include" config, and this server serves it.
const lPageRoot: string = join(dirname(Deno.execPath()), 'page');

Deno.serve((pRequest: Request): Promise<Response> => {
    return serveDir(pRequest, { fsRoot: lPageRoot, quiet: true });
});
