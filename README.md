# pi-config

My personal [Pi](https://pi.dev) setup: stock dark UI, OpenAI models, and a small
set of extensions for research, questions, task tracking, side questions, and
desktop/browser automation.

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
- [Communication preferences](agent/AGENTS.md) for direct, concise answers,
  clear recommendations, and honest uncertainty.

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
| [pi-computer-use](https://pi.dev/packages/@injaneity/pi-computer-use) | Desktop app and browser observation/control; `/computer-use` configuration |

Extensions run with your user permissions. Computer-use can inspect and interact
with apps and signed-in browser windows; review sensitive actions before allowing
them. Side questions make additional model calls.

### Computer-use setup

Computer-use is installed by default, with its upstream defaults: browser access
on, managed browser Chrome, and foreground fallback allowed (`headless: false`).
The npm manifest approves only this package's native helper install script,
including future releases, so modern npm can run setup without allowing every
dependency's scripts. No machine-specific paths, browser profiles, or permission
grants are stored here. Run `/computer-use` in Pi to inspect the effective
configuration and its source.

- **Windows:** run Pi in an interactive desktop session.
- **macOS 14+:** complete the helper setup, then grant Accessibility and Screen
  Recording permissions and recheck.
- **Linux:** run Pi in the target user's graphical session with AT-SPI2 available;
  native Wayland support is semantic-only.
- **Managed browser:** install Chrome or Helium separately if needed. The
  `launch_browser` tool creates a separate temporary profile, not your usual
  signed-in profile. Existing browser windows use desktop UI tools instead.

Optional global overrides belong in
`~/.pi/agent/extensions/pi-computer-use.json`; project overrides belong in
`.pi/computer-use.json`. Environment variables take precedence. See the package's
[configuration docs](https://github.com/injaneity/pi-computer-use/blob/main/docs/configuration.md)
for browser selection, executable overrides, and background-only mode.

This covers many interactive browser tasks, but is not a replacement for
Playwright's automated tests/assertions or reliable direct APIs. No existing
browser tools are removed by this config.

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

## Repository checks

Run `node scripts/check-config.mjs` after editing package declarations. CI runs
the same check to keep Pi settings, the npm manifest, and the snapshot lockfile
consistent. The lockfile is a reference snapshot, not an installation pin; fresh
installs still resolve current releases through Pi.
