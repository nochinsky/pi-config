# Pi config

A portable, curated snapshot of my personal [Pi coding agent](https://github.com/earendil-works/pi) setup.

## What's here

- `agent/settings.json` — OpenAI model defaults, a small model allowlist, high thinking, and startup/UI preferences. Pi package references for web access and questions are unpinned, matching the live setup.
- `agent/web-search.json` — web-search provider preference.
- `agent/extensions/minimal-footer.ts` — compact footer showing location, branch, model, and context usage; toggle it with `/minimal-footer`.
- `agent/themes/minimal-dark.json` — muted dark theme.
- `agent/npm/package.json` and `package-lock.json` — npm dependency ranges and the exact resolved dependency tree.

## Install

Install Pi first. Preview the files in this repo, then back up your current Pi agent directory before copying the curated files over. The copy leaves files not present in this repo—such as your credentials and session history—untouched:

```bash
if [ -d "$HOME/.pi/agent" ]; then
  cp -a "$HOME/.pi/agent" "$HOME/.pi/agent.backup.$(date +%Y%m%d%H%M%S)"
fi
mkdir -p "$HOME/.pi/agent"
cp -a agent/. "$HOME/.pi/agent/"
```

Start Pi and use `/login` to authenticate on that machine. Authentication is not part of this repo.

## Privacy and updates

This repo intentionally contains only the six curated config/dependency files. Do **not** copy or commit the full `~/.pi/agent` directory: it can contain credentials, machine identity, session transcripts, trust decisions, caches, installed packages, and Pi binaries. Session files may include prompts, source code, command output, or exposed credentials.

The footer extension and third-party Pi packages execute with Pi's user permissions. The Pi package references are unpinned, so updates may install newer compatible versions; review package changes before accepting them. The npm lockfile records the exact resolved dependency tree. To update this backup from a machine, copy only the files listed above and inspect the diff before pushing.
