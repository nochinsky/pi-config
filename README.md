# pi-config

My personal [Pi](https://pi.dev) setup: stock dark UI, OpenAI models, and a small
set of extensions for research, questions, task tracking, and on-demand subagents.

## Install

Install Pi using its [official instructions](https://pi.dev), then give your
coding agent this prompt:

```text
Set up this Pi configuration for me: https://github.com/nochinsky/pi-config
Read README.md and INSTALL.md, inspect my existing setup, back up affected files,
and merge the config. Preserve credentials, sessions, and unrelated customizations.
Ask about unavailable models or conflicts.
```

Your agent needs file or web access and local command access. If it cannot fetch
the repo, clone it and ask it to follow [INSTALL.md](INSTALL.md). That guide also
works as a manual checklist.

## What's included

- Built-in dark theme, native tool rendering and status bar, and quiet startup.
- Visible thinking, OpenAI models with high/max thinking, and OpenAI web search.
- Project trust prompts enabled and install telemetry disabled.
- [Working preferences](agent/AGENTS.md) for inspecting, completing, and verifying
  requested work while preserving unrelated changes.

See [settings.json](agent/settings.json) for the exact defaults. Model choices
are personal preferences; choose alternatives if your account does not support
them. Authenticate locally through Pi's `/login`—no credentials belong here.

### Extensions

| Package | Purpose |
| --- | --- |
| [pi-web-access](https://www.npmjs.com/package/pi-web-access) | Web search and fetching |
| [rpiv-ask-user-question](https://www.npmjs.com/package/@juicesharp/rpiv-ask-user-question) | Interactive questions and previews |
| [rpiv-todo](https://www.npmjs.com/package/@juicesharp/rpiv-todo) | Task tracking and `/todos` |
| [rpiv-btw](https://www.npmjs.com/package/@juicesharp/rpiv-btw) | `/btw` side questions |
| [pi-subagents](https://www.npmjs.com/package/pi-subagents) | Explicitly requested delegation |

Extensions run with your user permissions. Side questions and subagents make
additional model calls.

## Updates

This config follows current releases, with unpinned extensions. Follow Pi's
update notifications:

```bash
pi update                 # Pi itself
pi update --extensions    # Extensions only
pi update --all           # Both
```

If another package manager manages Pi, use it to update Pi itself. Restart Pi
after updates; there is no background updater in this config.

Repo changes do not automatically sync to your installation. Ask your agent to
reapply them using [INSTALL.md](INSTALL.md).
