# pi-config

My personal [Pi](https://github.com/earendil-works/pi) setup: stock dark UI,
OpenAI models, web access, interactive questions, task tracking, side questions,
and on-demand subagents. This config follows current Pi and extension releases,
not a fixed Pi version.

## Install with your coding agent

**The main way to install this config is to hand it to a coding agent.** Use a
harness that can read files or fetch URLs and run commands on your machine.

Paste this into your agent:

```text
Set up this Pi configuration for me: https://github.com/nochinsky/pi-config
Read its README and INSTALL.md, inspect my existing Pi setup, then install it
following that guide. Back up affected files, preserve my credentials, sessions,
and unrelated customizations, and ask about unavailable models or conflicts.
```

Or clone it and open your agent in the checkout:

```bash
git clone https://github.com/nochinsky/pi-config.git
cd pi-config
```

Then ask: **“Read INSTALL.md and set up this Pi config for me.”**

The [agent installation guide](INSTALL.md) covers prerequisites, safe merging,
model selection, extension installation, and verification. A URL by itself is not
an executable installer: your agent needs your setup request and local command
access. If it cannot browse GitHub, give it the clone or the
[raw guide](https://raw.githubusercontent.com/nochinsky/pi-config/main/INSTALL.md).

Prefer doing it yourself? See [manual installation](#manual-installation).

## What you get

### Appearance and defaults

- Pi's built-in **dark** theme, native tool rendering, and native status bar.
- No startup header or loaded-resource listing; **thinking blocks stay visible**.
- True color enabled, terminal-tab progress disabled, and Pi's drawn cursor.
- OpenAI as the provider, with `gpt-6-luna` as the default model.
- Model cycling through `gpt-6-astra`, `gpt-6-luna`, and `gpt-6.1-sol`.
- High thinking by default; Luna overrides it to **max**, the other two to high.
- Project trust prompts enabled and install telemetry disabled.

These are personal model preferences, not a guarantee that your account supports
those model IDs. The agent should help you choose available alternatives if
needed. You authenticate locally through Pi; no credentials are included here.

Choose `system`, `dark`, or `light` in `/settings` if you prefer another theme.
There are no local custom UI extensions or themes in this config.

### Extensions

| Package | Purpose |
| --- | --- |
| [pi-web-access](https://www.npmjs.com/package/pi-web-access) | Web search and fetching, configured to use OpenAI |
| [rpiv-ask-user-question](https://www.npmjs.com/package/@juicesharp/rpiv-ask-user-question) | Interactive questions, multi-select, custom answers, and previews |
| [rpiv-todo](https://www.npmjs.com/package/@juicesharp/rpiv-todo) | A `todo` tool, `/todos`, and a live task panel |
| [rpiv-btw](https://www.npmjs.com/package/@juicesharp/rpiv-btw) | `/btw <question>` side answers outside the main transcript |
| [pi-subagents](https://www.npmjs.com/package/pi-subagents) | On-demand delegation to child agents |

Side questions and subagent runs make additional model calls. Subagents do not
start reviews automatically. The question extension replaces the old
`pi-questions` package.

### Working preferences

[agent/AGENTS.md](agent/AGENTS.md) asks Pi to inspect before editing, finish
requested work, preserve unrelated changes, verify results, protect secrets,
and ask before consequential actions. Existing user instructions should be
merged deliberately rather than silently replaced.

## Updates

All five extension sources are **unpinned** so installs and updates use the
latest published releases. Follow Pi's update notifications and run the command
for what you want to update:

```bash
pi update                 # Pi itself
pi update --extensions    # Extensions only
pi update --all           # Pi and extensions together
```

If another package manager manages Pi, update Pi through that manager instead;
Pi can still update its extensions. Restart Pi after installing or updating.
There is no background updater or update-on-launch wrapper in this config.

The npm lockfile is a recorded dependency snapshot, not the update policy or a
requirement to keep those versions. Normal installation uses Pi's package
manager, not `npm ci`. Extensions manage their own internal dependencies; this
config does not force an MCP SDK version.

Editing this repo does not automatically sync an existing Pi installation.
Ask your agent to apply the updated config using [INSTALL.md](INSTALL.md).

## Manual installation

Install the current Pi release using its [official instructions](https://pi.dev),
then clone this repo. Use a Node.js version supported by that Pi release and the
extensions; check their current requirements rather than a fixed version here.

### Fresh setup

From the repository root, run the following POSIX shell snippet. It **refuses to
overwrite an existing agent directory**. It installs the latest releases of the
configured extensions through Pi's package manager.

```bash
(
  set -eu
  umask 077
  agent_dir="${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}"
  if [ -e "$agent_dir" ] || [ -L "$agent_dir" ]; then
    printf '%s\n' "Existing Pi directory: $agent_dir. Use INSTALL.md to back up and merge instead." >&2
    exit 1
  fi
  mkdir -p "$agent_dir/npm"
  cp agent/settings.json agent/AGENTS.md agent/web-search.json "$agent_dir/"
  cp agent/npm/package.json agent/npm/.npmrc "$agent_dir/npm/"
  export PI_CODING_AGENT_DIR="$agent_dir"
  pi update --extensions
  pi list
  (cd "$agent_dir/npm" && npm ls --depth=0)
)
```

Start Pi, run `/login` if needed, and select an available model through `/model`
if the configured default is unavailable. Authentication and model calls are
not part of the shell snippet. On Windows, use the same file layout and the
merge procedure in [INSTALL.md](INSTALL.md) with native shell commands.

### Existing setup or upgrade

Follow [INSTALL.md](INSTALL.md): back up affected files outside the checkout,
merge the configuration, and install the declared packages. Do not run `npm ci`
over an existing custom npm setup without reviewing what it would replace.

Older versions of this repo included `extensions/compact-tools.ts`,
`extensions/minimal-footer.ts`, and `themes/minimal-dark.json`. Back up and retire
only those legacy resources if present; do not delete unrelated extensions.

## Files

- [agent/settings.json](agent/settings.json) — portable preferences and packages
- [agent/AGENTS.md](agent/AGENTS.md) — instructions for the installed Pi agent
- [agent/web-search.json](agent/web-search.json) — OpenAI web-search defaults
- [agent/npm/](agent/npm/) — unpinned npm dependencies, peer-install setting, and snapshot lockfile
- [INSTALL.md](INSTALL.md) — installation instructions for agents and humans

> Extensions run with your user permissions. Review the config and packages
> before installing. Never copy your full `~/.pi/agent` into this repo: it can
> contain credentials and session history.
