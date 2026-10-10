# Pi config

My personal [Pi coding agent](https://github.com/earendil-works/pi) setup: a minimal dark UI, OpenAI models, web access, and interactive questions.

## What's included

- **Model defaults** — OpenAI models with high thinking.
- **Minimal UI** — muted dark theme, quiet startup, and hidden thinking blocks.
- **Compact footer** — location, branch, model, and context usage. Toggle with `/minimal-footer`.
- **Tools** — [`pi-web-access`](https://www.npmjs.com/package/pi-web-access) and [`pi-questions`](https://www.npmjs.com/package/pi-questions).

Config files live in `agent/`, alongside the footer extension, theme, and npm lockfile.

## Setup

Install [Pi](https://github.com/earendil-works/pi#getting-started) first. Review the config, then run these commands from this repo to back up your current setup and copy the files:

```bash
if [ -d "$HOME/.pi/agent" ]; then
  cp -a "$HOME/.pi/agent" "$HOME/.pi/agent.backup.$(date +%Y%m%d%H%M%S)"
fi
mkdir -p "$HOME/.pi/agent"
cp -a agent/. "$HOME/.pi/agent/"
```

Start Pi and use `/login` to authenticate. Existing credentials and sessions are left untouched.

## Notes

Only copy these config files back into the repo—not your whole `~/.pi/agent` directory, which may contain secrets and session history. Extensions run with your user permissions. Pi package references are unpinned; review updates before applying them.
