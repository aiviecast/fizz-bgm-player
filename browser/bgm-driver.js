// bgm-driver.js — BGM プレイリスト制御のグルー例。ナビ=Almide(wasm)、Audio=JS。
export async function loadBgm(wasmUrl, tracks) {
  const bytes = await (await fetch(wasmUrl)).arrayBuffer();
  const mod = await WebAssembly.compile(bytes);
  const imports = {}; for (const i of WebAssembly.Module.imports(mod)) (imports[i.module] ??= {})[i.name] = () => 0;
  const { exports: ex } = await WebAssembly.instantiate(mod, imports); try { ex._start(); } catch {}
  let cur = 0;
  const n = tracks.length;
  return {
    current() { return tracks[ex.clamp(cur, n)]; },
    next(wrap = true) { cur = ex.next(cur, n, wrap ? 1 : 0); return tracks[cur]; },
    prev(wrap = true) { cur = ex.prev(cur, n, wrap ? 1 : 0); return tracks[cur]; },
    shuffle() { cur = ex.shuffle_next(cur, n, Math.random()); return tracks[cur]; },
  };
}
