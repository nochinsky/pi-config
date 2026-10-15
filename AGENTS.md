# Repository guidance

This repository distributes a personal Pi configuration. `agent/AGENTS.md` is
an installable payload for Pi, not the installation guide for this checkout.

- When asked to install or apply this config, read `README.md` and `INSTALL.md`
  completely and follow the inspect/backup/merge/verify procedure there.
- A clone or a repository-editing task alone is not permission to change the
  user's active Pi setup. Install only when the user requests it.
- Preserve existing local changes. Keep configuration portable; never copy a
  whole live agent directory, credentials, sessions, device IDs, or backups here.
- When editing configuration, update relevant documentation and verify JSON,
  package/lockfile consistency, and `git diff --check`.
- Do not commit or push unless the user requests it.
