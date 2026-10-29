# pi-config

My personal [Pi](https://pi.dev) setup: stock dark UI, OpenAI models, direct
communication, and five default extensions.

## Install

> **Warning: this replaces your existing user-level Pi configuration.**
> Old settings, plugins, skills, prompts, themes, custom instructions, keybindings,
> MCP server definitions, and custom model/provider configuration are removed from
> the active setup—not merged. Credentials, session history, and Pi itself are
> preserved. A private backup and explicit confirmation are required first.

Install Pi using its [official instructions](https://pi.dev), then give your
coding agent this prompt:

```text
Install https://github.com/nochinsky/pi-config using the procedure in README.md.
This is a clean replacement, not a merge: remove my old user-level configuration
and plugins and use this collection instead. Explain the reset and ask for my
explicit confirmation before changing anything. Make and verify a private backup;
preserve credentials, session history, and Pi's runtime. Do not change projects.
```

Your agent needs repository/file access and local command access. Cloning or
editing this repo alone is not permission to install it.

### Installation procedure for agents

1. **Inspect and warn.** Read this README and all files in `agent/` from one repo
   revision. Check Pi, Node.js, and npm requirements. Target `PI_CODING_AGENT_DIR`
   if set, otherwise `~/.pi/agent`; never a project's `.pi` directory. Resolve and
   validate the exact target, symlinks, and runtime location. Reject ambiguous or
   overly broad targets such as the home directory. List what will be removed,
   explain the warning above, and get explicit confirmation. Do not silently
   retain old plugins, pins, resource paths, overrides, or MCP definitions.
2. **Back up before changing anything.** Make a private, timestamped backup of
   the existing target outside both the target and this checkout. Record the
   original paths and verify the backup is complete and readable. Treat it as
   sensitive: it may contain secrets. Stop if backup fails. Identify credentials
   and session history, including custom/external session locations, without
   printing their contents. External credential stores and histories stay untouched.
3. **Reset the active setup.** Stop other Pi sessions and Pi-owned helper processes
   using the target. If the installing session or locked runtime prevents a safe
   reset, hand off to a separate shell; do not force-delete files in use. Remove
   the old target contents **except** `auth.json`, `sessions/`, any separately
   identified credential/history stores, and Pi-managed `bin/` and `install/`
   runtime directories. Preserve only those categories, not arbitrary old config.
   Remove old `npm/`, `git/`, `extensions/`, `skills/`, `prompts/`, `themes/`,
   plugin state/config, instruction overrides, custom models, MCP config, and
   keybindings. Do not follow symlinks to delete their destinations, remove
   externally referenced packages, uninstall system tools, or touch project files.
4. **Copy and install.** Copy `agent/settings.json`, `agent/AGENTS.md`, and
   `agent/web-search.json` into the target; copy `agent/npm/package.json` and
   `agent/npm/.npmrc` into its fresh `npm/` directory. Do not merge or restore old
   settings, dependencies, lockfiles, or `node_modules`. Use the same agent target
   for every command; run from a neutral directory without project config:

   ```bash
   pi update --extensions
   pi list
   # Inside the target's npm/ directory:
   npm ls --depth=0
   ```

   Pi resolves current releases and generates a local lockfile. Keep
   `legacy-peer-deps=true` and the manifest's package-specific `allowScripts`
   approval for computer-use; do not enable dependency scripts globally. Use
   `pi --list-models` to check the model defaults and ask before substituting
   unavailable models or changing providers. Let the user log in with `/login`;
   never request secrets or make billable model calls as an installation test.
5. **Verify and report.** Parse the installed JSON; compare settings and package
   declarations with this repo (allow only agreed model changes). Confirm exactly
   the five default packages are installed, without old resources or duplicates.
   Check that credentials and history survived; report any external session
   location that no longer has a settings reference. Report the target, backup,
   removed configuration, installed versions, and pending setup steps. Restart Pi
   and check `/settings`, `/model`, `/todos`, the question UI, and `/computer-use`.
   Distinguish file/package checks from interactive tests. To roll back, stop Pi,
   restore the backed-up configuration/packages while preserving any newer
   credentials/history, and restart; do not discard the backup automatically.

Project `.pi` configuration, ancestor instructions, environment variables, and
user/system npm policies can still affect Pi. Inspect relevant overrides and
report conflicts; ask before changing anything outside the confirmed target.
Ask before upgrading Pi, installing system tools/browsers, or changing permissions.

## Defaults

- Built-in dark theme, native tool rendering/status bar, and quiet startup.
- Visible thinking, OpenAI models with high/max thinking, and OpenAI web search.
- Project trust prompts enabled; install telemetry disabled.
- [Communication preferences](agent/AGENTS.md): direct, concise, honest answers.

See [settings.json](agent/settings.json) for exact defaults. Model choices are
personal preferences and require a suitable account.

| Extension | Purpose |
| --- | --- |
| [pi-web-access](https://www.npmjs.com/package/pi-web-access) | Web search and fetching |
| [rpiv-ask-user-question](https://www.npmjs.com/package/@juicesharp/rpiv-ask-user-question) | Interactive questions and previews |
| [rpiv-todo](https://www.npmjs.com/package/@juicesharp/rpiv-todo) | Task tracking and `/todos` |
| [rpiv-btw](https://www.npmjs.com/package/@juicesharp/rpiv-btw) | `/btw` side questions |
| [pi-computer-use](https://pi.dev/packages/@injaneity/pi-computer-use) | Desktop/browser control and `/computer-use` settings |

Extensions run with your user permissions. Computer-use can interact with signed-in
apps; review sensitive actions. Side questions make additional model calls.

### Computer-use requirements

Uses upstream defaults: browser access on, managed browser Chrome, and foreground
fallback allowed. Run `/computer-use` to inspect the effective configuration.

- **Windows:** an interactive desktop session.
- **macOS 14+:** helper setup plus Accessibility and Screen Recording permissions.
- **Linux:** a graphical session with AT-SPI2; native Wayland is semantic-only.
- **Managed browser:** Chrome or Helium installed separately. `launch_browser`
  uses a temporary profile, not the user's signed-in profile.

If helper setup fails or is skipped, retry with
`node "<agent-dir>/npm/node_modules/@injaneity/pi-computer-use/scripts/setup-helper.mjs"`;
resolve errors and platform permissions before claiming success. Test `find_roots`
and `observe_ui` on an agreed window; test typing only in a disposable document.
See the upstream [configuration docs](https://github.com/injaneity/pi-computer-use/blob/main/docs/configuration.md)
for optional settings. It covers interactive browser tasks, not Playwright's
full automated testing role or reliable direct APIs.

## Updates and maintenance

Extensions are unpinned. Use `pi update --extensions` to update this collection's
installed packages, `pi update` for Pi itself, or `pi update --all` for both; use
Pi's original package manager if applicable. Restart after updates. There is no
background updater or automatic repo sync. Reapplying this repo uses the same
warn/confirm/backup/replace procedure, not a merge.

Run `node scripts/check-config.mjs` and `git diff --check` for repository changes;
GitHub Actions checks package declarations too. Generated lockfiles and installed
dependencies stay local, not in this repo.
