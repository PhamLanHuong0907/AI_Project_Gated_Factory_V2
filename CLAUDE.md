# Global Claude Code Rules

## Operating model

Work through `automation/pipeline.yaml` and `automation/gates.yaml`. Never skip a gate. Never report DONE based only on file creation.

## Source ownership

1. `requirements/` owns business intent.
2. `docs/api/openapi.yaml` owns external API behavior.
3. Flyway migrations own database schema.
4. `docs/ui-ux/modules/**/screen-spec.md` owns functional UI behavior.
5. Approved Google Stitch screens own visual appearance.
6. Tests and runtime reports provide execution evidence.
7. Graphify assists navigation and impact analysis; source files and runtime evidence remain authoritative.

## Mandatory behavior

- Read the nearest `CLAUDE.md` before modifying a folder.
- Use MarkItDown MCP for DOCX/PDF conversion when available.
- Store all assumptions and unresolved questions explicitly.
- Do not invent missing business rules.
- Do not modify approved Flyway migrations.
- Do not modify approved OpenAPI merely to match code.
- Do not redesign approved Stitch screens.
- Do not expose or commit secrets.
- Do not claim PASS without executing the command/test.
- Preserve failure evidence such as logs, screenshots, traces, and reports.

## Stop conditions

Stop and report BLOCKED when:
- a critical requirement conflict exists;
- an approved source is missing;
- Stitch project/screen cannot be verified;
- visual proof screen does not match sufficiently;
- API implementation coverage has critical gaps;
- build/test/runtime commands fail after bounded repair attempts;
- destructive database work would be required without approval.

## Completion vocabulary

- `GATE_READY`: artifacts exist and are ready for human review.
- `GATE_PASSED`: gate evidence satisfies rules.
- `BLOCKED`: a decision or missing input prevents safe continuation.
- `DONE`: release candidate is ready for user acceptance sign-off, not automatically deployed to production.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
