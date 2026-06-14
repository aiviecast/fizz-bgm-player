# fizz-bgm-player

Fizz の **BGM プレイリスト・ナビ**(§8 Overlay)。現在の曲 index と曲数から、次/前/
シャッフルの曲 index を決める。

openaituber は現状 1 曲を選んで loop だが、複数曲管理(次へ/前へ/ラップ/シャッフル)を
index ベースで実装したのがこの部品。Audio 再生や曲名⇔file 対応はブラウザ、ナビの
ポリシーは Almide。曲リストは呼び出し側が持ち、ここは **index だけ**扱う(文字列を
跨がない = wasm でも安全)。

## API

`next(cur, count, wrap)` / `prev(cur, count, wrap)` / `shuffle_next(cur, count, rand01)` /
`clamp(idx, count)`。曲無し(count=0)は `-1`。シャッフルの乱数 `rand01` は呼び出し側が注入。

## native

```sh
almide build src/main.almd -o build/fizz-bgm-player
./build/fizz-bgm-player
# {"next_wrap":0,"next_nowrap":2,"prev_wrap":2,...}
```

## wasm

```sh
almide build src/bridge.almd --target wasm -o build/bgm.wasm
```

すべて Float 授受。グルー例 [`browser/bgm-driver.js`](./browser/bgm-driver.js)
(曲リストを渡し、`Math.random()` を shuffle に注入)。CI で wasm↔native 一致を検証。

ツールチェーン: [almide](https://github.com/almide/almide) v0.27.6+。依存なし。
