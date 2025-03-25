import { XmlParser as NewXmlParser } from "../source/index.ts";
import { XmlParser as OldXmlParser} from "npm:@kartoffelgames/core.xml@0.2.1"

// Load xml files.
const gNormal: string = new TextDecoder("utf-8").decode(Deno.readFileSync(import.meta.dirname + "/basic-structure.xml"));
const gComplex: string = new TextDecoder("utf-8").decode(Deno.readFileSync(import.meta.dirname + "/complex-nested.xml"));
// const gLarge: string = new TextDecoder("utf-8").decode(Deno.readFileSync(import.meta.dirname + "/large-dataset.xml"));

Deno.bench("Normal - Cold - NEW", { group: "normal-cold", baseline: true }, () => {
    const lXmlParser = new NewXmlParser();
    lXmlParser.parse(gNormal);
});
Deno.bench("Normal - Cold - OLD", { group: "normal-cold", baseline: true }, () => {
    const lXmlParser = new OldXmlParser();
    lXmlParser.parse(gNormal);
});

Deno.bench("Complex - Cold - NEW", { group: "complex-cold", baseline: true }, () => {
    const lXmlParser = new NewXmlParser();
    lXmlParser.parse(gComplex);
});
Deno.bench("Complex - Cold - OLD", { group: "complex-cold", baseline: true }, () => {
    const lXmlParser = new OldXmlParser();
    lXmlParser.parse(gComplex);
});

const gOldParser = new OldXmlParser();
const gNewParser = new NewXmlParser();

Deno.bench("Normal - Warm - NEW", { group: "normal-warm", baseline: true }, () => {
    gNewParser.parse(gNormal);
});
Deno.bench("Normal - Warm - OLD", { group: "normal-warm", baseline: true }, () => {
    gOldParser.parse(gNormal);
});

Deno.bench("Complex - Warm - NEW", { group: "complex-warm", baseline: true }, () => {
    gNewParser.parse(gComplex);
});
Deno.bench("Complex - Warm - OLD", { group: "complex-warm", baseline: true }, () => {
    gOldParser.parse(gComplex);
});


// Deno.bench("Large - Cold - NEW", { group: "large", baseline: true, n: 2  }, () => {
//     const lXmlParser = new NewXmlParser();
//     lXmlParser.parse(gLarge);
// });