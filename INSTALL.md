# Install pi-config

Use this checklist only when the user asks to install or apply the config.
Editing or cloning the repo alone is not permission to change their Pi setup.

## 1. Inspect

- Read [README.md](README.md) and the payload: [settings](agent/settings.json),
  [instructions](agent/AGENTS.md), [web config](agent/web-search.json), and the
  manifest, lockfile, and `.npmrc` in [agent/npm/](agent/npm/). When fetching files,
  use one repository revision; preserve existing checkout changes.
- Check Pi, Node.js, and npm against current package requirements. Ask before
  installing system-wide tools or upgrading Pi; use its official install guide.
- Target `PI_CODING_AGENT_DIR` if set, otherwise `~/.pi/agent`—not a project's
  `.pi` directory. Confirm custom targets, inspect symlinks, and ask before
  writing outside the agreed target.
- Inspect existing settings, instructions, and package declarations without
  exposing secrets. Summarize changes and resolve material conflicts, including
  unavailable models, provider choices, pins, and customized instructions.

## 2. Back up

- Before writing, back up affected files and legacy resources outside the checkout
  in a private, timestamped directory. Include affected npm manifests, lockfile,
  and `.npmrc`; record newly created paths. Stop if the backup fails.
- Leave credentials, sessions, custom endpoints, MCP config, keybindings, and
  unrelated resources in place. Never copy a live agent directory into this repo.

## 3. Merge

- For a fresh setup, copy the settings, instructions, and web config into the
  agent directory. Otherwise merge nested settings and web config by key, preserving
  unrelated values. Merge global instructions deliberately; check whether
  `AGENTS.override.md` masks them.
- Deduplicate npm package sources by package name, regardless of version. Keep
  this config's sources unpinned; preserve unrelated packages and resource filters.
  Ask before changing conflicting pins, filters, or exclusions.
- Check model availability with `pi --list-models`; catalog presence does not
  guarantee account access. Agree on alternatives when needed, adapting the
  default, cycling list, thinking overrides, and web provider together.
- Let the user authenticate through `/login`. Do not request secrets in chat or
  make billable model calls as an installation test.

## 4. Install extensions

- Copy the npm manifest and `.npmrc` into the target's `npm/` directory on a fresh
  setup. Otherwise merge dependencies and npm settings, retaining the user's
  lockfile and unrelated overrides.
  Keep `legacy-peer-deps=true`; let extensions manage their internal dependencies.
- Install each source from `settings.json` with `pi install <source>`, using the
  same agent directory throughout. This resolves current releases; do not restore
  the repo's snapshot lockfile or copy `node_modules`.
- On a fresh setup with only this config's sources declared,
  `pi update --extensions` can install them together. On existing setups, target
  requested sources individually to avoid updating unrelated packages.

## 5. Verify and hand back

- Parse the written JSON and check that unrelated settings survived and repeated
  installation will not duplicate packages or instruction text.
- Run `pi list` for the chosen agent directory and `npm ls --depth=0` inside its
  `npm/` directory. Resolve errors; confirm the intended defaults and packages.
- Report the target, backup, changes, installed versions, and pending login or
  restart steps. After restart, check `/settings`, `/model`, `/todos`, and the
  question UI; distinguish file checks from interactive testing.
- Roll back only affected files and newly created paths, reconcile dependencies,
  and restart. A config backup alone does not restore old package binaries.

## Upgrading an older copy

After backup, retire only this repo's old `extensions/compact-tools.ts`,
`extensions/minimal-footer.ts`, and `themes/minimal-dark.json`, removing stale
references. Replace `pi-questions` with `@juicesharp/rpiv-ask-user-question` and
remove the old repo-added MCP SDK override. Ask before changing customized
versions; preserve unrelated resources and overrides.
