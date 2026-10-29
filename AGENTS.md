# Repository guidance

This repo distributes a personal Pi configuration. `agent/AGENTS.md` is the
installable payload, not guidance for editing this checkout.

- Read `README.md` completely before installing. Use its warn/confirm/backup/
  replace/verify procedure: clean replacement, never merge old plugins or settings.
- Require explicit confirmation after explaining what will be removed. Preserve
  credentials, session history, and Pi's own runtime; verify a private backup first.
- Cloning or editing this repo does not authorize changing the active Pi setup.
- Preserve checkout changes. Never commit credentials, sessions, backups, machine
  paths, installed dependencies, or generated lockfiles.
- Keep docs in `README.md`; avoid duplicate guides. Run
  `node scripts/check-config.mjs` and `git diff --check` after edits.
- Do not commit or push unless requested.
