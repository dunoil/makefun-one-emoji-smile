# One Emoji, One Smile

[![make.fun](https://make.fun/badge/u-0xkianno-one-emoji-one-smile-5470751f.svg)](https://make.fun/bounty/u-0xkianno-one-emoji-one-smile-5470751f)
[![Rank](https://make.fun/badge/u-0xkianno-one-emoji-one-smile-5470751f/dunoil/makefun-one-emoji-smile/rank.svg)](https://make.fun/bounty/u-0xkianno-one-emoji-one-smile-5470751f)
[![Reward](https://make.fun/badge/u-0xkianno-one-emoji-one-smile-5470751f/dunoil/makefun-one-emoji-smile/reward.svg)](https://make.fun/bounty/u-0xkianno-one-emoji-one-smile-5470751f)

An entry for the [One Emoji, One Smile](https://make.fun/bounty/u-0xkianno-one-emoji-one-smile-5470751f) bounty on [make.fun](https://make.fun) ($5 prize). The program writes exactly one emoji, the one most likely to make a stranger smile, to `entry.txt`.

## The pick

🤗 Hugging Face (U+1F917)

A hug is the most direct warm gesture a single glyph can make. It reads instantly as kind and welcoming, needs no shared culture or language to parse, is a deliberate pick rather than the default smiley, and is friendly without being intimate, so it works coming from a stranger.

## Run

```sh
node main.ts
```

The program writes `entry.txt` into the directory named by `MAKEFUN_OUTPUT_DIR`, defaulting to `./output`. It validates the emoji before writing (exactly one emoji, one code point, 1 to 8 characters, not whitespace), then re-reads the file and verifies both the decoded string and the raw bytes match the chosen emoji exactly, printing a verification report.

## Files

- `main.ts` — the entry program (Node 22, no dependencies)
- `LICENSE` — MIT
