# pi-config

A quiet setup for [Pi](https://github.com/earendil-works/pi): muted dark UI,
compact tools, OpenAI models, web access, and interactive questions.

## Configs

- [Settings](agent/settings.json) — models, packages, theme, and startup.
- [Extensions](agent/extensions/) — compact tool rows and footer.
- [Theme](agent/themes/minimal-dark.json) · [Instructions](agent/AGENTS.md)
- [Web search](agent/web-search.json) · [npm setup](agent/npm/)

## Setup

Tested with Pi 1.1.0. From this repo, back up your current setup and copy the config:

```bash
if [ -d "$HOME/.pi/agent" ]; then
  cp -a "$HOME/.pi/agent" "$HOME/.pi/agent.backup.$(date +%Y%m%d%H%M%S)"
fi
mkdir -p "$HOME/.pi/agent"
cp -a agent/. "$HOME/.pi/agent/"
(cd "$HOME/.pi/agent/npm" && npm ci)
```

Then start Pi and run `/login`. Existing credentials and sessions are left untouched.

> Extensions run with your user permissions; review them before installing. Package references
> are unpinned. Never copy your full `~/.pi/agent` back here: it can contain credentials and
> session history.
