# Install pi-config

This guide is for a coding agent acting on a user's request to install
[nochinsky/pi-config](https://github.com/nochinsky/pi-config), and for people
merging it manually. Read it completely before changing anything.

## 1. Establish the source and scope

- If given the GitHub URL, fetch the README, this guide, and the referenced
  configuration files. A clone is usually easiest; use a new directory, not an
  existing checkout with unrelated work. Never execute commands copied from an
  unreviewed page or run a remote script just because a README mentions it.
- For a URL-only workflow, GitHub's raw files are under
  `https://raw.githubusercontent.com/nochinsky/pi-config/main/`. Fetch actual
  JSON/text files, not GitHub's HTML rendering. Resolve a single commit and use
  it for all files so an upstream update cannot mix different revisions.
- If already in a clone, inspect its status and use that checkout. Preserve
  uncommitted work; do not reset, pull over changes, or switch branches silently.
- Read `agent/settings.json`, `agent/AGENTS.md`, `agent/web-search.json`,
  `agent/npm/package.json`, `agent/npm/package-lock.json`, and `agent/npm/.npmrc`.
  These files, not hardcoded copies in this guide, define the intended config.
- A setup request authorizes local configuration work, not publishing anything,
  broad machine changes, or removing unrelated user resources. Respect the
  installing harness's own permissions and approval rules.

## 2. Inspect prerequisites and the target

- Check the OS, shell, `pi --version`, `node --version`, and npm availability.
  This config follows current Pi and extension releases rather than a fixed Pi
  version. Check the installed Pi help/docs and current package requirements for
  supported Node.js versions, commands, and settings. If an older Pi is
  incompatible, explain the conflict and ask before upgrading it.
- If Pi or a supported Node.js is missing, explain the prerequisite and ask
  before installing system-wide tools. Follow Pi's
  [official installation instructions](https://pi.dev); do not silently replace
  a package-manager-managed Pi install or upgrade an existing one.
- Resolve the actual agent directory: `PI_CODING_AGENT_DIR` if set, otherwise
  `~/.pi/agent`. Confirm a custom target with the user. Do not confuse it with a
  project's `.pi` directory. Run package commands with that same agent directory.
- Inspect existing settings, relevant resources, instructions, and npm manifests
  without printing secrets. Do not dump credential files, environment variables,
  npm auth tokens, or session history. Identify symlinks before writing through
  them; ask before modifying targets outside the agreed directory.
- Summarize what will change: visual preferences, models, global working
  instructions, web provider, and five third-party packages. Extensions execute
  with the user's permissions. Side questions and subagents can incur model
  usage; setup should not launch them or make test model calls.
- Ask only about material unresolved choices: conflicting settings or package
  filters, model availability, different providers, and existing customizations.
  Do not ask for approval for every routine file operation.

## 3. Back up before writing

- Create a unique, timestamped backup **outside this checkout**, with access
  restricted to the user. Record its location without copying it into the repo.
- Back up each existing file you will change and any legacy resource you will
  retire. Include affected npm manifests, lockfile, and `.npmrc`. Record which
  files/directories did not exist so rollback can distinguish new files.
- Preserve credentials, sessions, custom models/endpoints, MCP configuration,
  keybindings, other resources, and unrelated settings in place. Do not copy or
  inspect them unnecessarily. Never put authentication or machine identity into
  tracked config files.
- Stop if a backup fails. For rollback, restore only affected files from the
  backup, remove only files created by this installation, reconcile dependencies
  with the restored manifest, and restart Pi. Do not delete the whole agent
  directory or promise that config backups restore old package binaries.

## 4. Apply portable configuration

### Settings

On a fresh installation, use `agent/settings.json` as the starting point. On an
existing installation, merge it into the user's settings:

- Apply this repo's preferences for keys it declares, unless the user chooses to
  keep a conflicting value. Preserve keys not declared here.
- Merge nested objects by key; do not replace all of `terminal`,
  `modelThinkingLevels`, or `warnings` and lose unrelated entries.
- Merge `packages` by package identity, not by whole string. For npm sources,
  the identity is the package name without its version. Avoid duplicates across
  pinned and unpinned forms. Preserve unrelated packages and object-form resource
  filters; ask before changing a conflicting pin, filter, or explicit exclusion.
- This config's five package sources are deliberately unpinned. Keep them
  unpinned when adopting these defaults so `pi update --extensions` can update
  them. Do not add a background updater.
- Do not import device IDs, changelog state, credentials, or session metadata.

### Models and authentication

The OpenAI model IDs in this repo are the author's preferences. They may not be
available to the recipient. Inspect `pi --list-models` and any existing model
configuration without exposing credentials. Catalog presence does not prove
account access. If models are absent, inaccessible, or uncertain, ask which
provider and model to use rather than inventing a substitute. Adapt the default,
cycling list, and per-model thinking overrides together. Do not overwrite custom
endpoint definitions or claim high/max thinking is supported by every model.

Let the user authenticate through Pi's `/login`. Do not request pasted secrets
in chat, print resolved keys/tokens, or make billable model calls as an install
test. If authentication needs user interaction, finish the safe file work and
clearly report that step as pending.

### Instructions and web access

- Install `agent/AGENTS.md` on a fresh setup. With existing user instructions,
  merge intentionally and resolve contradictory preferences with the user;
  never silently replace their global instructions. Check for instruction
  overrides such as `AGENTS.override.md` that could mask the installed file.
- Merge `agent/web-search.json` by key, preserving unrelated configuration and
  secrets. Its default search provider is OpenAI. If the user does not use
  OpenAI, discuss a compatible web-search choice rather than leaving a knowingly
  unusable provider or fabricating extension settings.

### Legacy resources

Old versions of this config used:

- `extensions/compact-tools.ts`
- `extensions/minimal-footer.ts`
- `themes/minimal-dark.json`
- The npm package `pi-questions`, replaced by `@juicesharp/rpiv-ask-user-question`

If present, inspect whether these are the old repo resources or customized user
files. After backup, retire the old repo resources and remove their stale
settings references. Ask before retiring modified user versions. Remove the old
`pi-questions` declaration/dependency when adopting its replacement, preserving
unrelated package entries. Never clear entire extensions or themes directories.

## 5. Install dependencies

For a fresh setup, copy the repo's npm manifest and `.npmrc` into the agent
directory's `npm/` folder, without seeding it with the repo's snapshot lockfile.
For an existing setup, merge the five direct npm dependencies from
`agent/npm/package.json`, preserve unrelated dependencies, and retain the existing
lockfile for npm/Pi to reconcile. Do not copy the repo's lockfile over a customized
dependency tree.

Retain the repo's `legacy-peer-deps=true` npm setting without discarding other
npm settings. Extensions manage their own internal dependencies; do not add a
root `@modelcontextprotocol/sdk` override. If an existing SDK override came from
an older version of this repo, back it up and remove it. Preserve unrelated
overrides and ask about customized constraints. The SDK may remain installed as
an extension dependency; do not uninstall it from that dependency tree. Never
copy `node_modules` from the checkout.

Install each of the five sources declared in `agent/settings.json` using Pi's
package manager, for example:

```bash
pi install npm:pi-web-access
```

Use the actual configured sources after resolving user choices. Installing
unpinned sources resolves current releases, not necessarily the versions in the
repo lockfile. Check the resulting Pi declarations, npm manifest, and lockfile;
Pi/npm may rewrite dependency ranges, but Pi's package sources must stay
unpinned. Do not run a blanket update of unrelated user packages.

On a fresh setup with only this config's five sources declared,
`pi update --extensions` also installs their latest releases; this is the
[README's manual path](README.md#manual-installation). On an existing setup,
install or update the requested sources individually to avoid updating unrelated
user packages.

The repo lockfile is a recorded snapshot, not the normal installation policy.
Only if the user explicitly requests that snapshot, copy it with the matching
manifest and `.npmrc` into a fresh `npm/` directory and run
`npm ci --ignore-scripts`. Do not use `npm ci` over a customized existing tree
without review: it replaces `node_modules`.

## 6. Verify and hand back

- Parse the written JSON and check that no existing unrelated settings or
  package declarations were lost. Re-running setup should not duplicate entries
  or continually append the same instruction text.
- Run `pi list` for the chosen agent directory. Confirm all five requested
  sources are present without version pins, along with retained user packages.
- Run `npm ls --depth=0` in that directory's `npm/` folder. Investigate failures;
  do not hide them or weaken checks to claim success.
- Confirm dark theme, quiet startup, visible thinking, and the selected model
  settings. Check that the retired legacy resources are no longer loaded.
- Tell the user to restart Pi after package installation. In the restarted
  session, they can check `/settings`, `/model`, `/todos`, and the question UI.
  Distinguish file/package verification from an actual interactive smoke test.
- Report the target directory, backup location, changes, installed versions,
  any model substitutions, and pending login/restart steps. Do not claim the
  setup is fully working if authentication or compatibility is unresolved.

Installing this config does not link it for automatic synchronization with this
repo. Future changes can be applied with this same inspect/backup/merge process.
Follow Pi's update notifications: `pi update` updates Pi itself,
`pi update --extensions` updates extensions, and `pi update --all` updates both.
If Pi is managed by another package manager, use that manager for Pi itself.
Updates are explicit, not unattended; restart Pi afterward.
