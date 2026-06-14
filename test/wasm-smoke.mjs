import { readFileSync } from "node:fs";
const mod = await WebAssembly.compile(readFileSync(new URL("../build/bgm.wasm", import.meta.url)));
const imports = {}; for (const i of WebAssembly.Module.imports(mod)) (imports[i.module] ??= {})[i.name] = () => 0;
const { exports: ex } = await WebAssembly.instantiate(mod, imports); try { ex._start(); } catch {}
let ok = true; const ck = (g, w, m) => { if (g !== w) { console.error(`FAIL ${m}: ${g}!=${w}`); ok = false; } };
ck(ex.next(2, 3, 1), 0, "next wrap"); ck(ex.next(2, 3, 0), 2, "next hold"); ck(ex.prev(0, 3, 1), 2, "prev wrap");
ck(ex.clamp(9, 3), 2, "clamp"); ck(ex.next(0, 0, 1), -1, "empty");
if (ex.shuffle_next(0, 3, 0.5) === 0) { console.error("FAIL shuffle same"); ok = false; }
console.log(ok ? "wasm OK — playlist nav matches native" : "FAIL"); if (!ok) process.exit(1);
