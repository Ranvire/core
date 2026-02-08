# Ranvire Engine ("`core`")

Actual core engine code for [Ranvire](https://github.com/Ranvire) game engine which is a maintenance and stewardship fork of  [RanvierMUD](https://ranviermud.com).

The 1.0 release is intended to be a **pure maintenance upgrade**: updating the runtime to modern Node.js, adding CI via GitHub Actions, fixing long-standing crashes and sharp edges, and restoring a reliable out-of-the-box experience. There is no engine redesign and no intentional change to the core architecture.

## 1.0 Maintenance Checklist (core)

This checklist is scoped to the `Ranvire/core` engine only. It focuses on a **pure maintenance upgrade**: modern Node.js compatibility, CI, dependency hygiene, and sharp‑edge fixes. There is no redesign, no API‑breaking changes, and no assumptions about `ranviermud`, datasources, or bundles.

### Modernization

#### Runtime & Tooling

* [x] Node runtime target set to `>=22` in `package.json` (`engines.node`).
* [x] `.nvmrc` pins Node `v22.21.1` for local dev parity.
* [x] CommonJS module format retained (`index.js` + `require-dir`, no `type: "module"`).
* [x] Lockfile v3 present (`package-lock.json`).
* [x] `npm test` script defined (mocha + c8).
* [x] GitHub Actions CI present.
* [x] CI installs via `npm ci`.
* [x] CI currently runs on Node 22.
* [ ] Add Node 18 to CI matrix for transition coverage.
* [ ] Remove or update legacy `.travis.yml` (still targets Node 10).
* [ ] Add a lint step or remove unused lint configs (`.eslintrc`, `.jshintrc`) to avoid confusion.

#### Dependencies & Security Hygiene

* [ ] Audit and modernize legacy dependencies (e.g., `winston@2`, `js-yaml@3`, `wrap-ansi@2`) with compatibility tests.
* [ ] Make `longjohn` optional and gated behind an explicit opt‑in for Node 22 safety.
* [ ] Add non‑blocking `npm audit` reporting in CI (artifact or summary).

#### Packaging & Distribution

* [x] `main` points to `index.js` (require‑dir export surface preserved).
* [x] Entry point remains CommonJS and stable.
* [ ] Fix `.npmignore` to include `README.md` (currently only `README.mkd` is whitelisted).
* [ ] Add an explicit `files` whitelist in `package.json` (or equivalent) to ensure publish contents are correct and stable.
* [ ] Document that `require-dir('./src/')` exposes all `src/*` modules as public API.

#### CI & Quality Gates

* [x] Unit test framework present (mocha) with coverage tooling (c8).
* [x] Unit tests exist in `test/unit` for utility modules.
* [ ] Add targeted tests for core subsystems (BundleManager, EntityLoader, registries, GameServer events).
* [ ] Add coverage reporting/thresholds in CI (current CI runs tests only).
* [ ] Add a lightweight `npm pack` smoke step to ensure publish artifacts are correct.

#### Documentation

* [x] README states “pure maintenance upgrade” intent.
* [ ] Document supported Node versions (22 now, 18/22 during transition).
* [ ] Document core‑only scope, extension points, and public API surface (Config, Logger, BundleManager, EntityLoader, GameServer).
* [ ] Document sharp edges and failure modes (Config load order, BundleManager exit paths, EventManager detach behavior).

---

#### Stability & Error Handling

* [ ] Replace `process.exit(0)` in `BundleManager` error paths with thrown errors or non‑zero exit codes (library should not hard‑exit).
* [ ] Log loader errors in `loadQuests` instead of swallowing them silently.
* [ ] Add bundle/area/entity context to warnings for missing scripts or invalid entity data.
* [ ] Guard `Config.get` against being called before `Config.load` (clear error or safe fallback).
* [ ] Improve error messages in `Data.saveFile`/`Data.parseFile` with full path and action context.
* [ ] Detect missing loader registry entries (`areas`, `help`, etc.) early with explicit errors.

#### DX & Maintainability

* [ ] Add unit tests for `DataSourceRegistry.load` and `EntityLoaderRegistry.load` validation rules.
* [ ] Add unit tests for `EntityLoader` method gating and error messages.
* [ ] Add tests for `BundleManager.loadBundles(distribute=false)` and `_getLoader` function‑module compatibility.
* [ ] Add tests for `EventManager.attach`/`detach` semantics and the “removeAllListeners” warning edge.
* [ ] Consolidate bundle path building in `BundleManager` to reduce string‑concat drift.
* [ ] Align async/sync usage in loader code paths where practical (document or test expectations).

#### Performance Footguns

* [ ] Document expected sync filesystem usage in bundle loading and data utilities (so consumers know it’s sync by design).
* [ ] Consider memoizing computed script paths in `BundleManager` to reduce repeated string work in hot loops.
* [ ] Avoid unnecessary `fs.statSync` calls when file lists are already known (small win, easy change).

## Developing

* Have a checkout of the normal ranviermud repo
* Have a checkout of this repo adjacent to it
* In this repo run npm install then `npm link` (might need `sudo`)
* Go back to the other repo and run `npm link ranvier`

Now any changes you make in this repo will automatically be available inside your ranvier project. Any time you do `npm
install` or `npm update` in your ranviermud repository you'll have to re-run `npm link ranvier` to re-establish the link.
