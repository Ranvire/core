# Changelog

All entries follow `docs/CHANGELOG_POLICY.md`.

## Unreleased

### Drift / Modernization
- Summary:
  - Replaced RanvierMUD's `sty` dependency with a homegrown color tag parser.
  - Added an explicit pre-load guard for `Config.get` with a dedicated error type.
- Why:
  - Reduce dependency surface and align color parsing with engine-specific needs.
  - Prevent ambiguous null access errors and make config lifecycle violations explicit.
- Impact:
  - Downstream code that relied on `sty` behaviors should use the core color tag parser instead.
  - Callers invoking `Config.get` before `Config.load` now receive a clear error instead of a generic runtime failure.
- Migration/Action:
  - Update downstream logging or formatting to use the core color tag format where applicable.
  - Ensure `Config.load` is called before any `Config.get` usage.
- References:
  - None.
